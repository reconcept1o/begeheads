import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

function LoadingAnimation() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const letterMeshesRef = useRef([]);
  const logoMeshRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const init = () => {
      sceneRef.current = new THREE.Scene();
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        mount.clientWidth / mount.clientHeight,
        0.1,
        100
      );
      cameraRef.current.position.z = 40;

      rendererRef.current = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
      mount.appendChild(rendererRef.current.domElement);
    };

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

    const loadLogo = async () => {
      try {
        const response = await fetch("/assets/logo.svg");
        const svgText = await response.text();
        const img = new Image();
        img.src = `data:image/svg+xml;base64,${btoa(svgText)}`;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // SVG'yi yüksek çözünürlüklü canvas üzerinde beyaz renkte çizme
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const scale = 2; // Çözünürlüğü artırmak için ölçek
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          color: 0xffffff,
        });

        // Logo boyutları: SVG'nin en-boy oranına göre ayarlanabilir
        const aspectRatio = img.width / img.height; // SVG'nin en-boy oranı
        const logoWidth = 15; // Temel genişlik
        const logoHeight = logoWidth / aspectRatio; // Orantılı yükseklik
        const geometry = new THREE.PlaneGeometry(logoWidth, logoHeight);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 10, 10); // Yazının üstünde ve önde
        mesh.userData.isLogo = true;
        sceneRef.current.add(mesh);
        logoMeshRef.current = mesh;
      } catch (error) {
        console.error("SVG yüklenirken hata oluştu:", error);
      }
    };

    const createLetters = () => {
      const fullText = "©BEGEADS CREATIVE SPACE";
      const scene = sceneRef.current;
      const meshes = [];

      fullText.split("").forEach((char) => {
        if (char === " ") return;

        let material, geometry;
        const isSymbol = char === "©";

        if (isSymbol) {
          material = new THREE.MeshBasicMaterial({
            map: createLetterTexture(char, 120, 128, 128),
            transparent: true,
          });
          geometry = new THREE.PlaneGeometry(1.8, 1.8);
        } else {
          material = new THREE.MeshBasicMaterial({
            map: createLetterTexture(char, 180, 256, 256),
            transparent: true,
          });
          geometry = new THREE.PlaneGeometry(3.6, 3.6);
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData.isSymbol = isSymbol;

        mesh.position.set(
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50 - 20
        );
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        mesh.scale.set(0, 0, 0);

        scene.add(mesh);
        meshes.push(mesh);
      });
      letterMeshesRef.current = meshes;
    };

    const updateAndAnimateLayout = (isInitialAnimation = false) => {
      const letterMeshes = letterMeshesRef.current;
      const logoMesh = logoMeshRef.current;
      const camera = cameraRef.current;
      if (!camera || letterMeshes.length === 0) return;

      const breakpoint = 768;
      const isMobile = window.innerWidth < breakpoint;

      camera.position.z = isMobile ? 50 : 40;
      const scaleFactor = isMobile ? 2.0 : 1.6;

      // Logo animasyonu
      if (logoMesh) {
        const logoScale = isMobile ? 1.2 : 1.0; // Mobil ve masaüstü için ölçek
        gsap.to(logoMesh.position, {
          x: 0,
          y: 10, // Yazının üstünde
          z: 10, // Yazının önde
          duration: isInitialAnimation ? 2.5 : 0.8,
          ease: "power3.inOut",
        });
        gsap.to(logoMesh.scale, {
          x: logoScale,
          y: logoScale,
          z: logoScale,
          duration: isInitialAnimation ? 1.5 : 0.8,
          ease: isInitialAnimation ? "back.out(1.7)" : "power3.out",
        });
      }

      if (isMobile) {
        const lines = ["©BEGEADS", "CREATIVE", "SPACE"];
        const lineHeight = 5.0 * scaleFactor;
        const mobileLetterSpacing = 2.8;
        const zigzagXOffset = 3.5 * scaleFactor;
        const totalHeight = (lines.length - 1) * lineHeight;
        let meshIndex = 0;

        lines.forEach((line, lineIndex) => {
          const lineY = totalHeight / 2 - lineIndex * lineHeight;
          const lineWidth =
            (line.length - 1) * mobileLetterSpacing * scaleFactor;
          let lineXOffset = 0;
          if (lineIndex === 0) lineXOffset = -zigzagXOffset;
          else if (lineIndex === 2) lineXOffset = zigzagXOffset;

          line.split("").forEach((char, charIndex) => {
            const mesh = letterMeshes[meshIndex];
            if (!mesh) return;

            const charX =
              charIndex * mobileLetterSpacing * scaleFactor -
              lineWidth / 2 +
              lineXOffset;
            const finalScale = mesh.userData.isSymbol
              ? scaleFactor * 0.9
              : scaleFactor;

            gsap.to(mesh.position, {
              x: charX,
              y: lineY,
              z: 0,
              duration: isInitialAnimation ? 2.5 : 0.8,
              ease: "power3.inOut",
              delay: isInitialAnimation ? meshIndex * 0.05 : 0,
            });
            gsap.to(mesh.scale, {
              x: finalScale,
              y: finalScale,
              z: finalScale,
              duration: isInitialAnimation ? 1.5 : 0.8,
              ease: isInitialAnimation ? "back.out(1.7)" : "power3.out",
              delay: isInitialAnimation ? meshIndex * 0.05 + 0.5 : 0,
            });

            if (isInitialAnimation) {
              gsap.to(mesh.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 2.5,
                ease: "power3.inOut",
                delay: isInitialAnimation ? meshIndex * 0.05 : 0,
              });
            }
            meshIndex++;
          });
        });
      } else {
        const fullText = "©BEGEADS CREATIVE SPACE";
        const letterSpacing = 3.0;
        let characterCount = 0;
        fullText.split("").forEach((char) => char !== " " && characterCount++);
        const totalWidth = (characterCount - 1) * letterSpacing * scaleFactor;

        let currentX = -totalWidth / 2;
        let meshIndex = 0;

        fullText.split("").forEach((char) => {
          if (char === " ") {
            currentX += letterSpacing * scaleFactor;
            return;
          }

          const mesh = letterMeshes[meshIndex];
          if (!mesh) return;

          const yPos = mesh.userData.isSymbol ? -0.2 * scaleFactor : 0;
          const finalScale = mesh.userData.isSymbol
            ? scaleFactor * 0.9
            : scaleFactor;

          gsap.to(mesh.position, {
            x: currentX,
            y: yPos,
            z: 0,
            duration: isInitialAnimation ? 2.5 : 0.8,
            ease: "power3.inOut",
            delay: isInitialAnimation ? meshIndex * 0.05 : 0,
          });
          gsap.to(mesh.scale, {
            x: finalScale,
            y: finalScale,
            z: finalScale,
            duration: isInitialAnimation ? 1.5 : 0.8,
            ease: isInitialAnimation ? "back.out(1.7)" : "power3.out",
            delay: isInitialAnimation ? meshIndex * 0.05 + 0.5 : 0,
          });

          if (isInitialAnimation) {
            gsap.to(mesh.rotation, {
              x: 0,
              y: 0,
              z: 0,
              duration: 2.5,
              ease: "power3.inOut",
              delay: isInitialAnimation ? meshIndex * 0.05 : 0,
            });
          }

          currentX += letterSpacing * scaleFactor;
          meshIndex++;
        });
      }
    };

    const mouse = new THREE.Vector2();
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const animate = () => {
      if (!rendererRef.current) return;

      letterMeshesRef.current.forEach((mesh) => {
        const isAnimating = gsap.isTweening(mesh.position);
        if (isAnimating) return;

        const targetX = mesh.position.x - mouse.x * 0.03;
        const targetY = mesh.position.y - mouse.y * 0.03;
        mesh.position.x += (targetX - mesh.position.x) * 0.1;
        mesh.position.y += (targetY - mesh.position.y) * 0.1;
      });

      if (logoMeshRef.current) {
        const isAnimating = gsap.isTweening(logoMeshRef.current.position);
        if (!isAnimating) {
          const targetX = logoMeshRef.current.position.x - mouse.x * 0.03;
          const targetY = logoMeshRef.current.position.y - mouse.y * 0.03;
          logoMeshRef.current.position.x +=
            (targetX - logoMeshRef.current.position.x) * 0.1;
          logoMeshRef.current.position.y +=
            (targetY - logoMeshRef.current.position.y) * 0.1;
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };

    const onResize = () => {
      if (!rendererRef.current) return;
      cameraRef.current.aspect = mount.clientWidth / mount.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);

      updateAndAnimateLayout(false);
    };

    init();
    createLetters();
    loadLogo().then(() => {
      updateAndAnimateLayout(true);
      animate();
    });

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      gsap.globalTimeline.clear();

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        });
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mount.contains(rendererRef.current.domElement)) {
          mount.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100vh",
        cursor: "pointer",
        background: "transparent",
      }}
    />
  );
}

export default LoadingAnimation;
