"""Ticket analysis agent."""

from typing import Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

from app.core.llm import get_llm
from app.models.ticket import TicketAnalysis


class AnalysisResult(BaseModel):
    category: str = Field(description="Main category")
    subcategory: str = Field(description="Subcategory")
    sentiment_score: float = Field(description="Sentiment -1 to 1")
    priority_suggestion: str = Field(description="Suggested priority")
    suggested_resolution: str = Field(description="Suggested resolution")
    knowledge_gaps: list[str] = Field(description="Missing documentation topics")


class TicketAnalyzerAgent:
    def __init__(self):
        self.llm = get_llm()
        self.parser = JsonOutputParser(pydantic_object=AnalysisResult)

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a support ticket analyzer. Analyze tickets and provide:
1. Category and subcategory
2. Sentiment score (-1 negative to 1 positive)
3. Priority suggestion (low, medium, high, urgent)
4. Suggested resolution
5. Knowledge gaps (topics that should be documented)

{format_instructions}"""),
            ("human", """Analyze this ticket:

Subject: {subject}
Description: {description}
Current Priority: {priority}"""),
        ])

    async def analyze(self, ticket) -> TicketAnalysis:
        chain = self.prompt | self.llm | self.parser

        result = await chain.ainvoke({
            "subject": ticket.subject,
            "description": ticket.description,
            "priority": ticket.priority,
            "format_instructions": self.parser.get_format_instructions(),
        })

        return TicketAnalysis(
            ticket_id=ticket.id,
            category=result["category"],
            subcategory=result.get("subcategory"),
            sentiment_score=result["sentiment_score"],
            priority_suggestion=result["priority_suggestion"],
            suggested_resolution=result.get("suggested_resolution"),
            knowledge_gaps=result.get("knowledge_gaps", []),
        )