import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";

// --- VERİLER ---
const featuresData = [
  { number: "01", title: "Intuitive Creators.", text: "We work with those who move intuitively — creators who sense what matters before it becomes obvious." },
  { number: "02", title: "Vision-Led Brands.", text: "The ones who already know who they are — they just need someone who can shape it with clarity and care." },
  { number: "03", title: "Built Right.", text: "We build things that don’t just look good — they land with weight, speak for themselves, and outlive the scroll." },
];

const contactData = [
  { icon: "WhatsApp", title: "Quick call? Direct message?", description: "You’ll get us instantly.", buttonText: "Let’s Talk", link: "https://wa.me/YOUR_PHONE_NUMBER" },
  { icon: "Email", title: "Have something in mind?", description: "Send it clean. We’ll hit back fast.", buttonText: "Your Move", link: "mailto:YOUR_EMAIL_ADDRESS" },
];

// --- STİL NESNELERİ (Hizalama için güncellendi) ---
const styles = {
  mainContainer: { backgroundColor: '#F7F7F7', color: '#121212', padding: '8rem 0', fontFamily: "'BegeFont', sans-serif", overflowX: 'hidden' },
  mainTitle: { fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 700, textAlign: 'center', marginBottom: '6rem', color: '#000000' },
  // YENİ: Kartın kendisi için Flexbox stili
  featureCard: {
    height: '100%', // Col'un tüm yüksekliğini kaplamasını sağlar
    display: 'flex',
    flexDirection: 'column',
  },
  featureNumber: { fontSize: '5rem', fontWeight: 700, color: '#000000', marginBottom: '-1rem' },
  featureTitle: { 
    fontSize: '2.5rem', 
    fontWeight: 700, 
    color: '#111111', 
    marginBottom: '1rem',
    minHeight: '7rem', // Başlıkların 2 satırlık bir alan ayırmasını sağlar, hizalamaya yardımcı olur
  },
  featureText: { 
    fontSize: '1.2rem', 
    lineHeight: 1.7, 
    color: '#555555',
    flexGrow: 1, // EN ÖNEMLİSİ: Bu, paragrafın kalan boşluğu doldurmasını sağlar
  },
  ctaTitle: { fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700, textAlign: 'center', marginTop: '10rem', marginBottom: '4rem', color: '#000000' },
  contactCard: { backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '24px', border: '2px solid #000000', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', height: '100%', display: 'flex', flexDirection: 'column' },
  contactIcon: { marginBottom: '1.5rem' },
  contactTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#000000', marginBottom: '0.5rem' },
  contactDescription: { fontSize: '1.1rem', color: '#555555', flexGrow: 1 },
  contactButton: { backgroundColor: '#000000', color: '#FFFFFF', padding: '1rem 2rem', borderRadius: '16px', textDecoration: 'none', fontWeight: 'bold', transition: 'all 0.3s ease', textAlign: 'center', marginTop: '2rem', border: '2px solid #000000' },
};

// --- YENİDEN KULLANILABİLİR ANİMASYONLU BİLEŞENLER ---

function FeatureCard({ number, title, text, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const animationStyle = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
    transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
  };
  return (
    <div ref={ref} style={{ ...styles.featureCard, ...animationStyle }}>
      <h3 style={styles.featureNumber}>{number}</h3>
      <h4 style={styles.featureTitle}>{title}</h4>
      <p style={styles.featureText}>{text}</p>
    </div>
  );
}

function ContactCard({ icon, title, description, buttonText, link, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = { ...styles.contactCard, opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(50px)', transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s` };
  const buttonStyle = { ...styles.contactButton, backgroundColor: isHovered ? '#FFFFFF' : '#000000', color: isHovered ? '#000000' : '#FFFFFF' };

  return (
    <div ref={ref} style={cardStyle}>
      <div style={styles.contactIcon}>
        {icon === 'WhatsApp' ? <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.43 16.84L2.05 22L7.31 20.6C8.75 21.38 10.36 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 9.24 20.91 6.78 19.16 4.96C17.34 3.14 14.81 2 12.04 2ZM17.15 15.22C16.92 15.74 15.76 16.32 15.24 16.38C14.72 16.43 14.28 16.44 13.93 16.27C13.58 16.11 12.83 15.86 11.93 15.05C10.84 14.05 10.16 12.81 9.98 12.51C9.8 12.21 9.68 12.06 9.51 11.84C9.33 11.62 9.16 11.45 9 11.23C8.84 11.01 8.68 10.81 8.54 10.58C8.4 10.35 8.25 10.12 8.27 9.87C8.29 9.62 8.78 9.17 9.03 8.94C9.28 8.71 9.49 8.65 9.66 8.65C9.83 8.65 10 8.65 10.15 8.94C10.3 9.24 10.63 10.03 10.71 10.18C10.79 10.33 10.87 10.48 10.79 10.63C10.71 10.78 10.63 10.86 10.48 11C10.33 11.15 10.23 11.26 10.11 11.39C9.99 11.51 9.87 11.63 9.75 11.75C9.64 11.85 9.53 11.96 9.66 12.11C9.8 12.26 10.29 12.91 10.92 13.5C11.65 14.18 12.23 14.5 12.38 14.62C12.53 14.74 12.65 14.77 12.8 14.7C12.95 14.62 13.39 14.16 13.59 13.91C13.79 13.66 14.11 13.58 14.41 13.66C14.71 13.74 15.5 14.16 15.7 14.26C15.9 14.36 16.08 14.44 16.13 14.51C16.18 14.59 16.18 14.89 16.03 15.04L17.15 15.22Z" fill="#000000"/></svg> : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#000000"/></svg>}
      </div>
      <h5 style={styles.contactTitle}>{title}</h5>
      <p style={styles.contactDescription}>{description}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" style={buttonStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>{buttonText}</a>
    </div>
  );
}

// ANA BILEŞEN
function HowItWorks() {
  return (
    <div style={styles.mainContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 style={styles.mainTitle}>HOW IT WORKS?</h2>
          </Col>
        </Row>
        {/* YENİ: Tablet ve Mobil Uyumlu Grid Sistemi */}
        <Row className="g-5 g-lg-4 justify-content-center">
          {featuresData.map((feature, index) => (
            <Col key={index} md={6} lg={4}>
              <FeatureCard {...feature} delay={index * 0.15} />
            </Col>
          ))}
        </Row>
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
  );
}

export default HowItWorks;