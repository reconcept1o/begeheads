import React, { useRef, useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import BegeadsScene from "../Animation/BegeadsScene";

function Home() {
  const mountRef = useRef(null);
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);

  // Three.js sahnesini başlatan ve temizleyen ana useEffect
  useEffect(() => {
    if (!mountRef.current) return;
    const handleLoadComplete = () =>
      setTimeout(() => setIsSceneLoaded(true), 300);
    const sceneInstance = new BegeadsScene(
      mountRef.current,
      handleLoadComplete
    );
    return () => {
      if (sceneInstance?.dispose) sceneInstance.dispose();
    };
  }, []);

  // Mobil cihaz tespiti için useEffect
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize(); // İlk yüklemede çalıştır
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Olay Yöneticileri
  const handleWhatsAppClick = () => {
    const phoneNumber = "+905000000000"; // Numaranızı buraya yazın
    const message = "Merhaba, sizinle iletişime geçmek istiyorum!";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleMailClick = () => {
    const email = "iletisim@begeads.com"; // E-posta adresinizi buraya yazın
    const subject = "İletişim Talebi";
    const body = "Merhaba, sizinle iletişime geçmek istiyorum...";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  // --- INLINE STYLES ---

  const rootStyle = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    background: "#141414",
    overflow: "hidden",
    fontFamily: "'BegeFont', sans-serif",
  };

  // Canvas, HTML içeriğinin arkasında kalacak
  const canvasContainerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
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
    zIndex: 100, // En üstte
    transition: "opacity 0.8s ease-out",
    opacity: isSceneLoaded ? 0 : 1,
    pointerEvents: isSceneLoaded ? "none" : "auto",
  };

  const loadingTextStyle = {
    color: "white",
    fontSize: "1.2rem",
    letterSpacing: "2px",
  };

  // HTML içeriği, canvas'ın üzerinde olacak
  const contentContainerStyle = {
    position: "relative",
    zIndex: 10,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "15px" : "20px",
    boxSizing: "border-box",
    color: "white",
    opacity: isSceneLoaded ? 1 : 0,
    transition: "opacity 1s ease-in",
  };

  const headerStyle = {
    width: "100%",
    textAlign: "center",
    opacity: isSceneLoaded ? 1 : 0,
    transition: "opacity 0.5s ease-in 0.5s",
  };

  const headerTextStyle = {
    fontSize: isMobile ? "0.7rem" : "0.8rem",
    color: "white",
    marginBottom: "5px",
  };

  const headerLineStyle = {
    width: "100%",
    height: "1px",
    backgroundColor: "white",
    margin: "auto",
  };

  const mainContentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    width: isMobile ? "100%" : "97%",
    opacity: isSceneLoaded ? 1 : 0,
    transform: isSceneLoaded ? "scale(1)" : "scale(0.95)",
    transition: "opacity 1s ease-out 0.8s, transform 1s ease-out 0.8s",
  };

  const logoStyle = {
    width: "100%",
    height: "auto",
    maxHeight: isMobile ? "50vh" : "70vh",
    marginBottom: "50px",
    objectFit: "contain",
    filter:
      "brightness(0) saturate(100%) invert(85%) sepia(6%) saturate(10%) hue-rotate(180deg)",
  };

  const paragraphStyle = {
    fontSize: isMobile ? "1.3rem" : "1.5rem",
    color: "#FFFFFF",
    maxWidth: isMobile ? "90%" : "800px",
    margin: "0 auto",
    padding: "0 10px",
    lineHeight: "1.4",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: "0.5rem",
    opacity: isSceneLoaded ? 1 : 0,
    transform: isSceneLoaded ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 1s ease-out 1s, transform 1s ease-out 1s",
  };

  const navStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
    gap: isMobile ? "10px" : "20px",
    paddingBottom: "20px",
    opacity: isSceneLoaded ? 1 : 0,
    transform: isSceneLoaded ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 1s ease-out 1.2s, transform 1s ease-out 1.2s",
  };

  const buttonBaseStyle = {
    cursor: "pointer",
    margin: isMobile ? "0 5px" : "0 15px",
    padding: "14px 0",
    fontSize: isMobile ? "1.1rem" : "1.2rem",
    borderRadius: "35px",
    transition: "all 0.3s ease",
    fontWeight: 500,
    width: isMobile ? "120px" : "220px",
    maxWidth: isMobile ? "150px" : "220px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "'BegeFont', sans-serif",
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

      {/* Canvas, HTML'in arkasında */}
      <div ref={mountRef} style={canvasContainerStyle}></div>

      {/* HTML içeriği, canvas'ın üzerinde */}
      <div style={contentContainerStyle}>
        <header style={headerStyle}>
          <div style={headerTextStyle}>©BEGEADS CREATIVE SPACE</div>
          <div style={headerLineStyle} />
        </header>

        <main style={mainContentStyle}>
          <img src={logo} alt="Logo" style={logoStyle} />
          <p style={paragraphStyle}>
            <span>You know what you're building. You’ve got the vision</span>
            <span>and you just need the right hands to move it.</span>
          </p>
        </main>

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
    </div>
  );
}

export default Home;
