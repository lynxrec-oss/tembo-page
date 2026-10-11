import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from 'remotion';
import { THEME } from '../theme';

// Seeded random number generator for physics particle positions
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const MasterExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLandscape = width > height;

  // 10-Scene Timelines (Total 5220 frames at 60fps = 87 seconds)
  const SCENE_FRAMES = useMemo(() => ({
    scene1: { start: 0, end: 420 },        // 0s - 7s (Logo Reveal)
    scene2: { start: 420, end: 1140 },     // 7s - 19s (The Problem)
    scene3: { start: 1140, end: 1440 },    // 19s - 24s (Glass Shatter)
    scene4: { start: 1440, end: 1980 },    // 24s - 33s (Phone Reveal)
    scene5: { start: 1980, end: 2700 },    // 33s - 45s (Campaign Manager)
    scene6: { start: 2700, end: 3420 },    // 45s - 57s (Analytics Dashboard)
    scene7: { start: 3420, end: 4020 },    // 57s - 67s (AI Insights)
    scene8: { start: 4020, end: 4500 },    // 67s - 75s (Chat Moment)
    scene9: { start: 4500, end: 4860 },    // 75s - 81s (The Close)
    scene10: { start: 4860, end: 5220 },   // 81s - 87s (CTA Onboarding)
  }), []);

  // Programmatic 200+ particle matrix for Scene 3 Shatter (Precomputed for performance)
  const particles = useMemo(() => {
    return Array.from({ length: 220 }).map((_, i) => {
      const angle = pseudoRandom(i * 12) * Math.PI * 2;
      const speed = 5 + pseudoRandom(i * 34) * 15;
      const size = 3 + pseudoRandom(i * 56) * 6;
      return { angle, speed, size };
    });
  }, []);

  // Programmatic 50 particle matrix for Scene 9 Floating Close
  const closeParticles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      left: pseudoRandom(i * 45) * 100,
      bottom: pseudoRandom(i * 78) * 100,
      size: 2 + pseudoRandom(i * 92) * 3,
      speed: 0.5 + pseudoRandom(i * 123) * 1.5,
      delay: Math.floor(pseudoRandom(i * 231) * 100),
    }));
  }, []);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#16130b',
        color: '#eae1d4',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Audio src={staticFile('audio/01-master-explainer.mp3')} volume={1.0} />
      <Audio src={staticFile('audio/music-cinematic-savannah.mp3')} volume={0.18} loop />

      {/* Import Montserrat & Inter Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;600;700;800;900&display=swap');
          * { box-sizing: border-box; }
          @keyframes shimmerSweep {
            0% { background-position: -200% 0%; }
            100% { background-position: 200% 0%; }
          }
          @keyframes rippleRing {
            0% { transform: scale(0.6); opacity: 1; }
            100% { transform: scale(2.4); opacity: 0; }
          }
          @keyframes hoverPulse {
            0%, 100% { border-color: rgba(242, 202, 80, 0.15); }
            50% { border-color: rgba(242, 202, 80, 0.4); }
          }
        `}
      </style>

      {/* SVG Background Noise Texture Overlay at exactly 4% opacity */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex: 999,
        }}
      />

      {/* ========================================================
          SCENE 1: LOGO REVEAL (0s - 7s | Frames 0 - 420)
          ======================================================== */}
      {frame >= SCENE_FRAMES.scene1.start && frame < SCENE_FRAMES.scene1.end && (() => {
        const localFrame = frame - SCENE_FRAMES.scene1.start;
        
        // Single gold dot springs in over 12 frames
        const dotSpring = spring({
          frame: localFrame,
          fps,
          config: { damping: 10, stiffness: 100 },
        });

        // Pulse dot glows twice (pulsing intervals)
        const dotPulseGlow = Math.max(0, Math.sin(localFrame / 15)) * 30;

        // Elephant Morphing starts at frame 90
        const morphProgress = spring({
          frame: localFrame - 90,
          fps,
          config: { damping: 14, stiffness: 60 },
        });

        const dotScale = interpolate(morphProgress, [0, 1], [interpolate(dotSpring, [0, 1], [0, 1.2]), 0]);
        const logoScale = interpolate(morphProgress, [0, 1], [0, 1]);
        const logoOpacity = interpolate(morphProgress, [0, 1], [0, 1]);

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {/* The Gold Dot */}
            {localFrame < 120 && (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#f2ca50',
                  transform: `scale(${dotScale})`,
                  boxShadow: `0 0 ${dotPulseGlow}px rgba(242, 202, 80, 0.8)`,
                }}
              />
            )}

            {/* Elephant SVG with Shimmer Gradient Overlay */}
            {localFrame >= 90 && (
              <div
                style={{
                  transform: `scale(${logoScale})`,
                  opacity: logoOpacity,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 120,
                    animation: 'float-anim 5s ease-in-out infinite',
                    background: 'linear-gradient(135deg, #c9a82c, #f2ca50, #ffe088, #f2ca50)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '900',
                  }}
                >
                  🐘
                </div>
                <div
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: 32,
                    fontWeight: '900',
                    color: '#eae1d4',
                    letterSpacing: '0.2em',
                    backgroundImage: 'linear-gradient(90deg, #eae1d4 0%, #ffe088 50%, #eae1d4 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmerSweep 4s linear infinite',
                  }}
                >
                  TEMBO
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================
          SCENE 2: THE PROBLEM (7s - 19s | Frames 420 - 1140)
          ======================================================== */}
      {frame >= SCENE_FRAMES.scene2.start && frame < SCENE_FRAMES.scene2.end && (() => {
        const localFrame = frame - SCENE_FRAMES.scene2.start;

        // Split screen vertical divide line entry
        const lineEntrance = spring({
          frame: localFrame,
          fps,
          config: { damping: 15 },
        });
        const lineYScale = interpolate(lineEntrance, [0, 1], [0, 1]);

        // Simulated touch cursor paths:
        // Starts off-screen, lands on middle button ("Shop My Merch") at local frame 120
        const cursorX = interpolate(localFrame, [0, 100, 120, 150, 200], [width * 0.1, width * 0.25, width * 0.25, width * 0.25, -200], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const cursorY = interpolate(localFrame, [0, 100, 120, 150, 200], [height * 0.8, height * 0.5, height * 0.5, height * 0.5, height * 0.8], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const cursorOpacity = interpolate(localFrame, [0, 15, 170, 200], [0, 1, 1, 0]);

        const clickedMiddle = localFrame >= 120 && localFrame < 140;

        // Analytics question staggers:
        const line1Opacity = interpolate(localFrame, [220, 250], [0, 1], { extrapolateLeft: 'clamp' });
        const line2Opacity = interpolate(localFrame, [270, 300], [0, 1], { extrapolateLeft: 'clamp' });
        const line3Opacity = interpolate(localFrame, [320, 350], [0, 1], { extrapolateLeft: 'clamp' });

        // Red overlay tint
        const redTintOpacity = interpolate(localFrame, [120, 350], [0, 0.05]);

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: isLandscape ? 'row' : 'column',
            }}
          >
            {/* Red Overlay Tint Layer */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(186, 26, 26, 1)',
                opacity: redTintOpacity,
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />

            {/* Left Panel: Static gray link tree list */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40,
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 13, color: '#666', marginBottom: 30, textTransform: 'uppercase', letterSpacing: 2 }}>
                Static List Page
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{ backgroundColor: '#2a2a2a', height: 50, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 14 }}>
                  My Latest Video
                </div>
                <div
                  style={{
                    backgroundColor: clickedMiddle ? '#3a3a3a' : '#2a2a2a',
                    height: 50,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: 14,
                    border: clickedMiddle ? '2px solid #555' : 'none',
                    transform: clickedMiddle ? 'scale(0.97)' : 'scale(1)',
                    transition: 'transform 0.1s ease',
                  }}
                >
                  Shop My Merch
                </div>
                <div style={{ backgroundColor: '#2a2a2a', height: 50, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 14 }}>
                  Book a Call
                </div>
              </div>
            </div>

            {/* Vertical Center 1px Gold Line */}
            <div
              style={{
                width: isLandscape ? 1 : '100%',
                height: isLandscape ? '100%' : 1,
                backgroundColor: 'rgba(242, 202, 80, 0.4)',
                transform: `scaleY(${lineYScale})`,
              }}
            />

            {/* Right Panel: Empty dark void */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#000000',
                display: 'flex',
                flexDirection: 'column',
                padding: 40,
                position: 'relative',
              }}
            >
              <div
                style={{
                  alignSelf: 'flex-end',
                  fontSize: 13,
                  color: '#99907c',
                  fontFamily: 'Montserrat',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                Your Analytics
              </div>

              {/* Three sequentially fading texts */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  paddingLeft: 30,
                  fontFamily: 'Montserrat',
                  fontWeight: '800',
                  fontSize: isLandscape ? 36 : 24,
                  color: '#ffb4ab',
                }}
              >
                <div style={{ opacity: line1Opacity, transform: `translateX(${(1 - line1Opacity) * -20}px)` }}>
                  Who clicked it?
                </div>
                <div style={{ opacity: line2Opacity, transform: `translateX(${(1 - line2Opacity) * -20}px)` }}>
                  Where they came from?
                </div>
                <div style={{ opacity: line3Opacity, transform: `translateX(${(1 - line3Opacity) * -20}px)` }}>
                  Why they left?
                </div>
              </div>
            </div>

            {/* Simulated touch pointer */}
            <div
              style={{
                position: 'absolute',
                left: cursorX,
                top: cursorY,
                transform: 'translate(-50%, -50%)',
                zIndex: 999,
                opacity: cursorOpacity,
                pointerEvents: 'none',
              }}
            >
              {clickedMiddle && (
                <div
                  style={{
                    position: 'absolute',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    border: '3px solid #ffb4ab',
                    animation: 'rippleRing 0.5s ease-out forwards',
                  }}
                />
              )}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#ffb4ab',
                  border: '2px solid #000',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          SCENE 3: GLASS SHATTER TRANSITION (19s - 24s | Frames 1140 - 1440)
          ======================================================== */}
      {frame >= SCENE_FRAMES.scene3.start && frame < SCENE_FRAMES.scene3.end && (() => {
        const localFrame = frame - SCENE_FRAMES.scene3.start;

        // Stage 1: Disperse particles outwards (0 - 100 frames)
        // Stage 2: Pause mid-air for 6 frames (100 - 106 frames)
        // Stage 3: Converge back to center (106 - 220 frames)
        // Stage 4: Form logo & glow (220 - 300 frames)

        const scatterProgress = interpolate(localFrame, [0, 100], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const holdsProgress = interpolate(localFrame, [100, 106], [1, 1]);

        const convergeProgress = interpolate(localFrame, [106, 210], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Particle layout coordinates logic
        const getParticlePos = (p: typeof particles[0]) => {
          if (localFrame < 100) {
            // Expanding out
            const dist = scatterProgress * p.speed * 18;
            return {
              x: Math.cos(p.angle) * dist,
              y: Math.sin(p.angle) * dist,
              scale: 1 - scatterProgress * 0.5,
              opacity: 1 - scatterProgress * 0.4,
            };
          } else if (localFrame < 106) {
            // Holding
            const dist = p.speed * 18;
            return {
              x: Math.cos(p.angle) * dist,
              y: Math.sin(p.angle) * dist,
              scale: 0.5,
              opacity: 0.6,
            };
          } else {
            // Reassembling / Converging back to center
            const startDist = p.speed * 18;
            const dist = (1 - convergeProgress) * startDist;
            return {
              x: Math.cos(p.angle) * dist,
              y: Math.sin(p.angle) * dist,
              scale: 0.5 + convergeProgress * 0.5,
              opacity: 0.6 + convergeProgress * 0.4,
            };
          }
        };

        // Form logo entry at frame 210
        const logoRevealSpring = spring({
          frame: localFrame - 200,
          fps,
          config: { damping: 10, stiffness: 90 },
        });

        const revealOpacity = interpolate(localFrame, [200, 220], [0, 1], { extrapolateLeft: 'clamp' });
        const subheadOpacity = interpolate(localFrame, [240, 270], [0, 1], { extrapolateLeft: 'clamp' });

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#16130b',
            }}
          >
            {/* The programmatically scattering particles */}
            {localFrame < 210 && (
              <div style={{ position: 'relative', width: 0, height: 0 }}>
                {particles.map((p, idx) => {
                  const layout = getParticlePos(p);
                  const color = idx % 2 === 0 ? '#f2ca50' : '#eae1d4';
                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: layout.x,
                        top: layout.y,
                        width: p.size,
                        height: p.size,
                        borderRadius: idx % 3 === 0 ? '0%' : '50%',
                        backgroundColor: color,
                        opacity: layout.opacity,
                        transform: `translate(-50%, -50%) scale(${layout.scale}) rotate(${p.angle * 10}rad)`,
                        boxShadow: `0 0 10px ${color}88`,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Reformed Glowing Logo Lockup */}
            {localFrame >= 200 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: revealOpacity,
                  transform: `scale(${logoRevealSpring})`,
                  gap: 16,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 90, animation: 'float-anim 6s infinite ease-in-out' }}>🐘</div>
                <h1
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: 64,
                    fontWeight: '900',
                    margin: 0,
                    padding: 0,
                    letterSpacing: '0.08em',
                    color: '#eae1d4',
                    textShadow: '0 0 40px rgba(242, 202, 80, 0.3)',
                  }}
                >
                  TEMBO <span style={{ color: '#f2ca50' }}>PAGE</span>
                </h1>
                <p
                  style={{
                    fontFamily: 'Inter',
                    fontSize: 20,
                    color: '#d0c5af',
                    opacity: subheadOpacity,
                    marginTop: 10,
                  }}
                >
                  There's a better way.
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================
          SCENE 4: PHONE REVEAL (24s - 33s | Frames 1440 - 1980)
          ======================================================== */}
      {frame >= SCENE_FRAMES.scene4.start && frame < SCENE_FRAMES.scene4.end && (() => {
        const localFrame = frame - SCENE_FRAMES.scene4.start;

        // Phone frames entrance spring
        const phoneEntrance = spring({
          frame: localFrame,
          fps,
          config: { damping: 14, stiffness: 70 },
        });
        const phoneY = interpolate(phoneEntrance, [0, 1], [650, 0]);

        // Continuous floating oscillation (sine wave)
        const floatOscillation = Math.sin(localFrame / 30) * 7 - 7;

        // Snapping sequential components
        const avatarScale = spring({ frame: localFrame - 40, fps, config: { damping: 10 } });
        const nameOpacity = interpolate(localFrame, [55, 75], [0, 1], { extrapolateLeft: 'clamp' });
        const bioOpacity = interpolate(localFrame, [70, 90], [0, 1], { extrapolateLeft: 'clamp' });

        // Staggered snapping cards
        const card1Scale = spring({ frame: localFrame - 85, fps, config: { damping: 11, stiffness: 100 } });
        const card2Scale = spring({ frame: localFrame - 93, fps, config: { damping: 11, stiffness: 100 } });
        const card3Scale = spring({ frame: localFrame - 101, fps, config: { damping: 11, stiffness: 100 } });
        const card4Scale = spring({ frame: localFrame - 109, fps, config: { damping: 11, stiffness: 100 } });

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: 40,
            }}
          >
            <div
              style={{
                transform: `translateY(${phoneY + floatOscillation}px)`,
                width: 300,
                height: 620,
                borderRadius: 44,
                backgroundColor: '#000000',
                border: '10px solid #1c1c1e',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(242, 202, 80, 0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Dynamic Island */}
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 90,
                  height: 22,
                  borderRadius: 20,
                  backgroundColor: '#000000',
                  zIndex: 20,
                }}
              />

              {/* Screen Contents */}
              <div
                style={{
                  flex: 1,
                  background: 'linear-gradient(180deg, #16130b 0%, #0c0c0e 100%)',
                  padding: '36px 20px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Profile Avatar */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f2ca50 0%, #ffe088 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    marginBottom: 12,
                    transform: `scale(${avatarScale})`,
                  }}
                >
                  🦁
                </div>

                {/* Profile Details */}
                <div style={{ opacity: nameOpacity, fontSize: 16, fontWeight: '700', fontFamily: 'Montserrat', color: '#eae1d4', marginBottom: 4 }}>
                  Savanna Wilds
                </div>
                <div style={{ opacity: bioOpacity, fontSize: 10, color: '#d0c5af', fontFamily: 'Inter', textAlign: 'center', marginBottom: 24 }}>
                  Smart Visuals & Nature Guides
                </div>

                {/* Snap-in cards */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Card 1: Video Card */}
                  <div
                    style={{
                      transform: `scale(${card1Scale})`,
                      backgroundColor: '#1a1710',
                      border: '1px solid rgba(242, 202, 80, 0.2)',
                      borderRadius: 12,
                      padding: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>▶️</span>
                    <div style={{ flex: 1, fontSize: 11, fontWeight: '600', color: '#eae1d4' }}>Watch Latest Wildlife Reel</div>
                  </div>

                  {/* Card 2: Booking Card */}
                  <div
                    style={{
                      transform: `scale(${card2Scale})`,
                      backgroundColor: '#121212',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 12,
                      padding: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16 }}>📅</span>
                      <div style={{ fontSize: 11, fontWeight: '600', color: '#eae1d4' }}>Book strategies consultation</div>
                    </div>
                    <span style={{ color: '#666', fontSize: 10 }}>➔</span>
                  </div>

                  {/* Card 3: Merch Card */}
                  <div
                    style={{
                      transform: `scale(${card3Scale})`,
                      backgroundColor: '#121212',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 12,
                      padding: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16 }}>🛍️</span>
                      <div style={{ fontSize: 11, fontWeight: '600', color: '#eae1d4' }}>Shop presets & templates</div>
                    </div>
                    <span style={{ color: '#666', fontSize: 10 }}>➔</span>
                  </div>

                  {/* Card 4: Email Signup */}
                  <div
                    style={{
                      transform: `scale(${card4Scale})`,
                      backgroundColor: '#121212',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 12,
                      padding: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                      <span style={{ fontSize: 14 }}>✉️</span>
                      <div style={{ fontSize: 9, color: '#666' }}>Enter your email</div>
                    </div>
                    <div style={{ backgroundColor: '#f2ca50', color: '#000', fontSize: 9, padding: '4px 10px', borderRadius: 6, fontWeight: '800' }}>
                      Join Hub
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          SCENE 5: CAMPAIGN MANAGER (33s - 45s | Frames 1980 - 2700)
          ======================================================== */}
      {frame >= SCENE_FRAMES.scene5.start && frame < SCENE_FRAMES.scene5.end && (() => {
        const localFrame = frame - SCENE_FRAMES.scene5.start;

        // Slide phone left (40% width in 16:9, or responsive bottom layout)
        const transitionSpring = spring({
          frame: localFrame,
          fps,
          config: { damping: 15 },
        });

        const phoneXPercent = interpolate(transitionSpring, [0, 1], [0, isLandscape ? -25 : 0]);
        const phoneYPercent = interpolate(transitionSpring, [0, 1], [0, isLandscape ? 0 : 25]);
        const rulesOpacity = interpolate(localFrame, [20, 50], [0, 1]);

        // Staggered rules entries
        const rule1Visible = localFrame >= 40;
        const rule2Visible = localFrame >= 120;
        const rule3Visible = localFrame >= 200;

        // Animate Arrow widths (drawing connections)
        const arrow1Width = interpolate(localFrame, [60, 90], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const arrow2Width = interpolate(localFrame, [140, 170], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const arrow3Width = interpolate(localFrame, [220, 250], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

        // Matching highlights in phone mockup (dynamic switching layouts!)
        // rule 1 triggers: 40 - 120 (TikTok) -> Video First Card highlighted
        // rule 2 triggers: 120 - 200 (Instagram) -> Merch First Card highlighted
        // rule 3 triggers: 200+ (YouTube) -> Course/Booking Card highlighted
        const currentHighlight = localFrame < 120 ? 'video' : localFrame < 200 ? 'merch' : 'booking';

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: isLandscape ? 'row' : 'column-reverse',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
            }}
          >
            {/* Phone container */}
            <div
              style={{
                transform: `translate(${phoneXPercent}vw, ${phoneYPercent}vh) scale(0.95)`,
                transition: 'transform 0.1s ease',
                zIndex: 5,
              }}
            >
              <div
                style={{
                  width: 300,
                  height: 600,
                  borderRadius: 44,
                  backgroundColor: '#000',
                  border: '10px solid #1c1c1e',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ flex: 1, background: 'linear-gradient(180deg, #16130b 0%, #0c0c0e 100%)', padding: '30px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Avatar */}
                  <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#f2ca50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 8 }}>
                    🦁
                  </div>
                  <div style={{ fontSize: 12, fontWeight: '700', color: '#fff', marginBottom: 20 }}>Savanna Wilds</div>

                  {/* Adaptive links according to current highlighted rule */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Video Card */}
                    <div
                      style={{
                        backgroundColor: currentHighlight === 'video' ? '#2d261e' : '#121212',
                        border: currentHighlight === 'video' ? '1.5px solid #f2ca50' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        padding: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transform: currentHighlight === 'video' ? 'scale(1.03)' : 'scale(1)',
                        boxShadow: currentHighlight === 'video' ? '0 0 15px rgba(242, 202, 80, 0.2)' : 'none',
                        order: currentHighlight === 'video' ? -1 : 0,
                      }}
                    >
                      <span style={{ fontSize: 14 }}>▶️</span>
                      <div style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}>Featured Wildlife Reel</div>
                    </div>

                    {/* Merch Card */}
                    <div
                      style={{
                        backgroundColor: currentHighlight === 'merch' ? '#2d261e' : '#121212',
                        border: currentHighlight === 'merch' ? '1.5px solid #f2ca50' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        padding: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transform: currentHighlight === 'merch' ? 'scale(1.03)' : 'scale(1)',
                        boxShadow: currentHighlight === 'merch' ? '0 0 15px rgba(242, 202, 80, 0.2)' : 'none',
                        order: currentHighlight === 'merch' ? -1 : 0,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 14 }}>🛍️</span>
                        <div style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}>Shop Safari Presets</div>
                      </div>
                      <span style={{ color: '#666', fontSize: 9 }}>➔</span>
                    </div>

                    {/* Booking Card */}
                    <div
                      style={{
                        backgroundColor: currentHighlight === 'booking' ? '#2d261e' : '#121212',
                        border: currentHighlight === 'booking' ? '1.5px solid #f2ca50' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        padding: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transform: currentHighlight === 'booking' ? 'scale(1.03)' : 'scale(1)',
                        boxShadow: currentHighlight === 'booking' ? '0 0 15px rgba(242, 202, 80, 0.2)' : 'none',
                        order: currentHighlight === 'booking' ? -1 : 0,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 14 }}>📅</span>
                        <div style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}>1-on-1 Strategy Call</div>
                      </div>
                      <span style={{ color: '#666', fontSize: 9 }}>➔</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Rules Panel */}
            <div
              style={{
                width: isLandscape ? '50%' : '100%',
                opacity: rulesOpacity,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                paddingLeft: isLandscape ? 40 : 0,
                marginTop: isLandscape ? 0 : 20,
              }}
            >
              <div>
                <h2 style={{ fontFamily: 'Montserrat', fontSize: 32, fontWeight: '800', color: '#eae1d4', margin: '0 0 4px 0' }}>
                  Campaign Manager
                </h2>
                <p style={{ fontSize: 16, color: '#d0c5af', margin: 0, padding: 0 }}>Smart Routing Rules</p>
              </div>

              {/* Dynamic routing rules stacks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Rule 1: TikTok */}
                {rule1Visible && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      opacity: currentHighlight === 'video' ? 1 : 0.4,
                      transform: currentHighlight === 'video' ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ backgroundColor: 'rgba(242,202,80,0.08)', border: '1px solid rgba(242,202,80,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: '600', color: '#f2ca50', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>📱</span> TikTok
                    </div>
                    {/* SVG Connector Arrow */}
                    <div style={{ width: 60, height: 2, backgroundColor: 'rgba(242,202,80,0.15)', position: 'relative' }}>
                      <div style={{ width: arrow1Width, height: '100%', backgroundColor: '#f2ca50' }} />
                      <div style={{ position: 'absolute', right: 0, top: -4, borderWidth: '5px 0 5px 8px', borderStyle: 'solid', borderColor: `transparent transparent transparent ${arrow1Width >= 60 ? '#f2ca50' : 'transparent'}` }} />
                    </div>
                    <div style={{ backgroundColor: 'rgba(111,230,146,0.1)', border: '1px solid rgba(111,230,146,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: '600', color: '#6fe692' }}>
                      Video First Layout
                    </div>
                  </div>
                )}

                {/* Rule 2: Instagram */}
                {rule2Visible && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      opacity: currentHighlight === 'merch' ? 1 : 0.4,
                      transform: currentHighlight === 'merch' ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ backgroundColor: 'rgba(242,202,80,0.08)', border: '1px solid rgba(242,202,80,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: '600', color: '#f2ca50', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>📸</span> Instagram
                    </div>
                    {/* Arrow */}
                    <div style={{ width: 60, height: 2, backgroundColor: 'rgba(242,202,80,0.15)', position: 'relative' }}>
                      <div style={{ width: arrow2Width, height: '100%', backgroundColor: '#f2ca50' }} />
                      <div style={{ position: 'absolute', right: 0, top: -4, borderWidth: '5px 0 5px 8px', borderStyle: 'solid', borderColor: `transparent transparent transparent ${arrow2Width >= 60 ? '#f2ca50' : 'transparent'}` }} />
                    </div>
                    <div style={{ backgroundColor: 'rgba(111,230,146,0.1)', border: '1px solid rgba(111,230,146,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: '600', color: '#6fe692' }}>
                      Merch First Layout
                    </div>
                  </div>
                )}

                {/* Rule 3: YouTube */}
                {rule3Visible && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      opacity: currentHighlight === 'booking' ? 1 : 0.4,
                      transform: currentHighlight === 'booking' ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ backgroundColor: 'rgba(242,202,80,0.08)', border: '1px solid rgba(242,202,80,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: '600', color: '#f2ca50', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>🎥</span> YouTube
                    </div>
                    {/* Arrow */}
                    <div style={{ width: 60, height: 2, backgroundColor: 'rgba(242,202,80,0.15)', position: 'relative' }}>
                      <div style={{ width: arrow3Width, height: '100%', backgroundColor: '#f2ca50' }} />
                      <div style={{ position: 'absolute', right: 0, top: -4, borderWidth: '5px 0 5px 8px', borderStyle: 'solid', borderColor: `transparent transparent transparent ${arrow3Width >= 60 ? '#f2ca50' : 'transparent'}` }} />
                    </div>
                    <div style={{ backgroundColor: 'rgba(111,230,146,0.1)', border: '1px solid rgba(111,230,146,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: '600', color: '#6fe692' }}>
                      Course First Layout
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom tag line overlay */}
              {localFrame >= 250 && (
                <div
                  style={{
                    fontSize: 16,
                    color: '#d0c5af',
                    fontFamily: 'Inter',
                    marginTop: 10,
                    animation: 'float-anim 4s ease-in-out infinite',
                  }}
                >
                  Different audience. Different experience. <span style={{ color: '#f2ca50', fontWeight: 'bold' }}>Same link.</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          SCENE 6: ANALYTICS DASHBOARD (45s - 57s | Frames 2700 - 3420)
          ======================================================== */}
      {frame >= SCENE_FRAMES.scene6.start && frame < SCENE_FRAMES.scene6.end && (() => {
        const localFrame = frame - SCENE_FRAMES.scene6.start;

        // Dashboard panel entrance slides up
        const dashboardSpring = spring({
          frame: localFrame,
          fps,
          config: { damping: 15, stiffness: 70 },
        });
        const dashY = interpolate(dashboardSpring, [0, 1], [800, 0]);

        // Counting telemetry progress values
        const viewsCount = Math.floor(interpolate(localFrame, [20, 180], [0, 124500], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
        const clicksCount = Math.floor(interpolate(localFrame, [20, 180], [0, 42100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
        const ctrCount = interpolate(localFrame, [20, 180], [0, 33.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }).toFixed(1);
        const revenueCount = Math.floor(interpolate(localFrame, [30, 210], [0, 8450], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

        const isRevCompleted = localFrame >= 210;
        const revPulseGlow = isRevCompleted ? Math.max(0, Math.sin((localFrame - 210) / 10)) * 25 : 0;

        // Funnel connectors drawing progress
        const step1Height = interpolate(localFrame, [190, 240], [0, 50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const step2Height = interpolate(localFrame, [240, 290], [0, 50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const funnelTextOpacity = interpolate(localFrame, [290, 320], [0, 1]);

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '60px 40px',
              backgroundColor: '#16130b',
              backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% -5%, rgba(242, 202, 80, 0.12) 0%, transparent 80%)',
              transform: `translateY(${dashY}px)`,
            }}
          >
            {/* Stat Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isLandscape ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
                gap: 16,
                marginBottom: 30,
              }}
            >
              {/* Card 1: Views */}
              <div style={{ backgroundColor: '#121212', border: '1px solid rgba(242,202,80,0.15)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#d0c5af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Page Views</div>
                <div style={{ fontSize: 28, fontWeight: '800', fontFamily: 'Montserrat', color: '#eae1d4' }}>{viewsCount.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#6fe692', marginTop: 4 }}>+12.4% this week</div>
              </div>

              {/* Card 2: Clicks */}
              <div style={{ backgroundColor: '#121212', border: '1px solid rgba(242,202,80,0.15)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#d0c5af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Clicks</div>
                <div style={{ fontSize: 28, fontWeight: '800', fontFamily: 'Montserrat', color: '#eae1d4' }}>{clicksCount.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#6fe692', marginTop: 4 }}>+8.2% healthy</div>
              </div>

              {/* Card 3: CTR */}
              <div style={{ backgroundColor: '#121212', border: '1px solid rgba(242,202,80,0.15)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#d0c5af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>CTR</div>
                <div style={{ fontSize: 28, fontWeight: '800', fontFamily: 'Montserrat', color: '#eae1d4' }}>{ctrCount}%</div>
                <div style={{ fontSize: 10, color: '#ffb4ab', marginTop: 4 }}>-1.4% drop</div>
              </div>

              {/* Card 4: Revenue Tracked (Pulse glow on completion) */}
              <div
                style={{
                  backgroundColor: '#121212',
                  border: '1.5px solid #f2ca50',
                  borderRadius: 16,
                  padding: 20,
                  textAlign: 'center',
                  boxShadow: `0 0 ${revPulseGlow}px rgba(242, 202, 80, 0.4)`,
                  transition: 'box-shadow 0.1s ease',
                }}
              >
                <div style={{ fontSize: 11, color: '#f2ca50', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontWeight: 'bold' }}>Revenue Tracked</div>
                <div style={{ fontSize: 28, fontWeight: '800', fontFamily: 'Montserrat', color: '#f2ca50' }}>${revenueCount.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#6fe692', marginTop: 4 }}>+24.5% peak</div>
              </div>
            </div>

            {/* Smart Pixel Funnel chart */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#0c0c0e',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.04)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 460 }}>
                {/* Step 1 */}
                <div style={{ width: '100%', backgroundColor: '#121212', borderLeft: '4px solid #f2ca50', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: '700' }}>1. Page Landed</span>
                  <span style={{ fontSize: 12, fontWeight: '800', fontFamily: 'Montserrat', color: '#eae1d4' }}>124,500 (100%)</span>
                </div>

                {/* Connector Line 1 */}
                <div style={{ width: 2, height: 35, backgroundColor: 'rgba(255,255,255,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100%', height: step1Height, backgroundColor: '#f2ca50' }} />
                  {localFrame >= 240 && (
                    <span style={{ position: 'absolute', left: 12, fontSize: 10, color: '#ffb4ab', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      -34% Drop-off
                    </span>
                  )}
                </div>

                {/* Step 2 */}
                <div style={{ width: '100%', backgroundColor: '#121212', borderLeft: '4px solid rgba(242, 202, 80, 0.4)', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: '700' }}>2. Link Clicked</span>
                  <span style={{ fontSize: 12, fontWeight: '800', fontFamily: 'Montserrat', color: '#eae1d4' }}>82,170 (66%)</span>
                </div>

                {/* Connector Line 2 */}
                <div style={{ width: 2, height: 35, backgroundColor: 'rgba(255,255,255,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100%', height: step2Height, backgroundColor: '#ffb4ab' }} />
                  {localFrame >= 290 && (
                    <span style={{ position: 'absolute', left: 12, fontSize: 10, color: '#ffb4ab', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      -95% Drop-off
                    </span>
                  )}
                </div>

                {/* Step 3 */}
                <div
                  style={{
                    width: '100%',
                    backgroundColor: '#121212',
                    border: '1.5px solid #6fe692',
                    borderLeft: '4px solid #6fe692',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: localFrame >= 290 ? '0 0 15px rgba(111, 230, 146, 0.2)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: '700', color: '#6fe692' }}>3. Sales Conversion</span>
                  <span style={{ fontSize: 12, fontWeight: '800', fontFamily: 'Montserrat', color: '#6fe692' }}>3,420 (2.7%)</span>
                </div>
              </div>

              {/* Bottom text overlay banner */}
              {localFrame >= 310 && (
                <div
                  style={{
                    opacity: funnelTextOpacity,
                    marginTop: 24,
                    textAlign: 'center',
                    fontFamily: 'Montserrat',
                    fontSize: isLandscape ? 20 : 15,
                    fontWeight: '800',
                    color: '#f2ca50',
                    animation: 'float-anim 4s infinite ease-in-out',
                  }}
                >
                  Linktree shows you clicks. <span style={{ color: '#fff' }}>Tembo shows you money.</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          SCENE 7: AI INSIGHTS (57s - 67s | Frames 3420 - 4020)
          ======================================================= */}
      {frame >= SCENE_FRAMES.scene7.start && frame < SCENE_FRAMES.scene7.end && (() => {
        const localFrame = frame - SCENE_FRAMES.scene7.start;

        // Slide in panel from right
        const entranceSpring = spring({
          frame: localFrame,
          fps,
          config: { damping: 15, stiffness: 70 },
        });
        const entranceX = interpolate(entranceSpring, [0, 1], [600, 0]);

        // Stagger card triggers
        const card1Trigger = localFrame >= 20;
        const card2Trigger = localFrame >= 140;
        const card3Trigger = localFrame >= 260;

        // Card Border glow loops
        const activeHover = localFrame < 140 ? 'card1' : localFrame < 260 ? 'card2' : 'card3';

        // Typewriter scripts
        const script1 = 'Instagram visitors click merch 2.4x more than other visitors.';
        const script2 = 'Move your best-performing card higher to increase overall CTR.';
        const script3 = 'YouTube visitors spend more time on video cards. Featured reels helpful.';

        const charCount1 = Math.min(script1.length, Math.floor(interpolate(localFrame - 25, [0, 80], [0, script1.length], { extrapolateLeft: 'clamp' })));
        const charCount2 = Math.min(script2.length, Math.floor(interpolate(localFrame - 145, [0, 80], [0, script2.length], { extrapolateLeft: 'clamp' })));
        const charCount3 = Math.min(script3.length, Math.floor(interpolate(localFrame - 265, [0, 80], [0, script3.length], { extrapolateLeft: 'clamp' })));

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '60px 40px',
              backgroundColor: '#16130b',
              transform: `translateX(${entranceX}px)`,
              justifyContent: 'center',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30 }}>
              <span style={{ fontSize: 36 }}>🧠</span>
              <div>
                <h1 style={{ fontFamily: 'Montserrat', fontSize: 30, fontWeight: '900', color: '#f2ca50', margin: 0 }}>
                  Tembo AI Insights
                </h1>
                <p style={{ fontSize: 13, color: '#d0c5af', margin: 0 }}>Real-time conversion recommendations</p>
              </div>
            </div>

            {/* List stacks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Card 1 */}
              {card1Trigger && (
                <div
                  style={{
                    backgroundColor: '#121212',
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    border: activeHover === 'card1' ? '1.5px solid #f2ca50' : '1px solid rgba(242,202,80,0.15)',
                    boxShadow: activeHover === 'card1' ? '0 0 20px rgba(242,202,80,0.15)' : 'none',
                    transform: activeHover === 'card1' ? 'scale(1.01)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ fontSize: 24, padding: 10, backgroundColor: 'rgba(111,230,146,0.1)', borderRadius: 12 }}>🛍️</div>
                  <div style={{ fontSize: 14, fontFamily: 'Inter', color: '#eae1d4', lineHeight: 1.5 }}>
                    {script1.slice(0, charCount1)}
                    {localFrame >= 25 && localFrame < 105 && <span style={{ color: '#6fe692' }}>|</span>}
                  </div>
                </div>
              )}

              {/* Card 2 */}
              {card2Trigger && (
                <div
                  style={{
                    backgroundColor: '#121212',
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    border: activeHover === 'card2' ? '1.5px solid #f2ca50' : '1px solid rgba(242,202,80,0.15)',
                    boxShadow: activeHover === 'card2' ? '0 0 20px rgba(242,202,80,0.15)' : 'none',
                    transform: activeHover === 'card2' ? 'scale(1.01)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ fontSize: 24, padding: 10, backgroundColor: 'rgba(255,180,171,0.1)', borderRadius: 12 }}>⬆️</div>
                  <div style={{ fontSize: 14, fontFamily: 'Inter', color: '#eae1d4', lineHeight: 1.5 }}>
                    {script2.slice(0, charCount2)}
                    {localFrame >= 145 && localFrame < 225 && <span style={{ color: '#ffb4ab' }}>|</span>}
                  </div>
                </div>
              )}

              {/* Card 3 */}
              {card3Trigger && (
                <div
                  style={{
                    backgroundColor: '#121212',
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    border: activeHover === 'card3' ? '1.5px solid #f2ca50' : '1px solid rgba(242,202,80,0.15)',
                    boxShadow: activeHover === 'card3' ? '0 0 20px rgba(242,202,80,0.15)' : 'none',
                    transform: activeHover === 'card3' ? 'scale(1.01)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ fontSize: 24, padding: 10, backgroundColor: 'rgba(242,202,80,0.1)', borderRadius: 12 }}>⏱️</div>
                  <div style={{ fontSize: 14, fontFamily: 'Inter', color: '#eae1d4', lineHeight: 1.5 }}>
                    {script3.slice(0, charCount3)}
                    {localFrame >= 265 && localFrame < 345 && <span style={{ color: '#f2ca50' }}>|</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          SCENE 8: CHAT MOMENT (67s - 75s | Frames 4020 - 4500)
          ======================================================= */}
      {frame >= SCENE_FRAMES.scene8.start && frame < SCENE_FRAMES.scene8.end && (() => {
        const localFrame = frame - SCENE_FRAMES.scene8.start;

        // Phone centers and floats
        const floatOsc = Math.sin(localFrame / 20) * 5;

        // Chat bubble enters at frame 15, pulses
        const bubbleEntrance = spring({ frame: localFrame - 15, fps });
        const bubbleScale = interpolate(bubbleEntrance, [0, 1], [0, 1]);
        const bubblePulse = 1 + Math.sin(localFrame / 8) * 0.05;

        // Chat slide up overlay starts at frame 80
        const chatSpring = spring({ frame: localFrame - 80, fps, config: { damping: 14 } });
        const chatWindowY = interpolate(chatSpring, [0, 1], [500, 0]);

        // Conversation typings
        const msg1 = 'Looking for the coaching program?';
        const msg2 = "I'd love to help! Here's the strategy session perfect for you 👇";

        const count1 = Math.min(msg1.length, Math.floor(interpolate(localFrame - 110, [0, 50], [0, msg1.length], { extrapolateLeft: 'clamp' })));
        const count2 = Math.min(msg2.length, Math.floor(interpolate(localFrame - 180, [0, 70], [0, msg2.length], { extrapolateLeft: 'clamp' })));

        // Booking card enters inside chat at frame 270
        const cardEntrance = spring({ frame: localFrame - 270, fps });
        const cardScale = interpolate(cardEntrance, [0, 1], [0, 1]);

        // Conversion Checkmark chimes at frame 360
        const isConverted = localFrame >= 360;
        const checkScale = spring({ frame: localFrame - 360, fps, config: { damping: 10 } });
        const checkScaleVal = interpolate(checkScale, [0, 1], [0, 1]);

        // Revenue Increments
        const revVal = isConverted ? 497 : 0;

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#16130b',
            }}
          >
            {/* Centralizing iPhone */}
            <div
              style={{
                width: 300,
                height: 600,
                borderRadius: 44,
                backgroundColor: '#000',
                border: '10px solid #1c1c1e',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(${floatOsc}px)`,
              }}
            >
              <div style={{ flex: 1, background: 'linear-gradient(180deg, #16130b 0%, #0c0c0e 100%)', padding: '30px 20px 20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                
                {/* Profile Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#f2ca50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 6 }}>🦁</div>
                  <div style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>Savanna Wilds</div>
                </div>

                {/* Default Links Stack */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, opacity: localFrame >= 80 ? 0.1 : 1, transition: 'opacity 0.3s' }}>
                  <div style={{ backgroundColor: '#121212', borderRadius: 12, padding: 10, fontSize: 10 }}>▶️ Featured Video</div>
                  <div style={{ backgroundColor: '#121212', borderRadius: 12, padding: 10, fontSize: 10 }}>🛍️ Shop Safari Presets</div>
                </div>

                {/* Chat Bubble floating inside phone bottom-right */}
                {localFrame < 80 && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 16,
                      bottom: 24,
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: '#f2ca50',
                      boxShadow: '0 8px 24px rgba(242, 202, 80, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      transform: `scale(${bubbleScale * bubblePulse})`,
                    }}
                  >
                    💬
                  </div>
                )}

                {/* Chat Window sliding up */}
                {localFrame >= 80 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: '100%',
                      height: 400,
                      backgroundColor: '#121212',
                      borderTop: '2.5px solid #f2ca50',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      transform: `translateY(${chatWindowY}px)`,
                      boxShadow: '0 -15px 30px rgba(0,0,0,0.5)',
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Chat Header */}
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>Tembo Assistant</div>
                      <div style={{ fontSize: 8, color: '#f2ca50' }}>Typically replies instantly</div>
                    </div>

                    {/* Messages */}
                    {localFrame >= 110 && (
                      <div style={{ alignSelf: 'flex-start', backgroundColor: '#231f17', color: '#eae1d4', padding: '8px 12px', borderRadius: 12, fontSize: 10, maxWidth: '85%' }}>
                        {msg1.slice(0, count1)}
                      </div>
                    )}

                    {localFrame >= 180 && (
                      <div style={{ alignSelf: 'flex-start', backgroundColor: '#1a1a1a', color: '#eae1d4', border: '1px solid rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: 12, fontSize: 10, maxWidth: '85%' }}>
                        {msg2.slice(0, count2)}
                      </div>
                    )}

                    {/* Booking Card snaps in */}
                    {localFrame >= 270 && (
                      <div
                        style={{
                          transform: `scale(${cardScale})`,
                          backgroundColor: '#2d261e',
                          border: '1.5px solid #f2ca50',
                          borderRadius: 14,
                          padding: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        }}
                      >
                        <div style={{ fontSize: 10, fontWeight: '700', color: '#f2ca50' }}>Strategy Session</div>
                        <div style={{ fontSize: 8, color: '#d0c5af' }}>Select a 1-on-1 strategy call</div>
                        <div style={{ backgroundColor: '#f2ca50', color: '#000', borderRadius: 6, padding: '4px 0', textAlign: 'center', fontSize: 9, fontWeight: '900', animation: 'float-anim 3s infinite ease-in-out' }}>
                          Book Strategy 👇
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Glowing checkmark & revenue chime HUD */}
            {isConverted && (
              <div
                style={{
                  position: 'absolute',
                  zIndex: 200,
                  transform: `scale(${checkScaleVal})`,
                  backgroundColor: '#121212',
                  border: '2px solid #6fe692',
                  borderRadius: 24,
                  padding: '24px 32px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(111,230,146,0.3)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#6fe692', display: 'flex', alignItems: 'center', fontSize: 32, color: '#000', fontWeight: 'bold', justifyContent: 'center' }}>
                  ✓
                </div>
                <div style={{ fontFamily: 'Montserrat', fontSize: 18, fontWeight: '900', color: '#6fe692' }}>CONVERSION!</div>
                <div style={{ fontSize: 24, fontWeight: '800', color: '#fff', fontFamily: 'Montserrat' }}>+${revVal}</div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================
          SCENE 9: THE CLOSE (75s - 81s | Frames 4500 - 4860)
          ======================================================= */}
      {frame >= SCENE_FRAMES.scene9.start && frame < SCENE_FRAMES.scene9.end && (() => {
        const localFrame = frame - SCENE_FRAMES.scene9.start;

        // Logo scale in
        const scaleSpring = spring({ frame: localFrame, fps, config: { damping: 12 } });
        const logoScale = interpolate(scaleSpring, [0, 1], [0.6, 1]);

        // Blinking typewriter tagline
        const tagline = 'Never Forget a Click.';
        const printedChars = Math.min(tagline.length, Math.floor(interpolate(localFrame - 30, [0, 80], [0, tagline.length], { extrapolateLeft: 'clamp' })));
        
        // Blink cursor details
        const isBlinking = Math.floor(localFrame / 15) % 2 === 0;

        // Fades below sequentially (Free to start)
        const word1Opacity = interpolate(localFrame, [160, 180], [0, 1], { extrapolateLeft: 'clamp' });
        const word2Opacity = interpolate(localFrame, [190, 210], [0, 1], { extrapolateLeft: 'clamp' });
        const word3Opacity = interpolate(localFrame, [220, 240], [0, 1], { extrapolateLeft: 'clamp' });

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#16130b',
              padding: 40,
            }}
          >
            {/* 50 slowly floating gold upward particles */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, pointerEvents: 'none' }}>
              {closeParticles.map((pt, index) => {
                const pY = ((100 - ((localFrame * pt.speed * 0.4 + pt.bottom) % 100)) % 100);
                return (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      left: `${pt.left}%`,
                      top: `${pY}%`,
                      width: pt.size,
                      height: pt.size,
                      borderRadius: '50%',
                      backgroundColor: '#f2ca50',
                      opacity: 0.3,
                      boxShadow: '0 0 8px rgba(242,202,80,0.5)',
                    }}
                  />
                );
              })}
            </div>

            {/* Elephant Mark */}
            <div style={{ fontSize: 70, marginBottom: 20, transform: `scale(${logoScale})`, animation: 'float-anim 4s infinite' }}>🐘</div>

            {/* Title typewriter */}
            <h1
              style={{
                fontFamily: 'Montserrat',
                fontSize: isLandscape ? 48 : 32,
                fontWeight: '900',
                color: '#f2ca50',
                margin: 0,
                textAlign: 'center',
              }}
            >
              {tagline.slice(0, printedChars)}
              {isBlinking && <span style={{ color: '#f2ca50' }}>|</span>}
            </h1>

            {/* Free to start fades */}
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 20,
                fontSize: 24,
                fontWeight: '700',
                fontFamily: 'Inter',
              }}
            >
              <span style={{ opacity: word1Opacity, color: '#eae1d4' }}>Free</span>
              <span style={{ opacity: word2Opacity, color: '#eae1d4' }}>to</span>
              <span style={{ opacity: word3Opacity, color: '#f2ca50' }}>start.</span>
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          SCENE 10: CTA ONBOARDING (81s - 87s | Frames 4860 - 5220)
          ======================================================= */}
      {frame >= SCENE_FRAMES.scene10.start && (() => {
        const localFrame = frame - SCENE_FRAMES.scene10.start;

        // Slides in from bottom
        const onboardSpring = spring({ frame: localFrame, fps, config: { damping: 14 } });
        const onboardY = interpolate(onboardSpring, [0, 1], [600, 0]);

        // Progress bar fills 1/3
        const barWidth = interpolate(localFrame, [10, 80], [0, 33.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

        // Username typing letter-by-letter
        const username = 'yourname';
        const typeCount = Math.min(username.length, Math.floor(interpolate(localFrame - 40, [0, 60], [0, username.length], { extrapolateLeft: 'clamp' })));

        // Button pulse
        const buttonBounce = 1 + Math.sin(localFrame / 12) * 0.03;

        // Holds final 3 frames fade-out except logo
        const finalFade = interpolate(localFrame, [330, 355], [1, 0], { extrapolateLeft: 'clamp' });

        return (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#16130b',
              padding: 40,
            }}
          >
            {/* The onboarding pane */}
            <div
              style={{
                opacity: finalFade,
                transform: `translateY(${onboardY}px)`,
                width: '100%',
                maxWidth: 480,
                backgroundColor: '#121212',
                border: '1.5px solid rgba(242, 202, 80, 0.2)',
                borderRadius: 28,
                padding: 32,
                boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: '800', fontFamily: 'Montserrat', color: '#f2ca50' }}>CREATE YOUR ESTATE</div>
                <div style={{ fontSize: 10, color: '#d0c5af' }}>Step 1 of 3</div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: 6, backgroundColor: '#222', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: `${barWidth}%`, height: '100%', backgroundColor: '#f2ca50', boxShadow: '0 0 10px #f2ca50' }} />
              </div>

              {/* Input Username field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: '700', color: '#eae1d4' }}>CLAIM YOUR URL</label>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', fontSize: 14 }}>
                  <span style={{ color: '#d0c5af', marginRight: 2 }}>tembo.page/</span>
                  <span style={{ color: '#f2ca50', fontWeight: 'bold' }}>
                    {username.slice(0, typeCount)}
                    {localFrame >= 40 && localFrame < 120 && <span style={{ animation: 'pulse 0.8s infinite' }}>|</span>}
                  </span>
                </div>
              </div>

              {/* Pulsing bounce CTA Button */}
              <div
                style={{
                  transform: `scale(${buttonBounce})`,
                  backgroundColor: '#f2ca50',
                  color: '#3c2f00',
                  borderRadius: 14,
                  padding: '14px 0',
                  textAlign: 'center',
                  fontWeight: '800',
                  fontSize: 14,
                  fontFamily: 'Montserrat',
                  boxShadow: '0 10px 25px rgba(242, 202, 80, 0.25)',
                }}
              >
                Next: Connect Socials ➔
              </div>
            </div>

            {/* Bottom persistent branding link */}
            <div style={{ opacity: finalFade, position: 'absolute', bottom: 40, fontSize: 13, color: '#d0c5af', fontFamily: 'Inter' }}>
              tembo.page
            </div>

            {/* Final Logo Hold screen */}
            {localFrame >= 330 && (
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000000',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 1 - finalFade,
                }}
              >
                <div style={{ fontSize: 80 }}>🐘</div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
