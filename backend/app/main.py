from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.user import User
from app.routers import auth

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="IntelliShield API",
    description="Secure Adaptive Authentication Platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

app.include_router(auth.router, prefix="/auth")


@app.get("/")
def root():
    return {
        "message": "IntelliShield API is running"
    }
