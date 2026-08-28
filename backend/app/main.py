from fastapi import FastAPI

from app.api.v1.auth_routes import router as auth_router
from app.api.v1.chat_routes import router as chat_router
from app.api.v1.trip_routes import router as trip_router
from app.core.config import settings
from app.core.database import Base, engine
from app.models import user as user_models  # noqa: F401  (registers the tables)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Smart Travel Planner API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_ORIGIN,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api/v1"
)

app.include_router(
    trip_router,
    prefix="/api/v1"
)

app.include_router(
    chat_router,
    prefix="/api/v1"
)

@app.get("/")
def health_check():
    return {"message": "Smart Travel Planner API Running"}