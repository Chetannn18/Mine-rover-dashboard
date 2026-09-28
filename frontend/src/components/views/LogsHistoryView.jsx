import React, { useState } from 'react';
import { FileText, Download, Search, Filter, Clock } from 'lucide-react';
import PageViewNotificationBell from '../common/PageViewNotificationBell';

const mockLogs = [
  { id: 'LOG-8842', time: '15:45:02', level: 'INFO', module: 'SLAM_ENGINE', message: 'Generated 3D mesh octree keyframe with 48,200 points in Sector 7.' },
  { id: 'LOG-8841', time: '15:42:10', level: 'WARN', module: 'OBSTACLE_AVOID', message: 'Rockfall obstacle detected 8.5m ahead. Path replanning initiated.' },
  { id: 'LOG-8840', time: '15:38:22', level: 'INFO', module: 'GAS_TELEMETRY', message: 'Gas sensor sweep complete: CH4 0.12%, CO 8.4ppm, O2 20.9% - Nominal.' },
  { id: 'LOG-8839', time: '15:30:15', level: 'INFO', module: 'BATTERY_MGMT', message: 'Power consumption steady at 162W. Estimated autonomy remaining: 4.8h.' },
  { id: 'LOG-8838', time: '15:20:00', level: 'INFO', module: 'RADIO_MESH', message: 'Node handover successful: Connected to Sub-Station Bravo #04.' },
];

export default function LogsHistoryView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = mockLogs.filter(
    (l) =>
      l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Time,Level,Module,Message', ...filteredLogs.map((l) => `${l.id},${l.time},${l.level},${l.module},"${l.message}"`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'mine_rover_mission_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search & Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search mission telemetry logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-inner font-mono-hud"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV Logs
          </button>
          <PageViewNotificationBell pageId="overview" pageTitle="Mission Logs" />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono-hud uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Log ID</th>
                <th className="py-3.5 px-4 font-bold">Timestamp</th>
                <th className="py-3.5 px-4 font-bold">Level</th>
                <th className="py-3.5 px-4 font-bold">Subsystem</th>
                <th className="py-3.5 px-4 font-bold">Telemetry Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono-hud">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-600 font-bold">{log.id}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{log.time}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.level === 'WARN'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-blue-600 font-bold">{log.module}</td>
                  <td className="py-3.5 px-4 text-slate-900 font-medium">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
