import React, { useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";

// Logonuzu assets klasöründen import edin
import logo from "../assets/logo.svg";

// VERİLER
const contactLinks = [
  { text: "Message us", href: "https://wa.me/YOUR_PHONE_NUMBER" },
  { text: "Email us", href: "mailto:YOUR_EMAIL_ADDRESS" },
];

const socialLinks = [
  { text: "Instagram", href: "https://instagram.com" },
  { text: "LinkedIn", href: "https://linkedin.com" },
  { text: "YouTube", href: "https://youtube.com" },
];

// --- STİL NESNELERİ (Daha Kompakt Düzen İçin Güncellendi) ---
const styles = {
  footer: {
    backgroundColor: "#0A0A0A",
    color: "#888888",
    // GÜNCELLEME: Dikey padding azaltıldı
    padding: "5rem 0 3rem 0",
    fontFamily: "'BegeFont', sans-serif",
    textAlign: "center",
    overflow: "hidden",
    position: "relative",
  },
  glowLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
  },
  logoContainer: {
    perspective: "1000px",
  },
  logo: {
    width: "100%",
    maxWidth: "630px",
    height: "auto",
    filter: "brightness(0) invert(1)",
    // GÜNCELLEME: Logonun dikey margin'i azaltıldı
    margin: "3rem auto",
    transition: "transform 0.1s linear",
    position: "relative",
    overflow: "hidden",
    borderRadius: "10px",
  },
  address: { fontSize: "1.1rem", lineHeight: 1.7 },
  linkGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "2.5rem",
    flexWrap: "wrap",
  },
  link: {
    color: "#EAEAEA",
    textDecoration: "none",
    transition: "color 0.3s ease",
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  // GÜNCELLEME: Yasal bilgi satırının üst boşluğu azaltıldı
  legalRow: { marginTop: "4rem" },
  legalLink: {
    color: "#888888",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "color 0.3s ease",
  },
};

// --- YENİDEN KULLANILABİLİR BİLEŞENLER ---
function AnimatedElement({ children, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const style = {
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(30px)",
  };
  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}

function HoverLink({ href, style, children }) {
  const [isHovered, setIsHovered] = useState(false);
  const finalStyle = { ...style, color: isHovered ? "#FFFFFF" : style.color };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={finalStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
}

// --- ANA FOOTER BİLEŞENİ ---
function Footer() {
  const [logoStyle, setLogoStyle] = useState({});
  const footerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    const { left, top, width, height } =
      footerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = (y / height - 0.5) * -20;
    const rotateY = (x / width - 0.5) * 20;

    setLogoStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      boxShadow: `inset 0 0 150px 50px rgba(255,255,255,0.05), 0 0 50px 10px rgba(255,255,255,0.03)`,
    });
  };

  const handleMouseLeave = () => {
    setLogoStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)",
      boxShadow: "none",
    });
  };

  return (
    <footer
      style={styles.footer}
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={styles.glowLine}></div>
      <Container>
        <AnimatedElement delay={0}>
          {/* GÜNCELLEME: Link sırasının alt boşluğu azaltıldı */}
          <Row className="justify-content-center mb-4">
            <Col md={6} lg={5} className="mb-4 mb-md-0">
              <div style={styles.linkGroup}>
                {socialLinks.map((link) => (
                  <HoverLink
                    key={link.text}
                    href={link.href}
                    style={styles.link}
                  >
                    {link.text}
                  </HoverLink>
                ))}
              </div>
            </Col>
            <Col md={6} lg={5}>
              <div style={styles.linkGroup}>
                {contactLinks.map((link) => (
                  <HoverLink
                    key={link.text}
                    href={link.href}
                    style={styles.link}
                  >
                    {link.text}
                  </HoverLink>
                ))}
              </div>
            </Col>
          </Row>
        </AnimatedElement>

        <AnimatedElement delay={0.2}>
          <Row>
            <Col style={styles.logoContainer}>
              <img
                src={logo}
                alt="BEGEADS Logo"
                style={{ ...styles.logo, ...logoStyle }}
              />
            </Col>
          </Row>
        </AnimatedElement>

        <AnimatedElement delay={0.4}>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <p style={styles.address}>
                Hernalser Hauptstrasse 21 <br />
                1170 Vienna, Austria
              </p>
            </Col>
          </Row>
        </AnimatedElement>

        <AnimatedElement delay={0.6}>
          <Row style={styles.legalRow}>
            <Col>
              <HoverLink href="/imprint" style={styles.legalLink}>
                Imprint & Privacy Policy
              </HoverLink>
            </Col>
          </Row>
        </AnimatedElement>
      </Container>
    </footer>
  );
}

export default Footer;
