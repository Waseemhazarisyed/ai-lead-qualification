import { useEffect, useState } from "react";

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

      setLeads(data.leads || []);
      setLoading(false);

      return data.leads || [];
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

  const getBadgeStyle = (classification) => {
    if (classification === "HOT") return hotBadge;
    if (classification === "WARM") return warmBadge;
    return coldBadge;
  };

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
            decision: decision,
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
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "40px",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
            color: "#ffffff",
          }}
        >
          AI Lead Qualification Dashboard
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Quickly understand lead quality, urgency, and recommended next action.
        </p>

        {/* KPI CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "30px",
          }}
        >
          <div style={cardStyle}>
            <h3 style={labelStyle}>Total Leads</h3>
            <h2 style={numberStyle}>
              {loading ? "..." : totalLeads}
            </h2>
          </div>

          <div style={cardStyle}>
            <h3 style={labelStyle}>🔥 Hot Leads</h3>
            <h2 style={numberStyle}>
              {loading ? "..." : hotLeads}
            </h2>
          </div>

          <div style={cardStyle}>
            <h3 style={labelStyle}>🌤 Warm Leads</h3>
            <h2 style={numberStyle}>
              {loading ? "..." : warmLeads}
            </h2>
          </div>

          <div style={cardStyle}>
            <h3 style={labelStyle}>❄️ Cold Leads</h3>
            <h2 style={numberStyle}>
              {loading ? "..." : coldLeads}
            </h2>
          </div>
        </div>

        {/* LEADS TABLE */}

        <div style={cardStyle}>
          <h2
            style={{
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            Recent Leads
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            Click any lead to view the AI qualification details.
          </p>

          {loading && (
            <p style={{ color: "#94a3b8" }}>
              Loading leads...
            </p>
          )}

          {error && (
            <p style={{ color: "#fca5a5" }}>
              {error}
            </p>
          )}

          {!loading && !error && leads.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={headerCell}>Name</th>
                    <th style={headerCell}>Company</th>
                    <th style={headerCell}>Score</th>
                    <th style={headerCell}>
                      Classification
                    </th>
                    <th style={headerCell}>Urgency</th>
                    <th style={headerCell}>
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
                      style={{
                        cursor: "pointer",
                        background:
                          selectedLead?.id === lead.id
                            ? "#273449"
                            : "transparent",
                      }}
                    >
                      <td style={tableCell}>
                        {lead.name || "-"}
                      </td>

                      <td style={tableCell}>
                        {lead.company || "-"}
                      </td>

                      <td style={tableCell}>
                        {lead.score ?? "-"}
                      </td>

                      <td style={tableCell}>
                        {lead.classification ? (
                          <span
                            style={getBadgeStyle(
                              lead.classification
                            )}
                          >
                            {getClassificationIcon(
                              lead.classification
                            )}{" "}
                            {lead.classification}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td style={tableCell}>
                        {formatText(lead.urgency)}
                      </td>

                      <td style={tableCell}>
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
        </div>

        {/* LEAD DETAILS */}

        {selectedLead && (
          <div
            style={{
              ...cardStyle,
              marginTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#94a3b8",
                    margin: 0,
                    fontSize: "14px",
                  }}
                >
                  LEAD DETAILS
                </p>

                <h2
                  style={{
                    color: "#ffffff",
                    margin: "6px 0",
                  }}
                >
                  {selectedLead.name}
                </h2>

                <p
                  style={{
                    color: "#94a3b8",
                    margin: 0,
                  }}
                >
                  {selectedLead.company || "No company"}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedLead(null)
                }
                style={closeButton}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "25px",
              }}
            >
              <div style={detailBox}>
                <p style={detailLabel}>
                  Lead Score
                </p>

                <h2
                  style={{
                    margin: 0,
                    color: "#ffffff",
                  }}
                >
                  {selectedLead.score ?? "-"}
                  {selectedLead.score != null
                    ? " / 100"
                    : ""}
                </h2>
              </div>

              <div style={detailBox}>
                <p style={detailLabel}>
                  Classification
                </p>

                {selectedLead.classification ? (
                  <span
                    style={{
                      ...getBadgeStyle(
                        selectedLead.classification
                      ),
                      display: "inline-block",
                      marginTop: "5px",
                    }}
                  >
                    {getClassificationIcon(
                      selectedLead.classification
                    )}{" "}
                    {selectedLead.classification}
                  </span>
                ) : (
                  "-"
                )}
              </div>

              <div style={detailBox}>
                <p style={detailLabel}>
                  Urgency
                </p>

                <h3
                  style={{
                    margin: 0,
                    color: "#ffffff",
                  }}
                >
                  {formatText(
                    selectedLead.urgency
                  )}
                </h3>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div style={detailBox}>
                <p style={detailLabel}>
                  Email
                </p>

                <p style={detailValue}>
                  {selectedLead.email || "-"}
                </p>
              </div>

              <div style={detailBox}>
                <p style={detailLabel}>
                  Phone
                </p>

                <p style={detailValue}>
                  {selectedLead.phone || "-"}
                </p>
              </div>
            </div>

            <div style={detailBox}>
              <p style={detailLabel}>
                Customer Message
              </p>

              <p style={detailValue}>
                {selectedLead.message || "-"}
              </p>
            </div>

            <div
              style={{
                ...detailBox,
                marginTop: "16px",
              }}
            >
              <p style={detailLabel}>
                🧠 AI Intent
              </p>

              <p style={detailValue}>
                {selectedLead.intent || "-"}
              </p>
            </div>

            <div
              style={{
                ...detailBox,
                marginTop: "16px",
              }}
            >
              <p style={detailLabel}>
                🤖 AI Summary
              </p>

              <p style={detailValue}>
                {selectedLead.ai_summary || "-"}
              </p>
            </div>

            <div
              style={{
                ...detailBox,
                marginTop: "16px",
              }}
            >
              <p style={detailLabel}>
                Recommended Action
              </p>

              <h3
                style={{
                  margin: 0,
                  color: "#ffffff",
                }}
              >
                {formatText(
                  selectedLead.recommended_action
                )}
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <div style={detailBox}>
                <p style={detailLabel}>
                  Workflow Status
                </p>

                <p style={detailValue}>
                  {formatText(
                    selectedLead.workflow_route
                  )}
                </p>
              </div>

              <div style={detailBox}>
                <p style={detailLabel}>
                  Review Status
                </p>

                <p style={detailValue}>
                  {formatText(
                    selectedLead.review_status
                  )}
                </p>
              </div>
            </div>

            {/* APPROVE / REJECT */}

            {selectedLead.workflow_route ===
              "awaiting_human_review" && (
              <div
                style={{
                  marginTop: "25px",
                  paddingTop: "25px",
                  borderTop:
                    "1px solid #334155",
                }}
              >
                <h3
                  style={{
                    color: "#ffffff",
                    marginBottom: "8px",
                  }}
                >
                  Human Review Required
                </h3>

                <p
                  style={{
                    color: "#94a3b8",
                    marginBottom: "18px",
                  }}
                >
                  This HOT lead is waiting for your decision.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    disabled={reviewLoading}
                    onClick={() =>
                      handleReview("approved")
                    }
                    style={approveButton}
                  >
                    {reviewLoading
                      ? "Processing..."
                      : "✓ Approve Lead"}
                  </button>

                  <button
                    disabled={reviewLoading}
                    onClick={() =>
                      handleReview("rejected")
                    }
                    style={rejectButton}
                  >
                    ✕ Reject Lead
                  </button>
                </div>
              </div>
            )}

            {/* EXECUTE ACTION */}

            {selectedLead.workflow_route ===
              "approved_for_action" && (
              <div
                style={{
                  marginTop: "25px",
                  paddingTop: "25px",
                  borderTop:
                    "1px solid #334155",
                }}
              >
                <h3
                  style={{
                    color: "#ffffff",
                    marginBottom: "8px",
                  }}
                >
                  Approved Lead
                </h3>

                <p
                  style={{
                    color: "#94a3b8",
                    marginBottom: "18px",
                  }}
                >
                  This lead is approved and ready for action.
                </p>

                <button
                  disabled={executeLoading}
                  onClick={handleExecuteAction}
                  style={executeButton}
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
              <div
                style={{
                  marginTop: "25px",
                  padding: "18px",
                  background: "#052e16",
                  border:
                    "1px solid #166534",
                  borderRadius: "12px",
                }}
              >
                <strong
                  style={{
                    color: "#86efac",
                  }}
                >
                  ✓ Action Completed
                </strong>

                <p
                  style={{
                    color: "#bbf7d0",
                    marginBottom: 0,
                  }}
                >
                  This lead's approved action has already been executed.
                </p>
              </div>
            )}

            {actionMessage && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px",
                  background: "#0f172a",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                }}
              >
                {actionMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


/* ------------------- */
/* STYLES              */
/* ------------------- */

const cardStyle = {
  background: "#1e293b",
  borderRadius: "14px",
  padding: "20px",
  border: "1px solid #334155",
  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
};

const labelStyle = {
  color: "#cbd5e1",
  marginBottom: "8px",
};

const numberStyle = {
  color: "#ffffff",
  fontSize: "30px",
};

const headerCell = {
  padding: "14px",
  color: "#94a3b8",
  borderBottom: "1px solid #334155",
};

const tableCell = {
  padding: "14px",
  color: "#e5e7eb",
  borderBottom: "1px solid #334155",
};

const hotBadge = {
  background: "#7f1d1d",
  color: "#fecaca",
  padding: "6px 10px",
  borderRadius: "999px",
  fontWeight: "bold",
};

const warmBadge = {
  background: "#78350f",
  color: "#fde68a",
  padding: "6px 10px",
  borderRadius: "999px",
  fontWeight: "bold",
};

const coldBadge = {
  background: "#164e63",
  color: "#bae6fd",
  padding: "6px 10px",
  borderRadius: "999px",
  fontWeight: "bold",
};

const detailBox = {
  background: "#0f172a",
  border: "1px solid #334155",
  padding: "18px",
  borderRadius: "12px",
};

const detailLabel = {
  color: "#94a3b8",
  margin: "0 0 8px 0",
  fontSize: "13px",
  fontWeight: "bold",
  textTransform: "uppercase",
};

const detailValue = {
  color: "#e5e7eb",
  margin: 0,
  lineHeight: "1.6",
};

const approveButton = {
  background: "#166534",
  color: "#dcfce7",
  border: "1px solid #22c55e",
  padding: "12px 20px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
};

const rejectButton = {
  background: "#7f1d1d",
  color: "#fee2e2",
  border: "1px solid #ef4444",
  padding: "12px 20px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
};

const executeButton = {
  background: "#1d4ed8",
  color: "#dbeafe",
  border: "1px solid #3b82f6",
  padding: "12px 20px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
};

const closeButton = {
  background: "#334155",
  color: "#ffffff",
  border: "none",
  padding: "9px 14px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default App;