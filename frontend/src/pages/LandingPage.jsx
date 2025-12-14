import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from '../../logo.svg';

export default function LandingPage() {
  const [primaryHover, setPrimaryHover] = useState(false);
  const [primaryActive, setPrimaryActive] = useState(false);
  const [ghostHover, setGhostHover] = useState(false);
  const [ghostActive, setGhostActive] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pageStyle = {
    minHeight: "100vh",
    width: "100%",
    margin: 0,
    background: "linear-gradient(180deg, #0b1208 0%, #0f1a12 25%, #16241a 50%, #1a2e20 75%, #0f1a12 100%)",
    color: "#e6f6d7",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    overflowX: "hidden",
    position: "relative"
  };

  // Animated background elements
  const backgroundElements = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 0
  };

  const floatingShape = (delay, size, color, top, left) => ({
    position: "absolute",
    width: size,
    height: size,
    background: `radial-gradient(circle, ${color}20 0%, ${color}05 70%, transparent 100%)`,
    borderRadius: "50%",
    top: top,
    left: left,
    animation: `float ${3 + delay}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    filter: "blur(1px)"
  });

  const heroSection = {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    transform: `translateY(${scrollY * 0.3}px)`
  };

  const heroContainer = {
    maxWidth: 1400,
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 80,
    alignItems: "center",
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "1fr",
      gap: 40,
      textAlign: "center"
    }
  };

  const heroContent = {
    position: "relative"
  };

  const badge = {
    display: "inline-block",
    background: "linear-gradient(135deg, #8a9b5a 0%, #6a8440 100%)",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: 24,
    boxShadow: "0 4px 12px rgba(138, 155, 90, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  };

  const titleStyle = {
    fontSize: 64,
    margin: "0 0 30px 0",
    color: "#fff7d9",
    textShadow: "0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)",
    background: "linear-gradient(135deg, #fff7d9 0%, #e6f6d7 50%, #bff7a8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    "@media (max-width: 768px)": {
      fontSize: 48
    }
  };

  const subtitle = {
    margin: "0 0 32px 0",
    color: "#dfe7c9",
    fontSize: 20,
    lineHeight: 1.6,
    fontWeight: 400,
    opacity: 0.9,
    maxWidth: 500,
    "@media (max-width: 1024px)": {
      maxWidth: "100%"
    }
  };

  const ctaRow = {
    display: "flex",
    gap: 16,
    alignItems: "center",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      width: "100%"
    }
  };

  const ctaPrimary = (isHover, isActive) => ({
    background: isActive
      ? "linear-gradient(180deg, #1f3d1a, #1a2f15)"
      : isHover
      ? "linear-gradient(135deg, #4a7c3a, #3a6b32)"
      : "linear-gradient(135deg, #2f5b2a, #25441f)",
    color: "#f7f9ec",
    border: "2px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "16px 32px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    textDecoration: "none",
    boxShadow: isActive
      ? "0 4px 12px rgba(20,40,10,0.4)"
      : isHover
      ? "0 12px 32px rgba(20,40,10,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
      : "0 8px 24px rgba(20,40,10,0.3)",
    transform: isActive ? "translateY(2px)" : isHover ? "translateY(-2px)" : "translateY(0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "@media (max-width: 768px)": {
      width: "100%",
      textAlign: "center"
    }
  });

  const ctaGhost = (isHover, isActive) => ({
    background: isHover ? "rgba(255,255,255,0.08)" : "transparent",
    color: isHover ? "#f7f9ec" : "#dfe7c9",
    border: `2px solid ${isHover ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12,
    padding: "14px 28px",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 16,
    boxShadow: isHover ? "0 8px 20px rgba(0,0,0,0.2)" : "none",
    transform: isActive ? "translateY(1px)" : "translateY(0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "@media (max-width: 768px)": {
      width: "100%",
      textAlign: "center"
    }
  });

  const heroVisual = {
    position: "relative",
    height: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 1024px)": {
      height: 300,
      marginTop: 40
    }
  };

  const visualCard = {
    width: 400,
    height: 300,
    background: "linear-gradient(135deg, rgba(138, 155, 90, 0.1) 0%, rgba(106, 132, 64, 0.05) 100%)",
    borderRadius: 20,
    border: "2px solid rgba(138, 155, 90, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
    "@media (max-width: 1024px)": {
      width: 300,
      height: 200
    }
  };

  const visualIcon = {
    width: 120,
    height: 120,
    opacity: 0.8,
    filter: "drop-shadow(0 8px 16px rgba(138, 155, 90, 0.3))",
    "@media (max-width: 1024px)": {
      width: 80,
      height: 80
    }
  };

  return (
    <div style={pageStyle}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }

          @media (max-width: 1024px) {
            .hero-container { grid-template-columns: 1fr !important; text-align: center !important; }
          }

          @media (max-width: 768px) {
            .hero-title { font-size: 48px !important; }
            .cta-row { flex-direction: column !important; }
            .cta-primary, .cta-ghost { width: 100% !important; }
          }
        `}
      </style>

      {/* Animated Background */}
      <div style={backgroundElements}>
        <div style={floatingShape(0, 80, '#8a9b5a', '10%', '10%')}></div>
        <div style={floatingShape(1, 60, '#6a8440', '20%', '80%')}></div>
        <div style={floatingShape(2, 100, '#4a6b2a', '60%', '15%')}></div>
        <div style={floatingShape(0.5, 70, '#9bb068', '70%', '85%')}></div>
      </div>

      {/* Hero Section */}
      <section style={heroSection}>
        <div style={heroContainer} className="hero-container">
          <div style={heroContent}>
            <div style={badge}>🎯 Interactive Learning Platform</div>
            <h1 style={titleStyle} className="hero-title">SkillCrafter — Forge Your Coding Skills</h1>

            <div style={ctaRow} className="cta-row">
              <Link
                to="/register"
                style={ctaPrimary(primaryHover, primaryActive)}
                onMouseEnter={() => setPrimaryHover(true)}
                onMouseLeave={() => setPrimaryHover(false)}
                onMouseDown={() => setPrimaryActive(true)}
                onMouseUp={() => setPrimaryActive(false)}
              >
                🚀 Create an Account
              </Link>
              <Link
                to="/login"
                style={ctaGhost(ghostHover, ghostActive)}
                onMouseEnter={() => setGhostHover(true)}
                onMouseLeave={() => setGhostHover(false)}
                onMouseDown={() => setGhostActive(true)}
                onMouseUp={() => setGhostActive(false)}
              >
                Sign In
              </Link>
            </div>
          </div>

          <div style={heroVisual}>
            <div style={visualCard}>
              <img src={logo} alt="SkillCrafter Logo" style={visualIcon} />
            </div>
          </div>
        </div>
      </section>

      {/* Credits Section */}
      <section style={{
        padding: "60px 20px",
        textAlign: "center",
        background: "linear-gradient(180deg, rgba(15, 25, 18, 0.8) 0%, rgba(11, 18, 8, 0.9) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        marginTop: "40px"
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 20px"
        }}>
          <div style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#e6f6d7",
            marginBottom: "12px",
            letterSpacing: "0.5px"
          }}>
            Developed by <span style={{
              background: "linear-gradient(135deg, #4CAF50, #45a049)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: "700"
            }}>Yahya El Nahas</span>
          </div>
          <div style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#dfe7c9",
            opacity: 0.9,
            lineHeight: "1.5"
          }}>
            Supervised by <span style={{
              color: "#cfe9a8",
              fontWeight: "600"
            }}>Prof. Slim Abdennadher, Dr. Caroline Sabty, Dr. Alia El Bolock</span>
          </div>
        </div>
      </section>
    </div>
  );
}