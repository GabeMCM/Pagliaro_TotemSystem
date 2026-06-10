// Motor Ambiental Core - Tick Singleton Global
import { ENV_COLORS } from '../../data/environment-palette';
import { CONFIG } from '../../data/config';

let rafId: number | null = null;
let isRunning = false;
let mountCount = 0;

export function startEnvironment() {
  mountCount++;
  if (!isRunning) {
    isRunning = true;
    tick(performance.now());
  }
}

export function stopEnvironment() {
  mountCount--;
  if (mountCount <= 0) {
    isRunning = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    mountCount = 0;
  }
}

// PRNG simples e determinístico sugerido no Master Prompt (mulberry32)
export function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Variáveis de estado do vento
let currentWindTarget = 0;
let currentWind = 0;
let lastWindChange = 0;

// Geometria da Copa da Árvore (Reflete exatamente o viewBox de Layers.tsx)
const canopyCircles = [
  null, // 0 não usado
  { cx: 230, cy: 260 }, // 1 (Branch 2 - descido para a base e engordado)
  { cx: 110, cy: 180 }, // 2 (Branch 3)
  { cx: 120, cy: 280 }, // 3 (Branch 1)
  { cx: 100, cy: 320 }, // 4 (Branch 1)
  { cx: 340, cy: 120 }, // 5 (Branch 2)
  { cx: 80, cy: 250 },  // 6 (Branch 1)
  { cx: 280, cy: 180 }, // 7 (Branch 2)
  { cx: 200, cy: 200 }, // 8 (Trunk Canopy Médio)
  { cx: 70, cy: 150 },  // 9 (Branch 3)
  { cx: 310, cy: 160 }, // 10 (Right Giant)
  { cx: 120, cy: 220 }, // 11 (Left Giant)
  { cx: 200, cy: 100 }  // 12 (Central Giant)
];

// Hybrid Particle System: JS define o ponto exato da DOM e CSS faz a animação fluida
type HybridParticle = {
  active: boolean;
  spawnTime: number;
  duration: number;
};
const particles: HybridParticle[] = Array.from({ length: 40 }).map(() => ({
  active: false, spawnTime: 0, duration: 0
}));

// Funções utilitárias de cor para interpolação Dia/Noite
const lerpColorArray = (c1: readonly number[], c2: readonly number[], t: number): number[] => {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t)
  ];
};

const lerpColorRgbaArray = (c1: readonly number[], c2: readonly number[], t: number): number[] => {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
    c1[3] + (c2[3] - c1[3]) * t
  ];
};

const lerpColor = (c1: readonly number[], c2: readonly number[], t: number) => {
  const c = lerpColorArray(c1, c2, t);
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

const lerpColorRgba = (c1: readonly number[], c2: readonly number[], t: number) => {
  const c = lerpColorRgbaArray(c1, c2, t);
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3].toFixed(3)})`;
};


// Aliases da paleta centralizada (ENV_COLORS) para manter legibilidade no loop de 60fps
const { day: DAY, night: NIGHT, moonlight: MOONLIGHT } = ENV_COLORS;
const { dayRgba: DAY_A, nightRgba: NIGHT_A, moonlightRgba: MOONLIGHT_A } = ENV_COLORS;

// Tick loop puro (fora do lifecycle do React)
function tick(time: number) {
  if (!isRunning) return;

  const now = new Date();
  
  // A montanha acumula 120 folhas por hora. Zera a cada hora.
  const currentSecondOfDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
  const totalLeavesFallenToday = Math.floor(currentSecondOfDay / CONFIG.ambiente.intervaloFolhaSeg);
  
  // Nos últimos 10 segundos da hora, o vento varre a montanha e forma uma tempestade
  const isSweeping = now.getMinutes() === CONFIG.ambiente.sweepMinuto && now.getSeconds() >= CONFIG.ambiente.sweepSegundoInicio;

  // --- Lógica de Vento (5% calmo, 60% médio, 35% forte, Tempestade no Sweeping) ---
  if (isSweeping) {
    currentWindTarget = 4.0 + Math.random() * 1.5; // Rajadas agressivas na tempestade
    lastWindChange = time; // Força atualização frenética
  } else if (time - lastWindChange > 2000 + Math.random() * 3000) {
    lastWindChange = time;
    const r = Math.random();
    if (r < 0.05) currentWindTarget = 0.1; // Pouco vento
    else if (r < 0.65) currentWindTarget = 0.5 + Math.random() * 0.4; // Médio
    else currentWindTarget = 1.2 + Math.random() * 0.6; // Forte
  }
  
  // --- Física Contínua (Vento Orgânico e Complexo) ---
  // Aceleração/Desaceleração natural para a rajada atual
  currentWind += (currentWindTarget - currentWind) * (isSweeping ? 0.1 : 0.03);
  
  // Para quebrar o movimento de "pêndulo robótico", usamos a soma de 3 ondas
  // senoidais com frequências (divisores) primas. Isso cria um movimento pseudo-aleatório (Turbulência)
  const speed = isSweeping ? 3 : 1;
  const osc1 = Math.sin((time * speed) / 199); // Vibrações rápidas nas pontas
  const osc2 = Math.cos((time * speed) / 487); // Balanço primário da copa
  const osc3 = Math.sin((time * speed) / 991); // Empurrões longos de massas de ar

  const amplitude = currentWind * (isSweeping ? 0.4 : 0.25);

  // Criamos "Fases" diferentes. O vento bate no topo primeiro, e centésimos de segundo
  // depois ele reflete no meio, criando um movimento de "chicote" em vez de girar um bloco sólido.
  
  // Vento do Topo (Mais forte e recebe todas as frequências)
  const windHigh = (currentWind * 1.5) + (osc1 * 0.4 + osc2 * 0.8 + osc3 * 0.5) * amplitude;
  
  // Vento do Meio (Com atraso de tempo na onda para dessincronizar do topo)
  const osc1Mid = Math.sin((time * speed - 300) / 199);
  const osc2Mid = Math.cos((time * speed - 300) / 487);
  const windMid = (currentWind * 0.9) + (osc1Mid * 0.2 + osc2Mid * 0.9 + osc3 * 0.4) * amplitude;

  // Vento da Base (O tronco é RÍGIDO. Reage apenas aos empurrões longos e com muita inércia)
  const osc2Low = Math.cos((time * speed - 600) / 487);
  const windLow = (currentWind * 0.15) + (osc2Low * 0.5 + osc3 * 0.2) * (amplitude * 0.3);

  const baseWind = currentWind + (osc2 * amplitude); // Genérico para emissão de folhas

  // Físicas Independentes da Grama (Delay/Senoide diferente para não colar com a árvore)
  const grassFlutter1 = Math.sin((time - 500) / 180) * (currentWind * 0.15);
  const grassFlutter2 = Math.sin((time + 800) / 130) * (currentWind * 0.20);
  
  // Multiplicadores reduzidos para suavizar o ângulo do capim
  const windGround1 = (currentWind + grassFlutter1) * 0.45;
  const windGround2 = (currentWind + grassFlutter2) * 0.35;

  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const dayPhase = minutesSinceMidnight / 1440;
  document.documentElement.style.setProperty('--day-phase', dayPhase.toFixed(4));
  
  // --- Day / Night Cycle ---
  let nightOpacity = 0;
  if (minutesSinceMidnight >= 1140 || minutesSinceMidnight <= 300) { // Antes das 05h ou após 19h
    nightOpacity = 1;
  } else if (minutesSinceMidnight > 300 && minutesSinceMidnight < 420) { // 05h às 07h (Amanhecer)
    nightOpacity = 1 - ((minutesSinceMidnight - 300) / 120);
  } else if (minutesSinceMidnight > 1020 && minutesSinceMidnight < 1140) { // 17h às 19h (Anoitecer)
    nightOpacity = (minutesSinceMidnight - 1020) / 120;
  }
  document.documentElement.style.setProperty('--night-opacity', nightOpacity.toFixed(3));

  // --- Celestial Bodies (Sun and Moon) ---
  // Sol nasce às 06:00 (360) e se põe às 18:00 (1080)
  let sunProgress = -0.1;
  if (minutesSinceMidnight >= 360 && minutesSinceMidnight <= 1080) {
    sunProgress = (minutesSinceMidnight - 360) / 720;
  }
  
  // Lua nasce às 18:00 (1080) e se põe às 06:00 (360)
  let moonProgress = -0.1;
  if (minutesSinceMidnight > 1080) {
    moonProgress = (minutesSinceMidnight - 1080) / 720;
  } else if (minutesSinceMidnight < 360) {
    moonProgress = (minutesSinceMidnight + 360) / 720; // Math: (minutes + 1440 - 1080) / 720
  }

  const calcArc = (progress: number, offset: number) => {
    if (progress < 0) return `translate(50vw, 150vh)`; // Escondido bem abaixo da tela
    
    // Converte vw e vh diretos em Pixels no Javascript para impedir que 
    // navegadores com versões antigas travem no CSS calc() do Transform.
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    
    const x = (10 + (progress * 80)) * vw; // Da montanha esquerda (10vw) à direita (90vw)
    const y = (80 - Math.sin(progress * Math.PI) * 70) * vh; // Começa em 80vh, sobe até 10vh, cai pra 80vh
    
    return `translate(${x - offset}px, ${y - offset}px)`;
  };

  document.documentElement.style.setProperty('--sun-transform', calcArc(sunProgress, 60));
  document.documentElement.style.setProperty('--moon-transform', calcArc(moonProgress, 40));
  
  const root = document.documentElement;
  root.style.setProperty('--wind-low', windLow.toFixed(3));
  root.style.setProperty('--wind-mid', windMid.toFixed(3));
  root.style.setProperty('--wind-high', windHigh.toFixed(3));
  
  // Repassando as físicas da grama pro CSS
  root.style.setProperty('--wind-ground-1', windGround1.toFixed(3));
  root.style.setProperty('--wind-ground-2', windGround2.toFixed(3));
  
  root.style.setProperty('--night-opacity', nightOpacity.toFixed(3));

  // Calcula a intensidade da lua (0 = escondida, 1 = topo do céu)
  const moonAltitude = moonProgress >= 0 ? Math.sin(moonProgress * Math.PI) : 0;
  
  // Calcula a cor da noite atual mesclando a escuridão total com a luz da lua (Retorna arrays numéricos)
  const currentNightTrunk = lerpColorArray(NIGHT.trunk, MOONLIGHT.trunk, moonAltitude);
  const currentNightPrimary = lerpColorArray(NIGHT.primary, MOONLIGHT.primary, moonAltitude);
  const currentNightAccent = lerpColorArray(NIGHT.accent, MOONLIGHT.accent, moonAltitude);
  const currentNightMountain1 = lerpColorArray(NIGHT.mountain1, MOONLIGHT.mountain1, moonAltitude);
  const currentNightMountain2 = lerpColorArray(NIGHT.mountain2, MOONLIGHT.mountain2, moonAltitude);
  const currentNightCloud = lerpColorArray(NIGHT.cloud, MOONLIGHT.cloud, moonAltitude);
  const currentNightShadow = lerpColorRgbaArray(NIGHT_A.shadow, MOONLIGHT_A.shadow, moonAltitude);
  const currentNightGlass = lerpColorRgbaArray(NIGHT_A.glass, MOONLIGHT_A.glass, moonAltitude);
  const currentNightText = lerpColorArray(NIGHT.text, MOONLIGHT.text, moonAltitude);
  const currentNightTextMuted = lerpColorArray(NIGHT.textMuted, MOONLIGHT.textMuted, moonAltitude);
  const currentNightCard = lerpColorRgbaArray(NIGHT_A.card, MOONLIGHT_A.card, moonAltitude);
  const currentNightBorder = lerpColorRgbaArray(NIGHT_A.border, MOONLIGHT_A.border, moonAltitude);

  // Aplica as cores finais (Interpolação entre DIA e a NOITE ATUAL)
  root.style.setProperty('--tree-trunk', lerpColor(DAY.trunk, currentNightTrunk, nightOpacity));
  root.style.setProperty('--tree-primary', lerpColor(DAY.primary, currentNightPrimary, nightOpacity));
  root.style.setProperty('--tree-accent', lerpColor(DAY.accent, currentNightAccent, nightOpacity));

  root.style.setProperty('--mountain-1', lerpColor(DAY.mountain1, currentNightMountain1, nightOpacity));
  root.style.setProperty('--mountain-2', lerpColor(DAY.mountain2, currentNightMountain2, nightOpacity));
  
  root.style.setProperty('--cloud-color', lerpColor(DAY.cloud, currentNightCloud, nightOpacity));
  root.style.setProperty('--ui-shadow', lerpColorRgba(DAY_A.shadow, currentNightShadow, nightOpacity));
  root.style.setProperty('--ui-glass', lerpColorRgba(DAY_A.glass, currentNightGlass, nightOpacity));
  
  root.style.setProperty('--ui-text', lerpColor(DAY.text, currentNightText, nightOpacity));
  root.style.setProperty('--ui-text-muted', lerpColor(DAY.textMuted, currentNightTextMuted, nightOpacity));
  root.style.setProperty('--ui-card', lerpColorRgba(DAY_A.card, currentNightCard, nightOpacity));
  root.style.setProperty('--ui-border', lerpColorRgba(DAY_A.border, currentNightBorder, nightOpacity));

  root.style.setProperty('--ground-darkness', Math.min(1, nightOpacity + 0.3).toFixed(3));
  document.documentElement.style.setProperty('--wind-x', (baseWind * 15 - 5).toFixed(2) + 'px');
  
  // --- Canopy Lifecycle (12 Círculos, 2 Horas por Círculo) ---
  const activeCircle = Math.floor(now.getHours() / 2) + 1; // De 1 a 12
  const minutesInWindow = (now.getHours() % 2) * 60 + now.getMinutes();
  const step = Math.floor(minutesInWindow / 10); // 12 degraus de 10 minutos (0 a 11)
  const activeCircleOpacity = 1 - (step / 12);
  
  for (let i = 1; i <= 12; i++) {
    let opacity = 1;
    if (i < activeCircle) opacity = 0;
    else if (i === activeCircle) opacity = activeCircleOpacity;
    
    document.documentElement.style.setProperty(`--canopy-${i}`, opacity.toFixed(3));
  }

  // --- Ground Darkness (Acumula durante a hora e voa na tempestade) ---
  let groundDarkness = (now.getMinutes() * 60 + now.getSeconds()) / 3600;
  if (isSweeping) {
    const sweepProgress = (now.getSeconds() + now.getMilliseconds() / 1000 - 50) / 10;
    groundDarkness = Math.max(0, groundDarkness * (1 - sweepProgress));
  }
  
  // Dividimos o acúmulo em 3 fases (0-33%, 33-66%, 66-100%) para criar os montinhos menores primeiro
  // A opacidade máxima final de cada montinho é 80% (0.8) para manter a leveza
  const m1 = Math.min(1, Math.max(0, groundDarkness * 3)) * 0.8;
  const m2 = Math.min(1, Math.max(0, (groundDarkness - 0.333) * 3)) * 0.8;
  const m3 = Math.min(1, Math.max(0, (groundDarkness - 0.666) * 3)) * 0.8;
  
  document.documentElement.style.setProperty('--mound-1', m1.toFixed(4));
  document.documentElement.style.setProperty('--mound-2', m2.toFixed(4));
  document.documentElement.style.setProperty('--mound-3', m3.toFixed(4));
  document.documentElement.style.setProperty('--wind-sweep', isSweeping ? '1' : '0');

  // --- Hybrid Particle System (JS Spawns, CSS Animates) ---
  let spawnChance = 0.02; 
  if (isSweeping) spawnChance = 0.3; 
  else if (currentWind > 1.2) spawnChance = 0.08; 

  if (Math.random() < spawnChance) {
    const pIndex = particles.findIndex(p => !p.active);
    if (pIndex !== -1) {
      const p = particles[pIndex];
      p.active = true;
      p.spawnTime = time;
      p.duration = 10 + Math.random() * 8; // CSS vai demorar isso tudo

      // Acha a DOM exata de um círculo vivo e pega as coordenadas
      const activeCircleIndices = canopyCircles.map((circle, index) => {
        if (!circle) return null;
        const opacityStr = root.style.getPropertyValue(`--canopy-${index}`);
        const opacity = opacityStr ? parseFloat(opacityStr) : 1;
        if (opacity > 0.1) return index;
        return null;
      }).filter(c => c !== null) as number[];

      let startX = 0;
      let startY = 0;
      if (activeCircleIndices.length > 0) {
        const chosenIndex = activeCircleIndices[Math.floor(Math.random() * activeCircleIndices.length)];
        const circleEl = document.getElementById(`canopy-circle-${chosenIndex}`);
        if (circleEl) {
          const rect = circleEl.getBoundingClientRect();
          startX = rect.left + Math.random() * rect.width;
          startY = rect.top + Math.random() * rect.height;
        }
      }

      if (startX === 0) {
        // Se a árvore estiver pelada ou algo falhar, nasce no centro da árvore (fallback)
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;
        startX = (15 + Math.random() * 20) * vw;
        startY = (35 + Math.random() * 20) * vh;
      }

      const el = document.getElementById(`falling-leaf-${pIndex}`);
      if (el) {
        el.style.display = 'block'; // Remove qualquer ghost style (HMR)

        const windDrift = (currentWind * 15 + 10) + Math.random() * 20; // Em VW
        const scale = 0.3 + Math.random() * 0.7;
        const opacity = 0.3 + (scale * 0.5);
        const spin = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540);

        el.style.setProperty('--start-x', startX + 'px');
        el.style.setProperty('--start-y', startY + 'px');
        el.style.setProperty('--wind-drift', windDrift + 'vw');
        el.style.setProperty('--fall-duration', p.duration + 's');
        el.style.setProperty('--spin', spin + 'deg');
        el.style.setProperty('--leaf-scale', scale.toString());
        el.style.setProperty('--leaf-opacity', opacity.toFixed(2));
        
        // Reinicia a animação CSS removendo e adicionando a classe
        el.classList.remove('anim-falling-leaf');
        void el.offsetWidth; // Force reflow (Magia do DOM)
        el.classList.add('anim-falling-leaf');
      }
    }
  }

  // Limpa partículas que terminaram sua animação CSS
  particles.forEach((p, i) => {
    if (p.active && time - p.spawnTime > p.duration * 1000) {
      p.active = false;
      const el = document.getElementById(`falling-leaf-${i}`);
      if (el) el.classList.remove('anim-falling-leaf');
    }
  });

  // --- Rotação Física dos Galhos ---
  const b1 = document.getElementById('branch-1');
  if (b1) b1.setAttribute('transform', `rotate(${windMid * 0.8}, 185, 400)`);
  
  const b2 = document.getElementById('branch-2');
  if (b2) b2.setAttribute('transform', `rotate(${windMid * 1.5}, 205, 300)`);
  
  const b3 = document.getElementById('branch-3');
  if (b3) b3.setAttribute('transform', `rotate(${windHigh * 2.5}, 200, 210)`);

  rafId = requestAnimationFrame(tick);
}
