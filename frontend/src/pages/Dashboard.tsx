import { useEffect, useState } from 'react';
import FleetMap from '../components/FleetMap';
import MetricsPanel from '../components/MetricsPanel';
import AlertsPanel from '../components/AlertsPanel';
import { useFleetStore } from '../store/useFleetStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { fetchVehicles, fetchAlerts } from '../services/api';

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Dashboard() {
  const setVehicles = useFleetStore((s) => s.setVehicles);
  const setAlerts = useFleetStore((s) => s.setAlerts);
  const metrics = useFleetStore((s) => s.metrics);
  const { sendToggleAlerts } = useWebSocket();
  const clock = useClock();

  useEffect(() => {
    fetchVehicles().then(setVehicles).catch(console.error);
    fetchAlerts().then(setAlerts).catch(console.error);
  }, [setVehicles, setAlerts]);

  return (
    <div className="flex flex-col h-screen bg-[#0b0f1a] text-slate-200 font-sans">
      {/* Header */}
      <header className="relative shrink-0 px-5 py-3 flex items-center justify-between">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight text-white leading-none">Fleet Monitoring</h1>
            <span className="text-[11px] text-slate-500 font-medium">Gauteng, South Africa</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-[12px] text-slate-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium">{metrics.totalOnline}</span>
            <span className="text-slate-500">vehicles</span>
          </div>
          <div className="text-[12px] text-slate-500 tabular-nums font-mono">
            {clock.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 min-h-0 gap-3 p-3 pt-2">
        {/* Map */}
        <div className="flex-[7] min-w-0 rounded-xl overflow-hidden ring-1 ring-white/[0.06]">
          <FleetMap />
        </div>

        {/* Sidebar */}
        <aside className="flex-[3] flex flex-col gap-3 min-w-[300px] max-w-[380px]">
          <div className="shrink-0">
            <MetricsPanel />
          </div>
          <div className="flex-1 min-h-0 flex flex-col rounded-xl bg-[#0f1320] ring-1 ring-white/[0.04] p-4">
            <AlertsPanel onToggle={sendToggleAlerts} />
          </div>
        </aside>
      </div>
    </div>
  );
}
