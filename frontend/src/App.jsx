import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-lead-qualification-lz2o.onrender.com";

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [executeLoading, setExecuteLoading] = useState(false);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_URL}/leads`);

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();
      const leadList = data.leads || [];

      setLeads(leadList);
      setLoading(false);

      return leadList;
    } catch (err) {
      console.error(err);
      setError("Could not load leads from backend.");
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const totalLeads = leads.length;

  const hotLeads = leads.filter(
    (lead) => lead.classification === "HOT"
  ).length;

  const warmLeads = leads.filter(
    (lead) => lead.classification === "WARM"
  ).length;

  const coldLeads = leads.filter(
    (lead) => lead.classification === "COLD"
  ).length;

  const getClassificationIcon = (classification) => {
    if (classification === "HOT") return "🔥";
    if (classification === "WARM") return "🌤";
    if (classification === "COLD") return "❄️";
    return "";
  };

  const formatText = (text) => {
    if (!text) return "-";

    return text
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setActionMessage("");

    setTimeout(() => {
      document
        .getElementById("lead-details")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const handleReview = async (decision) => {
    if (!selectedLead) return;

    setReviewLoading(true);
    setActionMessage("");

    try {
      const response = await fetch(
        `${API_URL}/leads/${selectedLead.id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            decision,
            notes:
              decision === "approved"
                ? "Approved from dashboard."
                : "Rejected from dashboard.",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Review failed");
      }

      setActionMessage(
        decision === "approved"
          ? "✅ Lead approved successfully."
          : "❌ Lead rejected successfully."
      );

      const refreshedLeads = await fetchLeads();

      const updatedLead = refreshedLeads.find(
        (lead) => lead.id === selectedLead.id
      );

      if (updatedLead) {
        setSelectedLead(updatedLead);
      }
    } catch (err) {
      setActionMessage(`⚠️ ${err.message}`);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedLead) return;

    setExecuteLoading(true);
    setActionMessage("");

    try {
      const response = await fetch(
        `${API_URL}/leads/${selectedLead.id}/execute-action`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Action execution failed"
        );
      }

      setActionMessage(
        "🚀 Action executed successfully."
      );

      const refreshedLeads = await fetchLeads();

      const updatedLead = refreshedLeads.find(
        (lead) => lead.id === selectedLead.id
      );

      if (updatedLead) {
        setSelectedLead(updatedLead);
      }
    } catch (err) {
      setActionMessage(`⚠️ ${err.message}`);
    } finally {
      setExecuteLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="dashboard-container">
        {/* HEADER */}

        <header className="dashboard-header">
          <h1>AI Lead Qualification Dashboard</h1>

          <p>
            Quickly understand lead quality, urgency,
            and recommended next action.
          </p>
        </header>

        {/* KPI CARDS */}

        <section className="kpi-grid">
          <div className="dashboard-card kpi-card">
            <h3>Total Leads</h3>
            <strong>
              {loading ? "..." : totalLeads}
            </strong>
          </div>

          <div className="dashboard-card kpi-card">
            <h3>🔥 Hot Leads</h3>
            <strong>
              {loading ? "..." : hotLeads}
            </strong>
          </div>

          <div className="dashboard-card kpi-card">
            <h3>🌤 Warm Leads</h3>
            <strong>
              {loading ? "..." : warmLeads}
            </strong>
          </div>

          <div className="dashboard-card kpi-card">
            <h3>❄️ Cold Leads</h3>
            <strong>
              {loading ? "..." : coldLeads}
            </strong>
          </div>
        </section>

        {/* RECENT LEADS */}

        <section className="dashboard-card leads-section">
          <div className="section-heading">
            <h2>Recent Leads</h2>

            <p>
              Click any lead to view the AI
              qualification details.
            </p>
          </div>

          {loading && (
            <p className="status-message">
              Loading leads...
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            leads.length === 0 && (
              <div className="empty-state">
                No leads available yet.
              </div>
            )}

          {/* DESKTOP / TABLET TABLE */}

          {!loading &&
            !error &&
            leads.length > 0 && (
              <div className="desktop-table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Score</th>
                      <th>Classification</th>
                      <th>Urgency</th>
                      <th>
                        Recommended Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() =>
                          handleSelectLead(lead)
                        }
                        className={
                          selectedLead?.id ===
                          lead.id
                            ? "selected-row"
                            : ""
                        }
                      >
                        <td>
                          {lead.name || "-"}
                        </td>

                        <td>
                          {lead.company || "-"}
                        </td>

                        <td>
                          {lead.score ?? "-"}
                        </td>

                        <td>
                          {lead.classification ? (
                            <span
                              className={`badge ${lead.classification.toLowerCase()}`}
                            >
                              {getClassificationIcon(
                                lead.classification
                              )}{" "}
                              {
                                lead.classification
                              }
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>
                          {formatText(
                            lead.urgency
                          )}
                        </td>

                        <td>
                          {formatText(
                            lead.recommended_action
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          {/* MOBILE LEAD CARDS */}

          {!loading &&
            !error &&
            leads.length > 0 && (
              <div className="mobile-leads">
                {leads.map((lead) => (
                  <button
                    type="button"
                    className="mobile-lead-card"
                    key={lead.id}
                    onClick={() =>
                      handleSelectLead(lead)
                    }
                  >
                    <div className="mobile-lead-top">
                      <div>
                        <h3>
                          {lead.name || "-"}
                        </h3>

                        <p>
                          {lead.company ||
                            "No company"}
                        </p>
                      </div>

                      {lead.classification && (
                        <span
                          className={`badge ${lead.classification.toLowerCase()}`}
                        >
                          {getClassificationIcon(
                            lead.classification
                          )}{" "}
                          {
                            lead.classification
                          }
                        </span>
                      )}
                    </div>

                    <div className="mobile-lead-details">
                      <div>
                        <span>Score</span>
                        <strong>
                          {lead.score ?? "-"}
                        </strong>
                      </div>

                      <div>
                        <span>Urgency</span>
                        <strong>
                          {formatText(
                            lead.urgency
                          )}
                        </strong>
                      </div>

                      <div className="mobile-action-row">
                        <span>
                          Recommended Action
                        </span>

                        <strong>
                          {formatText(
                            lead.recommended_action
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="view-details">
                      View AI Details →
                    </div>
                  </button>
                ))}
              </div>
            )}
        </section>

        {/* SELECTED LEAD DETAILS */}

        {selectedLead && (
          <section
            id="lead-details"
            className="dashboard-card lead-details-card"
          >
            <div className="lead-details-header">
              <div>
                <p className="eyebrow">
                  LEAD DETAILS
                </p>

                <h2>
                  {selectedLead.name}
                </h2>

                <p className="muted-text">
                  {selectedLead.company ||
                    "No company"}
                </p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setSelectedLead(null)
                }
              >
                ✕ Close
              </button>
            </div>

            {/* PRIMARY METRICS */}

            <div className="detail-grid three-column">
              <div className="detail-box">
                <p className="detail-label">
                  Lead Score
                </p>

                <h2>
                  {selectedLead.score ?? "-"}

                  {selectedLead.score != null
                    ? " / 100"
                    : ""}
                </h2>
              </div>

              <div className="detail-box">
                <p className="detail-label">
                  Classification
                </p>

                {selectedLead.classification ? (
                  <span
                    className={`badge large-badge ${selectedLead.classification.toLowerCase()}`}
                  >
                    {getClassificationIcon(
                      selectedLead.classification
                    )}{" "}
                    {
                      selectedLead.classification
                    }
                  </span>
                ) : (
                  "-"
                )}
              </div>

              <div className="detail-box">
                <p className="detail-label">
                  Urgency
                </p>

                <h3>
                  {formatText(
                    selectedLead.urgency
                  )}
                </h3>
              </div>
            </div>

            {/* CONTACT */}

            <div className="detail-grid two-column">
              <div className="detail-box">
                <p className="detail-label">
                  Email
                </p>

                <p className="detail-value break-text">
                  {selectedLead.email || "-"}
                </p>
              </div>

              <div className="detail-box">
                <p className="detail-label">
                  Phone
                </p>

                <p className="detail-value">
                  {selectedLead.phone || "-"}
                </p>
              </div>
            </div>

            {/* CUSTOMER MESSAGE */}

            <div className="detail-box">
              <p className="detail-label">
                Customer Message
              </p>

              <p className="detail-value">
                {selectedLead.message || "-"}
              </p>
            </div>

            {/* AI INTENT */}

            <div className="detail-box spaced-box">
              <p className="detail-label">
                🧠 AI Intent
              </p>

              <p className="detail-value">
                {selectedLead.intent || "-"}
              </p>
            </div>

            {/* AI SUMMARY */}

            <div className="detail-box spaced-box">
              <p className="detail-label">
                🤖 AI Summary
              </p>

              <p className="detail-value">
                {selectedLead.ai_summary || "-"}
              </p>
            </div>

            {/* RECOMMENDED ACTION */}

            <div className="detail-box spaced-box">
              <p className="detail-label">
                Recommended Action
              </p>

              <h3>
                {formatText(
                  selectedLead.recommended_action
                )}
              </h3>
            </div>

            {/* WORKFLOW STATUS */}

            <div className="detail-grid two-column spaced-grid">
              <div className="detail-box">
                <p className="detail-label">
                  Workflow Status
                </p>

                <p className="detail-value">
                  {formatText(
                    selectedLead.workflow_route
                  )}
                </p>
              </div>

              <div className="detail-box">
                <p className="detail-label">
                  Review Status
                </p>

                <p className="detail-value">
                  {formatText(
                    selectedLead.review_status
                  )}
                </p>
              </div>
            </div>

            {/* HUMAN REVIEW */}

            {selectedLead.workflow_route ===
              "awaiting_human_review" && (
              <div className="action-section">
                <h3>
                  Human Review Required
                </h3>

                <p>
                  This HOT lead is waiting for
                  your decision.
                </p>

                <div className="action-buttons">
                  <button
                    type="button"
                    disabled={reviewLoading}
                    onClick={() =>
                      handleReview("approved")
                    }
                    className="approve-button"
                  >
                    {reviewLoading
                      ? "Processing..."
                      : "✓ Approve Lead"}
                  </button>

                  <button
                    type="button"
                    disabled={reviewLoading}
                    onClick={() =>
                      handleReview("rejected")
                    }
                    className="reject-button"
                  >
                    ✕ Reject Lead
                  </button>
                </div>
              </div>
            )}

            {/* EXECUTE */}

            {selectedLead.workflow_route ===
              "approved_for_action" && (
              <div className="action-section">
                <h3>Approved Lead</h3>

                <p>
                  This lead is approved and ready
                  for action.
                </p>

                <button
                  type="button"
                  disabled={executeLoading}
                  onClick={handleExecuteAction}
                  className="execute-button"
                >
                  {executeLoading
                    ? "Executing..."
                    : "▶ Execute Action"}
                </button>
              </div>
            )}

            {/* COMPLETED */}

            {selectedLead.workflow_route ===
              "action_executed" && (
              <div className="completed-box">
                <strong>
                  ✓ Action Completed
                </strong>

                <p>
                  This lead&apos;s approved action
                  has already been executed.
                </p>
              </div>
            )}

            {actionMessage && (
              <div className="action-message">
                {actionMessage}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default App;