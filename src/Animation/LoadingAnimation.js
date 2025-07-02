import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

function LoadingAnimation() {
  const mountRef = useRef(null);

  // useEffect'in dışında referansları saklayarak yeniden render'larda kaybolmalarını önlüyoruz.
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const letterMeshesRef = useRef([]);
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- YENİ: DÜZEN AYARLARI ---
    const breakpoint = 768; // Mobil ve masaüstü arası geçiş noktası (px)

    // 1. Sahneyi Kur
    const init = () => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        mount.clientWidth / mount.clientHeight,
        0.1,
        100
      );
      camera.position.z = 20; // Başlangıçta geniş ekran için ayarlı
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mount.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    };

    // --- YENİ: KONUMLANDIRMA MANTIĞINI AYIRAN FONKSİYON ---
    const updateLayout = () => {
      const camera = cameraRef.current;
      const letterMeshes = letterMeshesRef.current;
      if (!camera || letterMeshes.length === 0) return;

      const isMobile = window.innerWidth < breakpoint;

      // Kamera pozisyonunu ekrana göre ayarla
      camera.position.z = isMobile ? 30 : 20;

      if (isMobile) {
        // --- MOBİL İÇİN ZİKZAK DÜZENİ ---
        const lines = ["©BEGEADS", "CREATIVE", "SPACE"];
        const lineHeight = 2.2;
        const mobileLetterSpacing = 1.4;
        const zigzagXOffset = 1.5; // Zikzak kaydırma miktarı

        const totalHeight = (lines.length - 1) * lineHeight;
        let meshIndex = 0;

        lines.forEach((line, lineIndex) => {
          const lineY = totalHeight / 2 - lineIndex * lineHeight;
          const lineWidth = (line.length - 1) * mobileLetterSpacing;
          // Satırın zikzak pozisyonunu belirle (çift satırlar sola, tek satırlar sağa)
          const lineXOffset =
            lineIndex % 2 === 0 ? -zigzagXOffset : zigzagXOffset;

          line.split("").forEach((char, charIndex) => {
            if (meshIndex >= letterMeshes.length) return;
            const mesh = letterMeshes[meshIndex];
            const charX = charIndex * mobileLetterSpacing - lineWidth / 2;

            mesh.userData.finalPosition.set(charX + lineXOffset, lineY, 0);
            meshIndex++;
          });
        });
      } else {
        // --- MASAÜSTÜ İÇİN YATAY DÜZEN ---
        const fullText = "©BEGEADS CREATIVE SPACE";
        const letterSpacing = 1.5;
        const totalWidth =
          (fullText.replace(/ /g, "").length - 1) * letterSpacing; // Boşlukları sayma

        let currentX = -totalWidth / 2;
        let meshIndex = 0;

        fullText.split("").forEach((char) => {
          if (char === " ") {
            currentX += letterSpacing; // Boşluk kadar ilerle
            return;
          }
          if (meshIndex >= letterMeshes.length) return;

          const mesh = letterMeshes[meshIndex];
          const yPos = char === "©" ? -0.1 : 0; // © sembolünü hafifçe aşağı al
          mesh.userData.finalPosition.set(currentX, yPos, 0);

          currentX += letterSpacing;
          meshIndex++;
        });
      }
    };

    // 2. Harfleri Oluştur (Sadece mesh'leri yaratır, konumlandırmaz)
    const createLetters = () => {
      const fullText = "©BEGEADS CREATIVE SPACE";
      const meshes = [];

      const createLetterTexture = (
        char,
        fontSize,
        width,
        height,
        yOffset = 0
      ) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.font = `bold ${fontSize}px 'Outfit', sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, width / 2, height / 2 + yOffset);
        return new THREE.CanvasTexture(canvas);
      };

      fullText.split("").forEach((char) => {
        if (char === " ") return; // Boşluklar için mesh oluşturma

        let material, geometry;

        if (char === "©") {
          material = new THREE.MeshBasicMaterial({
            map: createLetterTexture(char, 60, 64, 64, 5),
            transparent: true,
          });
          geometry = new THREE.PlaneGeometry(0.9, 0.9);
        } else {
          material = new THREE.MeshBasicMaterial({
            map: createLetterTexture(char, 90, 128, 128, 5),
            transparent: true,
          });
          geometry = new THREE.PlaneGeometry(1.8, 1.8);
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData.finalPosition = new THREE.Vector3();
        mesh.userData.finalScale = new THREE.Vector3(1, 1, 1);

        // Başlangıç durumu
        mesh.position.set(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25 - 10
        );
        mesh.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        mesh.scale.set(0, 0, 0);

        sceneRef.current.add(mesh);
        meshes.push(mesh);
      });
      letterMeshesRef.current = meshes;
    };

    // 3. GSAP Animasyonu (Değişiklik yok)
    const runAnimation = () => {
      const tl = gsap.timeline();
      letterMeshesRef.current.forEach((mesh, index) => {
        tl.to(
          mesh.position,
          {
            x: () => mesh.userData.finalPosition.x, // Fonksiyon kullanarak dinamik hedef al
            y: () => mesh.userData.finalPosition.y,
            z: () => mesh.userData.finalPosition.z,
            duration: 2.5,
            ease: "power3.inOut",
          },
          index * 0.08
        );

        tl.to(
          mesh.rotation,
          { x: 0, y: 0, z: 0, duration: 2.5, ease: "power3.inOut" },
          index * 0.08
        );
        tl.to(
          mesh.scale,
          { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.7)" },
          index * 0.08 + 0.5
        );
      });
    };

    // Render ve Event Listener'lar
    const animate = () => {
      if (!rendererRef.current) return;
      const mouse = mouseRef.current;

      letterMeshesRef.current.forEach((mesh) => {
        // Yumuşak geçiş (lerp) ile fare etkileşimi
        const targetX = mesh.userData.finalPosition.x + mouse.x * 0.5;
        const targetY = mesh.userData.finalPosition.y - mouse.y * 0.5;
        mesh.position.x += (targetX - mesh.position.x) * 0.05;
        mesh.position.y += (targetY - mesh.position.y) * 0.05;
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };

    const onMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      if (!rendererRef.current) return;
      const mount = mountRef.current;
      cameraRef.current.aspect = mount.clientWidth / mount.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);

      // --- YENİ: YENİDEN BOYUTLANDIRMADA DÜZENİ GÜNCELLE ---
      updateLayout();
    };

    // Kurulum ve Başlatma
    init();
    createLetters();
    updateLayout(); // İlk düzeni hesapla
    runAnimation();
    animate();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    // 4. Temizleme Fonksiyonu
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(
        letterMeshesRef.current.flatMap((m) => [
          m.position,
          m.rotation,
          m.scale,
        ])
      );

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.isMesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (object.material.map) object.material.map.dispose();
              object.material.dispose();
            }
          }
        });
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mount && mount.contains(rendererRef.current.domElement)) {
          mount.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", cursor: "pointer" }}
    />
  );
}

export default LoadingAnimation;
