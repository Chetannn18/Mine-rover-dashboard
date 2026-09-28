import React from 'react';
import { Layers, Eye, EyeOff, ShieldAlert, Sparkles, Mountain, Disc } from 'lucide-react';

export default function HazardSpatialPanel({ visibleLayers, onToggleLayer }) {
  const categories = [
    {
      id: 'safe',
      name: 'Safe Navigable Path',
      color: 'bg-emerald-500',
      count: '14,200 pts',
      description: 'Navigable subterranean corridor',
    },
    {
      id: 'hazard',
      name: 'Obstacles & Debris',
      color: 'bg-rose-500',
      count: '1,400 pts',
      description: 'Rockfall & structural hazards',
    },
    {
      id: 'structure',
      name: 'Tunnel Rock Walls',
      color: 'bg-amber-400',
      count: '28,600 pts',
      description: 'Bedrock boundary & reinforcement',
    },
    {
      id: 'trajectory',
      name: 'Rover Odometry Path',
      color: 'bg-cyan-500',
      count: '38 nodes',
      description: 'SLAM traversed coordinates',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 transition-all duration-300 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 tracking-wide">
            Spatial Point Cloud Layers
          </h3>
        </div>
        <span className="text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded-full bg-sky-50 text-blue-700 border border-blue-200">
          LiDAR Density 44k
        </span>
      </div>

      <div className="space-y-2 pt-3">
        {categories.map((cat) => {
          const isVisible = visibleLayers[cat.id] !== false;
          return (
            <div
              key={cat.id}
              onClick={() => onToggleLayer(cat.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                isVisible
                  ? 'bg-slate-50 border-slate-200/90 hover:border-blue-300'
                  : 'bg-slate-50/40 border-dashed border-slate-200 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {cat.description}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-hud text-slate-800 font-bold">
                  {cat.count}
                </span>
                <button
                  type="button"
                  className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Structural Stability Gauge */}
      <div className="mt-3.5 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-600 flex items-center gap-1.5 font-medium">
            <Mountain className="w-3.5 h-3.5 text-amber-600" />
            Tunnel Structural Integrity
          </span>
          <span className="font-mono-hud font-bold text-emerald-600">
            96.8% Safe
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: '96.8%' }}
          />
        </div>
      </div>
    </div>
  );
}
