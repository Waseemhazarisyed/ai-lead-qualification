from langgraph.graph import StateGraph, START, END

from app.workflow.state import LeadWorkflowState

from app.workflow.nodes import (
    score_lead_node,
    ai_analysis_node,
    route_lead_node,
    human_review_node,
    follow_up_node,
    nurture_node
)


def choose_route(state: LeadWorkflowState) -> str:
    return state["route"]


workflow = StateGraph(LeadWorkflowState)


workflow.add_node(
    "score_lead",
    score_lead_node
)

workflow.add_node(
    "ai_analysis",
    ai_analysis_node
)

workflow.add_node(
    "route_lead",
    route_lead_node
)

workflow.add_node(
    "human_review",
    human_review_node
)

workflow.add_node(
    "follow_up",
    follow_up_node
)

workflow.add_node(
    "nurture",
    nurture_node
)


workflow.add_edge(
    START,
    "score_lead"
)

workflow.add_edge(
    "score_lead",
    "ai_analysis"
)

workflow.add_edge(
    "ai_analysis",
    "route_lead"
)


workflow.add_conditional_edges(
    "route_lead",
    choose_route,
    {
        "human_review": "human_review",
        "follow_up": "follow_up",
        "nurture": "nurture"
    }
)


workflow.add_edge(
    "human_review",
    END
)

workflow.add_edge(
    "follow_up",
    END
)

workflow.add_edge(
    "nurture",
    END
)


lead_workflow = workflow.compile()