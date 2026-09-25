from fastapi import FastAPI

from app.database import Base, engine
from app.models.user import User

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="IntelliShield API",
    description="Secure Adaptive Authentication Platform",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "IntelliShield API is running"
    }
