import React from 'react';
import { ENV_STATIC } from '../../data/environment-palette';

export const SkyLayer = () => {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      {/* Céu Dia (Azul claro a um tom suave no horizonte) */}
      <div className="absolute inset-0 opacity-100" style={{ background: `linear-gradient(to bottom, ${ENV_STATIC.sky.dayFrom}, ${ENV_STATIC.sky.dayTo})` }} />
      {/* Céu Noite (Azul super escuro) */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${ENV_STATIC.sky.nightFrom}, ${ENV_STATIC.sky.nightTo})`, opacity: 'var(--night-opacity)' }} />
    </div>
  );
};

// Cortado pela metade para economizar recursos (GPU)
const STATIC_STARS = Array.from({ length: 60 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60, // Apenas na metade superior (céu)
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 5,
  duration: 2 + Math.random() * 4
}));

export const StarsLayer = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0" style={{ opacity: 'var(--night-opacity)' }}>
      {STATIC_STARS.map(star => (
        <div 
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            left: `${star.x}vw`,
            top: `${star.y}vh`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: 0.5 + Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );
};

export const CelestialLayer = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sol */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '120px', height: '120px',
          background: ENV_STATIC.celestial.sunGradient,
          boxShadow: ENV_STATIC.celestial.sunGlow,
          transform: 'var(--sun-transform, translate3d(50vw, 150vh, 0))',
          willChange: 'transform'
        }}
      />
      {/* Lua */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '80px', height: '80px',
          backgroundColor: ENV_STATIC.celestial.moonColor,
          boxShadow: ENV_STATIC.celestial.moonGlow,
          transform: 'var(--moon-transform, translate3d(50vw, 150vh, 0))',
          willChange: 'transform'
        }}
      />
    </div>
  );
};

export const MountainLayer = () => (
  <div className="absolute bottom-0 w-full h-[40%] pointer-events-none">
    <svg viewBox="0 0 1000 300" className="w-full h-full" preserveAspectRatio="none">
      <path d="M 0 300 L 0 200 Q 150 100 350 220 T 700 150 T 1000 250 L 1000 300 Z" fill="var(--mountain-1, var(--color-taupe))" />
      <path d="M 0 300 L 0 250 Q 200 150 450 270 T 850 180 T 1000 280 L 1000 300 Z" fill="var(--mountain-2, var(--color-secondary))" />
    </svg>
  </div>
);

// Gerando as lâminas de grama fora do componente para que NUNCA sejam recriadas nos re-renders do React
const STATIC_BLADES = Array.from({ length: 600 }).map((_, i) => {
  const isThick = Math.random() > 0.85;
  const height = isThick ? (30 + Math.random() * 40) : (10 + Math.random() * 30);
  const width = isThick ? (4 + Math.random() * 4) : (1 + Math.random() * 2);
  const x = Math.random() * 100;
  const swayMultiplier = height / 40;
  const layer = Math.random() > 0.5 ? 1 : 2;
  return { id: i, x, height, width, swayMultiplier, isThick, layer };
});

export const GrassLayer = () => {
  return (
    <div className="absolute bottom-0 w-full h-[15%] pointer-events-none overflow-visible mix-blend-multiply opacity-90">
      {STATIC_BLADES.map(b => (
        <div 
          key={b.id} 
          className="absolute bottom-0 bg-secondary origin-bottom"
          style={{ 
            left: `${b.x}%`,
            width: `${b.width}px`,
            height: `${b.height}px`,
            opacity: b.isThick ? 0.9 : 0.6,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            transform: `rotate(calc(var(--wind-ground-${b.layer}) * ${b.swayMultiplier * 15}deg))`
          }}
        />
      ))}
    </div>
  );
};

// Gerando as nuvens com sistema de paralaxe (3 camadas de profundidade)
const STATIC_CLOUDS = Array.from({ length: 25 }).map((_, i) => {
  const layerSeed = Math.random();
  let depth = 0; // 0 = fundo, 1 = meio, 2 = frente
  let scale, speed, opacity, top;
  
  if (layerSeed < 0.4) { // Fundo (40% das nuvens)
    depth = 0;
    scale = 0.5 + Math.random() * 0.5;
    speed = 400 + Math.random() * 300; // Super lentas
    opacity = 0.15 + Math.random() * 0.15; // Opacidade base dobrada
    top = Math.random() * 60; // Passam por toda a tela (h-70%)
  } else if (layerSeed < 0.8) { // Meio (40% das nuvens)
    depth = 1;
    scale = 1.0 + Math.random() * 0.8;
    speed = 200 + Math.random() * 200;
    opacity = 0.25 + Math.random() * 0.20; // Mais sólido
    top = Math.random() * 50; 
  } else { // Frente (20% das nuvens)
    depth = 2;
    scale = 1.8 + Math.random() * 1.2;
    speed = 100 + Math.random() * 100;
    opacity = 0.40 + Math.random() * 0.25; // Frente bem opaca e preenchida
    top = Math.random() * 30; // Nuvens gigantes passam mais perto do topo
  }

  const delay = -(Math.random() * speed);
  
  // Nuvens "amontoadas": algumas formações terão muitos círculos
  const isCluster = Math.random() > 0.7;
  const numCircles = isCluster ? 10 + Math.floor(Math.random() * 12) : 4 + Math.floor(Math.random() * 5);
  
  const circles = Array.from({ length: numCircles }).map(() => ({
    cx: 50 + (Math.random() * 140 - 70), // Mais largas horizontalmente
    cy: 50 + (Math.random() * 40 - 20),
    r: 15 + Math.random() * 35,
  }));

  return { id: i, top, scale, speed, delay, opacity, circles, depth };
});

export const CloudsLayer = () => {
  return (
    <div className="absolute top-0 w-full h-[70%] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes drift-cloud {
          from { transform: translate3d(-50vw, 0, 0); }
          to { transform: translate3d(150vw, 0, 0); }
        }
      `}</style>
      
      {STATIC_CLOUDS.map(c => (
        <div 
          key={c.id} 
          className="absolute left-0" // Inicia cravado na esquerda, a animação assume a partir daqui
          style={{
            top: `${c.top}%`,
            animation: `drift-cloud ${c.speed}s linear infinite`,
            animationDelay: `${c.delay}s`,
            zIndex: c.depth
          }}
        >
          {/* O container interno gerencia a escala e a centralização do SVG */}
          <div 
            style={{
              transform: `scale(${c.scale}) translate(-50%, -50%)`, 
              opacity: c.opacity,
            }}
          >
            {/* overflow-visible previne que os círculos da ponta esquerda fiquem com um "corte reto" */}
            <svg width="200" height="100" viewBox="0 0 200 100" style={{ overflow: 'visible' }}>
              {c.circles.map((circle, j) => (
                <circle key={j} cx={circle.cx} cy={circle.cy} r={circle.r} fill="var(--cloud-color, white)" />
              ))}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export const WindLayer = () => (
  <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden" style={{ opacity: 'var(--wind-sweep)', transition: 'opacity 1s ease-in-out' }}>
    <svg viewBox="0 0 1000 500" className="w-full h-full text-taupe/40" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      <path d="M-100,300 Q200,150 500,350 T1200,200" className="animate-wind-dash" />
      <path d="M-200,400 Q100,250 400,450 T1300,350" className="animate-wind-dash" style={{ animationDelay: '0.7s' }} />
      <path d="M-300,200 Q150,300 450,250 T1100,400" className="animate-wind-dash" style={{ animationDelay: '1.4s' }} />
    </svg>
  </div>
);

export const TreeLayer = () => (
  <div 
    className="absolute bottom-0 left-[2%] w-[45%] h-[70%] pointer-events-none origin-bottom"
    style={{ transform: 'rotate(calc(var(--wind-low) * 1.5deg))' }}
  >
    <svg viewBox="0 0 400 600" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMax meet">

      {/* Galho 1 (Baixo Esquerda) */}
      <g id="branch-1" style={{ transformOrigin: '185px 400px', transformBox: 'view-box', transform: 'rotate(calc(var(--wind-mid) * 1.2deg))' }}>
        <path d="M 175 410 Q 140 380 80 300 L 90 290 Q 150 370 195 390 Z" fill="var(--tree-trunk, var(--color-taupe))" />
        <circle id="canopy-circle-6" cx="80" cy="250" r="70" fill="var(--tree-primary, var(--color-primary))" style={{ opacity: 'calc(var(--canopy-6) * 0.7)', transition: 'opacity 2s ease' }} />
        <circle id="canopy-circle-3" cx="120" cy="280" r="50" fill="var(--tree-accent, var(--color-accent))" style={{ opacity: 'calc(var(--canopy-3) * 0.6)', transition: 'opacity 2s ease' }} />
        <circle id="canopy-circle-4" cx="100" cy="320" r="60" fill="var(--tree-primary, var(--color-primary))" style={{ opacity: 'calc(var(--canopy-4) * 0.8)', transition: 'opacity 2s ease' }} />
      </g>
      
      {/* Galho 2 (Meio Direita) */}
      <g id="branch-2" style={{ transformOrigin: '200px 300px', transformBox: 'view-box', transform: 'rotate(calc(var(--wind-high) * 0.8deg))' }}>
        <path d="M 190 290 Q 250 250 320 150 L 325 155 Q 250 270 205 310 Z" fill="var(--tree-trunk, var(--color-taupe))" />
        
        {/* Círculo Principal da Direita (Foi para 10, é o antepenúltimo a sumir) */}
        <circle id="canopy-circle-10" cx="310" cy="160" r="120" fill="var(--tree-primary, var(--color-primary))" style={{ opacity: 'calc(var(--canopy-10) * 0.6)', transition: 'opacity 2s ease' }} />
        
        <circle id="canopy-circle-7" cx="280" cy="180" r="60" fill="var(--tree-accent, var(--color-accent))" style={{ opacity: 'calc(var(--canopy-7) * 0.6)', transition: 'opacity 2s ease' }} />
        <circle id="canopy-circle-5" cx="340" cy="120" r="50" fill="var(--tree-accent, var(--color-accent))" style={{ opacity: 'calc(var(--canopy-5) * 0.8)', transition: 'opacity 2s ease' }} />
        <circle id="canopy-circle-1" cx="230" cy="260" r="70" fill="var(--tree-primary, var(--color-primary))" style={{ opacity: 'calc(var(--canopy-1) * 0.8)', transition: 'opacity 2s ease' }} />
      </g>

      {/* Galho 3 (Meio Esquerda) - Realocado para não ficar no topo */}
      <g id="branch-3" style={{ transformOrigin: '170px 330px', transformBox: 'view-box', transform: 'rotate(calc(var(--wind-high) * 1.2deg))' }}>
        <path d="M 175 350 Q 130 250 70 150 L 80 140 Q 150 230 190 320 Z" fill="var(--tree-trunk, var(--color-taupe))" />
        <circle id="canopy-circle-9" cx="70" cy="150" r="75" fill="var(--tree-primary, var(--color-primary))" style={{ opacity: 'calc(var(--canopy-9) * 0.7)', transition: 'opacity 2s ease' }} />
        <circle id="canopy-circle-2" cx="110" cy="180" r="60" fill="var(--tree-accent, var(--color-accent))" style={{ opacity: 'calc(var(--canopy-2) * 0.6)', transition: 'opacity 2s ease' }} />
        
        {/* Círculo Gigante da Esquerda (Foi para 11, é o penúltimo a sumir) */}
        <circle id="canopy-circle-11" cx="120" cy="220" r="130" fill="var(--tree-primary, var(--color-primary))" style={{ opacity: 'calc(var(--canopy-11) * 0.9)', transition: 'opacity 2s ease' }} />
      </g>

      {/* Tronco Central - Renderizado DEPOIS dos galhos (para esconder raízes) mas ANTES da copa do topo */}
      <path 
        d="M 140 600 Q 170 400 180 200 L 220 200 Q 230 400 260 600 Z" 
        fill="var(--tree-trunk, var(--color-taupe))" 
      />

      {/* Trunk Canopy (Preso direto ao topo do tronco, renderizado por ÚLTIMO para cair pela frente da madeira) */}
      <g id="trunk-canopy" style={{ transformOrigin: '200px 200px', transformBox: 'view-box', transform: 'rotate(calc(var(--wind-high) * 0.5deg))' }}>
        {/* Círculo Gigante Central (Foi para 12, é o ÚLTIMO a sumir e fechar o dia) */}
        <circle id="canopy-circle-12" cx="200" cy="100" r="130" fill="var(--tree-primary, var(--color-primary))" style={{ opacity: 'calc(var(--canopy-12) * 0.8)', transition: 'opacity 2s ease' }} />
        
        {/* Círculo Médio - Recebeu o 8 que sobrou (some bem antes) */}
        <circle id="canopy-circle-8" cx="200" cy="200" r="65" fill="var(--tree-accent, var(--color-accent))" style={{ opacity: 'calc(var(--canopy-8) * 0.8)', transition: 'opacity 2s ease' }} />
      </g>

    </svg>
  </div>
);

export const FallingLeavesLayer = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {Array.from({ length: 40 }).map((_, i) => (
        <div 
          key={i}
          id={`falling-leaf-${i}`}
          className="absolute opacity-0"
          style={{ 
            backgroundColor: i % 2 === 0 ? 'var(--tree-primary, var(--color-primary))' : 'var(--tree-accent, var(--color-accent))',
            width: '12px', height: '12px', 
            transformOrigin: 'center',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  );
};

export const GroundLayer = () => (
  <div className="absolute bottom-0 left-[2%] w-[45%] h-[20%] pointer-events-none">
    <svg viewBox="0 0 400 100" className="w-full h-full absolute bottom-0" preserveAspectRatio="xMidYMax meet">
      
      {/* Montinho 1 (Aparece primeiro: Pequeno, à direita extrema) */}
      <g style={{ opacity: 'var(--mound-1)', transition: 'opacity 1s linear' }}>
        <path d="M 310 100 A 25 25 0 0 1 350 100 Z" fill="var(--tree-primary, var(--color-primary))" />
        <path d="M 300 100 A 15 15 0 0 1 320 100 Z" fill="var(--tree-accent, var(--color-accent))" />
        <path d="M 340 100 A 20 20 0 0 1 365 100 Z" fill="var(--tree-trunk, var(--color-taupe))" />
      </g>

      {/* Montinho 2 (Aparece em seguida: Médio, à esquerda do tronco) */}
      <g style={{ opacity: 'var(--mound-2)', transition: 'opacity 1s linear' }}>
        <path d="M 140 100 A 45 45 0 0 1 200 100 Z" fill="var(--tree-accent, var(--color-accent))" />
        <path d="M 120 100 A 30 30 0 0 1 160 100 Z" fill="var(--tree-primary, var(--color-primary))" />
        <path d="M 180 100 A 35 35 0 0 1 220 100 Z" fill="var(--tree-primary, var(--color-primary))" />
      </g>

      {/* Montinho 3 (Aparece no final: Grande nuvem central, cobrindo o meio-direita) */}
      <g style={{ opacity: 'var(--mound-3)', transition: 'opacity 1s linear' }}>
        <path d="M 200 100 A 90 90 0 0 1 320 100 Z" fill="var(--tree-primary, var(--color-primary))" />
        <path d="M 170 100 A 45 45 0 0 1 230 100 Z" fill="var(--tree-accent, var(--color-accent))" />
        <path d="M 290 100 A 55 55 0 0 1 360 100 Z" fill="var(--tree-trunk, var(--color-taupe))" />
      </g>

    </svg>
  </div>
);
