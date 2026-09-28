import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import CompassOverlay from './CompassOverlay';
import { useTheme } from '../../context/ThemeContext';
import PageViewNotificationBell from '../common/PageViewNotificationBell';
import {
  Camera,
  RotateCcw,
  Box,
  Radio,
  Flame,
  Maximize2,
  Minimize2,
  Video,
  CircleDot,
  User,
  AlertTriangle,
  Car,
  Package,
  CheckCircle2,
  Scan,
  Crosshair,
  ZoomIn,
  Play,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';

export default function Main3DView() {
  const { isDark } = useTheme();
  const [activeCam, setActiveCam] = useState('front'); // 'front', 'left', 'right', 'rear'
  const [streamMode, setStreamMode] = useState('live'); // 'live', '3d', 'thermal'
  const [isRecording, setIsRecording] = useState(false);
  const [isMainFullscreen, setIsMainFullscreen] = useState(false);
  const [heading, setHeading] = useState(48);

  // 3D Canvas Refs for the Top-Right 3D Camera View
  const miniCanvasRef = useRef(null);
  const mainCanvasRef = useRef(null);

  // Initialize Main 3D Mine Tunnel Viewport (Left Big Screen)
  useEffect(() => {
    const container = mainCanvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const bgColor = isDark ? 0x070a14 : 0xf1f5f9;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.012);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, -4);
    camera.lookAt(0, 1.0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Grid Floor
    const grid = new THREE.GridHelper(60, 30, isDark ? 0x6366f1 : 0x0284c7, isDark ? 0x1e1b4b : 0xcbd5e1);
    grid.position.y = -1.2;
    scene.add(grid);

    // Tunnel Point Cloud
    const numPoints = 14000;
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);

    const safeColor = new THREE.Color(0x0284c7); // Cyan floor
    const hazardColor = new THREE.Color(0xe11d48); // Red
    const rockColor = isDark ? new THREE.Color(0xfbbf24) : new THREE.Color(0xf59e0b); // Amber quartz rock

    for (let i = 0; i < numPoints; i++) {
      const z = Math.random() * 45 - 3;
      const angle = Math.random() * Math.PI * 2;
      const r = 3.2 + Math.sin(z * 0.4) * 0.5 + (Math.random() - 0.5) * 0.3;

      let x = Math.cos(angle) * (r * 1.3);
      let y = Math.sin(angle) * (r * 0.9);

      if (y < -1.1) y = -1.2 + (Math.random() - 0.5) * 0.1;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      let c = y < -1.0 ? safeColor : rockColor;
      if (z > 7 && z < 10 && x > 0.5 && x < 1.8 && y < -0.4) {
        c = hazardColor;
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });
    const pointCloud = new THREE.Points(geo, mat);
    scene.add(pointCloud);

    // Laser Ray Cone
    const ringGeo = new THREE.RingGeometry(0.3, 8.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, -0.3, 0);
    scene.add(ring);

    // Mouse Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let theta = 0;
    let phi = 1.3;
    let radius = 14;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

      theta -= dx * 0.008;
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi - dy * 0.008));

      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta) + 10;
      camera.lookAt(0, 1.0, 10);

      let deg = Math.round((theta * 180 / Math.PI) % 360);
      if (deg < 0) deg += 360;
      setHeading(deg);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const scale = 0.5 + ((t * 1.5) % 3) * 0.8;
      ring.scale.set(scale, scale, scale);
      ring.material.opacity = Math.max(0, 0.5 - (scale / 3) * 0.5);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isDark]);

  // Initialize Top-Right Mini 3D Point Cloud View
  useEffect(() => {
    const container = miniCanvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x050911 : 0xf1f5f9);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 4, -12);
    camera.lookAt(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Mini Point Cloud
    const count = 6000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const green = new THREE.Color(0x10b981);
    const red = new THREE.Color(0xef4444);
    const cyan = isDark ? new THREE.Color(0x06b6d4) : new THREE.Color(0x0284c7);

    for (let i = 0; i < count; i++) {
      const z = Math.random() * 25 - 2;
      const angle = Math.random() * Math.PI * 2;
      const r = 2.4 + Math.sin(z * 0.5) * 0.4 + (Math.random() - 0.5) * 0.2;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * (r * 0.7);
      pos[i * 3 + 2] = z;

      let c = pos[i * 3 + 1] < -0.8 ? green : cyan;
      if (z > 5 && z < 7 && pos[i * 3] > 0.4) c = red;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({ size: 0.07, vertexColors: true });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      points.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div className="space-y-3">
      {/* Top Camera & Stream Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:px-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white shadow-md shadow-blue-500/20">
        {/* Camera Selectors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCam('front')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeCam === 'front'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Front Camera
          </button>

          <button
            type="button"
            onClick={() => setActiveCam('left')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeCam === 'left'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Left Camera
          </button>

          <button
            type="button"
            onClick={() => setActiveCam('right')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeCam === 'right'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 scale-x-[-1]" />
            Right Camera
          </button>

          <button
            type="button"
            onClick={() => setActiveCam('rear')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeCam === 'rear'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            Rear Camera
          </button>
        </div>

        {/* Stream Modes & Fullscreen */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setStreamMode('live')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              streamMode === 'live'
                ? 'bg-rose-500 text-white font-bold shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <CircleDot className="w-3 h-3 text-white animate-pulse" />
            Live Stream
          </button>

          <button
            type="button"
            onClick={() => setStreamMode('3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              streamMode === '3d'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            3D View
          </button>

          <button
            type="button"
            onClick={() => setStreamMode('thermal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              streamMode === 'thermal'
                ? 'bg-amber-400 text-slate-900 font-bold shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Thermal View
          </button>

          <button
            type="button"
            onClick={() => setIsMainFullscreen(!isMainFullscreen)}
            className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer"
          >
            {isMainFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <PageViewNotificationBell pageId="3d_mapping" pageTitle="3D Spatial Mapping" />
        </div>
      </div>

      {/* Main Upper Grid: Big 3D Mapping Screen (Left) + Right Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Main 3D Mapping & Camera Feed (7 or 8 Cols) */}
        <div
          className={`lg:col-span-7 xl:col-span-8 flex flex-col relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-md ${
            isMainFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95' : 'h-[380px] sm:h-[440px]'
          }`}
        >
          {/* 3D WebGL Canvas for 3D Mapping */}
          <div ref={mainCanvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Top-Left: LIVE Status Banner */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-mono-hud text-slate-800 z-10 pointer-events-none shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <span className="font-bold text-rose-600">LIVE</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700 uppercase font-semibold">CAM-01 ({activeCam})</span>
          </div>

          {/* Bottom-Left Compass */}
          <div className="absolute bottom-4 left-4 z-10">
            <CompassOverlay heading={heading} />
          </div>

          {/* Bottom-Right Quick Action Icons (Snapshot, Record, Fullscreen) */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              title="Capture Snapshot"
              className="p-2 rounded-xl bg-white/95 hover:bg-white border border-slate-200 text-slate-700 hover:text-blue-600 backdrop-blur-md shadow-xs transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
              className={`p-2 rounded-xl border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                  : 'bg-white/95 hover:bg-white border-slate-200 text-slate-700 hover:text-rose-600'
              }`}
            >
              <CircleDot className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsMainFullscreen(!isMainFullscreen)}
              title="Expand Viewport"
              className="p-2 rounded-xl bg-white/95 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-950 backdrop-blur-md shadow-xs transition-all cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: 3D Camera View & Statistics Panels (5 or 4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-3">
          {/* Top-Right: 3D Camera View (Point Cloud) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5 font-tech uppercase tracking-wider">
                3D Camera View
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                Real-time
              </span>
            </div>

            {/* Mini 3D Point Cloud Viewport */}
            <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <div ref={miniCanvasRef} className="w-full h-full" />

              {/* Right Side 3D HUD Tool Icons */}
              <div className="absolute right-2 top-2 flex flex-col gap-1.5 z-10">
                <button type="button" className="p-1 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:text-blue-600 shadow-xs">
                  <Box className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:text-blue-600 shadow-xs">
                  <Scan className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:text-blue-600 shadow-xs">
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:text-blue-600 shadow-xs">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Point Cloud Legend */}
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-around text-[10px] font-bold bg-white/95 backdrop-blur-md py-1 px-2 rounded-lg border border-slate-200 shadow-xs">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Person
                </span>
                <span className="flex items-center gap-1 text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Hazard
                </span>
                <span className="flex items-center gap-1 text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Environment
                </span>
              </div>
            </div>
          </div>

          {/* Middle Right: 2 Cards Side-by-Side (Camera Statistics & Detection Summary) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Camera Statistics */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <div className="p-1.5 rounded-xl bg-sky-50 text-blue-600 border border-blue-200">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="font-tech uppercase tracking-wider text-xs font-bold text-slate-900">
                  Camera Statistics
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Camera ID</span>
                  <span className="font-mono-hud font-bold text-slate-900 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                    CAM-01
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Connection</span>
                  <span className="font-mono-hud font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Stream Status</span>
                  <span className="font-mono-hud font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Detection Summary (YOLO) */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="font-tech uppercase tracking-wider text-xs font-bold text-slate-900">
                    Detection Summary
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="flex items-center gap-2 font-bold text-emerald-950">
                    <User className="w-3.5 h-3.5 text-emerald-700" /> Persons
                  </span>
                  <span className="font-mono-hud font-extrabold text-white bg-emerald-600 px-2 py-0.5 rounded-md text-xs shadow-xs">
                    2
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="flex items-center gap-2 font-bold text-rose-950">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-700" /> Hazards/Debris
                  </span>
                  <span className="font-mono-hud font-extrabold text-white bg-rose-600 px-2 py-0.5 rounded-md text-xs shadow-xs">
                    1
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-sky-50 border border-blue-200">
                  <span className="flex items-center gap-2 font-bold text-blue-950">
                    <Car className="w-3.5 h-3.5 text-blue-700" /> Vehicles
                  </span>
                  <span className="font-mono-hud font-extrabold text-white bg-blue-600 px-2 py-0.5 rounded-md text-xs shadow-xs">
                    0
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="flex items-center gap-2 font-bold text-amber-950">
                    <Package className="w-3.5 h-3.5 text-amber-700" /> Other Objects
                  </span>
                  <span className="font-mono-hud font-extrabold text-white bg-amber-600 px-2 py-0.5 rounded-md text-xs shadow-xs">
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Detection History + Person Tracking + Latest Detections Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Bottom Left: Detection History (Recent) (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 font-tech uppercase tracking-wider">
                Detection History (Recent)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {/* Snapshot 1 */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:border-emerald-400 transition-all">
              <div className="h-16 bg-slate-50 flex items-center justify-center p-1.5 border-b border-slate-100">
                <span className="text-[10px] font-mono-hud text-emerald-800 font-bold border border-emerald-300 px-1.5 py-0.5 rounded-md bg-emerald-50">
                  person 0.92
                </span>
              </div>
              <div className="p-1.5 bg-slate-50 text-[10px] font-mono-hud text-slate-800 font-bold flex items-center justify-between">
                <span>14:32:10</span>
                <Play className="w-3 h-3 text-emerald-600" />
              </div>
            </div>

            {/* Snapshot 2 */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:border-emerald-400 transition-all">
              <div className="h-16 bg-slate-50 flex items-center justify-center p-1.5 border-b border-slate-100">
                <span className="text-[10px] font-mono-hud text-emerald-800 font-bold border border-emerald-300 px-1.5 py-0.5 rounded-md bg-emerald-50">
                  person 0.87
                </span>
              </div>
              <div className="p-1.5 bg-slate-50 text-[10px] font-mono-hud text-slate-800 font-bold flex items-center justify-between">
                <span>14:31:58</span>
                <Play className="w-3 h-3 text-emerald-600" />
              </div>
            </div>

            {/* Snapshot 3 */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:border-rose-400 transition-all">
              <div className="h-16 bg-slate-50 flex items-center justify-center p-1.5 border-b border-slate-100">
                <span className="text-[10px] font-mono-hud text-rose-800 font-bold border border-rose-300 px-1.5 py-0.5 rounded-md bg-rose-50">
                  rock 0.76
                </span>
              </div>
              <div className="p-1.5 bg-slate-50 text-[10px] font-mono-hud text-slate-800 font-bold flex items-center justify-between">
                <span>14:31:45</span>
                <Play className="w-3 h-3 text-rose-600" />
              </div>
            </div>

            {/* Snapshot 4 */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:border-amber-400 transition-all">
              <div className="h-16 bg-slate-50 flex items-center justify-center p-1.5 border-b border-slate-100 text-slate-600 text-[10px] font-medium">
                no detection
              </div>
              <div className="p-1.5 bg-slate-50 text-[10px] font-mono-hud text-slate-700 font-semibold flex items-center justify-between">
                <span>14:31:30</span>
                <Play className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Middle: Person Tracking (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-sky-50 text-blue-600 border border-blue-200">
                <User className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 font-tech uppercase tracking-wider">
                Person Tracking
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Tracking Active
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs text-slate-600 font-semibold flex justify-between items-center">
              <span>Total Persons Detected</span>
              <span className="font-bold font-mono-hud text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200 text-xs">
                2
              </span>
            </div>

            {/* Person #1 Card */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-3 shadow-xs hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5 min-w-0 flex-1">
                <div className="font-bold text-slate-900">Person #1</div>
                <div className="text-slate-600 font-mono-hud text-[11px]">
                  Track ID: <span className="font-bold text-slate-900">17</span> | Conf: <span className="font-bold text-emerald-700">0.92</span>
                </div>
                <div className="text-slate-500 font-mono-hud text-[10px]">
                  Last Seen: <span className="font-semibold text-slate-800">14:32:10</span>
                </div>
              </div>
            </div>

            {/* Person #2 Card */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-3 shadow-xs hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5 min-w-0 flex-1">
                <div className="font-bold text-slate-900">Person #2</div>
                <div className="text-slate-600 font-mono-hud text-[11px]">
                  Track ID: <span className="font-bold text-slate-900">21</span> | Conf: <span className="font-bold text-emerald-700">0.87</span>
                </div>
                <div className="text-slate-500 font-mono-hud text-[10px]">
                  Last Seen: <span className="font-semibold text-slate-800">14:31:58</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right: Latest Detections Table (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 font-tech uppercase tracking-wider">
                Latest Detections
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono-hud">
              <thead className="text-slate-700 border-b border-slate-200 pb-1 font-bold">
                <tr>
                  <th className="py-1 px-1.5">Time</th>
                  <th className="py-1 px-1.5">Class</th>
                  <th className="py-1 px-1.5">Confidence</th>
                  <th className="py-1 px-1.5">Track ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-1.5 text-slate-700 font-semibold">14:32:10</td>
                  <td className="py-2 px-1.5 text-emerald-700 font-bold uppercase">person</td>
                  <td className="py-2 px-1.5 text-slate-900 font-bold">0.92</td>
                  <td className="py-2 px-1.5 text-slate-900 font-bold">17</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-1.5 text-slate-700 font-semibold">14:31:58</td>
                  <td className="py-2 px-1.5 text-emerald-700 font-bold uppercase">person</td>
                  <td className="py-2 px-1.5 text-slate-900 font-bold">0.87</td>
                  <td className="py-2 px-1.5 text-slate-900 font-bold">21</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-1.5 text-slate-700 font-semibold">14:31:45</td>
                  <td className="py-2 px-1.5 text-rose-700 font-bold uppercase">rock</td>
                  <td className="py-2 px-1.5 text-rose-700 font-bold">0.76</td>
                  <td className="py-2 px-1.5 text-slate-500">-</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-1.5 text-slate-700 font-semibold">14:31:30</td>
                  <td className="py-2 px-1.5 text-slate-500 font-medium uppercase">none</td>
                  <td className="py-2 px-1.5 text-slate-400">-</td>
                  <td className="py-2 px-1.5 text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


