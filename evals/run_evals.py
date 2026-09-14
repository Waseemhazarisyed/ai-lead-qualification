import json
from pathlib import Path

from app.workflow.graph import lead_workflow


TEST_CASES_PATH = Path(__file__).parent / "test_cases.json"


def load_test_cases():
    with open(TEST_CASES_PATH, "r") as file:
        return json.load(file)


def run_eval_case(test_case):
    workflow_state = {
        "lead_id": test_case["id"],
        "name": test_case["name"],
        "email": test_case["email"],
        "company": test_case["company"],
        "company_size": test_case["company_size"],
        "service_interest": test_case["service_interest"],
        "budget": test_case["budget"],
        "message": test_case["message"],

        "score": None,
        "classification": None,

        "intent": None,
        "urgency": None,
        "ai_summary": None,
        "recommended_action": None,

        "route": None
    }

    result = lead_workflow.invoke(workflow_state)

    classification_correct = (
        result["classification"]
        == test_case["expected_classification"]
    )

    route_correct = (
        result["route"]
        == test_case["expected_route"]
    )

    urgency_correct = (
        result["urgency"]
        == test_case["expected_urgency"]
    )

    recommended_action_correct = (
        result["recommended_action"]
        == test_case["expected_recommended_action"]
    )

    return {
        "id": test_case["id"],
        "name": test_case["name"],

        "expected_classification":
            test_case["expected_classification"],
        "actual_classification":
            result["classification"],
        "classification_correct":
            classification_correct,

        "expected_route":
            test_case["expected_route"],
        "actual_route":
            result["route"],
        "route_correct":
            route_correct,

        "expected_urgency":
            test_case["expected_urgency"],
        "actual_urgency":
            result["urgency"],
        "urgency_correct":
            urgency_correct,

        "expected_recommended_action":
            test_case["expected_recommended_action"],
        "actual_recommended_action":
            result["recommended_action"],
        "recommended_action_correct":
            recommended_action_correct,

        "score":
            result["score"],

        "intent":
            result["intent"],

        "ai_summary":
            result["ai_summary"]
    }


def main():
    test_cases = load_test_cases()

    results = []

    classification_correct_count = 0
    route_correct_count = 0
    urgency_correct_count = 0
    recommended_action_correct_count = 0

    print("\n")
    print("=" * 75)
    print("AI LEAD QUALIFICATION EVALUATION")
    print("=" * 75)

    for test_case in test_cases:
        result = run_eval_case(test_case)

        results.append(result)

        if result["classification_correct"]:
            classification_correct_count += 1

        if result["route_correct"]:
            route_correct_count += 1

        if result["urgency_correct"]:
            urgency_correct_count += 1

        if result["recommended_action_correct"]:
            recommended_action_correct_count += 1

        classification_icon = (
            "✅"
            if result["classification_correct"]
            else "❌"
        )

        route_icon = (
            "✅"
            if result["route_correct"]
            else "❌"
        )

        urgency_icon = (
            "✅"
            if result["urgency_correct"]
            else "❌"
        )

        recommended_action_icon = (
            "✅"
            if result["recommended_action_correct"]
            else "❌"
        )

        print(f"\nTest Case {result['id']}: {result['name']}")

        print(
            f"{classification_icon} Classification: "
            f"Expected={result['expected_classification']} | "
            f"Actual={result['actual_classification']}"
        )

        print(
            f"{route_icon} Route: "
            f"Expected={result['expected_route']} | "
            f"Actual={result['actual_route']}"
        )

        print(
            f"{urgency_icon} Urgency: "
            f"Expected={result['expected_urgency']} | "
            f"Actual={result['actual_urgency']}"
        )

        print(
            f"{recommended_action_icon} Recommended Action: "
            f"Expected={result['expected_recommended_action']} | "
            f"Actual={result['actual_recommended_action']}"
        )

        print(
            f"   Score: {result['score']}"
        )

        print(
            f"   Intent: {result['intent']}"
        )

        print(
            f"   AI Summary: {result['ai_summary']}"
        )

    total_cases = len(test_cases)

    classification_accuracy = (
        classification_correct_count
        / total_cases
        * 100
    )

    route_accuracy = (
        route_correct_count
        / total_cases
        * 100
    )

    urgency_accuracy = (
        urgency_correct_count
        / total_cases
        * 100
    )

    recommended_action_accuracy = (
        recommended_action_correct_count
        / total_cases
        * 100
    )

    overall_accuracy = (
        classification_accuracy
        + route_accuracy
        + urgency_accuracy
        + recommended_action_accuracy
    ) / 4

    print("\n")
    print("=" * 75)
    print("FINAL RESULTS")
    print("=" * 75)

    print(
        f"Total Test Cases: {total_cases}"
    )

    print(
        f"Classification Accuracy: "
        f"{classification_accuracy:.1f}%"
    )

    print(
        f"Routing Accuracy: "
        f"{route_accuracy:.1f}%"
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
        f"Overall Eval Score: "
        f"{overall_accuracy:.1f}%"
    )

    print("=" * 75)

    results_path = (
        Path(__file__).parent
        / "results.json"
    )

    with open(results_path, "w") as file:
        json.dump(
            results,
            file,
            indent=2
        )

    print(
        f"\nDetailed results saved to: "
        f"{results_path}"
    )


if __name__ == "__main__":
    main()