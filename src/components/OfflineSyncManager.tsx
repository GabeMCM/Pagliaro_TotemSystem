"use client";

import { useEffect } from "react";
import { syncOfflineOrders } from "../lib/sync-queue";

export function OfflineSyncManager() {
  useEffect(() => {
    // Tentar sincronizar quando o app carrega
    syncOfflineOrders();

    // Tentar sincronizar quando a rede volta
    const handleOnline = () => {
      console.log("[OfflineSyncManager] Rede detectada. Iniciando sincronização...");
      syncOfflineOrders();
    };

    window.addEventListener("online", handleOnline);

    // Tentar sincronizar a cada 5 minutos preventivamente
    const interval = setInterval(() => {
      syncOfflineOrders();
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      clearInterval(interval);
    };
  }, []);

  return null; // O componente não renderiza nada visualmente
}
