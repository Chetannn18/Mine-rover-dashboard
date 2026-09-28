import React from 'react';
import { Flame, Wind, Droplets, Thermometer, BatteryCharging, Gauge, CloudFog, ShieldCheck } from 'lucide-react';
import { useSensorTelemetry } from '../../context/SensorTelemetryContext';

export default function EnvironmentalQuickBar() {
  const { sensors, explosionRisk } = useSensorTelemetry();

  const isCh4Crit = sensors.ch4 >= 5.0;
  const isCh4Warn = sensors.ch4 >= 2.0;

  const isCoCrit = sensors.co >= 50;
  const isCoWarn = sensors.co >= 25;

  const isCo2Warn = sensors.co2 >= 1000;

  const isO2Unsafe = sensors.o2 < 19.5 || sensors.o2 > 23.5;

  const telemetry = [
    {
      id: 'methane',
      name: 'Methane (CH₄)',
      value: `${sensors.ch4.toFixed(2)} %`,
      status: isCh4Crit ? 'EXPLOSIVE' : isCh4Warn ? 'WARNING' : 'SAFE',
      statusBg: isCh4Crit
        ? 'bg-rose-600 text-white font-extrabold animate-pulse'
        : isCh4Warn
        ? 'bg-amber-500 text-white font-bold'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Flame,
      iconBg: isCh4Crit
        ? 'bg-rose-50 text-rose-600 border-rose-300'
        : 'bg-amber-50 text-amber-600 border-amber-200',
      threshold: `LEL: ${explosionRisk.lelPercent}% (5.0%)`,
    },
    {
      id: 'co2',
      name: 'Carbon Dioxide (CO₂)',
      value: `${sensors.co2} ppm`,
      status: isCo2Warn ? 'ELEVATED' : 'NOMINAL',
      statusBg: isCo2Warn
        ? 'bg-amber-500 text-white font-bold'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CloudFog,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      threshold: 'Max < 1,000 ppm',
    },
    {
      id: 'co',
      name: 'Carbon Monoxide (CO)',
      value: `${sensors.co.toFixed(1)} ppm`,
      status: isCoCrit ? 'CRITICAL' : isCoWarn ? 'ELEVATED' : 'SAFE',
      statusBg: isCoCrit
        ? 'bg-rose-600 text-white font-extrabold animate-pulse'
        : isCoWarn
        ? 'bg-amber-500 text-white font-bold'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Gauge,
      iconBg: 'bg-sky-50 text-blue-600 border-blue-200',
      threshold: 'PEL < 25.0 ppm',
    },
    {
      id: 'o2',
      name: 'Oxygen Level (O₂)',
      value: `${sensors.o2.toFixed(1)} %`,
      status: isO2Unsafe ? 'HAZARD' : 'OPTIMAL',
      statusBg: isO2Unsafe
        ? 'bg-rose-600 text-white font-extrabold animate-pulse'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Wind,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      threshold: 'Target: 19.5 - 23.5%',
    },
    {
      id: 'battery',
      name: 'Rover Power & Temp',
      value: `${sensors.battery}% • ${sensors.temp.toFixed(1)}°C`,
      status: '4.8h Left',
      statusBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: BatteryCharging,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      threshold: '64.2V LiFePO4 Nominal',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {telemetry.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 transition-all duration-200 shadow-xs hover:shadow-md hover:border-blue-300 group"
          >
            <div className="flex items-center justify-between text-xs mb-2.5">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-xl border ${item.iconBg} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-800 truncate text-xs">
                  {item.name}
                </span>
              </div>
              <span className={`text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded-full border ${item.statusBg}`}>
                {item.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-slate-100">
              <span className="text-lg font-bold font-mono-hud text-slate-900">
                {item.value}
              </span>
              <span className="text-[10px] text-slate-500 font-mono-hud font-semibold">
                {item.threshold}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

