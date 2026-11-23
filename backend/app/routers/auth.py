
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import LoginResponse, UserCreate, UserLogin, UserResponse
from app.security import (
    assess_login_risk,
    create_access_token,
    hash_password,
    verify_password,
    verify_access_token
)


router = APIRouter()

bearer_scheme = HTTPBearer(auto_error=False)

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(user: UserCreate, db: Session = Depends(get_db)) -> User:
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
    )

    db.add(new_user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()

        if db.query(User).filter(User.email == user.email).first() is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered",
            )
        raise

    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=LoginResponse)
def login_user(
    user: UserLogin,
    request: Request,
    db: Session = Depends(get_db),
) -> LoginResponse:

    stored_user = db.query(User).filter(User.email == user.email).first()

    if stored_user is None or not verify_password(
        user.password,
        stored_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    device_id = user.device_id or request.headers.get("x-device-id")
    user_agent = user.user_agent or request.headers.get("user-agent")
    ip_address = user.ip_address or (
        request.client.host if request.client else None
    )

    risk_score, risk_level, requires_mfa = assess_login_risk(
        device_id,
        user_agent,
        ip_address,
    )

    if risk_level == "high":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="High-risk login detected. Access denied.",
        )

    if requires_mfa:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Additional authentication required before access can be granted.",
        )

    access_token = create_access_token(
        stored_user.id,
        stored_user.email,
        risk_score,
        risk_level,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "risk_score": risk_score,
        "risk_level": risk_level,
        "requires_mfa": requires_mfa,
        "user": stored_user,
    }

@router.get("/me", response_model=UserResponse)
def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = verify_access_token(credentials.credentials)
        user_id = int(payload["sub"])

    except (jwt.PyJWTError, KeyError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.get(User, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
        )

    return user