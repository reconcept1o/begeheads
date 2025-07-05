import React, { useEffect, useRef } from "react";

function CustomCursor() {
  const dotRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let circleX = 0;
    let circleY = 0;
    const smoothing = 0.1; // Gecikme faktörü, küçüldükçe gecikme artar

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Küçük nokta anında hareket eder
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Link veya buton üzerine gelme kontrolü
      const target = e.target;
      if (circleRef.current) {
        if (target.closest("a") || target.closest("button")) {
          circleRef.current.classList.add("hovered");
        } else {
          circleRef.current.classList.remove("hovered");
        }
      }
    };

    // Animasyon döngüsü
    const animate = () => {
      // Büyük çember yumuşak bir gecikme ile hareket eder (Lerp)
      const deltaX = mouseX - circleX;
      const deltaY = mouseY - circleY;

      circleX += deltaX * smoothing;
      circleY += deltaY * smoothing;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot"></div>
      <div ref={circleRef} className="cursor-circle"></div>
    </>
  );
}

export default CustomCursor;
