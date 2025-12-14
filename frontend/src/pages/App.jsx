import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MapPanel from "../components/MapPanel";
import IDEPanel from "../components/IDEPanel";
import ProblemPanel from "../components/ProblemPanel";
import TopicSelectModal from "../components/TopicSelectModal";
import ArmyInfoPopup from "../components/ArmyInfoPopup";
import ProvinceInfoPopup from "../components/ProvinceInfoPopup";
import HintPopup from "../components/HintPopup";
import SuggestedProblemPopup from "../components/SuggestedProblemPopup";
import BattleLoadingModal from "../components/BattleLoadingModal";
import battleSoundUrl from "../assets/battle.mp3";
import AlliedInfantry from "../assets/allied-infantry.svg?react";
import AlliedArmor from "../assets/allied-armor.svg?react";
import { Intro } from "../components/Intro";
import StorylinePopup from "../components/StorylinePopup";


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export default function App() {
  const navigate = useNavigate();
  const transformRef = useRef(null);
  // audio ref for background battle sound played when topic selected
  const battleAudioRef = useRef(null);
  const VIEWPORT_WIDTH = 1024;   // <-- replace with your real values or import/use state
  const VIEWPORT_HEIGHT = 768;

  // ensure audio is stopped on unmount
  useEffect(() => {
    return () => {
      try {
        if (battleAudioRef.current) {
          battleAudioRef.current.pause();
          battleAudioRef.current.currentTime = 0;
          battleAudioRef.current = null;
        }
      } catch (_) {}
    };
  }, []);

  // Pan speed in pixels per second
  const PAN_SPEED = 400;
  const keysPressed = useRef({ w: false, a: false, s: false, d: false });
  const animationRef = useRef();
  const lastTimeRef = useRef(performance.now());

  // State for provinces and armies
  const [provinces, setProvinces] = useState([]);
  const [alliedArmies, setAlliedArmies] = useState([]);
  const [enemyArmies, setEnemyArmies] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedArmyId, setSelectedArmyId] = useState(null);
  const [hoveredArmyId, setHoveredArmyId] = useState(null);

  const [battleData, setBattleData] = useState(null);
  const [showIDE, setShowIDE] = useState(false);

  const [solutionCode, setSolutionCode] = useState("// Write your solution here");
  const [runResult, setRunResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const [getCode, setGetCode] = useState(() => () => ""); // Function to get current code from editor

  const [attacker, setAttacker] = useState(null);
  const [defender, setDefender] = useState(null);

  const [showTopicSelect, setShowTopicSelect] = useState(false);
  const [pendingBattle, setPendingBattle] = useState(null);
  const [availableTopics, setAvailableTopics] = useState([
    "strings", "loops"
  ]);

  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);

  const [battleLoading, setBattleLoading] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("java");

  // RL agent state and action for learning
  const [rlState, setRlState] = useState(null);
  const [rlAction, setRlAction] = useState(null);

  const [showSuggestedPopup, setShowSuggestedPopup] = useState(false);
  const [showMasteredPopup, setShowMasteredPopup] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  // current turn number
  const [currentTurn, setCurrentTurn] = useState(null);
  // whether backend marked the turn as "ending" (enemy's turn in progress / paused)
  const [isTurnEnding, setIsTurnEnding] = useState(false);

  const [version, setVersion] = useState(null);

  const [showTutorialPopup, setShowTutorialPopup] = useState(false);

  const [showProblemList, setShowProblemList] = useState(false);

  const selectedArmyIsAllied = Boolean(alliedArmies.find(a => (a._id || a.id) === selectedArmyId));

  const unit2 = alliedArmies.find(a => a.unitNumber === 2);
  const unit2Id = unit2 ? (unit2._id || unit2.id) : null;
  const unit3 = alliedArmies.find(a => a.unitNumber === 3);
  const unit3Id = unit3 ? (unit3._id || unit3.id) : null;

  const unitOnPath33 = alliedArmies.find(a => a.position === "path33");
  const unitOnPath33Id = unitOnPath33 ? (unitOnPath33._id || unitOnPath33.id) : null;

  const [showUnit2Tutorial, setShowUnit2Tutorial] = useState(false);
  const [showSwapTutorial, setShowSwapTutorial] = useState(false);

  const [showSelectUnitTutorial, setShowSelectUnitTutorial] = useState(false);
  const [showAttackTutorial, setShowAttackTutorial] = useState(false);
  const [showProvinceTutorial, setShowProvinceTutorial] = useState(false);

  const [showCaptureTutorial, setShowCaptureTutorial] = useState(false);
  const [showEndTurnTutorial, setShowEndTurnTutorial] = useState(false);
  const [showEndTurnArrow, setShowEndTurnArrow] = useState(false);

  const [hasShownProvinceTutorial, setHasShownProvinceTutorial] = useState(false);

  const [showProvinceTutorialStep1, setShowProvinceTutorialStep1] = useState(false);
  const [showProvinceTutorialStep2, setShowProvinceTutorialStep2] = useState(false);

  const [isAIAttack, setIsAIAttack] = useState(false);

  const [isProcessingEnemyMove, setIsProcessingEnemyMove] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const [showIntro, setShowIntro] = useState(false);

  const [availableProblems, setAvailableProblems] = useState([]);

  // Map and viewport dimensions
  const MAP_WIDTH = 1920;
  const MAP_HEIGHT = 1080;
  const CAMERA_CENTER_X = 961;
  const CAMERA_CENTER_Y = 474;
  const INITIAL_SCALE = 4;

  // Function to get initial code for a language
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

  // Add this useEffect to trigger the intro
  useEffect(() => {
    if (currentTurn === 1 && !isTurnEnding && alliedArmies.length > 0 && !alliedArmies.some(a => a.movement <= 0)) {
      setTimeout(() => setShowIntro(true), 500);
    }
  }, [currentTurn, alliedArmies, isTurnEnding]);

  // Tutorial effects
  useEffect(() => {
    if(currentTurn !== 1 || isTurnEnding || !unitOnPath33 || unitOnPath33.movement <= 0) {
      setShowSelectUnitTutorial(false);
      setShowAttackTutorial(false);
      return;
    }
    if (selectedArmyId === unitOnPath33Id) {
      setShowSelectUnitTutorial(false);
      setShowAttackTutorial(true);
    } else if (showAttackTutorial) {
      setShowAttackTutorial(false);
      setShowSelectUnitTutorial(true);
    }
  }, [selectedArmyId, unitOnPath33Id, showAttackTutorial]);

  // Start tutorial on turn 1 if unit on path33 exists
  useEffect(() => {
    if (currentTurn === 1 && !isTurnEnding && unitOnPath33 && !showSelectUnitTutorial && !showAttackTutorial && !showProvinceTutorial && !showCaptureTutorial && !showEndTurnTutorial && !showEndTurnArrow && unitOnPath33.movement > 0) {
      setShowSelectUnitTutorial(true);
    }
  }, [currentTurn, unitOnPath33, showSelectUnitTutorial, showAttackTutorial, showProvinceTutorial, showCaptureTutorial, showEndTurnTutorial, showEndTurnArrow]);

  // Show province tutorial when conditions are met
  useEffect(() => {
    if (currentTurn === 1 && !isTurnEnding && alliedArmies.length === 4 && !unitOnPath33 && !hasShownProvinceTutorial) {
      setShowProvinceTutorialStep1(true);
      setHasShownProvinceTutorial(true);
    }
  }, [currentTurn, alliedArmies, unitOnPath33, hasShownProvinceTutorial]);

  // When user clicks on path32 during step1, move to step2
  useEffect(() => {
    if (selectedProvinceId === "path32" && !isTurnEnding && showProvinceTutorialStep1) {
      setShowProvinceTutorialStep1(false);
      setShowProvinceTutorialStep2(true);
    }
  }, [selectedProvinceId, showProvinceTutorialStep1]);

  // If user deselects province during step2, go back to step1
  useEffect(() => {
    if (selectedProvinceId !== "path32" && !isTurnEnding && showProvinceTutorialStep2) {
      setShowProvinceTutorialStep2(false);
      setShowProvinceTutorialStep1(true);
    }
  }, [selectedProvinceId, showProvinceTutorialStep2]);

  // fetch current turn on mount
  useEffect(() => {
    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/turn", { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        // backend may return shape { currentTurn, isEnding } or { turn: { currentTurn, isEnding } }
        if (data) {
          setCurrentTurn(data.turn.currentTurn);
          setIsTurnEnding(Boolean(data.turn.isEnding));
          setVersion(data.turn.version);
          console.log("Fetched turn:", data.turn);
          // Now fetch provinces and armies after turn is loaded
          const fetchData = async () => {
            try {
              const [provincesRes, armiesRes] = await Promise.all([
                fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/provinces", { headers: getAuthHeaders() }),
                fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/armies/", { headers: getAuthHeaders() })
              ]);
              
              if (!provincesRes.ok) {
                throw new Error(`Provinces API failed: ${provincesRes.status} ${provincesRes.statusText}`);
              }
              if (!armiesRes.ok) {
                throw new Error(`Armies API failed: ${armiesRes.status} ${armiesRes.statusText}`);
              }
              
              const provincesData = await provincesRes.json();
              const armiesData = await armiesRes.json();
              console.log(provincesData, armiesData);
              setProvinces(provincesData.map(p => ({...p})));
              const allied = armiesData.filter((army) => army.faction === "allied");
              const enemy = armiesData.filter((army) => army.faction === "enemy");
              setAlliedArmies(allied);
              setEnemyArmies(enemy);
              setIsLoading(false);
            } catch (err) {
              console.error("Failed to fetch data:", err);
              setError(`Failed to load game data. Please ensure the backend server is running on port 5000.\n\nError: ${err.message}`);
              setIsLoading(false);
            }
          };
          fetchData();
        }
      })
      .catch(err => console.error("Failed to fetch turn:", err));
  }, []);

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleProvinceMove = (provinceId, event) => {
    if (showIDE) return;
    if (event) event.preventDefault();
    if (!selectedArmyId) return;
    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/armies/move", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ divisionId: selectedArmyId, position: provinceId }),
    })
      .then(res => res.json())
      .then(data => {
        setSelectedArmyId(null);
        if (data.error) {
          setErrorMessage(data.error);
          setTimeout(() => setErrorMessage(null), 3000);
          return;
        }
        if (data.result === "battle") {
          setPendingBattle(data);
          setAttacker(data.attacker);
          setDefender(data.defender);
          setShowTopicSelect(true);
          setIsAIAttack(false);
        } else {
          setBattleData(null);
          setAttacker(null);
          setDefender(null);
          setShowIDE(false);
        }
        if (data.armies) {
          setAlliedArmies(data.armies.filter(a => a.faction === "allied"));
          setEnemyArmies(data.armies.filter(a => a.faction === "enemy"));
          if (currentTurn === 1 && showSwapTutorial) {
            setShowSwapTutorial(false);
            setShowCaptureTutorial(true);
          }
        }
        if (data.provinces) {
          setProvinces(data.provinces.map(p => ({...p})));
        }
        setSelectedArmyId(null);
      });
  };

  const handleRun = (surrender = false) => {
    if (!battleData || !solutionCode) return;
    if(!surrender) setIsRunning(true);
    setHint(null);
    const code = getCode();
    setSolutionCode(code); // Save the current code to state
    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/battle/run", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        code: code,
        problem: battleData.problem,
        attacker,
        defender,
        position: battleData.position,
        language: selectedLanguage,
        surrender,
        rlState,
        rlAction
      }),
    })
      .then(res => res.json())
      .then(data => { 
        if (data.suggestedProblem) {
          setBattleData(prev => ({
            ...prev,
            problem: data.suggestedProblem
          }));
          setRunResult(null); 
          setShowSuggestedPopup(true);
          setTimeout(() => setShowSuggestedPopup(false), 3500); 
        } else if(data.surrendered) {
          if (data.armies) {
            setAlliedArmies(data.armies.filter(a => a.faction === "allied"));
            setEnemyArmies(data.armies.filter(a => a.faction === "enemy"));
          }
          if (data.provinces) {
            setProvinces(data.provinces.map(p => ({...p})));
          }
          setShowIDE(false);
          setAttacker(null);
          setDefender(null);
          setBattleData(null);
          setPendingBattle(null);
          // stop battle audio when running / finishing the attempt
          try {
            if (battleAudioRef.current) {
              battleAudioRef.current.pause();
              battleAudioRef.current.currentTime = 0;
              battleAudioRef.current = null;
            }
          } catch (_) {}
          if (data.turnEnding) handleEndTurn();
        } else {
          setRunResult(data);
          // Update RL state for next battle
          if (data.nextState) {
            setRlState(data.nextState);
          }
          // stop battle audio when running / finishing the attempt
          try {
            if (battleAudioRef.current) {
              battleAudioRef.current.pause();
              battleAudioRef.current.currentTime = 0;
              battleAudioRef.current = null;
            }
          } catch (_) {}
          if(data.passed) {
            setAttacker(null);
            setDefender(null);
          } else {
            if (battleAudioRef.current) {
              battleAudioRef.current.play().catch(() => {});
            }
          }
          if (data.armies) {
            setAlliedArmies(data.armies.filter(a => a.faction === "allied"));
            setEnemyArmies(data.armies.filter(a => a.faction === "enemy"));
            const allied = data.armies.filter(a => a.faction === "allied");
            if (currentTurn === 1 && !isTurnEnding && allied.length > 4) {
              setShowCaptureTutorial(true);
            }
          }
          if (data.provinces) {
            setProvinces(data.provinces.map(p => ({...p})));
          }
        }
      })
      .catch(err => setRunResult({ error: err.toString() }))
      .finally(() => setIsRunning(false));
  };

  const handleTopicSelect = (topic) => {
    if(version == 2) {
      try {
        fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/problem/byTopic", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ topic }),
        })
        .then(res => res.json())
        .then(data => {
            const problems = data.problems || [];
            const difficultyOrder = { basic: 1, easy: 2, medium: 3, hard: 4 };
            problems.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
            setAvailableProblems(problems);
            setShowTopicSelect(false);
            setShowProblemList(true);
          })
          .catch((err) => {
            console.log("Failed to fetch problems by topic", err);
          });
      } catch (err) {
        console.log("Failed to fetch problems by topic", err);
      }
      return;
    } else {
      setBattleLoading(true); // Start loading
      if (!pendingBattle) return;
      if(pendingBattle.attacker) {
        try {
          if (!battleAudioRef.current) {
            const a = new Audio(battleSoundUrl);
            a.loop = true;
            a.volume = 0.003; // low volume
            // start playback (this call should be allowed because this handler runs on a user gesture)
            a.play().catch(() => {});
            battleAudioRef.current = a;
          } else {
            // if already exists, ensure it is playing
            battleAudioRef.current.play().catch(() => {});
          }
        } catch (_) {}
      }
      fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/battle/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          topic,
          attacker: pendingBattle.attacker,
          defender: pendingBattle.defender,
          position: pendingBattle.position 
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.mastered) {
            setShowMasteredPopup(true);
            setTimeout(() => setShowMasteredPopup(false), 3500);
            return;
          }
          setBattleData(data);
          setAttacker(data.attacker);
          setDefender(data.defender);
          setRlState(data.rlState);
          setRlAction(data.rlAction);
          setShowTopicSelect(false);
          setShowIDE(true);
          setPendingBattle(null);
          setSolutionCode(getInitialCode(selectedLanguage)); // Reset to initial code for new problem
        })
        .catch(() => {
          setPendingBattle(null);
          window.location.reload();
        })
        .finally(() => setBattleLoading(false)); // Stop loading
    }
  };

  const handleProblemSelect = (problem) => {
    setBattleLoading(true);
    if(pendingBattle.attacker) {
      try {
        if (!battleAudioRef.current) {
          const a = new Audio(battleSoundUrl);
          a.loop = true;
          a.volume = 0.003;
          a.play().catch(() => {});
          battleAudioRef.current = a;
        } else {
          battleAudioRef.current.play().catch(() => {});
        }
      } catch (_) {}
    }
    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/battle/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        problem,
        attacker: pendingBattle.attacker,
        defender: pendingBattle.defender,
        position: pendingBattle.position 
      }),
    })
      .then(res => res.json())
      .then(data => {
        setBattleData(data);
        setAttacker(data.attacker);
        setDefender(data.defender);
        setRlState(data.rlState);
        setRlAction(data.rlAction);
        setShowProblemList(false);
        setShowIDE(true);
        setPendingBattle(null);
        setSolutionCode(getInitialCode(selectedLanguage));
      })
      .catch((err) => {
        setPendingBattle(null);
        console.log("Failed to initiate battle with selected problem", err);
      })
      .finally(() => setBattleLoading(false));
  };

  const handleCreateUnitClick = (provinceId) => {
    // Prepare a pendingBattle-like object that carries the position so when a
    // topic is selected we will initiate the 'create unit' flow on the server.
    setPendingBattle({ attacker: null, defender: null, position: provinceId });
    setSelectedProvinceId(null);
    setShowTopicSelect(true);
    setIsAIAttack(false);
    // Close tutorial step2 and start next tutorial
    setShowProvinceTutorialStep2(false);
  };

  const handleRequestHint = () => {
    if (!battleData || !battleData.problem) return;
    setHintLoading(true);
    const code = getCode();
    setSolutionCode(code); // Save the current code to state
    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/battle/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        problem: battleData.problem,
        code: code,
        attacker,
        defender,
        language: selectedLanguage,
      }),
    })
      .then(res => res.json())
      .then(data => setHint(data.hint))
      .catch(() => setHint("Could not fetch hint."))
      .finally(() => setHintLoading(false));
  };

  const handleEndTurn = () => {
    if (isProcessingEnemyMove) return; // Prevent spamming during enemy move
    setIsTurnEnding(true);
    setSelectedArmyId(null);
    setSelectedProvinceId(null);
    setIsProcessingEnemyMove(true);
    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/turn/end", {
      method: "POST",
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        if (data.armies) {
          setAlliedArmies(data.armies.filter(a => a.faction === "allied"));
          setEnemyArmies(data.armies.filter(a => a.faction === "enemy"));
        }
        if (data.provinces) {
          setProvinces(data.provinces.map(p => ({...p})));
        }
        if (data.pendingBattle) {
          setPendingBattle({attacker: data.attacker, defender: data.defender});
          setAttacker(data.attacker);
          setDefender(data.defender);
          setShowTopicSelect(true);
          setIsAIAttack(true);
          setIsProcessingEnemyMove(false);
        } else if (data.turnEnded) {
          setIsTurnEnding(false);
          setCurrentTurn(prev => (prev === null ? null : prev + 1));
          setIsProcessingEnemyMove(false);
        } else if (data.unitProcessed) {
          // Wait 2 seconds, then call handleEndTurn again
          setTimeout(() => handleEndTurn(), 2000);
        }
      });
      setShowEndTurnArrow(false);
  };

  const handleClearPerformance = () => {
    // close IDE immediately
    setShowIDE(false);
    // optionally clear any UI state related to a running solution
    setRunResult(null);
    setBattleData(null);
    setPendingBattle(null);
    setShowTopicSelect(false);

    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/performance", {
      method: "DELETE",
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(() => {
        // optional: show brief confirmation (or refresh any performance-dependent UI)
        console.log("Performance cleared");
      })
      .catch(err => console.error("Failed to clear performance:", err));
  };

  const handleLogout = async () => {
    try {
      await fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/auth/logout", {
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

  useEffect(() => {
    function handleKeyDown(e) {
      if (showIDE) return;
      const key = e.key.toLowerCase();
      if (keysPressed.current[key] !== undefined) {
        keysPressed.current[key] = true;
        e.preventDefault();
      }
    }

    function handleKeyUp(e) {
      if (showIDE) return;
      const key = e.key.toLowerCase();
      if (keysPressed.current[key] !== undefined) {
        keysPressed.current[key] = false;
        e.preventDefault();
      }
    }

    function handleEsc(e) {
      if (showIDE) return;
      if (e.key === "Escape") {
        setSelectedProvinceId(null);
        setSelectedArmyId(null);
      }
    }
    window.addEventListener("keydown", handleEsc);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function animate() {
      if (!transformRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      if (showIDE) {
        animationRef.current = requestAnimationFrame(animate);
        return; // Pause camera movement when IDE is open
      }

      const now = performance.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const state = transformRef.current.state;
      if (!state) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      let { positionX, positionY, scale } = state;
      let moved = false;
      const distance = PAN_SPEED * delta;

      if (keysPressed.current.w) {
        positionY += distance;
        moved = true;
      }
      if (keysPressed.current.s) {
        positionY -= distance;
        moved = true;
      }
      if (keysPressed.current.a) {
        positionX += distance;
        moved = true;
      }
      if (keysPressed.current.d) {
        positionX -= distance;
        moved = true;
      }

      if (moved) {
        transformRef.current.setTransform(positionX, positionY, scale, 0);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationRef.current);
    };
  }, [showIDE]);

  // --- Main Render ---
  return (
    <div className="w-screen h-screen bg-[#465D75] overflow-hidden">
      {isLoading && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(180deg, #0f1a12 0%, #101a12 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000000,
          color: "#e6f6d7",
          fontFamily: "sans-serif",
          fontSize: "24px",
          fontWeight: "bold"
        }}>
          <div style={{ marginBottom: 20 }}>Loading</div>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(255,255,255,0.1)",
            borderTop: "4px solid #e6f6d7",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      {error && !isLoading && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(180deg, #0f1a12 0%, #101a12 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000000,
          color: "#e6f6d7",
          fontFamily: "sans-serif",
          fontSize: "18px",
          fontWeight: "bold",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ marginBottom: "20px", whiteSpace: "pre-line" }}>{error}</div>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              // Re-run the data fetch
              const fetchData = async () => {
                try {
                  const [provincesRes, armiesRes] = await Promise.all([
                    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/provinces", { headers: getAuthHeaders() }),
                    fetch("https://skillcrafter-backend-production-bc4b.up.railway.app/api/armies/", { headers: getAuthHeaders() })
                  ]);
                  
                  if (!provincesRes.ok) {
                    throw new Error(`Provinces API failed: ${provincesRes.status} ${provincesRes.statusText}`);
                  }
                  if (!armiesRes.ok) {
                    throw new Error(`Armies API failed: ${armiesRes.status} ${armiesRes.statusText}`);
                  }
                  
                  const provincesData = await provincesRes.json();
                  const armiesData = await armiesRes.json();
                  setProvinces(provincesData.map(p => ({...p})));
                  const allied = armiesData.filter((army) => army.faction === "allied");
                  const enemy = armiesData.filter((army) => army.faction === "enemy");
                  setAlliedArmies(allied);
                  setEnemyArmies(enemy);
                  setIsLoading(false);
                } catch (err) {
                  console.error("Failed to fetch data:", err);
                  setError(`Failed to load game data. Please ensure the backend server is running on port 5000.\n\nError: ${err.message}`);
                  setIsLoading(false);
                }
              };
              fetchData();
            }}
            style={{
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              color: "#fff",
              border: "2px solid #28a745",
              borderRadius: 8,
              padding: "12px 24px",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(40, 167, 69, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(40, 167, 69, 0.3)";
            }}
          >
            🔄 Retry Loading
          </button>
        </div>
      )}
      {!isLoading && (
        <>
          {showIntro && <Intro onClose={() => setShowIntro(false)} />}
            
          {/* Top Navigation Bar */}
          {!showIntro && (<div
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
            <style>
              {`
                .top-bar-link:hover {
                  transform: translateY(-1px) !important;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                  background: linear-gradient(135deg, #1a2416 0%, #0f1a12 100%) !important;
                }
                .top-bar-button:hover:not(:disabled) {
                  transform: translateY(-1px) !important;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
                  background: linear-gradient(135deg, #2f3d2a 0%, #1f2d24 100%) !important;
                }
                .end-turn-button:hover:not(:disabled) {
                  transform: translateY(-1px) !important;
                  box-shadow: 0 4px 14px rgba(0,0,0,0.5) !important;
                  background: linear-gradient(135deg, #4c6c3b 0%, #3c5c2b 100%) !important;
                }
              `}
            </style>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontWeight: 900, letterSpacing: 0.6, color: "#fff7d9" }}>SkillCrafter</div>
              <Link to="/achievements" className="top-bar-link" style={{
                color: "#cfe9a8",
                textDecoration: "none",
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "#0b1208",
                transition: "all 0.2s ease",
                fontWeight: 700
              }}>Achievements</Link>
              <Link to="/leaderboard" className="top-bar-link" style={{
                color: "#cfe9a8",
                textDecoration: "none",
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "#0b1208",
                transition: "all 0.2s ease",
                fontWeight: 700
              }}>Leaderboard</Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* <button
                onClick={handleClearPerformance}
                disabled={isRunning}
                style={{
                  background: "#7a2b2b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontWeight: 800,
                  cursor: isRunning ? "wait" : "pointer",
                  boxShadow: "0 2px 8px #0008"
                }}
                title="Clear performance data (DELETE /api/performance)"
              >
                Clear Performance
              </button> */}
              <button
                onClick={handleLogout}
                className="top-bar-button"
                style={{
                  background: "#1f2d24",
                  color: "#e6f6d7",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  marginLeft: 4,
                  transition: "all 0.2s ease"
                }}
              >
                Logout
              </button>
            </div>
            {/* Centered End Turn + Turn label */}
            <div style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 510000,
              pointerEvents: "none" // default to not block clicks; enable on child
            }}>
              <div style={{
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
              }}>
                <div style={{
                  background: "#122017",
                  color: "#bde7b0",
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontWeight: "bold",
                  fontSize: 14,
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)"
                }}>
                  Turn: {currentTurn === null ? "—" : currentTurn}
                  {isTurnEnding && (
                    <span style={{ marginLeft: 8, color: "#ffd1b0" }}>(Enemy's turn)</span>
                  )}
                </div>

                <button
                  onClick={handleEndTurn}
                  disabled={isProcessingEnemyMove || showIDE || showTopicSelect || battleLoading || showProblemList}
                  className="end-turn-button"
                  style={{
                    background: (isProcessingEnemyMove || showIDE || showTopicSelect || battleLoading || showProblemList) ? "#666" : (isTurnEnding ? "#5b5b2f" : "#3c5c2b"),
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    fontWeight: 800,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.45)",
                    cursor: (isProcessingEnemyMove || showIDE || showTopicSelect || battleLoading || showProblemList) ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {isProcessingEnemyMove ? "Enemy is moving" : isTurnEnding ? "Continue" : "End Turn"}
                </button>
              </div>
            </div>
          </div>)}

          {/* Camera Movement Hint */}
          {!showIntro && (<div style={{
            position: "fixed",
            top: 70,
            left: 20,
            color: "#888",
            fontSize: 12,
            fontWeight: "bold",
            zIndex: 100000,
            pointerEvents: "none"
          }}>
            🎥 Use WASD keys or double click on the map and drag to move the camera
          </div>)}

          {!showIntro && (<div style={{
            position: "fixed",
            top: 90,
            left: 20,
            color: "#888",
            fontSize: 12,
            fontWeight: "bold",
            zIndex: 100000,
            pointerEvents: "none"
          }}>
            🔍 Scroll to zoom
          </div>)}

          {/* End Turn Arrow */}
          {showEndTurnArrow && !showTopicSelect && !battleLoading && !showIDE && !isProcessingEnemyMove && (
            <div style={{
              position: "fixed",
              top: 65,
              left: "52%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 510000,
              pointerEvents: "none"
            }}>
              <style>{`@keyframes endTurnFloat {0%{transform:translateY(0)}50%{transform:translateY(8px)}100%{transform:translateY(0)}}
                .endTurn-arrow{animation:endTurnFloat 1.2s ease-in-out infinite;font-size:16px;color:#bde7b0;text-shadow:0 2px 8px rgba(0,0,0,0.8);line-height:1}
                .endTurn-bubble{background:#0f1a12;border:1px solid rgba(255,255,255,0.04);color:#e6f6d7;padding:6px 8px;border-radius:8px;font-size:14px;white-space:nowrap;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.5);}
              `}</style>
              <div className="endTurn-arrow">▲</div>
              <div className="endTurn-bubble">Click to end turn</div>
            </div>
          )}

          {/* Map Panel */}
          <MapPanel
            transformRef={transformRef}
            provinces={provinces}
            alliedArmies={alliedArmies}
            enemyArmies={enemyArmies}
            selectedProvinceId={selectedProvinceId}
            setSelectedProvinceId={setSelectedProvinceId}
            selectedArmyId={selectedArmyId}
            setSelectedArmyId={setSelectedArmyId}
            hoveredArmyId={hoveredArmyId}
            setHoveredArmyId={setHoveredArmyId}
            attacker={attacker}
            defender={defender}
            showIDE={showIDE}
            handleProvinceMove={handleProvinceMove}
            currentTurn={currentTurn}
            MAP_WIDTH={MAP_WIDTH}
            MAP_HEIGHT={MAP_HEIGHT}
            VIEWPORT_WIDTH={VIEWPORT_WIDTH}
            VIEWPORT_HEIGHT={VIEWPORT_HEIGHT}
            CAMERA_CENTER_X={CAMERA_CENTER_X}
            CAMERA_CENTER_Y={CAMERA_CENTER_Y}
            INITIAL_SCALE={INITIAL_SCALE}
            showSelectUnitTutorial={showSelectUnitTutorial}
            showAttackTutorial={showAttackTutorial}
            unitOnPath33Id={unitOnPath33Id}
            showTopicSelect={showTopicSelect}
            battleLoading={battleLoading}
            showProvinceTutorialStep1={showProvinceTutorialStep1}
            setShowAttackTutorial={setShowAttackTutorial}
            showProblemList={showProblemList}
          />

          {/* Move instruction popup */}
          {selectedArmyId && !showIDE && !showTopicSelect && !battleLoading && !isProcessingEnemyMove && !showProblemList && (
            <div style={{
              position: "fixed",
              top: isTurnEnding ? 110 : 70,
              left: "50%",
              transform: "translateX(-50%)",
              background: selectedArmyIsAllied ? "#122017": "#2b1212",
              color: selectedArmyIsAllied ? "#bde7b0": "#ee9090",
              padding: "6px 10px",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
              zIndex: 100000,
              animation: "gentleFlash 1.5s infinite",
            }}>
              <style>{`@keyframes gentleFlash {0%, 100% {opacity: 1;} 50% {opacity: 0.6;}}`}</style>
              {selectedArmyIsAllied ? alliedArmies.find(a => a._id === selectedArmyId).movement > 0 ? !isTurnEnding ? `Right click on a highlighted province to move` : `Cannot move while turn is ending` : `This unit does not have enough movement points to move` : `AI unit can move to the highlighted provinces`}
            </div>
          )}
          {isTurnEnding && !isProcessingEnemyMove && !showIDE && !showTopicSelect && !battleLoading && !showProblemList && (
            <div style={{
              position: "fixed",
              top: 70,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#f0c674", // make it yellowish
              color: "#3b2d00",
              padding: "6px 10px",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
              zIndex: 100000,
              animation: "gentleFlash 1.5s infinite",
            }}>
              <style>{`@keyframes gentleFlash {0%, 100% {opacity: 1;} 50% {opacity: 0.6;}}`}</style>
              Click continue to let the enemy finish their turn
            </div>
          )}

          {/* Error Message Popup */}
          {errorMessage && (
            <div style={{
              position: "fixed",
              top: !selectedArmyId ? 70 : 110,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#7a2b2b",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
              zIndex: 100000,
              animation: "gentleFlash 1.5s infinite",
            }}>
              <style>{`@keyframes gentleFlash {0%, 100% {opacity: 1;} 50% {opacity: 0.6;}}`}</style>
              {errorMessage}
            </div>
          )}

          {/* Topic Select Modal */}
          <TopicSelectModal
            show={showTopicSelect}
            availableTopics={availableTopics}
            onSelect={handleTopicSelect}
            onCancel={() => { 
              setShowTopicSelect(false); 
              setPendingBattle(null); 
              setIsAIAttack(false);
              if(currentTurn == 1 && !isTurnEnding && alliedArmies.length === 4 && !unitOnPath33) {
                setShowProvinceTutorialStep2(false);
                setShowProvinceTutorialStep1(true);
              }
            }}
            isAIAttack={isAIAttack}
          />

          {/* Problem List Modal */}
          {showProblemList && (
            <div style={{
              position: "fixed",
              top: 30, left: 0, width: "100vw", height: "100vh",
              background: "rgba(0,0,0,0.66)", zIndex: 300000,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{
                background: "linear-gradient(180deg,#394b25 0%, #2c3a1c 100%)",
                borderRadius: 16,
                padding: 28,
                minWidth: 500,
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 12px 40px rgba(0,0,0,0.6), inset 0 -6px 12px rgba(255,255,255,0.03)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "2px solid rgba(64,84,40,0.9)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, width: "100%", justifyContent: "center" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 10,
                    background: "linear-gradient(180deg,#7c8f4f,#5b6d35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#f3f6df", fontSize: 30, boxShadow: "0 6px 18px rgba(0,0,0,0.4)"
                  }}>📜</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#f3f6df" }}>
                      Select a Problem
                    </div>
                    <div style={{ fontSize: 12, color: "#d7e2b9" }}>
                      Choose a problem to solve
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginTop: 6 }}>
                  {availableProblems.map(problem => (
                    <button
                      key={problem._id}
                      onClick={() => handleProblemSelect(problem)}
                      style={{
                        padding: "12px 20px",
                        borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.25)",
                        background: "linear-gradient(180deg,#5f773b,#4a612b)",
                        color: "#eef4d9",
                        fontWeight: "800",
                        fontSize: 16,
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.35)"
                      }}
                    >
                      <span>{problem.title} {problem.solved && <span style={{ color: "#4ade80", marginLeft: 8 }}>✓ Solved</span>}</span>
                      <span style={{ fontSize: 14, color: "#d7e2b9" }}>{problem.difficulty}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { setShowProblemList(false); setShowTopicSelect(true); }}
                  style={{
                    marginTop: 18,
                    padding: "10px 30px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.04)",
                    background: "transparent",
                    color: "#dfe7c8",
                    fontWeight: "700",
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "none"
                  }}
                >
                  Back to Topics
                </button>
              </div>
            </div>
          )}

          {/* Province Info Popup */}
          <ProvinceInfoPopup
            province={provinces.find(p => p.id === selectedProvinceId)}
            show={selectedProvinceId && !showIDE && !isProcessingEnemyMove}
            onCreateUnit={!isTurnEnding ? handleCreateUnitClick : undefined}
            showProvinceTutorialStep2={showProvinceTutorialStep2}
          />

          {/* Army Info Popup */}
          <ArmyInfoPopup
            army={
              alliedArmies.find(a => (a._id || a.id) === selectedArmyId) ||
              enemyArmies.find(a => (a._id || a.id) === selectedArmyId)
            }
            show={selectedArmyId && !showIDE && !isProcessingEnemyMove}
          />

          {/* Battle Loading Modal */}
          <BattleLoadingModal show={battleLoading} version={version} />

          {/* Problem Solving UI */}
          {showIDE && battleData && (
            <>
              {/* Problem Panel (left) or Result Panel */}
              <div style={{
                position: "fixed",
                top: 40,
                left: 20,
                zIndex: 200000,
              }}>
                <ProblemPanel
                  problem={battleData.problem}
                  runResult={runResult}
                  setRunResult={setRunResult}
                  setBattleData={setBattleData}
                  setShowIDE={setShowIDE}
                  onDismiss={!isTurnEnding ? () => {
                    setShowIDE(false);
                    setBattleData(null);
                    setPendingBattle(null);
                    setRunResult(null);
                    if(currentTurn == 1 && !isTurnEnding && alliedArmies.length === 4 && !unitOnPath33) {
                      setShowProvinceTutorialStep2(false);
                      setShowProvinceTutorialStep1(true);
                    }
                  }: () => {
                    handleEndTurn();
                  }}
                />
              </div>
              
              {/* Monaco Editor Panel (right) */}
              {!runResult && (
                <IDEPanel
                  solutionCode={solutionCode}
                  setSolutionCode={setSolutionCode}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  handleRun={handleRun}
                  handleRequestHint={handleRequestHint}
                  isRunning={isRunning}
                  hintLoading={hintLoading}
                  battleData={battleData}
                  setGetCode={setGetCode}
                  version={version}
                />
              )}
            </>
          )}

          {/* Hint Popup */}
          <HintPopup hint={hint} onClose={() => setHint(null)} show={showIDE && hint} />

          {/* Mastered Topic Popup */}
          {showMasteredPopup && (
            <div style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(135deg, #4CAF50, #45a049)",
              color: "#fff",
              padding: "20px 30px",
              borderRadius: 12,
              fontSize: 18,
              fontWeight: "bold",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              zIndex: 1000000,
              textAlign: "center"
            }}>
              🎉 You have mastered this topic! Choose another one.
            </div>
          )}

          {/* Suggested Problem Popup */}
          <SuggestedProblemPopup show={showSuggestedPopup} />

          {/* Capture Tutorial Popup */}
          {showCaptureTutorial && !showTopicSelect && !battleLoading && !showIDE && (
            <div style={{
              position: "fixed",
              inset: 0,
              background: "rgba(2,6,10,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 700000,
              padding: 20
            }} onClick={() => { setShowCaptureTutorial(false); setShowEndTurnTutorial(true); }}>
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
                  <h2 style={{ margin: 0, color: '#fff7d9' }}>Tutorial</h2>
                  <button onClick={() => { setShowCaptureTutorial(false); setShowEndTurnTutorial(true); }} style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#e6f6d7',
                    padding: '6px 10px',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}>Close</button>
                </div>

                <div style={{ marginTop: 12, lineHeight: 1.5, color: '#cfe9a8' }}>
                  <p>Barracks create infantry units <AlliedInfantry style={{ width: 20, height: 20, display: 'inline-block', verticalAlign: 'middle' }} /></p>
                  <p>Factories create armor units <AlliedArmor style={{ width: 25, height: 25, display: 'inline-block', verticalAlign: 'middle' }} /></p>
                  <p>Only Armor <AlliedArmor style={{ width: 25, height: 25, display: 'inline-block', verticalAlign: 'middle' }} /> can attack armor units.</p>
                </div>
              </div>
            </div>
          )}

          {/* End Turn Tutorial Popup */}
          {showEndTurnTutorial && !showTopicSelect && !battleLoading && !showIDE && (
            <div style={{
              position: "fixed",
              inset: 0,
              background: "rgba(2,6,10,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 700000,
              padding: 20
            }} onClick={() => { setShowEndTurnTutorial(false); setShowEndTurnArrow(true); }}>
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
                  <h2 style={{ margin: 0, color: '#fff7d9' }}>Tutorial</h2>
                  <button onClick={() => { setShowEndTurnTutorial(false); setShowEndTurnArrow(true); }} style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#e6f6d7',
                    padding: '6px 10px',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}>Close</button>
                </div>

                <div style={{ marginTop: 12, lineHeight: 1.5, color: '#cfe9a8' }}>
                  <p>You can end your turn to refresh your movement points and defend against the AI</p>
                  <p>Your Objective: Capture all enemy provinces</p>
                </div>
              </div>
            </div>
          )}

          {/* End turn button moved to top bar */}
        </>
      )}
    </div>
  );
}