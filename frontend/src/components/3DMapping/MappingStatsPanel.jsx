import React from 'react';
import { Radio, ShieldCheck, Activity, Cpu, Disc3, Layers, Compass, Zap } from 'lucide-react';

export default function MappingStatsPanel({
  scannerId = 'LIDAR-CORE-01',
  mappingMode = 'Real-time 3D SLAM',
  sensorHealth = 'Optimal',
  connectionStatus = 'ONLINE',
  surfaceArea = '1,420 m²',
  waypointCount = 38,
  mineSector = 'Sector 7 - Shaft Bravo',
  subsurfaceDepth = '342.5 m',
}) {
  return (
    <div className="bg-white rounded-2xl p-4 transition-all duration-300 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-sky-50 text-blue-600 border border-blue-200">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 tracking-wide">
            Mapping & Sensor Link
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Active SLAM
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-3 text-xs">
        {/* Scanner ID */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            Scanner Unit
          </span>
          <p className="font-mono-hud font-bold text-slate-900 mt-1">
            {scannerId}
          </p>
        </div>

        {/* Mapping Mode */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            Mapping Mode
          </span>
          <p className="font-mono-hud font-bold text-slate-900 mt-1">
            {mappingMode}
          </p>
        </div>

        {/* Connection Link */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            Connection Link
          </span>
          <p className="font-mono-hud font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {connectionStatus}
          </p>
        </div>

        {/* Sensor Health */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Optics & Sensor
          </span>
          <p className="font-mono-hud font-bold text-emerald-700 mt-1">
            {sensorHealth}
          </p>
        </div>

        {/* Subsurface Depth */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            Mine Depth
          </span>
          <p className="font-mono-hud font-bold text-slate-900 mt-1">
            {subsurfaceDepth}
          </p>
        </div>

        {/* Mapped Area */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Mapped Area
          </span>
          <p className="font-mono-hud font-bold text-slate-900 mt-1">
            {surfaceArea}
          </p>
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">Current Zone</span>
        <span className="font-bold text-amber-800 font-mono-hud">{mineSector}</span>
      </div>
    </div>
  );
}
