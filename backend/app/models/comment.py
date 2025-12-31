from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Comment(Base):
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    author_id = Column(Integer, ForeignKey("user.id"))
    post_id = Column(Integer, ForeignKey("post.id"))
    parent_id = Column(Integer, ForeignKey("comment.id"), nullable=True)
    
    author = relationship("User", backref="comments")
    post = relationship("Post", backref="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
