import React from 'react';
import { THEME } from '../theme';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  type?: 'default' | 'spotify' | 'booking' | 'youtube';
  subtitle?: string;
  clicks?: number;
  highlighted?: boolean;
}

interface PhoneMockupProps {
  avatarUrl?: string;
  displayName: string;
  bioText: string;
  links: LinkItem[];
  style?: React.CSSProperties;
  highlightLinkId?: string;
  renderExtra?: React.ReactNode;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  avatarUrl,
  displayName,
  bioText,
  links,
  style,
  highlightLinkId,
  renderExtra,
}) => {
  return (
    <div
      style={{
        width: 380,
        height: 720,
        borderRadius: 48,
        backgroundColor: '#0c0c0e',
        border: '12px solid #2a2620',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 40px rgba(242, 202, 80, 0.15)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Notch / Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 110,
          height: 25,
          borderRadius: 20,
          backgroundColor: '#000000',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Notch Camera Lens Details */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#1a1a24',
            marginRight: 60,
          }}
        />
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            backgroundColor: '#0d0d1a',
          }}
        />
      </div>

      {/* Screen Container */}
      <div
        style={{
          flex: 1,
          padding: '40px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #1f1b13 0%, #16130b 100%)',
          overflowY: 'hidden',
          position: 'relative',
        }}
      >
        {/* Status Bar */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 10px',
            fontSize: 10,
            color: THEME.colors.onSurfaceVariant,
            fontFamily: THEME.fonts.body,
            marginBottom: 20,
          }}
        >
          <span>9:41</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Profile Avatar */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: THEME.colors.surfaceContainer,
            border: `3px solid ${THEME.colors.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            marginBottom: 12,
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            '🐘'
          )}
        </div>

        {/* Display Name */}
        <div
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: THEME.colors.onSurface,
            fontFamily: THEME.fonts.display,
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          {displayName}
        </div>

        {/* Bio Text */}
        <div
          style={{
            fontSize: 12,
            color: THEME.colors.onSurfaceVariant,
            fontFamily: THEME.fonts.body,
            textAlign: 'center',
            maxWidth: '90%',
            lineHeight: '1.4',
            marginBottom: 24,
          }}
        >
          {bioText}
        </div>

        {/* Bio Links List */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            zIndex: 2,
          }}
        >
          {links.map((link) => {
            const isHighlighted = link.id === highlightLinkId || link.highlighted;
            
            if (link.type === 'spotify') {
              return (
                <div
                  key={link.id}
                  style={{
                    width: '100%',
                    backgroundColor: '#181818',
                    borderRadius: 16,
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    border: isHighlighted
                      ? `2px solid ${THEME.colors.primary}`
                      : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: isHighlighted
                      ? '0 0 20px rgba(242, 202, 80, 0.3)'
                      : '0 4px 12px rgba(0,0,0,0.15)',
                    transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      backgroundColor: '#282828',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      marginRight: 12,
                    }}
                  >
                    🎵
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: '600', color: '#fff' }}>{link.title}</div>
                    <div style={{ fontSize: 10, color: '#b3b3b3' }}>{link.subtitle || 'Listen on Spotify'}</div>
                  </div>
                  <div style={{ fontSize: 16, color: '#1db954', marginRight: 4 }}>🟢</div>
                </div>
              );
            }

            if (link.type === 'booking') {
              return (
                <div
                  key={link.id}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #2d261e 0%, #1f1a14 100%)',
                    borderRadius: 16,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    border: isHighlighted
                      ? `2px solid ${THEME.colors.primary}`
                      : '1px solid rgba(242, 202, 80, 0.1)',
                    boxShadow: isHighlighted
                      ? '0 0 20px rgba(242, 202, 80, 0.4)'
                      : '0 4px 12px rgba(0,0,0,0.2)',
                    transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 16, marginRight: 8 }}>📅</div>
                    <div style={{ fontSize: 13, fontWeight: '700', color: THEME.colors.primary }}>
                      {link.title}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: THEME.colors.onSurfaceVariant, marginBottom: 8 }}>
                    {link.subtitle || 'Schedule VFX consultation'}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: THEME.colors.primary,
                      color: THEME.colors.surface,
                      borderRadius: 8,
                      padding: '6px 0',
                      textAlign: 'center',
                      fontSize: 11,
                      fontWeight: '700',
                    }}
                  >
                    Select a Time
                  </div>
                </div>
              );
            }

            // Default link type
            return (
              <div
                key={link.id}
                style={{
                  width: '100%',
                  backgroundColor: THEME.colors.surfaceContainer,
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: isHighlighted
                    ? `2px solid ${THEME.colors.primary}`
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: isHighlighted
                    ? '0 0 20px rgba(242, 202, 80, 0.25)'
                    : '0 4px 12px rgba(0,0,0,0.15)',
                  transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>🔗</span>
                  <div style={{ fontSize: 13, fontWeight: '600', color: THEME.colors.onSurface }}>
                    {link.title}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: THEME.colors.onSurfaceVariant }}>➔</span>
              </div>
            );
          })}
        </div>

        {/* Extra contents (e.g. Floating highlights or cursors) */}
        {renderExtra}

        {/* Safe Area Indicator Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          }}
        />
      </div>
    </div>
  );
};
