import React, { useRef, useEffect, useState, useCallback } from "react";
import BegeadsScene from "../Animation/BegeadsScene";

// Asset'leri import ediyoruz
import backgroundUrl from "../assets/Background.png";
import logoUrl from "../assets/logo.svg";
import gltfUrl from "../assets/letter_b_03.glb";
import envPx from "../assets/texture3/px.png";
import envNx from "../assets/texture3/nx.png";
import envPy from "../assets/texture3/py.png";
import envNy from "../assets/texture3/ny.png";
import envPz from "../assets/texture3/pz.png";
import envNz from "../assets/texture3/nz.png";

// Metin animasyonu için sabitler
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ*#?%&@";
const TARGET_TEXT = "©BEGEADS CREATIVE SPACE";

function Home() {
  const mountRef = useRef(null);
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);
  const [headerText, setHeaderText] = useState(TARGET_TEXT);
  const animationIntervalRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const handleLoadComplete = () =>
      setTimeout(() => setIsSceneLoaded(true), 3000);

    const assetPaths = {
      gltf: gltfUrl,
      envMap: [envPx, envNx, envPy, envNy, envPz, envNz],
    };

    const sceneInstance = new BegeadsScene(
      mountRef.current,
      assetPaths,
      handleLoadComplete
    );

    return () => {
      if (sceneInstance?.dispose) sceneInstance.dispose();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const runScrambleAnimation = useCallback(() => {
    let iteration = 0;
    clearInterval(animationIntervalRef.current);
    animationIntervalRef.current = setInterval(() => {
      const newText = TARGET_TEXT.split("")
        .map((letter, index) => {
          if (index < iteration) return TARGET_TEXT[index];
          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
        })
        .join("");
      setHeaderText(newText);
      if (iteration >= TARGET_TEXT.length)
        clearInterval(animationIntervalRef.current);
      iteration += 1 / 3;
    }, 30);
  }, []);

  useEffect(() => {
    if (isSceneLoaded) {
      setTimeout(runScrambleAnimation, 700);
    }
  }, [isSceneLoaded, runScrambleAnimation]);

  useEffect(() => {
    return () => clearInterval(animationIntervalRef.current);
  }, []);

  const handleWhatsAppClick = () => {
    /* ...değişiklik yok... */
  };
  const handleMailClick = () => {
    /* ...değişiklik yok... */
  };

  // --- STYLES ---
  const rootStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
    backgroundColor: "#141414",
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
    fontFamily: "'Outfit', sans-serif",
  };
  const contentContainerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  };
  const logoStyle = {
    width: "100%",
    height: "auto",
    maxHeight: isMobile ? "35vh" : "45vh",
    objectFit: "contain",
    filter: "brightness(0) invert(1)",
    opacity: isSceneLoaded ? 0.5 : 0,
    transition: "opacity 1s ease-in",
  };
  const subtitleStyle = {
    color: "white",
    textAlign: "center",
    fontFamily: "'Outfit', sans-serif",
    fontSize: isMobile ? "1rem" : "1.2rem",
    fontWeight: 300,
    lineHeight: 1.6,
    marginTop: isMobile ? "20px" : "30px",
    maxWidth: isMobile ? "90vw" : "600px",
    opacity: isSceneLoaded ? 1 : 0,
    transition: "opacity 1s ease-in 0.3s",
  };
  const canvasContainerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
  };
  const headerContainerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 4,
    padding: isMobile ? "15px" : "20px",
    boxSizing: "border-box",
    color: "white",
    pointerEvents: "none",
  };
  const headerStyle = {
    pointerEvents: "auto",
    width: "100%",
    textAlign: "center",
    opacity: isSceneLoaded ? 1 : 0,
    transition: "opacity 0.5s ease-in 0.5s",
  };
  const navStyle = {
    pointerEvents: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
    gap: isMobile ? "15px" : "20px",
    marginTop: isMobile ? "40px" : "50px",
    opacity: isSceneLoaded ? 1 : 0,
    transform: isSceneLoaded ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 1s ease-out 1.2s, transform 1s ease-out 1.2s",
  };
  const headerTextStyle = {
    fontSize: isMobile ? "0.8rem" : "1rem",
    color: "white",
    marginBottom: "8px",
    letterSpacing: "1px",
    cursor: "pointer",
    fontVariantNumeric: "tabular-nums",
  };
  const headerLineStyle = {
    width: "100%",
    height: "1px",
    backgroundColor: "white",
    margin: "auto",
    transformOrigin: "left",
    transform: isSceneLoaded ? "scaleX(1)" : "scaleX(0)",
    transition: "transform 1.5s ease-out 0.8s",
  };
  const buttonBaseStyle = {
    cursor: "pointer",
    padding: "14px 0",
    fontSize: isMobile ? "1.1rem" : "1.7rem",
    borderRadius: "35px",
    transition: "all 0.3s ease",
    fontWeight: 500,
    width: "220px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "'Outfit', sans-serif",
  };
  const buttonDefaultStyle = {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    border: "1px solid #FFFFFF",
  };
  const buttonHoverStyle = {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    border: "2px solid #FFFFFF",
  };

  return (
    <div style={rootStyle}>
      <div style={contentContainerStyle}>
        <img src={logoUrl} alt="Logo" style={logoStyle} />
        <p style={subtitleStyle}>
          You know what you're building. You’ve got the vision and you just need
          the right hands to move it.
        </p>
        <nav style={navStyle}>
          <button
            style={{
              ...buttonBaseStyle,
              ...(isWhatsAppHovered ? buttonHoverStyle : buttonDefaultStyle),
            }}
            onClick={handleWhatsAppClick}
            onMouseEnter={() => setIsWhatsAppHovered(true)}
            onMouseLeave={() => setIsWhatsAppHovered(false)}
          >
            WhatsApp
          </button>
          <button
            style={{
              ...buttonBaseStyle,
              ...(isMailHovered ? buttonHoverStyle : buttonDefaultStyle),
            }}
            onClick={handleMailClick}
            onMouseEnter={() => setIsMailHovered(true)}
            onMouseLeave={() => setIsMailHovered(false)}
          >
            Mail
          </button>
        </nav>
      </div>

      <div ref={mountRef} style={canvasContainerStyle}></div>

      <div style={headerContainerStyle}>
        <header style={headerStyle}>
          <div style={headerTextStyle} onMouseEnter={runScrambleAnimation}>
            {headerText}
          </div>
          <div style={headerLineStyle} />
        </header>
      </div>
    </div>
  );
}

export default Home;
