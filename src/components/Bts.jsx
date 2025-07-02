import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

// Swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Resimler
import image1 from "../assets/bts/11.webp";
import image2 from "../assets/bts/22.webp";
import image3 from "../assets/bts/33.webp";

// VERİLER
const btsData = [
  {
    image: image1,
    text: "We brought creators to China and put them in the cage, turning them into the story that pulls every eye to BRAVE.",
    link: "https://www.instagram.com/p/Czet215y5a3/",
  },
  {
    image: image2,
    text: "Producing on-water video content is proof that our limits don’t exist. Check out this shoot for the UAE’s best-known yacht agency.",
    link: "https://www.instagram.com/p/Czdo_aISLej/",
  },
  {
    image: image3,
    text: "Bringing a top USA influencer to film with Dubai’s biggest luxury car rental. Wild, right? Check the result.",
    link: "https://www.instagram.com/p/Czc6eQnSdaE/",
  },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "YouTube", href: "https://youtube.com" },
  { name: "LinkedIn", href: "https://linkedin.com" },
];

// --- NİHAİ STİL NESNELERİ ---
const styles = {
  mainContainer: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    minHeight: "100vh",
    padding: "2rem 0 5rem 0",
    fontFamily: "'BegeFont', sans-serif",
  },
  headerRow: { alignItems: "center", marginBottom: "3rem" },
  btsTitle: { fontSize: "2rem", fontWeight: "bold", textAlign: "left" },
  image: {
    display: "block",
    width: "100%",
    aspectRatio: "4 / 5",
    objectFit: "cover",
    borderRadius: "24px",
    border: "2px solid #000000",
  },
  // YENİ: KİBAR VE KOMPAKT KART STİLİ
  textCard: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderRadius: "24px",
    padding: "1.5rem", // Daha sıkı bir padding
    marginTop: "1.5rem",
    border: "2px solid #000000",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
    // minHeight kaldırıldı, kartın yüksekliği artık içeriğe göre belirleniyor.
  },
  text: { fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "1.5rem" }, // Alt boşluk ayarlandı
  seeMoreButton: {
    display: "inline-block",
    backgroundColor: "#FFFFFF",
    color: "#000000",
    padding: "0.75rem 1.5rem",
    borderRadius: "16px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    border: "2px solid #000000", // Butonun kendi sınırı
  },
};

const animationStyles = `
  @keyframes shine {
    from { background-position: -200% center; }
    to { background-position: 200% center; }
  }
  .animated-shine-text {
    background: linear-gradient(90deg, #fff 40%, #555 50%, #fff 60%);
    background-size: 200% auto;
    color: #000;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 4s linear infinite;
  }
  /* Swiper stilleri */
  .swiper-pagination-bullet { background-color: #FFFFFF !important; }
  .swiper-button-next, .swiper-button-prev { color: #FFFFFF !important; }
  @media (max-width: 768px) { .swiper-button-next, .swiper-button-prev { display: none; } }
`;

// --- YENİDEN KULLANILABİLİR BİLEŞENLER ---
function SocialButton({ text, href }) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyle = {
    backgroundColor: isHovered ? "#000000" : "#FFFFFF",
    color: isHovered ? "#FFFFFF" : "#000000",
    padding: "0.75rem 1.5rem",
    borderRadius: "20px",
    border: "2px solid #FFFFFF",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </a>
  );
}

function SlideContent({ item }) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyle = {
    ...styles.seeMoreButton,
    color: isHovered ? "#FFFFFF" : "#000000",
    backgroundColor: isHovered ? "#000000" : "#FFFFFF",
  };
  return (
    <div>
      <img src={item.image} alt="" style={styles.image} />
      <div style={styles.textCard}>
        <p style={styles.text}>{item.text}</p>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          SEE MORE
        </a>
      </div>
    </div>
  );
}

// ANA BTS BİLEŞENİ
function Bts() {
  const swiperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current) {
        swiperRef.current.slideToLoop(0, 0);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.mainContainer}>
      <style>{animationStyles}</style>
      <Container fluid="lg">
        <Row style={styles.headerRow}>
          <Col
            xs={12}
            md={4}
            className="d-flex justify-content-center justify-content-md-start mb-3 mb-md-0"
          >
            <h2 style={styles.btsTitle} className="animated-shine-text">
              BTS
            </h2>
          </Col>
          <Col
            xs={12}
            md={4}
            className="d-flex justify-content-center gap-2 gap-md-3 mb-3 mb-md-0"
          >
            {socialLinks.map((link) => (
              <SocialButton key={link.name} text={link.name} href={link.href} />
            ))}
          </Col>
          <Col xs={12} md={4} className="d-none d-md-block"></Col>{" "}
          {/* Sağ boşluk */}
        </Row>

        <Row>
          <Col xs={12}>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 0,
                stretch: 50,
                depth: 150,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[EffectCoverflow, Pagination, Navigation]}
            >
              {btsData.map((item, index) => (
                <SwiperSlide
                  key={index}
                  style={{ width: "80%", maxWidth: "420px" }}
                >
                  <SlideContent item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Bts;
