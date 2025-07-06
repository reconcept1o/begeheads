import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";


import image1 from "../assets/bts/11.webp";
import image2 from "../assets/bts/22.webp";
import image3 from "../assets/bts/33.webp";


const btsData = [
  {
    id: 1,
    image: image1,
    text: "We brought creators to China and put them in the cage, turning them into the story that pulls every eye to BRAVE.",
    link: "https://example.com/china",
  },
  {
    id: 2,
    image: image2,
    text: "Producing on-water video content is proof that our limits don’t exist. Check out this shoot for the UAE’s best-known yacht agency.",
    link: "https://example.com/video",
  },
  {
    id: 3,
    image: image3,
    text: "Bringing a top USA influencer to film with Dubai’s biggest luxury car rental. Wild, right? Check the result.",
    link: "https://example.com/influencer",
  },
  {
    id: 4,
    image: image1,
    text: "We brought creators to China and put them in the cage, turning them into the story that pulls every eye to BRAVE.",
    link: "https://example.com/china-2",
  },
  {
    id: 5,
    image: image2,
    text: "Producing on-water video content is proof that our limits don’t exist. Check out this shoot for the UAE’s best-known yacht agency.",
    link: "https://example.com/video-2",
  },
  {
    id: 6,
    image: image3,
    text: "Bringing a top USA influencer to film with Dubai’s biggest luxury car rental. Wild, right? Check the result.",
    link: "https://example.com/influencer-2",
  },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: <FaInstagram /> },
  { name: "YouTube", href: "https://youtube.com", icon: <FaYoutube /> },
  { name: "LinkedIn", href: "https://linkedin.com", icon: <FaLinkedin /> },
];


const newCarouselStyles = `
  /* GÜNCELLEME: Sınıf adı çakışmayı önlemek için değiştirildi */
  .bts-carousel-container {
    overflow: hidden;
    position: relative;
    width: 100%;
    padding: 1rem 0;
    cursor: grab;
  }
  .bts-carousel-container:active {
    cursor: grabbing;
  }
  /* GÜNCELLEME: Sınıf adı çakışmayı önlemek için değiştirildi */
  .bts-carousel-track {
    display: flex;
    gap: 40px;
    transition: gap 0.4s ease;
    will-change: transform;
  }
  .carousel-card-wrapper {
    flex-shrink: 0;
    width: clamp(300px, 80%, 420px);
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    position: relative;
  }
  @keyframes border-flash { 
    0% { border-color: orange; opacity: 1; } 
    100% { border-color: transparent; opacity: 0; } 
  }
  .border-flash-effect { 
    position: absolute; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    border-radius: 16px; 
    border: 3px solid transparent; 
    pointer-events: none; 
    animation: border-flash 0.6s ease-out forwards; 
  }
  .social-icon {
    font-size: 1.8rem;
    color: #FFFFFF;
    text-decoration: none;
    transition: opacity 0.3s ease;
    border: 1px solid #FFFFFF;
    border-radius: 50%;
    padding: 0.75rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .social-button {
    background-color: transparent;
    color: #FFFFFF;
    border: 3px solid #FFFFFF;
    border-radius: 25px;
    padding: 0.6rem 2rem;
    font-size: 1.10rem;
    cursor: pointer;
    text-decoration: none;
    margin-left: 1rem;
    transition: all 0.3s ease;
  }
  .social-button:hover {
    background-color: #FFFFFF;
    color: #000000;
  }
`;

// --- KART KOMPONENTİ ---
function CarouselCard({ item, flashKey }) {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const cardStyles = {
    slideCard: {
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
      backgroundColor: "#FFFFFF",
    },
    image: {
      display: "block",
      width: "100%",
      aspectRatio: "4 / 5",
      objectFit: "cover",
    },
    slideContent: { color: "#000000", padding: "1.5rem" },
    slideText: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
      marginBottom: "1.5rem",
      color: "#000000",
    },
    slideButton: {
      display: "inline-block",
      backgroundColor: "transparent",
      color: isButtonHovered ? "#555555" : "#000000",
      padding: "0.5rem 0.25rem",
      fontWeight: "bold",
      transition: "color 0.3s ease",
      textDecoration: "underline",
      textUnderlineOffset: "6px",
      border: "none",
      cursor: "pointer",
    },
  };
  return (
    <div style={cardStyles.slideCard}>
      {flashKey > 0 && (
        <div className="border-flash-effect" key={flashKey}></div>
      )}
      <img
        src={item.image}
        alt="Behind the scenes"
        style={cardStyles.image}
        draggable="false"
      />
      <div style={cardStyles.slideContent}>
        <p style={cardStyles.slideText}>{item.text}</p>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={cardStyles.slideButton}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          SEE MORE
        </a>
      </div>
    </div>
  );
}

// --- ANA KOMPONENT ---
function Bts() {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [flashKey, setFlashKey] = useState(0);

  const trackRef = useRef(null);
  const positionX = useRef(0);
  const velocity = useRef(0);
  const dragStartX = useRef(0);
  const animationFrameId = useRef(null);
  const trackWidth = useRef(0);

  const BASE_SPEED = 0.1;
  const FRICTION = 0.95;

  const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const handleDragStart = (e) => {
    setIsPressed(true);
    dragStartX.current = getClientX(e);
    velocity.current = 0;
    cancelAnimationFrame(animationFrameId.current);
  };

  const handleDragMove = useCallback(
    (e) => {
      if (!isPressed) return;
      const clientX = getClientX(e);
      const deltaX = clientX - dragStartX.current;
      positionX.current += deltaX;
      dragStartX.current = clientX;
    },
    [isPressed]
  );

  const animationLoop = useCallback(() => {
    if (!trackRef.current) return;

    if (!isPressed && !isHovered) {
      velocity.current *= FRICTION;
      velocity.current -= BASE_SPEED;
    } else {
      velocity.current *= FRICTION;
    }

    positionX.current += velocity.current;

    if (trackWidth.current > 0) {
      const halfWidth = trackWidth.current / 2;
      if (positionX.current <= -halfWidth) {
        positionX.current += halfWidth;
      } else if (positionX.current >= 0) {
        positionX.current -= halfWidth;
      }
    }

    trackRef.current.style.transform = `translateX(${positionX.current}px)`;
    animationFrameId.current = requestAnimationFrame(animationLoop);
  }, [isPressed, isHovered]);

  const startAnimationLoop = useCallback(() => {
    cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = requestAnimationFrame(animationLoop);
  }, [animationLoop]);

  const handleDragEnd = useCallback(() => {
    setIsPressed(false);
    setFlashKey((prev) => prev + 1);
    startAnimationLoop();
  }, [startAnimationLoop]);

  useEffect(() => {
    const calculateWidth = () => {
      if (trackRef.current?.scrollWidth) {
        trackWidth.current = trackRef.current.scrollWidth;
      }
    };
    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    startAnimationLoop();
    return () => {
      window.removeEventListener("resize", calculateWidth);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [startAnimationLoop]);

  useEffect(() => {
    const handleMove = (e) => handleDragMove(e);
    const handleEnd = () => handleDragEnd();

    if (isPressed) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isPressed, handleDragMove, handleDragEnd]);

  const mainStyles = {
    mainContainer: {
      backgroundColor: "#000000",
      color: "#FFFFFF",
      minHeight: "100vh",
      padding: "2rem 0 5rem 0",
      
    },
    headerRow: { alignItems: "center", marginBottom: "1rem" },
    btsTitle: { fontSize: "2rem", fontWeight: "bold", textAlign: "left" },
  };

  return (
    <div style={mainStyles.mainContainer}>
      <style>{newCarouselStyles}</style>
      <Container fluid="lg">
        <Row style={mainStyles.headerRow}>
          <Col xs={6} md={6}>
            <h2 style={mainStyles.btsTitle}>BTS</h2>
          </Col>
          <Col xs={6} md={6} className="d-none d-md-flex justify-content-end">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-button"
              >
                {link.name}
              </a>
            ))}
          </Col>
        </Row>

        <div
          className="bts-carousel-container"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
      
          <div
            ref={trackRef}
            className="bts-carousel-track"
            style={{ gap: isPressed ? "60px" : "40px" }}
          >
            {[...btsData, ...btsData].map((item, index) => (
              <div
                className="carousel-card-wrapper"
                key={`${item.id}-${index}`}
                style={{ transform: isPressed ? "scale(0.95)" : "scale(1)" }}
              >
                <CarouselCard item={item} flashKey={flashKey} />
              </div>
            ))}
          </div>
        </div>
        <Row className="d-block d-md-none mt-4">
          <Col xs={12} className="d-flex justify-content-end gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                {link.icon}
              </a>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Bts;
