import React from 'react';
import { X, Sliders, Shield, Zap, Radio, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base font-tech uppercase tracking-wide text-slate-900">
              System & Mapping Configuration
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 mb-1.5 font-semibold">LiDAR Max Range (Meters)</label>
            <select className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono-hud shadow-xs focus:outline-none focus:border-blue-500">
              <option>50 meters (Tunnel Optimal)</option>
              <option>100 meters (Long Drift)</option>
              <option>25 meters (Tight Cross-Cut)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-1.5 font-semibold">SLAM Point Cloud Octree Resolution</label>
            <select className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono-hud shadow-xs focus:outline-none focus:border-blue-500">
              <option>High Precision (0.05m voxel)</option>
              <option>Balanced (0.10m voxel)</option>
              <option>Fast Traversal (0.20m voxel)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-1.5 font-semibold">Hazard Threshold Distance</label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              defaultValue="2.5"
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono-hud mt-1.5">
              <span>1.0m (Tight)</span>
              <span className="text-blue-600 font-bold">2.5m (Default)</span>
              <span>5.0m (Wide Clearance)</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
