import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar, Navigation } from "swiper/modules";

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

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "YouTube", href: "https://youtube.com" },
  { name: "LinkedIn", href: "https://linkedin.com" },
];

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
    cursor: "pointer",
  }, // İmleci pointer yaptık
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
    padding: "0.75rem 1.5rem",
    borderRadius: "16px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    border: "2px solid #000000",
  },
};

const animationStyles = `
  @keyframes shine { from { background-position: -200% center; } to { background-position: 200% center; } }
  .animated-shine-text { background: linear-gradient(90deg, #fff 40%, #555 50%, #fff 60%); background-size: 200% auto; color: #000; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 4s linear infinite; }
  .swiper-scrollbar { background: rgba(255, 255, 255, 0.2) !important; bottom: -10px !important; height: 4px !important; }
  .swiper-scrollbar-drag { background: #FFFFFF !important; }
  .swiper-button-next, .swiper-button-prev { color: #FFFFFF !important; }
  @media (max-width: 768px) { .swiper-button-next, .swiper-button-prev { display: none; } }
`;

function SocialButton({ text, href, style }) {
  const [isHovered, setIsHovered] = useState(false);
  const finalStyle = {
    ...style,
    backgroundColor: isHovered ? "#000000" : "#FFFFFF",
    color: isHovered ? "#FFFFFF" : "#000000",
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

// DEĞİŞTİ: Component artık 'onClick' prop'unu alıyor
function BtsSlide({ item, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyle = {
    ...styles.slideButton,
    color: isHovered ? "#FFFFFF" : "#000000",
    backgroundColor: isHovered ? "#000000" : "transparent",
  };

  return (
    // DEĞİŞTİ: Ana div'e onClick olayı bağlandı
    <div style={styles.slideCard} onClick={onClick}>
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
          // NİHAİ ÇÖZÜM: Linke tıklanıldığında, olayın karta yayılmasını engelliyoruz.
          // Bu, kartın onClick'ini tetiklemesini önler ve linkin normal çalışmasını sağlar.
          onClick={(e) => e.stopPropagation()}
        >
          SEE MORE
        </a>
      </div>
    </div>
  );
}

function Bts() {
  const isTeleporting = useRef(false);
  // YENİ: Animasyon durumunu tutan basit bir boolean state
  const [isScaledDown, setIsScaledDown] = useState(false);
  const swiperRef = useRef(null);

  // YENİ: Animasyonu açıp kapatan basit bir fonksiyon
  const toggleScale = () => {
    setIsScaledDown((prevState) => !prevState);
  };

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

  const [breakpoint, setBreakpoint] = useState("desktop");
  useEffect(() => {
    const handleResize = () =>
      setBreakpoint(window.innerWidth < 768 ? "mobile" : "desktop");
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const socialButtonStyle = {
    padding: breakpoint === "mobile" ? "0.5rem 1rem" : "0.75rem 1.5rem",
    fontSize: breakpoint === "mobile" ? "0.8rem" : "1rem",
    borderRadius: "20px",
    border: "2px solid #FFFFFF",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };

  return (
    <div style={styles.mainContainer}>
      <style>{animationStyles}</style>
      <Container fluid="lg">
        {/* Header kısmı aynı */}
        <Row style={styles.headerRow}>
          <Col
            xs={12}
            md={4}
            className="d-flex justify-content-center justify-content-md-start mb-4 mb-md-0"
          >
            <h2 style={styles.btsTitle} className="animated-shine-text">
              BTS
            </h2>
          </Col>
          <Col
            xs={12}
            md={4}
            className="d-flex align-items-center justify-content-center gap-2 gap-md-3"
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
          <Col xs={12} md={4} className="d-none d-md-block"></Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Swiper
              ref={swiperRef}
              freeMode={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                swiper.slideTo(bufferSize, 0);
              }}
              onTransitionEnd={handleTransitionEnd}
              modules={[FreeMode, Scrollbar, Navigation]}
              slidesPerView={"auto"}
              spaceBetween={40}
              scrollbar={{ draggable: true, hide: false }}
              navigation={true}
            >
              {virtualData.map((item, index) => {
                // DEĞİŞTİ: Animasyon artık basit state'e bağlı
                const slideStyle = {
                  width: "80%",
                  maxWidth: "420px",
                  transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  transform: isScaledDown ? "scale(0.95)" : "scale(1)",
                };
                return (
                  <SwiperSlide key={`${item.id}-${index}`} style={slideStyle}>
                    <BtsSlide
                      item={item}
                      // DEĞİŞTİ: Basit toggle fonksiyonunu gönderiyoruz
                      onClick={toggleScale}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Bts;
