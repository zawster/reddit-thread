from fastapi import APIRouter

from app.api.api_v1.endpoints import login, users, subreddits, posts, comments, votes, search, notifications

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(subreddits.router, prefix="/subreddits", tags=["subreddits"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(votes.router, prefix="/votes", tags=["votes"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(notifications.router, tags=["notifications"])
