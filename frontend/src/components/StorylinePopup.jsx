import React from "react";

export default function StorylinePopup({ show, onClose, message }) {
  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(2,6,10,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 700000,
      padding: 20
    }} onClick={onClose}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{
        width: "min(600px, 96%)",
        maxHeight: "50vh",
        overflow: "auto",
        background: "#0f1a12",
        color: "#e6f6d7",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        border: "1px solid rgba(255,255,255,0.04)"
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#fff7d9' }}>You have received a message</h2>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#e6f6d7',
            padding: '6px 10px',
            borderRadius: 8,
            cursor: 'pointer'
          }}>Close</button>
        </div>

        <div style={{ marginTop: 12, lineHeight: 1.5, color: '#cfe9a8' }}>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}