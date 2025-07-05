import React, { useEffect, useRef } from "react";

function CustomCursor() {
  const circleOrangeRef = useRef(null);
  const circleBlackRef = useRef(null);
  const timeoutIdRef = useRef(null); // Kaybolma efekti için zamanlayıcı referansı

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let orangeX = 0;
    let orangeY = 0;
    let blackX = 0;
    let blackY = 0;
    const orangeSmoothing = 0.15;
    const blackSmoothing = 0.08;
    const newSize = 35; // YENİ: Boyut burada tanımlandı
    const offset = newSize / 2; // YENİ: Ortalamak için ofset

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // GÜNCELLEME: Fare hareket edince daireleri görünür yap
      if (circleOrangeRef.current && circleBlackRef.current) {
        circleOrangeRef.current.style.opacity = "1";
        circleBlackRef.current.style.opacity = "1";
      }

      // Önceki zamanlayıcıyı temizle
      clearTimeout(timeoutIdRef.current);

      // Fare durduktan 200ms sonra daireleri gizlemek için yeni zamanlayıcı ayarla
      timeoutIdRef.current = setTimeout(() => {
        if (circleOrangeRef.current && circleBlackRef.current) {
          circleOrangeRef.current.style.opacity = "0";
          circleBlackRef.current.style.opacity = "0";
        }
      }, 200);
    };

    const animate = () => {
      const deltaOrangeX = mouseX - orangeX;
      const deltaOrangeY = mouseY - orangeY;
      orangeX += deltaOrangeX * orangeSmoothing;
      orangeY += deltaOrangeY * orangeSmoothing;

      if (circleOrangeRef.current) {
        circleOrangeRef.current.style.transform = `translate3d(${
          orangeX - offset
        }px, ${orangeY - offset}px, 0)`;
      }

      const deltaBlackX = mouseX - blackX;
      const deltaBlackY = mouseY - blackY;
      blackX += deltaBlackX * blackSmoothing;
      blackY += deltaBlackY * blackSmoothing;

      if (circleBlackRef.current) {
        circleBlackRef.current.style.transform = `translate3d(${
          blackX - offset
        }px, ${blackY - offset}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutIdRef.current); // Component kaldırıldığında zamanlayıcıyı temizle
    };
  }, []);

  return (
    <>
      <div ref={circleOrangeRef} className="cursor-circle-orange"></div>
      <div ref={circleBlackRef} className="cursor-circle-black"></div>
    </>
  );
}

export default CustomCursor;
