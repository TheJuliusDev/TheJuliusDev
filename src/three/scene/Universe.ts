import * as THREE from 'three';

interface UniverseOptions {
  canvas: HTMLCanvasElement;
  isMobile: boolean;
}

export class Universe {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private stars!: THREE.Points;
  private particles!: THREE.Points;
  private nebula!: THREE.Points;
  private mouse = new THREE.Vector2(0, 0);
  private targetMouse = new THREE.Vector2(0, 0);
  private clock = new THREE.Clock();
  private animationId = 0;
  private isMobile: boolean;
  private scrollY = 0;

  constructor({ canvas, isMobile }: UniverseOptions) {
    this.isMobile = isMobile;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.z = 80;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);

    this.createStars();
    this.createParticles();
    this.createNebula();
    this.addLights();
    this.setupEvents();
    this.animate();
  }

  /**
   * Creates a soft circular star sprite texture using a canvas radial gradient
   * with optional 4-point diffraction spikes for larger, brighter stars.
   */
  private createStarTexture(withSpikes = false): THREE.CanvasTexture {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const cx = size / 2;
    const cy = size / 2;

    if (withSpikes) {
      // Horizontal diffraction spike
      const hGrad = ctx.createLinearGradient(0, cy, size, cy);
      hGrad.addColorStop(0,   'rgba(255,255,255,0)');
      hGrad.addColorStop(0.4, 'rgba(255,255,255,0.15)');
      hGrad.addColorStop(0.5, 'rgba(255,255,255,0.6)');
      hGrad.addColorStop(0.6, 'rgba(255,255,255,0.15)');
      hGrad.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, cy - 1.5, size, 3);

      // Vertical diffraction spike
      const vGrad = ctx.createLinearGradient(cx, 0, cx, size);
      vGrad.addColorStop(0,   'rgba(255,255,255,0)');
      vGrad.addColorStop(0.4, 'rgba(255,255,255,0.15)');
      vGrad.addColorStop(0.5, 'rgba(255,255,255,0.6)');
      vGrad.addColorStop(0.6, 'rgba(255,255,255,0.15)');
      vGrad.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(cx - 1.5, 0, 3, size);
    }

    // Soft circular glow on top (or as the only layer for plain stars)
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
    gradient.addColorStop(0,    'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.4,  'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.7,  'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1,    'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
  }

  private createStars(): void {
    const count = this.isMobile ? 2000 : 5000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 600;
      positions[i * 3]     = (Math.random() - 0.5) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * r;
      sizes[i] = Math.random() * 2 + 0.5;

      const t = Math.random();
      if (t < 0.6) {
        // Cool white-blue (most stars)
        colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0;
      } else if (t < 0.8) {
        // Teal accent
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.83; colors[i * 3 + 2] = 0.71;
      } else {
        // Indigo accent
        colors[i * 3] = 0.31; colors[i * 3 + 1] = 0.55; colors[i * 3 + 2] = 1.0;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    // Spiked texture for the main star field — gives a classic sci-fi look
    const mat = new THREE.PointsMaterial({
      size: 2.5,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      map: this.createStarTexture(true),
      alphaTest: 0.01,   // discards transparent square corners
      depthWrite: false, // prevents z-fighting dark halos between particles
    });

    this.stars = new THREE.Points(geo, mat);
    this.scene.add(this.stars);
  }

  private createParticles(): void {
    const count = this.isMobile ? 300 : 800;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Plain circular glow for the floating teal dust particles
    const mat = new THREE.PointsMaterial({
      color: 0x00d4b4,
      size: 1.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      map: this.createStarTexture(false),
      alphaTest: 0.01,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  private createNebula(): void {
    const count = this.isMobile ? 150 : 400;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 120 + 20;
      positions[i * 3]     = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 100;

      const c = Math.random();
      if (c < 0.5) {
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.53; colors[i * 3 + 2] = 0.71;
      } else {
        colors[i * 3] = 0.31; colors[i * 3 + 1] = 0.27; colors[i * 3 + 2] = 0.96;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    // Large, very soft circular blobs for the nebula cloud effect
    const mat = new THREE.PointsMaterial({
      size: 6,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      map: this.createStarTexture(false),
      alphaTest: 0.005,
      depthWrite: false,
    });

    this.nebula = new THREE.Points(geo, mat);
    this.scene.add(this.nebula);
  }

  private addLights(): void {
    const ambient = new THREE.AmbientLight(0x001133, 2);
    this.scene.add(ambient);
    const point = new THREE.PointLight(0x00d4b4, 1.5, 300);
    point.position.set(0, 0, 80);
    this.scene.add(point);
  }

  private setupEvents(): void {
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });

    window.addEventListener('resize', () => this.onResize());
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();

    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    this.stars.rotation.y = t * 0.003 + this.mouse.x * 0.1;
    this.stars.rotation.x = this.mouse.y * 0.05;

    this.particles.rotation.y = t * 0.008;
    this.particles.rotation.x = t * 0.004;

    this.nebula.rotation.y = -t * 0.005;

    this.camera.position.x += (this.mouse.x * 8  - this.camera.position.x) * 0.04;
    this.camera.position.y += (this.mouse.y * 5  - this.camera.position.y) * 0.04;
    this.camera.position.z  = 80 + this.scrollY * 0.03;
    this.camera.lookAt(0, 0, 0);

    const starMat = this.stars.material as THREE.PointsMaterial;
    starMat.opacity = 0.7 + Math.sin(t * 0.5) * 0.2;

    this.renderer.render(this.scene, this.camera);
  }

  public destroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }
}