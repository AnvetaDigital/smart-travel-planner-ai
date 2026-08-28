from dotenv import load_dotenv
import os

load_dotenv()


def _get_bool(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in ("1", "true", "yes")


def _get_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except ValueError:
        return default


class Settings:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    # Auth
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = _get_int("ACCESS_TOKEN_EXPIRE_MINUTES", 15)
    REFRESH_TOKEN_EXPIRE_DAYS = _get_int("REFRESH_TOKEN_EXPIRE_DAYS", 7)

    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

    # Cookies / CORS
    COOKIE_SECURE = _get_bool("COOKIE_SECURE", False)
    COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax")
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")


settings = Settings()