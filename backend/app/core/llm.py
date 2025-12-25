"""LLM configuration."""

from functools import lru_cache
from langchain_core.language_models import BaseChatModel
from app.core.config import settings


@lru_cache()
def get_llm() -> BaseChatModel:
    provider = settings.llm_provider

    if provider == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(api_key=settings.openai_api_key, model=settings.openai_model)

    elif provider == "anthropic":
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(api_key=settings.anthropic_api_key)

    elif provider == "ollama":
        from langchain_community.chat_models import ChatOllama
        return ChatOllama(base_url=settings.ollama_base_url, model=settings.ollama_model)

    raise ValueError(f"Unknown provider: {provider}")