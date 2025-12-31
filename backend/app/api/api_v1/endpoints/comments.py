from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps
from app.core.websocket import manager

router = APIRouter()

def build_comment_tree(comments: List[models.Comment], parent_id: Optional[int] = None) -> List[Any]:
    tree = []
    for comment in comments:
        if comment.parent_id == parent_id:
            # We don't want to modify the SQLAlchemy object itself in a way that affects DB
            # but for response serialization it's fine to attach 'replies'
            comment.replies = build_comment_tree(comments, comment.id)
            tree.append(comment)
    return tree

@router.get("/post/{post_id}", response_model=List[schemas.Comment])
def read_comments_by_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve comments for a post in a tree structure.
    """
    all_comments = db.query(models.Comment).filter(models.Comment.post_id == post_id).all()
    return build_comment_tree(all_comments)

@router.post("/", response_model=schemas.Comment)
async def create_comment(
    *,
    db: Session = Depends(deps.get_db),
    comment_in: schemas.CommentCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new comment.
    """
    comment = models.Comment(
        **comment_in.dict(),
        author_id=current_user.id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    # Notify post owner
    post = db.query(models.Post).filter(models.Post.id == comment.post_id).first()
    if post and post.author_id != current_user.id:
        await manager.send_personal_message({
            "type": "new_comment",
            "post_id": post.id,
            "post_title": post.title,
            "commenter": current_user.username
        }, post.author_id)

    # Ensure replies is initialized for pydantic
    comment.replies = []
    return comment
