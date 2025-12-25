"""Base MCP integration."""

from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseMCPIntegration(ABC):
    name: str = "base"
    enabled: bool = False

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.enabled = config.get("enabled", False)

    @abstractmethod
    async def connect(self) -> bool:
        pass

    @abstractmethod
    async def disconnect(self) -> None:
        pass

    @abstractmethod
    async def execute(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_available_actions(self) -> List[str]:
        pass