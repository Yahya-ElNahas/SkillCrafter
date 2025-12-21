import React from "react";

export default function HintPopup({ hint, onClose, show, isFullScreen = false }) {
  if (!hint || !show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: isFullScreen ? "65px" : "50%",
        left: isFullScreen ? "5px" : "50%",
        transform: isFullScreen ? "none" : "translate(-70%, -50%)",
        zIndex: 300001,
        background: "linear-gradient(135deg, #2F4F2F 0%, #3B5B3B 50%, #4A5D23 100%)",
        color: "#F5F5DC",
        borderRadius: 16,
        padding: "24px 28px",
        fontSize: 16,
        fontFamily: "'Courier New', monospace",
        // border: "4px solid #8B4513",
        boxShadow: isFullScreen 
          ? "0 25px 60px rgba(0,0,0,0.8), 0 0 0 2px #654321, inset 0 1px 0 rgba(255,255,255,0.1)" 
          : "0 20px 40px rgba(0,0,0,0.6), 0 0 0 2px #654321, inset 0 1px 0 rgba(255,255,255,0.1)",
        minWidth: 340,
        maxWidth: isFullScreen ? "40vw" : "30vw",
        maxHeight: "80vh",
        textAlign: "center",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        backdropFilter: "blur(20px)",
        overflow: "hidden"
      }}
    >
      {/* Military camouflage pattern overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(101, 67, 33, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(74, 93, 35, 0.15) 0%, transparent 40%),
          linear-gradient(45deg, transparent 40%, rgba(139, 69, 19, 0.05) 50%, transparent 60%)
        `,
        pointerEvents: "none",
        opacity: 0.7
      }}></div>

      {/* Military border accents */}
      <div style={{
        position: "absolute",
        top: 8,
        left: 8,
        right: 8,
        bottom: 8,
        border: "2px solid rgba(218, 165, 32, 0.3)",
        borderRadius: 12,
        pointerEvents: "none"
      }}></div>


      {/* Header with icon and close button */}
      <div style={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 8,
        position: "relative",
        zIndex: 2
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8,
          fontSize: 18,
          fontWeight: 700,
          color: "#fff7d9",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)"
        }}>
          💡
          <span>Hint</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "2px solid rgba(255,255,255,0.2)",
            color: "#e6f6d7",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            borderRadius: 50,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.2)";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.1)";
            e.target.style.transform = "scale(1)";
          }}
          aria-label="Close hint"
          title="Close"
        >
          ×
        </button>
      </div>

      {/* Hint content */}
      <div style={{ 
        position: "relative",
        zIndex: 2,
        lineHeight: 1.6,
        wordBreak: "break-word",
        background: "rgba(255,255,255,0.05)",
        padding: "16px 20px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
        width: "100%",
        textAlign: "left",
        maxHeight: "50vh",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(218, 165, 32, 0.3) rgba(255,255,255,0.1)"
      }}>
        {hint}
      </div>
    </div>
  );
}