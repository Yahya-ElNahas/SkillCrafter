export default function ArmyInfoPopup({ army, show }) {
  if (!army || !show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "90px",
        right: "30px",
        background: "#222222",
        color: "#fff",
        borderRadius: 12,
        padding: "18px 32px",
        fontSize: 12,
        fontFamily: "monospace",
        fontWeight: "bold",
        boxShadow: "0 4px 24px 0 #000b",
        border: army.faction === "enemy" ? "3px solid #791010" : "3px solid #64B570",
        zIndex: 99999,
        minWidth: 80,
        textAlign: "left",
        letterSpacing: 1,
        pointerEvents: "none",
      }}
    >
      <div><b>Name:</b> {army.name}</div>
      {/* <div><b>Health:</b> {army.health}</div> */}
      <div><b>Movement Points:</b> {army.movement}</div>
      <div><b>Faction:</b> {army.faction}</div>
    </div>
  );
}