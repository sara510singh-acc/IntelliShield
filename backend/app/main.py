from fastapi import FastAPI

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


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }