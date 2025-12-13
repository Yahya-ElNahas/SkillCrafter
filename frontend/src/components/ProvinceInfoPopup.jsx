import React from "react";

export default function ProvinceInfoPopup({ province, show, onCreateUnit, showProvinceTutorialStep2 }) {
  if (!province || !show) return null;

  const isAlliedController = province.controller === "allied" || province.controller === "player";
  const canCreateInfantry = onCreateUnit && isAlliedController && province.type === "barracks";
  const canCreateArmor = onCreateUnit && isAlliedController && province.type === "factory";

  return (
    <div
      style={{
        position: "fixed",
        right: "30px",
        bottom: "30px",
        background: "#222222",
        color: "#fff",
        borderRadius: 12,
        padding: "12px 20px",
        fontSize: 13,
        fontFamily: "sans-serif",
        fontWeight: "bold",
        boxShadow: "0 4px 24px 0 #000b",
        border: province.controller === "enemy" ? "3px solid #791010" : "3px solid #64B570",
        zIndex: 99999,
        minWidth: 120,
        textAlign: "left",
        letterSpacing: 1,
        pointerEvents: "auto",
      }}
    >
      {/* Tutorial Arrow for Step 2 */}
      {showProvinceTutorialStep2 && (canCreateInfantry || canCreateArmor) && (
        <div style={{
          position: "absolute",
          top: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 100000,
        }}>
          <style>{`@keyframes createFloat {0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}
            .create-arrow{animation:createFloat 1.2s ease-in-out infinite;font-size:22px;color:#bde7b0;text-shadow:0 2px 8px rgba(0,0,0,0.8);line-height:1}
            .create-bubble{background:#0f1a12;border:1px solid rgba(255,255,255,0.04);color:#e6f6d7;padding:8px 10px;border-radius:10px;font-size:14px;white-space:nowrap;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.5);}
          `}</style>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div className="create-bubble">Click to create new unit</div>
            <div className="create-arrow">▼</div>
          </div>
        </div>
      )}

      {/* Create unit button placed above the info */}
      {(canCreateInfantry || canCreateArmor) && (
        <div style={{ marginBottom: 10 }}>
          <button
            id={`create-unit-${province.id}`}
            data-create-unit-button={province.id}
            onClick={() => {
              // emit a DOM event so other components (tutorial overlays) can react
              try {
                const ev = new CustomEvent('createUnitClicked', { detail: province.id });
                window.dispatchEvent(ev);
              } catch (e) {
                // ignore
              }
              onCreateUnit && onCreateUnit(province.id);
            }}
            style={{
              width: "100%",
              background: "#2f6f3a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 10px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
          >
            {canCreateInfantry ? "Create Infantry Unit" : "Create Armor Unit"}
          </button>
        </div>
      )}

      {province.name && (<div><b>Name:</b> {province.name}</div>)}
      {/* {(<div><b>Province ID:</b> {province.id}</div>)} */}
      <div><b>Controller:</b> {province.controller}</div>
      <div><b>Type:</b> {province.type}</div>
    </div>
  );
}