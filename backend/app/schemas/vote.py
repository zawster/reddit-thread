from typing import Optional
from pydantic import BaseModel, conint

class VoteBase(BaseModel):
    value: conint(ge=-1, le=1) # type: ignore

class VoteCreate(VoteBase):
    post_id: Optional[int] = None
    comment_id: Optional[int] = None

class VoteResponse(BaseModel):
    upvotes: int
    downvotes: int
    user_vote: Optional[int] = None
