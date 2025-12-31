from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.db.base_class import Base

class Vote(Base):
    id = Column(Integer, primary_key=True, index=True)
    value = Column(Integer, nullable=False) # 1 for upvote, -1 for downvote
    
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("post.id"), nullable=True)
    comment_id = Column(Integer, ForeignKey("comment.id"), nullable=True)
    
    # Ensure a user can only vote once on a specific target
    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', name='unique_post_vote'),
        UniqueConstraint('user_id', 'comment_id', name='unique_comment_vote'),
    )
