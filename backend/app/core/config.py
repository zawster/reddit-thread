"""
Application Configuration Module

This module contains all configuration settings for the Reddit Clone API.
Settings are loaded from environment variables with sensible defaults for development.
"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Attributes:
        PROJECT_NAME: Display name for the API shown in documentation
        API_V1_STR: Base path prefix for all API v1 endpoints
        SECRET_KEY: Secret key for JWT token signing (should be changed in production)
        ACCESS_TOKEN_EXPIRE_MINUTES: JWT token expiration time in minutes
        ALGORITHM: Algorithm used for JWT token encoding
        DATABASE_URL: PostgreSQL connection string
    """

    # Application settings
    PROJECT_NAME: str = "Reddit Clone Image"
    API_V1_STR: str = "/api/v1"

    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "changethis")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"

    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/reddit_clone")

    class Config:
        case_sensitive = True


settings = Settings()
