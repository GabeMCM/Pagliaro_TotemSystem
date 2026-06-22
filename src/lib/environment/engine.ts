// Motor Ambiental Core - Tick Singleton Global (Versão para Canvas)
import { ENV_COLORS } from '../../data/environment-palette';
import { CONFIG } from '../../data/config';
import { renderCanvas } from './canvasEngine';

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

export function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Variáveis de estado do vento interno
let currentWindTarget = 0;
let currentWind = 0;
let lastWindChange = 0;

// O Estado Ambiental que será lido pelo canvasEngine
export const ENV_STATE = {
  time: 0,
  nightOpacity: 0,
  sunProgress: 0,
  moonProgress: 0,
  moonAltitude: 0,
  windLow: 0,
  windMid: 0,
  windHigh: 0,
  windGround1: 0,
  windGround2: 0,
  baseWind: 0,
  windSweep: false,
  mound1: 0,
  mound2: 0,
  mound3: 0,
  colors: {
    trunk: [0, 0, 0],
    primary: [0, 0, 0],
    accent: [0, 0, 0],
    mountain1: [0, 0, 0],
    mountain2: [0, 0, 0],
    cloud: [0, 0, 0],
  },
  canopy: new Array(13).fill(0),
};

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

const { day: DAY, night: NIGHT, moonlight: MOONLIGHT } = ENV_COLORS;
const { dayRgba: DAY_A, nightRgba: NIGHT_A, moonlightRgba: MOONLIGHT_A } = ENV_COLORS;

function tick(time: number) {
  if (!isRunning) return;

  ENV_STATE.time = time;
  const now = new Date();
  const currentSecondOfDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
  
  const isSweeping = now.getMinutes() === CONFIG.ambiente.sweepMinuto && now.getSeconds() >= CONFIG.ambiente.sweepSegundoInicio;
  ENV_STATE.windSweep = isSweeping;

  // --- Lógica de Vento ---
  if (isSweeping) {
    currentWindTarget = 4.0 + Math.random() * 1.5;
    lastWindChange = time;
  } else if (time - lastWindChange > 2000 + Math.random() * 3000) {
    lastWindChange = time;
    const r = Math.random();
    if (r < 0.05) currentWindTarget = 0.1;
    else if (r < 0.65) currentWindTarget = 0.5 + Math.random() * 0.4;
    else currentWindTarget = 1.2 + Math.random() * 0.6;
  }
  
  currentWind += (currentWindTarget - currentWind) * (isSweeping ? 0.1 : 0.03);
  
  const speed = isSweeping ? 3 : 1;
  const osc1 = Math.sin((time * speed) / 199);
  const osc2 = Math.cos((time * speed) / 487);
  const osc3 = Math.sin((time * speed) / 991);
  const amplitude = currentWind * (isSweeping ? 0.4 : 0.25);

  ENV_STATE.windHigh = (currentWind * 1.5) + (osc1 * 0.4 + osc2 * 0.8 + osc3 * 0.5) * amplitude;
  
  const osc1Mid = Math.sin((time * speed - 300) / 199);
  const osc2Mid = Math.cos((time * speed - 300) / 487);
  ENV_STATE.windMid = (currentWind * 0.9) + (osc1Mid * 0.2 + osc2Mid * 0.9 + osc3 * 0.4) * amplitude;

  const osc2Low = Math.cos((time * speed - 600) / 487);
  ENV_STATE.windLow = (currentWind * 0.15) + (osc2Low * 0.5 + osc3 * 0.2) * (amplitude * 0.3);

  ENV_STATE.baseWind = currentWind + (osc2 * amplitude);

  const grassFlutter1 = Math.sin((time - 500) / 180) * (currentWind * 0.15);
  const grassFlutter2 = Math.sin((time + 800) / 130) * (currentWind * 0.20);
  
  ENV_STATE.windGround1 = (currentWind + grassFlutter1) * 0.45;
  ENV_STATE.windGround2 = (currentWind + grassFlutter2) * 0.35;

  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  
  // --- Day / Night Cycle ---
  let nightOpacity = 0;
  if (minutesSinceMidnight >= 1140 || minutesSinceMidnight <= 300) {
    nightOpacity = 1;
  } else if (minutesSinceMidnight > 300 && minutesSinceMidnight < 420) {
    nightOpacity = 1 - ((minutesSinceMidnight - 300) / 120);
  } else if (minutesSinceMidnight > 1020 && minutesSinceMidnight < 1140) {
    nightOpacity = (minutesSinceMidnight - 1020) / 120;
  }
  ENV_STATE.nightOpacity = nightOpacity;

  // --- Celestial Bodies ---
  let sunProgress = -0.1;
  if (minutesSinceMidnight >= 360 && minutesSinceMidnight <= 1080) {
    sunProgress = (minutesSinceMidnight - 360) / 720;
  }
  
  let moonProgress = -0.1;
  if (minutesSinceMidnight > 1080) {
    moonProgress = (minutesSinceMidnight - 1080) / 720;
  } else if (minutesSinceMidnight < 360) {
    moonProgress = (minutesSinceMidnight + 360) / 720;
  }

  ENV_STATE.sunProgress = sunProgress;
  ENV_STATE.moonProgress = moonProgress;

  const moonAltitude = moonProgress >= 0 ? Math.pow(Math.sin(moonProgress * Math.PI), 0.4) : 0;
  ENV_STATE.moonAltitude = moonAltitude;
  
  const currentNightTrunk = lerpColorArray(NIGHT.trunk, MOONLIGHT.trunk, moonAltitude);
  const currentNightPrimary = lerpColorArray(NIGHT.primary, MOONLIGHT.primary, moonAltitude);
  const currentNightAccent = lerpColorArray(NIGHT.accent, MOONLIGHT.accent, moonAltitude);
  const currentNightMountain1 = lerpColorArray(NIGHT.mountain1, MOONLIGHT.mountain1, moonAltitude);
  const currentNightMountain2 = lerpColorArray(NIGHT.mountain2, MOONLIGHT.mountain2, moonAltitude);
  const currentNightCloud = lerpColorArray(NIGHT.cloud, MOONLIGHT.cloud, moonAltitude);

  // Armazena no estado em formato Array numérico para Canvas draw speed
  ENV_STATE.colors.trunk = lerpColorArray(DAY.trunk, currentNightTrunk, nightOpacity);
  ENV_STATE.colors.primary = lerpColorArray(DAY.primary, currentNightPrimary, nightOpacity);
  ENV_STATE.colors.accent = lerpColorArray(DAY.accent, currentNightAccent, nightOpacity);
  ENV_STATE.colors.mountain1 = lerpColorArray(DAY.mountain1, currentNightMountain1, nightOpacity);
  ENV_STATE.colors.mountain2 = lerpColorArray(DAY.mountain2, currentNightMountain2, nightOpacity);
  ENV_STATE.colors.cloud = lerpColorArray(DAY.cloud, currentNightCloud, nightOpacity);

  // UI Colors (Aceleradas na transição) AINDA APLICADAS AO DOM para o modal de vidro funcionar
  let uiNightOpacity = nightOpacity;
  if (nightOpacity > 0 && nightOpacity < 1) {
    uiNightOpacity = Math.max(0, Math.min(1, (nightOpacity - 0.48) * 25));
    uiNightOpacity = uiNightOpacity * uiNightOpacity * (3 - 2 * uiNightOpacity);
  }

  const currentNightShadow = lerpColorRgbaArray(NIGHT_A.shadow, MOONLIGHT_A.shadow, moonAltitude);
  const currentNightGlass = lerpColorRgbaArray(NIGHT_A.glass, MOONLIGHT_A.glass, moonAltitude);
  const currentNightText = lerpColorArray(NIGHT.text, MOONLIGHT.text, moonAltitude);
  const currentNightTextMuted = lerpColorArray(NIGHT.textMuted, MOONLIGHT.textMuted, moonAltitude);
  const currentNightCard = lerpColorRgbaArray(NIGHT_A.card, MOONLIGHT_A.card, moonAltitude);
  const currentNightBorder = lerpColorRgbaArray(NIGHT_A.border, MOONLIGHT_A.border, moonAltitude);

  const root = document.documentElement;
  root.style.setProperty('--ui-shadow', lerpColorRgba(DAY_A.shadow, currentNightShadow, uiNightOpacity));
  root.style.setProperty('--ui-glass', lerpColorRgba(DAY_A.glass, currentNightGlass, uiNightOpacity));
  root.style.setProperty('--ui-text', lerpColor(DAY.text, currentNightText, uiNightOpacity));
  root.style.setProperty('--ui-text-muted', lerpColor(DAY.textMuted, currentNightTextMuted, uiNightOpacity));
  root.style.setProperty('--ui-card', lerpColorRgba(DAY_A.card, currentNightCard, uiNightOpacity));
  root.style.setProperty('--ui-border', lerpColorRgba(DAY_A.border, currentNightBorder, uiNightOpacity));

  // --- Canopy Lifecycle ---
  const activeCircle = Math.floor(now.getHours() / 2) + 1; // De 1 a 12
  const minutesInWindow = (now.getHours() % 2) * 60 + now.getMinutes();
  const step = Math.floor(minutesInWindow / 10);
  const activeCircleOpacity = 1 - (step / 12);
  
  for (let i = 1; i <= 12; i++) {
    let opacity = 1;
    if (i < activeCircle) opacity = 0;
    else if (i === activeCircle) opacity = activeCircleOpacity;
    ENV_STATE.canopy[i] = opacity;
  }

  // --- Ground Darkness (Folhas varridas) ---
  let groundDarkness = (now.getMinutes() * 60 + now.getSeconds()) / 3600;
  if (isSweeping) {
    const sweepProgress = (now.getSeconds() + now.getMilliseconds() / 1000 - 50) / 10;
    groundDarkness = Math.max(0, groundDarkness * (1 - sweepProgress));
  }
  
  ENV_STATE.mound1 = Math.min(1, Math.max(0, groundDarkness * 3)) * 0.8;
  ENV_STATE.mound2 = Math.min(1, Math.max(0, (groundDarkness - 0.333) * 3)) * 0.8;
  ENV_STATE.mound3 = Math.min(1, Math.max(0, (groundDarkness - 0.666) * 3)) * 0.8;

  // Renderiza o Canvas (loop unificado — um único rAF para tudo)
  renderCanvas(time);

  rafId = requestAnimationFrame(tick);
}
