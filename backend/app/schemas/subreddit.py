from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class SubredditBase(BaseModel):
    name: str
    title: str
    description: Optional[str] = None
    icon_url: Optional[str] = None

class SubredditCreate(SubredditBase):
    pass

class SubredditUpdate(SubredditBase):
    name: Optional[str] = None
    title: Optional[str] = None

class Subreddit(SubredditBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True
