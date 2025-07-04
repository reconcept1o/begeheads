import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "react-spring";

// Videolarınızı projenizdeki doğru yoldan import ettiğinizden emin olun
import video1 from "../assets/video/1.mp4";
import video2 from "../assets/video/2.mp4";
import video3 from "../assets/video/3.mp4";

// --- ErrorBoundary Bileşeni (Değişiklik Yok) ---
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

// --- AnimatedStat Bileşeni (Değişiklik Yok) ---
function AnimatedStat({ value, label, inView, breakpoint }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: inView ? value : 0,
    delay: 300,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  const isMobile = breakpoint === "mobile";

  const statStyles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem",
      color: "#FFFFFF",
      padding: isMobile ? "0.5rem 0.9rem" : "0.7rem 1.1rem",
      borderRadius: "25px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.8)",
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    value: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: 600,
      lineHeight: 1,
    },
    label: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: 500,
      textTransform: "uppercase",
      lineHeight: 1,
    },
    labelOnly: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: 500,
      textTransform: "uppercase",
      lineHeight: 1,
      color: "#FFFFFF",
      padding: isMobile ? "0.5rem 1rem" : "0.7rem 1.2rem",
      borderRadius: "25px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.8)",
      whiteSpace: "nowrap",
    },
  };

  if (isNaN(value)) {
    return <div style={statStyles.labelOnly}>{label}</div>;
  }

  return (
    <div style={statStyles.container}>
      <animated.span style={statStyles.value}>
        {number.to((n) => (n % 1 !== 0 ? n.toFixed(1) : n.toFixed(0)))}
      </animated.span>
      <span style={statStyles.label}>{label}</span>
    </div>
  );
}

// --- VideoCard Bileşeni (Değişiklik Yok) ---
function VideoCard({
  videoSrc,
  title,
  stats,
  mobileStatRows,
  wrapperStyle,
  breakpoint,
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const isMobile = breakpoint === "mobile";

  const cardStyles = {
    frame: {
      backgroundColor: "#000000",
      padding: isMobile ? "8px" : "12px",
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
      gap: "1rem",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: isMobile ? "center" : "flex-start",
    },
    title: {
      fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
      color: "#FFFFFF",
      fontWeight: 600,
      margin: 0,
      textAlign: "left",
      flexShrink: 0,
      marginRight: isMobile ? 0 : "1rem",
    },
    statsContainer: {
      display: "flex",
      justifyContent: isMobile ? "center" : "flex-start",
      width: isMobile ? "100%" : "auto",
    },
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
            {isMobile && mobileStatRows ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  width: "100%",
                }}
              >
                {mobileStatRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    {row.map((stat, statIndex) => (
                      <AnimatedStat
                        key={statIndex}
                        {...stat}
                        inView={inView}
                        breakpoint={breakpoint}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                }}
              >
                {stats.map((stat, index) => (
                  <AnimatedStat
                    key={index}
                    {...stat}
                    inView={inView}
                    breakpoint={breakpoint}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- FİNAL STİLLER (İSTENEN GÜNCELLEME YAPILDI) ---
const highlightStyles = `
  .highlight-word { display: inline-block; position: relative; cursor: pointer; transition: all 0.2s ease-in-out; border-bottom: 7px solid #141414; padding-bottom: 0; line-height: 0.9; }
  .highlight-word:hover::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: linear-gradient(to right, #111111, #555555); border-radius: 6px; z-index: -1; transition: all 0.2s ease-in-out; }
  .highlight-word:hover { color: #FFFFFF; border-bottom-color: transparent; padding: 0.5rem 1rem; border-radius: 6px; transform: rotate(-2deg); line-height: 1.2; }
  .highlight-word:hover::after { content: ''; position: absolute; left: 1rem; right: 1rem; bottom: 0.5rem; height: 7px; background-color: #FFFFFF; }

  /* GÜNCELLEME: Mobil cihazlar için hover animasyonunu devre dışı bırakma */
  @media (max-width: 991px) {
    .highlight-word {
      border-bottom: none; /* Alttaki çizgiyi kaldır */
      cursor: default; /* İmleci normal yap */
      line-height: 1.2; /* Satır yüksekliğini çevre metinle eşitle */
      padding-bottom: 0;
    }
    
    /* Mobil'de hover olunca hiçbir stil değişikliği olmamasını sağla */
    .highlight-word:hover {
      color: inherit; /* Rengi değiştirme */
      transform: none; /* Döndürme efektini iptal et */
      padding: 0; /* Ekstra padding verme */
      border-radius: 0;
      border-bottom-color: transparent;
    }

    /* Mobil'de hover olunca oluşan ::before ve ::after elementlerini tamamen kaldır */
    .highlight-word:hover::before,
    .highlight-word:hover::after {
      content: none;
    }
  }
`;

// --- Ana Sayfa Bileşeni (Değişiklik Yok) ---
function WhatWeMade() {
  const videoData = [
    {
      id: 1,
      videoSrc: video1,
      title: "BRAVE CF X CREATOR",
      stats: [
        { value: 27.2, label: "M IG" },
        { value: 6.7, label: "M TikTok" },
        { value: NaN, label: "Fully Creator-Led" },
      ],
      mobileStatRows: [
        [
          { value: 27.2, label: "M IG" },
          { value: 6.7, label: "M TikTok" },
        ],
        [{ value: NaN, label: "Fully Creator-Led" }],
      ],
    },
    {
      id: 2,
      videoSrc: video2,
      title: "LAMBORGHINI YACHT",
      stats: [
        { value: 690, label: "K IG" },
        { value: 640, label: "K TIKTOK" },
      ],
      mobileStatRows: [
        [
          { value: 690, label: "K IG" },
          { value: 640, label: "K TIKTOK" },
        ],
      ],
    },
    {
      id: 3,
      videoSrc: video3,
      title: "DUBAI TIMELAPSE",
      stats: [
        { value: 297, label: "K IG" },
        { value: 245, label: "K TIKTOK" },
      ],
      mobileStatRows: [
        [
          { value: 297, label: "K IG" },
          { value: 245, label: "K TIKTOK" },
        ],
      ],
    },
  ];

  const [breakpoint, setBreakpoint] = useState("desktop");
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setBreakpoint("mobile");
      } else {
        setBreakpoint("desktop");
      }
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
      paddingLeft: "15px",
      paddingRight: "15px",
    },
    videoWrapper: { height: breakpoint === "mobile" ? "105vh" : "110vh" },
    secondaryVideoWrapper: {
      height: breakpoint === "mobile" ? "85vh" : "110vh",
    },
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
      width: breakpoint === "mobile" ? "140px" : "240px",
      fontSize: breakpoint === "mobile" ? "1.1rem" : "1.3rem",
      borderRadius: "35px",
      border: "1px solid #141414",
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
      <div
        style={{
          ...baseFont,
          paddingTop: "5rem",
          paddingBottom: "5rem",
          overflowX: "hidden",
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
                breakpoint={breakpoint}
              />
            </Col>
          </Row>
          <Row className="gy-4">
            <Col xs={12} md={6}>
              <VideoCard
                {...videoData[1]}
                wrapperStyle={responsiveStyles.secondaryVideoWrapper}
                breakpoint={breakpoint}
              />
            </Col>
            <Col xs={12} md={6}>
              <VideoCard
                {...videoData[2]}
                wrapperStyle={responsiveStyles.secondaryVideoWrapper}
                breakpoint={breakpoint}
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
            <Col xs="auto" className="d-flex justify-content-center gap-3">
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
