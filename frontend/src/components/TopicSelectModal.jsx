import React from "react";

export default function TopicSelectModal({
  show,
  availableTopics,
  onSelect,
  onCancel,
  isAIAttack = false,
  version
}) {
  if (!show) return null;

  const buttonStyle = {
    padding: "16px 24px",
    borderRadius: 12,
    border: "2px solid rgba(255,255,255,0.1)",
    background: "linear-gradient(135deg,#5f773b 0%,#4a612b 100%)",
    color: "#eef4d9",
    fontWeight: "800",
    fontSize: 18,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    transition: "all 0.2s ease",
    textAlign: "left"
  };

  return (
    <div style={{
      position: "fixed",
      top: 30, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.66)", zIndex: 300000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <style>
        {`
          .topic-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 12px 28px rgba(0,0,0,0.5) !important;
            background: linear-gradient(135deg,#6f873b 0%,#5a712b 100%) !important;
          }
          .cancel-button:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important;
            background: linear-gradient(135deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.04) 100%) !important;
            border-color: rgba(255,255,255,0.25) !important;
          }
        `}
      </style>
      <div style={{
        background: "linear-gradient(180deg,#394b25 0%, #2c3a1c 100%)",
        borderRadius: 16,
        padding: 28,
        minWidth: 380,
        boxShadow: "0 12px 40px rgba(0,0,0,0.6), inset 0 -6px 12px rgba(255,255,255,0.03)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "2px solid rgba(64,84,40,0.9)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, width: "100%", justifyContent: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 10,
            background: "linear-gradient(180deg,#7c8f4f,#5b6d35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#f3f6df", fontSize: 30, boxShadow: "0 6px 18px rgba(0,0,0,0.4)"
          }}>{version != 3 ? "🪖" : "📚"}</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#f3f6df" }}>
              {version != 3 ? (isAIAttack ? "The Enemy is attacking you" : "Select Mission Topic") : "Select Topic"}
            </div>
            <div style={{ fontSize: 12, color: "#d7e2b9" }}>
              Choose a topic to practice on
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginTop: 6 }}>
          {availableTopics.map((topic, index) => {
            const icons = ["🔢", "📝", "🔀", "🔄", "⚙️"]; // Icons for data types, strings, conditions, loops, methods
            return (
              <button
                key={topic}
                className="topic-button"
                onClick={() => onSelect(topic)}
                style={buttonStyle}
              >
                <span>{icons[index] || "📚"} {topic}</span>
                <span style={{ fontSize: "20px" }}>▶️</span>
              </button>
            );
          })}
        </div>

        {version != 3 && <button
          onClick={onCancel}
          className="cancel-button"
          style={{
            marginTop: 20,
            padding: "14px 32px",
            borderRadius: 12,
            border: "2px solid rgba(255,255,255,0.15)",
            background: "linear-gradient(135deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%)",
            color: "#dfe7c8",
            fontWeight: "800",
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>❌</span>
          <span>Cancel</span>
        </button>}
      </div>
    </div>
  );
}