from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.security import hash_password


router = APIRouter()


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
