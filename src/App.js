import React from "react";
import Home from "./components/Home"; // Mevcut anasayfa bileşeni
import "./index.css"; // Global stiller (varsa)
import WhatWeMade from "./components/WhatWeMade";
import 'bootstrap/dist/css/bootstrap.min.css';
import Bts from "./components/Bts";

function App() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Home />
      <WhatWeMade />
<Bts />

    </div>
  );
}

export default App;
