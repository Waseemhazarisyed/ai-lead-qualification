from typing import TypedDict, Optional


class LeadWorkflowState(TypedDict):
    # Original lead data
    lead_id: int
    name: str
    email: str
    company: Optional[str]
    company_size: Optional[int]
    service_interest: str
    budget: Optional[float]
    message: str

    # Rule-based scoring output
    score: Optional[int]
    classification: Optional[str]

    # AI analysis output
    intent: Optional[str]
    urgency: Optional[str]
    ai_summary: Optional[str]
    recommended_action: Optional[str]

    # Workflow routing
    route: Optional[str]