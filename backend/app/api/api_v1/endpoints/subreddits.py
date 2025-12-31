from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Subreddit])
def read_subreddits(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve subreddits.
    """
    subreddits = db.query(models.Subreddit).offset(skip).limit(limit).all()
    return subreddits

@router.post("/", response_model=schemas.Subreddit)
def create_subreddit(
    *,
    db: Session = Depends(deps.get_db),
    subreddit_in: schemas.SubredditCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new subreddit.
    """
    subreddit = db.query(models.Subreddit).filter(models.Subreddit.name == subreddit_in.name).first()
    if subreddit:
        raise HTTPException(
            status_code=400,
            detail="Subreddit with this name already exists.",
        )
    subreddit = models.Subreddit(
        **subreddit_in.dict(),
        owner_id=current_user.id
    )
    db.add(subreddit)
    db.commit()
    db.refresh(subreddit)
    return subreddit

@router.get("/{name}", response_model=schemas.Subreddit)
def read_subreddit_by_name(
    *,
    db: Session = Depends(deps.get_db),
    name: str,
) -> Any:
    """
    Get subreddit by name.
    """
    subreddit = db.query(models.Subreddit).filter(models.Subreddit.name == name).first()
    if not subreddit:
        raise HTTPException(status_code=404, detail="Subreddit not found")
    return subreddit
