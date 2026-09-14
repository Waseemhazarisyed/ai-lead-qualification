from pydantic import BaseModel
from typing import Literal, Optional


class LeadReviewRequest(BaseModel):
    decision: Literal["approved", "rejected"]
    notes: Optional[str] = None