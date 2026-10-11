import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from 'remotion';
import { SlideContainer } from '../components/SlideContainer';
import { PhoneMockup, LinkItem } from '../components/PhoneMockup';
import { TypoTitle } from '../components/TypoTitle';
import { THEME } from '../theme';

export const WhatIsTembo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Define timelines
  // Slide 1: 0 - 210 (0s - 7s)
  // Slide 2: 210 - 540 (7s - 18s)
  // Slide 3: 540 - 682 (18s - 22.7s)

  // Spring animations for slide transitions
  const slide1Opacity = interpolate(frame, [0, 15, 195, 210], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slide2Opacity = interpolate(frame, [200, 215, 525, 540], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slide3Opacity = interpolate(frame, [530, 545, 670, 682], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Slide 1: Logo scale entrance
  const logoScale = spring({
    frame: frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  // Slide 2: Phone slide up entrance
  const phoneEntrance = spring({
    frame: frame - 215,
    fps,
    config: { damping: 14, stiffness: 70 },
  });
  const phoneY = interpolate(phoneEntrance, [0, 1], [600, 0]);

  // Slide 2: Dynamic link swap animation
  // Swap occurs between frame 330 and 360
  const swapProgress = spring({
    frame: frame - 330,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  // Positions of links: Link A (TikTok) & Link B (Instagram)
  // Default: TikTok is top (y = 0), Instagram is second (y = 66)
  // Swapped: Instagram is top (y = 0), TikTok is second (y = 66)
  const linkTiktokY = interpolate(swapProgress, [0, 1], [0, 66]);
  const linkInstagramY = interpolate(swapProgress, [0, 1], [66, 0]);

  const trafficOrigin = frame < 350 ? 'TikTok 📱' : 'Instagram 📸';
  const trafficColor = frame < 350 ? '#25f4ee' : '#e1306c';

  const linksList: LinkItem[] = [
    { id: 'tiktok', title: 'TikTok Exclusive Offer', url: '#', highlighted: frame < 350 },
    { id: 'instagram', title: 'Shop Instagram Merch', url: '#', highlighted: frame >= 350 },
    { id: 'booking', title: 'VFX Live Consultation', url: '#', type: 'booking' },
  ];

  // Slide 3: Card glow & scale entry
  const endCardSpring = spring({
    frame: frame - 545,
    fps,
    config: { damping: 12, stiffness: 90 },
  });
  const endCardScale = interpolate(endCardSpring, [0, 1], [0.6, 1]);
  const endCardY = interpolate(endCardSpring, [0, 1], [100, 0]);

  return (
    <div style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <Audio src={staticFile('audio/02-what-is-tembo.mp3')} volume={1.0} />
      <Audio src={staticFile('audio/music-upbeat-social.mp3')} volume={0.16} loop />

      {/* SLIDE 1: INTRO */}
      {frame < 212 && (
        <div style={{ opacity: slide1Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="top">
            {/* Header Title */}
            <TypoTitle
              title="Your Bio Link Should Think"
              subtitle="Welcome to the digital savanna of smart, automated link-in-bio personalizations."
              startFrame={5}
            />

            {/* Pulsing Brand Elephant Symbol */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                transform: `scale(${logoScale})`,
              }}
            >
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  backgroundColor: THEME.colors.surfaceContainer,
                  border: `4px solid ${THEME.colors.primary}`,
                  boxShadow: '0 20px 50px rgba(242, 202, 80, 0.25), inset 0 2px 8px rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 100,
                  animation: 'pulse 2.5s infinite ease-in-out',
                }}
              >
                🐘
              </div>
            </div>

            {/* Bottom branding footer */}
            <div
              style={{
                fontFamily: THEME.fonts.display,
                fontSize: 20,
                color: THEME.colors.primary,
                fontWeight: '700',
                letterSpacing: 2,
                opacity: 0.8,
              }}
            >
              TEMBO PAGE
            </div>
          </SlideContainer>
        </div>
      )}

      {/* SLIDE 2: PERSONALIZATION */}
      {frame >= 200 && frame < 542 && (
        <div style={{ opacity: slide2Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="left">
            <TypoTitle
              title="Herd Personalization"
              subtitle="Links dynamically slide and reorder themselves in real-time based on your visitor's traffic origin!"
              startFrame={215}
            />

            {/* Main visual - iPhone showing Link Swap */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transform: `translateY(${phoneY}px)`,
                marginTop: 20,
              }}
            >
              {/* Traffic badge indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: -30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#000',
                  border: `1.5px solid ${trafficColor}`,
                  borderRadius: 20,
                  padding: '8px 20px',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: '700',
                  fontFamily: THEME.fonts.display,
                  zIndex: 20,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 15px ${trafficColor}44`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>Origin:</span>
                <span style={{ color: trafficColor }}>{trafficOrigin}</span>
              </div>

              {/* iPhone Mockup with custom rendered dynamic link list */}
              <PhoneMockup
                displayName="Savanna VFX Studio"
                bioText=" პროგრამული ვიდეო მონტაჟი • Smart Bio Link"
                links={[]} // Custom render to animate link positions
                highlightLinkId={frame < 350 ? 'tiktok' : 'instagram'}
                renderExtra={
                  <div
                    style={{
                      width: '100%',
                      position: 'relative',
                      height: 300,
                      marginTop: 10,
                    }}
                  >
                    {/* TikTok Link */}
                    <div
                      style={{
                        position: 'absolute',
                        top: linkTiktokY,
                        width: '100%',
                        backgroundColor: THEME.colors.surfaceContainer,
                        borderRadius: 14,
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: frame < 350 ? `2px solid ${THEME.colors.primary}` : '1px solid rgba(255,255,255,0.05)',
                        boxShadow: frame < 350 ? '0 0 15px rgba(242, 202, 80, 0.2)' : 'none',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 16 }}>📱</span>
                        <div style={{ fontSize: 13, fontWeight: '600', color: THEME.colors.onSurface }}>
                          TikTok Exclusive Offer
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: THEME.colors.onSurfaceVariant }}>➔</span>
                    </div>

                    {/* Instagram Link */}
                    <div
                      style={{
                        position: 'absolute',
                        top: linkInstagramY,
                        width: '100%',
                        backgroundColor: THEME.colors.surfaceContainer,
                        borderRadius: 14,
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: frame >= 350 ? `2px solid ${THEME.colors.primary}` : '1px solid rgba(255,255,255,0.05)',
                        boxShadow: frame >= 350 ? '0 0 15px rgba(242, 202, 80, 0.2)' : 'none',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 16 }}>📸</span>
                        <div style={{ fontSize: 13, fontWeight: '600', color: THEME.colors.onSurface }}>
                          Shop Instagram Merch
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: THEME.colors.onSurfaceVariant }}>➔</span>
                    </div>

                    {/* Booking Link (Stays fixed at bottom of this container) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 132,
                        width: '100%',
                        background: 'linear-gradient(135deg, #2d261e 0%, #1f1a14 100%)',
                        borderRadius: 16,
                        padding: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid rgba(242, 202, 80, 0.1)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 14, marginRight: 6 }}>📅</span>
                        <div style={{ fontSize: 13, fontWeight: '700', color: THEME.colors.primary }}>
                          VFX Consultation
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: THEME.colors.onSurfaceVariant, marginBottom: 6 }}>
                        Book 1-on-1 session
                      </div>
                      <div
                        style={{
                          backgroundColor: THEME.colors.primary,
                          color: '#000',
                          borderRadius: 8,
                          padding: '4px 0',
                          textAlign: 'center',
                          fontSize: 10,
                          fontWeight: '700',
                        }}
                      >
                        Book Now
                      </div>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Visual spacing helper */}
            <div style={{ height: 20 }} />
          </SlideContainer>
        </div>
      )}

      {/* SLIDE 3: OUTRO */}
      {frame >= 530 && (
        <div style={{ opacity: slide3Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="center">
            <TypoTitle
              title="Claim Your Savanna"
              subtitle="Experience the world's most intelligent bio link builder. Start optimizing your traffic today."
              startFrame={545}
            />

            {/* Glowing Golden CTA Card */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${endCardScale}) translateY(${endCardY}px)`,
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 500,
                  backgroundColor: '#1b170f',
                  border: `3px solid ${THEME.colors.primary}`,
                  borderRadius: 32,
                  padding: '48px 32px',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(242, 202, 80, 0.15)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Golden Badge Logo */}
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    backgroundColor: THEME.colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 44,
                    marginBottom: 24,
                    boxShadow: '0 10px 30px rgba(242, 202, 80, 0.4)',
                  }}
                >
                  🐘
                </div>

                <div
                  style={{
                    fontFamily: THEME.fonts.display,
                    fontSize: 42,
                    fontWeight: '800',
                    color: THEME.colors.onSurface,
                    marginBottom: 8,
                  }}
                >
                  tembo.page
                </div>

                <div
                  style={{
                    fontSize: 16,
                    color: THEME.colors.primaryFixed,
                    fontWeight: '600',
                    letterSpacing: 3,
                    fontFamily: THEME.fonts.display,
                    textTransform: 'uppercase',
                    marginBottom: 32,
                  }}
                >
                  Smart Bio Link Ecosystem
                </div>

                {/* Simulated Web Button */}
                <div
                  style={{
                    backgroundColor: THEME.colors.primary,
                    color: THEME.colors.surface,
                    fontFamily: THEME.fonts.display,
                    fontWeight: '800',
                    fontSize: 18,
                    padding: '16px 40px',
                    borderRadius: 16,
                    boxShadow: '0 15px 30px rgba(242, 202, 80, 0.3)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  Create Your Page Free ➔
                </div>
              </div>
            </div>

            {/* Bottom spacer */}
            <div style={{ height: 20 }} />
          </SlideContainer>
        </div>
      )}
    </div>
  );
};
