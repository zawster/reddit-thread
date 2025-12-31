from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from .user import User

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int
    parent_id: Optional[int] = None

class CommentUpdate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    created_at: datetime
    author_id: int
    post_id: int
    parent_id: Optional[int] = None
    author: User
    
    # We'll handle recursive replies in a separate schema if needed, 
    # but for flat fetching + frontend nesting, this is fine.
    # To support recursive fetching in one response:
    replies: List["Comment"] = []

    class Config:
        from_attributes = True
