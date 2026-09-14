from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.schemas.lead import LeadCreate
from app.schemas.review import LeadReviewRequest
from app.models.lead import Lead
from app.database.database import get_db
from app.workflow.graph import lead_workflow
from app.services.action import build_sales_action


app = FastAPI(
    title="AI Lead Qualification Platform",
    version="1.0.0"
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
         "https://ai-lead-qualification.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Lead Qualification Platform is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/leads")
def create_lead(
    lead: LeadCreate,
    db: Session = Depends(get_db)
):
    # Step 1: Prepare initial LangGraph state
    workflow_state = {
        "lead_id": 0,
        "name": lead.name,
        "email": lead.email,
        "company": lead.company,
        "company_size": lead.company_size,
        "service_interest": lead.service_interest,
        "budget": lead.budget,
        "message": lead.message,

        "score": None,
        "classification": None,

        "intent": None,
        "urgency": None,
        "ai_summary": None,
        "recommended_action": None,

        "route": None
    }

    # Step 2: Run complete LangGraph workflow
    workflow_result = lead_workflow.invoke(workflow_state)

    # Step 3: Create database lead object
    db_lead = Lead(
        name=lead.name,
        email=lead.email,
        phone=lead.phone,
        company=lead.company,
        company_size=lead.company_size,
        service_interest=lead.service_interest,
        budget=lead.budget,
        message=lead.message,

        score=workflow_result["score"],
        classification=workflow_result["classification"],

        intent=workflow_result["intent"],
        urgency=workflow_result["urgency"],
        ai_summary=workflow_result["ai_summary"],
        recommended_action=workflow_result["recommended_action"],

        workflow_route=workflow_result["route"],

        review_status=None,
        review_notes=None
    )

    # Step 4: Save to PostgreSQL
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)

    # Step 5: Return saved lead
    return {
        "status": "saved",
        "lead_id": db_lead.id,
        "lead": {
            "name": db_lead.name,
            "email": db_lead.email,
            "company": db_lead.company,
            "status": db_lead.status,

            "score": db_lead.score,
            "classification": db_lead.classification,

            "intent": db_lead.intent,
            "urgency": db_lead.urgency,
            "ai_summary": db_lead.ai_summary,
            "recommended_action": db_lead.recommended_action,

            "workflow_route": db_lead.workflow_route,

            "review_status": db_lead.review_status,
            "review_notes": db_lead.review_notes
        }
    }


@app.get("/leads")
def get_leads(
    db: Session = Depends(get_db)
):
    leads = db.query(Lead).order_by(Lead.id.desc()).all()

    return {
        "count": len(leads),
        "leads": [
            {
                "id": lead.id,
                "name": lead.name,
                "email": lead.email,
                "phone": lead.phone,
                "company": lead.company,
                "company_size": lead.company_size,
                "service_interest": lead.service_interest,
                "budget": lead.budget,
                "message": lead.message,
                "status": lead.status,

                "score": lead.score,
                "classification": lead.classification,

                "intent": lead.intent,
                "urgency": lead.urgency,
                "ai_summary": lead.ai_summary,
                "recommended_action": lead.recommended_action,

                "workflow_route": lead.workflow_route,

                "review_status": lead.review_status,
                "review_notes": lead.review_notes,

                "created_at": lead.created_at
            }
            for lead in leads
        ]
    }


@app.get("/leads/{lead_id}")
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id
    ).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    return {
        "id": lead.id,
        "name": lead.name,
        "email": lead.email,
        "phone": lead.phone,
        "company": lead.company,
        "company_size": lead.company_size,
        "service_interest": lead.service_interest,
        "budget": lead.budget,
        "message": lead.message,
        "status": lead.status,

        "score": lead.score,
        "classification": lead.classification,

        "intent": lead.intent,
        "urgency": lead.urgency,
        "ai_summary": lead.ai_summary,
        "recommended_action": lead.recommended_action,

        "workflow_route": lead.workflow_route,

        "review_status": lead.review_status,
        "review_notes": lead.review_notes,

        "created_at": lead.created_at
    }


@app.post("/leads/{lead_id}/review")
def review_lead(
    lead_id: int,
    review: LeadReviewRequest,
    db: Session = Depends(get_db)
):
    # Step 1: Find the lead
    lead = db.query(Lead).filter(
        Lead.id == lead_id
    ).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    # Step 2: Only leads awaiting human review can be reviewed
    if lead.workflow_route != "awaiting_human_review":
        raise HTTPException(
            status_code=400,
            detail="Lead is not awaiting human review"
        )

    # Step 3: Save human decision
    lead.review_status = review.decision
    lead.review_notes = review.notes

    # Step 4: Update workflow based on decision
    if review.decision == "approved":
        lead.workflow_route = "approved_for_action"
        lead.status = "approved"

    elif review.decision == "rejected":
        lead.workflow_route = "rejected"
        lead.status = "rejected"

    # Step 5: Save changes
    db.commit()
    db.refresh(lead)

    # Step 6: Return result
    return {
        "message": "Review completed",
        "lead_id": lead.id,
        "classification": lead.classification,
        "review_status": lead.review_status,
        "review_notes": lead.review_notes,
        "status": lead.status,
        "workflow_route": lead.workflow_route
    }


@app.post("/leads/{lead_id}/execute-action")
def execute_lead_action(
    lead_id: int,
    db: Session = Depends(get_db)
):
    # Step 1: Find the lead
    lead = db.query(Lead).filter(
        Lead.id == lead_id
    ).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    # Step 2: Only approved leads can execute actions
    if lead.workflow_route != "approved_for_action":
        raise HTTPException(
            status_code=400,
            detail="Lead is not approved for action"
        )

    # Step 3: Build the sales action payload
    action_payload = build_sales_action(lead)

    # Step 4: Mark the action as executed
    lead.workflow_route = "action_executed"
    lead.status = "action_executed"

    # Step 5: Save changes
    db.commit()
    db.refresh(lead)

    # Step 6: Return the action payload
    return {
        "message": "Action executed",
        "lead_id": lead.id,
        "status": lead.status,
        "workflow_route": lead.workflow_route,
        "action": action_payload
    }
