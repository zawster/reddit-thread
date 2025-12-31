from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.subreddit import Subreddit
from app.models.post import Post
from app.models.comment import Comment
from app.models.vote import Vote

def reset_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database reset complete!")

if __name__ == "__main__":
    reset_db()
