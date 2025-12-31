from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from app.api import deps

router = APIRouter()

def get_post_with_votes(db: Session, post_id: int, user_id: Optional[int] = None):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        return None
    
    upvotes = db.query(func.count(models.Vote.id)).filter(
        models.Vote.post_id == post_id, models.Vote.value == 1
    ).scalar()
    
    downvotes = db.query(func.count(models.Vote.id)).filter(
        models.Vote.post_id == post_id, models.Vote.value == -1
    ).scalar()
    
    user_vote = None
    if user_id:
        vote = db.query(models.Vote).filter(
            models.Vote.post_id == post_id, models.Vote.user_id == user_id
        ).first()
        if vote:
            user_vote = vote.value
            
    # Attach to object (pydantic will pick it up)
    post.upvotes = upvotes
    post.downvotes = downvotes
    post.user_vote = user_vote
    return post

@router.get("/", response_model=List[schemas.Post])
def read_posts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 20,
    subreddit_id: Optional[int] = None,
    # current_user: Optional[models.User] = Depends(deps.get_optional_user) # We'll just skip optional for now
) -> Any:
    """
    Retrieve posts. Can filter by subreddit.
    """
    query = db.query(models.Post)
    if subreddit_id:
        query = query.filter(models.Post.subreddit_id == subreddit_id)
    
    posts = query.order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    
    # Enrich with votes (This is not very efficient for large lists, 
    # but okay for initial version - ideally use a join or aggregate query)
    for post in posts:
        upvotes = db.query(func.count(models.Vote.id)).filter(
            models.Vote.post_id == post.id, models.Vote.value == 1
        ).scalar()
        downvotes = db.query(func.count(models.Vote.id)).filter(
            models.Vote.post_id == post.id, models.Vote.value == -1
        ).scalar()
        post.upvotes = upvotes
        post.downvotes = downvotes
        post.user_vote = None # Handle user vote if token provided
        
    return posts

@router.post("/", response_model=schemas.Post)
def create_post(
    *,
    db: Session = Depends(deps.get_db),
    post_in: schemas.PostCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new post.
    """
    post = models.Post(
        **post_in.dict(),
        author_id=current_user.id
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return get_post_with_votes(db, post.id, current_user.id)

@router.get("/{id}", response_model=schemas.Post)
def read_post(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get post by ID.
    """
    post = get_post_with_votes(db, id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
