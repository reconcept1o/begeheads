import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

// Video asset'leri
import video1 from "../assets/video/1.mp4";
import video2 from "../assets/video/2.mp4";
import video3 from "../assets/video/3.mp4";

// Hata yakalama bileşeni (Değişiklik yok)
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary yakaladı:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return <h1>Bir hata oluştu.</h1>;
    return this.props.children;
  }
}

// --- VideoCard Bileşeni için Yeni Stil Nesneleri ---
const cardStyles = {
  // Kartın kendisi: Kenarlık, yuvarlak köşeler ve içeriğin taşmasını engelleme
  card: {
    height: "100%",
    border: "2px solid #000000",
    borderRadius: "1rem",
    overflow: "hidden", // Köşelerden taşan videoyu gizlemek için en önemlisi bu
    position: "relative",
    backgroundColor: "#000000",
  },
  // Video: Kartı tamamen kaplayacak şekilde ayarlandı
  video: {
    width: "100%",
    height: "100%",
    // --- İSTEĞİNİZİN ANAHTARI: Videoyu kırparak kartı kaplamasını sağlar ---
    objectFit: "cover",
  },
  // Yazıların bulunduğu katman
  overlay: {
    padding: 0, // İçeriği kendimiz yöneteceğimiz için varsayılan padding'i sıfırlıyoruz
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end", // Tüm içeriği dikeyde en alta yaslar
    background:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)", // Yazıların okunabilirliği için alttan gölge
  },
  // Yazıların bulunduğu alt bölüm
  footerContent: {
    padding: "1.5rem",
    color: "#FFFFFF",
    textAlign: "left", // Yazıları sola hizala
  },
  // Başlık Stili
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "1rem", // Başlık ile istatistikler arasına boşluk
  },
  // İstatistiklerin listelendiği alan
  statsContainer: {
    display: "flex",
    flexDirection: "column", // İstatistikleri alt alta sıralar
    gap: "0.5rem", // Her istatistik arasına boşluk
  },
  // Her bir istatistik satırı
  statItem: {
    fontSize: "1rem",
    fontWeight: 500,
  },
};

// Video Kartı Bileşeni (Yeni Düzene Göre Güncellendi)
function VideoCard({ videoSrc, title, stats, wrapperStyle }) {
  return (
    <div style={wrapperStyle}>
      <Card style={cardStyles.card}>
        <video
          style={cardStyles.video}
          autoPlay
          muted
          loop
          playsInline
          loading="lazy"
          src={videoSrc}
        />
        <Card.ImgOverlay style={cardStyles.overlay}>
          <div style={cardStyles.footerContent}>
            <h3 style={cardStyles.title}>{title}</h3>
            <div style={cardStyles.statsContainer}>
              {stats.map((stat, index) => (
                <span key={index} style={cardStyles.statItem}>
                  {stat}
                </span>
              ))}
            </div>
          </div>
        </Card.ImgOverlay>
      </Card>
    </div>
  );
}

// Ana Bileşen (Bu kısımda değişiklik yok, sadece stiller güncellendi)
function WhatWeMade() {
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setBreakpoint("mobile");
      else if (window.innerWidth < 1024) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleWhatsAppClick = () =>
    window.open("https://wa.me/YOUR_PHONE_NUMBER", "_blank");
  const handleMailClick = () =>
    (window.location.href = "mailto:YOUR_EMAIL_ADDRESS");

  // --- RESPONSIVE STİL NESNELERİ ---
  const baseFont = { fontFamily: "'BegeFont', sans-serif" };

  const responsiveStyles = {
    container: {
      ...baseFont,
      paddingTop: "5rem",
      paddingBottom: "5rem",
      textAlign: "center",
    },
    title: {
      fontWeight: 700,
      fontSize:
        breakpoint === "mobile"
          ? "3rem"
          : breakpoint === "tablet"
          ? "4rem"
          : "4.5rem",
      marginBottom: "4rem",
    },
    mainVideoWrapper: {
      height: breakpoint === "mobile" ? "70vh" : "85vh",
      marginBottom: "2rem",
    },
    dualVideoWrapper: { height: "60vh" },
    promoText: {
      fontSize:
        breakpoint === "mobile"
          ? "1.5rem"
          : breakpoint === "tablet"
          ? "2rem"
          : "2.5rem",
      lineHeight: 1.5,
      margin: "4rem 0",
    },
    button: {
      cursor: "pointer",
      padding: "14px 0",
      width:
        breakpoint === "mobile"
          ? "160px"
          : breakpoint === "tablet"
          ? "200px"
          : "220px",
      fontSize: breakpoint === "mobile" ? "1.1rem" : "1.2rem",
      borderRadius: "35px",
      border: "2px solid #141414",
      fontWeight: 500,
      textAlign: "center",
      transition: "all 0.3s ease",
      ...baseFont,
    },
  };

  const whatsAppButtonStyle = {
    ...responsiveStyles.button,
    backgroundColor: isWhatsAppHovered ? "#FFFFFF" : "#141414",
    color: isWhatsAppHovered ? "#141414" : "#FFFFFF",
  };
  const mailButtonStyle = {
    ...responsiveStyles.button,
    backgroundColor: "#FFFFFF",
    color: "#141414",
    border: "2px solid #141414",
    ...(isMailHovered && { backgroundColor: "#141414", color: "#FFFFFF" }),
  };

  return (
    <ErrorBoundary>
      <Container fluid="lg" style={responsiveStyles.container}>
        <Row className="justify-content-center">
          <Col xs={12}>
            <h1 style={responsiveStyles.title}>What we made</h1>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12}>
            <VideoCard
              videoSrc={video1}
              title="BRAVE CF X CREATOR"
              stats={["27.2M IG", "6.7M TikTok", "Fully creator-led"]}
              wrapperStyle={responsiveStyles.mainVideoWrapper}
            />
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <VideoCard
              videoSrc={video2}
              title="LAMBORGHINI YACHT"
              stats={["690K IG", "640K TikTok"]}
              wrapperStyle={responsiveStyles.dualVideoWrapper}
            />
          </Col>
          <Col md={6}>
            <VideoCard
              videoSrc={video3}
              title="DUBAI TIMELAPSE"
              stats={["297K IG", "245K TikTok"]}
              wrapperStyle={responsiveStyles.dualVideoWrapper}
            />
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <p style={responsiveStyles.promoText}>
              We shoot fast, <br /> we edit smart and we do <br /> it with
              creators who know <br /> how to read the moment.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs="auto" className="d-grid d-sm-flex gap-3">
            <button
              style={whatsAppButtonStyle}
              onClick={handleWhatsAppClick}
              onMouseEnter={() => setIsWhatsAppHovered(true)}
              onMouseLeave={() => setIsWhatsAppHovered(false)}
            >
              WhatsApp
            </button>
            <button
              style={mailButtonStyle}
              onClick={handleMailClick}
              onMouseEnter={() => setIsMailHovered(true)}
              onMouseLeave={() => setIsMailHovered(false)}
            >
              Mail
            </button>
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  );
}

export default WhatWeMade;
