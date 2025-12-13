import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopicSelectModal from "../components/TopicSelectModal";
import BattleLoadingModal from "../components/BattleLoadingModal";
import ProblemPanel from "../components/ProblemPanel";
import IDEPanel from "../components/IDEPanel";
import HintPopup from "../components/HintPopup";
import SuggestedProblemPopup from "../components/SuggestedProblemPopup";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [showTopicSelect, setShowTopicSelect] = useState(true);
  const [availableTopics, setAvailableTopics] = useState([
    "strings", "loops"
  ]);
  const [loading, setLoading] = useState(false);
  const [solutionCode, setSolutionCode] = useState("// Write your solution here");
  const [problemData, setProblemData] = useState(null);
  const [showIDE, setShowIDE] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("java");
  const [getCode, setGetCode] = useState(() => () => "");
  const [runResult, setRunResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuggestedPopup, setShowSuggestedPopup] = useState(false);
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);

  // RL agent state and action for learning
  const [rlState, setRlState] = useState(null);
  const [rlAction, setRlAction] = useState(null);

  const getInitialCode = (lang) => {
    if (lang === "java") {
      return `/* 
Note: You can ask specific questions as comments to be answered
when requesting help.
*/

import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        // Write your solution here:
        
    }
}`;
    } else if (lang === "python") {
      return "# Write your solution here:\n";
    } else {
      return "// Use Input() for reading input and print() for output\n";
    }
  };

  const handleTopicSelect = (topic) => {
    setLoading(true);
    fetch("https://skillcrafter-backend.onrender.com/api/battle/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          topic 
        }),
      })
        .then(res => res.json())
        .then(data => {
          setProblemData(data);
          setRlState(data.rlState);
          setRlAction(data.rlAction);
          setShowTopicSelect(false);
          setShowIDE(true);
          setSolutionCode(getInitialCode(selectedLanguage));
        })
        .catch(() => {
          window.location.reload();
        })
        .finally(() => setLoading(false));
  };

  const handleRun = (cancel = false) => {
    setHint(null);
    setIsRunning(true);
    if(cancel) {
        setShowIDE(false);
        setProblemData(null);
        setRunResult(null);
        setShowTopicSelect(true);
        setIsRunning(false);
        return;
    }
    const code = getCode();
    setSolutionCode(code); 
    fetch("https://skillcrafter-backend.onrender.com/api/battle/run", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        code: code,
        problem: problemData.problem,
        language: selectedLanguage,
        rlState,
        rlAction
      }),
    })
      .then(res => res.json())
      .then(data => { 
        if (data.suggestedProblem) {
          setProblemData(prev => ({
            ...prev,
            problem: data.suggestedProblem
          }));
          setRunResult(null); 
          setShowSuggestedPopup(true);
          setTimeout(() => setShowSuggestedPopup(false), 3500); 
        } else {
            setRunResult(data);
            // Update RL state for next battle
            if (data.nextState) {
              setRlState(data.nextState);
            }
        }
        setIsRunning(false);
      })
      .catch(err => setRunResult({ error: err.toString() }))
      .finally(() => setIsRunning(false));
  }

  const handleRequestHint = () => {
    setHintLoading(true);
    const code = getCode();
    setSolutionCode(code);
    fetch("https://skillcrafter-backend.onrender.com/api/battle/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        problem: problemData.problem,
        code: code,
        language: selectedLanguage,
      }),
    })
      .then(res => res.json())
      .then(data => setHint(data.hint))
      .catch(() => setHint("Could not fetch hint."))
      .finally(() => setHintLoading(false));
  }

  const handleLogout = async () => {
    try {
      await fetch("https://skillcrafter-backend.onrender.com/api/auth/logout", {
        method: "POST",
        headers: getAuthHeaders()
      });
    } catch (_) {}
    localStorage.removeItem('token');
    navigate("/login");
  };

  useEffect(() => {
        if (selectedLanguage === "java") {
        setSolutionCode(getInitialCode("java"));
        } else if (selectedLanguage === "python") {
        setSolutionCode(getInitialCode("python"));
        } else {
        setSolutionCode(getInitialCode("javascript"));
        }
  }, [selectedLanguage]);

  return (
    <div className="w-screen h-screen overflow-hidden" style={{
      background: "linear-gradient(135deg, #1B3A2A 0%, #2F4F4F 50%, #3B5B3B 100%)",
      position: "relative",
    }}>
      <style>
        {`
          .topic-button:hover {
            transform: translateY(-4px) scale(1.02) !important;
            box-shadow: 0 12px 28px rgba(0,0,0,0.7) !important;
            background: linear-gradient(135deg,#7a9f5a,#6a8a4d) !important;
          }
        `}
      </style>
      {/* Subtle overlay for depth */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
      }}></div>
      {/* Top Navigation Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: "linear-gradient(180deg, #0f1a12 0%, #101a12 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(6px)",
          color: "#e6f6d7",
          zIndex: 500000,
          boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontWeight: 900, letterSpacing: 0.6, color: "#fff7d9" }}>SkillCrafter</div>
          <Link to="/achievements" style={{
            color: "#cfe9a8",
            textDecoration: "none",
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "#0b1208",
          }}>Achievements</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={handleLogout}
            style={{
              background: "#1f2d24",
              color: "#e6f6d7",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "10px 14px",
              fontWeight: 800,
              cursor: "pointer",
              marginLeft: 4
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Topic Selection */}
      {showTopicSelect && (
        <div style={{
          position: "fixed",
          top: 60,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 100000,
        }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#f3f6df", marginBottom: 6 }}>
              📚 Select a Topic
            </div>
            <div style={{ fontSize: 14, color: "#d7e2b9" }}>
              Choose a topic to practice on
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
            width: "100%",
            maxWidth: "1000px"
          }}>
            {availableTopics.map(topic => (
              <button
                key={topic}
                onClick={() => handleTopicSelect(topic)}
                className="topic-button"
                style={{
                  padding: "20px 12px",
                  borderRadius: 12,
                  border: "2px solid rgba(255,255,255,0.15)",
                  background: "linear-gradient(135deg,#6a8f4a,#5a7a3d)",
                  color: "#f5f9e8",
                  fontWeight: "800",
                  fontSize: 16,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                  transition: "all 0.3s ease",
                  minHeight: "80px",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{
                  position: "relative",
                  zIndex: 2,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                }}>
                  {topic}
                </div>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  pointerEvents: "none"
                }}></div>
              </button>
            ))}
          </div>
        </div>
      )}

        {/* Battle Loading Modal */}
        <BattleLoadingModal show={loading} version={3} />

        {/* Problem Solving UI */}
        {showIDE && problemData && (
        <>
            {/* Problem Panel (left) */}
            <div style={{
            position: "fixed",
            top: 60,
            left: 0,
            width: "40vw",
            height: "calc(100vh - 60px)",
            zIndex: 200000,
            overflow: "hidden", // to contain the panel
            }}>
            <ProblemPanel
                problem={problemData.problem}
                runResult={runResult}
                setRunResult={setRunResult}
                setBattleData={setProblemData}
                setShowIDE={setShowIDE}
                onDismiss={() => {
                    setShowIDE(false);
                    setProblemData(null);
                    setRunResult(null);
                    setShowTopicSelect(true);
                }}
                isFullScreen={true}
                version={3}
            />
            </div>
            
            {/* Monaco Editor Panel (right) */}
            {!runResult && (
            <div style={{
              position: "fixed",
              top: 60,
              right: 0,
              width: "60vw",
              height: "calc(100vh - 60px)",
              zIndex: 200000,
            }}>
            <IDEPanel
                solutionCode={solutionCode}
                setSolutionCode={setSolutionCode}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                handleRun={handleRun}
                handleRequestHint={handleRequestHint}
                isRunning={isRunning}
                hintLoading={hintLoading}
                battleData={problemData}
                setGetCode={setGetCode}
                version={3}
                isFullScreen={true}
            />
            </div>
            )}
        </>
        )}

        {/* Hint Popup */}
        <HintPopup hint={hint} onClose={() => setHint(null)} show={showIDE && hint} version={3} isFullScreen={true} />

        {/* Suggested Problem Popup */}
        <SuggestedProblemPopup show={showSuggestedPopup} />
    </div>
  );
}