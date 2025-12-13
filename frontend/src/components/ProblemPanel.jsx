import React from "react";

export default function ProblemPanel({
  problem,
  runResult,
  setRunResult,
  setBattleData,
  setShowIDE,
  onDismiss,
  isFullScreen = false,
  version
}) {
  if (!problem) return null;

  const preStyle = {
    background: "#0f1a12",
    padding: 6,
    borderRadius: 6,
    color: "#bff7a8",
    margin: 0,
    fontFamily: "inherit",
    whiteSpace: "pre-wrap",
    overflowX: "auto",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)"
  };

  // enhanced header style (applies to problem title)
  const headerStyle = {
    color: "#fff7d9",
    background: "linear-gradient(90deg, #2e5f2f 0%, #6aa84f 100%)",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 26,
    letterSpacing: 1,
    padding: "14px 12px",
    borderRadius: 10,
    marginBottom: 18,
    textShadow: "0 4px 18px rgba(0,0,0,0.6)",
    boxShadow: "0 6px 28px rgba(0,0,0,0.45), inset 0 -6px 18px rgba(0,0,0,0.08)"
  };

  const renderInputValue = (input) => {
    if (Array.isArray(input)) {
      return (
        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
          {input.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <pre style={preStyle}>
                {typeof line === "string" ? line : JSON.stringify(line)}
              </pre>
            </div>
          ))}
        </div>
      );
    }

    // Single-line string input
    if (typeof input === "string") {
      return (
        <div style={{ marginTop: 6 }}>
          <pre style={preStyle}>{input}</pre>
        </div>
      );
    }

    // Other types (object / number), stringify them
    return (
      <div style={{ marginTop: 6 }}>
        <pre style={preStyle}>{JSON.stringify(input)}</pre>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .problem-continue-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(40, 167, 69, 0.5) !important;
            background: linear-gradient(135deg, #34d058 0%, #28a745 100%) !important;
          }
          .problem-dismiss-button:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(139, 69, 69, 0.4) !important;
            background: linear-gradient(135deg, #8b4545 0%, #722f2f 100%) !important;
          }

          @keyframes victoryPulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 8px 25px rgba(0,0,0,0.4), inset 0 -6px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 12px 35px rgba(138, 155, 90, 0.6), inset 0 -6px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.15);
            }
          }

          @keyframes buttonShine {
            0% {
              left: -100%;
            }
            50% {
              left: 100%;
            }
            100% {
              left: 100%;
            }
          }
        `}
      </style>

      {/* Victory panel */}
      {runResult && runResult.victoryMessage && (
        <div style={{
          width: isFullScreen ? "auto" : "480px",
          maxHeight: isFullScreen ? "auto" : "80vh",
          transform: isFullScreen ? "translate(-50%, -50%)" : "translateY(20px)",
          position: isFullScreen ? "fixed" : "relative",
          top: isFullScreen ? "50%" : "15px",
          left: isFullScreen ? "50%" : "auto",
          overflow: "auto",
          padding: "24px",
          borderRadius: 14,
          background: "linear-gradient(135deg, #2a3d1a 0%, #1e2f12 50%, #15220a 100%)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 2px rgba(138, 155, 90, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          border: "2px solid #6a8440",
          zIndex: isFullScreen ? 300000 : 220000,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
          backdropFilter: "blur(8px)",
        }}>
          {/* Military-style header with stripes */}
          <div style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: 10,
          }}>
            {/* Decorative stripes */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, transparent 0%, #8a9b5a 20%, #6a8440 50%, #8a9b5a 80%, transparent 100%)",
              borderRadius: "2px 2px 0 0",
            }}></div>
            <div style={{
              position: "absolute",
              bottom: -8,
              left: "10%",
              right: "10%",
              height: 2,
              background: "linear-gradient(90deg, transparent 0%, rgba(138, 155, 90, 0.6) 50%, transparent 100%)",
            }}></div>
          </div>

          {/* Victory Badge/Icon Section */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            padding: "16px",
            background: "linear-gradient(145deg, rgba(138, 155, 90, 0.15) 0%, rgba(106, 132, 64, 0.1) 100%)",
            borderRadius: 12,
            border: "2px solid rgba(138, 155, 90, 0.4)",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative corner elements */}
            <div style={{
              position: "absolute",
              top: -2,
              left: -2,
              width: 16,
              height: 16,
              borderTop: "2px solid #8a9b5a",
              borderLeft: "2px solid #8a9b5a",
              borderRadius: "4px 0 0 0",
            }}></div>
            <div style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 16,
              height: 16,
              borderTop: "2px solid #8a9b5a",
              borderRight: "2px solid #8a9b5a",
              borderRadius: "0 4px 0 0",
            }}></div>
            <div style={{
              position: "absolute",
              bottom: -2,
              left: -2,
              width: 16,
              height: 16,
              borderBottom: "2px solid #8a9b5a",
              borderLeft: "2px solid #8a9b5a",
              borderRadius: "0 0 0 4px",
            }}></div>
            <div style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 16,
              height: 16,
              borderBottom: "2px solid #8a9b5a",
              borderRight: "2px solid #8a9b5a",
              borderRadius: "0 0 4px 0",
            }}></div>

            {/* Victory Icon */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8a9b5a 0%, #6a8440 50%, #4a5d2a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#fff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.4), inset 0 -4px 10px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1)",
              border: "3px solid #9bb068",
              position: "relative",
              animation: "victoryPulse 2s ease-in-out infinite",
            }}>
              🏆
              {/* Subtle inner glow */}
              <div style={{
                position: "absolute",
                top: 8,
                left: 8,
                right: 8,
                bottom: 8,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              }}></div>
            </div>

            {/* Victory Text */}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <div style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#fff",
                marginBottom: 4,
                textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 0 16px rgba(138, 155, 90, 0.4)",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}>
                {version !== 3 ? "Victory" : "Solution Passed"}
              </div>
              <div style={{
                fontSize: 16,
                color: "#dfe7c9",
                opacity: 0.9,
                fontWeight: 600,
                textShadow: "0 1px 4px rgba(0,0,0,0.6)",
              }}>
              </div>
            </div>
          </div>

          {/* Victory Message */}
          <div style={{
            background: "linear-gradient(145deg, rgba(15, 26, 18, 0.8) 0%, rgba(26, 43, 22, 0.6) 100%)",
            padding: 16,
            borderRadius: 10,
            width: "100%",
            color: "#e6f4d7",
            boxShadow: "inset 0 3px 8px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)",
            whiteSpace: "pre-wrap",
            textAlign: "center",
            fontSize: 15,
            lineHeight: 1.6,
            border: "2px solid rgba(138, 155, 90, 0.3)",
            position: "relative",
          }}>
            {/* Message background pattern */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 20% 80%, rgba(138, 155, 90, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(138, 155, 90, 0.05) 0%, transparent 50%)",
              borderRadius: 10,
            }}></div>
            <div style={{
              position: "relative",
              zIndex: 1,
              fontStyle: "italic",
              fontWeight: 500,
            }}>
              {runResult.victoryMessage}
            </div>
          </div>

          {/* Continue Button */}
          <div style={{
            display: "flex",
            gap: 16,
            width: "100%",
            justifyContent: "center",
            marginTop: 8,
          }}>
            <button
              className="problem-continue-button"
              onClick={() => {
                setRunResult(null);
                setBattleData(null);
                setShowIDE(false);
                if (onDismiss) onDismiss();
              }}
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 50%, #17a2b8 100%)",
                color: "#fff",
                border: "3px solid #28a745",
                borderRadius: 10,
                padding: "14px 28px",
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(40, 167, 69, 0.4), inset 0 -4px 8px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                fontSize: 16,
                textTransform: "uppercase",
                letterSpacing: 1,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span style={{ position: "relative", zIndex: 1 }}>
                Continue
              </span>
              {/* Button shine effect */}
              <div style={{
                position: "absolute",
                top: 0,
                left: -100,
                width: 100,
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                animation: "buttonShine 3s ease-in-out infinite",
              }}></div>
            </button>
          </div>
        </div>
      )}

      {/* Result panel (passed/failed) */}
      {runResult && !runResult.victoryMessage && (
        <div style={{
          width: isFullScreen ? "100%" : "470px",
          height: isFullScreen ? "100%" : "calc(100vh - 80px)",
          transform: isFullScreen ? "none" : "translateY(25px)",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: "24px",
          color: "#d2e09e",
          fontFamily: "monospace",
          fontSize: 15,
          borderRadius: 12,
          boxShadow: "0 4px 24px 0 #000b",
          background: "#1a2b16f0",
          zIndex: 200000,
          border: "2px solid #3c5c2b",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{
              color: runResult.passed ? "#aafc7a" : "#ffe97a",
              fontWeight: "bold",
              fontSize: 22,
              letterSpacing: 1,
              textShadow: "0 2px 8px #000, 0 0 2px #7a8c3a"
            }}>
              {runResult.passed === undefined
                ? "Result"
                : runResult.passed
                ? "✅ Passed"
                : "❌ Balabeezo"}
            </span>
            <button
              className="problem-dismiss-button"
              style={{
                background: "linear-gradient(135deg, #6b3a3a 0%, #5a2a2a 100%)",
                color: "#fff",
                border: "2px solid #6b3a3a",
                borderRadius: 8,
                padding: "6px 18px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: 14,
                boxShadow: "0 3px 10px rgba(107, 58, 58, 0.3)",
                transition: "all 0.2s ease"
              }}
              onClick={() => {
                setRunResult(null);
              }}
            >
              ✕ Dismiss
            </button>
          </div>
          {runResult.error && (
            <div style={{
              background: "#2a1a1a",
              border: "1px solid #ff5a5a",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              color: "#ff5a5a",
              fontFamily: "monospace",
              fontSize: 14,
              whiteSpace: "pre-wrap",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)"
            }}>
              <b>❌ Compilation Error</b><br />
              {runResult.error}
            </div>
          )}

          {/* Adaptive Feedback */}
          {runResult.feedback && (
            <div style={{
              marginTop: 12,
              padding: 12,
              background: "#0f1a12",
              borderRadius: 8,
              color: "#e6f6d7",
              fontStyle: "italic",
              border: "1px solid rgba(255,255,255,0.04)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)"
            }}>
              💡 {runResult.feedback}
            </div>
          )}

          {Array.isArray(runResult.outputs) && runResult.outputs.length > 0 && !runResult.error && (
            <div style={{ marginBottom: 12 }}>
              <b style={{ color: "#b4e06c" }}>Test Results:</b>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
                {runResult.outputs.slice(0, 2).map((o, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#0b1510", padding: 10, borderRadius: 8 }}>
                    <div style={{ color: "#9fe085", fontWeight: 800, minWidth: 26, textAlign: "right", paddingTop: 2 }}>{i + 1}.</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "#b4e06c", marginBottom: 6 }}>Input:</div>
                      {renderInputValue(o.input)}

                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 12, color: "#b4e06c", minWidth: 72 }}>Expected:</div>
                        <pre style={{ ...preStyle, display: "inline-block", margin: 0, color: "#ffe97a", padding: "6px 10px", borderRadius: 6 }}>{String(o.expected)}</pre>

                        <div style={{ fontSize: 12, color: "#b4e06c", minWidth: 56 }}>Output:</div>
                        <pre style={{ ...preStyle, display: "inline-block", margin: 0, color: o.passed ? "#aafc7a" : "#ff9b9b", padding: "6px 10px", borderRadius: 6 }}>{String(o.output)}</pre>

                        <div style={{ marginLeft: "auto", fontWeight: 900, color: o.passed ? "#aafc7a" : "#ff9b9b" }}>
                          {o.passed ? "✓" : "✗"}
                        </div>
                      </div>

                      {o.error && <div style={{ color: "#ff5a5a", marginTop: 8 }}>Error: {o.error}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* fallback: legacy single output/expected display */}
          {!runResult.outputs && runResult.output && !runResult.error && (
            <div style={{ marginBottom: 12 }}>
              <b style={{ color: "#b4e06c" }}>Output:</b>
              <pre style={{ ...preStyle, color: "#aafc7a" }}>{runResult.output}</pre>
            </div>
          )}
          {!runResult.outputs && runResult.expected && !runResult.error && (
            <div style={{ marginBottom: 12 }}>
              <b style={{ color: "#b4e06c" }}>Expected:</b>
              <pre style={{ ...preStyle, color: "#ffe97a" }}>{runResult.expected}</pre>
            </div>
          )}
        </div>
      )}

      {/* Default problem panel */}
      {!runResult && (
        <div style={{
          width: isFullScreen ? "100%" : "470px",
          height: isFullScreen ? "100%" : "calc(100vh - 80px)",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: "24px",
          color: "#d2e09e",
          fontFamily: "monospace",
          fontSize: 15,
          transform: isFullScreen ? "none" : "translateY(25px)",
          borderRadius: 12,
          boxShadow: "0 4px 24px 0 #000b",
          background: "#1a2b16f0",
          zIndex: 200000,
          border: "2px solid #3c5c2b",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          <h2 style={headerStyle}>
            {problem.title}
          </h2>
          <div style={{ marginBottom: 12, color: "#e2ffb3", fontSize: 16 }}>
            <b>Description:</b>
            <div style={{ marginTop: 4 }}>{problem.description}</div>
          </div>
          <div style={{ marginBottom: 12, color: "#b4e06c", fontSize: 15 }}>
            <b>Difficulty:</b> <span style={{ color: "#ffe97a" }}>{problem.difficulty}</span>
            <br />
            <b>Topic:</b> <span style={{ color: "#aafc7a" }}>{problem.topic}</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <b style={{ color: "#b4e06c" }}>Examples:</b>
            {problem.testCases && <div style={{ marginTop: 6 }}>
              {problem.testCases.slice(0, 2).map((tc, idx) => (
                <div key={idx} style={{
                  background: "#0f1a12",
                  borderRadius: 8,
                  padding: "10px 12px",
                  marginBottom: 8,
                  color: "#e2ffb3",
                  fontFamily: "monospace",
                  fontSize: 14,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)"
                }}>
                  <div style={{ marginBottom: 6 }}>
                    <b>Input:</b>
                    {renderInputValue(tc.input)}
                  </div>
                  <div>
                    <b>Output:</b>
                    <div style={{ marginTop: 6 }}>
                      <pre style={{ ...preStyle, color: "#ffe97a" }}>{typeof tc.output === "string" ? tc.output : JSON.stringify(tc.output)}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>}
          </div>
        </div>
      )}
    </>
  );
}