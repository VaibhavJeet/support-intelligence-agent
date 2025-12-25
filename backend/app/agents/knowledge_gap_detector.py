"""Knowledge gap detection agent."""

from typing import List, Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

from app.core.llm import get_llm


class KnowledgeGaps(BaseModel):
    gaps: list[str] = Field(description="Topics missing from documentation")
    suggested_faqs: list[dict] = Field(description="Suggested FAQ entries")
    documentation_recommendations: list[str] = Field(description="Documentation improvements")


class KnowledgeGapDetector:
    def __init__(self):
        self.llm = get_llm()
        self.parser = JsonOutputParser(pydantic_object=KnowledgeGaps)

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You analyze support tickets to identify knowledge gaps.

Find:
1. Topics customers ask about that aren't documented
2. Common questions that should be FAQs
3. Areas where documentation could be improved

{format_instructions}"""),
            ("human", """Analyze these tickets for knowledge gaps:

{tickets}

Identify what documentation is missing."""),
        ])

    async def detect(self, tickets) -> Dict[str, Any]:
        ticket_text = "\n\n".join([
            f"Subject: {t.subject}\nCategory: {t.category}\nDescription: {t.description[:300]}"
            for t in tickets[:100]
        ])

        chain = self.prompt | self.llm | self.parser

        result = await chain.ainvoke({
            "tickets": ticket_text,
            "format_instructions": self.parser.get_format_instructions(),
        })

        return result