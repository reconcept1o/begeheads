import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

function LoadingAnimation() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let scene,
      camera,
      renderer,
      letterMeshes = [];
    const mouse = new THREE.Vector2(); // Fare pozisyonu için

    // 1. Sahneyi Kur
    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        mount.clientWidth / mount.clientHeight,
        0.1,
        100
      );
      camera.position.z = 12;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mount.appendChild(renderer.domElement);
    };

    // 2. Harfleri ve ® Sembolünü Oluştur
    const createLetters = () => {
      const mainText = "BEGEADS";
      const fullText = mainText + "®";
      const letterSpacing = 2.0;

      const createLetterTexture = (char, fontSize, width, height) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.font = `bold ${fontSize}px 'Outfit', sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, width / 2, height / 2 + 5);
        return new THREE.CanvasTexture(canvas);
      };

      // Harfleri döngüyle oluştur
      fullText.split("").forEach((char, index) => {
        let material, geometry, mesh;

        // Hedef pozisyonu ve boyutu belirle
        let finalPosition = new THREE.Vector3();
        let finalScale = new THREE.Vector3(1, 1, 1);

        if (char === "®") {
          // ® sembolü için özel ayarlar
          material = new THREE.MeshBasicMaterial({
            map: createLetterTexture(char, 60, 64, 64), // Daha küçük font ve canvas
            transparent: true,
          });
          geometry = new THREE.PlaneGeometry(0.9, 0.9); // Daha küçük düzlem
          // Pozisyonu son harfe göre ayarla
          const lastLetterX =
            (mainText.length - 1 - (mainText.length - 1) / 2) * letterSpacing;
          finalPosition.set(lastLetterX + 1.2, 0.9, 0);
        } else {
          // Normal harfler için ayarlar
          material = new THREE.MeshBasicMaterial({
            map: createLetterTexture(char, 90, 128, 128),
            transparent: true,
          });
          geometry = new THREE.PlaneGeometry(1.8, 1.8);
          finalPosition.x = (index - (mainText.length - 1) / 2) * letterSpacing;
        }

        mesh = new THREE.Mesh(geometry, material);

        // Final pozisyonu ve ölçeği sakla
        mesh.userData.finalPosition = finalPosition;
        mesh.userData.finalScale = finalScale;

        // --- YARATICI ANİMASYON İÇİN BAŞLANGIÇ DURUMU ---
        // Rastgele pozisyonlardan başla
        mesh.position.set(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25 - 10
        );
        // Rastgele rotasyonla başla
        mesh.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        // Sıfır ölçekle başla
        mesh.scale.set(0, 0, 0);

        scene.add(mesh);
        letterMeshes.push(mesh);
      });
    };

    // 3. GSAP ile Animasyonu Çalıştır
    const runAnimation = () => {
      const tl = gsap.timeline();

      letterMeshes.forEach((mesh, index) => {
        // Her harfi hedef pozisyonuna, rotasyonuna ve ölçeğine animasyonla getir
        tl.to(
          mesh.position,
          {
            x: mesh.userData.finalPosition.x,
            y: mesh.userData.finalPosition.y,
            z: mesh.userData.finalPosition.z,
            duration: 2.5,
            ease: "power3.inOut",
          },
          index * 0.08
        ); // Stagger efekti için başlangıç zamanını ayarla

        tl.to(
          mesh.rotation,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 2.5,
            ease: "power3.inOut",
          },
          index * 0.08
        );

        tl.to(
          mesh.scale,
          {
            x: mesh.userData.finalScale.x,
            y: mesh.userData.finalScale.y,
            z: mesh.userData.finalScale.z,
            duration: 1.5,
            ease: "back.out(1.7)",
          },
          index * 0.08 + 0.5
        ); // Ölçek animasyonu biraz sonra başlasın
      });
    };

    // Render ve Event Listener'lar
    const animate = () => {
      if (!renderer) return;

      // Fare etkileşimi (Parallax)
      letterMeshes.forEach((mesh) => {
        const targetX = mesh.userData.finalPosition.x + mouse.x * 0.5;
        const targetY = mesh.userData.finalPosition.y - mouse.y * 0.5;

        // Pozisyonu yumuşakça hedefe doğru kaydır
        mesh.position.x += (targetX - mesh.position.x) * 0.05;
        mesh.position.y += (targetY - mesh.position.y) * 0.05;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onResize = () => {
      if (!renderer) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    // Kurulum ve Başlatma
    init();
    createLetters();
    runAnimation();
    animate();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    // 4. Temizleme Fonksiyonu
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(
        letterMeshes.flatMap((m) => [m.position, m.rotation, m.scale])
      );

      scene.traverse((object) => {
        if (object.isMesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        }
      });

      if (renderer) {
        renderer.dispose();
        if (mount && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        renderer = null;
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

export default LoadingAnimation;
