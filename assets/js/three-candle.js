/**
 * JUMENIA CANDLES - 3D Candle Showcase & Interactive Viewer
 * Built with Three.js (Procedural geometries, realistic wax shaders & flame simulation)
 */

class CandleShowcase {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      candleType: 'jar',      // 'jar', 'bubble', 'ribbed', 'arch'
      waxColor: 0xF7EFE6,     // Warm cream wax
      jarColor: 0x2A1A12,     // Deep espresso bronze
      flameOn: true,
      autoRotate: true,
      showControls: true
    }, options);

    this.isFlameOn = this.options.flameOn;
    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 400;
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.2, 3.8);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.setupLighting();

    // 5. Candle Object Construction
    this.candleGroup = new THREE.Group();
    this.buildCandleModel();
    this.scene.add(this.candleGroup);

    // 6. Pedestal / Shadow Receiver
    this.createPedestal();

    // 7. Event Listeners & Interaction (Mouse drag & Touch rotate)
    this.setupInteraction();

    // 8. Handle Resize
    window.addEventListener('resize', () => this.onResize());

    // 9. Animation Loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xFFF9F2, 0.9);
    this.scene.add(ambientLight);

    // Main Key Light
    this.dirLight = new THREE.DirectionalLight(0xFFEEDD, 1.4);
    this.dirLight.position.set(4, 6, 4);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Subtle Rim Light
    const rimLight = new THREE.DirectionalLight(0xC5A880, 0.8);
    rimLight.position.set(-4, 3, -3);
    this.scene.add(rimLight);

    // Warm Flickering Candle Flame Light
    this.flameLight = new THREE.PointLight(0xFFA238, 2.2, 4);
    this.flameLight.position.set(0, 0.85, 0);
    this.flameLight.castShadow = true;
    this.scene.add(this.flameLight);
  }

  createPedestal() {
    // Subtle luxury marble / silk base plate
    const geo = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 64);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xFDFBF7,
      roughness: 0.3,
      metalness: 0.05
    });
    const pedestal = new THREE.Mesh(geo, mat);
    pedestal.position.y = -0.75;
    pedestal.receiveShadow = true;
    this.scene.add(pedestal);

    // Golden rim detail
    const rimGeo = new THREE.TorusGeometry(1.65, 0.02, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.8,
      roughness: 0.2
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -0.74;
    this.scene.add(rim);
  }

  buildCandleModel() {
    // Clean existing group if rebuilding
    while (this.candleGroup.children.length > 0) {
      this.candleGroup.remove(this.candleGroup.children[0]);
    }

    const type = this.options.candleType;

    if (type === 'bubble') {
      this.buildBubbleCandle();
    } else if (type === 'ribbed') {
      this.buildRibbedCandle();
    } else {
      this.buildJarCandle();
    }

    // Add Wick & Flame
    this.buildWickAndFlame();
  }

  buildJarCandle() {
    // 1. Luxury Heavy-Base Glass Jar
    const jarOuterGeo = new THREE.CylinderGeometry(0.68, 0.65, 1.2, 48);
    const jarMat = new THREE.MeshPhysicalMaterial({
      color: this.options.jarColor,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.45,
      opacity: 0.95,
      transparent: true,
      reflectivity: 0.9
    });
    const jar = new THREE.Mesh(jarOuterGeo, jarMat);
    jar.position.y = -0.1;
    jar.castShadow = true;
    jar.receiveShadow = true;
    this.candleGroup.add(jar);

    // 2. Interior Wax Fill
    const waxGeo = new THREE.CylinderGeometry(0.62, 0.6, 0.95, 48);
    const waxMat = new THREE.MeshStandardMaterial({
      color: this.options.waxColor,
      roughness: 0.6,
      metalness: 0.05
    });
    const wax = new THREE.Mesh(waxGeo, waxMat);
    wax.position.y = -0.2;
    this.candleGroup.add(wax);

    // 3. Wax Melt Pool (Melted Top Rim)
    const poolGeo = new THREE.CircleGeometry(0.61, 48);
    const poolMat = new THREE.MeshStandardMaterial({
      color: 0xEAD8C2,
      roughness: 0.1,
      metalness: 0.1
    });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.28;
    this.candleGroup.add(pool);

    // 4. Gold Emblem / Label Plate
    const labelGeo = new THREE.PlaneGeometry(0.55, 0.4);
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.85,
      roughness: 0.25
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(0, -0.1, 0.685);
    this.candleGroup.add(label);
  }

  buildBubbleCandle() {
    // 3x3x3 Sculptural Bubble Candle
    const bubbleGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const waxMat = new THREE.MeshStandardMaterial({
      color: this.options.waxColor,
      roughness: 0.5,
      metalness: 0.05
    });

    const spacing = 0.38;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const sphere = new THREE.Mesh(bubbleGeo, waxMat);
          sphere.position.set(x * spacing, y * spacing - 0.1, z * spacing);
          sphere.castShadow = true;
          this.candleGroup.add(sphere);
        }
      }
    }
  }

  buildRibbedCandle() {
    // Sculptural Fluted Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.48, 0.5, 1.35, 24);
    const waxMat = new THREE.MeshStandardMaterial({
      color: this.options.waxColor,
      roughness: 0.55,
      metalness: 0.05,
      flatShading: true
    });
    const pillar = new THREE.Mesh(pillarGeo, waxMat);
    pillar.position.y = -0.05;
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    this.candleGroup.add(pillar);
  }

  buildWickAndFlame() {
    // 1. Braided Wick
    const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.16, 12);
    const wickMat = new THREE.MeshStandardMaterial({ color: 0x1A1412, roughness: 0.9 });
    const wick = new THREE.Mesh(wickGeo, wickMat);
    const wickY = this.options.candleType === 'bubble' ? 0.45 : (this.options.candleType === 'ribbed' ? 0.65 : 0.36);
    wick.position.set(0, wickY, 0);
    this.candleGroup.add(wick);

    // 2. Animated Flame Teardrop
    const flameGeo = new THREE.ConeGeometry(0.065, 0.22, 16);
    flameGeo.translate(0, 0.11, 0);

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xFF9E2C,
      transparent: true,
      opacity: 0.92
    });
    this.flameMesh = new THREE.Mesh(flameGeo, flameMat);
    this.flameMesh.position.set(0, wickY + 0.07, 0);
    this.candleGroup.add(this.flameMesh);

    // 3. Inner Core Flame
    const innerFlameGeo = new THREE.ConeGeometry(0.035, 0.12, 12);
    innerFlameGeo.translate(0, 0.06, 0);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xFFFBE6,
      transparent: true,
      opacity: 0.95
    });
    this.innerFlameMesh = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    this.innerFlameMesh.position.set(0, wickY + 0.07, 0);
    this.candleGroup.add(this.innerFlameMesh);

    // 4. Soft Aura Glow Sprite
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 175, 55, 0.9)');
    grad.addColorStop(0.3, 'rgba(255, 130, 20, 0.4)');
    grad.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const auraTexture = new THREE.CanvasTexture(canvas);
    const auraMat = new THREE.SpriteMaterial({
      map: auraTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.8
    });
    this.auraSprite = new THREE.Sprite(auraMat);
    this.auraSprite.scale.set(0.65, 0.65, 0.65);
    this.auraSprite.position.set(0, wickY + 0.12, 0);
    this.candleGroup.add(this.auraSprite);

    this.flameLight.position.set(0, wickY + 0.15, 0);
    this.updateFlameVisibility();
  }

  updateFlameVisibility() {
    const show = this.isFlameOn;
    if (this.flameMesh) this.flameMesh.visible = show;
    if (this.innerFlameMesh) this.innerFlameMesh.visible = show;
    if (this.auraSprite) this.auraSprite.visible = show;
    if (this.flameLight) this.flameLight.intensity = show ? 2.2 : 0;
  }

  toggleFlame() {
    this.isFlameOn = !this.isFlameOn;
    this.updateFlameVisibility();
    return this.isFlameOn;
  }

  setWaxColor(hex) {
    this.options.waxColor = hex;
    this.buildCandleModel();
  }

  setCandleType(type) {
    this.options.candleType = type;
    this.buildCandleModel();
  }

  setupInteraction() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      this.candleGroup.rotation.y += deltaX * 0.008;
      this.candleGroup.rotation.x += deltaY * 0.004;

      // Restrict vertical tilt
      this.candleGroup.rotation.x = Math.max(-0.25, Math.min(0.45, this.candleGroup.rotation.x));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    this.container.addEventListener('mousedown', onPointerDown);
    this.container.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    this.container.addEventListener('touchstart', onPointerDown, { passive: true });
    this.container.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  onResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Auto rotate gently
    if (this.options.autoRotate) {
      this.candleGroup.rotation.y += 0.005;
    }

    // Flame flicker simulation
    if (this.isFlameOn && this.flameMesh) {
      const flicker1 = Math.sin(elapsedTime * 14) * 0.04;
      const flicker2 = Math.cos(elapsedTime * 22) * 0.03;
      const flicker3 = Math.sin(elapsedTime * 35) * 0.02;

      this.flameMesh.scale.x = 1 + flicker1;
      this.flameMesh.scale.y = 1 + flicker2 * 1.5;
      this.flameMesh.scale.z = 1 + flicker1;
      this.flameMesh.rotation.z = Math.sin(elapsedTime * 8) * 0.06;

      if (this.auraSprite) {
        this.auraSprite.scale.set(0.65 + flicker3, 0.65 + flicker3, 1);
      }

      if (this.flameLight) {
        this.flameLight.intensity = 2.0 + Math.sin(elapsedTime * 18) * 0.4 + (Math.random() - 0.5) * 0.15;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Global Export
window.CandleShowcase = CandleShowcase;
