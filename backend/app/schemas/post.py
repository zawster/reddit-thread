from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from .user import User
from .subreddit import Subreddit as SubredditSchema

class PostBase(BaseModel):
    title: str
    content: Optional[str] = None

class PostCreate(PostBase):
    subreddit_id: int

class PostUpdate(PostBase):
    title: Optional[str] = None

class Post(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime
    author_id: int
    subreddit_id: int
    author: User
    subreddit: SubredditSchema
    
    # We'll add vote counts later in a custom response schema
    upvotes: int = 0
    downvotes: int = 0
    user_vote: Optional[int] = None # Current user's vote

    class Config:
        from_attributes = True
