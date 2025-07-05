// BegeadsScene.js

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class BegeadsScene {
  constructor(container, assetPaths, onLoadCallback) {
    this.container = container;
    this.assetPaths = assetPaths;
    this.onLoadCallback = onLoadCallback;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.autoClear = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.loadingManager = new THREE.LoadingManager();
    this.isLoaded = false;
    this.pointer = new THREE.Vector2();
    this.viewport = { width: 2, height: 2 };

    this.logoMesh = null;
    this.shapesGroup = null;
    this.shapesGroup2 = null;
    this.lookAtTarget1 = new THREE.Vector3();
    this.lookAtTarget2 = new THREE.Vector3();
    this.basePositions = { group1: null, group2: null };
    this.currentScrollPositions = {
      group1: new THREE.Vector3(),
      group2: new THREE.Vector3(),
    };
    this.floatingOffsets = {
      group1: new THREE.Vector3(),
      group2: new THREE.Vector3(),
    };
    this.gsapAnimations = [];
    this.scrollTrigger = null;

    this.init();
  }

  init() {
    this.setupLoadingManager();
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    this.camera.aspect = rect.width / rect.height;
    this.camera.position.set(0, 0, 5);
    this.camera.zoom = 0.8;
    this.camera.updateProjectionMatrix();
    this.updateViewport();
    this.setupLighting();
    this.setupEnvironment();
    this.loadAssets();
    this.setupEventListeners();
  }

  setupLoadingManager() {
    this.loadingManager.onLoad = () => this.onLoadingComplete();
    this.loadingManager.onError = (url) =>
      console.error(`BegeadsScene: Yükleme hatası: ${url}`);
  }

  onLoadingComplete() {
    if (this.isLoaded) return;
    this.isLoaded = true;
    if (this.onLoadCallback) this.onLoadCallback();
    this.showCanvas();
    this.animate();
  }

  showCanvas() {
    if (this.renderer.domElement) this.renderer.domElement.style.opacity = "1";
    this.handleResize();
  }

  updateViewport() {
    const z = this.camera.position.z;
    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
  }

  setupLighting() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 4.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 12);
    directionalLight.position.set(1, 1, 2);
    this.scene.add(directionalLight);
  }

  setupEnvironment() {
    const cubeLoader = new THREE.CubeTextureLoader(this.loadingManager);
    const envMap = cubeLoader.load(this.assetPaths.envMap);
    this.scene.environment = envMap;
    this.scene.background = null;
  }

  async loadAssets() {
    this.loadGLTFModel();
    this.loadAndCreateLogoShapes();
  }

  loadGLTFModel() {
    const loader = new GLTFLoader(this.loadingManager);
    loader.load(this.assetPaths.gltf, (gltf) => {
      const geometry = gltf.scene.children[0]?.geometry;
      if (geometry) this.createAnimatedLetters(geometry);
    });
  }

  loadAndCreateLogoShapes() {
    const loader = new SVGLoader(this.loadingManager);
    loader.load(this.assetPaths.logo, (data) => {
      const paths = data.paths;
      const group = new THREE.Group();

      const box = new THREE.Box3().setFromObject(
        new THREE.Group().add(
          ...paths.map(
            (p) =>
              new THREE.Mesh(
                new THREE.ShapeGeometry(SVGLoader.createShapes(p)[0])
              )
          )
        )
      );
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const shapes = SVGLoader.createShapes(path);

        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        }
      }

      const scale = (this.viewport.height * 0.45) / size.y;
      group.scale.set(scale, scale, scale);
      group.position.x = -center.x * scale;

      // GÜNCELLEME: Logoyu "2 tık" daha yukarı çektik (0.6 -> 0.85)
      group.position.y = (this.viewport.height / 2) * 0.85;

      group.position.z = -0.5;
      group.rotation.x = Math.PI;

      this.logoMesh = group;
      this.scene.add(this.logoMesh);
    });
  }

  createAnimatedLetters(geometry) {
    const material = new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.2,
      transmission: 1.0,
      thickness: 2,
      ior: 1.3,
      envMap: this.scene.environment,
      envMapIntensity: 1.8,
    });

    const scaleFactor = Math.max(15, Math.min(25, 30 / this.viewport.width));
    this.shapesGroup = new THREE.Group();
    const mesh1 = new THREE.Mesh(geometry, material);
    mesh1.rotation.set(Math.PI / 2, Math.PI / 9, Math.PI / 1);
    this.shapesGroup.add(mesh1);
    this.shapesGroup.scale.setScalar(this.viewport.width * scaleFactor);
    this.shapesGroup.position.set(
      this.viewport.width / 2,
      -this.viewport.width / 5.2,
      0.1
    );
    this.scene.add(this.shapesGroup);
    this.basePositions.group1 = {
      position: this.shapesGroup.position.clone(),
      rotation: this.shapesGroup.rotation.clone(),
    };
    this.shapesGroup2 = new THREE.Group();
    const mesh2 = new THREE.Mesh(geometry, material.clone());
    mesh2.rotation.set(Math.PI / 2, -Math.PI / 1.1, Math.PI / 1);
    this.shapesGroup2.add(mesh2);
    this.shapesGroup2.scale.setScalar(this.viewport.width * scaleFactor);
    const yPos2Factor = Math.min(
      3.3,
      Math.max(1.1, (this.viewport.width / 2) * 3.3)
    );
    this.shapesGroup2.position.set(
      -this.viewport.width / 2,
      this.viewport.width / yPos2Factor,
      0.1
    );
    this.scene.add(this.shapesGroup2);
    this.basePositions.group2 = {
      position: this.shapesGroup2.position.clone(),
      rotation: this.shapesGroup2.rotation.clone(),
    };
    this.currentScrollPositions = {
      group1: this.basePositions.group1.position.clone(),
      group2: this.basePositions.group2.position.clone(),
    };
    this.startFloatingAnimations();
    this.setupScrollAnimation();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.isLoaded) return;
    this.renderer.clear();
    this.updateMouseTracking();
    this.renderer.render(this.scene, this.camera);
  }

  setupScrollAnimation() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => this.updateLetterPositions(self.progress),
    });
  }
  updateLetterPositions(progress) {
    if (!this.shapesGroup || !this.shapesGroup2) return;
    const isMobile = window.innerWidth <= 768;
    const scrollFactor = isMobile ? 5.0 : 0.8;
    const scrollDistance = this.viewport.height * scrollFactor;
    this.currentScrollPositions.group1.y =
      this.basePositions.group1.position.y + scrollDistance * progress;
    this.currentScrollPositions.group2.y =
      this.basePositions.group2.position.y + scrollDistance * progress * 0.9;
    this.shapesGroup.position
      .copy(this.currentScrollPositions.group1)
      .add(this.floatingOffsets.group1);
    this.shapesGroup2.position
      .copy(this.currentScrollPositions.group2)
      .add(this.floatingOffsets.group2);
  }
  startFloatingAnimations() {
    if (this.gsapAnimations.length > 0)
      this.gsapAnimations.forEach((anim) => anim.kill());
    this.gsapAnimations = [];
    const updatePositions = () => {
      if (this.currentScrollPositions) {
        if (this.shapesGroup)
          this.shapesGroup.position
            .copy(this.currentScrollPositions.group1)
            .add(this.floatingOffsets.group1);
        if (this.shapesGroup2)
          this.shapesGroup2.position
            .copy(this.currentScrollPositions.group2)
            .add(this.floatingOffsets.group2);
      }
    };
    this.gsapAnimations.push(
      gsap.to(this.floatingOffsets.group1, {
        x: 0.1,
        y: 0.08,
        z: -0.05,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        onUpdate: updatePositions,
      }),
      gsap.to(this.floatingOffsets.group2, {
        x: -0.12,
        y: -0.06,
        z: 0.05,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5,
        onUpdate: updatePositions,
      })
    );
  }
  updateMouseTracking() {
    const targetX = this.pointer.x * 0.3;
    const targetY = this.pointer.y * 0.3;
    if (this.shapesGroup) {
      const lookAtPos = this.shapesGroup.position
        .clone()
        .add(new THREE.Vector3(targetX, targetY, 1));
      this.lookAtTarget1.lerp(lookAtPos, 0.05);
      this.shapesGroup.lookAt(this.lookAtTarget1);
    }
    if (this.shapesGroup2) {
      const lookAtPos = this.shapesGroup2.position
        .clone()
        .add(new THREE.Vector3(targetX, targetY, 1));
      this.lookAtTarget2.lerp(lookAtPos, 0.05);
      this.shapesGroup2.lookAt(this.lookAtTarget2);
    }
  }
  setupEventListeners() {
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleResize = this.handleResize.bind(this);
    window.addEventListener("mousemove", this.boundHandleMouseMove);
    window.addEventListener("resize", this.boundHandleResize);
  }
  handleMouseMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  handleResize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width, rect.height);
    this.updateViewport();

    if (this.basePositions.group1 && this.basePositions.group2) {
      const scaleFactor = Math.max(15, Math.min(25, 30 / this.viewport.width));
      this.shapesGroup.scale.setScalar(this.viewport.width * scaleFactor);
      this.shapesGroup2.scale.setScalar(this.viewport.width * scaleFactor);
      this.basePositions.group1.position.set(
        this.viewport.width / 2,
        -this.viewport.width / 5.2,
        0.1
      );
      const yPos2Factor = Math.min(
        3.3,
        Math.max(1.1, (this.viewport.width / 2) * 3.3)
      );
      this.basePositions.group2.position.set(
        -this.viewport.width / 2,
        this.viewport.width / yPos2Factor,
        0.1
      );
      if (this.scrollTrigger) {
        this.updateLetterPositions(this.scrollTrigger.progress);
      }
    }
  }

  dispose() {
    if (this.gsapAnimations) this.gsapAnimations.forEach((anim) => anim.kill());
    if (this.scrollTrigger) this.scrollTrigger.kill();
    window.removeEventListener("mousemove", this.boundHandleMouseMove);
    window.removeEventListener("resize", this.boundHandleResize);

    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material))
          object.material.forEach((m) => m.dispose());
        else object.material.dispose();
      }
    });
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        try {
          this.container.removeChild(this.renderer.domElement);
        } catch (e) {}
      }
    }
  }
}

export default BegeadsScene;
