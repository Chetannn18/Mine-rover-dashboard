import React, { useState } from 'react';
import { OctagonAlert, ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export default function EmergencyStopModal({ isOpen, onClose }) {
  const [isEngaged, setIsEngaged] = useState(false);

  if (!isOpen) return null;

  const handleEngage = () => {
    setIsEngaged(true);
    // Play subtle audio beep if supported
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio context not available or blocked
    }
  };

  const handleReset = () => {
    setIsEngaged(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-3xl border-2 border-red-500/80 shadow-2xl bg-white text-slate-900 space-y-4">
        <div className="flex items-center gap-3.5 pb-3 border-b border-red-100">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/30">
            <OctagonAlert className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-tech font-extrabold uppercase tracking-wider text-red-700">
              {isEngaged ? 'EMERGENCY PROTOCOL ENGAGED' : 'CONFIRM EMERGENCY STOP'}
            </h2>
            <p className="text-xs text-rose-600 font-mono-hud font-bold">
              {isEngaged ? 'ALL MOTORS CUT • BRAKES LOCKED' : 'MINE ROVER SAFETY OVERRIDE'}
            </p>
          </div>
        </div>

        {isEngaged ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-rose-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Rover drivetrain has been immediately immobilized.</span>
              </div>
              <div className="flex items-center gap-2 text-rose-800 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>SLAM telemetry & Gas sensors remain in standby telemetry mode.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-tech font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Disarm & Resume Operations
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              Triggering the emergency stop will instantly cut power to all drive actuators, lock mechanical fail-safe brakes, and broadcast a critical halt beacon to ground operations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEngage}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-tech font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/30 cursor-pointer"
              >
                CONFIRM STOP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
