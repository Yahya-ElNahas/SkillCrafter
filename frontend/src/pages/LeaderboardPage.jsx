import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function LeaderboardPage() {
  const [version, setVersion] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/turn", { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setVersion(data.turn.version);
        }
      })
      .catch(err => console.error("Failed to fetch turn:", err));
  }, []);

  useEffect(() => {
    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/achievements/leaderboard", { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.users) {
          // Sort by level desc, then xp desc
          const sorted = data.users.sort((a, b) => {
            if (a.level !== b.level) return b.level - a.level;
            return b.xp - a.xp;
          });
          setLeaderboard(sorted);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b1208 0%, #0f1a12 25%, #16241a 50%, #1a2e20 75%, #0f1a12 100%)",
        color: "#e6f6d7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18
      }}>
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b1208 0%, #0f1a12 25%, #16241a 50%, #1a2e20 75%, #0f1a12 100%)",
        color: "#e6f6d7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18
      }}>
        Error: {error}
        <Link to={version == 1 ? "/app" : "/dashboard"} style={{ color: "#cfe9a8", marginTop: 20 }}>Back to {version == 1 ? "Map" : "Dashboard"}</Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0b1208 0%, #0f1a12 25%, #16241a 50%, #1a2e20 75%, #0f1a12 100%)",
      color: "#e6f6d7",
      padding: "20px",
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      position: "relative"
    }}>
      <Link to={version != 3 ? "/app" : "/dashboard"} style={{
        position: "absolute",
        top: 20,
        left: 16,
        background: "#1f2d24",
        color: "#e6f6d7",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "10px 14px",
        textDecoration: "none",
        fontWeight: 800,
        zIndex: 10
      }}>Back to {version != 3 ? "Map" : "Dashboard"}</Link>
      <div style={{ height: 60 }} />
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>Leaderboard</h1>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {leaderboard.map((user, index) => (
            <div key={user.username} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 16
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: index === 0 ? "#ffd54a" : index === 1 ? "#cfd8dc" : index === 2 ? "#cd7f32" : "#4a5568",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
                color: "#000"
              }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{user.username}</div>
                <div style={{ fontSize: 14, color: "#9aa69a" }}>Level {user.level}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{user.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}