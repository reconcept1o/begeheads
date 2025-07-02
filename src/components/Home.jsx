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

// --- YENİ: Metin animasyonu için sabitler ---
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ*#?%&@";
const TARGET_TEXT = "©BEGEADS CREATIVE SPACE";

function Home() {
  const mountRef = useRef(null);
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);

  // --- YENİ: Başlık metnini ve animasyonunu yönetmek için state ve ref ---
  const [headerText, setHeaderText] = useState(TARGET_TEXT);
  const animationIntervalRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const handleLoadComplete = () =>
      setTimeout(() => setIsSceneLoaded(true), 300);

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

  // --- YENİ: Metin karıştırma animasyonunun mantığı ---
  const runScrambleAnimation = useCallback(() => {
    let iteration = 0;
    clearInterval(animationIntervalRef.current); // Önceki animasyonu durdur

    animationIntervalRef.current = setInterval(() => {
      const newText = TARGET_TEXT.split("")
        .map((letter, index) => {
          if (index < iteration) {
            return TARGET_TEXT[index];
          }
          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
        })
        .join("");

      setHeaderText(newText);

      if (iteration >= TARGET_TEXT.length) {
        clearInterval(animationIntervalRef.current);
      }
      iteration += 1 / 3;
    }, 30);
  }, []);

  // --- YENİ: Sahne yüklendiğinde metin animasyonunu tetikle ---
  useEffect(() => {
    if (isSceneLoaded) {
      // Çizgi animasyonuyla uyumlu olması için gecikmeli başlat
      setTimeout(runScrambleAnimation, 700);
    }
  }, [isSceneLoaded, runScrambleAnimation]);

  // --- YENİ: Bileşen kaldırıldığında interval'ı temizle ---
  useEffect(() => {
    return () => clearInterval(animationIntervalRef.current);
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = "+905000000000";
    const message = "Merhaba, sizinle iletişime geçmek istiyorum!";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleMailClick = () => {
    const email = "iletisim@begeads.com";
    const subject = "İletişim Talebi";
    const body = "Merhaba, sizinle iletişime geçmek istiyorum...";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  // --- STYLES ---

  const rootStyle = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#141414",
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
    fontFamily: "'Outfit', sans-serif",
  };

  const loadingOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#141414",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    transition: "opacity 0.8s ease-out",
    opacity: isSceneLoaded ? 0 : 1,
    pointerEvents: isSceneLoaded ? "none" : "auto",
  };

  const loadingTextStyle = {
    color: "white",
    fontSize: "1.2rem",
    letterSpacing: "2px",
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

  // --- GÜNCELLENDİ: Yazı boyutu ve stili ---
  const headerTextStyle = {
    fontSize: isMobile ? "0.8rem" : "1rem", // Yazı boyutu büyütüldü
    color: "white",
    marginBottom: "8px", // Çizgiyle arayı biraz açtık
    letterSpacing: "1px",
    cursor: "pointer", // Fareyle üzerine gelince el işareti çıkar
    fontVariantNumeric: "tabular-nums", // Harflerin zıplamasını engeller
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
    fontSize: isMobile ? "1.1rem" : "1.2rem",
    borderRadius: "35px",
    transition: "all 0.3s ease",
    fontWeight: 500,
    width: "150px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "'Outfit', sans-serif",
  };
  const buttonDefaultStyle = {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    border: "2px solid #FFFFFF",
  };
  const buttonHoverStyle = {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    border: "2px solid #FFFFFF",
  };

  return (
    <div style={rootStyle}>
      <div style={loadingOverlayStyle}>
        <div style={loadingTextStyle}>Coming</div>
      </div>

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
          {/* GÜNCELLENDİ: Metin state'den geliyor ve onMouseEnter eventi eklendi */}
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
