import { useState, useMemo } from 'react';
import { useFleetStore } from '../store/useFleetStore';
import type { AlertType } from '../types';

export function useAlerts() {
  const alerts = useFleetStore((s) => s.alerts);
  const [filter, setFilter] = useState<AlertType | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    if (filter === 'ALL') return alerts;
    return alerts.filter((a) => a.alertType === filter);
  }, [alerts, filter]);

  return { alerts: filtered, filter, setFilter };
}
