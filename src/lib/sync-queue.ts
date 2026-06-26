/**
 * Fila de Sincronização Local (Offline-First)
 * 
 * Permite que o Totem continue funcionando mesmo sem internet.
 * Pedidos são salvos no localStorage e sincronizados assim que a conexão retornar.
 */

const QUEUE_KEY = '@totem:offline_orders';

export interface OfflineOrder {
  id: string; // id local para controle
  timestamp: number;
  payload: any;
  attempts?: number;
}

/**
 * Adiciona um pedido à fila offline
 */
export function enqueueOrder(payload: any) {
  try {
    const existingStr = localStorage.getItem(QUEUE_KEY);
    const queue: OfflineOrder[] = existingStr ? JSON.parse(existingStr) : [];
    
    const newOrder: OfflineOrder = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      payload
    };
    
    queue.push(newOrder);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log(`[OfflineQueue] Pedido ${newOrder.id} adicionado à fila.`);
  } catch (error) {
    console.error('[OfflineQueue] Falha ao enfileirar pedido:', error);
  }
}

/**
 * Tenta sincronizar a fila offline com o servidor
 * Pode ser chamado via setTimeout, cron, ou no carregamento inicial da página.
 */
export async function syncOfflineOrders() {
  if (typeof window === 'undefined') return;
  if (!navigator.onLine) {
    console.log('[OfflineQueue] Sem conexão. Sincronização adiada.');
    return;
  }

  try {
    const existingStr = localStorage.getItem(QUEUE_KEY);
    if (!existingStr) return;
    
    let queue: OfflineOrder[] = JSON.parse(existingStr);
    if (queue.length === 0) return;
    
    console.log(`[OfflineQueue] Sincronizando ${queue.length} pedidos pendentes...`);
    
    const remainingQueue: OfflineOrder[] = [];
    
    for (const order of queue) {
      try {
        const res = await fetch('/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order.payload)
        });
        
        if (res.ok) {
          console.log(`[OfflineQueue] Pedido ${order.id} sincronizado com sucesso.`);
        } else {
          console.warn(`[OfflineQueue] Falha ao sincronizar ${order.id}. HTTP ${res.status}`);
          const attempts = (order.attempts || 0) + 1;
          if (attempts < 5) {
            remainingQueue.push({ ...order, attempts });
          } else {
            console.error(`[OfflineQueue] Pedido ${order.id} descartado após 5 tentativas.`);
          }
        }
      } catch (err) {
        console.error(`[OfflineQueue] Erro de rede ao sincronizar ${order.id}. Mantendo na fila.`);
        const attempts = (order.attempts || 0) + 1;
        if (attempts < 5) {
          remainingQueue.push({ ...order, attempts });
        } else {
          console.error(`[OfflineQueue] Pedido ${order.id} descartado após 5 falhas de rede.`);
        }
      }
    }
    
    if (remainingQueue.length > 0) {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));
    } else {
      localStorage.removeItem(QUEUE_KEY);
      console.log('[OfflineQueue] Fila esvaziada com sucesso.');
    }
  } catch (error) {
    console.error('[OfflineQueue] Erro grave durante a sincronização:', error);
  }
}
