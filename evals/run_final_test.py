import json
from pathlib import Path

from app.workflow.graph import lead_workflow


# --------------------------------------------------
# FILE PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

TEST_CASES_FILE = BASE_DIR / "final_test_cases.json"
RESULTS_FILE = BASE_DIR / "final_test_results.json"


# --------------------------------------------------
# LOAD FINAL TEST CASES
# --------------------------------------------------

with open(TEST_CASES_FILE, "r") as file:
    test_cases = json.load(file)


# --------------------------------------------------
# METRIC COUNTERS
# --------------------------------------------------

classification_correct_count = 0
route_correct_count = 0
urgency_correct_count = 0
recommended_action_correct_count = 0

results = []


# --------------------------------------------------
# RUN FINAL TESTS
# --------------------------------------------------

for case in test_cases:

    print("\n" + "=" * 70)
    print(f"CASE {case['id']}: {case['name']}")
    print("=" * 70)

    initial_state = {
        "lead_id": case["id"],
        "name": case["name"],
        "email": case["email"],
        "company": case.get("company"),
        "company_size": case.get("company_size"),
        "service_interest": case["service_interest"],
        "budget": case.get("budget"),
        "message": case["message"],

        "score": None,
        "classification": None,
        "intent": None,
        "urgency": None,
        "ai_summary": None,
        "recommended_action": None,
        "route": None,
    }

    result = lead_workflow.invoke(initial_state)

    actual_classification = result.get("classification")
    actual_route = result.get("route")
    actual_urgency = result.get("urgency")
    actual_recommended_action = result.get("recommended_action")

    expected_classification = case["expected_classification"]
    expected_route = case["expected_route"]
    expected_urgency = case["expected_urgency"]
    expected_recommended_action = case[
        "expected_recommended_action"
    ]

    classification_correct = (
        actual_classification == expected_classification
    )

    route_correct = (
        actual_route == expected_route
    )

    urgency_correct = (
        actual_urgency == expected_urgency
    )

    recommended_action_correct = (
        actual_recommended_action
        == expected_recommended_action
    )

    if classification_correct:
        classification_correct_count += 1

    if route_correct:
        route_correct_count += 1

    if urgency_correct:
        urgency_correct_count += 1

    if recommended_action_correct:
        recommended_action_correct_count += 1

    print(
        "✅" if classification_correct else "❌",
        f"Classification: "
        f"Expected={expected_classification} | "
        f"Actual={actual_classification}"
    )

    print(
        "✅" if route_correct else "❌",
        f"Route: "
        f"Expected={expected_route} | "
        f"Actual={actual_route}"
    )

    print(
        "✅" if urgency_correct else "❌",
        f"Urgency: "
        f"Expected={expected_urgency} | "
        f"Actual={actual_urgency}"
    )

    print(
        "✅" if recommended_action_correct else "❌",
        f"Recommended Action: "
        f"Expected={expected_recommended_action} | "
        f"Actual={actual_recommended_action}"
    )

    print(f"Score: {result.get('score')}")
    print(f"Intent: {result.get('intent')}")
    print(f"AI Summary: {result.get('ai_summary')}")

    results.append(
        {
            "id": case["id"],
            "name": case["name"],

            "expected_classification":
                expected_classification,

            "actual_classification":
                actual_classification,

            "classification_correct":
                classification_correct,

            "expected_route":
                expected_route,

            "actual_route":
                actual_route,

            "route_correct":
                route_correct,

            "expected_urgency":
                expected_urgency,

            "actual_urgency":
                actual_urgency,

            "urgency_correct":
                urgency_correct,

            "expected_recommended_action":
                expected_recommended_action,

            "actual_recommended_action":
                actual_recommended_action,

            "recommended_action_correct":
                recommended_action_correct,

            "score":
                result.get("score"),

            "intent":
                result.get("intent"),

            "ai_summary":
                result.get("ai_summary"),
        }
    )


# --------------------------------------------------
# FINAL METRICS
# --------------------------------------------------

total_cases = len(test_cases)

classification_accuracy = (
    classification_correct_count / total_cases * 100
)

routing_accuracy = (
    route_correct_count / total_cases * 100
)

urgency_accuracy = (
    urgency_correct_count / total_cases * 100
)

recommended_action_accuracy = (
    recommended_action_correct_count / total_cases * 100
)

overall_score = (
    classification_accuracy
    + routing_accuracy
    + urgency_accuracy
    + recommended_action_accuracy
) / 4


# --------------------------------------------------
# PRINT FINAL RESULTS
# --------------------------------------------------

print("\n")
print("=" * 70)
print("FINAL TEST RESULTS")
print("=" * 70)

print(f"Total Final Test Cases: {total_cases}")

print(
    f"Classification Accuracy: "
    f"{classification_accuracy:.1f}%"
)

print(
    f"Routing Accuracy: "
    f"{routing_accuracy:.1f}%"
)

print(
    f"Urgency Accuracy: "
    f"{urgency_accuracy:.1f}%"
)

print(
    f"Recommended Action Accuracy: "
    f"{recommended_action_accuracy:.1f}%"
)

print(
    f"Overall Final Test Score: "
    f"{overall_score:.1f}%"
)

print("=" * 70)


# --------------------------------------------------
# SAVE RESULTS
# --------------------------------------------------

with open(RESULTS_FILE, "w") as file:
    json.dump(
        results,
        file,
        indent=2
    )


print(
    f"\nDetailed final test results saved to: "
    f"{RESULTS_FILE}"
)