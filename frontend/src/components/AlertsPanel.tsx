import { useFleetStore } from '../store/useFleetStore';
import { useAlerts } from '../hooks/useAlerts';
import type { AlertType } from '../types';

const typeBadge: Record<AlertType, { label: string; classes: string }> = {
  OVERSPEED: { label: 'Speed', classes: 'text-red-400 bg-red-500/10 ring-red-500/20' },
  LOW_FUEL: { label: 'Fuel', classes: 'text-amber-400 bg-amber-500/10 ring-amber-500/20' },
  ENGINE_OVERHEAT: { label: 'Temp', classes: 'text-orange-400 bg-orange-500/10 ring-orange-500/20' },
};

const filterOptions: Array<{ value: AlertType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'OVERSPEED', label: 'Speed' },
  { value: 'LOW_FUEL', label: 'Fuel' },
  { value: 'ENGINE_OVERHEAT', label: 'Temp' },
];

interface Props {
  onToggle: (enabled: boolean) => void;
}

export default function AlertsPanel({ onToggle }: Props) {
  const alertsEnabled = useFleetStore((s) => s.alertsEnabled);
  const toggleAlerts = useFleetStore((s) => s.toggleAlerts);
  const { alerts, filter, setFilter } = useAlerts();

  const handleToggle = () => {
    const next = !alertsEnabled;
    toggleAlerts();
    onToggle(next);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Live Alerts</h2>
        </div>
        <button
          onClick={handleToggle}
          className="group flex items-center gap-2"
        >
          <span className="text-[11px] text-slate-500 font-medium">{alertsEnabled ? 'ON' : 'OFF'}</span>
          <div className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${alertsEnabled ? 'bg-emerald-600/80' : 'bg-slate-700'}`}>
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${alertsEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
          </div>
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 mb-3">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all duration-150 ${
              filter === opt.value
                ? 'bg-slate-700/80 text-slate-200 ring-1 ring-slate-600/50'
                : 'text-slate-500 hover:text-slate-400 hover:bg-white/[0.03]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Alert feed */}
      <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
        {alerts.length === 0 ? (
          <div className="text-center text-slate-600 py-10 text-[12px]">No alerts to display</div>
        ) : (
          alerts.map((alert, i) => {
            const badge = typeBadge[alert.alertType];
            return (
              <div
                key={`${alert.vehicleId}-${alert.timestamp}-${i}`}
                className={`rounded-lg px-3 py-2.5 text-[12px] transition-colors ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-red-500/[0.06] ring-1 ring-red-500/10'
                    : 'bg-white/[0.02] ring-1 ring-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-600 shrink-0">
                    {new Date(alert.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-full ring-1 ${badge.classes}`}>
                    {badge.label}
                  </span>
                  {alert.severity === 'CRITICAL' && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-red-500/15 text-red-400 ring-1 ring-red-500/25">
                      CRIT
                    </span>
                  )}
                  <span className="ml-auto font-mono text-[10px] text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                    {alert.vehicleId}
                  </span>
                </div>
                <div className="text-slate-400 mt-1 leading-snug">{alert.message}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
