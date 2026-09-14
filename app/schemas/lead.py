from pydantic import BaseModel, EmailStr
from typing import Optional


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    company_size: Optional[int] = None
    service_interest: str
    budget: Optional[float] = None
    message: str
    