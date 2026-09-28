import React, { useState } from 'react';
import { Flame, ShieldAlert, AlertTriangle, Crosshair, Timer, CheckCircle2, Zap } from 'lucide-react';
import PageViewNotificationBell from '../common/PageViewNotificationBell';

export default function BlastPredictionView() {
  const [chargeKg, setChargeKg] = useState(250);
  const [distanceM, setDistanceM] = useState(180);
  const [rockType, setRockType] = useState('Granite / Hard Quartzite');

  // Simple PPV (Peak Particle Velocity) calculation model
  const k = 1140; // site constant
  const b = 1.6;
  const scaledDistance = distanceM / Math.sqrt(chargeKg);
  const calculatedPPV = (k * Math.pow(scaledDistance, -b)).toFixed(2);
  const safeThreshold = 15.0; // mm/s
  const isSafe = calculatedPPV < safeThreshold;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3 sm:px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white flex flex-wrap items-center justify-between gap-3 shadow-md shadow-blue-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/20 text-white backdrop-blur-md border border-white/30">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-tech uppercase text-white tracking-wider">
              Controlled Blast Impact & Shock Wave Prediction
            </h2>
            <p className="text-[11px] text-blue-100">
              Calculate peak ground vibration (PPV), structural standoff distance, and rover clearance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/20 text-white border border-white/30 font-mono-hud shadow-xs">
            NEXT BLAST: 18:00 UTC
          </span>
          <PageViewNotificationBell pageId="blast_prediction" pageTitle="Blast Prediction" />
        </div>
      </div>

      {/* Calculator & Live Prediction Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Simulation Parameters */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-200/90 space-y-4 shadow-xs">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-tech border-b border-slate-100 pb-2">
            Blast Parameters & Explosive Charge
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1.5 text-slate-700">
                <span className="font-semibold">Explosive Charge Weight (TNT Equivalent)</span>
                <span className="font-bold font-mono-hud text-amber-600">{chargeKg} kg</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={chargeKg}
                onChange={(e) => setChargeKg(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-slate-700">
                <span className="font-semibold">Rover Standoff Distance</span>
                <span className="font-bold font-mono-hud text-rose-600">{distanceM} meters</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={distanceM}
                onChange={(e) => setDistanceM(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-slate-700 font-semibold">Rock Geological Strata</label>
              <select
                value={rockType}
                onChange={(e) => setRockType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono-hud text-xs focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <option>Granite / Hard Quartzite</option>
                <option>Limestone / Dense Sandstone</option>
                <option>Shale / Weak Stratified Rock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prediction Results Card */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-200/90 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-tech border-b border-slate-100 pb-2">
              Seismic Impact & Rover Safety Verdict
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 font-medium">Peak Particle Velocity</span>
                <div className="text-2xl font-bold font-mono-hud mt-1 text-slate-900">
                  {calculatedPPV} <span className="text-xs font-normal text-slate-500">mm/s</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono-hud">Max limit: 15.0 mm/s</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 font-medium">Safety Standoff Verdict</span>
                <div className={`text-2xl font-bold font-mono-hud mt-1 flex items-center gap-1.5 ${isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isSafe ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  {isSafe ? 'SAFE' : 'HAZARD'}
                </div>
                <span className="text-[10px] text-slate-400 font-mono-hud">
                  {isSafe ? 'Clear for detonation' : 'Evacuate rover +50m'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Rover is in designated safe shelter zone in Shaft Bravo.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
