from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.subreddit import Subreddit
from app.models.post import Post
from app.core.security import get_password_hash

def seed_data():
    db = SessionLocal()
    try:
        # Create admin user
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            admin = User(
                email="admin@example.com",
                username="admin",
                hashed_password=get_password_hash("admin123"),
                is_superuser=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # Create subreddits
        subs = [
            {
                "name": "technology", 
                "title": "Technology", 
                "description": "The latest tech news and discussion",
                "icon_url": "https://api.dicebear.com/7.x/identicon/svg?seed=technology"
            },
            {
                "name": "programming", 
                "title": "Programming", 
                "description": "Everything about computer programming",
                "icon_url": "https://api.dicebear.com/7.x/identicon/svg?seed=programming"
            },
            {
                "name": "silence", 
                "title": "The Art of Silence", 
                "description": "A place to reflect on the power of quiet and introspection.",
                "icon_url": "https://api.dicebear.com/7.x/identicon/svg?seed=silence"
            },
            {
                "name": "society", 
                "title": "Society Critique", 
                "description": "Discussions on the complexities and cruelties of modern society.",
                "icon_url": "https://api.dicebear.com/7.x/identicon/svg?seed=society"
            },
            {
                "name": "funny", 
                "title": "Funny", 
                "description": "Share things that make you laugh",
                "icon_url": "https://api.dicebear.com/7.x/identicon/svg?seed=funny"
            }
        ]

        created_subs = {}
        for s in subs:
            existing = db.query(Subreddit).filter(Subreddit.name == s["name"]).first()
            if not existing:
                existing = Subreddit(
                    **s,
                    owner_id=admin.id
                )
                db.add(existing)
                db.commit()
                db.refresh(existing)
            created_subs[s["name"]] = existing

        # Add Sample Posts
        posts = [
            {
                "title": "Welcome to the Reddit Clone!",
                "content": "This is the first post on our new platform. Feel free to explore and create your own communities!",
                "subreddit_id": created_subs["technology"].id,
                "author_id": admin.id
            },
            {
                "title": "The beauty of a quiet morning",
                "content": "There is something magical about the world before everyone wakes up. In silence, we find ourselves.",
                "subreddit_id": created_subs["silence"].id,
                "author_id": admin.id
            },
            {
                "title": "Why does modern society feel so isolating?",
                "content": "Despite being more 'connected' than ever, the mechanical nature of our interactions often leaves us feeling more alone than before. Is this by design or a flaw in our evolution?",
                "subreddit_id": created_subs["society"].id,
                "author_id": admin.id
            },
            {
                "title": "Building with FastAPI is a breeze",
                "content": "High performance, easy to use, and great documentation. What's your favorite feature?",
                "subreddit_id": created_subs["programming"].id,
                "author_id": admin.id
            }
        ]

        for p in posts:
            existing_post = db.query(Post).filter(Post.title == p["title"]).first()
            if not existing_post:
                db.add(Post(**p))
        
        db.commit()
        print("Initial data and sample posts seeded successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
