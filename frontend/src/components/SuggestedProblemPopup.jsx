import React from "react";

export default function SuggestedProblemPopup({ show }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "18%",
        left: "50%",
        transform: "translate(-50%, 0)",
        background: "#fffbe6",
        color: "#7a8c3a",
        borderRadius: 12,
        padding: "18px 32px",
        fontSize: 20,
        fontWeight: "bold",
        boxShadow: "0 4px 24px #b4e06c33",
        border: "2px solid #b4e06c",
        zIndex: 500000,
        textAlign: "center",
        pointerEvents: "none",
        animation: "fadeInOut 3.5s"
      }}
    >
      We recommend solving this problem first!
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}