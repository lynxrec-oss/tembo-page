import React from 'react';
import { THEME } from '../theme';

interface CursorPointerProps {
  x: number;
  y: number;
  clicking?: boolean;
  opacity?: number;
}

export const CursorPointer: React.FC<CursorPointerProps> = ({
  x,
  y,
  clicking = false,
  opacity = 1,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Click Ripple Indicator */}
      {clicking && (
        <div
          style={{
            position: 'absolute',
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: `3px solid ${THEME.colors.primary}`,
            transform: 'translate(-25px, -25px) scale(1)',
            opacity: 0,
            animation: 'ripple 0.6s ease-out forwards',
          }}
        />
      )}

      {/* Styled cursor pointer dot */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: clicking ? THEME.colors.primary : 'rgba(255,255,255,0.9)',
          boxShadow: `0 0 20px ${THEME.colors.primary}, 0 2px 8px rgba(0,0,0,0.5)`,
          border: '2.5px solid #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: clicking ? 'scale(0.85)' : 'scale(1)',
          transition: 'transform 0.15s ease, background-color 0.15s ease',
        }}
      >
        {/* Core black dot */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#000',
          }}
        />
      </div>

      <style>
        {`
          @keyframes ripple {
            0% {
              transform: translate(-13px, -13px) scale(0.6);
              opacity: 1;
            }
            100% {
              transform: translate(-13px, -13px) scale(2.2);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};
