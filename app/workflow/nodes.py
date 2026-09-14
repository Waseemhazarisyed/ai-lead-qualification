from app.services.scoring import (
    calculate_lead_score,
    determine_urgency,
)

from app.services.ai_analysis import analyze_lead_with_ai
from app.workflow.state import LeadWorkflowState


# --------------------------------------------------
# 1. SCORE LEAD
# --------------------------------------------------

def score_lead_node(
    state: LeadWorkflowState
) -> LeadWorkflowState:

    scoring_result = calculate_lead_score(
        budget=state["budget"],
        company_size=state["company_size"],
        message=state["message"],
    )

    # Deterministic scoring
    state["score"] = scoring_result["score"]
    state["classification"] = scoring_result["classification"]

    # Deterministic urgency
    state["urgency"] = determine_urgency(
        message=state["message"]
    )

    return state


# --------------------------------------------------
# 2. AI LANGUAGE ANALYSIS
# --------------------------------------------------

def ai_analysis_node(
    state: LeadWorkflowState
) -> LeadWorkflowState:

    result = analyze_lead_with_ai(
        service_interest=state["service_interest"],
        message=state["message"],
    )

    # AI handles language understanding only.
    # AI should NOT overwrite:
    # - score
    # - classification
    # - urgency
    # - route
    # - recommended_action

    state["intent"] = result.intent
    state["ai_summary"] = result.summary

    return state


# --------------------------------------------------
# 3. ROUTE LEAD
# --------------------------------------------------

def route_lead_node(
    state: LeadWorkflowState
) -> LeadWorkflowState:

    classification = state["classification"]

    if classification == "HOT":

        state["route"] = "human_review"
        state["recommended_action"] = "schedule_sales_call"

    elif classification == "WARM":

        state["route"] = "follow_up"
        state["recommended_action"] = "send_follow_up"

    else:

        state["route"] = "nurture"
        state["recommended_action"] = "nurture"

    return state


# --------------------------------------------------
# 4. HUMAN REVIEW
# --------------------------------------------------

def human_review_node(
    state: LeadWorkflowState
) -> LeadWorkflowState:

    state["route"] = "awaiting_human_review"

    return state


# --------------------------------------------------
# 5. FOLLOW-UP
# --------------------------------------------------

def follow_up_node(
    state: LeadWorkflowState
) -> LeadWorkflowState:

    state["route"] = "follow_up_ready"

    return state


# --------------------------------------------------
# 6. NURTURE
# --------------------------------------------------

def nurture_node(
    state: LeadWorkflowState
) -> LeadWorkflowState:

    state["route"] = "nurture_ready"

    return state