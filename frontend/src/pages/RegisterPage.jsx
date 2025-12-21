import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [userVersion, setUserVersion] = useState(null);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" }
  ];

  const dropdownRef = useRef(null);
  const genderDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleGenderClickOutside(event) {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
        setIsGenderDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleGenderClickOutside);
    return () => document.removeEventListener("mousedown", handleGenderClickOutside);
  }, []);

  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, gender })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Registration failed");
      
      // Store the assigned version, open form, and show modal
      setUserVersion(body.user.version);
      const formUrl = body.user.version === 3 
        ? "https://docs.google.com/forms/d/e/1FAIpQLScc1gc0y54pA7yVPCIaEwXHGUUwfVjaERzpALiKMowlYvgbLQ/viewform?usp=publish-editor"
        : "https://docs.google.com/forms/d/e/1FAIpQLSdusm6zA9Wxwox9-vuC2d7S2kJl9iIOglHFe-Lfe2Gj0dPr9g/viewform?usp=dialog";
      window.open(formUrl, '_blank');
      setShowFormModal(true);
    } catch (e) {
      console.log(e);
      setErr(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const handleFormConfirmation = async () => {
    try {
      // Now perform login after form confirmation
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Login failed");
      localStorage.setItem('token', body.token);
      localStorage.setItem('justSignedUp', 'true');
      window.dispatchEvent(new Event('tokenSet'));
      
      setShowFormModal(false);
      if(userVersion === 3) nav("/dashboard");
      else nav("/app");
    } catch (e) {
      console.log(e);
      setErr(e.message || "Login failed");
      setShowFormModal(false); // Close modal on error
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    width: "100%",
    margin: 0,
    background: "linear-gradient(180deg, #0b1208 0%, #0f1a12 25%, #16241a 50%, #1a2e20 75%, #0f1a12 100%)",
    color: "#e6f6d7",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    overflowX: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
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

  const formContainer = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 400,
    transform: `translateY(${scrollY * 0.1}px)`
  };

  const card = {
    width: "100%",
    padding: 24,
    borderRadius: 20,
    background: "linear-gradient(135deg, rgba(54, 75, 42, 0.95) 0%, rgba(43, 61, 32, 0.9) 100%)",
    boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
    border: "2px solid rgba(138, 155, 90, 0.2)",
    backdropFilter: "blur(20px)",
    position: "relative",
    overflow: "hidden"
  };

  const cardGlow = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(138, 155, 90, 0.1) 0%, transparent 50%, rgba(106, 132, 64, 0.05) 100%)",
    borderRadius: 24,
    pointerEvents: "none"
  };

  const headerStyle = {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 800,
    color: "#fff7d9",
    margin: "0 0 6px 0",
    textShadow: "0 4px 16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
    letterSpacing: -0.5,
    background: "linear-gradient(135deg, #fff7d9 0%, #e6f6d7 50%, #bff7a8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  const subtitle = {
    textAlign: "center",
    color: "#cfe9a8",
    fontSize: 14,
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 1.4
  };

  const inputGroup = {
    marginBottom: 16,
    position: "relative"
  };

  const inputLabel = (isFocused, hasValue) => ({
    position: "absolute",
    left: 14,
    top: isFocused || hasValue ? 6 : 14,
    fontSize: isFocused || hasValue ? 11 : 14,
    color: isFocused ? "#8a9b5a" : "#bfe9a8",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: "none",
    fontWeight: 500,
    zIndex: 2
  });

  const input = (isFocused) => ({
    width: "100%",
    padding: "14px 14px 14px 14px",
    borderRadius: 10,
    border: `2px solid ${isFocused ? "rgba(138, 155, 90, 0.4)" : "rgba(255,255,255,0.08)"}`,
    background: "rgba(255,255,255,0.02)",
    color: "#eaf7d9",
    fontSize: 14,
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isFocused
      ? "0 0 0 3px rgba(138, 155, 90, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
      : "0 4px 12px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)"
  });

  const selectStyle = (isOpen) => ({
    width: "100%",
    padding: "14px 14px 14px 14px",
    borderRadius: 10,
    border: `2px solid ${isOpen ? "rgba(138, 155, 90, 0.4)" : "rgba(255,255,255,0.08)"}`,
    background: "rgba(255,255,255,0.02)",
    color: "#f7f9ec",
    fontSize: 14,
    cursor: "pointer",
    boxShadow: isOpen
      ? "0 0 0 3px rgba(138, 155, 90, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
      : "0 4px 12px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative"
  });

  const dropdownArrow = {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8a9b5a",
    fontSize: 14,
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: "none"
  };

  const dropdownMenu = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "linear-gradient(135deg, rgba(54, 75, 42, 0.98) 0%, rgba(43, 61, 32, 0.95) 100%)",
    border: "2px solid rgba(138, 155, 90, 0.2)",
    borderRadius: 12,
    boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
    zIndex: 10,
    maxHeight: 200,
    overflowY: "auto",
    backdropFilter: "blur(20px)"
  };

  const dropdownItem = {
    padding: "14px 16px",
    color: "#f7f9ec",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  };

  const primaryBtn = (isHover, isActive) => ({
    width: "100%",
    padding: "14px 20px",
    borderRadius: 10,
    background: isActive
      ? "linear-gradient(180deg, #1f3d1a, #1a2f15)"
      : isHover
      ? "linear-gradient(135deg, #4a7c3a, #3a6b32)"
      : "linear-gradient(135deg, #2f5b2a, #25441f)",
    color: "#f7f9ec",
    border: "2px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    boxShadow: isActive
      ? "0 4px 12px rgba(20,40,10,0.4)"
      : isHover
      ? "0 12px 32px rgba(20,40,10,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
      : "0 8px 24px rgba(20,40,10,0.3)",
    transform: isActive ? "translateY(2px)" : isHover ? "translateY(-2px)" : "translateY(0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    marginTop: 6
  });

  const errorStyle = {
    marginTop: 12,
    color: "#ff9b8a",
    fontSize: 13,
    textAlign: "center",
    background: "rgba(255, 155, 138, 0.1)",
    padding: "10px",
    borderRadius: 6,
    border: "1px solid rgba(255, 155, 138, 0.2)"
  };

  const footerStyle = {
    marginTop: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10
  };

  const linkStyle = {
    color: "#8a9b5a",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 13,
    transition: "all 0.2s ease",
    padding: "3px 6px",
    borderRadius: 4
  };

  const backLinkStyle = {
    color: "#cfe9a8",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.2s ease",
    padding: "3px 6px",
    borderRadius: 4
  };

  return (
    <div style={pageStyle}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }

          .dropdown-arrow-open {
            transform: translateY(-50%) rotate(180deg);
          }

          .input-focus {
            border-color: rgba(138, 155, 90, 0.4) !important;
            box-shadow: 0 0 0 3px rgba(138, 155, 90, 0.15), inset 0 1px 0 rgba(255,255,255,0.1) !important;
          }

          .link-hover:hover {
            background: rgba(138, 155, 90, 0.1);
            color: #9fbf86;
          }

          .back-link-hover:hover {
            background: rgba(207, 233, 168, 0.1);
            color: #e6f6d7;
          }
        `}
      </style>

      {/* Animated Background */}
      <div style={backgroundElements}>
        <div style={floatingShape(0, 60, '#8a9b5a', '15%', '10%')}></div>
        <div style={floatingShape(1.5, 40, '#6a8440', '25%', '85%')}></div>
        <div style={floatingShape(2, 80, '#4a6b2a', '70%', '20%')}></div>
        <div style={floatingShape(0.8, 50, '#9bb068', '60%', '80%')}></div>
      </div>

      <div style={formContainer}>
        <div style={card}>
          <div style={cardGlow}></div>

          <h2 style={headerStyle}>Sign Up</h2> <br />

          <form onSubmit={submit}>
            <div style={inputGroup}>
              <label style={inputLabel(focusedField === 'username', username)}>
                Username
              </label>
              <input
                style={input(focusedField === 'username')}
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete="username"
              />
            </div>

            <div style={inputGroup}>
              <label style={inputLabel(focusedField === 'password', password)}>
                Password
              </label>
              <input
                style={input(focusedField === 'password')}
                placeholder=""
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Hidden select for gender form submission */}
            <select
              style={{ display: "none" }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* Custom gender dropdown */}
            <div ref={genderDropdownRef} style={{ position: "relative", marginBottom: 20 }}>
              <div
                style={selectStyle(isGenderDropdownOpen)}
                onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
              >
                <span style={{ fontSize: 12, color: "#bfe9a8", position: "absolute", top: 6, left: 14 }}>
                  Gender
                </span>
                <span style={{ marginTop: 6, display: "block" }}>
                  {gender ? genderOptions.find(opt => opt.value === gender)?.label : "Select gender"}
                </span>
                <span
                  style={{
                    ...dropdownArrow,
                    transform: isGenderDropdownOpen ? "translateY(-50%) rotate(180deg)" : "translateY(-50%) rotate(0deg)"
                  }}
                >
                  ▼
                </span>
              </div>
              {isGenderDropdownOpen && (
                <div style={dropdownMenu}>
                  {genderOptions.map(option => (
                    <div
                      key={option.value}
                      style={dropdownItem}
                      onMouseEnter={(e) => e.target.style.background = "rgba(138, 155, 90, 0.1)"}
                      onMouseLeave={(e) => e.target.style.background = "transparent"}
                      onClick={() => {
                        setGender(option.value);
                        setIsGenderDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              style={primaryBtn(btnHover, btnActive)}
              type="submit"
              disabled={loading}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              onMouseDown={() => setBtnActive(true)}
              onMouseUp={() => setBtnActive(false)}
            >
              {loading ? "Creating Account..." : "🚀 Create Account"}
            </button>

            {err && (
              <div style={errorStyle}>
                ⚠️ {err}
              </div>
            )}

            <div style={footerStyle}>
              <Link
                to="/"
                style={backLinkStyle}
                className="back-link-hover"
                onMouseEnter={(e) => e.target.classList.add('back-link-hover')}
                onMouseLeave={(e) => e.target.classList.remove('back-link-hover')}
              >
                ← Back
              </Link>
              <Link
                to="/login"
                style={linkStyle}
                className="link-hover"
                onMouseEnter={(e) => e.target.classList.add('link-hover')}
                onMouseLeave={(e) => e.target.classList.remove('link-hover')}
              >
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Form Submission Modal */}
      {showFormModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          backdropFilter: "blur(10px)"
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(54, 75, 42, 0.95) 0%, rgba(43, 61, 32, 0.9) 100%)",
            borderRadius: 20,
            padding: 32,
            maxWidth: 500,
            width: "90%",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            border: "2px solid rgba(138, 155, 90, 0.2)",
            textAlign: "center"
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8a9b5a, #6a8440)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 36
            }}>
              📋
            </div>
            
            <h3 style={{
              color: "#fff7d9",
              fontSize: 24,
              fontWeight: 800,
              margin: "0 0 16px 0",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)"
            }}>
              Complete the Survey
            </h3>
            
            <p style={{
              color: "#cfe9a8",
              fontSize: 16,
              lineHeight: 1.5,
              margin: "0 0 24px 0"
            }}>
              The survey form has opened in a new window. Please submit it and then click the button below to enter the game.
            </p>

            <button
              onClick={handleFormConfirmation}
              style={{
                background: "linear-gradient(135deg, #ff6b35, #f7931e)",
                color: "#ffffff",
                border: "2px solid #ff4500",
                borderRadius: 12,
                padding: "16px 32px",
                fontWeight: 800,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(255, 107, 53, 0.4)",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 32px rgba(255, 107, 53, 0.6)";
                e.target.style.background = "linear-gradient(135deg, #ff8535, #ff9f1e)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 24px rgba(255, 107, 53, 0.4)";
                e.target.style.background = "linear-gradient(135deg, #ff6b35, #f7931e)";
              }}
            >
              ✅ I've Submitted the Survey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
