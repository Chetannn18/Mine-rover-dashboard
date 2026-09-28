import React from 'react';

export default function CompassOverlay({ heading = 48, pitch = 2.4, roll = -1.1 }) {
  // Convert heading into cardinal direction
  const getCardinal = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <div className="relative group">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-emerald-500/50 bg-white/95 backdrop-blur-md p-1 shadow-lg relative flex items-center justify-center transition-all duration-300 hover:border-emerald-400">
        {/* Outer tick marks */}
        <div 
          className="absolute inset-1 rounded-full border border-dashed border-emerald-500/40 transition-transform duration-300"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
          <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-700">N</span>
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500">S</span>
          <span className="absolute right-0.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500">E</span>
          <span className="absolute left-0.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500">W</span>
        </div>

        {/* Center compass pointer */}
        <div 
          className="relative w-12 h-12 flex items-center justify-center transition-transform duration-300"
          style={{ transform: `rotate(${heading}deg)` }}
        >
          {/* North needle */}
          <div className="absolute top-0 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[18px] border-b-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          {/* South needle */}
          <div className="absolute bottom-0 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[18px] border-t-slate-400" />
          {/* Center pivot */}
          <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-emerald-500 z-10 shadow-xs" />
        </div>

        {/* Real-time heading display */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-emerald-800 px-2 py-0.5 rounded-lg text-[11px] font-mono-hud font-bold whitespace-nowrap border border-emerald-500/40 shadow-xs">
          {heading.toString().padStart(3, '0')}° {getCardinal(heading)}
        </div>
      </div>
    </div>
  );
}
