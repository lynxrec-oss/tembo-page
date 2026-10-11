import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from 'remotion';
import { SlideContainer } from '../components/SlideContainer';
import { TypoTitle } from '../components/TypoTitle';
import { THEME } from '../theme';

export const HowToAI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // TIMELINES
  // Slide 1: 0 - 450 (0s - 15s)
  // Slide 2: 450 - 1250 (15s - 41.6s)
  // Slide 3: 1250 - 1705 (41.6s - 56.8s)

  const slide1Opacity = interpolate(frame, [0, 15, 435, 450], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slide2Opacity = interpolate(frame, [440, 455, 1235, 1250], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slide3Opacity = interpolate(frame, [1240, 1255, 1690, 1705], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Slide 1 Telemetry Animations ---
  const viewsValue = Math.floor(
    interpolate(frame, [10, 400], [1042, 2847], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const ctrValue = interpolate(frame, [15, 400], [12.4, 24.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(1);

  const bounceSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 80 },
  });
  const metricScale = interpolate(bounceSpring, [0, 1], [0.8, 1]);

  // --- Slide 2 Vertex AI Animations ---
  const brainPulse = Math.sin(frame / 6) * 0.08 + 1;

  // Typewriter effects
  const line1 = '💡 Recommendation: Swap Booking to the top of your page.';
  const line2 = '📈 Insight: TikTok traffic is peaking! Leverage this now.';

  const line1Chars = Math.floor(
    interpolate(frame, [480, 750], [0, line1.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const line2Chars = Math.floor(
    interpolate(frame, [780, 1100], [0, line2.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const text1Visible = line1.slice(0, line1Chars);
  const text2Visible = line2.slice(0, line2Chars);

  // --- Slide 3 Outro Animations ---
  const ctaSpring = spring({
    frame: frame - 1255,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.7, 1]);
  const ctaY = interpolate(ctaSpring, [0, 1], [80, 0]);

  return (
    <div style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <Audio src={staticFile('audio/05-smart-pixel-setup.mp3')} volume={1.0} />
      <Audio src={staticFile('audio/music-cinematic-savannah.mp3')} volume={0.16} loop />

      {/* SLIDE 1: METRICS AND TELEMETRY */}
      {frame < 452 && (
        <div style={{ opacity: slide1Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="top">
            <TypoTitle
              title="Savanna Analytics"
              subtitle="Monitor impressions, click metrics, and conversion rates across your dynamic link hub in real-time."
              startFrame={5}
            />

            {/* Simulated telemetry cards */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 24,
                width: '100%',
                transform: `scale(${metricScale})`,
              }}
            >
              {/* Page Views Grid Card */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 480,
                  backgroundColor: THEME.colors.surfaceContainer,
                  border: '1.5px solid rgba(255,255,255,0.05)',
                  borderRadius: 28,
                  padding: '36px 32px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, color: THEME.colors.onSurfaceVariant, marginBottom: 8, fontFamily: THEME.fonts.display }}>
                  SAVANNA VIEWS
                </div>
                <div style={{ fontSize: 64, fontWeight: '800', color: THEME.colors.primary, fontFamily: THEME.fonts.display }}>
                  {viewsValue.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: THEME.colors.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                  <span>▲ 172.5%</span> <span style={{ color: THEME.colors.onSurfaceVariant }}>this week</span>
                </div>
              </div>

              {/* CTR Grid Card */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 480,
                  backgroundColor: THEME.colors.surfaceContainer,
                  border: '1.5px solid rgba(255,255,255,0.05)',
                  borderRadius: 28,
                  padding: '36px 32px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, color: THEME.colors.onSurfaceVariant, marginBottom: 8, fontFamily: THEME.fonts.display }}>
                  CLICK-THROUGH RATE
                </div>
                <div style={{ fontSize: 64, fontWeight: '800', color: THEME.colors.tertiary, fontFamily: THEME.fonts.display }}>
                  {ctrValue}%
                </div>
                <div style={{ fontSize: 12, color: THEME.colors.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                  <span>▲ 24.1%</span> <span style={{ color: THEME.colors.onSurfaceVariant }}>above target</span>
                </div>
              </div>
            </div>

            <div style={{ height: 20 }} />
          </SlideContainer>
        </div>
      )}

      {/* SLIDE 2: VERTEX AI INSIGHTS */}
      {frame >= 440 && frame < 1252 && (
        <div style={{ opacity: slide2Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="left">
            <TypoTitle
              title="Vertex AI Brain"
              subtitle="Let your links think. Get direct algorithmic consultations from Vertex AI to boost your digital click conversions."
              startFrame={450}
            />

            {/* AI Console Screen */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                gap: 32,
                marginTop: 20,
              }}
            >
              {/* Holographic Gemini Neural Logo */}
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f2ca50 0%, #a8841a 100%)',
                  boxShadow: '0 0 40px rgba(242, 202, 80, 0.4), inset 0 2px 10px rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 70,
                  transform: `scale(${brainPulse})`,
                  transition: 'transform 0.1s ease',
                }}
              >
                🧠
              </div>

              {/* Console logs */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 520,
                  height: 220,
                  backgroundColor: '#0d0a06',
                  border: `1.5px solid ${THEME.colors.primary}44`,
                  borderRadius: 20,
                  padding: '24px 20px',
                  fontFamily: 'monospace',
                  fontSize: 14,
                  lineHeight: '1.6',
                  color: THEME.colors.onSurfaceVariant,
                  boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ color: THEME.colors.primary, fontWeight: '700', fontSize: 13, borderBottom: '1px solid rgba(242,202,80,0.1)', paddingBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>🤖 DYNAMIC TELEMETRY ANALYZER</span>
                  <span style={{ animation: 'pulse 1.5s infinite' }}>● ONLINE</span>
                </div>

                {/* Simulated typewriter prints */}
                {frame >= 480 && (
                  <div style={{ color: '#fff', fontSize: 13 }}>
                    {text1Visible}
                    {frame >= 480 && frame < 750 && <span style={{ animation: 'pulse 0.8s infinite', color: THEME.colors.primary }}>|</span>}
                  </div>
                )}

                {frame >= 780 && (
                  <div style={{ color: '#fff', fontSize: 13 }}>
                    {text2Visible}
                    {frame >= 780 && frame < 1100 && <span style={{ animation: 'pulse 0.8s infinite', color: THEME.colors.primary }}>|</span>}
                  </div>
                )}
              </div>
            </div>

            <div style={{ height: 20 }} />
          </SlideContainer>
        </div>
      )}

      {/* SLIDE 3: AI OUTRO */}
      {frame >= 1240 && (
        <div style={{ opacity: slide3Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="center">
            <TypoTitle
              title="Unlock Smart Links"
              subtitle="Start building with a telemetry-focused bio-link engine. Claim your intelligent savanna dashboard today."
              startFrame={1250}
            />

            {/* Smart Marketing Showcase */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${ctaScale}) translateY(${ctaY}px)`,
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 480,
                  backgroundColor: '#1b170f',
                  border: `2px solid ${THEME.colors.primary}`,
                  borderRadius: 28,
                  padding: '40px 32px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(242, 202, 80, 0.1)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 16 }}>🚀</div>
                <div style={{ fontSize: 24, fontWeight: '700', color: '#fff', fontFamily: THEME.fonts.display, marginBottom: 8 }}>
                  Impressions ➔ Conversions
                </div>
                <div style={{ fontSize: 13, color: THEME.colors.onSurfaceVariant, lineHeight: 1.5, marginBottom: 28 }}>
                  Stop using simple list pages. Equip your brand with intelligent marketing templates and Vertex AI consulting.
                </div>

                <div
                  style={{
                    backgroundColor: THEME.colors.primary,
                    color: '#000',
                    fontFamily: THEME.fonts.display,
                    fontWeight: '800',
                    fontSize: 16,
                    padding: '14px 36px',
                    borderRadius: 14,
                    boxShadow: '0 10px 25px rgba(242,202,80,0.25)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Get Started Free
                </div>
              </div>
            </div>

            <div style={{ height: 20 }} />
          </SlideContainer>
        </div>
      )}
    </div>
  );
};
