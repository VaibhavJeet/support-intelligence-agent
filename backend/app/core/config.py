"""Configuration."""

from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "support-intelligence-agent"
    debug: bool = True

    llm_provider: Literal["openai", "anthropic", "ollama"] = "openai"
    openai_api_key: str = ""
    openai_model: str = "gpt-4-turbo-preview"
    anthropic_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2"

    database_url: str = "sqlite+aiosqlite:///./data/support.db"


settings = Settings()