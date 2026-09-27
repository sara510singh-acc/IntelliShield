from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.user import User
from app.routers.auth import router as auth_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="IntelliShield API",
    description="Secure Adaptive Authentication Platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "IntelliShield API is running"
    }
