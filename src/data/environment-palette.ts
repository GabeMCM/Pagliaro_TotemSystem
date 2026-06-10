/**
 * Paleta de Cores do Motor Ambiental (RCD - Config Layer)
 * 
 * Todas as cores usadas pelo engine.ts, Layers.tsx e SplashOverlay.tsx
 * são definidas aqui. Arrays RGB para interpolação no loop de 60fps.
 * Arrays RGBA para elementos com transparência.
 * Strings hex/gradient para injeção direta no CSS.
 */

// --- Cores de Interpolação (Arrays numéricos para o engine) ---

export const ENV_COLORS = {
  day: {
    trunk:     [165, 147, 133],
    primary:   [107, 127, 92],
    accent:    [146, 159, 118],
    mountain1: [181, 168, 161],
    mountain2: [230, 223, 216],
    cloud:     [255, 255, 255],
    text:      [74, 67, 64],
    textMuted: [92, 84, 80],
  },
  dayRgba: {
    shadow: [74, 67, 64, 0.7],
    glass:  [255, 255, 255, 0.5],
    card:   [253, 252, 251, 0.8],
    border: [181, 168, 161, 0.3],
  },
  night: {
    trunk:     [10, 15, 20],
    primary:   [12, 18, 22],
    accent:    [16, 24, 30],
    mountain1: [15, 20, 25],
    mountain2: [20, 25, 30],
    cloud:     [40, 45, 55],
    text:      [230, 223, 216],
    textMuted: [180, 175, 170],
  },
  nightRgba: {
    shadow: [0, 0, 0, 0.9],
    glass:  [12, 18, 22, 0.8],
    card:   [15, 20, 25, 0.6],
    border: [255, 255, 255, 0.05],
  },
  moonlight: {
    trunk:     [30, 40, 50],
    primary:   [25, 45, 55],
    accent:    [35, 55, 65],
    mountain1: [25, 35, 45],
    mountain2: [35, 45, 55],
    cloud:     [80, 90, 105],
    text:      [240, 245, 250],
    textMuted: [190, 195, 200],
  },
  moonlightRgba: {
    shadow: [5, 10, 20, 0.9],
    glass:  [16, 24, 30, 0.8],
    card:   [20, 25, 30, 0.6],
    border: [255, 255, 255, 0.1],
  },
} as const;

// --- Cores Estáticas (Strings para CSS direto nos componentes visuais) ---

export const ENV_STATIC = {
  sky: {
    dayFrom:   '#87CEEB',
    dayTo:     '#F5DEB3',
    nightFrom: '#050B14',
    nightTo:   '#1A2639',
  },
  celestial: {
    sunGradient: 'radial-gradient(circle, #FFFDEB 0%, #FFDF80 40%, transparent 80%)',
    sunGlow:     '0 0 60px 20px rgba(255, 223, 128, 0.5)',
    moonColor:   '#f4f6f0',
    moonGlow:    '0 0 40px 10px rgba(255, 255, 255, 0.4), inset -15px -10px 20px rgba(0,0,0,0.3)',
  },
  leaf: {
    svgFill: '#dfa197',
  },
  splash: {
    textColor: '#fdfcfb',
  },
} as const;
