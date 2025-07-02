import React from "react";
import { Routes, Route } from "react-router-dom"; // 1. Gerekli bileşenleri import et

// Bileşenler
import Home from "./components/Home";
import WhatWeMade from "./components/WhatWeMade";
import Bts from "./components/Bts";
import HowItsWorks from "./components/HowItsWorks";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy"; // 2. PrivacyPolicy'yi import et

// Ana sayfanın içeriğini bir araya getiren bir bileşen oluşturmak kodu temiz tutar.
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

// Gizlilik politikası sayfasının düzeni
function PrivacyPage() {
  return (
    <>
      <PrivacyPolicy />
      <Footer />{" "}
      {/* Footer'ı burada da göstermek iyi bir kullanıcı deneyimi sağlar */}
    </>
  );
}

function App() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* 3. Routes bileşeni ile rotaları tanımla */}
      <Routes>
        {/* Ana sayfa için rota: "/" URL'sinde MainPage bileşenini göster */}
        <Route path="/" element={<MainPage />} />

        {/* Gizlilik Politikası için rota: "/imprint" URL'sinde PrivacyPage bileşenini göster */}
        <Route path="/privacy-policy" element={<PrivacyPage />} />
      </Routes>
    </div>
  );
}

export default App;
