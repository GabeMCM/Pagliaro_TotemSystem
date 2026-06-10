import { mulberry32 } from './engine';
import { CONFIG } from '../../data/config';

export interface LeafState {
  id: string;
  fallSecond: number;
  xPct: number;
  yPct: number;
  groundXPct: number;
  groundYPct: number;
  rotation: number;
  state: 'attached' | 'falling' | 'grounded' | 'drifting' | 'removed';
  seed: number;
}

export function generateDaySchedule(dayKey: string, baseSeed: number): LeafState[] {
  let dayHash = 0;
  for (let i = 0; i < dayKey.length; i++) {
    dayHash = Math.imul(31, dayHash) + dayKey.charCodeAt(i) | 0;
  }

  const prng = mulberry32(baseSeed ^ dayHash);
  const leaves: LeafState[] = [];
  const interval = CONFIG.ambiente.intervaloFolhaSeg;

  // 2 folhas caindo por minuto (a cada intervaloFolhaSeg segundos)
  for (let second = 0; second < 86400; second += interval) {
    leaves.push({
      id: `${dayKey}-${second}`,
      fallSecond: second,
      // Distribuir a copa na região correspondente ao SVG da árvore (X entre 5% e 35%, Y entre 30% e 65%)
      xPct: 0.05 + prng() * 0.30,
      yPct: 0.30 + prng() * 0.35,
      // Chão: espalhados na base da raiz (X entre 0% e 40%, Y perto de 90%)
      groundXPct: prng() * 0.40,
      groundYPct: 0.85 + prng() * 0.10,
      rotation: prng() * Math.PI * 2,
      state: 'attached',
      seed: prng()
    });
  }

  return leaves;
}

export function resolveLeavesState(leaves: LeafState[], currentDate: Date): void {
  // Corrigido para incluir milissegundos para cálculo ultra suave (sem engasgos de 1 em 1s)
  const currentSecondOfDay = currentDate.getHours() * 3600 + currentDate.getMinutes() * 60 + currentDate.getSeconds() + currentDate.getMilliseconds() / 1000;

  leaves.forEach(leaf => {
    if (currentSecondOfDay < leaf.fallSecond) {
      leaf.state = 'attached';
    } else {
      const age = currentSecondOfDay - leaf.fallSecond;

      if (age > 3600) {
        leaf.state = 'removed';
      } else if (age > 8) {
        leaf.state = 'grounded';
      } else {
        leaf.state = 'falling';
      }
    }
  });
}
