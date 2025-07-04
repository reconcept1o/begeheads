import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

// Swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
// Bu özel çözüm için FreeMode, Scrollbar ve Navigation modüllerini kullanıyoruz.
import { FreeMode, Scrollbar, Navigation } from "swiper/modules";

// Gerekli CSS dosyaları
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import "swiper/css/navigation";

// Resimler
import image1 from "../assets/bts/11.webp";
import image2 from "../assets/bts/22.webp";
import image3 from "../assets/bts/33.webp";

// VERİLER (Her birine benzersiz bir 'id' ekledik)
const btsData = [
  {
    id: 1,
    image: image1,
    text: "We brought creators to China and put them in the cage, turning them into the story that pulls every eye to BRAVE.",
    link: "https://www.instagram.com/p/Czet215y5a3/",
  },
  {
    id: 2,
    image: image2,
    text: "Producing on-water video content is proof that our limits don’t exist. Check out this shoot for the UAE’s best-known yacht agency.",
    link: "https://www.instagram.com/p/Czdo_aISLej/",
  },
  {
    id: 3,
    image: image3,
    text: "Bringing a top USA influencer to film with Dubai’s biggest luxury car rental. Wild, right? Check the result.",
    link: "https://www.instagram.com/p/Czc6eQnSdaE/",
  },
];

// --- ÖZEL SANAL DÖNGÜ MANTIĞI ---
// Başa ve sona, geçişlerin kesintisiz görünmesi için fazladan slaytlar ekliyoruz.
const bufferSize = btsData.length;
const startBuffer = btsData.slice(-bufferSize); // Orijinal listenin sonunu al
const endBuffer = btsData.slice(0, bufferSize); // Orijinal listenin başını al
const virtualData = [...startBuffer, ...btsData, ...endBuffer]; // Sanal listeyi oluştur: [son, ORİJİNAL, baş]
// --- BİTTİ ---

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
  image: {
    display: "block",
    width: "100%",
    aspectRatio: "4 / 5",
    objectFit: "cover",
  },
  // DEĞİŞİKLİK: Metin alanı için beyaz arka planlı tasarım
  slideContent: {
    backgroundColor: "#FFFFFF",
    color: "#000000", // Metin rengi siyah olacak
    borderRadius: "24px",
    padding: "1.5rem",
    marginTop: "1.5rem",
  },
  slideText: {
    fontSize: "1.1rem",
    lineHeight: 1.6,
    marginBottom: "1.5rem",
    color: "#000000", // Rengi explicit olarak siyah yapıyoruz.
  },
  // DEĞİŞİKLİK: Beyaz arka plana uygun buton tasarımı
  slideButton: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: "#000000", // Normalde siyah metin
    padding: "0.75rem 1.5rem",
    borderRadius: "16px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    border: "2px solid #000000", // Siyah çerçeve
  },
};

const animationStyles = `
  @keyframes shine { from { background-position: -200% center; } to { background-position: 200% center; } }
  .animated-shine-text { background: linear-gradient(90deg, #fff 40%, #555 50%, #fff 60%); background-size: 200% auto; color: #000; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 4s linear infinite; }
  
  /* Scrollbar (kaydırma çubuğu) stilleri */
  .swiper-scrollbar {
    background: rgba(255, 255, 255, 0.2) !important;
    bottom: -10px !important;
    height: 4px !important;
  }
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

function BtsSlide({ item }) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyle = {
    ...styles.slideButton,
    // Hover efekti: siyah arka plan, beyaz metin
    color: isHovered ? "#FFFFFF" : "#000000",
    backgroundColor: isHovered ? "#000000" : "transparent",
  };
  return (
    <div>
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
        >
          SEE MORE
        </a>
      </div>
    </div>
  );
}

function Bts() {
  const isTeleporting = useRef(false);

  // Kaydırma bittiğinde, sahte bir alandaysak gerçek alana ışınlama fonksiyonu
  const handleMomentumEnd = (swiper) => {
    if (isTeleporting.current) return;

    const realSlidesCount = btsData.length;
    // Eğer sondaki sahte alana geldiyse
    if (swiper.activeIndex >= realSlidesCount + bufferSize) {
      isTeleporting.current = true;
      swiper.slideTo(swiper.activeIndex - realSlidesCount, 0); // Anında ve sessizce gerçek alana ışınla
    }
    // Eğer baştaki sahte alana geldiyse
    else if (swiper.activeIndex < bufferSize) {
      isTeleporting.current = true;
      swiper.slideTo(swiper.activeIndex + realSlidesCount, 0); // Anında ve sessizce gerçek alana ışınla
    }
  };

  const handleTransitionEnd = () => {
    isTeleporting.current = false;
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
              // İSTEDİĞİN İKİ ÖZELLİĞİ BİRLEŞTİREN AYARLAR
              freeMode={true} // FAREYİ BIRAKTIĞIN YERDE KALMASINI SAĞLAR
              // SANAL DÖNGÜ OLAYLARI
              onSwiper={(swiper) => swiper.slideTo(bufferSize, 0)}
              onMomentumScrollEnd={handleMomentumEnd}
              onTransitionEnd={handleTransitionEnd}
              // Diğer responsive ve kullanışlılık ayarları
              modules={[FreeMode, Scrollbar, Navigation]}
              slidesPerView={"auto"}
              spaceBetween={40}
              scrollbar={{ draggable: true, hide: false }}
              navigation={true}
              grabCursor={true}
            >
              {virtualData.map((item, index) => (
                <SwiperSlide
                  key={`${item.id}-${index}`}
                  style={{ width: "80%", maxWidth: "420px" }}
                >
                  <BtsSlide item={item} />
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
