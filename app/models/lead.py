from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)

    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    company_size = Column(Integer, nullable=True)

    service_interest = Column(String, nullable=False)
    budget = Column(Float, nullable=True)

    message = Column(String, nullable=False)

    status = Column(
        String,
        nullable=False,
        default="new"
    )

    score = Column(Integer, nullable=True)

    classification = Column(
        String,
        nullable=True
    )

    intent = Column(String, nullable=True)

    urgency = Column(String, nullable=True)

    ai_summary = Column(String, nullable=True)

    recommended_action = Column(String, nullable=True)

    workflow_route = Column(String, nullable=True)

    review_status = Column(String, nullable=True)

    review_notes = Column(String, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )