import React from "react";
import { Routes, Route } from "react-router-dom";

// Bileşenler
import Home from "./components/Home";
import WhatWeMade from "./components/WhatWeMade";
import Bts from "./components/Bts";
import HowItsWorks from "./components/HowItsWorks";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";

function MainPage() {
  return (
    <>
      <Home />
      <WhatWeMade />
      <Bts />
      <HowItsWorks />
      <Footer />
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <PrivacyPolicy />
      <Footer />{" "}
    </>
  );
}

function App() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/privacy-policy" element={<PrivacyPage />} />
      </Routes>
    </div>
  );
}

export default App;
