import secrets

import bcrypt

from app.config import settings


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def assess_login_risk(
    device_id: str | None,
    user_agent: str | None,
    ip_address: str | None,
) -> tuple[int, str, bool]:
    risk_score = 0

    if not device_id:
        risk_score += 25
    if not user_agent:
        risk_score += 10
    if not ip_address:
        risk_score += 15

    if ip_address:
        normalized_ip = ip_address.strip()
        if normalized_ip.startswith(("10.", "192.168.", "127.", "::1")):
            risk_score -= 15
        else:
            risk_score += 20

    if risk_score < 0:
        risk_score = 0

    if risk_score >= 70:
        risk_level = "high"
        requires_mfa = True
    elif risk_score >= 35:
        risk_level = "medium"
        requires_mfa = True
    else:
        risk_level = "low"
        requires_mfa = False

    return risk_score, risk_level, requires_mfa


def create_access_token(user_id: int, email: str, risk_score: int, risk_level: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "risk_score": risk_score,
        "risk_level": risk_level,
    }
    token_seed = (
        f"{settings.secret_key}:{user_id}:{email}:{risk_level}:{risk_score}:{secrets.token_urlsafe(16)}"
    )
    return f"intellishield.{payload['sub']}.{secrets.token_urlsafe(24)}.{token_seed[:32]}"
