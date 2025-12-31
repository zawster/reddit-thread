from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps
from app.core import security

router = APIRouter()

@router.post("/", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this user name already exists in the system.",
        )
    user_by_username = db.query(models.User).filter(models.User.username == user_in.username).first()
    if user_by_username:
         raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
        
    user = models.User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_superuser=user_in.is_superuser,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.get("/{username}", response_model=schemas.User)
def read_user_by_username(
    username: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get user by username.
    """
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{username}/posts", response_model=List[schemas.Post])
def read_user_posts(
    username: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 20,
) -> Any:
    """
    Get posts by a user.
    """
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    posts = db.query(models.Post).filter(models.Post.author_id == user.id).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    
    # Enrichment loop (copied from posts search/list)
    from sqlalchemy import func
    for post in posts:
        post.upvotes = db.query(func.count(models.Vote.id)).filter(models.Vote.post_id == post.id, models.Vote.value == 1).scalar()
        post.downvotes = db.query(func.count(models.Vote.id)).filter(models.Vote.post_id == post.id, models.Vote.value == -1).scalar()
        post.user_vote = None
        
    return posts

