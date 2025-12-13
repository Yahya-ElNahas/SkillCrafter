import React, { useState, useEffect } from 'react';

export const Intro = ({ onClose }) => {
  const lines = [
    "The year is 2025.",
    "Our armies are losing the war.",
    "You are our last hope against the AI army.",
    "Solve coding problems to win battles against the AI.",
    "Your code can win the war.",
    ];
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      const currentLine = lines[currentLineIndex];
      if (currentCharIndex < currentLine.length) {
        const timer = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
        }, currentLine.includes('⚔️') || currentLine.includes('🎯') ? 50 : 80); // Faster for emojis
        return () => clearTimeout(timer);
      } else {
        // Line finished, add to displayedLines and move to next
        setDisplayedLines(prev => [...prev, currentLine]);
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }
    } else {
      // All lines done
      setTimeout(() => setIsTypingDone(true), 500);
    }
  }, [currentLineIndex, currentCharIndex, lines]);

  const currentLineText = currentLineIndex < lines.length ? lines[currentLineIndex].slice(0, currentCharIndex) : '';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #2a0a0a 25%, #4a1a0a 50%, #1a0a1a 75%, #0a0a0a 100%)',
        color: '#ff6b35',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        fontFamily: 'Courier New, monospace',
        fontSize: '24px',
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        overflow: 'hidden'
      }}
      onClick={onClose}
    >
      {/* Fiery background layers */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 100, 0, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 150, 0, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 60% 40%, rgba(255, 200, 0, 0.1) 0%, transparent 50%)
        `,
        animation: 'fireFlicker 3s ease-in-out infinite'
      }} />

      {/* Sparks container */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {/* Generate multiple sparks */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: '#ffd700',
              borderRadius: '50%',
              boxShadow: '0 0 4px #ffd700, 0 0 8px #ff6b35',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `spark${i % 3 + 1} ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Flame-like overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 69, 0, 0.1) 50%, transparent 70%)',
        animation: 'flameWave 4s ease-in-out infinite'
      }} />

      {/* Border frame with fiery glow */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        border: '3px solid #ff4444',
        borderRadius: '10px',
        boxShadow: `
          0 0 30px rgba(255, 68, 68, 0.5),
          0 0 60px rgba(255, 100, 0, 0.3),
          inset 0 0 30px rgba(255, 68, 68, 0.1),
          inset 0 0 60px rgba(255, 100, 0, 0.05)
        `,
        background: 'rgba(10, 0, 0, 0.9)',
        animation: 'borderGlow 2s ease-in-out infinite alternate'
      }} />

      {/* Border frame */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        border: '3px solid #ff4444',
        borderRadius: '10px',
        boxShadow: '0 0 30px rgba(255, 68, 68, 0.3), inset 0 0 30px rgba(255, 68, 68, 0.1)',
        background: 'rgba(0, 0, 0, 0.8)'
      }} />

      {/* Corner decorations */}
      <div style={{
        position: 'absolute',
        top: '3%',
        left: '3%',
        width: '20px',
        height: '20px',
        borderTop: '3px solid #ffd700',
        borderLeft: '3px solid #ffd700'
      }} />
      <div style={{
        position: 'absolute',
        top: '3%',
        right: '3%',
        width: '20px',
        height: '20px',
        borderTop: '3px solid #ffd700',
        borderRight: '3px solid #ffd700'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '3%',
        left: '3%',
        width: '20px',
        height: '20px',
        borderBottom: '3px solid #ffd700',
        borderLeft: '3px solid #ffd700'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '3%',
        right: '3%',
        width: '20px',
        height: '20px',
        borderBottom: '3px solid #ffd700',
        borderRight: '3px solid #ffd700'
      }} />

      {/* Main content */}
      <div style={{
        maxWidth: '80%',
        lineHeight: '1.6',
        textShadow: '0 0 10px rgba(255, 68, 68, 0.5), 0 0 20px rgba(255, 68, 68, 0.3)',
        zIndex: 1,
        padding: '20px'
      }}>
        {displayedLines.map((line, index) => (
          <div
            key={index}
            style={{
              marginBottom: line === '' ? '10px' : '5px',
              fontSize: line.includes('⚔️') || line.includes('🎯') ? '28px' : '24px',
              fontWeight: line.includes('⚔️') || line.includes('🎯') ? 'bold' : 'normal',
              color: line.includes('⚔️') || line.includes('🎯') ? '#ffd700' : '#ff6b35',
              textShadow: line.includes('⚔️') || line.includes('🎯') ?
                '0 0 15px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.5)' :
                '0 0 10px rgba(255, 107, 53, 0.6), 0 0 20px rgba(255, 107, 53, 0.4), 0 0 30px rgba(255, 69, 0, 0.2)'
            }}
          >
            {line}
          </div>
        ))}
        {currentLineText && (
          <div
            style={{
              fontSize: lines[currentLineIndex]?.includes('⚔️') || lines[currentLineIndex]?.includes('🎯') ? '28px' : '24px',
              fontWeight: lines[currentLineIndex]?.includes('⚔️') || lines[currentLineIndex]?.includes('🎯') ? 'bold' : 'normal',
              color: lines[currentLineIndex]?.includes('⚔️') || lines[currentLineIndex]?.includes('🎯') ? '#ffd700' : '#ff6b35',
              textShadow: lines[currentLineIndex]?.includes('⚔️') || lines[currentLineIndex]?.includes('🎯') ?
                '0 0 15px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.5)' :
                '0 0 10px rgba(255, 107, 53, 0.6), 0 0 20px rgba(255, 107, 53, 0.4), 0 0 30px rgba(255, 69, 0, 0.2)',
              borderRight: '2px solid #ff6b35',
              animation: 'blink 1s infinite'
            }}
          >
            {currentLineText}
          </div>
        )}
      </div>

      {isTypingDone && (
        <div
          style={{
            marginTop: '30px',
            fontSize: '16px',
            opacity: 0.8,
            color: '#ffd700',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            padding: '10px 20px',
            border: '1px solid #ffd700',
            borderRadius: '5px',
            background: 'rgba(255, 107, 53, 0.1)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          🖱️ CLICK ANYWHERE TO Start 🖱️
        </div>
      )}

      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fireFlicker {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            25% { opacity: 0.6; transform: scale(1.02); }
            50% { opacity: 0.4; transform: scale(0.98); }
            75% { opacity: 0.7; transform: scale(1.01); }
          }
          @keyframes flameWave {
            0%, 100% { transform: translateX(-10px) rotate(0deg); opacity: 0.3; }
            25% { transform: translateX(10px) rotate(1deg); opacity: 0.5; }
            50% { transform: translateX(-5px) rotate(-0.5deg); opacity: 0.4; }
            75% { transform: translateX(5px) rotate(0.5deg); opacity: 0.6; }
          }
          @keyframes borderGlow {
            0% { box-shadow: 0 0 30px rgba(255, 68, 68, 0.5), 0 0 60px rgba(255, 100, 0, 0.3), inset 0 0 30px rgba(255, 68, 68, 0.1); }
            100% { box-shadow: 0 0 40px rgba(255, 68, 68, 0.7), 0 0 80px rgba(255, 100, 0, 0.5), inset 0 0 40px rgba(255, 68, 68, 0.2); }
          }
          @keyframes spark1 {
            0%, 100% { transform: translateY(0px) scale(1); opacity: 0; }
            20% { opacity: 0.6; }
            50% { transform: translateY(-8px) scale(1.1); opacity: 0.9; }
            80% { opacity: 0.6; }
          }
          @keyframes spark2 {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0; }
            20% { opacity: 0.5; }
            50% { transform: translateY(-6px) translateX(2px) scale(1.05); opacity: 0.8; }
            80% { opacity: 0.5; }
          }
          @keyframes spark3 {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0; }
            20% { opacity: 0.4; }
            50% { transform: translateY(-10px) translateX(-1px) scale(0.95); opacity: 0.7; }
            80% { opacity: 0.4; }
          }
          @keyframes blink {
            0%, 50% { border-color: #ff4444; }
            51%, 100% { border-color: transparent; }
          }
        `
      }} />
    </div>
  );
};