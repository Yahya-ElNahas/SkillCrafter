import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

function Medal({ type = "bronze", size = 18 }) {
  const colors = {
    gold: "#ffd54a",
    silver: "#cfd8dc",
    bronze: "#cd7f32",
  };
  const label = type === "gold" ? "🥇" : type === "silver" ? "🥈" : "🥉";
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: colors[type] || colors.bronze,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      fontSize: Math.floor(size * 0.8),
      marginRight: 6
    }}>{label}</div>
  );
}

function AchievementCard({ ach }) {
  const locked = Boolean(ach.locked);
  return (
    <div style={{
      background: locked ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.03)",
      border: locked ? "1px solid rgba(255,255,255,0.02)" : "1px solid rgba(255,255,255,0.04)",
      borderRadius: 12,
      padding: 16,
      display: "flex",
      gap: 12,
      alignItems: "center",
      color: locked ? "#9aa69a" : "#e6f6d7",
      opacity: locked ? 0.55 : 1,
      filter: locked ? "grayscale(80%)" : "none",
      position: "relative"
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 12,
        background: locked ? "linear-gradient(180deg,#0a0f0d,#07110c)" : "linear-gradient(180deg,#0b1b10,#0f2a14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.02)"
      }}>
        <div style={{ textAlign: "center", fontSize: 22 }}>
          {ach.icon || "🏅"}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{ach.name}</div>
          <div style={{ display: "flex", alignItems: "center", marginRight: locked ? 24 : 0 }}>
            {ach.medals.map((m, i) => (
              <Medal key={i} type={m} size={20} />
            ))}
            {locked && <div style={{ marginLeft: 6, fontSize: 12, color: "#9aa69a" }}>Locked</div>}
          </div>
        </div>
        <div style={{ color: locked ? "#9aa69a" : "#cfe9a8", marginTop: 6 }}>{ach.description}</div>
        {ach.hint && <div style={{ marginTop: 8, fontSize: 12, color: locked ? "#869a77" : "#9fcf8a" }}>{ach.hint}</div>}
      </div>
    </div>
  );
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function AchievementsPage() {

  const [version, setVersion] = useState(null);
  const [achievementsData, setAchievementsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://skillcrafter-backend.onrender.com/api/turn", { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setVersion(data.turn.version);
        }
      })
      .catch(err => console.error("Failed to fetch turn:", err));
  }, []);

  useEffect(() => {
    fetch("https://skillcrafter-backend.onrender.com/api/achievements", { headers: getAuthHeaders() })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setAchievementsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch achievements:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", background: "#0b1208", color: "#e6f6d7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Loading achievements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100dvh", background: "#0b1208", color: "#e6f6d7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Error loading achievements: {error}</div>
      </div>
    );
  }

  if (!achievementsData) {
    return (
      <div style={{ minHeight: "100dvh", background: "#0b1208", color: "#e6f6d7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>No achievement data available</div>
      </div>
    );
  }

  // Transform API data to match component expectations
  const earnedAchievementIds = new Set(achievementsData.achievements.map(a => a._id.toString()));
  
  const transformedAchievements = achievementsData.allAchievements.map(ach => ({
    name: ach.title,
    medals: earnedAchievementIds.has(ach._id.toString()) ? ["gold"] : [], // Default gold medal for earned achievements
    description: ach.description,
    icon: ach.emoji,
    locked: !earnedAchievementIds.has(ach._id.toString())
  }));

  return (
    <div style={{ minHeight: "100dvh", background: "#0b1208", color: "#e6f6d7", position: "relative" }}>
      {/* Back to Map Button */}
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
      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
        {/* XP / Level header */}
        {
          (() => {
            const level = achievementsData.level;
            const xp = achievementsData.xp;
            const xpNext = level * (level + 1) / 2 * 100; // XP required for next level using same formula as backend
            const percent = Math.min(100, Math.round((xp / xpNext) * 100));
            return (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontWeight: 900, color: '#fff7d9', fontSize: 18 }}>Level {level}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(90deg,#ffd54a,#9fe08a)', boxShadow: 'inset 0 -2px 6px rgba(0,0,0,0.35)' }} />
                    </div>
                  </div>
                  <div style={{ minWidth: 140, textAlign: 'right', color: '#cfe9a8', fontWeight: 700 }}>
                    {xp} / {xpNext} XP
                  </div>
                </div>
              </div>
            );
          })()
        }
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1 style={{ color: "#fff7d9", marginBottom: 8 }}>Achievements</h1>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12, marginTop: 18 }}>
          {transformedAchievements.map((ach, i) => (
            <AchievementCard key={i} ach={ach} />
          ))}
        </div>
      </div>
    </div>
  );
}
