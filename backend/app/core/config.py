import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Reddit Clone Image"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "changethis")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 
    ALGORITHM: str = "HS256"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/reddit_clone")
    
    class Config:
        case_sensitive = True

settings = Settings()
