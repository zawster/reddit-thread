from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Subreddit(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    icon_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("User", backref="owned_subreddits")
