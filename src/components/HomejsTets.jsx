import React, { useRef, useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import * as THREE from "three";

function Home() {
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const logoRef = useRef();
  const HomeRef = useRef();
  const lineCanvasRef = useRef();

  // Event Handlers
  const handleWhatsAppClick = () => {
    const phoneNumber = "+905XXXXXXXXX";
    const message = "Merhaba, sizinle iletişime geçmek istiyorum!";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleMailClick = () => {
    const email = "your.email@example.com";
    const subject = "İletişim Talebi";
    const body = "Merhaba, sizinle iletişime geçmek istiyorum...";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  // Background Logo Animation useEffect
  useEffect(() => {
    if (!HomeRef.current || HomeRef.current.children.length > 1) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    HomeRef.current.appendChild(renderer.domElement);
    const loader = new THREE.TextureLoader();
    loader.load(logo, (texture) => {
      const geometry = new THREE.PlaneGeometry(5, 5);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.z = -5;
      scene.add(plane);
      camera.position.z = 5;
      let time = 0;
      const animate = () => {
        requestAnimationFrame(animate);
        time += 0.005;
        plane.position.z = Math.sin(time) * 0.5 - 2;
        renderer.render(scene, camera);
      };
      animate();
    });
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup fonksiyonunda HomeRef.current'ı bir değişkene kopyala
    const currentHomeRef = HomeRef.current;
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentHomeRef && renderer.domElement) {
        currentHomeRef.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Top Line Animation useEffect
  useEffect(() => {
    if (!lineCanvasRef.current) return;
    const container = lineCanvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      container.clientWidth / -2,
      container.clientWidth / 2,
      container.clientHeight / 2,
      container.clientHeight / -2,
      1,
      1000
    );
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, 0, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    let animationFrameId;
    const targetWidth = container.clientWidth / 2;
    let currentWidth = 0;
    const animateLine = () => {
      animationFrameId = requestAnimationFrame(animateLine);
      currentWidth += (targetWidth - currentWidth) * 0.05;
      const positions = line.geometry.attributes.position.array;
      positions[0] = -currentWidth;
      positions[3] = currentWidth;
      line.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      if (targetWidth - currentWidth < 0.1) {
        currentWidth = targetWidth;
        cancelAnimationFrame(animationFrameId);
      }
    };
    setTimeout(() => {
      animateLine();
    }, 500);
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Mobile/Web Sizing useEffect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (logoRef.current) {
        if (window.innerWidth <= 768) {
          logoRef.current.style.width = "90%";
          logoRef.current.style.maxHeight = "50vh";
        } else {
          logoRef.current.style.width = "97%";
          logoRef.current.style.maxHeight = "70vh";
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    backgroundColor: "#141414",
    color: "#FFFFFF",
    border: "2px solid #FFFFFF",
  };

  const buttonHoverStyle = {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    border: "2px solid #FFFFFF",
  };

  return (
    <div
      ref={HomeRef}
      style={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100vw",
        background: "#141414",
        zIndex: 0,
        overflow: "hidden",
        fontFamily: "'BegeFont', sans-serif",
      }}
    >
      {/* Home Section */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "10px 10px" : "10px 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: isMobile ? "0.7rem" : "0.8rem",
              color: "white",
              marginBottom: "5px",
            }}
          >
            ©BEGEADS CREATIVE SPACE
          </div>
          <div
            ref={lineCanvasRef}
            style={{
              width: "100%",
              height: "2px",
              margin: "auto",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: isMobile ? "100%" : "97%",
          }}
        >
          <img
            ref={logoRef}
            src={logo}
            alt="Logo"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: isMobile ? "50vh" : "70vh",
              marginBottom: "50px",
              objectFit: "contain",
              filter:
                "brightness(0) saturate(100%) invert(85%) sepia(6%) saturate(10%) hue-rotate(180deg)",
              opacity: 0,
              animation: "fadeIn 1s ease-in forwards",
            }}
          />
          <p
            style={{
              fontSize: isMobile ? "1.3rem" : "1.5rem",
              color: "#FFFFFF",
              maxWidth: isMobile ? "90%" : "800px",
              margin: "0 auto",
              padding: "0 10px",
              lineHeight: "1.4",
              fontFamily: "'BegeFont', sans-serif",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              gap: "0.5rem",
            }}
          >
            <span>You know what you're building. You’ve got the vision</span>
            <span>and you just need the right hands to move it.</span>
          </p>
        </div>

        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: "20px",
            flexDirection: "row",
            gap: isMobile ? "10px" : "20px",
            flexWrap: "wrap",
          }}
        >
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

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

export default Home;