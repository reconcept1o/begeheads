import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";


const privacySections = [
  {
    number: "1.",
    title: "General Information",
    content:
      "Protecting your personal data is very important to us. We process your data exclusively based on legal requirements (GDPR, TKG 2003). This privacy policy informs you about the key aspects of data processing on our website.",
  },
  {
    number: "2.",
    title: "Contact Form",
    content:
      "Our website uses a contact form provided by an external service. When you use the form, any data you provide (e.g., name, email address) will be stored to process your request. The use of this form complies with GDPR requirements, and the external provider stores data according to its own privacy policy.",
  },
  {
    number: "3.",
    title: "Cookies",
    content:
      "Our website uses cookies to improve the user experience and provide certain functionalities. When you first visit our website, you can consent to or decline the use of cookies. Further details about the cookies used and their settings can be found in our cookie banner.",
  },
  {
    number: "4.",
    title: "Use of Social Media Pixels",
    content:
      "We use tracking pixels from the following social media platforms on our website: Meta (Facebook) – The Facebook Pixel helps us analyze visitor behavior and display personalized ads on Facebook and Instagram. LinkedIn – The LinkedIn Pixel enables us to optimize our LinkedIn ads and measure campaign effectiveness. TikTok – The TikTok Pixel is used for personalized advertising and tracking the effectiveness of our campaigns on TikTok. These social media providers process data based on legitimate interests according to Article 6(1)(f) of the GDPR. If you do not want your activity on our website to be shared with these social media providers, you can disable cookies through our cookie banner.",
  },
  {
    number: "5.",
    title: "Analytics and Marketing Tools",
    content:
      "To improve our website and enhance the user experience, we use analytics and marketing tools. These tools allow us to analyze usage and display targeted advertising. The collected data is anonymized or pseudonymized and is not used for personal identification. Data storage and processing follow applicable data protection regulations.",
  },
  {
    number: "6.",
    title: "Google Services",
    content:
      "Our website utilizes various Google services, such as Google Analytics and Google Search Console. Google Analytics uses cookies that allow us to analyze how users engage with our site. Information generated by these cookies is transferred to Google servers in the USA and stored there. You can prevent the storage of cookies by adjusting your browser settings.",
  },
  {
    number: "7.",
    title: "Email Communication",
    content:
      "To ensure secure and reliable communication, we use an email service. Any email addresses or message contents provided by you are used solely for responding to your inquiries and are not shared with third parties.",
  },
  {
    number: "8.",
    title: "User Rights",
    content:
      "You have the following rights: Access to information regarding your stored data, Correction of incorrect data, Deletion of your data if it is no longer required for fulfilling legal obligations, Restriction of processing, Data portability, and Objection to processing of your data. To exercise these rights, please contact us using the details provided in our legal notice.",
  },
  {
    number: "9.",
    title: "Contact",
    content:
      "If you have any questions about the processing of your personal data or if you wish to exercise your rights, please reach out to us via the contact information in our legal notice.",
  },
];

// --- STİL NESNELERİ ---
const styles = {
  pageContainer: {
    backgroundColor: "#F9F9F9",
    color: "#1C1C1C",
    padding: "8rem 0",
    fontFamily: "'BegeFont', sans-serif",
    lineHeight: 1.8,
  },
 
  logo: {
    display: "block",
    width: "100%", 
   
    height: "auto",
    margin: "0 auto 8rem auto", 
  },
  mainHeading: {
    fontSize: "clamp(2.5rem, 7vw, 4rem)",
    fontWeight: 700,
    marginBottom: "3rem",
    textAlign: "center", 
  },
  section: {
    marginBottom: "5rem",
  },
  subHeading: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#000000",
    marginBottom: "1rem",
  },
  paragraph: {
    fontSize: "1.1rem",
    color: "#444444",
    marginBottom: "2rem",
  },
  policySectionTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#000000",
    marginBottom: "1rem",
  },
  divider: {
    border: 0,
    borderTop: "1px solid #E0E0E0",
    margin: "6rem 0",
  },
};


function AnimatedSection({ children, delay = 0 }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const style = {
    transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(40px)",
  };
  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}


function PrivacyPolicy() {
  return (
    <div style={styles.pageContainer}>
      <Container>

        <Row className="justify-content-center">
          <Col md={10} lg={8}>
         
            <AnimatedSection>
              <Link to="/">
                <img
                  src={logo}
                  alt="BEGEADS Anasayfaya Dön"
                  style={styles.logo}
                />
              </Link>
            </AnimatedSection>

    
            <AnimatedSection delay={0.1}>
              <div style={styles.section}>
                <h1 style={styles.mainHeading}>IMPRINT</h1>
                <p style={styles.paragraph}>
                  BEGE GmbH <br />
                  Hernalser Hauptstraße 21 <br />
                  1170 Vienna, Austria <br />
                  T. +43 676 563 46 94 <br />
                  E. office@begeads.com
                </p>
                <h2 style={styles.subHeading}>Operator of BEGEADS</h2>
                <p style={styles.paragraph}>
                  The operator of this website is the company mentioned in the
                  first paragraph.
                </p>
                <h2 style={styles.subHeading}>Disclaimer</h2>
                <p style={styles.paragraph}>
                  BEGEADS strives to keep the published information current and
                  accurate but assumes no responsibility or liability for the
                  timeliness, accuracy, or completeness of the content.
                  Therefore, BEGEADS cannot be held liable for any damages that
                  may result from the use of the content.
                </p>
                <h2 style={styles.subHeading}>Links to External Websites</h2>
                <p style={styles.paragraph}>
                  Despite careful content control, we assume no liability for
                  the content of external links. The respective operators are
                  solely responsible for the content of linked sites.
                </p>
              </div>
            </AnimatedSection>

            <hr style={styles.divider} />

     
            <div style={styles.section}>
              <AnimatedSection delay={0.2}>
                <h1 style={styles.mainHeading}>PRIVACY POLICY</h1>
              </AnimatedSection>

              {privacySections.map((section, index) => (
                <AnimatedSection key={index} delay={0.3 + index * 0.1}>
                  <div>
                    <h2 style={styles.policySectionTitle}>
                      {section.number} {section.title}
                    </h2>
                    <p style={styles.paragraph}>{section.content}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PrivacyPolicy;
