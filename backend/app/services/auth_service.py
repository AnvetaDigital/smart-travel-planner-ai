from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    refresh_token_expiry,
    verify_password,
)
from app.models.user import RefreshToken, User
from app.schemas.auth_schema import RegisterRequest

# Deliberately identical for unknown email and wrong password so the endpoint
# cannot be used to enumerate registered accounts.
_INVALID_CREDENTIALS = "Incorrect email or password"


class AuthService:

    @staticmethod
    def register(db: Session, payload: RegisterRequest) -> User:
        email = payload.email.lower().strip()

        if db.query(User).filter(User.email == email).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )

        user = User(
            email=email,
            full_name=payload.fullName.strip(),
            hashed_password=hash_password(payload.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> User:
        user = db.query(User).filter(User.email == email.lower().strip()).first()

        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=_INVALID_CREDENTIALS,
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deactivated",
            )

        return user

    @staticmethod
    def issue_tokens(db: Session, user: User) -> tuple[str, str]:
        """Return (access_token, raw_refresh_token) and persist the refresh hash."""
        raw_refresh = generate_refresh_token()

        db.add(
            RefreshToken(
                user_id=user.id,
                token_hash=hash_refresh_token(raw_refresh),
                expires_at=refresh_token_expiry(),
            )
        )
        db.commit()

        return create_access_token(user.id), raw_refresh

    @staticmethod
    def rotate_refresh(db: Session, raw_token: str) -> tuple[User, str, str]:
        """Consume a refresh token and issue a fresh pair.

        Presenting an already-revoked token means it leaked and is being replayed,
        so every token for that user is revoked and the caller must log in again.
        """
        if not raw_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing refresh token",
            )

        stored = (
            db.query(RefreshToken)
            .filter(RefreshToken.token_hash == hash_refresh_token(raw_token))
            .first()
        )

        if not stored:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        if stored.revoked:
            AuthService._revoke_all_for_user(db, stored.user_id)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token reuse detected - please log in again",
            )

        if _as_utc(stored.expires_at) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has expired",
            )

        user = db.query(User).filter(User.id == stored.user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        stored.revoked = True
        db.commit()

        access_token, new_refresh = AuthService.issue_tokens(db, user)
        return user, access_token, new_refresh

    @staticmethod
    def revoke(db: Session, raw_token: str) -> None:
        """Best-effort logout - an unknown or absent token is not an error."""
        if not raw_token:
            return

        stored = (
            db.query(RefreshToken)
            .filter(RefreshToken.token_hash == hash_refresh_token(raw_token))
            .first()
        )

        if stored and not stored.revoked:
            stored.revoked = True
            db.commit()

    @staticmethod
    def _revoke_all_for_user(db: Session, user_id: int) -> None:
        db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.revoked.is_(False),
        ).update({"revoked": True})
        db.commit()


def _as_utc(value: datetime) -> datetime:
    """SQLite hands back naive datetimes; treat those as UTC."""
    return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
