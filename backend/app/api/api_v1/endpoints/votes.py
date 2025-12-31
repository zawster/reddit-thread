from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.VoteResponse)
def vote(
    *,
    db: Session = Depends(deps.get_db),
    vote_in: schemas.VoteCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Vote for a post or comment. 
    If value is 0 or same as existing, remove vote.
    """
    if not vote_in.post_id and not vote_in.comment_id:
        raise HTTPException(status_code=400, detail="Must provide post_id or comment_id")

    # Find existing vote
    query = db.query(models.Vote).filter(models.Vote.user_id == current_user.id)
    if vote_in.post_id:
        query = query.filter(models.Vote.post_id == vote_in.post_id)
    else:
        query = query.filter(models.Vote.comment_id == vote_in.comment_id)
    
    existing_vote = query.first()

    if existing_vote:
        if existing_vote.value == vote_in.value or vote_in.value == 0:
            db.delete(existing_vote)
        else:
            existing_vote.value = vote_in.value
    else:
        if vote_in.value != 0:
            new_vote = models.Vote(
                user_id=current_user.id,
                post_id=vote_in.post_id,
                comment_id=vote_in.comment_id,
                value=vote_in.value
            )
            db.add(new_vote)
    
    db.commit()

    # Return new state
    count_query = db.query(func.count(models.Vote.id))
    if vote_in.post_id:
        upvotes = count_query.filter(models.Vote.post_id == vote_in.post_id, models.Vote.value == 1).scalar()
        downvotes = count_query.filter(models.Vote.post_id == vote_in.post_id, models.Vote.value == -1).scalar()
    else:
        upvotes = count_query.filter(models.Vote.comment_id == vote_in.comment_id, models.Vote.value == 1).scalar()
        downvotes = count_query.filter(models.Vote.comment_id == vote_in.comment_id, models.Vote.value == -1).scalar()

    # Re-fetch user vote
    user_vote = None
    if vote_in.post_id:
        v = db.query(models.Vote).filter(models.Vote.post_id == vote_in.post_id, models.Vote.user_id == current_user.id).first()
    else:
        v = db.query(models.Vote).filter(models.Vote.comment_id == vote_in.comment_id, models.Vote.user_id == current_user.id).first()
    
    if v:
        user_vote = v.value

    return {
        "upvotes": upvotes,
        "downvotes": downvotes,
        "user_vote": user_vote
    }
