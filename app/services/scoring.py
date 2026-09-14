def calculate_lead_score(
    budget: float | None,
    company_size: int | None,
    message: str
) -> dict:

    score = 0

    # --------------------------------------------------
    # 1. BUDGET SCORE
    # --------------------------------------------------

    if budget is not None:
        if budget >= 20000:
            score += 30
        elif budget >= 10000:
            score += 20
        elif budget >= 5000:
            score += 10

    # --------------------------------------------------
    # 2. COMPANY SIZE SCORE
    # --------------------------------------------------

    if company_size is not None:
        if company_size >= 100:
            score += 20
        elif company_size >= 50:
            score += 15
        elif company_size >= 10:
            score += 10
        else:
            score += 5

    message_lower = message.lower()

    # --------------------------------------------------
    # 3. URGENCY SCORE
    # --------------------------------------------------

    high_urgency_keywords = [
        "immediately",
        "urgent",
        "urgently",
        "asap",
        "next month",
        "this month"
    ]

    if any(
        keyword in message_lower
        for keyword in high_urgency_keywords
    ):
        score += 20

    elif "soon" in message_lower:
        score += 10

    # --------------------------------------------------
    # 4. GENERAL INTENT SCORE
    # --------------------------------------------------

    intent_keywords = [
        "automate",
        "automation",
        "ai",
        "sales",
        "support",
        "lead",
        "customer"
    ]

    if any(
        keyword in message_lower
        for keyword in intent_keywords
    ):
        score += 20

    # --------------------------------------------------
    # 5. STRONG BUYING INTENT
    # --------------------------------------------------

    strong_buying_intent_keywords = [
        "ready to start",
        "ready to begin",
        "want to move forward",
        "need a solution",
        "want to implement",
        "ready to implement"
    ]

    if any(
        keyword in message_lower
        for keyword in strong_buying_intent_keywords
    ):
        score += 15

    # --------------------------------------------------
    # 6. ACTIVE EVALUATION / VENDOR COMPARISON
    # --------------------------------------------------

    active_evaluation_keywords = [
        "evaluating vendors",
        "evaluating solutions",
        "comparing vendors",
        "comparing pricing",
        "comparing options"
    ]

    if any(
        keyword in message_lower
        for keyword in active_evaluation_keywords
    ):
        score += 10

    # --------------------------------------------------
    # 7. NEGATIVE BUYING SIGNALS
    # --------------------------------------------------

    negative_keywords = [
        "no active project",
        "no immediate plans",
        "only gathering information",
        "just gathering information",
        "just looking",
        "just curious"
    ]

    if any(
        keyword in message_lower
        for keyword in negative_keywords
    ):
        score -= 20

    # --------------------------------------------------
    # 8. VERY SMALL COMPANY / MODERATE BUDGET PENALTY
    # --------------------------------------------------

    # Example:
    # 4-person company with an $8,000 budget.
    #
    # Strong intent is valuable, but limited company size
    # and moderate budget keep the lead in WARM territory.
    if (
        company_size is not None
        and company_size < 5
        and budget is not None
        and budget < 10000
    ):
        score -= 10

    # --------------------------------------------------
    # 9. VERY LOW FIT PENALTY
    # --------------------------------------------------

    # Extremely small company + extremely low budget.
    #
    # This is stronger than the penalty above.
    if (
        company_size is not None
        and company_size < 5
        and budget is not None
        and budget < 1000
    ):
        score -= 20

    # --------------------------------------------------
    # 10. KEEP SCORE BETWEEN 0 AND 100
    # --------------------------------------------------

    score = max(0, min(score, 100))

    # --------------------------------------------------
    # 11. CLASSIFICATION
    # --------------------------------------------------

    if score >= 70:
        classification = "HOT"

    elif score >= 40:
        classification = "WARM"

    else:
        classification = "COLD"

    return {
        "score": score,
        "classification": classification
    }


def determine_urgency(
    message: str
) -> str:

    message_lower = message.lower()

    # --------------------------------------------------
    # 1. MEDIUM — DECISION SOON
    # --------------------------------------------------

    if "make a decision soon" in message_lower:
        return "medium"

    # --------------------------------------------------
    # 2. HIGH — DIRECT NEED + SOON
    # --------------------------------------------------

    if "need" in message_lower and "soon" in message_lower:
        return "high"

    # --------------------------------------------------
    # 3. HIGH URGENCY
    # --------------------------------------------------

    high_urgency_keywords = [
        "urgent",
        "urgently",
        "asap",
        "immediately",
        "right away",
        "this week",
        "this month",
        "next month",
        "need soon"
    ]

    if any(
        keyword in message_lower
        for keyword in high_urgency_keywords
    ):
        return "high"

    # --------------------------------------------------
    # 4. MEDIUM URGENCY
    # --------------------------------------------------

    medium_urgency_keywords = [
        "evaluating vendors",
        "evaluating solutions",
        "ready to begin",
        "ready to start",
        "planning implementation",
        "looking to purchase",
        "looking to implement",
        "compare pricing",
        "comparing pricing",
        "compare vendors",
        "comparing vendors",
        "vendor pricing",
        "may begin",
        "if the fit is right"
    ]

    if any(
        keyword in message_lower
        for keyword in medium_urgency_keywords
    ):
        return "medium"

    # --------------------------------------------------
    # 5. LOW URGENCY
    # --------------------------------------------------

    return "low"