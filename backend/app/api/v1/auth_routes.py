from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME, get_current_user
from app.models.user import User
from app.schemas.auth_schema import (
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    UserResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# The refresh cookie is scoped to the auth routes so it is not sent along with
# every trip/chat request.
REFRESH_COOKIE_PATH = "/api/v1/auth"


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        key=ACCESS_COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path=REFRESH_COOKIE_PATH,
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_COOKIE_NAME, path="/")
    response.delete_cookie(REFRESH_COOKIE_NAME, path=REFRESH_COOKIE_PATH)


@router.post("/register", response_model=UserResponse)
def register(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    user = AuthService.register(db, payload)
    _set_auth_cookies(response, *AuthService.issue_tokens(db, user))
    return user


@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = AuthService.authenticate(db, payload.email, payload.password)
    _set_auth_cookies(response, *AuthService.issue_tokens(db, user))
    return user


@router.post("/refresh", response_model=UserResponse)
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    user, access_token, refresh_token = AuthService.rotate_refresh(
        db, request.cookies.get(REFRESH_COOKIE_NAME)
    )
    _set_auth_cookies(response, access_token, refresh_token)
    return user


@router.post("/logout", response_model=MessageResponse)
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    AuthService.revoke(db, request.cookies.get(REFRESH_COOKIE_NAME))
    _clear_auth_cookies(response)
    return {"message": "Logged out"}


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return user
