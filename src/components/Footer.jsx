import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaArrowUp } from "react-icons/fa";

import logo from "../assets/logo.svg";


const contactLinks = [
  { text: "Message us", href: "https://wa.me/YOUR_PHONE_NUMBER" },
  { text: "Email us", href: "mailto:YOUR_EMAIL_ADDRESS" },
];

const socialLinks = [
  { text: "INSTAGRAM", href: "https://instagram.com" },
  { text: "LINKEDIN", href: "https://linkedin.com" },
  { text: "YOUTUBE", href: "https://youtube.com" },
];

// --- RESPONSIVE STİLLER ---
const responsiveStyles = `
  @media (max-width: 767.98px) {
    .footer-main-row {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 2.5rem; /* Mobil sütunlar arası boşluk */
    }
    .footer-contact-links {
      display: none !important; /* "Message us" linklerini mobilde gizle */
    }
    .footer-address-col {
      order: 2; /* Adresi 2. sıraya al */
      text-align: left !important;
    }
    .footer-social-col {
      order: 1; /* Sosyal medyayı 1. sıraya al */
      text-align: left !important;
      align-items: flex-start !important;
    }
    .footer-social-link {
      text-decoration: underline !important; /* Sosyal medya linklerine alt çizgi ekle */
      text-underline-offset: 6px;
    }
    .footer-main {
      padding: 4rem 1.5rem !important; /* Mobil için iç boşlukları ayarla */
    }
    .footer-logo-row {
      margin-top: 2rem !important;
      margin-bottom: 2rem !important;
    }
    .footer-reg-symbol {
       font-size: 1.5rem !important; /* ® sembolünü mobilde küçült */
    }
  }
`;

// --- STİL NESNELERİ ---
const styles = {
  footer: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    padding: "6rem 2rem 4rem 2rem",

    position: "relative",
    borderTop: "1px solid #E0E0E0",
  },
  addressBlock: {
    textAlign: "left",
  },
  addressTitle: {
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  addressText: {
    lineHeight: 1.6,
  },
  mainLinks: {
    textAlign: "center",
    display: "flex",
    gap: "3rem",
    justifyContent: "center",
  },
  mainLink: {
    color: "#000000",
    textDecoration: "underline",
    textUnderlineOffset: "8px",
    fontSize: "1.75rem",
    fontWeight: "500",
    transition: "opacity 0.3s ease",
  },
  socialBlock: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "0.5rem",
  },
  socialLink: {
    color: "#000000",
    textDecoration: "none",
    fontWeight: "500",
    transition: "opacity 0.3s ease",
  },
  logoRow: {
    marginTop: "4rem",
    marginBottom: "4rem",
    position: "relative",
    textAlign: "center",
  },
  logo: {
    width: "100%",
    maxWidth: "800px",
    height: "auto",
  },

  regSymbol: {
    position: "absolute",
    top: "0",
    right: "0",
    fontSize: "2rem",
  },
  legalLink: {
    color: "#000000",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "opacity 0.3s ease",
  },
  toTop: {
    position: "absolute",
    top: "2rem",
    right: "2rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
  },
  toTopIcon: {
    border: "1px solid #000000",
    borderRadius: "50%",
    padding: "0.5rem",
    width: "40px",
    height: "40px",
    marginBottom: "0.25rem",
  },
  toTopText: {
    fontSize: "0.8rem",
  },
};

function HoverLink({
  href,
  style,
  children,
  target = "_blank",
  className = "",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const finalStyle = { ...style, opacity: isHovered ? 0.6 : 1 };
  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      style={finalStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      {children}
    </a>
  );
}

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <style>{responsiveStyles}</style>
      <footer style={styles.footer} className="footer-main">
        <Container fluid>
          <div style={styles.toTop} onClick={scrollToTop}>
            <FaArrowUp style={styles.toTopIcon} />
            <div style={styles.toTopText}>to top</div>
          </div>

          <Row className="align-items-start footer-main-row">
            <Col md={4} className="footer-address-col">
              <div style={styles.addressBlock}>
                <div style={styles.addressTitle}>BEGEADS</div>
                <p style={styles.addressText}>
                  Musterstraße 15 <br />
                  1010 Vienna, Austria
                </p>
              </div>
            </Col>

            <Col
              md={4}
              style={styles.mainLinks}
              className="footer-contact-links"
            >
              {contactLinks.map((link) => (
                <HoverLink
                  key={link.text}
                  href={link.href}
                  style={styles.mainLink}
                >
                  {link.text}
                </HoverLink>
              ))}
            </Col>

            <Col md={4}>
              <div style={styles.socialBlock} className="footer-social-col">
                {socialLinks.map((link) => (
                  <HoverLink
                    key={link.text}
                    href={link.href}
                    style={styles.socialLink}
                    className="footer-social-link"
                  >
                    {link.text}
                  </HoverLink>
                ))}
              </div>
            </Col>
          </Row>

          <Row style={styles.logoRow} className="footer-logo-row">
            <Col>
              <img src={logo} alt="BEGEADS Logo" style={styles.logo} />
              {/* ® sembolünü ekleyen <sup> etiketi buradan kaldırıldı. */}
            </Col>
          </Row>

          <Row>
            <Col className="text-start">
              <HoverLink
                href="/privacy-policy"
                style={styles.legalLink}
                target="_self"
              >
                Privacy statement
              </HoverLink>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default Footer;
