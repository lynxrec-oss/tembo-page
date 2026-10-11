import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from 'remotion';
import { SlideContainer } from '../components/SlideContainer';
import { PhoneMockup, LinkItem } from '../components/PhoneMockup';
import { TypoTitle } from '../components/TypoTitle';
import { THEME } from '../theme';

export const TrafficPersonalization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Define timelines (Total: 780 frames = 26 seconds at 30fps)
  // Slide 1: 0 - 240 (0s - 8s) - TikTok vs YouTube
  // Slide 2: 240 - 600 (8s - 20s) - Real-time rearranging
  // Slide 3: 600 - 780 (20s - 26s) - Conversions / CTA

  const slide1Opacity = interpolate(frame, [0, 15, 225, 240], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slide2Opacity = interpolate(frame, [230, 245, 585, 600], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slide3Opacity = interpolate(frame, [590, 605, 765, 780], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Slide 1: Audience splitting animation
  const splitSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const leftBubbleX = interpolate(splitSpring, [0, 1], [0, -140]);
  const rightBubbleX = interpolate(splitSpring, [0, 1], [0, 140]);
  const bubbleScale = interpolate(splitSpring, [0, 1], [0.5, 1]);

  // Slide 2: Phone slide up entrance
  const phoneEntrance = spring({
    frame: frame - 245,
    fps,
    config: { damping: 14, stiffness: 70 },
  });
  const phoneY = interpolate(phoneEntrance, [0, 1], [600, 0]);

  // Slide 2: Dynamic link swap animation
  // Swap occurs between frame 380 and 410
  const swapProgress = spring({
    frame: frame - 380,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const linkTiktokY = interpolate(swapProgress, [0, 1], [0, 66]);
  const linkInstagramY = interpolate(swapProgress, [0, 1], [66, 0]);

  const trafficOrigin = frame < 395 ? 'TikTok 📱' : 'YouTube 📺';
  const trafficColor = frame < 395 ? '#25f4ee' : '#ff0000';

  // Slide 3: Card glow & scale entry
  const endCardSpring = spring({
    frame: frame - 605,
    fps,
    config: { damping: 12, stiffness: 90 },
  });
  const endCardScale = interpolate(endCardSpring, [0, 1], [0.6, 1]);
  const endCardY = interpolate(endCardSpring, [0, 1], [100, 0]);

  return (
    <div style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <Audio src={staticFile('audio/04-traffic-personalization.mp3')} volume={1.0} />
      <Audio src={staticFile('audio/music-upbeat-social.mp3')} volume={0.16} loop />

      {/* SLIDE 1: AUDIENCE SPLIT */}
      {frame < 242 && (
        <div style={{ opacity: slide1Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="top">
            <TypoTitle
              title="Tailor Your Audience"
              subtitle="Your social audiences are completely different. Why show them the exact same links?"
              startFrame={5}
            />

            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
              }}
            >
              {/* TikTok Bubble */}
              <div
                style={{
                  position: 'absolute',
                  transform: `translateX(${leftBubbleX}px) scale(${bubbleScale})`,
                  width: 130,
                  height: 130,
                  borderRadius: '50%',
                  backgroundColor: '#111',
                  border: '3px solid #25f4ee',
                  boxShadow: '0 0 30px rgba(37, 244, 238, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  gap: 4,
                }}
              >
                <span>📱</span>
                <span style={{ fontSize: 12, fontWeight: '700', color: '#fff', fontFamily: THEME.fonts.display }}>TikTok</span>
              </div>

              {/* YouTube Bubble */}
              <div
                style={{
                  position: 'absolute',
                  transform: `translateX(${rightBubbleX}px) scale(${bubbleScale})`,
                  width: 130,
                  height: 130,
                  borderRadius: '50%',
                  backgroundColor: '#111',
                  border: '3px solid #ff0000',
                  boxShadow: '0 0 30px rgba(255, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  gap: 4,
                }}
              >
                <span>📺</span>
                <span style={{ fontSize: 12, fontWeight: '700', color: '#fff', fontFamily: THEME.fonts.display }}>YouTube</span>
              </div>
            </div>
          </SlideContainer>
        </div>
      )}

      {/* SLIDE 2: PERSONALIZATION DEMO */}
      {frame >= 230 && frame < 602 && (
        <div style={{ opacity: slide2Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="left">
            <TypoTitle
              title="Automatic Sorting"
              subtitle="Tembo Page detects the traffic origin and re-orders link cards to present custom contents in real-time."
              startFrame={245}
            />

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
              {/* Traffic Origin Pill */}
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

              {/* iPhone with Dynamic Layout swap */}
              <PhoneMockup
                displayName="Savanna Wilds"
                bioText="Smart Visuals & Nature Guides"
                links={[]}
                highlightLinkId={frame < 395 ? 'tiktok' : 'youtube'}
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
                        border: frame < 395 ? `2px solid ${THEME.colors.primary}` : '1px solid rgba(255,255,255,0.05)',
                        boxShadow: frame < 395 ? '0 0 15px rgba(242, 202, 80, 0.2)' : 'none',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 16 }}>📱</span>
                        <div style={{ fontSize: 13, fontWeight: '600', color: THEME.colors.onSurface }}>
                          TikTok Exclusive Merch
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: THEME.colors.onSurfaceVariant }}>➔</span>
                    </div>

                    {/* YouTube Link */}
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
                        border: frame >= 395 ? `2px solid ${THEME.colors.primary}` : '1px solid rgba(255,255,255,0.05)',
                        boxShadow: frame >= 395 ? '0 0 15px rgba(242, 202, 80, 0.2)' : 'none',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 16 }}>📺</span>
                        <div style={{ fontSize: 13, fontWeight: '600', color: THEME.colors.onSurface }}>
                          Watch Latest YouTube Vlog
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: THEME.colors.onSurfaceVariant }}>➔</span>
                    </div>

                    {/* Consulting Booking */}
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
                          Wildlife Consultation
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: THEME.colors.onSurfaceVariant, marginBottom: 6 }}>
                        Book 1-on-1 strategy call
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
          </SlideContainer>
        </div>
      )}

      {/* SLIDE 3: OUTRO */}
      {frame >= 590 && (
        <div style={{ opacity: slide3Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="center">
            <TypoTitle
              title="Savannah Conversions"
              subtitle="Creators using Tembo see an average 34% lift in conversions without changing a single link."
              startFrame={605}
            />

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
                  Savannah sunset speed
                </div>

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
                  Optimize Your Traffic ➔
                </div>
              </div>
            </div>
          </SlideContainer>
        </div>
      )}
    </div>
  );
};
