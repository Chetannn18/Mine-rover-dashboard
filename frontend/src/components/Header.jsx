import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Wifi,
  Radio,
  Clock,
  Settings,
  ChevronRight,
  Menu,
  X,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';

export default function Header({
  activeTab,
  onToggleSidebar,
  sidebarOpen,
  onOpenSettings,
}) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (d) => {
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  };

  const getBreadcrumbName = () => {
    switch (activeTab) {
      case 'overview':
        return 'Overview';
      case 'sensor_monitoring':
        return 'Sensor Monitoring';
      case '3d_mapping':
        return '3D Mapping & SLAM';
      case 'blast_prediction':
        return 'Blast Prediction';
      case 'emergency_alerts':
        return 'Emergency Alerts';
      case 'rover_health':
        return 'Rover Health & Diagnostics';
      case 'logs_history':
        return 'Logs & Mission History';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 py-3 border-b border-slate-200/90 flex items-center justify-between transition-all duration-300 shadow-xs">
      {/* Left: Breadcrumbs & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 font-tech uppercase tracking-wider">Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900 font-tech uppercase tracking-wider text-sm">
            {getBreadcrumbName()}
          </span>
        </div>
      </div>

      {/* Right: Telemetry Status, Clock, Theme Switcher & Settings */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Rover Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono-hud font-bold shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>ROVER : ONLINE</span>
        </div>

        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono-hud text-slate-700 shadow-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{formatDateTime(time)}</span>
        </div>

        {/* Telemetry Connection */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs">
          <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-slate-500 font-medium">Link:</span>
          <span className="font-bold text-blue-700 font-mono-hud">99.4% NOMINAL</span>
        </div>

        {/* Settings button */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="System Configuration"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-blue-700 transition-all cursor-pointer shadow-xs"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
