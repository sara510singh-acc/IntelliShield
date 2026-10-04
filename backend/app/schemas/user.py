from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserRegister(UserCreate):
    pass


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    device_id: str | None = None
    user_agent: str | None = None
    ip_address: str | None = None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr


class LoginResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    access_token: str
    token_type: str = "bearer"
    risk_score: int
    risk_level: str
    requires_mfa: bool
    user: UserResponse
