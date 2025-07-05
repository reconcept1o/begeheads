import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

// Resimlerinizi import edin (yolların doğru olduğundan emin olun)
import image1 from "../assets/bts/11.webp";
import image2 from "../assets/bts/22.webp";
import image3 from "../assets/bts/33.webp";

// --- VERİLER ---
const btsData = [
  {
    id: 1,
    image: image1,
    text: "We brought creators to China...",
    link: "https://example.com/china",
  },
  {
    id: 2,
    image: image2,
    text: "Producing on-water video content...",
    link: "https://example.com/video",
  },
  {
    id: 3,
    image: image3,
    text: "Bringing a top USA influencer...",
    link: "https://example.com/influencer",
  },
  {
    id: 4,
    image: image1,
    text: "Another project in China...",
    link: "https://example.com/china-2",
  },
  {
    id: 5,
    image: image2,
    text: "On-water content sequel...",
    link: "https://example.com/video-2",
  },
  {
    id: 6,
    image: image3,
    text: "USA influencer collaboration...",
    link: "https://example.com/influencer-2",
  },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: <FaInstagram /> },
  { name: "YouTube", href: "https://youtube.com", icon: <FaYoutube /> },
  { name: "LinkedIn", href: "https://linkedin.com", icon: <FaLinkedin /> },
];

// --- STİLLER ---
const newCarouselStyles = `
  .marquee-container {
    overflow: hidden;
    position: relative;
    width: 100%;
    padding: 1rem 0;
    cursor: grab;
  }
  .marquee-container:active {
    cursor: grabbing;
  }
  .marquee-track {
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
    border: 3px solid #FFFFFF;
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
  // ... (Bu komponentte değişiklik yok)
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
  // YENİ: Cihazın dokunmatik olup olmadığını kontrol etmek için ref
  const isTouchDevice = useRef(false);

  const BASE_SPEED = 0.5;
  const FRICTION = 0.95;

  // YENİ: Hem fare hem de dokunma olaylarından X koordinatını alan yardımcı fonksiyon
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
      velocity.current = deltaX * 2; // Sürükleme hızını artırmak için çarpan
      positionX.current += deltaX;
      dragStartX.current = clientX;
    },
    [isPressed]
  );

  const animationLoop = useCallback(() => {
    if (!trackRef.current) return;

    // GÜNCELLEME: Otomatik kaymayı sadece dokunmatik olmayan cihazlarda ve etkileşim yokken çalıştır
    if (!isPressed && !isHovered && !isTouchDevice.current) {
      velocity.current *= FRICTION;
      velocity.current -= BASE_SPEED;
    } else {
      velocity.current *= FRICTION;
    }

    positionX.current += velocity.current;

    // Sonsuz döngü logiği
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

  // GÜNCELLEME: Component ilk yüklendiğinde dokunmatik cihaz kontrolü yap
  useEffect(() => {
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

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

  // GÜNCELLEME: Olay dinleyicilerini hem fare hem de dokunma için yönet
  useEffect(() => {
    const handleMove = (e) => handleDragMove(e);
    const handleEnd = () => handleDragEnd();

    if (isPressed) {
      // Fare olayları
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      // Dokunma olayları
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
    // ... (stil objelerinde değişiklik yok)
  };

  return (
    <div style={mainStyles.mainContainer}>
      <style>{newCarouselStyles}</style>
      <Container fluid="lg">
        {/* ... (Header JSX'te değişiklik yok) */}
        <div
          className="marquee-container"
          onMouseDown={handleDragStart} // Fare ile tıklama
          onTouchStart={handleDragStart} // Dokunma başlangıcı
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={trackRef}
            className="marquee-track"
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
        {/* ... (Footer JSX'te değişiklik yok) */}
      </Container>
    </div>
  );
}

// CarouselCard komponenti ve diğer kısımlar aynı kalacak şekilde buraya eklenmelidir.
// Yukarıdaki kodda sadece Bts ana komponenti gösterilmiştir.
// CarouselCard'ı ve diğer importları kendi dosyanızdaki gibi koruyun.

export default Bts;
