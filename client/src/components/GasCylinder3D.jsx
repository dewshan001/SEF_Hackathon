import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './GasCylinder3D.css';

export default function GasCylinder3D() {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene setup ──
    const scene = new THREE.Scene();
    const width = container.clientWidth || 340;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // ── Dynamic Cylinder Label Texture ──
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 512;
    const ctx = labelCanvas.getContext('2d');

    // Background gradient for label band
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, '#c0392b');
    grad.addColorStop(0.2, '#e85d1a');
    grad.addColorStop(0.5, '#f2752e');
    grad.addColorStop(0.8, '#e85d1a');
    grad.addColorStop(1, '#c0392b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Decorative top & bottom gold stripes
    ctx.fillStyle = '#f9cc1b';
    ctx.fillRect(0, 40, 1024, 12);
    ctx.fillRect(0, 460, 1024, 12);

    // Front & Back branding
    const drawBrand = (centerX) => {
      // Flame Icon
      ctx.fillStyle = '#f9cc1b';
      ctx.beginPath();
      ctx.moveTo(centerX, 120);
      ctx.bezierCurveTo(centerX - 25, 170, centerX - 40, 210, centerX, 240);
      ctx.bezierCurveTo(centerX + 40, 210, centerX + 25, 170, centerX, 120);
      ctx.fill();

      // Brand name
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 68px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.fillText('GasGo', centerX, 310);

      ctx.fillStyle = '#f9cc1b';
      ctx.font = '700 36px system-ui, -apple-system, sans-serif';
      ctx.shadowBlur = 8;
      ctx.fillText('LANKA', centerX, 360);

      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '600 24px monospace';
      ctx.fillText('LP GAS  •  12.5 KG', centerX, 410);
      ctx.font = '500 16px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('TESTED 3.0 MPa  |  SLS 1178', centerX, 438);
    };

    drawBrand(256);
    drawBrand(768);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.wrapS = THREE.RepeatWrapping;
    labelTexture.repeat.set(1, 1);

    // ── Materials ──
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xeb5e28,
      metalness: 0.15,
      roughness: 0.32,
      clearcoat: 0.65,
      clearcoatRoughness: 0.18,
      reflectivity: 0.9,
    });

    const labeledBodyMaterial = new THREE.MeshPhysicalMaterial({
      map: labelTexture,
      metalness: 0.18,
      roughness: 0.35,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });

    const collarMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe65100,
      metalness: 0.3,
      roughness: 0.38,
      clearcoat: 0.4,
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.22,
    });

    const valveKnobMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.35,
    });

    const metalRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3c,
      metalness: 0.85,
      roughness: 0.4,
    });

    const weldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd84315,
      metalness: 0.2,
      roughness: 0.45,
    });

    // ── Main Cylinder Group ──
    const cylinderGroup = new THREE.Group();

    // 1. Center Cylinder Body (with branded label)
    const bodyGeom = new THREE.CylinderGeometry(0.88, 0.88, 1.35, 64, 1, true);
    const bodyMesh = new THREE.Mesh(bodyGeom, labeledBodyMaterial);
    bodyMesh.position.y = 0;
    cylinderGroup.add(bodyMesh);

    // 2. Top Dome Cap
    const topDomeGeom = new THREE.SphereGeometry(0.88, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.48);
    const topDomeMesh = new THREE.Mesh(topDomeGeom, bodyMaterial);
    topDomeMesh.position.y = 0.675;
    cylinderGroup.add(topDomeMesh);

    // 3. Bottom Dome Cap
    const botDomeGeom = new THREE.SphereGeometry(0.88, 64, 32, 0, Math.PI * 2, Math.PI * 0.52, Math.PI * 0.48);
    const botDomeMesh = new THREE.Mesh(botDomeGeom, bodyMaterial);
    botDomeMesh.position.y = -0.675;
    cylinderGroup.add(botDomeMesh);

    // 4. Seam Welds (Circumferential rings)
    const upperWeldGeom = new THREE.TorusGeometry(0.885, 0.018, 16, 64);
    upperWeldGeom.rotateX(Math.PI / 2);
    const upperWeld = new THREE.Mesh(upperWeldGeom, weldMaterial);
    upperWeld.position.y = 0.675;
    cylinderGroup.add(upperWeld);

    const lowerWeldGeom = new THREE.TorusGeometry(0.885, 0.018, 16, 64);
    lowerWeldGeom.rotateX(Math.PI / 2);
    const lowerWeld = new THREE.Mesh(lowerWeldGeom, weldMaterial);
    lowerWeld.position.y = -0.675;
    cylinderGroup.add(lowerWeld);

    // 5. Foot Ring Stand (Bottom)
    const footRingGeom = new THREE.CylinderGeometry(0.78, 0.80, 0.28, 48, 1, true);
    const footRing = new THREE.Mesh(footRingGeom, metalRingMaterial);
    footRing.position.y = -1.18;
    cylinderGroup.add(footRing);

    // Foot Ring Base Rim
    const footRimGeom = new THREE.TorusGeometry(0.80, 0.02, 16, 48);
    footRimGeom.rotateX(Math.PI / 2);
    const footRim = new THREE.Mesh(footRimGeom, metalRingMaterial);
    footRim.position.y = -1.32;
    cylinderGroup.add(footRim);

    // 6. Valve Collar / Top Protective Handle Guard
    // Cylindrical collar with hand-grip openings
    const collarGeom = new THREE.CylinderGeometry(0.55, 0.62, 0.45, 48, 1, true);
    const collarMesh = new THREE.Mesh(collarGeom, collarMaterial);
    collarMesh.position.y = 1.38;
    cylinderGroup.add(collarMesh);

    // Collar top rolled rim (smooth protective lip)
    const collarRimGeom = new THREE.TorusGeometry(0.55, 0.026, 16, 48);
    collarRimGeom.rotateX(Math.PI / 2);
    const collarRim = new THREE.Mesh(collarRimGeom, collarMaterial);
    collarRim.position.y = 1.605;
    cylinderGroup.add(collarRim);

    // 7. Valve Mechanism (Center Brass Fitting)
    const valveGroup = new THREE.Group();
    valveGroup.position.y = 1.25;

    // Brass Neck / Boss
    const valveNeckGeom = new THREE.CylinderGeometry(0.12, 0.16, 0.22, 32);
    const valveNeck = new THREE.Mesh(valveNeckGeom, brassMaterial);
    valveGroup.add(valveNeck);

    // Valve Main Spindle Body
    const valveBodyGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.24, 24);
    const valveBody = new THREE.Mesh(valveBodyGeom, brassMaterial);
    valveBody.position.y = 0.18;
    valveGroup.add(valveBody);

    // Horizontal Outlet Nozzle
    const nozzleGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.18, 16);
    nozzleGeom.rotateZ(Math.PI / 2);
    const nozzle = new THREE.Mesh(nozzleGeom, brassMaterial);
    nozzle.position.set(0.12, 0.16, 0);
    valveGroup.add(nozzle);

    // Valve Handwheel / Shut-off Knob
    const knobGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16);
    const knob = new THREE.Mesh(knobGeom, valveKnobMaterial);
    knob.position.y = 0.32;
    valveGroup.add(knob);

    cylinderGroup.add(valveGroup);

    // Base Shadow disc beneath cylinder
    const shadowGeom = new THREE.CircleGeometry(1.2, 32);
    shadowGeom.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.38,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.position.y = -1.45;
    cylinderGroup.add(shadowMesh);

    cylinderGroup.position.set(0, -0.05, 0);
    cylinderGroup.rotation.y = 0.4;
    scene.add(cylinderGroup);

    // ── Lighting Setup ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Key Light (Warm Sunlight)
    const keyLight = new THREE.DirectionalLight(0xfff4e6, 3.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Fill Light (Cool Rim Light)
    const fillLight = new THREE.DirectionalLight(0x90caf9, 2.0);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    // Front Specular Accent Light
    const frontLight = new THREE.PointLight(0xffa726, 2.5, 12);
    frontLight.position.set(0, 1, 3.5);
    scene.add(frontLight);

    // Bottom Ambient Bounce
    const groundBounce = new THREE.PointLight(0xe85d1a, 1.8, 8);
    groundBounce.position.set(0, -2, 1);
    scene.add(groundBounce);

    // ── Interaction & Drag Rotation ──
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let rotSpeedX = 0;
    let rotSpeedY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      prevPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevPointerY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      rotSpeedX = 0;
      rotSpeedY = 0;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      if (isDragging) {
        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;
        cylinderGroup.rotation.y += deltaX * 0.012;
        cylinderGroup.rotation.x += deltaY * 0.008;

        // Clamp x rotation so cylinder doesn't flip upside down
        cylinderGroup.rotation.x = Math.max(-0.45, Math.min(0.45, cylinderGroup.rotation.x));

        rotSpeedX = deltaX * 0.012;
        rotSpeedY = deltaY * 0.008;

        prevPointerX = clientX;
        prevPointerY = clientY;
      } else {
        // Parallax cursor tilt when hovering
        const rect = container.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((clientY - rect.top) / rect.height - 0.5) * 2;
        targetTiltY = normX * 0.25;
        targetTiltX = -normY * 0.15;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // ── Animation Loop ──
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation
      cylinderGroup.position.y = -0.05 + Math.sin(elapsedTime * 1.6) * 0.06;

      if (isDragging) {
        // Controlled by direct drag
      } else {
        // Inertia damping
        rotSpeedX *= 0.94;
        rotSpeedY *= 0.94;
        cylinderGroup.rotation.y += rotSpeedX;
        cylinderGroup.rotation.x += rotSpeedY;

        // Auto slow idle spin if user is not actively dragging
        if (Math.abs(rotSpeedX) < 0.001) {
          cylinderGroup.rotation.y += 0.006;
        }

        // Return X tilt towards natural mouse tilt
        cylinderGroup.rotation.x += (targetTiltX - cylinderGroup.rotation.x) * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Responsive Resize ──
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 340;
      const newHeight = container.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      if (domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="gas-3d-stage">
      <div
        ref={containerRef}
        className={`gas-3d-canvas-container ${isInteracting ? 'is-interacting' : ''}`}
        title="Click & Drag to rotate in 3D"
        aria-label="Interactive 3D Gas Cylinder Model"
      />
      <div className="gas-3d-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        <span>Drag to rotate 3D</span>
      </div>
    </div>
  );
}
