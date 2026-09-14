AI Lead Qualification Platform

An AI-powered lead qualification and routing platform built with FastAPI, LangGraph, OpenAI, PostgreSQL, and React.

The system evaluates inbound leads, assigns a score, classifies them as HOT / WARM / COLD, determines urgency, routes them through a workflow, and supports human review for high-priority leads.

Features

Lead intake through FastAPI

PostgreSQL database persistence

Deterministic lead scoring

HOT / WARM / COLD classification

Deterministic urgency detection

AI-generated lead intent and summaries

LangGraph workflow orchestration

Human-in-the-loop review for HOT leads

Approve / Reject workflow

Action execution flow

React dashboard

Lead detail view

Eval-driven development

Development, validation, and final test datasets

Architecture

Customer Lead
     |
     v
FastAPI API
     |
     v
Pydantic Validation
     |
     v
LangGraph Workflow
     |
     +-----------------------------+
     |                             |
     v                             v
Deterministic Rules            OpenAI
     |                             |
     |                             |
     |                       Intent + Summary
     |
     +--> Lead Score
     +--> Classification
     +--> Urgency
     +--> Recommended Action
     |
     v
Lead Routing
     |
     +-------------------------------+
     |               |               |
     v               v               v
    HOT             WARM            COLD
     |               |               |
Human Review     Follow-Up Ready   Nurture Ready
     |
Approve / Reject
     |
     v
Action Execution
     |
     v
PostgreSQL
     |
     v
React Dashboard

Tech Stack

Backend

Python

FastAPI

Pydantic

SQLAlchemy

PostgreSQL

LangGraph

OpenAI API

Frontend

React

Vite

JavaScript

Evaluation

Custom Python eval framework

Development test set

Validation test set

Final untouched test set

AI vs Deterministic Logic

The project intentionally separates AI language understanding from deterministic business rules.

Deterministic logic

Used for:

Lead scoring

Classification

Urgency

Routing

Recommended action

AI

OpenAI is used for:

Intent extraction

Lead summary generation

This design improves consistency and makes business-critical decisions easier to explain and test.

Lead Classification

The system classifies leads into three categories.

HOT

High-value and/or high-intent leads.

Typical workflow:

HOT
→ Human Review
→ Approve / Reject
→ Execute Action

WARM

Qualified leads that require follow-up.

WARM
→ Follow-Up Ready

COLD

Low-fit or low-intent leads.

COLD
→ Nurture Ready

Human-in-the-Loop Workflow

HOT leads are not automatically acted upon.

They are routed to:

awaiting_human_review

A user can then:

Approve the lead

Reject the lead

Approved leads move to:

approved_for_action

and can then execute the next sales action.

API Endpoints

Health Check

GET /health

Create Lead

POST /leads

Creates a lead and runs the complete qualification workflow.

Get All Leads

GET /leads

Get Lead

GET /leads/{lead_id}

Review Lead

POST /leads/{lead_id}/review

Used to approve or reject HOT leads.

Execute Action

POST /leads/{lead_id}/execute-action

Executes the approved lead action.

Evaluation Strategy

The project was developed using eval-driven development.

Instead of only checking whether the API worked, the system was tested against expected business decisions.

Metrics measured:

Classification Accuracy

Routing Accuracy

Urgency Accuracy

Recommended Action Accuracy

Overall Eval Score

Evaluation Results

Development / Tuning Set

19 test cases

Classification Accuracy:     100%
Routing Accuracy:            100%
Urgency Accuracy:            100%
Recommended Action Accuracy: 100%
Overall Eval Score:          100%

Validation Set

15 test cases

Classification Accuracy:     100%
Routing Accuracy:            100%
Urgency Accuracy:            100%
Recommended Action Accuracy: 100%
Overall Eval Score:          100%

Final Untouched Test Set

20 unseen test cases

Classification Accuracy:     100.0%
Routing Accuracy:            100.0%
Urgency Accuracy:             95.0%
Recommended Action Accuracy: 100.0%

Overall Final Test Score:     98.8%

The final test set was kept separate from the scoring-rule tuning process.

Project Structure

ai-lead-qualification/
│
├── app/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   │   ├── scoring.py
│   │   ├── ai_analysis.py
│   │   └── action.py
│   ├── workflow/
│   │   ├── state.py
│   │   ├── nodes.py
│   │   └── graph.py
│   └── main.py
│
├── evals/
│   ├── test_cases.json
│   ├── results.json
│   ├── run_evals.py
│   ├── holdout_cases.json
│   ├── holdout_results.json
│   ├── run_holdout_evals.py
│   ├── final_test_cases.json
│   ├── final_test_results.json
│   └── run_final_test.py
│
├── frontend/
│
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md

Setup

1. Clone the repository

git clone <your-repository-url>
cd ai-lead-qualification

2. Create a Python virtual environment

python -m venv .venv

Activate it:

source .venv/bin/activate

3. Install backend dependencies

pip install -r requirements.txt

4. Configure environment variables

Copy:

.env.example

to:

.env

Then configure:

OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/lead_qualification

5. Start the backend

python -m uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

6. Start the frontend

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

Run Evaluations

Development eval

PYTHONPATH=. python evals/run_evals.py

Validation eval

PYTHONPATH=. python evals/run_holdout_evals.py

Final test

PYTHONPATH=. python evals/run_final_test.py

Key Engineering Decisions

Why not let the LLM make every decision?

Early experiments showed that AI-generated urgency and recommended actions could vary between runs.

To improve reliability:

AI
→ Intent
→ Summary

Deterministic Rules
→ Score
→ Classification
→ Urgency
→ Routing
→ Recommended Action

This makes the workflow more predictable, explainable, and testable.

Future Improvements

Production deployment

Authentication

CRM integration

Email / Slack / n8n actions

Idempotent external action execution

Database migrations with Alembic

More comprehensive evaluation datasets

Monitoring and observability

Docker support

Final Result

This project demonstrates an end-to-end AI engineering workflow including:

API development

Database integration

LLM integration

Agent/workflow orchestration

Human-in-the-loop systems

React frontend development

Deterministic AI guardrails

Evaluation and regression testing

Production-oriented system design
