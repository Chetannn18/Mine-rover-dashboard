import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Flame,
  Wind,
  Gauge,
  CloudFog,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Activity,
  Sparkles,
  Info,
} from 'lucide-react';
import { useSensorTelemetry } from '../../context/SensorTelemetryContext';
import PageViewNotificationBell from '../common/PageViewNotificationBell';

export default function SensorMonitoringView() {
  const {
    sensors,
    telemetryHistory,
    explosionRisk,
    simMode,
    setSimMode,
    isAudioMuted,
    setIsAudioMuted,
    playBuzzerTone,
  } = useSensorTelemetry();

  const [activeRange, setActiveRange] = useState('Live');

  // Gas safety status flags
  const isCh4Crit = sensors.ch4 >= 5.0;
  const isCh4Warn = sensors.ch4 >= 2.0;
  const isCoCrit = sensors.co >= 50;
  const isCoWarn = sensors.co >= 25;
  const isCo2Warn = sensors.co2 >= 1000;
  const isO2Unsafe = sensors.o2 < 19.5 || sensors.o2 > 23.5;

  const gasCards = [
    {
      id: 'ch4',
      name: 'Methane (CH₄)',
      formula: 'CH₄',
      value: `${sensors.ch4.toFixed(2)} %`,
      rawValue: sensors.ch4,
      maxScale: 10.0,
      unit: '% Vol',
      safeRange: '< 1.00 %',
      lelPercent: explosionRisk.lelPercent,
      cardBg: 'bg-rose-50/50',
      cardBorder: 'border-rose-200',
      status: isCh4Crit ? 'EXPLOSIVE RISK' : isCh4Warn ? 'WARNING LEL' : 'SAFE',
      statusClass: isCh4Crit
        ? 'bg-rose-600 text-white font-extrabold animate-pulse'
        : isCh4Warn
        ? 'bg-amber-500 text-white font-bold'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Flame,
      color: '#e11d48',
      barColor: isCh4Crit ? 'bg-rose-600' : isCh4Warn ? 'bg-amber-500' : 'bg-emerald-500',
      notes: 'Flammable range: 5.0% - 15.0% in air. LEL is 5.0%.',
    },
    {
      id: 'co2',
      name: 'Carbon Dioxide (CO₂)',
      formula: 'CO₂',
      value: `${sensors.co2} ppm`,
      rawValue: sensors.co2,
      maxScale: 3000,
      unit: 'ppm',
      safeRange: '< 1,000 ppm',
      lelPercent: Number(((sensors.co2 / 5000) * 100).toFixed(0)),
      cardBg: 'bg-amber-50/50',
      cardBorder: 'border-amber-200',
      status: isCo2Warn ? 'ELEVATED' : 'NOMINAL',
      statusClass: isCo2Warn
        ? 'bg-amber-500 text-white font-bold'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CloudFog,
      color: '#d97706',
      barColor: isCo2Warn ? 'bg-amber-500' : 'bg-amber-400',
      notes: 'OSHA TWA: 5,000 ppm (0.5%). Heavy gas settling in sumps.',
    },
    {
      id: 'co',
      name: 'Carbon Monoxide (CO)',
      formula: 'CO',
      value: `${sensors.co.toFixed(1)} ppm`,
      rawValue: sensors.co,
      maxScale: 100,
      unit: 'ppm',
      safeRange: '< 25.0 ppm',
      lelPercent: Number(((sensors.co / 50) * 100).toFixed(0)),
      cardBg: 'bg-sky-50/50',
      cardBorder: 'border-sky-200',
      status: isCoCrit ? 'CRITICAL TOXIC' : isCoWarn ? 'CAUTION' : 'SAFE',
      statusClass: isCoCrit
        ? 'bg-rose-600 text-white font-extrabold animate-pulse'
        : isCoWarn
        ? 'bg-amber-500 text-white font-bold'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Gauge,
      color: '#0284c7',
      barColor: isCoCrit ? 'bg-rose-600' : isCoWarn ? 'bg-amber-500' : 'bg-sky-500',
      notes: 'Toxic asphyxiant. NIOSH REL: 35 ppm. IDLH: 1,200 ppm.',
    },
    {
      id: 'o2',
      name: 'Oxygen Level (O₂)',
      formula: 'O₂',
      value: `${sensors.o2.toFixed(1)} %`,
      rawValue: sensors.o2,
      maxScale: 25.0,
      unit: '% Vol',
      safeRange: '19.5 - 23.5 %',
      lelPercent: Number(((sensors.o2 / 20.9) * 100).toFixed(0)),
      cardBg: 'bg-emerald-50/50',
      cardBorder: 'border-emerald-200',
      status: isO2Unsafe ? 'HAZARD' : 'OPTIMAL',
      statusClass: isO2Unsafe
        ? 'bg-rose-600 text-white font-extrabold animate-pulse'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Wind,
      color: '#059669',
      barColor: isO2Unsafe ? 'bg-rose-600' : 'bg-emerald-500',
      notes: 'Minimum safe breathing level: 19.5%. Normal atmospheric: 20.9%.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Controls & Navigation Header with Page Notification Bell */}
      <div className="p-3 sm:px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white shadow-md shadow-blue-500/20 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/20 text-white backdrop-blur-md border border-white/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-tech uppercase text-white tracking-wider">
              Subterranean Gas & Atmospheric Sensor Matrix
            </h2>
            <p className="text-[11px] text-blue-100">
              Lag-free real-time telemetry stream for Methane (CH₄), Carbon Dioxide (CO₂), Carbon Monoxide (CO), and Oxygen (O₂)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Buzzer Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono-hud font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isAudioMuted
                ? 'bg-white/10 text-blue-100 border-white/20 hover:bg-white/20'
                : 'bg-emerald-400 text-slate-900 border-emerald-300 font-extrabold hover:bg-emerald-300'
            }`}
            title={isAudioMuted ? 'Unmute Emergency Buzzer' : 'Mute Emergency Buzzer'}
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isAudioMuted ? 'Buzzer Muted' : 'Buzzer Active'}</span>
          </button>

          {/* Test Tone Trigger */}
          <button
            type="button"
            onClick={() => playBuzzerTone(1000, 'sawtooth', 0.25)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-xs font-mono-hud font-bold text-blue-700 transition-all cursor-pointer shadow-xs"
          >
            Test Siren
          </button>

          {/* Page-Specific Notification Bell */}
          <PageViewNotificationBell pageId="sensor_monitoring" pageTitle="Gas Sensors" />
        </div>
      </div>

      {/* Gas Simulation & Hazard Scenario Preset Bar */}
      <div className="p-3.5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-tech font-bold uppercase text-slate-700">
            Hazard Simulation Presets:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSimMode('normal')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono-hud transition-all cursor-pointer ${
                simMode === 'normal'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-sky-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 border border-slate-200'
              }`}
            >
              Nominal Baseline
            </button>
            <button
              type="button"
              onClick={() => setSimMode('ch4_warning')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono-hud transition-all cursor-pointer ${
                simMode === 'ch4_warning'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 text-slate-700 border border-slate-200'
              }`}
            >
              Elevate CH₄ (3.2%)
            </button>
            <button
              type="button"
              onClick={() => setSimMode('co_spike')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono-hud transition-all cursor-pointer ${
                simMode === 'co_spike'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 font-bold'
                  : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 text-slate-700 border border-slate-200'
              }`}
            >
              Inject CO Spike (58 ppm)
            </button>
            <button
              type="button"
              onClick={() => setSimMode('explosion_imminent')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono-hud transition-all cursor-pointer ${
                simMode === 'explosion_imminent'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/30 animate-pulse font-extrabold'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
              }`}
            >
              Explosive Mix (6.4% CH₄)
            </button>
          </div>
        </div>

        <span className="text-[11px] font-mono-hud font-semibold text-slate-500">
          Telemetry Frequency: <span className="font-bold text-blue-600">1.2s</span> (Zero Buffer Lag)
        </span>
      </div>

      {/* 4 Primary Gas Live Reading Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gasCards.map((gas) => {
          const Icon = gas.icon;
          const fillPercent = Math.min(100, Math.max(4, (gas.rawValue / gas.maxScale) * 100));

          return (
            <div
              key={gas.id}
              className={`${gas.cardBg} ${gas.cardBorder} p-4 rounded-3xl border shadow-xs hover:shadow-md transition-all space-y-3`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <div
                    className="p-1.5 rounded-xl border bg-white"
                    style={{ borderColor: `${gas.color}35`, color: gas.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 truncate">
                      {gas.name}
                    </h3>
                    <span className="text-[10px] text-slate-600 font-mono-hud font-semibold">
                      Safe: {gas.safeRange}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono-hud px-2 py-0.5 rounded-full border ${gas.statusClass}`}>
                  {gas.status}
                </span>
              </div>

              {/* Big Live Value Display */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold font-mono-hud text-slate-900">
                    {gas.value}
                  </span>
                  <span className="text-xs font-mono-hud text-slate-600 font-bold">
                    {gas.unit}
                  </span>
                </div>

                {/* Progress Level Bar */}
                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${gas.barColor} transition-all duration-500`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>

              {/* Footer Gas Regulatory Notes */}
              <p className="text-[10px] text-slate-600 font-sans leading-tight pt-1 border-t border-slate-200/60 font-medium">
                {gas.notes}
              </p>
            </div>
          );
        })}
      </div>

      {/* Gas Explosion Model & Coward's Flammability Triangle Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Complete Gas Explosion Risk Matrix */}
        <div
          className={`lg:col-span-7 p-5 rounded-3xl border shadow-xs space-y-4 transition-all ${
            explosionRisk.level === 'critical'
              ? 'bg-rose-50/90 border-rose-300'
              : explosionRisk.level === 'high'
              ? 'bg-amber-50/90 border-amber-300'
              : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-2xl border ${
                  explosionRisk.level === 'critical'
                    ? 'bg-rose-600 text-white animate-bounce'
                    : explosionRisk.level === 'high'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm font-tech uppercase text-slate-900 tracking-wider">
                  Gas Flammability & Explosion Risk Model (Coward's Triangle)
                </h3>
                <p className="text-xs text-slate-600">
                  Subterranean methane-air explosive mixture limit evaluation
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-mono-hud font-extrabold uppercase shadow-xs ${
                explosionRisk.level === 'critical'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : explosionRisk.level === 'high'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {explosionRisk.status}
            </span>
          </div>

          {/* Meter & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-slate-600 font-semibold block">Explosion Threat Index</span>
              <div className="text-2xl font-extrabold font-mono-hud text-slate-900">
                {explosionRisk.riskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </div>
              <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-500 ${
                    explosionRisk.riskScore >= 75
                      ? 'bg-rose-600'
                      : explosionRisk.riskScore >= 40
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${explosionRisk.riskScore}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-slate-600 font-semibold block">LEL Methane Saturation</span>
              <div className="text-2xl font-extrabold font-mono-hud text-slate-900">
                {explosionRisk.lelPercent}% <span className="text-xs text-slate-500 font-normal">LEL</span>
              </div>
              <span className="text-[10px] text-slate-600 font-mono-hud block">100% LEL = 5.0% CH₄</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-slate-600 font-semibold block">Combustion Oxygen</span>
              <div className="text-2xl font-extrabold font-mono-hud text-emerald-700">
                {sensors.o2.toFixed(1)}% <span className="text-xs text-slate-500 font-normal">O₂</span>
              </div>
              <span className="text-[10px] text-slate-600 font-mono-hud block">Min O₂ for flame: 12.1%</span>
            </div>
          </div>

          {/* Reason Box */}
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-2.5 text-xs">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Geotechnical Safety Analysis:</span>
              <span className="text-slate-700 font-sans">{explosionRisk.reason}</span>
            </div>
          </div>
        </div>

        {/* Right: Coward's Triangle Geometric Explanation Card */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/90 space-y-3.5 shadow-xs">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-tech border-b border-slate-100 pb-2">
            Explosive Envelope Zone Breakdown
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-950 block text-[11px]">Safe Zone (Non-Flammable)</span>
                <span className="text-[10px] text-emerald-800">CH₄ &lt; 5.0% or O₂ &lt; 12.0%</span>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>

            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-950 block text-[11px]">Explosion Mixture Zone (Coward)</span>
                <span className="text-[10px] text-rose-800">5.0% ≤ CH₄ ≤ 15.0% with O₂ ≥ 12.0%</span>
              </div>
              <Flame className="w-5 h-5 text-rose-700 shrink-0" />
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-950 block text-[11px]">Fuel-Rich / Capable of Igniting if Air Added</span>
                <span className="text-[10px] text-amber-800">CH₄ &gt; 15.0% in restricted airways</span>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Live Streaming Gas Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Real-time CH4 & CO Chart */}
        <div className="bg-white p-5 rounded-3xl space-y-3 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-tech">
                  Real-time Methane (CH₄ %) & Carbon Monoxide (CO ppm)
                </h3>
                <span className="text-[10px] text-slate-500 font-mono-hud">Live Streaming Buffer (Zero Lag)</span>
              </div>
            </div>
            <span className="text-xs font-mono-hud text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory}>
                <defs>
                  <linearGradient id="ch4GradLive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="coGradLive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="ch4"
                  name="Methane CH₄ (% vol)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fill="url(#ch4GradLive)"
                />
                <Area
                  type="monotone"
                  dataKey="co"
                  name="Carbon Monoxide CO (ppm)"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fill="url(#coGradLive)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time CO2 & O2 Chart */}
        <div className="bg-white p-5 rounded-3xl space-y-3 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <CloudFog className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-tech">
                  Real-time Carbon Dioxide (CO₂ ppm) & Oxygen (O₂ %)
                </h3>
                <span className="text-[10px] text-slate-500 font-mono-hud">Atmospheric Gas Purity Feed</span>
              </div>
            </div>
            <span className="text-xs font-mono-hud text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              STABLE FEED
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="left" stroke="#d97706" tick={{ fontSize: 10, fill: '#d97706' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#059669" tick={{ fontSize: 10, fill: '#059669' }} domain={[15, 25]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="co2"
                  name="CO₂ (ppm)"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="o2"
                  name="Oxygen O₂ (%)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
