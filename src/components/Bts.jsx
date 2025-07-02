import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

// Swiper.js kütüphanesinden gerekli bileşenleri ve stilleri import ediyoruz
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

// Swiper'ın temel CSS dosyaları
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Resim asset'leri
import image1 from "../assets/bts/11.webp";
import image2 from "../assets/bts/22.webp";
import image3 from "../assets/bts/33.webp";

// Veri yapısı (Değişiklik yok)
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

// --- GÜNCELLENMİŞ STİL NESNELERİ ---
const styles = {
  sectionWrapper: {
    padding: "5rem 0",
    overflow: "hidden", // Kenarlardan taşan Swiper okları için
  },
  title: {
    fontFamily: "'BegeFont', sans-serif",
    fontSize: "4rem",
    marginBottom: "4rem",
    textAlign: "center",
  },
  // Resim: TUTARLILIK İÇİN EN ÖNEMLİ DEĞİŞİKLİK BURADA
  image: {
    display: "block",
    width: "100%",
    aspectRatio: "4 / 5", // Tüm resimleri dikey bir 4:5 oranına zorlar
    objectFit: "cover", // Resmin oranını bozmadan alanı doldurur
    borderRadius: "24px",
    border: "2px solid #000000",
  },
  // Metin kartı: Orijinal estetiği koruyoruz
  textCard: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderRadius: "24px",
    padding: "2rem",
    marginTop: "-50px", // Üst üste binme efekti
    position: "relative",
    zIndex: 2,
    textAlign: "left",
    border: "2px solid #000000",
  },
  text: {
    fontSize: "1.1rem",
    lineHeight: 1.6,
    marginBottom: "2rem",
  },
  seeMoreLink: {
    display: "inline-block",
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#000000",
    textDecoration: "underline",
    textUnderlineOffset: "6px",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
  },
};

// Swiper Navigasyon ve Pagination için özel stiller
const swiperCustomStyles = `
  .swiper-container {
    padding: 2rem 0; /* Slaytların gölgeleri için boşluk */
  }
  .swiper-pagination-bullet {
    background-color: #000000 !important;
    width: 10px;
    height: 10px;
  }
  .swiper-button-next, .swiper-button-prev {
    color: #000000 !important;
  }
  /* Mobil cihazlarda okları gizle */
  @media (max-width: 768px) {
    .swiper-button-next, .swiper-button-prev {
      display: none;
    }
  }
`;

// Slayt içeriği bileşeni (Değişiklik yok)
function SlideContent({ item }) {
  const [isHovered, setIsHovered] = useState(false);
  const linkStyleWithHover = {
    ...styles.seeMoreLink,
    opacity: isHovered ? 0.7 : 1,
  };
  return (
    <div>
      <img src={item.image} alt="Behind the scenes" style={styles.image} />
      <div style={styles.textCard}>
        <p style={styles.text}>{item.text}</p>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyleWithHover}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          SEE MORE
        </a>
      </div>
    </div>
  );
}

// Ana Bts Bileşeni (Nihai Tasarım)
function Bts() {
  return (
    <div style={styles.sectionWrapper}>
      <style>{swiperCustomStyles}</style>
      <Container fluid>
        <Row>
          <Col>
            <h2 style={styles.title}>Behind The Scenes</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Swiper
              // GÜNCELLENMİŞ SWIPER AYARLARI
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              // Ekran boyutuna göre görünen slayt sayısını ayarlıyoruz
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 0, // Slaytlar artık dönmeyecek, düz duracak
                stretch: 80, // Slaytlar arasına boşluk koyar
                depth: 200, // Slaytlara derinlik hissi verir
                modifier: 1, // Efektin gücü
                slideShadows: false, // Karmaşıklığı azaltmak için gölgeleri kapattık
              }}
              pagination={{ clickable: true }}
              navigation={true} // Masaüstü için okları aktif ettik
              modules={[EffectCoverflow, Pagination, Navigation]}
              className="swiper-container"
            >
              {btsData.map((item, index) => (
                <SwiperSlide
                  key={index}
                  style={{ width: "85%", maxWidth: "450px" }}
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
