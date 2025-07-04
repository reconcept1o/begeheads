import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "react-spring";

// Videolarınızı projenizdeki doğru yoldan import ettiğinizden emin olun
import video1 from "../assets/video/1.mp4";
import video2 from "../assets/video/2.mp4";
import video3 from "../assets/video/3.mp4";

// --- Diğer Bileşenler (Değişiklik yok) ---
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary bir hata yakaladı:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}
function AnimatedStat({ value, label, inView }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: inView ? value : 0,
    delay: 300,
    config: { mass: 1, tension: 20, friction: 10 },
  });
  const statStyles = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#FFFFFF",
      padding: "0.8rem 1.2rem",
      borderRadius: "25px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid #FFFFFF",
      minWidth: "140px",
      justifyContent: "center",
    },
    value: { fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 },
    label: {
      fontSize: "1rem",
      fontWeight: 500,
      textTransform: "uppercase",
      opacity: 0.9,
    },
    labelOnly: {
      color: "#FFFFFF",
      fontSize: "0.9rem",
      fontWeight: 500,
      padding: "0.8rem 1.2rem",
      borderRadius: "16px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid #FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      minWidth: "140px",
    },
  };
  if (isNaN(value)) {
    return <div style={statStyles.labelOnly}>{label}</div>;
  }
  return (
    <div style={statStyles.container}>
      <animated.span style={statStyles.value}>
        {number.to((n) => (n < 10 ? n.toFixed(1) : n.toFixed(0)))}
      </animated.span>
      <span style={statStyles.label}>{label}</span>
    </div>
  );
}
function VideoCard({ videoSrc, title, stats, wrapperStyle }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const cardStyles = {
    frame: {
      backgroundColor: "#000000",
      padding: "12px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: "1rem",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    },
    videoWrapper: {
      flexGrow: 1,
      overflow: "hidden",
      position: "relative",
      borderRadius: "12px",
    },
    video: { width: "100%", height: "100%", objectFit: "cover" },
    infoBar: {
      backgroundColor: "#000000",
      padding: "1rem 1.25rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1rem",
    },
    title: {
      fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
      color: "#FFFFFF",
      fontWeight: 600,
      margin: 0,
    },
    statsContainer: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  };
  return (
    <div ref={ref} style={wrapperStyle}>
      <div style={cardStyles.frame}>
        <div style={cardStyles.videoWrapper}>
          <video
            style={cardStyles.video}
            autoPlay
            muted
            loop
            playsInline
            loading="lazy"
            src={videoSrc}
          />
        </div>
        <div style={cardStyles.infoBar}>
          <h3 style={cardStyles.title}>{title}</h3>
          <div style={cardStyles.statsContainer}>
            {stats.map((stat, index) => (
              <AnimatedStat key={index} {...stat} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// ---

// --- FİNAL STİLLER ---
const highlightStyles = `
  .highlight-word {
    display: inline-block;
    position: relative; /* ::before ve ::after'ı konumlandırmak için gerekli */
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border-bottom: 7px solid #141414;
    padding-bottom: 0;
    line-height: 0.9;
  }

  /* YENİ: Arka planı oluşturacak olan katman */
  .highlight-word:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(to right, #111111, #555555);
    border-radius: 6px;
    z-index: -1; /* Bu katmanı metnin ve diğer her şeyin arkasına gönderir */
    transition: all 0.2s ease-in-out; /* Yumuşak geçiş için eklendi */
  }

  .highlight-word:hover {
    color: #FFFFFF;
    /* background-image buradan kaldırıldı */
    border-bottom-color: transparent; /* Orijinal border'ı gizliyoruz çünkü yerine ::after gelecek */
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transform: rotate(-2deg); /* Döndürme efekti geri eklendi */
    line-height: 1.2;
  }

  /* Alt çizgi, ::before'dan (arka plan) daha üst katmanda kalır */
  .highlight-word:hover::after {
    content: '';
    position: absolute;
    left: 1rem;
    right: 1rem;
    bottom: 0.5rem;
    height: 7px;
    background-color: #FFFFFF;
  }
`;

const customLayoutStyles = `
  .row-gap-15px {
    --bs-gutter-x: 15px;
  }
`;

// --- Ana Sayfa Bileşeni ---
function WhatWeMade() {
  const videoData = [
    {
      id: 1,
      videoSrc: video1,
      title: "BRAVE CF X CREATOR",
      stats: [
        { value: 27.2, label: "M IG Views" },
        { value: 6.7, label: "M TikTok Views" },
        { value: NaN, label: "Fully Creator-Led" },
      ],
    },
    {
      id: 2,
      videoSrc: video2,
      title: "LAMBORGHINI YACHT",
      stats: [
        { value: 690, label: "K IG Views" },
        { value: 640, label: "K TikTok Views" },
      ],
    },
    {
      id: 3,
      videoSrc: video3,
      title: "DUBAI TIMELAPSE",
      stats: [
        { value: 297, label: "K IG Views" },
        { value: 245, label: "K TikTok Views" },
      ],
    },
  ];

  const [breakpoint, setBreakpoint] = useState("desktop");
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setBreakpoint("mobile");
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

  const baseFont = { fontFamily: "'Outfit', sans-serif" };

  const responsiveStyles = {
    title: {
      fontWeight: 300,
      fontSize: breakpoint === "mobile" ? "2.8rem" : "4.5rem",
      marginBottom: "4rem",
      textAlign: "left",
    },
    videoWrapper: { height: breakpoint === "mobile" ? "80vh" : "110vh" },
    promoText: {
      fontWeight: 500,
      fontSize: breakpoint === "mobile" ? "2.8rem" : "5rem",
      lineHeight: 1.2,
      margin: "5rem 0",
      textAlign: "center",
      color: "#141414",
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
    backgroundColor: isWhatsAppHovered ? "#141414" : "#FFFFFF",
    color: isWhatsAppHovered ? "#FFFFFF" : "#141414",
  };
  const mailButtonStyle = {
    ...responsiveStyles.button,
    backgroundColor: isMailHovered ? "#141414" : "#FFFFFF",
    color: isMailHovered ? "#FFFFFF" : "#141414",
  };

  return (
    <ErrorBoundary>
      <style>{highlightStyles}</style>
      <style>{customLayoutStyles}</style>

      <div
        style={{
          ...baseFont,
          paddingTop: "5rem",
          paddingBottom: "5rem",
          paddingLeft: "30px",
          paddingRight: "30px",
        }}
      >
        <Container fluid>
          <Row>
            <Col>
              <h1 style={responsiveStyles.title}>What We Made</h1>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xs={12}>
              <VideoCard
                {...videoData[0]}
                wrapperStyle={responsiveStyles.videoWrapper}
              />
            </Col>
          </Row>

          <Row className="row-gap-15px gy-3">
            <Col xs={6}>
              <VideoCard
                {...videoData[1]}
                wrapperStyle={responsiveStyles.videoWrapper}
              />
            </Col>
            <Col xs={6}>
              <VideoCard
                {...videoData[2]}
                wrapperStyle={responsiveStyles.videoWrapper}
              />
            </Col>
          </Row>

          <Row className="justify-content-center mt-5">
            <Col>
              <p style={responsiveStyles.promoText}>
                We shoot <span className="highlight-word">fast</span>, <br />
                we edit smart and we do <br />
                it with <span className="highlight-word">creators</span> who
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
      </div>
    </ErrorBoundary>
  );
}

export default WhatWeMade;