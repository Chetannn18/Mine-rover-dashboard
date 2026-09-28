import React, { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Globe,
  Camera,
  Flame,
  AlertTriangle,
  HeartPulse,
  FileText,
  OctagonAlert,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onEmergencyStopTrigger,
}) {
  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'sensor_monitoring', name: 'Sensor Monitoring', icon: Activity },
    { id: '3d_mapping', name: '3D Mapping & SLAM', icon: Globe, highlight: true },
    { id: 'blast_prediction', name: 'Blast Prediction', icon: Flame },
    { id: 'emergency_alerts', name: 'Emergency Alerts', icon: AlertTriangle, badge: '2' },
    { id: 'rover_health', name: 'Rover Health', icon: HeartPulse },
    { id: 'logs_history', name: 'Logs & History', icon: FileText },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 shrink-0 bg-white flex flex-col justify-between p-3.5 border-r border-slate-200/90 transition-all duration-300 z-40 select-none shadow-sm ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Logo & Avatar Hero */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative p-2 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white shadow-md shadow-blue-500/25 shrink-0">
              <Shield className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-sm tracking-wider font-tech text-slate-900 uppercase leading-tight truncate">
                    ELYSIA
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-50 text-blue-700 border border-blue-200">
                    MK-IV
                  </span>
                </div>
                <p className="text-[10px] font-bold text-blue-600 tracking-wider font-tech uppercase truncate">
                  MINE ROVER AI • SLAM
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-sky-50 hover:border-blue-200 transition-all cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.name : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'
                } rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25 font-bold'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-sky-50/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition-all shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 group-hover:text-blue-600 group-hover:bg-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {!isCollapsed && (
                    <span className="font-semibold text-left truncate tracking-wide text-xs">{item.name}</span>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer: Emergency Stop */}
      <div className="pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onEmergencyStopTrigger}
          title={isCollapsed ? 'Emergency Stop' : undefined}
          className={`w-full flex items-center justify-center ${
            isCollapsed ? 'p-2.5' : 'py-3 px-3.5 gap-2.5'
          } rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white border border-red-400/60 font-tech font-extrabold text-xs tracking-wider uppercase transition-all duration-200 shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/45 hover:scale-[1.02] active:scale-95 group cursor-pointer`}
        >
          <OctagonAlert className="w-4 h-4 text-white animate-bounce shrink-0" />
          {!isCollapsed && <span className="font-extrabold tracking-widest drop-shadow-xs">EMERGENCY STOP</span>}
        </button>
      </div>
    </aside>
  );
}
