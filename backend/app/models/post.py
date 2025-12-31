from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Post(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    author_id = Column(Integer, ForeignKey("user.id"))
    subreddit_id = Column(Integer, ForeignKey("subreddit.id"))
    
    author = relationship("User", backref="posts")
    subreddit = relationship("Subreddit", backref="posts")
