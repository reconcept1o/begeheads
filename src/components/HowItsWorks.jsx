import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";

// Icons for navigation (Updated fill color)
const LeftArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);
const RightArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

const featuresData = [
  {
    title: "Intuitive Creators.",
    text: "We work with those who move intuitively — creators who sense what matters before it becomes obvious.",
  },
  {
    title: "Vision-Led Brands.",
    text: "The ones who already know who they are — they just need someone who can shape it with clarity and care.",
  },
  {
    title: "Built Right.",
    text: "We build things that don’t just look good — they land with weight, speak for themselves, and outlive the scroll.",
  },
];

// --- STİL NESNELERİ ---
const styles = {
  mainContainer: {
    backgroundColor: "#F7F7F7",
    color: "#121212",
    padding: "8rem 0",

    overflowX: "hidden",
  },
  mainTitle: {
    fontSize: "clamp(3rem, 3vw, 3rem)",
    fontWeight: 600,
    textAlign: "left",
    marginBottom: "6rem",
    color: "black",
  },
  // Mobile-specific title style to override margin
  mobileHeaderTitle: {
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    fontWeight: 600,
    color: "black",
    margin: 0,
  },
  featureCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    border: "none",
    position: "relative",
  },
  featureTitle: {
    fontSize: "3.5rem",
    fontWeight: 500,
    color: "black",
    marginBottom: "18rem",
    minHeight: "7rem",
  },
  featureText: {
    fontSize: "2rem",
    fontWeight: 500,
    lineHeight: 1.25,
    color: "#555555",
    flexGrow: 1,
  },
  activeCard: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    marginTop: "10px",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    height: "400px",
    overflow: "hidden",
    display: "none", // Hidden by default, shown in media query
  },
  mobileCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem",
    borderRadius: "16px",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    transition: "transform 0.3s ease",
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
  },
  mobileTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#FFFFFF",
    marginBottom: "8rem",
    minHeight: "5rem",
  },
  mobileText: {
    fontSize: "1rem",
    lineHeight: 1.5,
    color: "#CCCCCC",
    flexGrow: 1,
  },
};

// Media query for mobile
const mobileStyles = `
  @media (max-width: 768px) {
    .desktop {
      display: none !important;
    }
    .mobile {
      display: block !important;
    }
    .mobile-header {
      display: flex !important;
    }
    .carouselContainer {
      display: block !important;
      height: auto !important;
    }
    .mobileCard {
      height: auto !important;
    }
  }
`;

// ---Desktop Animation ---
function FeatureCard({ title, text, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isHovered, setIsHovered] = useState(false);

  const animationStyle = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(50px)",
    transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
  };

  const cardStyle = {
    ...styles.featureCard,
    ...animationStyle,
    ...(isHovered ? { ...styles.activeCard } : {}),
  };

  const titleStyle = {
    ...styles.featureTitle,
    color: isHovered ? "#FFFFFF" : "black",
  };

  const textStyle = {
    ...styles.featureText,
    color: isHovered ? "#FFFFFF" : "#555555",
  };

  return (
    <div
      ref={ref}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="desktop"
    >
      <h4 style={titleStyle}>{title}</h4>
      <p style={textStyle}>{text}</p>
    </div>
  );
}

// --- mobile corousel---
function MobileFeatureCard({ title, text, isActive }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const animationStyle = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(50px)",
    transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)`,
  };

  const cardStyle = {
    ...styles.mobileCard,
    ...animationStyle,
    transform: isActive ? "translateX(0)" : "translateX(100%)",
  };

  return (
    <div ref={ref} style={cardStyle} className="mobile">
      <h4 style={styles.mobileTitle}>{title}</h4>
      <p style={styles.mobileText}>{text}</p>
    </div>
  );
}

// ana bileşenler
function HowItWorks() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuresData.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuresData.length) % featuresData.length
    );
  };

  useEffect(() => {
    const touchArea = touchRef.current;
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      }
      if (touchStartX - touchEndX < -50) {
        prevSlide();
      }
    };

    if (touchArea) {
      touchArea.addEventListener("touchstart", handleTouchStart);
      touchArea.addEventListener("touchmove", handleTouchMove);
      touchArea.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (touchArea) {
        touchArea.removeEventListener("touchstart", handleTouchStart);
        touchArea.removeEventListener("touchmove", handleTouchMove);
        touchArea.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  return (
    <div style={styles.mainContainer}>
      <Container>
        {/* --- Desktop Title --- */}
        <Row className="justify-content-center desktop">
          <Col md={10}>
            <h2 style={styles.mainTitle}>HOW IT WORKS?</h2>
          </Col>
        </Row>

    
        <Row
          className="mobile-header"
          style={{
            display: "none", // Hidden by default, shown by media query
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "1rem",
            marginBottom: "2rem",
            borderBottom: "1px solid black",
          }}
        >
          <Col xs="auto">
            <h2 style={styles.mobileHeaderTitle}>HOW IT WORKS?</h2>
          </Col>
          <Col xs="auto">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={prevSlide}
                style={{ cursor: "pointer", marginRight: "0.5rem" }}
              >
                <LeftArrow />
              </div>
              <div onClick={nextSlide} style={{ cursor: "pointer" }}>
                <RightArrow />
              </div>
            </div>
          </Col>
        </Row>

        <Row
          className="g-0 desktop"
          style={{
            borderTop: "1px solid #000000",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "none",
          }}
        >
          {featuresData.map((feature, index) => (
            <Col
              key={index}
              md={6}
              lg={4}
              className={
                index === 0
                  ? "border-end"
                  : index === featuresData.length - 1
                  ? "border-start"
                  : "border-start border-end"
              }
              style={{ borderColor: "#000000" }}
            >
              <FeatureCard {...feature} delay={index * 0.15} />
            </Col>
          ))}
        </Row>


        <div className="mobile" style={styles.carouselContainer} ref={touchRef}>
          <MobileFeatureCard {...featuresData[currentIndex]} isActive={true} />
        </div>
      </Container>
      <style>{mobileStyles}</style>
    </div>
  );
}

export default HowItWorks;
