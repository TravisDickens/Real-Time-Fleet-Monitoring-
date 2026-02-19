import { useFleetStore } from '../store/useFleetStore';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent: string;
}

function MetricCard({ label, value, icon, accent }: MetricCardProps) {
  return (
    <div className="relative rounded-lg bg-[#0f1320] ring-1 ring-white/[0.04] px-3.5 py-3 overflow-hidden">
      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full" style={{ backgroundColor: accent }} />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[22px] font-semibold text-white leading-none tabular-nums">{value}</div>
          <div className="text-[11px] text-slate-500 mt-1.5 font-medium">{label}</div>
        </div>
        <div className="text-slate-600 mt-0.5">{icon}</div>
      </div>
    </div>
  );
}

const IconTruck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.684-.949V8a1 1 0 0 1 1-1h1.382a1 1 0 0 1 .894.553l1.448 2.894A1 1 0 0 0 20.382 11H22v5a2 2 0 0 1-2 2" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="19" cy="18" r="2" />
  </svg>
);

const IconGauge = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
    <circle cx="12" cy="12" r="10" />
    <path d="m14.5 9.5-3 3" />
  </svg>
);

const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const IconDroplet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </svg>
);

const IconThermometer = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </svg>
);

export default function MetricsPanel() {
  const metrics = useFleetStore((s) => s.metrics);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-1">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Fleet Overview</h2>
        <div className="flex-1 h-px bg-slate-800" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          icon={<IconTruck />}
          label="Online"
          value={metrics.totalOnline}
          accent="#10b981"
        />
        <MetricCard
          icon={<IconGauge />}
          label="Avg km/h"
          value={metrics.averageSpeed}
          accent="#6366f1"
        />
        <MetricCard
          icon={<IconZap />}
          label="Overspeeding"
          value={metrics.overspeedCount}
          accent="#ef4444"
        />
        <MetricCard
          icon={<IconDroplet />}
          label="Low Fuel"
          value={metrics.lowFuelCount}
          accent="#f59e0b"
        />
        <MetricCard
          icon={<IconThermometer />}
          label="Overheating"
          value={metrics.overheatCount}
          accent="#f97316"
        />
      </div>
    </div>
  );
}
