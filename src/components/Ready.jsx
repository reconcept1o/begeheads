import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";

// --- VERİLER ---
const contactData = [
  {
    mainTitle: "WhatsApp",
    description: "Quick call? Direct message? You’ll get us instantly.",
    buttonText: "Let’s Talk",
    link: "https://wa.me/YOUR_PHONE_NUMBER", // Kendi numaranızı ekleyin
  },
  {
    mainTitle: "Email",
    description: "Have something in mind? Send it clean. We’ll hit back fast.",
    buttonText: "Your Move",
    link: "mailto:YOUR_EMAIL_ADDRESS", // Kendi e-posta adresinizi ekleyin
  },
];

// --- STİLLER ---
const newStyles = `
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }

  .marquee-container {
    padding: 1rem 0;
    overflow: hidden;
    background-color: #000000;
    white-space: nowrap;
    border-bottom: 1px solid #333;
    display: none;
  }

  @media (max-width: 768px) {
    .marquee-container {
      display: block;
    }
  }

  .marquee-text {
    font-size: 1.2rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #FFFFFF;
    display: inline-block;
    padding-right: 2rem;
    animation: marquee 20s linear infinite;
  }
  .contact-button:hover {
    background-color: #FFFFFF !important;
    color: #000000 !important;
  }

  /* GÜNCELLEME: Kartın üzerine gelindiğinde border 3px kalınlığında ve gri renkte olacak */
  .contact-card:hover {
    border: 3px solid #555555 !important;
  }
`;

const styles = {
  mainContainer: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    padding: "5rem 0 10rem 0",

  },
  ctaTitle: {
    fontSize: "clamp(2.5rem, 8vw, 4rem)",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "4rem",
    color: "#FFFFFF",
  },
  contactCard: {
    backgroundColor: "#1C1C1C",
    padding: "2.5rem",
    borderRadius: "24px",
    border: "3px solid transparent", // DÜZELTME: Layout kaymasını önlemek için başlangıç border'ı şeffaf yapıldı
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
  },
  contactMainTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#FFFFFF",
    marginBottom: "1rem",
  },
  contactDescription: {
    fontSize: "1.1rem",
    color: "#A0A0A0",
    flexGrow: 1,
    lineHeight: 1.6,
  },
  contactButton: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    padding: "1rem 2rem",
    borderRadius: "30px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    textAlign: "center",
    marginTop: "2rem",
    border: "2px solid #FFFFFF",
  },
};

// --- AKAN YAZI BİLEŞENİ ---
function Marquee() {
  const text = "BUİLD TO BE REPLAYED - ";
  return (
    <div className="marquee-container">
      <div className="marquee-text">
        {Array(10)
          .fill(text)
          .map((t, i) => (
            <span key={i}>{t}</span>
          ))}
      </div>
    </div>
  );
}

// --- İLETİŞİM KARTI BİLEŞENİ ---
function ContactCard({ mainTitle, description, buttonText, link, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const cardStyle = {
    ...styles.contactCard,
    // Başlangıçta görünen ince çerçeveyi box-shadow ile taklit ediyoruz
    boxShadow: `inset 0 0 0 1px #333`,
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(50px)",
    transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s, box-shadow 0.3s ease, border-color 0.3s ease`,
  };

  return (
    <div ref={ref} style={cardStyle} className="contact-card">
      <h4 style={styles.contactMainTitle}>{mainTitle}</h4>
      <p style={styles.contactDescription}>{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.contactButton}
        className="contact-button"
      >
        {buttonText}
      </a>
    </div>
  );
}

// --- ANA BILEŞEN ---
function Ready() {
  return (
    <>
      <style>{newStyles}</style>
      <Marquee />
      <div style={styles.mainContainer}>
        <Container>
          <Row className="justify-content-center">
            <Col md={10}>
              <h2 style={styles.ctaTitle}>Ready to build something with us?</h2>
            </Col>
          </Row>
          <Row className="g-4 justify-content-center">
            {contactData.map((contact, index) => (
              <Col key={index} md={6} lg={5}>
                <ContactCard {...contact} delay={index * 0.2} />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Ready;
