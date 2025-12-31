from typing import Any, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from app.api import deps

router = APIRouter()

@router.get("/posts", response_model=List[schemas.Post])
def search_posts(
    db: Session = Depends(deps.get_db),
    q: str = Query(..., min_length=1),
    skip: int = 0,
    limit: int = 20,
) -> Any:
    """
    Search posts by title or content.
    """
    search_query = f"%{q}%"
    posts = db.query(models.Post).filter(
        (models.Post.title.ilike(search_query)) | 
        (models.Post.content.ilike(search_query))
    ).offset(skip).limit(limit).all()
    
    # Enrich with votes (copied from posts endpoint for now, ideally refactor to a helper)
    for post in posts:
        upvotes = db.query(func.count(models.Vote.id)).filter(
            models.Vote.post_id == post.id, models.Vote.value == 1
        ).scalar()
        downvotes = db.query(func.count(models.Vote.id)).filter(
            models.Vote.post_id == post.id, models.Vote.value == -1
        ).scalar()
        post.upvotes = upvotes
        post.downvotes = downvotes
        post.user_vote = None
        
    return posts

@router.get("/subreddits", response_model=List[schemas.Subreddit])
def search_subreddits(
    db: Session = Depends(deps.get_db),
    q: str = Query(..., min_length=1),
    skip: int = 0,
    limit: int = 20,
) -> Any:
    """
    Search subreddits by name or title.
    """
    search_query = f"%{q}%"
    subreddits = db.query(models.Subreddit).filter(
        (models.Subreddit.name.ilike(search_query)) | 
        (models.Subreddit.title.ilike(search_query))
    ).offset(skip).limit(limit).all()
    return subreddits
