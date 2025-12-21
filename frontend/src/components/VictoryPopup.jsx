import React from "react";
import cityCaptureImage from "../assets/city_capture.png";

export default function VictoryPopup({ show, cityName }) {
  if (!show || !cityName) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "65px",
        right: "5px",
        width: "600px",
        maxHeight: "80vh",
        overflow: "auto",
        padding: "12px",
        borderRadius: 14,
        background: "linear-gradient(135deg, #2a3d1a 0%, #1e2f12 50%, #15220a 100%)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 2px rgba(138, 155, 90, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        border: "2px solid #6a8440",
        zIndex: 500000,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: "center",
        backdropFilter: "blur(8px)",
        animation: "fadeInOut 3s"
      }}
    >
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
        gap: 4,
        padding: "8px",
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

        {/* City Capture Image */}
        <img
          src={cityCaptureImage}
          alt="City Capture"
          style={{
            width: "650px",
            height: "350px",
            objectFit: "contain",
            borderRadius: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)"
          }}
        />

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
            City Captured!
          </div>
          <div style={{
            fontSize: 20,
            color: "#dfe7c9",
            opacity: 0.9,
            fontWeight: 600,
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            marginBottom: 2,
          }}>
            {cityName}
          </div>
          <div style={{
            fontSize: 18,
            color: "#FFD700",
            fontWeight: 700,
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}>
            +200XP
          </div>
        </div>
      </div>
    </div>
  );
}