import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";


import video1 from "../assets/video/1.mp4";
import video2 from "../assets/video/2.mp4";
import video3 from "../assets/video/3.mp4";


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


const cardStyles = {
  card: {
    height: "100%",
    border: "2px solid #000000",
    borderRadius: "1rem",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000000",
  },
  video: { width: "100%", height: "100%", objectFit: "cover" },
  overlay: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
  },
  footerContent: { padding: "1.5rem", color: "#FFFFFF", textAlign: "left" },
  title: { fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" },
  statsContainer: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  statItem: { fontSize: "1rem", fontWeight: 500 },
};


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


const animationStyles = `
  @keyframes shine {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .animated-text-shine {
    background-image: linear-gradient(90deg, #000000 0%, #444444 25%, #ffffff 50%, #444444 75%, #000000 100%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shine 5s linear infinite;
    display: inline-block;
  }
`;


function WhatWeMade() {
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setBreakpoint("mobile");
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
      fontSize: breakpoint === "mobile" ? "3.5rem" : "5rem",
      marginBottom: "4rem",
    },
    mainVideoWrapper: {
      // GÜNCELLEME: Yükseklik 90vh'ye çıkarıldı, dikey boşluk artırıldı.
      height: breakpoint === "mobile" ? "70vh" : "90vh",
      marginBottom: breakpoint === "mobile" ? "2rem" : "5rem",
    },
    dualVideoWrapper: {
      // GÜNCELLEME: İkincil videoların yüksekliği de dengeli olması için artırıldı.
      height: breakpoint === "mobile" ? "60vh" : "70vh",
    },
    promoText: {
      fontWeight: 500,
      fontSize: breakpoint === "mobile" ? "1.8rem" : "3rem",
      lineHeight: 1.4,
      margin: "5rem 0",
    },
    button: {
      cursor: "pointer",
      padding: "16px 0",
      width: breakpoint === "mobile" ? "180px" : "240px",
      fontSize: breakpoint === "mobile" ? "1.1rem" : "1.3rem",
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
    backgroundColor: isMailHovered ? "#FFFFFF" : "#141414",
    color: isMailHovered ? "#141414" : "#FFFFFF",
  };

  return (
    <ErrorBoundary>
      <style>{animationStyles}</style>

      <Container fluid="lg" style={responsiveStyles.container}>
        <Row className="justify-content-center">
          <Col xs={12}>
            <h1 style={responsiveStyles.title}>What we made</h1>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {/* GÜNCELLEME: lg={11} xl={10} kaldırıldı, artık tam genişlik kullanıyor */}
          <Col xs={12}>
            <VideoCard
              videoSrc={video1}
              title="BRAVE CF X CREATOR"
              stats={["27.2M IG", "6.7M TikTok", "Fully creator-led"]}
              wrapperStyle={responsiveStyles.mainVideoWrapper}
            />
          </Col>
        </Row>

        <Row className="justify-content-center g-4">
          <Col md={6} lg={5}>
            <VideoCard
              videoSrc={video2}
              title="LAMBORGHINI YACHT"
              stats={["690K IG", "640K TikTok"]}
              wrapperStyle={responsiveStyles.dualVideoWrapper}
            />
          </Col>
          <Col md={6} lg={5}>
            <VideoCard
              videoSrc={video3}
              title="DUBAI TIMELAPSE"
              stats={["297K IG", "245K TikTok"]}
              wrapperStyle={responsiveStyles.dualVideoWrapper}
            />
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={9}>
            <p style={responsiveStyles.promoText}>
              We shoot <span className="animated-text-shine">fast</span>, <br />
              we edit smart and we do <br />
              it with <span className="animated-text-shine">creators</span> who
              know <br />
              how to read the moment.
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
