import * as THREE from "three";

class LoadingScene {
  constructor(mount) {
    this.mount = mount;
    this.isAnimating = true;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 2.5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(mount.clientWidth, mount.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(this.renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16);
    const material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);

    this.animate();
  }

  onResize() {
    this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    if (!this.isAnimating) return;
    this.mesh.rotation.x += 0.005;
    this.mesh.rotation.y += 0.005;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  dispose() {
    this.isAnimating = false;
    window.removeEventListener("resize", this.onResize);
    this.mount.removeChild(this.renderer.domElement);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.renderer.dispose();
  }
}

export default LoadingScene;
