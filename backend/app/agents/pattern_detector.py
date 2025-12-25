"""Pattern detection agent."""

from typing import List, Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from datetime import datetime

from app.core.llm import get_llm


class DetectedPattern(BaseModel):
    name: str = Field(description="Pattern name")
    description: str = Field(description="Pattern description")
    category: str = Field(description="Category")
    keywords: list[str] = Field(description="Keywords")
    severity: str = Field(description="low/medium/high")
    ticket_indices: list[int] = Field(description="Matching ticket indices")


class PatternList(BaseModel):
    patterns: list[DetectedPattern] = Field(description="Detected patterns")


class PatternDetectorAgent:
    def __init__(self):
        self.llm = get_llm()
        self.parser = JsonOutputParser(pydantic_object=PatternList)

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a pattern detection expert. Analyze support tickets to find:
1. Recurring issues (same problem reported multiple times)
2. Related issues (different symptoms, same root cause)
3. Trending issues (increasing frequency)

Group similar tickets and identify patterns.

{format_instructions}"""),
            ("human", """Analyze these tickets for patterns:

{tickets}

Identify recurring patterns and group related tickets."""),
        ])

    async def detect(self, tickets) -> List[Dict[str, Any]]:
        # Format tickets for analysis
        ticket_text = "\n\n".join([
            f"[{i}] Subject: {t.subject}\nDescription: {t.description[:500]}"
            for i, t in enumerate(tickets)
        ])

        chain = self.prompt | self.llm | self.parser

        result = await chain.ainvoke({
            "tickets": ticket_text,
            "format_instructions": self.parser.get_format_instructions(),
        })

        patterns = []
        for p in result.get("patterns", []):
            ticket_ids = [tickets[i].id for i in p.get("ticket_indices", []) if i < len(tickets)]
            patterns.append({
                "name": p["name"],
                "description": p["description"],
                "category": p.get("category"),
                "keywords": p.get("keywords", []),
                "severity": p.get("severity", "medium"),
                "ticket_count": len(ticket_ids),
                "ticket_ids": ticket_ids,
                "first_seen": datetime.now(),
                "last_seen": datetime.now(),
            })

        return patterns