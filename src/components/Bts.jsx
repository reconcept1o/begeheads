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

// Her bir slayt için verileri merkezi bir yerde tutmak daha temizdir
const btsData = [
  {
    image: image1,
    text: "We brought creators to China and put them in the cage, turning them into the story that pulls every eye to BRAVE.",
    link: "https://www.instagram.com/p/Czet215y5a3/", // Hedef linki buraya girin
  },
  {
    image: image2,
    text: "Producing on-water video content is proof that our limits don’t exist. Check out this shoot for the UAE’s best-known yacht agency.",
    link: "https://www.instagram.com/p/Czdo_aISLej/", // Hedef linki buraya girin
  },
  {
    image: image3,
    text: "Bringing a top USA influencer to film with Dubai’s biggest luxury car rental. Wild, right? Check the result.",
    link: "https://www.instagram.com/p/Czc6eQnSdaE/", // Hedef linki buraya girin
  },
];

// --- STİL NESNELERİ ---
const styles = {
  // Her bir slaytın içindeki kart stili
  slideCard: {
    width: "100%",
    fontFamily: "'BegeFont', sans-serif", // Kendi fontunuzu kullanın
  },
  // Resim stili
  image: {
    display: "block",
    width: "100%",
    height: "auto",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    border: "2px solid #000000",
  },
  // Resmin altındaki beyaz metin kartı
  textCard: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderRadius: "24px",
    padding: "2rem",
    marginTop: "-40px", // Kartın resmin üzerine hafifçe binmesini sağlar
    position: "relative",
    zIndex: 2,
    textAlign: "left",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    border: "2px solid #000000",
  },
  // Metnin kendisi
  text: {
    fontSize: "1.2rem",
    lineHeight: 1.6,
    marginBottom: "2rem",
  },
  // "SEE MORE" linki
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

// Swiper'ın sayfalama noktacıklarını (pagination bullets) siyah yapmak için stil
const swiperCustomStyles = `
  .swiper-pagination-bullet {
    background-color: #000000 !important;
    width: 12px;
    height: 12px;
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    opacity: 1;
  }
`;

// Her bir slaytın içeriğini oluşturan küçük bileşen
function SlideContent({ item }) {
  const [isHovered, setIsHovered] = useState(false);

  const linkStyleWithHover = {
    ...styles.seeMoreLink,
    opacity: isHovered ? 0.7 : 1,
  };

  return (
    <div style={styles.slideCard}>
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

// Ana Bts Bileşeni
function Bts() {
  return (
    <>
      {/* Harici CSS olmadan Swiper stillerini özelleştirmek için */}
      <style>{swiperCustomStyles}</style>

      <Container fluid="lg" className="py-5 text-center">
        <Row className="justify-content-center">
          <Col xs={12}>
            {/* Bu bölüme bir başlık ekleyebilirsiniz */}
            {/* <h2 style={{ fontFamily: "'BegeFont', sans-serif", fontSize: '4rem', marginBottom: '4rem' }}>Behind The Scenes</h2> */}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Swiper
              effect={"coverflow"}
              grabCursor={true} // Fareyle sürüklenebilirliği belirtmek için imleci değiştirir
              centeredSlides={true}
              loop={true} // Sonsuz döngü
              slidesPerView={"auto"} // Ekran boyutuna göre slayt sayısını ayarlar
              coverflowEffect={{
                rotate: 30, // Kenardaki slaytların dönüş açısı
                stretch: 0, // Slaytlar arası esneme
                depth: 100, // 3D derinlik efekti
                modifier: 1, // Efektin çarpanı
                slideShadows: false, // Slayt gölgeleri
              }}
              pagination={{
                clickable: true, // Noktalara tıklanabilir
              }}
              modules={[EffectCoverflow, Pagination, Navigation]}
              className="mySwiper"
              style={{ paddingBottom: "3rem" }} // Pagination için altta boşluk
            >
              {btsData.map((item, index) => (
                <SwiperSlide
                  key={index}
                  style={{ width: "80%", maxWidth: "500px" }}
                >
                  <SlideContent item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Bts;
