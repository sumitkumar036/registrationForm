import React from 'react';

export const AthleticGraphicsBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base Dark/Atmospheric Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0F172A] to-[#080B11]" />

      {/* Radiant Glow Spots (Saffron/Amber on top left, Emerald on bottom right) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />

      {/* Full Screen SVG Graphic Landscape */}
      <svg
        className="w-full h-full object-cover opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="trackRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
          </linearGradient>

          <pattern id="sportGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            <circle cx="30" cy="30" r="1.5" fill="rgba(245, 158, 11, 0.15)" />
          </pattern>
        </defs>

        {/* Isometric Grid */}
        <rect width="1440" height="900" fill="url(#sportGrid)" />

        {/* Dynamic Running Track Elevation Contours */}
        <path
          d="M -100 250 C 300 80, 600 420, 1100 180 S 1600 350, 1600 350"
          fill="none"
          stroke="url(#trackRibbon)"
          strokeWidth="6"
          strokeDasharray="16 10"
        />
        <path
          d="M -100 270 C 300 100, 600 440, 1100 200 S 1600 370, 1600 370"
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
        />
        <path
          d="M -100 290 C 300 120, 600 460, 1100 220 S 1600 390, 1600 390"
          fill="none"
          stroke="url(#trackRibbon)"
          strokeWidth="3"
          opacity="0.6"
        />

        {/* Second sweeping curve across the bottom */}
        <path
          d="M -50 780 Q 400 620, 850 740 T 1550 680"
          fill="none"
          stroke="#10B981"
          strokeWidth="4"
          strokeDasharray="12 8"
          opacity="0.3"
        />

        {/* Topographic elevation contours */}
        <path
          d="M 0 500 Q 350 420, 720 540 T 1440 480"
          fill="none"
          stroke="rgba(245, 158, 11, 0.12)"
          strokeWidth="1.5"
        />
        <path
          d="M 0 530 Q 350 450, 720 570 T 1440 510"
          fill="none"
          stroke="rgba(245, 158, 11, 0.08)"
          strokeWidth="1.5"
        />
        <path
          d="M 0 560 Q 350 480, 720 600 T 1440 540"
          fill="none"
          stroke="rgba(245, 158, 11, 0.05)"
          strokeWidth="1.5"
        />

        {/* Runner Silhouette at the edge */}
        <g transform="translate(1320, 120) scale(0.6)" fill="#F59E0B" opacity="0.25">
          <circle cx="40" cy="18" r="9" />
          <path d="M 32 30 L 48 30 L 44 65 L 36 65 Z" />
          <path d="M 32 32 L 18 10 L 22 8 L 36 28 Z" />
          <path d="M 48 32 L 62 10 L 58 8 L 44 28 Z" />
          <path d="M 36 63 L 24 88 L 14 105 L 19 107 L 29 90 L 40 66 Z" />
          <path d="M 44 63 L 56 82 L 72 92 L 70 96 L 52 86 L 40 66 Z" />
        </g>
      </svg>
    </div>
  );
};
