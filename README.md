# AI Lead Qualification Platform

An end-to-end AI-powered sales workflow that automatically scores, classifies, summarizes, and routes inbound leads using deterministic business rules, OpenAI, and LangGraph.

### Live Project

- **Frontend:** https://ai-lead-qualification-gamma.vercel.app
- **API Docs:** https://ai-lead-qualification-lz2o.onrender.com/docs
- **GitHub:** https://github.com/Waseemhazarisyed/ai-lead-qualification

---

## Dashboard Preview

<p align="center">
  <img src="assets/dashboard.png" alt="AI Lead Qualification Dashboard" width="900"/>
</p>

---

## Project Highlights

- 98.8% final untouched evaluation score
- 100% lead classification accuracy
- 100% workflow routing accuracy
- Human-in-the-loop approval for HOT leads
- LangGraph workflow orchestration
- OpenAI-powered intent analysis and summarization
- Deterministic lead scoring and business rules
- PostgreSQL persistence
- React management dashboard
- Deployed on Vercel + Render

---

## Business Problem

Sales teams receive inbound leads with different budgets, company sizes, urgency levels, and buying intent.

Manually reviewing every inquiry is slow and inconsistent.

This platform automatically evaluates each lead and helps sales teams answer:

> **Who should we contact first, and why?**

---

## Solution

Each incoming lead moves through an automated AI workflow.

The platform combines:

- Deterministic business rules for scoring, classification, urgency, routing, and recommended actions
- OpenAI for intent understanding and lead summarization
- LangGraph for workflow orchestration
- Human review for high-priority HOT leads
- PostgreSQL for persistent storage
- React for the management dashboard

---

## Architecture Overview

```text
                    Customer / Lead
                          │
                          ▼
                React Dashboard
                    (Vercel)
                          │
                          ▼
                FastAPI Backend
                    (Render)
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
    Deterministic Rules            OpenAI
              │                       │
              │                Intent + Summary
              │                       │
              └───────────┬───────────┘
                          │
                          ▼
                  LangGraph Workflow
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
             HOT         WARM        COLD
              │           │           │
              ▼           ▼           ▼
        Human Review    Follow-Up    Nurture
              │
        Approve / Reject
              │
              ▼
         Execute Action
                          │
                          ▼
                    PostgreSQL
                 Persistent Storage





Lead Qualification Flow
HOT Lead
Lead Submitted
      ↓
Scored + Analyzed
      ↓
Classification: HOT
      ↓
Human Review
      ↓
Approve / Reject
      ↓
Execute Action
WARM Lead
Lead Submitted
      ↓
Scored + Analyzed
      ↓
Classification: WARM
      ↓
Follow-Up Ready
COLD Lead
Lead Submitted
      ↓
Scored + Analyzed
      ↓
Classification: COLD
      ↓
Nurture Ready
AI vs Deterministic Logic

The platform intentionally separates AI tasks from business-critical decisions.

OpenAI Handles
Customer intent understanding
Natural-language interpretation
Lead summarization
Deterministic Business Rules Handle
Lead score
HOT / WARM / COLD classification
Urgency
Workflow routing
Recommended action

This architecture improves consistency, predictability, and explainability.

Human-in-the-Loop Review

HOT leads are not automatically executed.

They are routed to a human reviewer first.

HOT Lead
   ↓
Awaiting Human Review
   ↓
Approve / Reject
   ↓
Approved Lead
   ↓
Execute Action

This design keeps important business decisions under human control.

Final Evaluation Results
Metric	Result
Classification	100%
Routing	100%
Urgency	95%
Recommended Action	100%
Overall	98.8%

The final score was measured using a separate unseen evaluation dataset after the scoring logic was frozen.

Evaluation Strategy

The system was evaluated using multiple test sets.

Development / Tuning Set
19 test cases
Used to improve scoring and routing logic
Final result: 100%
Validation Set
15 held-out cases
Used to validate improvements
Final result: 100%
Final Untouched Test Set
20 completely unseen cases
Used after the decision logic was frozen

Final results:

Classification: 100%
Routing: 100%
Urgency: 95%
Recommended Action: 100%
Overall: 98.8%

This helped reduce overfitting to the tuning dataset.

Technology Stack
AI & Workflow
OpenAI
LangGraph
Human-in-the-loop workflow
Backend
Python
FastAPI
Pydantic
SQLAlchemy
Database
PostgreSQL
Render PostgreSQL
Frontend
React
Vite
Deployment
Vercel
Render
Development & Version Control
Git
GitHub
VS Code
API Endpoints
Method	Endpoint	Description
GET	/	Root endpoint
GET	/health	Health check
POST	/leads	Create and qualify a lead
GET	/leads	Get all leads
GET	/leads/{lead_id}	Get one lead
POST	/leads/{lead_id}/review	Approve or reject a HOT lead
POST	/leads/{lead_id}/execute-action	Execute the approved sales action
Example Lead Input
{
  "name": "Sarah Miller",
  "email": "sarah.miller@example.com",
  "phone": "555-222-1001",
  "company": "NovaTech Solutions",
  "company_size": 220,
  "service_interest": "AI Automation",
  "budget": 45000,
  "message": "We have approved the budget for an AI automation project and want to begin implementation immediately."
}
Example Output
{
  "score": 90,
  "classification": "HOT",
  "urgency": "high",
  "intent": "Customer is ready to proceed with AI automation implementation.",
  "recommended_action": "schedule_sales_call",
  "workflow_route": "awaiting_human_review"
}
Production Deployment

The project was developed locally and deployed to the cloud.

Developer Machine
      │
      ▼
    GitHub
      │
      ├──────────────► Vercel
      │                 │
      │                 ▼
      │           React Frontend
      │
      └──────────────► Render
                        │
                 ┌──────┴──────┐
                 ▼             ▼
              FastAPI      PostgreSQL
              Backend       Database
Frontend

Hosted on:

Vercel
Backend

Hosted on:

Render
Database

Hosted on:

Render PostgreSQL
AI
OpenAI API
Workflow Orchestration
LangGraph
Environment Variables

Create a .env file locally:

OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_postgresql_database_url

Do not commit real secrets to GitHub.

The project includes an .env.example file for configuration reference.

Local Setup
1. Clone the Repository
git clone https://github.com/Waseemhazarisyed/ai-lead-qualification.git
cd ai-lead-qualification
2. Create a Python Virtual Environment
python -m venv .venv

Activate it:

source .venv/bin/activate
3. Install Backend Dependencies
pip install -r requirements.txt
4. Configure Environment Variables

Create:

.env

Add:

OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url
5. Start the FastAPI Backend
uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

Swagger documentation:

http://127.0.0.1:8000/docs
Frontend Setup

Move into the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend:

http://localhost:5173
Project Structure
ai-lead-qualification/
│
├── app/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── workflow/
│   └── main.py
│
├── evals/
│   ├── test_cases.json
│   ├── holdout_cases.json
│   ├── final_test_cases.json
│   ├── run_evals.py
│   ├── run_holdout_evals.py
│   └── run_final_test.py
│
├── frontend/
│
├── assets/
│   └── dashboard.png
│
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
Key Engineering Decisions
Used deterministic rules for business-critical decisions instead of relying entirely on an LLM
Used OpenAI for language understanding and summarization
Used LangGraph to coordinate the qualification workflow
Added human approval before executing actions for HOT leads
Used PostgreSQL for persistent production storage
Built a React dashboard for lead review and workflow management
Created formal evaluation datasets instead of relying only on manual testing
Used a final untouched dataset to reduce overfitting
Deployed frontend, backend, and database as separate cloud services
Current Capabilities

The platform can:

Receive inbound leads
Validate lead information
Calculate a deterministic lead score
Classify leads as HOT, WARM, or COLD
Detect lead urgency
Analyze intent using OpenAI
Generate AI summaries
Route leads using LangGraph
Send HOT leads to human review
Approve or reject HOT leads
Prepare and execute an internal sales action
Store workflow state in PostgreSQL
Display leads in a React dashboard

This project demonstrates practical experience with:

AI engineering
LLM integration
Agentic workflows
LangGraph
FastAPI
REST API design
Human-in-the-loop AI systems
Deterministic business rules
PostgreSQL
React
Evaluation-driven AI development
Production deployment
Cloud infrastructure
Debugging production systems
Author

Waseem Hazari Syed

GitHub: https://github.com/Waseemhazarisyed
LinkedIn: https://www.linkedin.com/in/waseem-hazari-syed

Then click **Preview**. If everything looks right, click **Commit changes...** and use:

```text
Polish README with architecture and project details
