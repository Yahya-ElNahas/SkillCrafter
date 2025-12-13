import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import AlliedCity from "../assets/allied-city.svg?react";
import EnemyCity from "../assets/enemy-city.svg?react";
import AlliedInfantry from "../assets/allied-infantry.svg?react";
import EnemyInfantry from "../assets/enemy-infantry.svg?react";
import AlliedArmor from "../assets/allied-armor.svg?react";
import EnemyArmor from "../assets/enemy-armor.svg?react";
import AlliedBarracks from "../assets/allied-barracks.svg?react";
import EnemyBarracks from "../assets/enemy-barracks.svg?react";
import Factory from "../assets/factory.svg?react";
import BattleAnimation from "./BattleAnimation";

const Map = lazy(() => import("../assets/map.svg?react"));

export default function MapPanel({
  provinces,
  alliedArmies,
  enemyArmies,
  currentTurn,
  selectedProvinceId,
  setSelectedProvinceId,
  selectedArmyId,
  setSelectedArmyId,
  hoveredArmyId,
  setHoveredArmyId,
  attacker,
  defender,
  showIDE,
  handleProvinceMove,
  MAP_WIDTH = 1920,
  MAP_HEIGHT = 1080,
  VIEWPORT_WIDTH = window.innerWidth,
  VIEWPORT_HEIGHT = window.innerHeight,
  CAMERA_CENTER_X = 961,
  CAMERA_CENTER_Y = 474,
  INITIAL_SCALE = 4,
  transformRef,
  showSelectUnitTutorial,
  showAttackTutorial,
  unitOnPath33Id,
  showTopicSelect,
  battleLoading,
  showProvinceTutorialStep1,
  setShowAttackTutorial,
  showProblemList
}) {
  // Tutorial state: on turn 1 show a small hint pointing to a random allied unit
  const [adjacentProvinces, setAdjacentProvinces] = useState([]);
  const [provinceCenters, setProvinceCenters] = useState({});
  const [provinceLocations, setProvinceLocations] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef(null);
  const clickTimerRef = useRef(null);

  // Helper to get center coordinates of a province
  function getProvinceCenterCoords(provinceId) {
    const centerElement = document.querySelector(`[inkscape\\:label="center_${provinceId}"]`);
    if (centerElement && (centerElement.tagName === "circle" || centerElement.tagName === "ellipse")) {
      const cx = Number(centerElement.getAttribute("cx") || centerElement.getAttribute("x") || 0);
      const cy = Number(centerElement.getAttribute("cy") || centerElement.getAttribute("y") || 0);
      return { x: cx, y: cy };
    }
    return null;
  }
  function getProvinceLocationCoords(provinceId) {
    const locationElement = document.querySelector(`[inkscape\\:label="location_${provinceId}"]`);
    if (locationElement && (locationElement.tagName === "circle" || locationElement.tagName === "ellipse")) {
      const cx = Number(locationElement.getAttribute("cx") || locationElement.getAttribute("x") || 0);
      const cy = Number(locationElement.getAttribute("cy") || locationElement.getAttribute("y") || 0);
      return { x: cx, y: cy };
    }
    return null;
  }

  // Compute province coordinates once when provinces change
  useEffect(() => {
    if (!provinces.length) return;
    setTimeout(() => {
      const centers = {};
      const locations = {};
      provinces.forEach(p => {
        centers[p.id] = getProvinceCenterCoords(p.id);
        locations[p.id] = getProvinceLocationCoords(p.id);
      });
      setProvinceCenters(centers);
      setProvinceLocations(locations);
      setIsLoaded(true);
    }, 1000); // Delay to allow SVG to load
  }, [provinces]);

  // Center camera on attacker when battle starts
  useEffect(() => {
    if (showIDE && attacker && transformRef.current && provinceCenters[attacker.position]) {
      const center = provinceCenters[attacker.position];
      const scale = 5;
      const positionX = VIEWPORT_WIDTH / 2 - (center.x-40) * scale;
      const positionY = VIEWPORT_HEIGHT / 2 - center.y * scale;
      transformRef.current.setTransform(positionX, positionY, scale);
    }
  }, [showIDE, attacker, provinceCenters]);

  // Calculate initial positionX and positionY to center CAMERA_CENTER_X/Y
  const initialPositionX = VIEWPORT_WIDTH / 2 - CAMERA_CENTER_X * INITIAL_SCALE;
  const initialPositionY = VIEWPORT_HEIGHT / 2 - CAMERA_CENTER_Y * INITIAL_SCALE;

  // Province coloring and click selection
  useEffect(() => {
    if (!provinces.length) return;
    const selectedArmyIsAllied = Boolean(alliedArmies.find(a => (a._id || a.id) === selectedArmyId));
    function handleClick(e) {
      if (showIDE) return;
      if (e.detail > 1) return;
      let id = e.target.getAttribute("inkscape:label") || e.target.id;
      if (id) {
        if(id.includes("location_")) {
          id = id.substring(8);
        }
        setSelectedProvinceId(id);
        setSelectedArmyId(null);
      }
    }
    provinces.forEach((province) => {
      const provinceElement = document.getElementById(province.id);
      const provinceCenterElement = document.querySelector(`[inkscape\\:label="center_${province.id}"]`);
      if (provinceElement) {
        provinceElement.style.fill = province.controller === "enemy" ? "#202020" : "#040B23";
        provinceElement.addEventListener("click", handleClick);
      }
      if (provinceCenterElement) {
        provinceCenterElement.style.fill = province.controller === "enemy" ? "#202020" : "#040B23";
        provinceCenterElement.addEventListener("click", handleClick);
      }
    });
    return () => {
      provinces.forEach((province) => {
        const provinceElement = document.getElementById(province.id);
        if (provinceElement) {
          provinceElement.removeEventListener("click", handleClick);
        }
        const provinceCenterElement = document.querySelector(`[inkscape\\:label="center_${province.id}"]`);
        if (provinceCenterElement) {
          provinceCenterElement.removeEventListener("click", handleClick);
        }
      });
    };
  }, [provinces, selectedProvinceId, showIDE]);

  // Fetch adjacent provinces for the selected unit from the backend
  useEffect(() => {
    let mounted = true;
    async function fetchAdjacencies() {
      if (!selectedArmyId) {
        if (mounted) setAdjacentProvinces([]);
        return;
      }
      try {
        const res = await fetch(`https://skillcrafter-backend-production-bc4b.up.railway.app/api/armies/adjacenciesOfUnit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unitId: selectedArmyId }),
        });
        if (!res.ok) {
          console.error("adjacencies fetch failed", res.status);
          if (mounted) setAdjacentProvinces([]);
          return;
        }
        const json = await res.json();
        if (mounted) setAdjacentProvinces(json.adjacencies || []);
      } catch (err) {
        console.error("fetchAdjacencies error:", err);
        if (mounted) setAdjacentProvinces([]);
      }
    }
    fetchAdjacencies();
    return () => { mounted = false; };
  }, [selectedArmyId]);

  // Province border highlighting on hover and movement/selection
  useEffect(() => {
    if (!provinces.length) return;
    const selectedArmyIsAllied = Boolean(alliedArmies.find(a => (a._id || a.id) === selectedArmyId));
    function handleClick(e) {
      if (showIDE) return;
      if (e.detail > 1) return;
      let id = e.target.getAttribute("inkscape:label") || e.target.id;
      if (id) {
        if(id.includes("location_")) {
          id = id.substring(9);
        }
        setSelectedProvinceId(id);
        setSelectedArmyId(null);
      }
    }
    provinces.forEach((province) => {
      const provinceElement = document.getElementById(province.id);
      const provinceCenterElement = document.querySelector(`[inkscape\\:label="center_${province.id}"]`);
      const provinceLocationElement = document.querySelector(`[inkscape\\:label="location_${province.id}"]`);

      // --- Highlighting ---
      if (provinceCenterElement && provinceElement) {
        const originalStroke = provinceElement.getAttribute("stroke");
        const originalStrokeWidth = provinceElement.getAttribute("stroke-width");
        const originalCursorCenter = provinceCenterElement.style.cursor || "";
        const originalCursorElem = provinceElement ? (provinceElement.style.cursor || "") : "";
        const originalCursorLocation = provinceLocationElement ? provinceLocationElement.style.cursor || "" : "";

        // determine when we should show pointer cursor:
        const ownedBarracksOrFactory = province.controller !== "enemy" && (province.type === "barracks" || province.type === "factory");
        const shouldPointer = ownedBarracksOrFactory || selectedArmyIsAllied;

        const mouseEnterHandler = () => {
          provinceElement.style.stroke = adjacentProvinces.includes(province.id) ? selectedArmyIsAllied ? "#90EE90" : "#EE9090" : "#808080";
          provinceElement.style.strokeWidth = "0.25";
          if (shouldPointer) {
            provinceElement.style.cursor = "pointer";
            provinceCenterElement.style.cursor = "pointer";
            if (provinceLocationElement) provinceLocationElement.style.cursor = "pointer";
          }
        };
        const mouseLeaveHandler = () => {
          if (!adjacentProvinces.includes(province.id)) {
            if (originalStroke !== null) {
              provinceElement.style.stroke = originalStroke;
            } else {
              provinceElement.removeAttribute("stroke");
              provinceElement.style.stroke = "";
            }
            if (originalStrokeWidth !== null) {
              provinceElement.style.strokeWidth = originalStrokeWidth;
            } else {
              provinceElement.removeAttribute("stroke-width");
              provinceElement.style.strokeWidth = "";
            }
          }
          provinceElement.style.cursor = originalCursorElem;
          provinceCenterElement.style.cursor = originalCursorCenter;
          if (provinceLocationElement) provinceLocationElement.style.cursor = originalCursorLocation;
        };

        provinceCenterElement.addEventListener("mouseenter", mouseEnterHandler);
        provinceCenterElement.addEventListener("mouseleave", mouseLeaveHandler);

        provinceCenterElement._mouseEnterHandler = mouseEnterHandler;
        provinceCenterElement._mouseLeaveHandler = mouseLeaveHandler;

        if (provinceLocationElement) {
          provinceLocationElement.addEventListener("mouseenter", mouseEnterHandler);
          provinceLocationElement.addEventListener("mouseleave", mouseLeaveHandler);
          provinceLocationElement._mouseEnterHandler = mouseEnterHandler;
          provinceLocationElement._mouseLeaveHandler = mouseLeaveHandler;
        }
      }

      if (provinceElement) {
        const originalStroke = provinceElement.getAttribute("stroke");
        const originalStrokeWidth = provinceElement.getAttribute("stroke-width");

        const ownedBarracksOrFactory = province.controller !== "enemy" && (province.type === "barracks" || province.type === "factory");
        const shouldPointer = ownedBarracksOrFactory || (adjacentProvinces.includes(province.id) && selectedArmyIsAllied);

        const mouseEnterHandler = () => {
          provinceElement.style.stroke = adjacentProvinces.includes(province.id) ? selectedArmyIsAllied ? "#90EE90" : "#EE9090" : "#808080";
          provinceElement.style.strokeWidth = "0.25";
          provinceElement.style.cursor = "";
          if (shouldPointer) provinceElement.style.cursor = "pointer";
        };
        const mouseLeaveHandler = () => {
          if (!adjacentProvinces.includes(province.id)) {
            if (originalStroke !== null) {
              provinceElement.style.stroke = originalStroke;
            } else {
              provinceElement.removeAttribute("stroke");
              provinceElement.style.stroke = "";
            }
            if (originalStrokeWidth !== null) {
              provinceElement.style.strokeWidth = originalStrokeWidth;
            } else {
              provinceElement.removeAttribute("stroke-width");
              provinceElement.style.strokeWidth = "";
            }
          } else {
            if(selectedArmyIsAllied) provinceElement.style.stroke = "#FFFFFF";
            else provinceElement.style.stroke = "#EE9090";
          }

          provinceElement.style.cursor = "";
        };

        provinceElement.addEventListener("mouseenter", mouseEnterHandler);
        provinceElement.addEventListener("mouseleave", mouseLeaveHandler);

        provinceElement._mouseEnterHandler = mouseEnterHandler;
        provinceElement._mouseLeaveHandler = mouseLeaveHandler;

        // --- Selection ---
        provinceElement.addEventListener("click", handleClick);

        // --- Movement ---
        const contextMenuHandler = (e) => {
          if (showIDE) return;
          if (!selectedArmyId) return;
          e.preventDefault();
          handleProvinceMove(province.id, e);
        };
        const dblClickHandler = (e) => {
          if (showIDE) return;
          if (!selectedArmyId) return;
          handleProvinceMove(province.id, e);
        };
        provinceElement.addEventListener("contextmenu", contextMenuHandler);
        provinceElement.addEventListener("dblclick", dblClickHandler);

        provinceElement._contextMenuHandler = contextMenuHandler;
        provinceElement._dblClickHandler = dblClickHandler;
      }

      if (provinceCenterElement) {
        provinceCenterElement.addEventListener("click", handleClick);
      }

      if (provinceLocationElement) {
        provinceLocationElement.addEventListener("click", handleClick);
      }

      // --- Coloring ---
      if (provinceElement) {
        provinceElement.style.fill = province.controller === "enemy" ? "#202020" : "#040B23";
        if (adjacentProvinces.includes(province.id)) {
          if(selectedArmyIsAllied) provinceElement.style.stroke = "#FFFFFF"; 
          else provinceElement.style.stroke = "#EE9090";
          provinceElement.style.strokeWidth = "0.25";
        } else {
          provinceElement.style.stroke = ""; // Remove highlight if not in adjacentProvinces
          provinceElement.style.strokeWidth = "";
        }
      }
      if (provinceCenterElement) {
        provinceCenterElement.style.fill = province.controller === "enemy" ? "#202020" : "#040B23";
      }
      if( provinceLocationElement) {
        provinceLocationElement.style.fill = province.controller === "enemy" ? "#202020" : "#040B23";
      }
    });
    return () => {
      provinces.forEach((province) => {
        const provinceElement = document.getElementById(province.id);
        const provinceCenterElement = document.querySelector(`[inkscape\\:label="center_${province.id}"]`);
        const provinceLocationElement = document.querySelector(`[inkscape\\:label="location_${province.id}"]`);
        if (provinceElement) {
          if (provinceElement._mouseEnterHandler)
            provinceElement.removeEventListener("mouseenter", provinceElement._mouseEnterHandler);
          if (provinceElement._mouseLeaveHandler)
            provinceElement.removeEventListener("mouseleave", provinceElement._mouseLeaveHandler);
          provinceElement.removeEventListener("click", handleClick);
          if (provinceElement._contextMenuHandler)
            provinceElement.removeEventListener("contextmenu", provinceElement._contextMenuHandler);
          if (provinceElement._dblClickHandler)
            provinceElement.removeEventListener("dblclick", provinceElement._dblClickHandler);
        }
        if (provinceCenterElement) {
          if (provinceCenterElement._mouseEnterHandler)
            provinceCenterElement.removeEventListener("mouseenter", provinceCenterElement._mouseEnterHandler);
          if (provinceCenterElement._mouseLeaveHandler)
            provinceCenterElement.removeEventListener("mouseleave", provinceCenterElement._mouseLeaveHandler);
          provinceCenterElement.removeEventListener("click", handleClick);
        }
        if (provinceLocationElement) {
          if (provinceLocationElement._mouseEnterHandler)
            provinceLocationElement.removeEventListener("mouseenter", provinceLocationElement._mouseEnterHandler);
          if (provinceLocationElement._mouseLeaveHandler)
            provinceLocationElement.removeEventListener("mouseleave", provinceLocationElement._mouseLeaveHandler);
          provinceLocationElement.removeEventListener("click", handleClick);
        }
      });
    };
  }, [provinces, selectedArmyId, selectedProvinceId, showIDE, handleProvinceMove, setSelectedProvinceId, adjacentProvinces]);

  // Reset adjacentProvinces and remove highlights when no unit is selected
  useEffect(() => {
    if (!selectedArmyId) {
      setAdjacentProvinces([]);
      provinces.forEach((province) => {
        const provinceElement = document.getElementById(province.id);
        if (provinceElement) {
          provinceElement.style.stroke = ""; // Remove highlight
          provinceElement.style.strokeWidth = "";
        }
      });
    }
  }, [selectedArmyId, provinces]);

  return (
    <TransformWrapper
        onInit={(ref) => {
          transformRef.current = ref;
        }}
        initialScale={INITIAL_SCALE}
        minScale={4}
        maxScale={7}
        initialPositionX={initialPositionX}
        initialPositionY={initialPositionY}
        centerOnInit={false}
        limitToBounds={false}
        wheel={{ step: 0.5 }}
        doubleClick={{ disabled: true }}
        pinch={{ step: 1 }}
    >
      <TransformComponent
        wrapperClass="w-screen h-screen"
        contentClass="w-full h-full"
      >
        <Suspense fallback={<div>Loading map...</div>}>
          <div ref={mapRef} className="w-full h-full">
            <Map className="w-full h-full pointer-events-auto" />
          </div>
        </Suspense>

        {/* Render city icons and names at province centers and barracks and factories */}
        {provinces
          .filter((province) => province.type === "city" || province.type === "barracks" || province.type === "factory")
          .map((province, idx) => {
            const center = provinceLocations[province.id];
            if (!center) return null;
            return (
              <div
                key={`province-${province.id}-${idx}`}
                style={{
                  position: "absolute",
                  left: center.x,
                  top: center.y,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  userSelect: "none",
                  pointerEvents: "none",
                  transform: "translate(-50%, -75%)",
                  zIndex: 1000,
                }}
              >
                <span
                  style={{
                    color: province.controller === "enemy" ? "#791010" : "#64B570",
                    fontSize: 4,
                    fontFamily: "sans-serif",
                    fontStyle: province.type === "city" ? "italic" : "normal",
                    fontWeight: province.type === "city" ? "bold" : "normal",
                    marginBottom: 0,
                    textShadow: "0 1px 4px #000",
                    pointerEvents: "none",
                    zIndex: 9999,
                  }}
                >
                  {province.type === "city" ? province.name : province.type === "barracks" ? "Barracks" : "Factory"}
                </span>
                {(() => {
                  return province.type === "city" ? (
                    province.controller === "enemy" ? (
                      <EnemyCity width={6} height={6} style={{ pointerEvents: "none" }} />
                    ) : (
                      <AlliedCity width={6} height={6} style={{ pointerEvents: "none" }} />
                    )
                  ) : province.type === "barracks" ? (
                    province.controller === "enemy" ? (
                      <EnemyBarracks width={6} height={6} style={{ pointerEvents: "none" }} />
                    ) : (
                      <AlliedBarracks width={6} height={6} style={{ pointerEvents: "none" }} />
                    )
                  ) : province.type === "factory" ? (
                      <Factory width={6} height={6} style={{ pointerEvents: "none" }} />
                  ) : null;
                })()}
              </div>
            );
          })
        }

        {/* Render allied armies */}
        {alliedArmies.map((army) => {
          const center = provinceCenters[army.position];
          if (!center) return null;
          const id = army._id || army.id;
          const isSelected = selectedArmyId === id;
          const isHovered = hoveredArmyId === id;
          return (
            <div
              key={`allied-army-${id || `temp-allied-${idx}`}`}
              style={{
                position: "absolute",
                left: center.x,
                top: center.y,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                userSelect: "none",
                pointerEvents: "auto",
                transform: "translate(-50%, -40%)",
                cursor: "pointer",
                zIndex: isSelected ? 9998 : 9997,
              }}
              onClick={(e) => {
                if (e.detail > 1) return;
                if (showIDE) return;
                if (selectedArmyId === id) setSelectedArmyId(null);
                else {
                  setSelectedArmyId(id);
                }
                setSelectedProvinceId(null);
              }}
              onContextMenu={e => {
                if (showIDE) return;
                e.preventDefault();
                if (selectedArmyId && selectedArmyId !== id) {
                  handleProvinceMove(army.position, e);
                  // hide attack tutorial once an attack is initiated via right-click
                  setShowAttackTutorial(false);
                }
              }}
              onMouseEnter={() => setHoveredArmyId(id)}
              onMouseLeave={() => setHoveredArmyId(null)}
            >
                {army.type === "armor" ? (
                  <AlliedArmor width={10} height={10} style={{
                    pointerEvents: "none",
                    stroke: isSelected ? "#051035" : isHovered ? "white" : "none",
                    strokeWidth: isSelected || isHovered ? 10 : 0,
                  }} 
                />
              ) : (
              <AlliedInfantry width={6} height={6} style={{
                  pointerEvents: "none",
                  stroke: isSelected ? "#051035" : isHovered ? "white" : "none",
                  strokeWidth: isSelected || isHovered ? 10 : 0,
                }} 
              />)}
            </div>
          );
        })}

        {/* Render enemy armies */}
        {enemyArmies.map((army) => {
          const center = provinceCenters[army.position];
          if (!center) return null;
          const id = army._id || army.id;
          const isSelected = selectedArmyId === id;
          const isHovered = hoveredArmyId === id;
          return (
            <div
              key={`enemy-army-${id || `temp-enemy-${idx}`}`}
              style={{
                position: "absolute",
                left: center.x,
                top: center.y,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                userSelect: "none",
                pointerEvents: "auto",
                transform: "translate(-50%, -40%)",
                cursor: "pointer",
                zIndex: isSelected ? 9998 : 9997,
              }}
              onClick={(e) => {
                if (e.detail > 1) return;
                if (showIDE) return;
                if (selectedArmyId === id) setSelectedArmyId(null);
                else {
                  setSelectedArmyId(id);
                }
                setSelectedProvinceId(null);
              }}
              onContextMenu={e => {
                if (showIDE) return;
                e.preventDefault();
                if (selectedArmyId && selectedArmyId !== id) {
                  handleProvinceMove(army.position, e);
                  // hide attack tutorial once an attack is initiated via right-click
                  setShowAttackTutorial(false);
                }
              }}
              onMouseEnter={() => setHoveredArmyId(id)}
              onMouseLeave={() => setHoveredArmyId(null)}
            >
              {army.type === "armor" ? (
                  <EnemyArmor width={10} height={10} style={{
                  pointerEvents: "none",
                    stroke: isSelected ? "#2f2f2f" : isHovered ? "white" : "none",
                    strokeWidth: isSelected || isHovered ? 10 : 0,
                  }} 
                />
              ) : (
                <EnemyInfantry width={6} height={6} style={{
                  pointerEvents: "none",
                  stroke: isSelected ? "#2f2f2f" : isHovered ? "white" : "none",
                  strokeWidth: isSelected || isHovered ? 10 : 0,
                }} 
              />)}
            </div>
          );
        })}

        {/* Select Unit Tutorial */}
        {showSelectUnitTutorial && unitOnPath33Id && !showTopicSelect && !battleLoading && !showIDE && !showProblemList && (() => {
          const target = alliedArmies.find(a => (a._id || a.id) === unitOnPath33Id);
          const center = target ? provinceCenters[target.position] : null;
          if (!center) return null;
          return (
            <>
              <style>{`@keyframes selectFloat {0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)}}
                .select-arrow{animation:selectFloat 1.2s ease-in-out infinite;font-size:12px;color:#bde7b0;text-shadow:0 2px 8px rgba(0,0,0,0.8);line-height:1}
                .select-bubble{background:#0f1a12;border:1px solid rgba(255,255,255,0.04);color:#e6f6d7;padding:4px 6px;border-radius:6px;font-size:10px;white-space:nowrap;font-weight:bold;box-shadow:0 3px 8px rgba(0,0,0,0.5);}
              `}</style>
              <div
                style={{
                  position: "absolute",
                  left: center.x,
                  top: center.y,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: "translate(-50%, -110%)",
                  pointerEvents: "none",
                  zIndex: 10010,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className="select-bubble">Click to select this unit</div>
                  <div className="select-arrow">▼</div>
                </div>
              </div>
            </>
          );
        })()}

        {/* Attack Tutorial */}
        {showAttackTutorial && !showTopicSelect && !battleLoading && !showIDE && !showProblemList && (() => {
          const enemyOnPath36 = enemyArmies.find(a => a.position === "path36");
          const center = enemyOnPath36 ? provinceCenters["path36"] : null;
          if (!center) return null;
          return (
            <>
              <style>{`@keyframes attackFloat {0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)}}
                .attack-arrow{animation:attackFloat 1.2s ease-in-out infinite;font-size:12px;color:#ee9090;text-shadow:0 2px 8px rgba(0,0,0,0.8);line-height:1}
                .attack-bubble{background:#2b1212;border:1px solid rgba(238,144,144,0.2);color:#ee9090;padding:4px 6px;border-radius:6px;font-size:10px;white-space:nowrap;font-weight:bold;box-shadow:0 3px 8px rgba(0,0,0,0.5);}
              `}</style>
              <div
                style={{
                  position: "absolute",
                  left: center.x,
                  top: center.y,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: "translate(-50%, -110%)",
                  pointerEvents: "none",
                  zIndex: 10011,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className="attack-bubble">Right-click to attack enemy unit</div>
                  <div className="attack-arrow">▼</div>
                </div>
              </div>
            </>
          );
        })()}

        {/* Province Tutorial Step 1 */}
        {showProvinceTutorialStep1 && !showTopicSelect && !battleLoading && !showIDE && !showProblemList && (() => {
          const center = provinceLocations["path32"];
          if (!center) return null;
          return (
            <>
              <style>{`@keyframes provinceFloat {0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)}}
                .province-arrow{animation:provinceFloat 1.2s ease-in-out infinite;font-size:12px;color:#bde7b0;text-shadow:0 2px 8px rgba(0,0,0,0.8);line-height:1}
                .province-bubble{background:#0f1a12;border:1px solid rgba(255,255,255,0.04);color:#e6f6d7;padding:4px 6px;border-radius:6px;font-size:10px;white-space:nowrap;font-weight:bold;box-shadow:0 3px 8px rgba(0,0,0,0.5);}
              `}</style>
              <div
                style={{
                  position: "absolute",
                  left: center.x,
                  top: center.y,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: "translate(-50%, -110%)",
                  pointerEvents: "none",
                  zIndex: 10012,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className="province-bubble">Click on barracks</div>
                  <div className="province-arrow">▼</div>
                </div>
              </div>
            </>
          );
        })()}

        {attacker && defender && showIDE && (() => {
          const from = provinceCenters[attacker.position] || { x: 0, y: 0 };
          const to = provinceCenters[defender.position] || { x: 0, y: 0 };
          return <BattleAnimation key={attacker.id || 'battle'} from={from} to={to} onDone={attacker.onDone} />;
        })()}
      </TransformComponent>
    </TransformWrapper>
  );
};