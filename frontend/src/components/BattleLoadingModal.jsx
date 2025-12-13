import React from "react";

export default function BattleLoadingModal({ show, version }) {
  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.65)", zIndex: 400000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "linear-gradient(180deg, #2f3b20 0%, #27321a 100%)",
        borderRadius: 14,
        padding: 28,
        minWidth: 360,
        boxShadow: "0 14px 48px rgba(0,0,0,0.6), inset 0 -6px 18px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "2px solid rgba(74,91,43,0.9)"
      }}>
        {/* header stripe / insignia */}
        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 12
        }}>
          <div style={{
            width: 76,
            height: 76,
            borderRadius: 12,
            background: "linear-gradient(180deg,#788a4f,#526233)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f3f5de",
            fontSize: 34,
            boxShadow: "0 8px 18px rgba(0,0,0,0.45), inset 0 -6px 12px rgba(255,255,255,0.04)"
          }}>
            {version != 3 ?"🪖" : "🤔"}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f3f5de", marginBottom: 4 }}>{version != 3 ?"Deploying Forces" : "Generating a Problem"}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6 }}>
          <div className="battle-spinner" style={{
            width: 52, height: 52,
            border: "6px solid rgba(152,168,110,0.22)",
            borderTop: "6px solid #b4e06c",
            borderRight: "6px solid #9aa95a",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }} />
          <div style={{ color: "#edf0d6", fontWeight: "700", fontSize: 16 }}>Preparing your problem...</div>
        </div>

        <div style={{ color: "#bfcaa2", fontSize: 13, marginTop: 12, textAlign: "center", maxWidth: 300 }}>
          {version != 2 ? "Your personalized AI tutor is selecting a problem for you — please stand by." : "Preparing your problem — please stand by."}
        </div>

        <div style={{ marginTop: 18, width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{
            height: 8,
            width: "70%",
            background: "linear-gradient(90deg,#4b5f2b,#6f8a45)",
            borderRadius: 8,
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.3)"
          }} />
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}