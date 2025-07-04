import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar, Navigation } from "swiper/modules";

// İkonlar için import (react-icons kütüphanesi gereklidir)
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import "swiper/css/navigation";

// Resimler ve veriler
import image1 from "../assets/bts/11.webp";
import image2 from "../assets/bts/22.webp";
import image3 from "../assets/bts/33.webp";

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
];

const bufferSize = btsData.length;
const startBuffer = btsData.slice(-bufferSize);
const endBuffer = btsData.slice(0, bufferSize);
const virtualData = [...startBuffer, ...btsData, ...endBuffer];

// DEĞİŞTİ: Sosyal medya linkleri ikon bilgisi ile güncellendi
const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: <FaInstagram /> },
  { name: "YouTube", href: "https://youtube.com", icon: <FaYoutube /> },
  { name: "LinkedIn", href: "https://linkedin.com", icon: <FaLinkedin /> },
];

// STİLLER
const styles = {
  mainContainer: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    minHeight: "100vh",
    padding: "2rem 0 5rem 0",
    fontFamily: "'Outfit', sans-serif",
  },
  headerRow: { alignItems: "center", marginBottom: "3rem" },
  btsTitle: { fontSize: "2rem", fontWeight: "bold", textAlign: "left" },
  slideCard: {
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
    transition: "transform 0.3s ease",
    cursor: "grab",
  },
  image: {
    display: "block",
    width: "100%",
    aspectRatio: "4 / 5",
    objectFit: "cover",
  },
  slideContent: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    padding: "1.5rem",
  },
  slideText: {
    fontSize: "1.1rem",
    lineHeight: 1.6,
    marginBottom: "1.5rem",
    color: "#000000",
  },
  slideButton: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: "#000000",
    padding: "0.5rem 0.25rem",
    fontWeight: "bold",
    transition: "color 0.3s ease",
    textDecoration: "underline",
    textUnderlineOffset: "6px",
    border: "none",
    cursor: "pointer",
  },
  // YENİ: Mobil ikon linkleri için stil
  mobileIconLink: {
    color: "#FFFFFF",
    fontSize: "1.8rem", // İkon boyutu
    textDecoration: "none",
    transition: "opacity 0.3s ease",
  },
};

const animationStyles = `
  @keyframes shine { from { background-position: -200% center; } to { background-position: 200% center; } }
  .animated-shine-text { background: linear-gradient(90deg, #fff 40%, #555 50%, #fff 60%); background-size: 200% auto; color: #000; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 4s linear infinite; }
  .swiper-scrollbar { background: rgba(255, 255, 255, 0.2) !important; bottom: -10px !important; height: 4px !important; }
  .swiper-scrollbar-drag { background: #FFFFFF !important; }
  .swiper-button-next, .swiper-button-prev { color: #FFFFFF !important; }
  @media (max-width: 768px) { .swiper-button-next, .swiper-button-prev { display: none; } }
  .card-active { cursor: grabbing !important; }
  .mobile-icon-link:hover { opacity: 0.7; }
`;

// DEĞİŞTİ: Sosyal medya butonlarının stili güncellendi
function SocialButton({ text, href, style }) {
  const [isHovered, setIsHovered] = useState(false);

  const finalStyle = {
    ...style,
    backgroundColor: isHovered ? "#FFFFFF" : "#000000",
    color: isHovered ? "#000000" : "#FFFFFF",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={finalStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </a>
  );
}

function BtsSlide({ item, onPress, isActive }) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyle = {
    ...styles.slideButton,
    color: isHovered ? "#555555" : "#000000",
  };

  return (
    <div
      style={styles.slideCard}
      className={isActive ? "card-active" : ""}
      onMouseDown={onPress}
      onTouchStart={onPress}
    >
      <img src={item.image} alt="Behind the scenes" style={styles.image} />
      <div style={styles.slideContent}>
        <p style={styles.slideText}>{item.text}</p>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          SEE MORE
        </a>
      </div>
    </div>
  );
}

function Bts() {
  const isTeleporting = useRef(false);
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef(null);

  const handlePressStart = (event) => {
    if (event.type === "mousedown" && event.button !== 0) return;
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => setIsPressed(true), 150);
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimer.current);
    setIsPressed(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handlePressEnd);
    return () => document.removeEventListener("mouseup", handlePressEnd);
  }, []);

  const handleTransitionEnd = (swiper) => {
    if (isTeleporting.current) {
      isTeleporting.current = false;
      return;
    }
    const realSlidesCount = btsData.length;
    if (swiper.activeIndex >= realSlidesCount + bufferSize) {
      isTeleporting.current = true;
      swiper.slideTo(swiper.activeIndex - realSlidesCount, 0);
    } else if (swiper.activeIndex < bufferSize) {
      isTeleporting.current = true;
      swiper.slideTo(swiper.activeIndex + realSlidesCount, 0);
    }
  };

  // DEĞİŞTİ: Masaüstü sosyal medya butonlarının temel stili güncellendi
  const socialButtonStyle = {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "20px",
    border: "2px solid #FFFFFF",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };

  return (
    <div style={styles.mainContainer}>
      <style>{animationStyles}</style>
      <Container fluid="lg">
        {/* DEĞİŞTİ: Başlık satırının yapısı (Col düzeni) güncellendi */}
        <Row style={styles.headerRow}>
          <Col xs={6} md={6}>
            <h2 style={styles.btsTitle} className="animated-shine-text">
              BTS
            </h2>
          </Col>
          {/* Sadece masaüstünde görünen butonlar */}
          <Col
            xs={6}
            md={6}
            className="d-none d-md-flex align-items-center justify-content-end gap-3"
          >
            {socialLinks.map((link) => (
              <SocialButton
                key={link.name}
                text={link.name}
                href={link.href}
                style={socialButtonStyle}
              />
            ))}
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Swiper
              freeMode={true}
              onSwiper={(swiper) => swiper.slideTo(bufferSize, 0)}
              onTransitionEnd={handleTransitionEnd}
              modules={[FreeMode, Scrollbar, Navigation]}
              slidesPerView={"auto"}
              spaceBetween={40}
              scrollbar={{ draggable: true, hide: false }}
              navigation={true}
              onSliderMove={handlePressEnd}
              onTouchEnd={handlePressEnd}
            >
              {virtualData.map((item, index) => {
                const slideStyle = {
                  width: "80%",
                  maxWidth: "420px",
                  transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  transform: isPressed ? "scale(0.95)" : "scale(1)",
                };
                return (
                  <SwiperSlide key={`${item.id}-${index}`} style={slideStyle}>
                    <BtsSlide
                      item={item}
                      onPress={(e) => handlePressStart(e)}
                      isActive={isPressed}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Col>
        </Row>

        {/* YENİ: Sadece mobilde görünen ikonlar */}
        <Row className="d-block d-md-none mt-4">
          <Col xs={12} className="d-flex justify-content-start gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.mobileIconLink}
                className="mobile-icon-link"
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
