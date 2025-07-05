// EKLENDİ: Gerekli React fonksiyonlarını import eden satır
import React, { useState, useEffect, useRef } from "react";

function CustomCursor() {
  const circleOrangeRef = useRef(null);
  const circlePinkRef = useRef(null);
  const circleBlackRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkForMobile = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice);
    };
    checkForMobile();
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let mouseX = 0;
    let mouseY = 0;
    let orangeX = 0;
    let orangeY = 0;
    let pinkX = 0;
    let pinkY = 0;
    let blackX = 0;
    let blackY = 0;
    const orangeSmoothing = 0.15;
    const pinkSmoothing = 0.1;
    const blackSmoothing = 0.08;
    const newSize = 35;
    const offset = newSize / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (
        circleOrangeRef.current &&
        circlePinkRef.current &&
        circleBlackRef.current
      ) {
        circleOrangeRef.current.style.opacity = "1";
        circlePinkRef.current.style.opacity = "1";
        circleBlackRef.current.style.opacity = "1";
      }

      clearTimeout(timeoutIdRef.current);

      timeoutIdRef.current = setTimeout(() => {
        if (
          circleOrangeRef.current &&
          circlePinkRef.current &&
          circleBlackRef.current
        ) {
          circleOrangeRef.current.style.opacity = "0";
          circlePinkRef.current.style.opacity = "0";
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

      const deltaPinkX = mouseX - pinkX;
      const deltaPinkY = mouseY - pinkY;
      pinkX += deltaPinkX * pinkSmoothing;
      pinkY += deltaPinkY * pinkSmoothing;
      if (circlePinkRef.current) {
        circlePinkRef.current.style.transform = `translate3d(${
          pinkX - offset
        }px, ${pinkY - offset}px, 0)`;
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
    const animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutIdRef.current);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <>
      <div ref={circleOrangeRef} className="cursor-circle-orange"></div>
      <div ref={circlePinkRef} className="cursor-circle-pink"></div>
      <div ref={circleBlackRef} className="cursor-circle-black"></div>
    </>
  );
}

// EKLENDİ: Component'i dışa aktaran satır
export default CustomCursor;
