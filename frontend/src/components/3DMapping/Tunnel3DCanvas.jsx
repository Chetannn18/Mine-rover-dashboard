import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export default function Tunnel3DCanvas({
  viewMode = 'live', // 'live', 'pointcloud', 'wireframe', 'thermal'
  cameraPreset = 'front', // 'front', 'left', 'right', 'rear', 'iso', 'topdown', 'thermal'
  visibleLayers = { safe: true, hazard: true, structure: true, trajectory: true, grid: true },
  onHeadingChange,
}) {
  const mountRef = useRef(null);
  const { isDark } = useTheme();
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef({ isDragging: false, prevMouse: { x: 0, y: 0 }, spherical: { radius: 18, theta: 0.1, phi: 1.2 }, target: new THREE.Vector3(0, 0, 10) });
  const pointsRef = useRef(null);
  const scanRingRef = useRef(null);
  const rayGroupRef = useRef(null);
  const roverMarkerRef = useRef(null);
  const gridHelperRef = useRef(null);
  const tunnelMeshRef = useRef(null);
  const trajectoryLineRef = useRef(null);

  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const bgColor = isDark ? 0x070a14 : 0xf1f5f9;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.012);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 2.5, -4);
    camera.lookAt(0, 1.2, 12);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(isDark ? 0x2e1065 : 0x94a3b8, 1.5);
    scene.add(ambientLight);

    const roverHeadlight = new THREE.SpotLight(0xa855f7, 9, 50, Math.PI / 3.2, 0.4);
    roverHeadlight.position.set(0, 1.2, 0);
    roverHeadlight.target.position.set(0, 0, 20);
    scene.add(roverHeadlight);
    scene.add(roverHeadlight.target);

    // 5. Grid Helper
    const grid = new THREE.GridHelper(80, 40, isDark ? 0xa855f7 : 0x0284c7, isDark ? 0x1e1b4b : 0xcbd5e1);
    grid.position.y = -1.2;
    gridHelperRef.current = grid;
    if (visibleLayers.grid) scene.add(grid);

    // 6. Generate Procedural Mine Tunnel Point Cloud
    const numPoints = 18000;
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);

    const safeColor = isDark ? new THREE.Color(0x06b6d4) : new THREE.Color(0x059669); // Emerald / Cyan floor
    const hazardColor = new THREE.Color(0xe11d48); // Crimson hazard
    const rockWallColor = isDark ? new THREE.Color(0xfbbf24) : new THREE.Color(0xf59e0b); // Amber quartz rock walls
    const ceilingColor = isDark ? new THREE.Color(0xec4899) : new THREE.Color(0xf43f5e); // Rose ceiling

    let idx = 0;
    // Tunnel points
    for (let i = 0; i < numPoints * 0.85; i++) {
      const z = (Math.random() * 50) - 5; // Along tunnel length
      const angle = Math.random() * Math.PI * 2;
      const radiusVariation = Math.sin(z * 0.4) * 0.5 + Math.cos(angle * 3) * 0.4 + (Math.random() - 0.5) * 0.3;
      const r = 3.2 + radiusVariation;

      let x = Math.cos(angle) * (r * 1.3);
      let y = Math.sin(angle) * (r * 0.9);

      // Flatten floor
      if (y < -1.1) {
        y = -1.2 + (Math.random() - 0.5) * 0.15;
      }

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      // Color mapping
      let pColor;
      if (y < -1.0) {
        // Floor / safe path
        pColor = safeColor;
      } else if (y > 2.0) {
        // Ceiling
        pColor = ceilingColor;
      } else {
        // Tunnel walls
        pColor = rockWallColor;
      }

      colors[idx * 3] = pColor.r;
      colors[idx * 3 + 1] = pColor.g;
      colors[idx * 3 + 2] = pColor.b;
      idx++;
    }

    // Hazard clusters (rock falls / obstacles in tunnel)
    const hazardClusters = [
      { x: 1.2, y: -0.9, z: 8.5, radius: 0.8 },
      { x: -1.5, y: -0.8, z: 16.0, radius: 1.1 },
      { x: 0.6, y: -0.7, z: 24.5, radius: 0.9 },
      { x: -0.8, y: -0.8, z: 34.0, radius: 1.2 },
    ];

    hazardClusters.forEach((cluster) => {
      const clusterPoints = 350;
      for (let j = 0; j < clusterPoints; j++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * cluster.radius;

        const x = cluster.x + r * Math.sin(phi) * Math.cos(theta);
        const y = cluster.y + r * Math.sin(phi) * Math.sin(theta) * 0.7;
        const z = cluster.z + r * Math.cos(phi);

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        colors[idx * 3] = hazardColor.r;
        colors[idx * 3 + 1] = hazardColor.g;
        colors[idx * 3 + 2] = hazardColor.b;
        idx++;
      }
    });

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const pointCloud = new THREE.Points(pointGeometry, pointMaterial);
    pointsRef.current = pointCloud;
    scene.add(pointCloud);

    // 7. Wireframe Tunnel Tube Outline
    const tunnelPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0.5, 0.2, 5),
      new THREE.Vector3(-0.8, -0.1, 18),
      new THREE.Vector3(1.0, 0.3, 32),
      new THREE.Vector3(0, 0, 48),
    ]);
    const tubeGeo = new THREE.TubeGeometry(tunnelPath, 40, 3.5, 12, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xa855f7 : 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const tunnelMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tunnelMeshRef.current = tunnelMesh;
    scene.add(tunnelMesh);

    // 8. Rover Mesh Marker (Modern High-Tech Rover Representation)
    const roverGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.45, 1.8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x18182b : 0x334155,
      metalness: 0.9,
      roughness: 0.2,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = -0.7;
    roverGroup.add(bodyMesh);

    // LiDAR Dome on Rover
    const lidarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 16);
    const lidarMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xec4899, emissiveIntensity: 0.8 });
    const lidarMesh = new THREE.Mesh(lidarGeo, lidarMat);
    lidarMesh.position.set(0, -0.35, 0.2);
    roverGroup.add(lidarMesh);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
    const wheelPositions = [
      [-0.7, -0.85, 0.6],
      [0.7, -0.85, 0.6],
      [-0.7, -0.85, -0.6],
      [0.7, -0.85, -0.6],
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      roverGroup.add(wheel);
    });

    roverMarkerRef.current = roverGroup;
    scene.add(roverGroup);

    // 9. Trajectory Path
    const trajPoints = [
      new THREE.Vector3(0, -1.15, -8),
      new THREE.Vector3(0.1, -1.15, -4),
      new THREE.Vector3(-0.2, -1.15, -1),
      new THREE.Vector3(0, -1.15, 0),
    ];
    const trajGeo = new THREE.BufferGeometry().setFromPoints(trajPoints);
    const trajMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
    const trajectoryLine = new THREE.Line(trajGeo, trajMat);
    trajectoryLineRef.current = trajectoryLine;
    if (visibleLayers.trajectory) scene.add(trajectoryLine);

    // 10. LiDAR Radial Scanning Sweep Ring
    const ringGeo = new THREE.RingGeometry(0.5, 9.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const scanRing = new THREE.Mesh(ringGeo, ringMat);
    scanRing.rotation.x = Math.PI / 2;
    scanRing.position.set(0, -0.3, 0);
    scanRingRef.current = scanRing;
    scene.add(scanRing);

    // 11. LiDAR Laser Beam Rays
    const rayGroup = new THREE.Group();
    const numRays = 16;
    for (let r = 0; r < numRays; r++) {
      const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -0.3, 0),
        new THREE.Vector3(
          Math.cos((r / numRays) * Math.PI * 2) * 8,
          (Math.random() - 0.4) * 2,
          Math.sin((r / numRays) * Math.PI * 2) * 8
        ),
      ]);
      const rayMat = new THREE.LineBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.35,
      });
      const ray = new THREE.Line(rayGeo, rayMat);
      rayGroup.add(ray);
    }
    rayGroupRef.current = rayGroup;
    scene.add(rayGroup);

    // Mouse drag interaction
    const handleMouseDown = (e) => {
      controlsRef.current.isDragging = true;
      controlsRef.current.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!controlsRef.current.isDragging) return;
      const deltaX = e.clientX - controlsRef.current.prevMouse.x;
      const deltaY = e.clientY - controlsRef.current.prevMouse.y;
      controlsRef.current.prevMouse = { x: e.clientX, y: e.clientY };

      const ctrl = controlsRef.current;
      ctrl.spherical.theta -= deltaX * 0.008;
      ctrl.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, ctrl.spherical.phi - deltaY * 0.008));

      // Calculate new camera position
      const sinPhiRadius = Math.sin(ctrl.spherical.phi) * ctrl.spherical.radius;
      camera.position.x = ctrl.target.x + sinPhiRadius * Math.sin(ctrl.spherical.theta);
      camera.position.y = ctrl.target.y + Math.cos(ctrl.spherical.phi) * ctrl.spherical.radius;
      camera.position.z = ctrl.target.z + sinPhiRadius * Math.cos(ctrl.spherical.theta);
      camera.lookAt(ctrl.target);

      // Report heading in degrees
      if (onHeadingChange) {
        let deg = Math.round((ctrl.spherical.theta * 180 / Math.PI) % 360);
        if (deg < 0) deg += 360;
        onHeadingChange(deg);
      }
    };

    const handleMouseUp = () => {
      controlsRef.current.isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const ctrl = controlsRef.current;
      ctrl.spherical.radius = Math.max(3, Math.min(45, ctrl.spherical.radius + e.deltaY * 0.02));
      const sinPhiRadius = Math.sin(ctrl.spherical.phi) * ctrl.spherical.radius;
      camera.position.x = ctrl.target.x + sinPhiRadius * Math.sin(ctrl.spherical.theta);
      camera.position.y = ctrl.target.y + Math.cos(ctrl.spherical.phi) * ctrl.spherical.radius;
      camera.position.z = ctrl.target.z + sinPhiRadius * Math.cos(ctrl.spherical.theta);
      camera.lookAt(ctrl.target);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate LiDAR sweep ring
      if (scanRingRef.current) {
        const scale = 0.5 + (elapsedTime * 1.5 % 3) * 0.8;
        scanRingRef.current.scale.set(scale, scale, scale);
        scanRingRef.current.material.opacity = Math.max(0, 0.6 - (scale / 3.0) * 0.6);
      }

      // Rotate LiDAR ray beams
      if (rayGroupRef.current) {
        rayGroupRef.current.rotation.y = elapsedTime * 2.0;
      }

      // Rover gentle idle bounce
      if (roverMarkerRef.current) {
        roverMarkerRef.current.position.y = Math.sin(elapsedTime * 2) * 0.02;
      }

      // Progress tracker
      setScanProgress(Math.floor((elapsedTime * 10) % 100));

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [isDark]);

  // Update camera based on presets
  useEffect(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    const ctrl = controlsRef.current;

    switch (cameraPreset) {
      case 'front':
        ctrl.target.set(0, 0, 10);
        camera.position.set(0, 1.8, -3.5);
        ctrl.spherical = { radius: 14, theta: 0.05, phi: 1.3 };
        break;
      case 'left':
        ctrl.target.set(0, 0, 8);
        camera.position.set(-10, 2.0, 8);
        ctrl.spherical = { radius: 12, theta: Math.PI / 2, phi: 1.2 };
        break;
      case 'right':
        ctrl.target.set(0, 0, 8);
        camera.position.set(10, 2.0, 8);
        ctrl.spherical = { radius: 12, theta: -Math.PI / 2, phi: 1.2 };
        break;
      case 'rear':
        ctrl.target.set(0, 0, -4);
        camera.position.set(0, 2.0, 15);
        ctrl.spherical = { radius: 15, theta: Math.PI, phi: 1.3 };
        break;
      case 'iso':
        ctrl.target.set(0, 0, 10);
        camera.position.set(12, 10, -2);
        ctrl.spherical = { radius: 18, theta: 0.8, phi: 0.8 };
        break;
      case 'topdown':
        ctrl.target.set(0, 0, 12);
        camera.position.set(0, 25, 12);
        ctrl.spherical = { radius: 25, theta: 0, phi: 0.05 };
        break;
      case 'thermal':
        ctrl.target.set(0, 0, 8);
        camera.position.set(4, 3, -1);
        ctrl.spherical = { radius: 12, theta: 0.4, phi: 1.1 };
        break;
      default:
        break;
    }
    camera.lookAt(ctrl.target);
  }, [cameraPreset]);

  // Update theme colors
  useEffect(() => {
    if (sceneRef.current) {
      const bgColor = isDark ? 0x050911 : 0xf1f5f9;
      sceneRef.current.background = new THREE.Color(bgColor);
      sceneRef.current.fog = new THREE.FogExp2(bgColor, 0.015);
    }
  }, [isDark]);

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-xl overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
