import React, { useRef, useEffect, useState } from "react";
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

function Home() {
  const mountRef = useRef(null);
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);

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
    fontFamily: "'BegeFont', sans-serif",
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

  // KATMAN 1: Logo ve Metin
  const logoContainerStyle = {
    // GÜNCELLENDİ
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    display: "flex",
    flexDirection: "column", // Öğeleri alt alta dizmek için
    justifyContent: "center",
    alignItems: "center",
    opacity: isSceneLoaded ? 1 : 0,
    transition: "opacity 1s ease-in",
    padding: "20px", // Kenarlara yapışmasını engellemek için
    boxSizing: "border-box", // Padding'in genişliği etkilememesi için
  };

  const logoStyle = {
    width: "100%",
    height: "auto",
    maxHeight: isMobile ? "40vh" : "50vh", // Metin için yer açmak adına biraz küçültüldü
    objectFit: "contain",
    filter: "brightness(0) invert(1)",
    opacity: 0.5,
  };

  // YENİ: Logo altı metni için stil
  const subtitleStyle = {
    color: "white",
    textAlign: "center",
    fontFamily: "'BegeFont', sans-serif",
    fontSize: isMobile ? "1rem" : "1.2rem",
    fontWeight: 300, // Daha ince bir font ağırlığı
    lineHeight: 1.6,
    marginTop: isMobile ? "20px" : "30px", // Logo ile arasına boşluk koyar
    maxWidth: isMobile ? "90vw" : "600px", // Metnin okunabilirliğini artırır
    opacity: isSceneLoaded ? 1 : 0,
    // Logo'dan biraz sonra belirmesi için gecikme ekliyoruz
    transition: "opacity 1s ease-in 0.3s",
  };

  // KATMAN 2: Three.js Canvas
  const canvasContainerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
  };

  // KATMAN 3: UI (Header ve Nav)
  const uiContainerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
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
    gap: isMobile ? "10px" : "20px",
    paddingBottom: "20px",
    opacity: isSceneLoaded ? 1 : 0,
    transform: isSceneLoaded ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 1s ease-out 1.2s, transform 1s ease-out 1.2s",
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
  const buttonBaseStyle = {
    cursor: "pointer",
    margin: isMobile ? "0 5px" : "0 15px",
    padding: "14px 0",
    fontSize: isMobile ? "1.1rem" : "1.2rem",
    borderRadius: "35px",
    transition: "all 0.3s ease",
    fontWeight: 500,
    width: isMobile ? "120px" : "220px",
    maxWidth: isMobile ? "150px" : "150px",
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

      {/* KATMAN 1: Logo ve Metin */}
      <div style={logoContainerStyle}>
        {" "}
        {/* GÜNCELLENDİ */}
        <img src={logoUrl} alt="Logo" style={logoStyle} />
        {/* YENİ: Logo altı metni eklendi */}
        <p style={subtitleStyle}>
          You know what you're building. You’ve got the vision and you just need
          the right hands to move it.
        </p>
      </div>

      {/* KATMAN 2: Three.js Canvas */}
      <div ref={mountRef} style={canvasContainerStyle}></div>

      {/* KATMAN 3: UI (Header ve Nav) */}
      <div style={uiContainerStyle}>
        <header style={headerStyle}>
          <div style={headerTextStyle}>©BEGEADS CREATIVE SPACE</div>
          <div style={headerLineStyle} />
        </header>
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
