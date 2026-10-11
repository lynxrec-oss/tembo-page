import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from 'remotion';
import { SlideContainer } from '../components/SlideContainer';
import { PhoneMockup, LinkItem } from '../components/PhoneMockup';
import { CursorPointer } from '../components/CursorPointer';
import { TypoTitle } from '../components/TypoTitle';
import { THEME } from '../theme';

export const HowToBuilder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // TIMELINES
  // Slide 1: 0 - 660 (0s - 22s)
  // Slide 2: 660 - 1320 (22s - 44s)
  // Slide 3: 1320 - 1728 (44s - 57.6s)

  const slide1Opacity = interpolate(frame, [0, 15, 645, 660], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slide2Opacity = interpolate(frame, [650, 665, 1305, 1320], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slide3Opacity = interpolate(frame, [1310, 1325, 1715, 1728], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Slide 1 Animations ---
  const panelSpring = spring({
    frame: frame,
    fps,
    config: { damping: 12, stiffness: 70 },
  });
  const panelY = interpolate(panelSpring, [0, 1], [300, 0]);

  // --- Slide 2 Drag-and-Drop Animations ---
  // Cursor Path coordinate points:
  // Start: X=950, Y=1000 (offscreen/bottom right) at frame 670
  // Land on Tile: X=540, Y=500 at frame 720
  // Click & Drag to: X=540, Y=1250 inside iPhone screen at frame 950
  // Drop & Release: frame 950 to 980
  // Retreat to: X=1100, Y=1250 (fades out) at frame 1100

  const cursorX = interpolate(
    frame,
    [670, 720, 750, 950, 980, 1100],
    [950, 540, 540, 540, 540, 1100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cursorY = interpolate(
    frame,
    [670, 720, 750, 950, 980, 1100],
    [1000, 500, 500, 1250, 1250, 1250],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cursorOpacity = interpolate(
    frame,
    [660, 670, 1080, 1100],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const isClicking = frame >= 730 && frame < 960;

  // Animate the tile scale when hover and clicked
  const tileScaleSpring = spring({
    frame: frame - 730,
    fps,
    config: { damping: 10, stiffness: 100 },
  });
  const draggedTileScale = frame < 730 ? 1 : interpolate(tileScaleSpring, [0, 1], [1, 0.9]);

  // Positional Y transition for the dragged tile from upper area to phone screen
  const draggedTileY = interpolate(
    frame,
    [750, 950],
    [500, 1250],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Dragged Tile visibility state
  const draggedTileOpacity = frame < 680 ? 0 : frame >= 680 && frame < 960 ? 1 : 0;

  // Booking Card appearance in phone preview (bounces in after drop frame 950)
  const phoneDropSpring = spring({
    frame: frame - 950,
    fps,
    config: { damping: 10, stiffness: 110 },
  });
  
  const showBookingInPhone = frame >= 952;
  const bookingScale = interpolate(phoneDropSpring, [0, 1], [0, 1]);
  const bookingHeight = interpolate(phoneDropSpring, [0, 1], [0, 94]);

  const previewLinks: LinkItem[] = [
    { id: '1', title: 'Savanna VFX Showreel', url: '#', type: 'spotify', subtitle: 'Watch latest unmixing reels' },
    { id: '2', title: 'Visit Studio Website', url: '#' },
  ];

  // --- Slide 3 Animations ---
  const zoomSpring = spring({
    frame: frame - 1325,
    fps,
    config: { damping: 12, stiffness: 70 },
  });
  const zoomScale = interpolate(zoomSpring, [0, 1], [0.8, 1.15]);
  const zoomY = interpolate(zoomSpring, [0, 1], [150, -50]);

  return (
    <div style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <Audio src={staticFile('audio/03-page-builder-demo.mp3')} volume={1.0} />
      <Audio src={staticFile('audio/music-cinematic-savannah.mp3')} volume={0.16} loop />

      {/* SLIDE 1: GRID CANVAS INTRO */}
      {frame < 660 && (
        <div style={{ opacity: slide1Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="top">
            <TypoTitle
              title="Drag & Drop Builder"
              subtitle="Design your modular hub with absolute visual freedom. Drag and arrange components instantly."
              startFrame={5}
            />

            {/* Modular grid layout preview */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
                width: '100%',
                transform: `translateY(${panelY}px)`,
              }}
            >
              {/* Simulated Left Panel Card */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 500,
                  backgroundColor: THEME.colors.surfaceContainer,
                  border: '1.5px solid rgba(255,255,255,0.06)',
                  borderRadius: 24,
                  padding: 24,
                  boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ fontSize: 32, padding: 8, backgroundColor: '#2d261e', borderRadius: 12 }}>🎛️</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: 18, color: THEME.colors.onSurface }}>Component Library</div>
                  <div style={{ fontSize: 12, color: THEME.colors.onSurfaceVariant }}>Spotify, Booking, Custom HTML & Text tiles</div>
                </div>
              </div>

              {/* Simulated Center Phone Card */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 500,
                  backgroundColor: THEME.colors.surfaceContainer,
                  border: `1.5px solid ${THEME.colors.primary}`,
                  borderRadius: 24,
                  padding: 24,
                  boxShadow: '0 12px 36px rgba(242, 202, 80, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ fontSize: 32, padding: 8, backgroundColor: '#2d261e', borderRadius: 12 }}>📱</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: 18, color: THEME.colors.primary }}>Real-time Mobile Canvas</div>
                  <div style={{ fontSize: 12, color: THEME.colors.onSurfaceVariant }}>Direct WYSIWYG mobile previews that update as you work</div>
                </div>
              </div>

              {/* Simulated Right Settings Panel */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 500,
                  backgroundColor: THEME.colors.surfaceContainer,
                  border: '1.5px solid rgba(255,255,255,0.06)',
                  borderRadius: 24,
                  padding: 24,
                  boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ fontSize: 32, padding: 8, backgroundColor: '#2d261e', borderRadius: 12 }}>⚙️</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: 18, color: THEME.colors.onSurface }}>Branding Editor</div>
                  <div style={{ fontSize: 12, color: THEME.colors.onSurfaceVariant }}>Tweak fonts, color schemes, and meta telemetry pixels</div>
                </div>
              </div>
            </div>

            <div style={{ height: 20 }} />
          </SlideContainer>
        </div>
      )}

      {/* SLIDE 2: INTERACTIVE DRAG AND DROP */}
      {frame >= 650 && frame < 1322 && (
        <div style={{ opacity: slide2Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="right">
            <TypoTitle
              title="Absolute Alignment"
              subtitle="Arrange components in seconds. Grab library elements and watch them snap onto your screen."
              startFrame={665}
            />

            {/* Drag Area Canvas */}
            <div
              style={{
                flex: 1,
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              {/* UPPER SECTION: The tile to drag */}
              {draggedTileOpacity > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: draggedTileY,
                    transform: `translate(-50%, -50%) scale(${draggedTileScale})`,
                    width: 320,
                    zIndex: 1000,
                    opacity: draggedTileOpacity,
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #2d261e 0%, #1f1a14 100%)',
                      borderRadius: 16,
                      padding: 14,
                      display: 'flex',
                      alignItems: 'center',
                      border: `2px solid ${THEME.colors.primary}`,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(242, 202, 80, 0.3)',
                    }}
                  >
                    <span style={{ fontSize: 18, marginRight: 10 }}>📅</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: '700', color: THEME.colors.primary }}>Booking Calendar</div>
                      <div style={{ fontSize: 10, color: THEME.colors.onSurfaceVariant }}>Drag into place</div>
                    </div>
                    <div style={{ fontSize: 16, color: THEME.colors.primary }}>⠿</div>
                  </div>
                </div>
              )}

              {/* Lower Section: The iPhone screen receiver */}
              <div style={{ position: 'absolute', top: 380 }}>
                <PhoneMockup
                  displayName="Savanna VFX Studio"
                  bioText="პროგრამული ვიდეო მონტაჟი • Smart Bio Link"
                  links={previewLinks}
                  renderExtra={
                    showBookingInPhone ? (
                      <div
                        style={{
                          width: '100%',
                          transform: `scale(${bookingScale})`,
                          height: bookingHeight,
                          background: 'linear-gradient(135deg, #2d261e 0%, #1f1a14 100%)',
                          borderRadius: 16,
                          padding: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          border: `2px solid ${THEME.colors.primary}`,
                          boxShadow: '0 0 15px rgba(242, 202, 80, 0.25)',
                          marginTop: 12,
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 14, marginRight: 6 }}>📅</span>
                          <div style={{ fontSize: 12, fontWeight: '700', color: THEME.colors.primary }}>
                            Booking Calendar
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: THEME.colors.onSurfaceVariant, marginBottom: 6 }}>
                          Book a 1-on-1 session
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
                          Select a Time
                        </div>
                      </div>
                    ) : null
                  }
                />
              </div>

              {/* Cursor Pointer overlay */}
              <CursorPointer
                x={cursorX}
                y={cursorY}
                clicking={isClicking}
                opacity={cursorOpacity}
              />
            </div>

            <div style={{ height: 20 }} />
          </SlideContainer>
        </div>
      )}

      {/* SLIDE 3: CUSTOMIZATION OUTRO */}
      {frame >= 1310 && (
        <div style={{ opacity: slide3Opacity, width: '100%', height: '100%', position: 'absolute' }}>
          <SlideContainer glowPosition="center">
            <TypoTitle
              title="Tailor Your Bio"
              subtitle="Unlock full design authority. Create highly conversion-focused, elegant link profiles with zero friction."
              startFrame={1325}
            />

            {/* Zoomed Phone Preview Showcase */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${zoomScale}) translateY(${zoomY}px)`,
                width: '100%',
              }}
            >
              <PhoneMockup
                displayName="Savanna VFX Studio"
                bioText="პროგრამული ვიდეო მონტაჟი • Smart Bio Link"
                links={[
                  { id: '1', title: 'Savanna VFX Showreel', url: '#', type: 'spotify', subtitle: 'Watch latest unmixing reels' },
                  { id: '2', title: 'Booking Calendar', url: '#', type: 'booking' },
                  { id: '3', title: 'Visit Studio Website', url: '#' },
                ]}
              />
            </div>

            <div style={{ height: 20 }} />
          </SlideContainer>
        </div>
      )}
    </div>
  );
};
