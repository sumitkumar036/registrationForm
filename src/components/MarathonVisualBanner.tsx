import React from 'react';

export const MarathonVisualBanner: React.FC<{ registeredCount: number }> = ({ registeredCount }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white border border-stone-800 shadow-2xl mb-8">
      {/* Background Graphic SVG */}
      <svg
        className="w-full h-48 sm:h-64 lg:h-72 object-cover"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#1E293B" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="saffronGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <radialGradient id="sunGlow" cx="0.5" cy="0.3" r="0.5">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky with Sunrise */}
        <rect width="1200" height="400" fill="url(#skyGrad)" />
        <circle cx="600" cy="110" r="140" fill="url(#sunGlow)" />

        {/* Sunbeams */}
        <g opacity="0.15" stroke="#FFFFFF" strokeWidth="2">
          <line x1="600" y1="110" x2="100" y2="0" />
          <line x1="600" y1="110" x2="300" y2="0" />
          <line x1="600" y1="110" x2="900" y2="0" />
          <line x1="600" y1="110" x2="1100" y2="0" />
          <line x1="600" y1="110" x2="0" y2="200" />
          <line x1="600" y1="110" x2="1200" y2="200" />
        </g>

        {/* City Skyline Silhouettes */}
        <g fill="#1E293B" opacity="0.6">
          <rect x="80" y="140" width="45" height="130" rx="3" />
          <rect x="135" y="110" width="60" height="160" rx="3" />
          <rect x="210" y="160" width="40" height="110" />
          <rect x="260" y="130" width="70" height="140" />
          <polygon points="295,95 275,130 315,130" />
          <rect x="345" y="170" width="50" height="100" />
          <rect x="820" y="135" width="55" height="135" rx="3" />
          <rect x="890" y="105" width="65" height="165" />
          <polygon points="922,70 900,105 945,105" />
          <rect x="970" y="150" width="50" height="120" />
          <rect x="1035" y="125" width="75" height="145" />
        </g>

        {/* Celebratory Confetti Shower */}
        <g opacity="0.75">
          <circle cx="250" cy="90" r="3" fill="#F97316" />
          <rect x="320" y="70" width="5" height="8" rx="1" fill="#FBBF24" transform="rotate(25 320 70)" />
          <circle cx="410" cy="50" r="3.5" fill="#34D399" />
          <rect x="520" y="45" width="6" height="6" fill="#F43F5E" transform="rotate(45 520 45)" />
          <circle cx="680" cy="65" r="4" fill="#FBBF24" />
          <rect x="760" y="80" width="5" height="7" rx="1" fill="#60A5FA" transform="rotate(-30 760 80)" />
          <circle cx="850" cy="55" r="3" fill="#34D399" />
          <rect x="940" y="90" width="6" height="5" fill="#F97316" transform="rotate(15 940 90)" />
          <circle cx="1020" cy="75" r="3.5" fill="#FBBF24" />
        </g>

        {/* Marathon Finish / Gantry Arch */}
        <g>
          {/* Arch Pillars */}
          <rect x="360" y="120" width="18" height="160" fill="#F97316" rx="2" />
          <rect x="822" y="120" width="18" height="160" fill="#10B981" rx="2" />
          {/* Arch Top Truss */}
          <rect x="350" y="105" width="500" height="26" fill="#0F172A" rx="4" stroke="#FBBF24" strokeWidth="2" />
          <text
            x="600"
            y="122"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="12"
            fontWeight="bold"
            letterSpacing="2"
            fontFamily="sans-serif"
          >
            ★ VIJAYA JANTA PARTY MARATHON 2026 · FINISH LINE ★
          </text>

          {/* Tri-color victory ribbon on arch */}
          <rect x="368" y="131" width="464" height="4" fill="url(#saffronGold)" />
        </g>

        {/* Road Surface with Perspective */}
        <polygon points="0,270 1200,270 1200,400 0,400" fill="url(#roadGrad)" />
        {/* Road Track Lines */}
        <line x1="0" y1="350" x2="1200" y2="350" stroke="#FBBF24" strokeWidth="3" strokeDasharray="25 15" opacity="0.6" />
        <line x1="0" y1="272" x2="1200" y2="272" stroke="#FFFFFF" strokeWidth="2" opacity="0.3" />

        {/* Silhouettes of Energetic Marathon Runners */}
        {/* Runner 1: Leading Sprinter (Crossing Finish Line, Arms Raised in Victory) */}
        <g transform="translate(560, 185) scale(0.95)" fill="#FFFFFF">
          {/* Head */}
          <circle cx="40" cy="18" r="9" />
          {/* Torso with bib */}
          <path d="M 32 30 L 48 30 L 44 65 L 36 65 Z" />
          {/* Bib Number */}
          <rect x="34" y="38" width="12" height="10" fill="#F97316" rx="1" />
          {/* Raised Victory Arms */}
          <path d="M 32 32 L 18 10 L 22 8 L 36 28 Z" />
          <path d="M 48 32 L 62 10 L 58 8 L 44 28 Z" />
          {/* Dynamic Striding Legs */}
          <path d="M 36 63 L 24 88 L 14 105 L 19 107 L 29 90 L 40 66 Z" />
          <path d="M 44 63 L 56 82 L 72 92 L 70 96 L 52 86 L 40 66 Z" />
        </g>

        {/* Runner 2: Female Runner in full stride */}
        <g transform="translate(450, 195) scale(0.85)" fill="#FBBF24">
          <circle cx="38" cy="18" r="8.5" />
          {/* Ponytail hair */}
          <path d="M 32 17 Q 20 22 22 28 Q 28 26 33 22 Z" />
          {/* Torso */}
          <path d="M 31 28 L 45 28 L 42 62 L 34 62 Z" />
          <rect x="33" y="36" width="10" height="9" fill="#10B981" rx="1" />
          {/* Arms */}
          <path d="M 32 30 L 20 42 L 28 50" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 44 30 L 58 40 L 52 48" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Legs */}
          <path d="M 35 62 L 18 85 L 12 102" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 41 62 L 58 80 L 76 86" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>

        {/* Runner 3: Pacing Runner with focus */}
        <g transform="translate(680, 200) scale(0.88)" fill="#34D399">
          <circle cx="36" cy="18" r="8.5" />
          <path d="M 30 28 L 44 28 L 40 62 L 32 62 Z" />
          <rect x="32" y="36" width="10" height="9" fill="#F97316" rx="1" />
          <path d="M 30 30 L 16 40 L 24 50" stroke="#34D399" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M 44 30 L 58 38 L 52 48" stroke="#34D399" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M 34 62 L 20 84 L 14 100" stroke="#34D399" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 38 62 L 56 78 L 70 88" stroke="#34D399" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>

        {/* Runner 4: Chasing runner in distance */}
        <g transform="translate(360, 215) scale(0.7)" fill="#E2E8F0" opacity="0.85">
          <circle cx="36" cy="18" r="8" />
          <path d="M 30 28 L 44 28 L 40 62 L 32 62 Z" />
          <path d="M 34 62 L 18 88" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 40 62 L 60 82" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>

        {/* Runner 5: Second chasing runner */}
        <g transform="translate(790, 215) scale(0.72)" fill="#FED7AA" opacity="0.85">
          <circle cx="36" cy="18" r="8" />
          <path d="M 30 28 L 44 28 L 40 62 L 32 62 Z" />
          <path d="M 34 62 L 20 84" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 40 62 L 62 80" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      </svg>

      {/* Overlay Content with Vijaya Janta Party Branding & Registered Number */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-stone-950 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              <span>Managed by Vijaya Janta Party</span>
              {/* <span aria-hidden="true">·</span> */}
              {/* <span>विजय जनता पार्टी</span> */}
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              Vijaya Janta Party Annual Marathon 2026
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 font-medium max-w-xl drop-shadow">
              Run for Unity, Fitness & Victory
            </p>
          </div>

          {/* Registered Number Highlight Badge */}
          <div className="bg-stone-900/95 backdrop-blur border-2 border-amber-400/80 rounded-2xl p-4 shadow-xl shrink-0 text-center sm:text-right min-w-[180px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Total Registered
            </div>
            <div className="font-display font-black text-3xl sm:text-4xl text-white tabular-nums tracking-tight">
              {registeredCount}
            </div>
            <div className="text-[11px] text-stone-300 font-medium">
              Runners on Board
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
