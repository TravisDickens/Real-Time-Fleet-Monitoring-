import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useFleetStore } from '../store/useFleetStore';
import type { TelemetryPoint, Alert } from '../types';
import { WS_URL } from '../utils/constants';

export function useWebSocket() {
  const clientRef = useRef<Client | null>(null);
  const updateFromTelemetry = useFleetStore((s) => s.updateFromTelemetry);
  const addAlert = useFleetStore((s) => s.addAlert);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        stompClient.subscribe('/topic/vehicles', (message) => {
          const batch: TelemetryPoint[] = JSON.parse(message.body);
          updateFromTelemetry(batch);
        });

        stompClient.subscribe('/topic/alerts', (message) => {
          const alert: Alert = JSON.parse(message.body);
          addAlert(alert);
        });
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [updateFromTelemetry, addAlert]);

  const sendToggleAlerts = (enabled: boolean) => {
    clientRef.current?.publish({
      destination: '/app/toggleAlerts',
      body: JSON.stringify({ enabled }),
    });
  };

  return { sendToggleAlerts };
}
