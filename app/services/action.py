def build_sales_action(lead):
    return {
        "action_type": "sales_follow_up",
        "lead_id": lead.id,
        "lead_name": lead.name,
        "email": lead.email,
        "company": lead.company,
        "score": lead.score,
        "classification": lead.classification,
        "intent": lead.intent,
        "urgency": lead.urgency,
        "summary": lead.ai_summary,
        "recommended_action": lead.recommended_action,
        "message": (
            f"Contact {lead.name} from {lead.company}. "
            f"This is a {lead.classification} lead with score {lead.score}. "
            f"Recommended next step: {lead.recommended_action}."
        )
    }