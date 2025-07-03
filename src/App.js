import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import Home from "./components/Home";
import WhatWeMade from "./components/WhatWeMade";
import Bts from "./components/Bts";
import HowItsWorks from "./components/HowItsWorks";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";

function AnimatedSectionOnScroll({ children, delay = 0 }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function MainPage() {
  return (
    <>
      <Home />
      <WhatWeMade />
      <AnimatedSectionOnScroll>
        <Bts />
      </AnimatedSectionOnScroll>
      <AnimatedSectionOnScroll>
        <HowItsWorks />
      </AnimatedSectionOnScroll>
      <AnimatedSectionOnScroll>
        <Footer />
      </AnimatedSectionOnScroll>
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <AnimatedSectionOnScroll>
        <PrivacyPolicy />
      </AnimatedSectionOnScroll>
      <AnimatedSectionOnScroll>
        <Footer />
      </AnimatedSectionOnScroll>
    </>
  );
}

function App() {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
    },
    in: {
      opacity: 1,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
    },
    out: {
      opacity: 0,
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.8,
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <MainPage />
              </motion.div>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PrivacyPage />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
