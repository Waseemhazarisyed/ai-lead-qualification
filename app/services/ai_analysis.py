from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel


load_dotenv()

client = OpenAI()


class AILeadAnalysis(BaseModel):
    intent: str
    summary: str


def analyze_lead_with_ai(
    service_interest: str,
    message: str
) -> AILeadAnalysis:

    response = client.responses.parse(
        model="gpt-5.6-luna",
        input=[
            {
                "role": "system",
                "content": (
                    "You analyze inbound business leads. "
                    "Identify the customer's intent and provide "
                    "a concise factual summary. "
                    "Do not calculate lead score, classification, "
                    "urgency, routing, or recommended action."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Service interest: {service_interest}\n"
                    f"Lead message: {message}"
                )
            }
        ],
        text_format=AILeadAnalysis
    )

    return response.output_parsed