import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. React Router'ı import et
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* 2. App bileşenini bununla sarmala */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
