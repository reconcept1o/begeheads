import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "react-spring";


import video1 from "../assets/video/1.mp4";
import video2 from "../assets/video/2.mp4";
import video3 from "../assets/video/3.mp4";

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


function AnimatedStat({ value, unit, label, inView }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: inView ? value : 0,
    delay: 300,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  const statStyles = {
    wrapper: {
      minWidth: "110px",
      padding: "0.75rem 1rem",
      borderRadius: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      textAlign: "center",
      color: "#FFFFFF",
    },
    valueContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "baseline",
      gap: "0.2rem",
    },
    value: { fontSize: "2rem", fontWeight: 700, lineHeight: 1 },
    unit: { fontSize: "1.2rem", fontWeight: 600, textTransform: "uppercase" },
    label: {
      fontSize: "0.8rem",
      fontWeight: 500,
      marginTop: "0.25rem",
      opacity: 0.8,
      textTransform: "uppercase",
    },
  };

  if (isNaN(value)) {
    return (
      <div style={{ ...statStyles.wrapper, padding: "1.25rem 1rem" }}>
        {label}
      </div>
    );
  }

  return (
    <div style={statStyles.wrapper}>
      <div style={statStyles.valueContainer}>
        <animated.span style={statStyles.value}>
          {number.to((n) => n.toFixed(1))}
        </animated.span>
        <span style={statStyles.unit}>{unit}</span>
      </div>
      <div style={statStyles.label}>{label}</div>
    </div>
  );
}


function VideoCard({ videoSrc, title, stats, wrapperStyle }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  const cardStyles = {
    card: {
      height: "100%",
      border: "2px solid #000000",
      borderRadius: "1rem",
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#000000",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    },
    video: { width: "100%", height: "100%", objectFit: "cover" },
    overlay: {
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)",
    },
    title: {
      fontSize: "clamp(1.5rem, 4vw, 2rem)",
      color: "#FFFFFF",
      fontWeight: 700,
    },
    statsContainer: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  };

  return (
    <div ref={ref} style={wrapperStyle}>
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
          <h3 style={cardStyles.title}>{title}</h3>
          <div style={cardStyles.statsContainer}>
            {stats.map((stat, index) => (
              <AnimatedStat key={index} {...stat} inView={inView} />
            ))}
          </div>
        </Card.ImgOverlay>
      </Card>
    </div>
  );
}

// --- SHINE ANIMASYONU İÇİN STİLLER ---
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
  const videoData = [
    {
      id: 1,
      videoSrc: video1,
      title: "BRAVE CF X CREATOR",
      stats: [
        { value: 27.2, unit: "M", label: "IG Views" },
        { value: 6.7, unit: "M", label: "TikTok Views" },
        { value: NaN, label: "Fully Creator-Led" },
      ],
    },
    {
      id: 2,
      videoSrc: video2,
      title: "LAMBORGHINI YACHT",
      stats: [
        { value: 690, unit: "K", label: "IG Views" },
        { value: 640, unit: "K", label: "TikTok Views" },
      ],
    },
    {
      id: 3,
      videoSrc: video3,
      title: "DUBAI TIMELAPSE",
      stats: [
        { value: 297, unit: "K", label: "IG Views" },
        { value: 245, unit: "K", label: "TikTok Views" },
      ],
    },
  ];

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

  const baseFont = { fontFamily: "'Outfit', sans-serif" };

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
      height: breakpoint === "mobile" ? "70vh" : "90vh",
      marginBottom: breakpoint === "mobile" ? "2rem" : "5rem",
    },
    dualVideoWrapper: { height: breakpoint === "mobile" ? "60vh" : "70vh" },
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
            <h1 style={responsiveStyles.title}>What We Made</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12}>
            <VideoCard
              {...videoData[0]}
              wrapperStyle={responsiveStyles.mainVideoWrapper}
            />
          </Col>
        </Row>
        <Row className="justify-content-center g-4">
          <Col md={6} lg={5}>
            <VideoCard
              {...videoData[1]}
              wrapperStyle={responsiveStyles.dualVideoWrapper}
            />
          </Col>
          <Col md={6} lg={5}>
            <VideoCard
              {...videoData[2]}
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
