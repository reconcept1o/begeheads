import React, { useState, useEffect, useRef } from "react"; // Added useEffect and useRef for mobile functionality
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import Ready from "./Ready";

// Icons for navigation (using SVG or any icon library)
const LeftArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);
const RightArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
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
    padding: "4rem 0", // Reduced padding for mobile
    fontFamily: "'Outfit', sans-serif",
    overflowX: "hidden",
  },
  mainTitle: {
    fontSize: "clamp(2rem, 8vw, 3rem)", // Adjusted size for mobile
    fontWeight: 400,
    textAlign: "left",
    marginBottom: "3rem", // Reduced margin for mobile
    color: "black",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  },
  featureCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem", // Reduced padding for mobile
    borderRadius: "16px",
    backgroundColor: "#000000", // Default black background for mobile
    color: "#FFFFFF",
    transition: "transform 0.3s ease",
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
  },
  featureTitle: {
    fontSize: "1.8rem", // Reduced size for mobile
    fontWeight: 700,
    color: "#FFFFFF", // White by default on mobile
    marginBottom: "8rem", // Maintained large spacing
    minHeight: "5rem", // Reduced minHeight for mobile
  },
  featureText: {
    fontSize: "1rem", // Reduced size for mobile
    lineHeight: 1.5,
    color: "#CCCCCC", // Lighter gray for contrast on black
    flexGrow: 1,
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    zIndex: 10,
  },
  leftArrow: {
    left: "10px",
  },
  rightArrow: {
    right: "10px",
  },
  desktop: {
    display: "block",
  },
  mobile: {
    display: "none",
  },
};

// Media query for mobile
const mobileStyles = `
  @media (max-width: 768px) {
    .desktop {
      display: none;
    }
    .mobile {
      display: block;
    }
    .featureCard {
      padding: 1.5rem;
      font-size: 1rem;
    }
    .featureTitle {
      font-size: 1.8rem;
      margin-bottom: 8rem;
    }
    .featureText {
      font-size: 1rem;
    }
  }
`;

// --- ANİMASYONLU BİLEŞEN ---
function FeatureCard({ title, text, delay, isActive }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const animationStyle = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(50px)",
    transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
  };

  const cardStyle = {
    ...styles.featureCard,
    ...animationStyle,
    transform: isActive ? "translateX(0)" : "translateX(100%)", // Slide effect
  };

  const titleStyle = {
    ...styles.featureTitle,
  };

  const textStyle = {
    ...styles.featureText,
  };

  return (
    <div ref={ref} style={cardStyle} className="mobile">
      <h4 style={titleStyle}>{title}</h4>
      <p style={textStyle}>{text}</p>
    </div>
  );
}

// ANA BILEŞEN
function HowItWorks() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchRef = useRef(null);

  // Infinite loop logic
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuresData.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuresData.length) % featuresData.length
    );
  };

  // Handle touch events for swipe
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
        nextSlide(); // Swipe left
      }
      if (touchStartX - touchEndX < -50) {
        prevSlide(); // Swipe right
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
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 style={styles.mainTitle}>HOW IT WORKS?</h2>
          </Col>
        </Row>
        {/* Desktop Version */}
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
        {/* Mobile Version */}
        <div className="mobile" style={styles.carouselContainer} ref={touchRef}>
          <FeatureCard
            {...featuresData[currentIndex]}
            delay={0}
            isActive={true}
          />
          <div
            style={{ ...styles.arrow, ...styles.leftArrow }}
            onClick={prevSlide}
          >
            <LeftArrow />
          </div>
          <div
            style={{ ...styles.arrow, ...styles.rightArrow }}
            onClick={nextSlide}
          >
            <RightArrow />
          </div>
        </div>
        <Ready />
      </Container>
      <style>{mobileStyles}</style> {/* Inject media query styles */}
    </div>
  );
}

export default HowItWorks;
