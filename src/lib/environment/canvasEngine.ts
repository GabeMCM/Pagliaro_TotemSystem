import { ENV_STATE } from './engine';
import { CONFIG } from '../../data/config';
import { ENV_STATIC } from '../../data/environment-palette';

let isRunning = false;
let ctx: CanvasRenderingContext2D | null = null;
let canvasWidth = 0;
let canvasHeight = 0;
let lastFrameTime = 0;

// Setup objects that only need to be computed once
const STATIC_STARS = Array.from({ length: CONFIG.canvas.starCount }).map((_, i) => ({
  x: Math.random(),
  y: Math.random() * 0.6, // Top 60% of screen
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 5,
  duration: 2 + Math.random() * 4,
}));

const STATIC_BLADES = Array.from({ length: CONFIG.canvas.grassBlades }).map((_, i) => {
  const isThick = Math.random() > 0.85;
  const height = isThick ? (30 + Math.random() * 40) : (10 + Math.random() * 30);
  const width = isThick ? (4 + Math.random() * 4) : (1 + Math.random() * 2);
  const x = Math.random();
  const swayMultiplier = height / 40;
  const layer = Math.random() > 0.5 ? 1 : 2;
  return { x, height, width, swayMultiplier, isThick, layer };
});

const STATIC_CLOUDS = Array.from({ length: CONFIG.canvas.cloudCount }).map((_, i) => {
  const layerSeed = Math.random();
  let depth = 0;
  let scale, speed, opacity, top;
  
  if (layerSeed < 0.4) {
    depth = 0; scale = 0.5 + Math.random() * 0.5; speed = 10 + Math.random() * 5;
    opacity = 0.15 + Math.random() * 0.15; top = Math.random() * 0.6;
  } else if (layerSeed < 0.8) {
    depth = 1; scale = 1.0 + Math.random() * 0.8; speed = 25 + Math.random() * 15;
    opacity = 0.25 + Math.random() * 0.15; top = Math.random() * 0.5;
  } else {
    depth = 2; scale = 1.8 + Math.random() * 1.2; speed = 45 + Math.random() * 25;
    opacity = 0.40 + Math.random() * 0.20; top = Math.random() * 0.3;
  }

  const delay = -(Math.random() * speed);
  const isCluster = Math.random() > 0.7;
  const numCircles = isCluster ? 10 + Math.floor(Math.random() * 12) : 4 + Math.floor(Math.random() * 5);
  
  const circles = Array.from({ length: numCircles }).map(() => ({
    cx: (Math.random() * 140 - 70), // Relative to cloud center
    cy: (Math.random() * 40 - 20),
    r: 15 + Math.random() * 35,
  }));

  return { top, scale, speed, delay, opacity, circles, depth, xOffset: 0 };
});

const canopyCircles = [
  null,
  { cx: 230, cy: 260, r: 70, type: 'primary', alpha: 0.8 }, // 1
  { cx: 110, cy: 180, r: 60, type: 'accent', alpha: 0.6 }, // 2
  { cx: 120, cy: 280, r: 50, type: 'accent', alpha: 0.6 }, // 3
  { cx: 100, cy: 320, r: 60, type: 'primary', alpha: 0.8 }, // 4
  { cx: 340, cy: 120, r: 50, type: 'accent', alpha: 0.8 }, // 5
  { cx: 80, cy: 250, r: 70, type: 'primary', alpha: 0.7 }, // 6
  { cx: 280, cy: 180, r: 60, type: 'accent', alpha: 0.6 }, // 7
  { cx: 200, cy: 200, r: 65, type: 'accent', alpha: 0.8 }, // 8
  { cx: 70, cy: 150, r: 75, type: 'primary', alpha: 0.7 }, // 9
  { cx: 310, cy: 160, r: 120, type: 'primary', alpha: 0.6 }, // 10
  { cx: 120, cy: 220, r: 130, type: 'primary', alpha: 0.9 }, // 11
  { cx: 200, cy: 100, r: 130, type: 'primary', alpha: 0.8 } // 12
];

type Particle = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
  rotation: number;
  spinSpeed: number;
  colorType: 'primary' | 'accent';
};

const particles: Particle[] = Array.from({ length: CONFIG.canvas.leafParticles }).map(() => ({
  active: false, x: 0, y: 0, vx: 0, vy: 0, scale: 1, opacity: 1, rotation: 0, spinSpeed: 0, colorType: 'primary'
}));

export function startCanvas(canvas: HTMLCanvasElement) {
  if (isRunning) return;
  isRunning = true;
  ctx = canvas.getContext('2d', { alpha: false }); // Opaque optimization
  if (!ctx) return;

  const resize = () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  lastFrameTime = performance.now();
}

export function stopCanvas() {
  isRunning = false;
  ctx = null;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

const SKY_DAY_FROM = hexToRgb(ENV_STATIC.sky.dayFrom);
const SKY_DAY_TO = hexToRgb(ENV_STATIC.sky.dayTo);
const SKY_NIGHT_FROM = hexToRgb(ENV_STATIC.sky.nightFrom);
const SKY_NIGHT_TO = hexToRgb(ENV_STATIC.sky.nightTo);

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number) {
  return `rgb(${Math.round(c1[0] + (c2[0] - c1[0]) * t)}, ${Math.round(c1[1] + (c2[1] - c1[1]) * t)}, ${Math.round(c1[2] + (c2[2] - c1[2]) * t)})`;
}

function arrayToRgb(arr: number[]) {
  return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;
}

export function renderCanvas(time: number) {
  const context = ctx;
  if (!isRunning || !context) return;
  
  // Frame pacing
  const dt = (time - lastFrameTime) / 1000;
  // If we want 30fps target, we could skip frames here, but let's go 60fps for max fluidity as requested
  lastFrameTime = time;

  const state = ENV_STATE;
  
  // 1. Sky
  const grad = context.createLinearGradient(0, 0, 0, canvasHeight);
  const topColor = lerpColor(SKY_DAY_FROM, SKY_NIGHT_FROM, state.nightOpacity);
  const bottomColor = lerpColor(SKY_DAY_TO, SKY_NIGHT_TO, state.nightOpacity);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  context.fillStyle = grad;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. Stars
  if (state.nightOpacity > 0) {
    context.fillStyle = `rgba(255, 255, 255, ${state.nightOpacity})`;
    STATIC_STARS.forEach(star => {
      // Pulse calculation
      const pulse = 0.5 + 0.5 * Math.sin((time / 1000 * Math.PI * 2 / star.duration) + star.delay);
      context.globalAlpha = (0.5 + pulse * 0.5) * state.nightOpacity;
      context.beginPath();
      context.arc(star.x * canvasWidth, star.y * canvasHeight, star.size, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1.0;
  }

  // 3. Sun and Moon
  const drawCelestial = (progress: number, size: number, isSun: boolean) => {
    if (progress < 0) return;
    const x = (0.1 + progress * 0.8) * canvasWidth;
    const y = (0.8 - Math.sin(progress * Math.PI) * 0.7) * canvasHeight;
    
    context.save();
    context.translate(x, y);
    if (isSun) {
      const sGrad = context.createRadialGradient(0, 0, 0, 0, 0, size);
      sGrad.addColorStop(0, '#FFFDEB');
      sGrad.addColorStop(0.35, '#FFDF80');
      sGrad.addColorStop(1, 'rgba(255,223,128,0)');
      context.fillStyle = sGrad;
      context.beginPath();
      context.arc(0, 0, size, 0, Math.PI*2);
      context.fill();
    } else {
      // Glow suave da Lua (Gradiente Radial)
      const mGrad = context.createRadialGradient(0, 0, size * 0.45, 0, 0, size * 1.5);
      mGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
      mGrad.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = mGrad;
      context.beginPath();
      context.arc(0, 0, size * 1.5, 0, Math.PI*2);
      context.fill();

      // Núcleo sólido da Lua
      context.fillStyle = ENV_STATIC.celestial.moonColor;
      context.beginPath();
      context.arc(0, 0, size * 0.45, 0, Math.PI*2);
      context.fill();
    }
    context.restore();
  };

  drawCelestial(state.sunProgress, 180, true);
  drawCelestial(state.moonProgress, 160, false);

  // 4. Mountains
  context.save();
  context.translate(0, canvasHeight - (canvasHeight * 0.4));
  context.scale(canvasWidth / 1000, (canvasHeight * 0.4) / 300);
  
  // Efeito de luz do Luar (Rim light) reagindo à altura da lua
  if (state.moonAltitude > 0.01) {
    context.shadowColor = `rgba(220, 235, 255, ${state.moonAltitude * 0.25})`; // Mais transparente (suave)
    context.shadowBlur = 35; // Espalhamento bem maior
    context.shadowOffsetY = -10; // Brilho projetado para cima
  }
  
  context.fillStyle = arrayToRgb(state.colors.mountain1);
  const m1 = new Path2D("M 0 300 L 0 200 Q 150 100 350 220 T 700 150 T 1000 250 L 1000 300 Z");
  context.fill(m1);

  // Reajusta levemente a sombra para a montanha da frente
  if (state.moonAltitude > 0.01) {
    context.shadowBlur = 45;
    context.shadowOffsetY = -15;
  }

  context.fillStyle = arrayToRgb(state.colors.mountain2);
  const m2 = new Path2D("M 0 300 L 0 250 Q 200 150 450 270 T 850 180 T 1000 280 L 1000 300 Z");
  context.fill(m2);
  
  context.restore();

  // 5. Clouds
  context.fillStyle = arrayToRgb(state.colors.cloud);
  
  // Escala de resolução para telas 4K (evita stuttering de subpixel)
  const resolutionScale = canvasWidth / 1920;

  STATIC_CLOUDS.forEach(c => {
    // Calculo determinístico amarrado ao tempo global. Impossível haver stuttering por variação de frame-rate.
    const timeSec = state.time / 1000;
    const worldX = (timeSec + c.delay) * (c.speed * resolutionScale);
    
    const cloudW = 400 * c.scale;
    const totalW = canvasWidth + cloudW * 2;
    // O Modulo garante um loop infinito impecável sem pular quadros
    const xPos = ((worldX % totalW) + totalW) % totalW - cloudW;
    const yPos = c.top * canvasHeight;

    context.globalAlpha = c.opacity;
    context.save();
    context.translate(xPos, yPos);
    context.scale(c.scale, c.scale);
    
    context.beginPath();
    c.circles.forEach(circle => {
      context.moveTo(circle.cx + circle.r, circle.cy);
      context.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
    });
    context.fill();
    context.restore();
  });
  context.globalAlpha = 1.0;

  // Setup Tree Transform Space
  // Tree was: left 2%, bottom 0, width 45%, height 70%
  const treeW = canvasWidth * 0.45;
  const treeH = canvasHeight * 0.70;
  const treeX = canvasWidth * 0.02;
  const treeY = canvasHeight - treeH;
  
  // Scale factor to map SVG 400x600 to treeW x treeH
  // SVG was viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet"
  const scale = Math.min(treeW / 400, treeH / 600);
  const dx = treeX + (treeW - 400 * scale) / 2;
  const dy = canvasHeight - 600 * scale;

  context.save();
  // Entire tree wind rotation (origin-bottom)
  context.translate(treeX + treeW / 2, treeY + treeH);
  context.rotate(state.windLow * 1.5 * Math.PI / 180);
  context.translate(-(treeX + treeW / 2), -(treeY + treeH));
  
  context.translate(dx, dy);
  context.scale(scale, scale);

  // Rim light filter
  if (state.moonAltitude > 0) {
    context.shadowColor = `rgba(220, 235, 255, ${state.moonAltitude * 0.2})`;
    context.shadowBlur = 15;
    context.shadowOffsetY = -6;
  }

  // Draw Tree Branches and Trunk
  context.fillStyle = arrayToRgb(state.colors.trunk);
  
  // Branch 1
  context.save();
  context.translate(185, 400);
  context.rotate(state.windMid * 1.2 * Math.PI / 180);
  context.translate(-185, -400);
  context.beginPath();
  context.moveTo(175, 410); context.quadraticCurveTo(140, 380, 80, 300); context.lineTo(90, 290); context.quadraticCurveTo(150, 370, 195, 390);
  context.fill();
  context.restore();

  // Branch 2
  context.save();
  context.translate(200, 300);
  context.rotate(state.windHigh * 0.8 * Math.PI / 180);
  context.translate(-200, -300);
  context.beginPath();
  context.moveTo(190, 290); context.quadraticCurveTo(250, 250, 320, 150); context.lineTo(325, 155); context.quadraticCurveTo(250, 270, 205, 310);
  context.fill();
  context.restore();

  // Branch 3
  context.save();
  context.translate(170, 330);
  context.rotate(state.windHigh * 1.2 * Math.PI / 180);
  context.translate(-170, -330);
  context.beginPath();
  context.moveTo(175, 350); context.quadraticCurveTo(130, 250, 70, 150); context.lineTo(80, 140); context.quadraticCurveTo(150, 230, 190, 320);
  context.fill();
  context.restore();

  // Central Trunk
  context.beginPath();
  context.moveTo(140, 600); context.quadraticCurveTo(170, 400, 180, 200); context.lineTo(220, 200); context.quadraticCurveTo(230, 400, 260, 600);
  context.fill();

  // Draw Canopy Circles
  const drawCircleGroup = (indices: number[], rotWind: number, ox: number, oy: number) => {
    context.save();
    context.translate(ox, oy);
    context.rotate(rotWind * Math.PI / 180);
    context.translate(-ox, -oy);
    
    indices.forEach(idx => {
      const circle = canopyCircles[idx];
      if (!circle) return;
      const opacity = state.canopy[idx];
      if (opacity <= 0.01) return;
      
      context.globalAlpha = opacity * (circle.alpha || 1);
      context.fillStyle = arrayToRgb(circle.type === 'primary' ? state.colors.primary : state.colors.accent);
      context.beginPath();
      context.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
      context.fill();
    });
    context.restore();
  };

  // Branch 1 canopy: 6, 3, 4
  drawCircleGroup([6, 3, 4], state.windMid * 1.2, 185, 400);
  // Branch 2 canopy: 10, 7, 5, 1
  drawCircleGroup([10, 7, 5, 1], state.windHigh * 0.8, 200, 300);
  // Branch 3 canopy: 9, 2, 11
  drawCircleGroup([9, 2, 11], state.windHigh * 1.2, 170, 330);
  // Trunk canopy: 12, 8
  drawCircleGroup([12, 8], state.windHigh * 0.5, 200, 200);

  context.globalAlpha = 1.0;
  context.shadowBlur = 0;
  context.restore();

  // Particle System Logic
  let spawnChance = 0.02; 
  if (state.windSweep) spawnChance = 0.3; 
  else if (state.baseWind > 1.2) spawnChance = 0.08; 
  // Map 60fps spawn chance to dt
  spawnChance = 1 - Math.pow(1 - spawnChance, dt * 60);

  if (Math.random() < spawnChance) {
    const p = particles.find(p => !p.active);
    if (p) {
      p.active = true;
      p.scale = 0.3 + Math.random() * 0.7;
      p.opacity = 0.3 + (p.scale * 0.5);
      p.rotation = Math.random() * Math.PI * 2;
      p.spinSpeed = (Math.random() > 0.5 ? 1 : -1) * (Math.PI + Math.random() * Math.PI * 3);
      p.colorType = Math.random() > 0.5 ? 'primary' : 'accent';
      
      // Spawn position (restricted exactly to inner canopy circles)
      const svgX = 50 + Math.random() * 300;
      const svgY = 50 + Math.random() * 300;
      p.x = dx + svgX * scale;
      p.y = dy + svgY * scale;
      
      // Velocity (slower falling)
      const vw = canvasWidth;
      const vh = canvasHeight;
      const windDrift = (state.baseWind * 5 + 5) + Math.random() * 10; // % of VW
      p.vx = (windDrift / 100) * vw / (15 + Math.random() * 10); // x per sec
      p.vy = vh / (15 + Math.random() * 8); // y per sec, 15-23 secs to cross screen
    }
  }

  // Draw Particles
  particles.forEach(p => {
    if (!p.active) return;
    
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rotation += p.spinSpeed * dt;
    
    if (p.y > canvasHeight + 50) {
      p.active = false;
      return;
    }

    context.save();
    context.translate(p.x, p.y);
    context.rotate(p.rotation);
    context.scale(p.scale, p.scale);
    context.globalAlpha = p.opacity;
    context.fillStyle = arrayToRgb(p.colorType === 'primary' ? state.colors.primary : state.colors.accent);
    
    // Leaf shape (diamond)
    context.beginPath();
    context.moveTo(0, -6);
    context.lineTo(6, 0);
    context.lineTo(0, 6);
    context.lineTo(-6, 0);
    context.fill();
    
    context.restore();
  });

  // Grass Layer
  context.globalCompositeOperation = "source-over"; // Cor real e sólida, sem escurecer misturando com a montanha
  context.globalAlpha = 1.0; 
  const grassHeight = canvasHeight * 0.15;
  const grassY = canvasHeight;
  
  const timeSec = state.time / 1000;

  const drawBlades = (isThickFamily: boolean) => {
    context.beginPath();
    STATIC_BLADES.forEach(b => {
      if (b.isThick !== isThickFamily) return;

      const phase = b.x * 30 + b.height; 
      const individualWind = Math.sin(timeSec * 1.5 + phase) * 0.25; 
      
      const baseWind = b.layer === 1 ? state.windGround1 : state.windGround2;
      const rot = (baseWind + individualWind) * b.swayMultiplier * 15;
      const rotRad = rot * Math.PI / 180;
      
      const bx = b.x * canvasWidth;
      const bw = b.width;
      const bh = b.height * (canvasHeight / 1080) * 0.8; 
      
      const topX = bx + Math.sin(rotRad) * bh;
      const topY = grassY - Math.cos(rotRad) * bh;
      
      context.moveTo(bx - bw/2, grassY);
      context.quadraticCurveTo(bx - bw/2 + Math.sin(rotRad) * bh * 0.5, grassY - bh * 0.5, topX, topY);
      context.quadraticCurveTo(bx + bw/2 + Math.sin(rotRad) * bh * 0.5, grassY - bh * 0.5, bx + bw/2, grassY);
    });
    context.fill();
  };

  // Lote 1: Cor primária da árvore (Gramas mais espessas)
  context.fillStyle = arrayToRgb(state.colors.primary); 
  drawBlades(true);

  // Lote 2: Cor de destaque da árvore (Gramas mais finas)
  context.fillStyle = arrayToRgb(state.colors.accent); 
  drawBlades(false);

  // Ground Mounds Layer (Uses bottom Ground Layer coordinate space)
  context.globalCompositeOperation = "source-over"; // Reset blend mode
  
  const groundW = canvasWidth * 0.45;
  const groundH = canvasHeight * 0.20;
  const groundX = canvasWidth * 0.02;
  const groundY = canvasHeight - groundH;
  
  const gScale = Math.min(groundW / 400, groundH / 100);
  const gdx = groundX + (groundW - 400 * gScale) / 2;
  const gdy = canvasHeight - 100 * gScale;

  context.save();
  context.translate(gdx, gdy);
  context.scale(gScale, gScale);
  
  const drawMound = (opacity: number, paths: {d: string, fill: number[]}[]) => {
    if (opacity <= 0.01) return;
    context.globalAlpha = opacity;
    paths.forEach(p => {
      context.fillStyle = arrayToRgb(p.fill);
      const path = new Path2D(p.d);
      context.fill(path);
    });
  };

  drawMound(state.mound1, [
    { d: "M 310 100 A 25 25 0 0 1 350 100 Z", fill: state.colors.primary },
    { d: "M 300 100 A 15 15 0 0 1 320 100 Z", fill: state.colors.accent },
    { d: "M 340 100 A 20 20 0 0 1 365 100 Z", fill: state.colors.trunk }
  ]);
  drawMound(state.mound2, [
    { d: "M 140 100 A 45 45 0 0 1 200 100 Z", fill: state.colors.accent },
    { d: "M 120 100 A 30 30 0 0 1 160 100 Z", fill: state.colors.primary },
    { d: "M 180 100 A 35 35 0 0 1 220 100 Z", fill: state.colors.primary }
  ]);
  drawMound(state.mound3, [
    { d: "M 200 100 A 90 90 0 0 1 320 100 Z", fill: state.colors.primary },
    { d: "M 170 100 A 45 45 0 0 1 230 100 Z", fill: state.colors.accent },
    { d: "M 290 100 A 55 55 0 0 1 360 100 Z", fill: state.colors.trunk }
  ]);
  context.restore();
}
