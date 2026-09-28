import React from 'react';
import PageViewNotificationBell from '../common/PageViewNotificationBell';
import {
  Activity,
  Globe,
  Flame,
  ShieldCheck,
  AlertTriangle,
  BatteryCharging,
  Wifi,
  Navigation,
  Mountain,
  Layers,
  ArrowUpRight,
  Play,
  Award,
  Zap,
  CheckCircle2,
  Compass,
  Radio,
  Sparkles,
  Shield,
  Cpu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';

const energyWaveData = [
  { time: '1', level: 65 },
  { time: '2', level: 78 },
  { time: '3', level: 70 },
  { time: '4', level: 85 },
  { time: '5', level: 80 },
  { time: '6', level: 92 },
  { time: '7', level: 88 },
];

const streakBarData = [
  { day: 'M', value: 45 },
  { day: 'T', value: 60 },
  { day: 'W', value: 75 },
  { day: 'T', value: 90 },
  { day: 'F', value: 82 },
  { day: 'S', value: 95 },
  { day: 'S', value: 88 },
];

export default function OverviewView({ onNavigateToMapping }) {
  const achievements = [
    { name: 'SLAM Master', level: 'Sector 7', icon: Globe, iconColor: 'text-rose-600', iconBg: 'bg-rose-50 border-rose-200' },
    { name: 'Zero Anomaly', level: 'Gas Safe', icon: Flame, iconColor: 'text-amber-600', iconBg: 'bg-amber-50 border-amber-200' },
    { name: 'Deep Drift', level: '342.5m', icon: Mountain, iconColor: 'text-cyan-600', iconBg: 'bg-cyan-50 border-cyan-200' },
    { name: 'Core Shield', level: '100% OK', icon: Shield, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50 border-emerald-200' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Hero Grid: Mission Banner + Circular Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Big Mission Banner */}
        <div className="lg:col-span-8 bg-gradient-to-br from-sky-50/70 via-white to-amber-50/40 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-slate-200/90 shadow-xs group">
          {/* Subtle Ambient Depth */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-tech bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-xs">
                  MISSION ACTIVE • #042
                </span>
                <span className="text-xs font-mono-hud text-slate-600 font-semibold">
                  SECTOR 7 • SHAFT BRAVO
                </span>
              </div>
              <PageViewNotificationBell pageId="overview" pageTitle="Subterranean Mission" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-tech tracking-wide text-slate-900 leading-tight uppercase max-w-xl">
              FOCUS CREATES CLARITY.<br />
              <span className="text-blue-600">CLARITY CREATES IMPACT.</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-lg mt-2 leading-relaxed font-sans">
              Autonomous subterranean exploration, 3D LiDAR point cloud SLAM acquisition, and atmospheric gas hazard inspection active.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs font-mono-hud">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-tech font-semibold">Depth Level</span>
                <span className="font-bold text-slate-900 text-sm">342.5 m</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-tech font-semibold">Point Cloud</span>
                <span className="font-bold text-cyan-600 text-sm">48.2k PTS</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-tech font-semibold">Battery Draw</span>
                <span className="font-bold text-emerald-600 text-sm">88% (4.8h)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToMapping}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>Launch 3D SLAM</span>
              <Play className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>
        </div>

        {/* Right: Overall Progress Circular Ring */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Overall Mission Progress
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            {/* SVG Circular Gradient Progress Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#cleanProgressGrad)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="cleanProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-tech text-slate-900">76%</span>
                <span className="text-[9px] font-mono-hud text-slate-500 uppercase font-semibold">Complete</span>
              </div>
            </div>

            {/* Progress Breakdown list */}
            <div className="space-y-1.5 text-xs font-medium flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> SLAM Scan
                </span>
                <span className="font-mono-hud font-bold text-slate-900">82%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Bedrock Strain
                </span>
                <span className="font-mono-hud font-bold text-slate-900">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Gas Purity
                </span>
                <span className="font-mono-hud font-bold text-slate-900">71%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Battery Health
                </span>
                <span className="font-mono-hud font-bold text-slate-900">88%</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 flex items-center justify-between font-mono-hud">
            <span className="text-slate-500 font-medium">Next Waypoint Target</span>
            <span className="font-bold text-blue-600">Node #19 (14m)</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Energy Wave Chart + Focus Streak Bar Chart + Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Energy / Drivetrain Level */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl space-y-2 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Drivetrain Energy Level
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              88% HIGH
            </span>
          </div>

          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyWaveData}>
                <defs>
                  <linearGradient id="cleanEnergyWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="level"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#cleanEnergyWave)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono-hud text-slate-500 pt-1 font-medium">
            <span>Motor 1: 38°C</span>
            <span>Motor 2: 37°C</span>
            <span>Motor 3: 38°C</span>
          </div>
        </div>

        {/* Focus Streak / Point Cloud Density Bar Chart */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl space-y-2 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                LiDAR Mapping Streak
              </h3>
              <span className="text-xl font-bold font-tech text-slate-900">24 DAYS</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 border border-cyan-200 text-cyan-700">
              AUTONOMOUS
            </span>
          </div>

          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streakBarData}>
                <defs>
                  <linearGradient id="cleanBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="url(#cleanBarGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subterranean Badges */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl space-y-2.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Subterranean Badges
            </h3>
            <span className="text-[10px] font-mono-hud font-bold text-rose-600">4 / 4 Active</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {achievements.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center p-2 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl border ${item.iconBg} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 mt-1.5 text-center leading-tight truncate w-full">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-mono-hud font-semibold text-slate-500">
                    {item.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Mission Roadmap Stepper */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider font-tech text-rose-600 block">
              Mission Roadmap
            </span>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Autonomous Exploration Sequence
            </h3>
          </div>
          <span className="text-sm font-bold text-rose-600 font-mono-hud">
            62% TO SHAFT CHARLIE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 relative">
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-emerald-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold font-mono-hud text-xs shrink-0 shadow-xs">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Surface Egress</span>
              <span className="text-[10px] text-emerald-700 font-mono-hud font-bold">COMPLETED</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold font-mono-hud text-xs shrink-0 shadow-xs">
              2
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Sector 7 SLAM</span>
              <span className="text-[10px] text-rose-800 font-mono-hud font-bold">IN PROGRESS</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-50/60 border border-slate-200 flex items-center gap-3 opacity-80">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold font-mono-hud text-xs shrink-0">
              3
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-600 block">Shaft Charlie Sync</span>
              <span className="text-[10px] text-slate-500 font-mono-hud font-medium">STANDBY</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-2xl bg-slate-50/60 border border-slate-200 flex items-center gap-3 opacity-80">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold font-mono-hud text-xs shrink-0">
              4
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-600 block">Surface Extraction</span>
              <span className="text-[10px] text-slate-500 font-mono-hud font-medium">STANDBY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
