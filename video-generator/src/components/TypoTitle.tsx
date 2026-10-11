import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { THEME } from '../theme';

interface TypoTitleProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  align?: 'center' | 'left' | 'right';
  startFrame?: number;
}

export const TypoTitle: React.FC<TypoTitleProps> = ({
  title,
  subtitle,
  gradient = true,
  align = 'center',
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for title container
  const sprValue = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
      mass: 0.8,
    },
  });

  // Calculate slide-up and fade-in
  const opacity = Math.min(1, Math.max(0, sprValue));
  const translateY = (1 - sprValue) * 30;

  // Words breakdown for slide-in delays (making words/letters appear dynamically)
  const words = title.split(' ');

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        textAlign: align,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: THEME.fonts.display,
        marginBottom: 20,
      }}
    >
      {/* Primary Animated Title */}
      <h1
        style={{
          fontSize: 54,
          fontWeight: '800',
          lineHeight: '1.15',
          margin: 0,
          padding: 0,
          letterSpacing: '-0.02em',
          background: gradient
            ? 'linear-gradient(135deg, #f2ca50 0%, #ffe088 50%, #e9a832 100%)'
            : THEME.colors.onSurface,
          WebkitBackgroundClip: gradient ? 'text' : 'none',
          WebkitTextFillColor: gradient ? 'transparent' : 'none',
          backgroundClip: gradient ? 'text' : 'none',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          gap: '12px 16px',
        }}
      >
        {words.map((word, i) => {
          // Delay each word by 3 frames for sequential stagger effect
          const wordSpr = spring({
            frame: frame - startFrame - (i * 3),
            fps,
            config: { damping: 12, stiffness: 120 },
          });
          const wordOpacity = Math.min(1, Math.max(0, wordSpr));
          const wordScale = 0.8 + (wordSpr * 0.2);

          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: wordOpacity,
                transform: `scale(${wordScale})`,
                transformOrigin: 'bottom center',
              }}
            >
              {word}
            </span>
          );
        })}
      </h1>

      {/* Optional Subtitle */}
      {subtitle && (
        <p
          style={{
            fontFamily: THEME.fonts.body,
            fontSize: 22,
            fontWeight: '400',
            color: THEME.colors.onSurfaceVariant,
            marginTop: 16,
            marginBottom: 0,
            maxWidth: 600,
            lineHeight: '1.5',
            // Simple delayed fade for subtitle
            opacity: Math.min(1, Math.max(0, (frame - startFrame - 15) / 15)),
            transform: `translateY(${Math.max(0, 10 - (frame - startFrame - 15) * 0.6)}px)`,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
