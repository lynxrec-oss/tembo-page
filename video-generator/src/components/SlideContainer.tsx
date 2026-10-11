import React from 'react';
import { AbsoluteFill } from 'remotion';
import { THEME } from '../theme';

interface SlideContainerProps {
  children: React.ReactNode;
  glowPosition?: 'top' | 'left' | 'right' | 'center' | 'none';
}

export const SlideContainer: React.FC<SlideContainerProps> = ({
  children,
  glowPosition = 'top',
}) => {
  const getGlowStyle = () => {
    switch (glowPosition) {
      case 'top':
        return 'radial-gradient(ellipse 80% 40% at 50% -5%, rgba(242, 202, 80, 0.15) 0%, transparent 80%)';
      case 'left':
        return 'radial-gradient(ellipse 50% 50% at -10% 50%, rgba(242, 202, 80, 0.12) 0%, transparent 80%)';
      case 'right':
        return 'radial-gradient(ellipse 50% 50% at 110% 50%, rgba(111, 230, 146, 0.1) 0%, transparent 80%)';
      case 'center':
        return 'radial-gradient(circle at 50% 50%, rgba(242, 202, 80, 0.15) 0%, transparent 70%)';
      case 'none':
      default:
        return 'none';
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.colors.background,
        color: THEME.colors.onSurface,
        fontFamily: THEME.fonts.body,
        overflow: 'hidden',
      }}
    >
      {/* Import Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;600;700;800&display=swap');
          * {
            box-sizing: border-box;
          }
        `}
      </style>

      {/* Glow Layer */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: getGlowStyle(),
          pointerEvents: 'none',
        }}
      />

      {/* SVG Noise Overlay */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />

      {/* Content wrapper */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px 60px',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
