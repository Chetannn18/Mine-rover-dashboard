import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SensorTelemetryProvider, useSensorTelemetry } from './context/SensorTelemetryContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Main3DView from './components/3DMapping/Main3DView';
import OverviewView from './components/views/OverviewView';
import SensorMonitoringView from './components/views/SensorMonitoringView';
import BlastPredictionView from './components/views/BlastPredictionView';
import EmergencyAlertsView from './components/views/EmergencyAlertsView';
import RoverHealthView from './components/views/RoverHealthView';
import LogsHistoryView from './components/views/LogsHistoryView';
import EmergencyStopModal from './components/EmergencyStopModal';
import SettingsModal from './components/SettingsModal';
import { AlertTriangle, Flame, Volume2, VolumeX } from 'lucide-react';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('3d_mapping');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEmergencyStopOpen, setIsEmergencyStopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { explosionRisk, isAudioMuted, setIsAudioMuted, setSimMode } = useSensorTelemetry();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView onNavigateToMapping={() => setActiveTab('3d_mapping')} />;
      case 'sensor_monitoring':
        return <SensorMonitoringView />;
      case '3d_mapping':
        return <Main3DView />;
      case 'blast_prediction':
        return <BlastPredictionView />;
      case 'emergency_alerts':
        return <EmergencyAlertsView />;
      case 'rover_health':
        return <RoverHealthView />;
      case 'logs_history':
        return <LogsHistoryView />;
      default:
        return <Main3DView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Sidebar - Desktop Collapsible & Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:static lg:z-auto transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onEmergencyStopTrigger={() => setIsEmergencyStopOpen(true)}
        />
      </div>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        {/* Critical Explosion Siren Top Banner if triggered */}
        {explosionRisk.level === 'critical' && (
          <div className="bg-rose-600 text-white px-4 py-2.5 flex items-center justify-between shadow-lg animate-pulse z-50">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 animate-bounce" />
              <div className="text-xs font-mono-hud font-bold">
                <span className="underline uppercase tracking-wider">CRITICAL EXPLOSION HAZARD ACTIVE:</span>{' '}
                {explosionRisk.reason}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-mono-hud text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {isAudioMuted ? 'Muted' : 'Siren On'}
              </button>
              <button
                type="button"
                onClick={() => setSimMode('normal')}
                className="px-3 py-1 rounded-xl bg-white text-rose-700 font-mono-hud text-xs font-bold hover:bg-rose-50 transition-all cursor-pointer shadow-xs"
              >
                Reset To Safe
              </button>
            </div>
          </div>
        )}

        <Header
          activeTab={activeTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="flex-1 p-2.5 sm:p-3.5 md:p-4 max-w-[1850px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      <EmergencyStopModal
        isOpen={isEmergencyStopOpen}
        onClose={() => setIsEmergencyStopOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SensorTelemetryProvider>
        <DashboardContent />
      </SensorTelemetryProvider>
    </ThemeProvider>
  );
}

