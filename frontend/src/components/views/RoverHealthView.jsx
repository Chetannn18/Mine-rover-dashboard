import React from 'react';
import { HeartPulse, Cpu, Battery, Disc3, Radio, ShieldCheck, Zap, Thermometer } from 'lucide-react';
import PageViewNotificationBell from '../common/PageViewNotificationBell';

export default function RoverHealthView() {
  const subsystems = [
    {
      name: 'LiDAR 360 Scanner Core',
      health: '100%',
      status: 'Nominal',
      temp: '32.1 °C',
      draw: '18.4 W',
      icon: Disc3,
      color: 'text-cyan-600',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    },
    {
      name: 'Traction Drivetrain (4-Wheel Brushless)',
      health: '98%',
      status: 'Nominal',
      temp: '38.4 °C',
      draw: '142.0 W',
      icon: Cpu,
      color: 'text-rose-600',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      name: 'LiFePO4 Power System (64V 50Ah)',
      health: '96%',
      status: 'Balanced Cells',
      temp: '28.0 °C',
      draw: '88% Remaining',
      icon: Battery,
      color: 'text-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      name: 'Subterranean Mesh Radio (915 MHz)',
      health: '100%',
      status: 'Connected (Mesh #4)',
      temp: '29.5 °C',
      draw: '-42 dBm RSSI',
      icon: Radio,
      color: 'text-cyan-600',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    },
    {
      name: 'Multi-Gas Sniffer Sensor Module',
      health: '99%',
      status: 'Calibrated',
      temp: '24.2 °C',
      draw: '4.2 W',
      icon: Zap,
      color: 'text-amber-600',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      name: 'IMU 9-DOF Gyro / Accelerometer',
      health: '100%',
      status: 'Zero Drift Offset',
      temp: '26.8 °C',
      draw: '0.8 W',
      icon: ShieldCheck,
      color: 'text-amber-600',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="p-3 sm:px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white flex flex-wrap items-center justify-between gap-3 shadow-md shadow-blue-500/20">
        <div>
          <h2 className="text-sm font-bold font-tech uppercase text-white tracking-wider">
            Rover Subsystem Diagnostics & Health Matrix
          </h2>
          <p className="text-[11px] text-blue-100">
            Hardware monitoring for Mine Rover Unit #MR-ALPHA-01 (ELYSIA MK-IV)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/20 text-white border border-white/30 font-mono-hud shadow-xs">
            SYSTEM STATUS: ALL OPERATIONAL
          </span>
          <PageViewNotificationBell pageId="rover_health" pageTitle="Rover Diagnostics" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subsystems.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div
              key={idx}
              className="bg-white p-4 rounded-3xl space-y-3 border border-slate-200/90 hover:shadow-md transition-all shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${sub.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">
                      {sub.name}
                    </h3>
                    <span className={`text-[11px] font-bold font-mono-hud ${sub.color}`}>
                      {sub.status}
                    </span>
                  </div>
                </div>
                <span className="text-base font-bold font-mono-hud text-slate-900">
                  {sub.health}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 text-xs font-mono-hud">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>{sub.temp}</span>
                </div>
                <div className="text-right text-slate-700 font-bold">
                  <span>{sub.draw}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
