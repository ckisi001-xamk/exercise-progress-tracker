from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories import user as user_repo
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import UserRegister, UserLogin, TokenResponse
from app.models.user import User

def register_user(db: Session, payload: UserRegister) -> User:
    existing = user_repo.get_by_email(db, payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed = hash_password(payload.password)
    return user_repo.create(
        db, 
        email=payload.email, 
        password_hash=hashed, 
        display_name=payload.display_name
    )

def authenticate_user(db: Session, payload: UserLogin) -> TokenResponse:
    user = user_repo.get_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)
