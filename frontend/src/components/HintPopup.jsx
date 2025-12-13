import React from "react";

export default function HintPopup({ hint, onClose, show, isFullScreen = false }) {
  if (!hint || !show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: isFullScreen ? "50%" : "50%",
        left: isFullScreen ? "20%" : "50%",
        transform: isFullScreen ? "translate(-50%, -50%)" : "translate(-75%, -60%)",
        zIndex: 300001,
        background: "#f3ffe6",
        color: "#2d3a2e",
        borderRadius: 12,
        padding: "18px 24px 18px 24px",
        fontSize: 17,
        fontFamily: "monospace",
        border: isFullScreen ? "2px solid rgba(30,40,20,0.6)" : "2px solid #b4e06c44",
        boxShadow: isFullScreen ? "0 18px 50px rgba(0,0,0,0.5)" : "0 4px 24px #b4e06c33",
        minWidth: 260,
        maxWidth: isFullScreen ? "35vw" : "22vw",
        textAlign: "center",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#7a8c3a",
            fontWeight: "bold",
            fontSize: 22,
            cursor: "pointer",
            marginRight: -8,
            marginTop: -8,
          }}
          aria-label="Close hint"
          title="Close"
        >
          ×
        </button>
      </div>
      <b style={{ color: "#7a8c3a", fontSize: 19, marginBottom: 4 }}>Hint</b>
      <div style={{ marginTop: 6, wordBreak: "break-word" }}>{hint}</div>
    </div>
  );
}