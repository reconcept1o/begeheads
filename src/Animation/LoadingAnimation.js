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
      // YENİ METİN DAHA UZUN OLDUĞU İÇİN KAMERAYI GERİ ÇEKTİK
      camera.position.z = 20;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mount.appendChild(renderer.domElement);
    };

    // 2. Harfleri ve Sembolü Oluştur
    const createLetters = () => {
      // --- YENİ METNİ BURADA TANIMLIYORUZ ---
      const fullText = "©BEGEADS CREATIVE SPACE";
      // Harflerin arasındaki boşluğu ayarlıyoruz
      const letterSpacing = 1.5;

      // Metnin toplam genişliğini hesaplayarak ortalamayı sağlıyoruz
      const totalWidth = (fullText.length - 1) * letterSpacing;

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

      // Harfleri döngüyle oluştur
      fullText.split("").forEach((char, index) => {
        // --- BOŞLUK KARAKTERLERİ İÇİN NESNE OLUŞTURMUYORUZ ---
        if (char === " ") {
          return; // Boşluğu atla ama pozisyonunu koru
        }

        let material, geometry, mesh;

        // Hedef pozisyonu ve boyutu belirle
        let finalPosition = new THREE.Vector3();
        let finalScale = new THREE.Vector3(1, 1, 1);

        // Her harfin X pozisyonunu toplam genişliğe göre hesapla
        finalPosition.x = index * letterSpacing - totalWidth / 2;

        if (char === "©") {
          // © sembolü için özel ayarlar
          material = new THREE.MeshBasicMaterial({
            map: createLetterTexture(char, 60, 64, 64, 5), // Daha küçük font ve canvas
            transparent: true,
          });
          geometry = new THREE.PlaneGeometry(0.9, 0.9); // Daha küçük düzlem
          // Pozisyonu hafifçe aşağı al
          finalPosition.y = -0.1;
        } else {
          // Normal harfler için ayarlar
          material = new THREE.MeshBasicMaterial({
            map: createLetterTexture(char, 90, 128, 128, 5),
            transparent: true,
          });
          geometry = new THREE.PlaneGeometry(1.8, 1.8);
          finalPosition.y = 0;
        }

        mesh = new THREE.Mesh(geometry, material);

        // Final pozisyonu ve ölçeği sakla
        mesh.userData.finalPosition = finalPosition;
        mesh.userData.finalScale = finalScale;

        // --- YARATICI ANİMASYON İÇİN BAŞLANGIÇ DURUMU ---
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

        scene.add(mesh);
        letterMeshes.push(mesh);
      });
    };

    // 3. GSAP ile Animasyonu Çalıştır (Bu kısımda değişiklik gerekmiyor)
    const runAnimation = () => {
      const tl = gsap.timeline();

      letterMeshes.forEach((mesh, index) => {
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
        );

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
        );
      });
    };

    // Render ve Event Listener'lar
    const animate = () => {
      if (!renderer) return;

      letterMeshes.forEach((mesh) => {
        const targetX = mesh.userData.finalPosition.x + mouse.x * 0.5;
        const targetY = mesh.userData.finalPosition.y - mouse.y * 0.5;
        mesh.position.x += (targetX - mesh.position.x) * 0.05;
        mesh.position.y += (targetY - mesh.position.y) * 0.05;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // Y eksenini düzelttim
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

    // 4. Temizleme Fonksiyonu (Bu kısımda değişiklik gerekmiyor)
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
