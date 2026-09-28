import React, { useState } from 'react';
import Tunnel3DCanvas from './Tunnel3DCanvas';
import CompassOverlay from './CompassOverlay';
import MappingStatsPanel from './MappingStatsPanel';
import HazardSpatialPanel from './HazardSpatialPanel';
import EnvironmentalQuickBar from './EnvironmentalQuickBar';
import {
  Camera,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  Eye,
  Crosshair,
  RotateCcw,
  Sliders,
  Scan,
  Activity,
  Box,
  Compass,
  Download,
  Share2,
} from 'lucide-react';

export default function Mapping3DView() {
  const [cameraPreset, setCameraPreset] = useState('front');
  const [viewMode, setViewMode] = useState('live'); // 'live', 'pointcloud', 'wireframe', 'thermal'
  const [heading, setHeading] = useState(48);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState({
    safe: true,
    hazard: true,
    structure: true,
    trajectory: true,
    grid: true,
  });

  const [notification, setNotification] = useState('');

  const toggleLayer = (layerId) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  const handleSnapshot = () => {
    setNotification('Point cloud snapshot saved to mission logs');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleRecalibrate = () => {
    setNotification('SLAM odometry recalibrated to origin (0, 0, 0)');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          {notification}
        </div>
      )}

      {/* Main Grid: 3D Mapping Viewport & Right Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Center 3D LiDAR & Point Cloud Viewport (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {/* Top Camera & SLAM Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:px-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white shadow-md shadow-blue-500/20">
            {/* Camera Perspective Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setCameraPreset('front')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  cameraPreset === 'front'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Front Sensor
              </button>

              <button
                type="button"
                onClick={() => setCameraPreset('left')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  cameraPreset === 'left'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Left Mesh
              </button>

              <button
                type="button"
                onClick={() => setCameraPreset('right')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  cameraPreset === 'right'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 scale-x-[-1]" />
                Right Mesh
              </button>

              <button
                type="button"
                onClick={() => setCameraPreset('rear')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  cameraPreset === 'rear'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                Rear Sensor
              </button>
            </div>

            {/* View Modes & Action Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setViewMode('live');
                  setCameraPreset('front');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'live' && cameraPreset === 'front'
                    ? 'bg-rose-500 text-white font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Live LiDAR
              </button>

              <button
                type="button"
                onClick={() => setCameraPreset('iso')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  cameraPreset === 'iso'
                    ? 'bg-white text-blue-700 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <Scan className="w-3.5 h-3.5" />
                3D Isometric
              </button>

              <button
                type="button"
                onClick={() => setCameraPreset('thermal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  cameraPreset === 'thermal'
                    ? 'bg-amber-400 text-slate-900 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Density Mesh
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas Container */}
          <div
            className={`relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-md transition-all duration-300 ${
              isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95' : 'h-[500px] sm:h-[540px]'
            }`}
          >
            {/* Live Three.js Tunnel Viewport */}
            <Tunnel3DCanvas
              cameraPreset={cameraPreset}
              viewMode={viewMode}
              visibleLayers={visibleLayers}
              onHeadingChange={setHeading}
            />

            {/* Top-Left Live Banner Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-mono-hud text-emerald-700 z-10 pointer-events-none shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
              <span className="font-bold text-rose-600">LIVE</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-700 font-bold">SLAM-3D (LiDAR ACTIVE)</span>
            </div>

            {/* Top-Right Mini Control Buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              <button
                type="button"
                onClick={handleSnapshot}
                title="Save Point Cloud Snapshot"
                className="p-2 rounded-xl bg-white/95 hover:bg-white border border-slate-200 text-slate-700 hover:text-blue-600 backdrop-blur-md shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRecalibrate}
                title="Recalibrate SLAM Origin"
                className="p-2 rounded-xl bg-white/95 hover:bg-white border border-slate-200 text-slate-700 hover:text-blue-600 backdrop-blur-md shadow-xs transition-all cursor-pointer"
              >
                <Crosshair className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title="Toggle Fullscreen"
                className="p-2 rounded-xl bg-white/95 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-950 backdrop-blur-md shadow-xs transition-all cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom-Left Compass Rose Overlay */}
            <div className="absolute bottom-12 left-4 z-10">
              <CompassOverlay heading={heading} />
            </div>

            {/* Bottom-Right Coordinates & Sector Badge */}
            <div className="absolute bottom-12 right-4 flex flex-col items-end gap-1.5 z-10 pointer-events-none font-mono-hud text-[11px]">
              <div className="px-2.5 py-1 rounded-lg bg-white/95 border border-slate-200 text-blue-700 backdrop-blur-md shadow-xs font-bold">
                POS: X +14.2m | Y -3.8m | Z -342.5m
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-white/95 border border-slate-200 text-slate-700 backdrop-blur-md shadow-xs font-bold">
                SECTOR: SHAFT 4 - ALPHA DRIFT
              </div>
            </div>

            {/* Bottom Clean Status Strip */}
            <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs font-mono-hud text-slate-600 z-10 shadow-xs">
              <div className="flex items-center gap-4 truncate">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SLAM SYNCED
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="hidden sm:inline font-semibold">POINT DENSITY: 48.2k pts</span>
                <span className="text-slate-300 hidden md:inline">•</span>
                <span className="hidden md:inline font-semibold">FOV: 360° LiDAR</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-700 font-bold">ODOMETRY: 99.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns (4 Cols): Clean Panels */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Mapping & Sensor Link Panel */}
          <MappingStatsPanel
            scannerId="LIDAR-CORE-01"
            mappingMode="Real-time 3D SLAM"
            sensorHealth="Optimal"
            connectionStatus="ONLINE"
            surfaceArea="1,420 m²"
            subsurfaceDepth="342.5 m"
            mineSector="Sector 7 - Shaft Bravo"
          />

          {/* Spatial Point Cloud Layer Panel */}
          <HazardSpatialPanel
            visibleLayers={visibleLayers}
            onToggleLayer={toggleLayer}
          />
        </div>
      </div>

      {/* Bottom Environmental Telemetry Strip */}
      <EnvironmentalQuickBar />
    </div>
  );
}
