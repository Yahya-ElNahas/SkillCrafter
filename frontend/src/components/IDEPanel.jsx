import MonacoEditor from "@monaco-editor/react";
import React from "react";

export default function IDEPanel({
  solutionCode,
  selectedLanguage,
  setSelectedLanguage,
  handleRun,
  handleRequestHint,
  isRunning,
  hintLoading,
  battleData,
  setGetCode,
  version,
  isFullScreen = false
}) {
  return (
    <div
      style={{
        position: isFullScreen ? "absolute" : "fixed",
        top: isFullScreen ? 0 : 70,
        right: isFullScreen ? 0 : 20,
        width: isFullScreen ? "100%" : "650px",
        height: isFullScreen ? "100%" : "calc(100vh - 80px)",
        background: "#001E04",
        borderRadius: 12,
        boxShadow: "0 4px 24px 0 #000b",
        zIndex: 200000,
        display: "flex",
        flexDirection: "column",
        border: "2px solid #333",
      }}
    >
      <style>
        {`
          .ide-run-button:hover:not(:disabled) {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(40, 167, 69, 0.5) !important;
            background: linear-gradient(135deg, #34d058 0%, #28a745 100%) !important;
          }
          .ide-help-button:hover:not(:disabled) {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4) !important;
            background: linear-gradient(135deg, #ffca2c 0%, #ffc107 100%) !important;
          }
          .ide-cancel-button:hover:not(:disabled) {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4) !important;
            background: linear-gradient(135deg, #e74c3c 0%, #dc3545 100%) !important;
          }
        `}
      </style>
      <div
        style={{
          padding: "16px 20px",
          color: "#fff",
          fontWeight: "bold",
          borderBottom: "2px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: "linear-gradient(90deg, #002006 0%, #001804 50%, #002006 100%)",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          <span style={{ fontSize: "16px", color: "#e6f6d7" }}>
            {version != 3 ? (battleData.attacker? "Solve to win the battle" : "Solve to create unit") : "Solve the problem"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="ide-run-button"
            style={{
              background: isRunning ? "#666" : "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              color: "#fff",
              border: "2px solid #28a745",
              borderRadius: 8,
              padding: "8px 20px",
              fontWeight: "bold",
              fontSize: 16,
              cursor: isRunning ? "wait" : "pointer",
              boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
              transition: "all 0.2s ease",
              minWidth: "80px"
            }}
            onClick={() => handleRun(false)}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "▶ Run"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {version != 2 && <button
            className="ide-help-button"
            style={{
              background: hintLoading ? "#666" : "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)",
              color: "#222",
              border: "2px solid #ffc107",
              borderRadius: 8,
              padding: "6px 16px",
              fontWeight: "bold",
              fontSize: 14,
              cursor: hintLoading ? "wait" : "pointer",
              boxShadow: "0 3px 10px rgba(255, 193, 7, 0.3)",
              transition: "all 0.2s ease"
            }}
            onClick={handleRequestHint}
            disabled={hintLoading}
          >
            {hintLoading ? "Requesting..." : "💡 Help"}
          </button>}
          <button
            className="ide-cancel-button"
            style={{
              background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
              color: "#fff",
              border: "2px solid #dc3545",
              borderRadius: 8,
              padding: "6px 16px",
              fontWeight: "bold",
              fontSize: 14,
              cursor: isRunning ? "wait" : "pointer",
              boxShadow: "0 3px 10px rgba(220, 53, 69, 0.3)",
              transition: "all 0.2s ease"
            }}
            disabled={isRunning}
            onClick={() => handleRun(true)}
          >
            {version != 3 ? (battleData.attacker && battleData.attacker.faction === "enemy" ? "🏃 Retreat" : "❌ Cancel") : "❌ Cancel"}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MonacoEditor
          height="100%"
          width="100%"
          language={selectedLanguage}
          theme="vs-dark"
          value={solutionCode}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            padding: { top: 8, bottom: 8, left: 4, right: 4 },
          }}
          onMount={(editor) => {
            setGetCode(() => () => editor.getValue());
          }}
        />
      </div>
    </div>
  );
}