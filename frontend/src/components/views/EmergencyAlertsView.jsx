import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Bell, CheckCircle2, Clock, MapPin, Search } from 'lucide-react';
import PageViewNotificationBell from '../common/PageViewNotificationBell';

const mockAlerts = [
  {
    id: 'ALT-1092',
    severity: 'critical',
    title: 'Rockfall Debris Obstruction in Sector 7',
    location: 'Shaft 4 - Alpha Drift (X: +14m, Z: -342m)',
    timestamp: '15:42:10',
    status: 'ACTIVE',
    description: 'LiDAR point cloud scan identified 1.4m fallen rock cluster obstructing primary haulage route.',
  },
  {
    id: 'ALT-1091',
    severity: 'warning',
    title: 'Transient CO Spike in Shaft Charlie',
    location: 'Ventilation Cross-cut B',
    timestamp: '15:30:24',
    status: 'ACTIVE',
    description: 'CO elevated to 14.2 ppm following secondary ventilation regulator adjustment. Auxiliary fan engaged.',
  },
  {
    id: 'ALT-1089',
    severity: 'info',
    title: 'Automated SLAM Point Cloud Keyframe Sync',
    location: 'Central Surface Server',
    timestamp: '15:15:00',
    status: 'RESOLVED',
    description: 'Full 3D tunnel point cloud map synchronised with surface geotechnical control database.',
  },
];

export default function EmergencyAlertsView() {
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState(mockAlerts);

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  const handleAcknowledge = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          {['all', 'critical', 'warning', 'info'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider font-tech transition-all cursor-pointer ${
                filter === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-hud text-slate-500 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredAlerts.length}</span> Alerts
          </span>
          <PageViewNotificationBell pageId="overview" pageTitle="Emergency Alerts" />
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-3xl border transition-all shadow-xs ${
              alert.severity === 'critical'
                ? 'border-rose-300 bg-rose-50/70'
                : alert.severity === 'warning'
                ? 'border-amber-300 bg-amber-50/70'
                : 'border-slate-200/90 bg-white'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-tech uppercase ${
                    alert.severity === 'critical'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : alert.severity === 'warning'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="font-mono-hud text-xs text-slate-500 font-semibold">{alert.id}</span>
                <h3 className="font-bold text-sm text-slate-900">
                  {alert.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono-hud">
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {alert.timestamp}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    alert.status === 'ACTIVE'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 mb-3 leading-relaxed font-normal">
              {alert.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200/80 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {alert.location}
              </span>

              {alert.status === 'ACTIVE' && (
                <button
                  type="button"
                  onClick={() => handleAcknowledge(alert.id)}
                  className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                >
                  Acknowledge Alert
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
