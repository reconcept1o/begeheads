// src/Animation/LegacyThreeScene.js
import React, { useEffect, useRef } from "react";

function LegacyThreeScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Orijinal script'in çalışması için gereken HTML yapısını oluşturuyoruz.
    const threeContainer = document.createElement("div");
    threeContainer.id = "three-container-stripped";
    if (containerRef.current) {
      containerRef.current.appendChild(threeContainer);
    }

    // 2. Script'i yüklüyoruz.
    const script = document.createElement("script");

    // --- ÇÖZÜM BURADA ---
    // Public klasörüne doğru şekilde erişmek için process.env.PUBLIC_URL kullanıyoruz.
    script.src = process.env.PUBLIC_URL + "/view.js";

    script.async = true;
    script.id = "legacy-three-script";

    document.body.appendChild(script);

    // 3. Temizlik fonksiyonu
    return () => {
      if (
        window.begeadsThreeScene &&
        typeof window.begeadsThreeScene.dispose === "function"
      ) {
        window.begeadsThreeScene.dispose();
        window.begeadsThreeScene = undefined;
      }
      const legacyScript = document.getElementById("legacy-three-script");
      if (legacyScript) {
        document.body.removeChild(legacyScript);
      }
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="wp-block-create-block-begeads-threejs-stripped"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        overflow: "hidden",
      }}
    />
  );
}

export default LegacyThreeScene;
