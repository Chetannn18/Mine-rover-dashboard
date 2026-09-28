import React, { useState, useRef, useEffect } from 'react';
import { Bell, Volume2, VolumeX, AlertTriangle, ShieldAlert, CheckCircle2, Info, Radio, Sparkles, X } from 'lucide-react';
import { useSensorTelemetry } from '../../context/SensorTelemetryContext';

export default function PageViewNotificationBell({ pageId, pageTitle }) {
  const { getPageAlerts, isAudioMuted, setIsAudioMuted, explosionRisk, playBuzzerTone } = useSensorTelemetry();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const alerts = getPageAlerts(pageId);

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const totalUrgent = criticalCount + warningCount;

  // Handle outside click to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
          criticalCount > 0
            ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 shadow-rose-100'
            : warningCount > 0
            ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
        title={`Hover to view ${pageTitle || 'Page'} Alerts`}
      >
        <Bell className={`w-4 h-4 ${criticalCount > 0 ? 'animate-bounce text-rose-600' : ''}`} />
        
        {totalUrgent > 0 ? (
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono-hud font-extrabold text-white ${
              criticalCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'
            }`}
          >
            {totalUrgent}
          </span>
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
        )}

        <span className="text-[11px] font-tech font-bold uppercase tracking-wider hidden sm:inline text-slate-800">
          Alerts
        </span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-xl border ${
                  criticalCount > 0
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-tech uppercase text-slate-900 tracking-wider">
                  {pageTitle || 'Page'} Live Alerts
                </h4>
                <p className="text-[10px] text-slate-500 font-mono-hud">
                  {alerts.length} active monitors
                </p>
              </div>
            </div>

            {/* Audio Buzzer Mute Toggle & Test Button */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAudioMuted(!isAudioMuted);
                }}
                className={`p-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isAudioMuted
                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
                title={isAudioMuted ? 'Unmute Buzzer Siren' : 'Mute Buzzer Siren'}
              >
                {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playBuzzerTone(900, 'sawtooth', 0.2);
                }}
                className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-[10px] font-mono-hud font-bold text-slate-700 border border-slate-200 cursor-pointer"
                title="Test Audio Buzzer"
              >
                Test Siren
              </button>
            </div>
          </div>

          {/* Alert Cards List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {alerts.map((alert) => {
              const isCrit = alert.severity === 'critical';
              const isWarn = alert.severity === 'warning';
              const isSafe = alert.severity === 'safe';

              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-2xl border transition-all text-xs space-y-1.5 shadow-xs ${
                    isCrit
                      ? 'bg-rose-50/90 border-rose-200'
                      : isWarn
                      ? 'bg-amber-50/90 border-amber-200'
                      : 'bg-slate-50 border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isCrit ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span className="font-bold text-slate-900 truncate text-[11px]">
                        {alert.title}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono-hud font-bold uppercase shrink-0 ${
                        isCrit
                          ? 'bg-rose-600 text-white shadow-xs'
                          : isWarn
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    {alert.desc}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] font-mono-hud">
                    <span className="text-slate-700 font-semibold truncate max-w-[200px]">
                      {alert.metric}
                    </span>
                    <span className="text-slate-500">{alert.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Explosion Index Summary */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono-hud">
            <span className="text-slate-600 font-medium">Gas Explosion Threat:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-md ${
                explosionRisk.level === 'critical'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : explosionRisk.level === 'high'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {explosionRisk.status} ({explosionRisk.riskScore}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
