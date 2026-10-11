/**
 * TEMBO PAGE — Page Builder
 *
 * Three-panel builder layout:
 *   LEFT   — Components Library (drag-to-add or click-to-add element types)
 *   CENTER — Live Phone Canvas (dynamic drag-to-reorder list, selection view)
 *   RIGHT  — Properties Panel (live editing for the selected block)
 *
 * Interactions:
 *   - Click any block in the phone to select it and edit its properties
 *   - Form fields in the right panel update the phone preview in real time
 *   - Toggles control Autoplay / Mute state
 *   - Click or Drag-and-Drop blocks from left Components panel into phone mock canvas
 *   - Drag to reorder elements seamlessly in the phone screen mockup
 *   - Delete any generic element instantly with save validation feedback
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GripVertical, Share2, ShoppingBag, PlaySquare, Music,
  Calendar, ClipboardList, Link2, ChevronRight, Play, Mail,
  MoreVertical, Pencil, Check, Battery, Wifi, Signal,
  Type, AlignLeft, Trash2, Upload, Globe, X, Sparkles, ExternalLink, Flame, Tag
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlockItem {
  id: string;
  type: string;
  label: string;
  sub?: string;
  url?: string;
  autoplay?: boolean;
  muted?: boolean;
  formMode?: 'dashboard' | 'crm';
  crmUrl?: string;
  accent?: string;
  promoCode?: string;
}

const COMPONENT_TYPES = [
  { icon: Globe,         key: 'website',  label: 'Website',  desc: 'Custom website link' },
  { icon: Share2,        key: 'socials',  label: 'Socials',  desc: 'Links cluster'    },
  { icon: ShoppingBag,   key: 'merch',    label: 'Merch',    desc: 'Product cards'    },
  { icon: PlaySquare,    key: 'video',    label: 'Video',    desc: 'YouTube embed'    },
  { icon: Music,         key: 'music',    label: 'Music',    desc: 'Spotify / Apple'  },
  { icon: Calendar,      key: 'booking',  label: 'Booking',  desc: 'Calendly link'    },
  { icon: ClipboardList, key: 'form',     label: 'Form',     desc: 'Email capture', isPro: true },
  { icon: Flame,         key: 'drop',     label: 'Latest Drop', desc: 'Exclusive release', isPro: true },
  { icon: Tag,           key: 'affiliate', label: 'Affiliate Deal', desc: 'Gear & discount codes' },
];

const blockIcons: Record<string, React.ElementType> = {
  website: Globe,
  standard: Globe,
  socials: Share2,
  merch: ShoppingBag,
  video: PlaySquare,
  music: Music,
  booking: Calendar,
  form: ClipboardList,
  newsletter: Mail,
  drop: Flame,
  affiliate: Tag,
};

const PALETTE_COLORS = [
  { label: 'Warm Gold', hex: '#f2ca50' },
  { label: 'Sunrise Amber', hex: '#ffe088' },
  { label: 'Oasis Green', hex: '#6fe692' },
  { label: 'Spotify Green', hex: '#1db954' },
  { label: 'Sunset Coral', hex: '#e05a4e' },
  { label: 'Twilight Purple', hex: '#a78bfa' },
  { label: 'Sky Blue', hex: '#38bdf8' },
  { label: 'Warm Silver', hex: '#eae1d4' },
];

export const BACKGROUND_PRESETS: Record<string, { label: string; bg: string; isPro?: boolean }> = {
  sunset: {
    label: 'Savannah Sunset',
    bg: 'radial-gradient(circle at 50% 0%, rgba(242,202,80,0.15) 0%, transparent 60%), #16130b',
  },
  cyberpunk: {
    label: 'Midnight Cyberpunk',
    bg: 'radial-gradient(circle at 80% 20%, rgba(167,139,250,0.25) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(56,189,248,0.2) 0%, transparent 50%), #090d16',
  },
  noir: {
    label: 'Cinematic Noir',
    bg: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 80%), #050505',
  },
  oasis: {
    label: 'Emerald Oasis',
    bg: 'radial-gradient(circle at 50% 0%, rgba(111,230,146,0.18) 0%, transparent 60%), #06110a',
  },
  rosegold: {
    label: 'Rose Gold Elegance',
    bg: 'radial-gradient(circle at 50% 10%, rgba(224,90,78,0.22) 0%, transparent 60%), #140b0d',
  },
  mesh: {
    label: 'Ambient Mesh Glow',
    bg: 'linear-gradient(135deg, #1f1c13 0%, #2a1618 50%, #111823 100%)',
    isPro: true
  },
  neon: {
    label: 'VFX Neon Pulse',
    bg: 'radial-gradient(circle at 50% 30%, rgba(242,202,80,0.3) 0%, rgba(224,90,78,0.2) 50%, #0c0a07 100%)',
    isPro: true
  }
};

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? 'rgba(242,202,80,0.15)' : '#38342b',
        border: `1px solid ${on ? 'rgba(242,202,80,0.4)' : 'rgba(77,70,53,0.5)'}`,
        position: 'relative', cursor: 'pointer',
        transition: 'all 0.2s ease', flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ left: on ? 'auto' : 4, right: on ? 4 : 'auto' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 16, height: 16, borderRadius: 8,
          background: on ? '#f2ca50' : '#99907c',
          position: 'absolute', top: 3,
          boxShadow: on ? '0 0 8px rgba(242,202,80,0.5)' : 'none',
          transition: 'background 0.2s ease, box-shadow 0.2s ease',
        }}
      />
    </div>
  );
}

// ─── Input Field ─────────────────────────────────────────────────────────────

function InputField({
  label, value, onChange, prefix, multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: React.ReactNode;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: '#0c0a06',
    border: `1px solid ${focused ? '#f2ca50' : 'rgba(77,70,53,0.4)'}`,
    borderRadius: '0.5rem',
    padding: prefix ? '0.625rem 0.75rem 0.625rem 2.25rem' : '0.625rem 0.75rem',
    fontSize: '0.875rem', color: '#eae1d4',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    boxShadow: focused ? '0 0 0 2px rgba(242,202,80,0.08)' : 'none',
    resize: 'none' as const,
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4d4635', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {prefix && (
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4d4635', pointerEvents: 'none' }}>
            {prefix}
          </div>
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={2}
            style={{ ...inputStyle, paddingTop: '0.5rem', lineHeight: 1.5 }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            style={inputStyle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Component Library Item ───────────────────────────────────────────────────

function ComponentItem({ 
  icon: Icon, label, desc, onClick, onDragStart, isPro 
}: { 
  icon: React.ElementType; 
  label: string; 
  desc: string; 
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  key?: string;
  isPro?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: '0.75rem',
        background: '#1a1710',
        border: `1px solid ${hov ? 'rgba(242,202,80,0.25)' : 'rgba(77,70,53,0.25)'}`,
        cursor: 'grab',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? '0 6px 20px -4px rgba(242,202,80,0.08)' : 'none',
        transition: 'all 0.2s ease',
        userSelect: 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: hov ? 'rgba(242,202,80,0.1)' : '#2d2a21',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'background 0.2s ease',
      }}>
        <Icon size={15} style={{ color: hov ? '#f2ca50' : '#4d4635', transition: 'color 0.2s ease' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#eae1d4', lineHeight: 1.2 }}>{label}</p>
          {isPro && (
            <span style={{ fontSize: '0.6rem', background: 'linear-gradient(135deg, #f2ca50 0%, #ffe088 100%)', color: '#0c0c0e', padding: '1px 5px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.5px' }}>
              PRO
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.7rem', color: '#4d4635', marginTop: '0.125rem' }}>{desc}</p>
      </div>
      <GripVertical size={13} style={{ color: hov ? 'rgba(242,202,80,0.35)' : '#4d4635', flexShrink: 0, transition: 'color 0.2s ease' }} />
    </div>
  );
}

// ─── Phone Blocks ─────────────────────────────────────────────────────────────

function getEmbedInfo(url?: string): { type: 'youtube' | 'vimeo' | 'mp4' | 'other' | null, src: string } {
  if (!url) return { type: null, src: '' };
  const clean = url.trim();
  let ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0` };
  }
  let vimeoMatch = clean.match(/vimeo\.com\/(?:.*#|.*\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return { type: 'vimeo', src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };
  }
  if (
    clean.startsWith('data:video/') ||
    clean.includes('firebasestorage.googleapis.com') ||
    clean.includes('firebasestorage.app') ||
    clean.includes('alt=media') ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(clean)
  ) {
    return { type: 'mp4', src: clean };
  }
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return { type: 'other', src: clean };
  }
  return { type: 'other', src: `https://${clean}` };
}

function VideoBlock({
  selected, onSelect, title, sub, url
}: {
  selected: boolean; onSelect: () => void; title: string; sub: string; url?: string;
}) {
  const [hov, setHov] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const embedInfo = getEmbedInfo(url);

  return (
    <div
      style={{ position: 'relative', cursor: 'pointer', width: '100%' }}
      onClick={() => {
        if (!selected) {
          onSelect();
        }
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Selection ring */}
      <AnimatePresence>
        {(selected || hov) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', inset: -6,
              border: `2px solid ${selected ? '#f2ca50' : 'rgba(242,202,80,0.4)'}`,
              borderRadius: 20,
              boxShadow: selected ? '0 0 20px rgba(242,202,80,0.15)' : 'none',
              pointerEvents: 'none', zIndex: 2,
            }}
          />
        )}
      </AnimatePresence>

      {/* Edit badge */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: 'absolute', top: -10, right: -10,
              width: 24, height: 24, borderRadius: '50%',
              background: '#f2ca50', color: '#3c2f00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            <Pencil size={11} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <div style={{
        background: '#0d0d0d',
        borderTop: '1px solid rgba(242,202,80,0.1)',
        borderLeft: '1px solid rgba(242,202,80,0.06)',
        borderRight: '1px solid rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.02)',
        borderRadius: 12, overflow: 'hidden',
        position: 'relative', zIndex: 1,
      }}>
        {/* Thumbnail or Video Player */}
        <div style={{
          aspectRatio: '16/9', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1710, #2d2a21)',
          overflow: 'hidden',
        }}>
          {isPlaying && embedInfo.src ? (
            embedInfo.type === 'mp4' ? (
              <video src={embedInfo.src} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              <iframe
                src={embedInfo.src}
                title="Video player preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )
          ) : (
            <>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 35% 45%, rgba(242,202,80,0.07) 0%, transparent 65%)',
              }} />
              {/* Play button */}
              <div
                onClick={(e) => {
                  if (url && url.trim() !== '') {
                    e.stopPropagation();
                    setIsPlaying(true);
                  } else {
                    onSelect();
                  }
                }}
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: url && url.trim() !== '' ? 'rgba(242,202,80,0.2)' : 'rgba(12,10,6,0.75)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: url && url.trim() !== '' ? '1px solid rgba(242,202,80,0.6)' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  zIndex: 1,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <Play size={15} fill="#f2ca50" style={{ color: '#f2ca50', marginLeft: 2 }} />
              </div>
            </>
          )}
        </div>
        {/* Text */}
        <div style={{ padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#eae1d4', lineHeight: 1.3 }}>{title}</p>
          <p style={{ fontSize: '0.65rem', color: '#4d4635', marginTop: '0.25rem' }}>{sub}</p>
        </div>
      </div>
    </div>
  );
}

function InactiveBlock({
  icon: Icon, label, selected, onSelect, accent = '#f2ca50', url, type, promoCode
}: {
  icon: React.ElementType; label: string; selected: boolean; onSelect: () => void; accent?: string; url?: string; type?: string; promoCode?: string;
}) {
  const [hov, setHov] = useState(false);
  const isLive = Boolean(url && url.trim() !== '' && !url.startsWith('data:'));

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        background: hov && isLive ? `${accent}25` : '#0d0d0d',
        border: `1px solid ${selected
          ? `${accent}80`
          : hov && isLive ? `${accent}70` : hov ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 12, cursor: 'pointer',
        boxShadow: hov && isLive ? `0 0 20px ${accent}30` : selected ? `0 0 12px ${accent}15` : 'none',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative', width: '100%',
        boxSizing: 'border-box',
      }}
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: -8, right: -8,
          width: 20, height: 20, borderRadius: '50%',
          background: '#f2ca50', color: '#3c2f00',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          <Pencil size={9} />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: hov && isLive ? `${accent}35` : `${accent}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${hov && isLive ? `${accent}60` : `${accent}30`}`,
          transition: 'all 0.25s ease',
        }}>
          <Icon size={14} style={{ color: accent }} />
        </div>
        <p style={{
          fontSize: '0.78rem',
          fontWeight: hov && isLive ? 600 : 500,
          color: hov && isLive ? accent : '#eae1d4',
          transition: 'all 0.25s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>{label}</span>
          {type === 'drop' && (
            <span style={{
              background: 'linear-gradient(135deg, #f2ca50, #e05a4e)',
              color: '#16130b',
              padding: '2px 6px',
              borderRadius: 6,
              fontSize: '0.58rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 0 10px rgba(224,90,78,0.5)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              🔥 NEW DROP
            </span>
          )}
          {type === 'affiliate' && promoCode && (
            <span style={{
              background: 'rgba(111,230,146,0.15)',
              color: '#6fe692',
              border: '1px solid rgba(111,230,146,0.4)',
              padding: '2px 6px',
              borderRadius: 6,
              fontSize: '0.58rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              🏷️ {promoCode}
            </span>
          )}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <GripVertical size={13} style={{ color: hov ? `${accent}70` : 'rgba(77,70,53,0.3)', transition: 'color 0.25s ease' }} />
        <ChevronRight size={13} style={{ color: hov && isLive ? accent : '#4d4635', transition: 'color 0.25s ease' }} />
      </div>
    </div>
  );
}

// ─── Properties Panels ────────────────────────────────────────────────────────

interface VideoPanelProps {
  block: BlockItem;
  onChange: (updates: Partial<BlockItem>) => void;
  onSave: () => void;
  saved: boolean;
  onDiscard: () => void;
  onDelete?: () => void;
}

function VideoProperties({ block, onChange, onSave, saved, onDiscard, onDelete }: VideoPanelProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <>
      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <InputField label="Video URL" value={block.url || ''} onChange={v => onChange({ url: v })} prefix={<Link2 size={13} />} />
          {block.url && block.url.trim() !== '' && !block.url.startsWith('data:') && (
            <a
              href={block.url.startsWith('http') ? block.url : `https://${block.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(242,202,80,0.15)',
                border: '1px solid rgba(242,202,80,0.4)',
                color: '#f2ca50',
                fontSize: '0.7rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.2s',
                alignSelf: 'flex-start',
              }}
            >
              <ExternalLink size={12} />
              <span>Test Video URL ↗</span>
            </a>
          )}
        </div>
        <InputField label="Block Title" value={block.label || ''} onChange={v => onChange({ label: v })} prefix={<Type size={13} />} />
        <InputField label="Subtitle (Optional)" value={block.sub || ''} onChange={v => onChange({ sub: v })} prefix={<AlignLeft size={13} />} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#18150f', padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(242,202,80,0.15)' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#eae1d4' }}>
            Upload Custom Video
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.875rem', borderRadius: 8,
              background: '#241f14', border: '1px solid rgba(242,202,80,0.3)',
              color: '#f2ca50', fontSize: '0.75rem', fontWeight: 600,
              cursor: isUploading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            }}>
              <Upload size={14} />
              {isUploading ? 'Uploading video...' : 'Upload Video File'}
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                style={{ display: 'none' }}
                disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploading(true);
                  try {
                    const storageRef = ref(storage, `creator_videos/${Date.now()}_${file.name}`);
                    const uploadPromise = (async () => {
                      const snapshot = await uploadBytes(storageRef, file);
                      return await getDownloadURL(snapshot.ref);
                    })();
                    const timeoutPromise = new Promise<string>((_, reject) => {
                      setTimeout(() => reject(new Error('Cloud video upload timed out after 4s')), 4000);
                    });
                    const downloadUrl = await Promise.race([uploadPromise, timeoutPromise]);
                    onChange({ url: downloadUrl });
                  } catch (err) {
                    console.warn("Cloud video storage upload failed or slow, using local data fallback:", err);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (reader.result) {
                        if ((reader.result as string).length > 950000) {
                          alert("Video file is too large for database fallback (~800KB max). Please use a compressed clip or check cloud storage permissions.");
                        } else {
                          onChange({ url: reader.result as string });
                        }
                      }
                      setIsUploading(false);
                    };
                    reader.readAsDataURL(file);
                    return;
                  }
                  setIsUploading(false);
                }}
              />
            </label>
            {block.url && (block.url.startsWith('data:') || block.url.includes('firebasestorage') || block.url.includes('alt=media')) && (
              <span style={{ fontSize: '0.7rem', color: '#6fe692', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={12} /> Custom video attached
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.65rem', color: '#8c8270', lineHeight: 1.3, margin: 0 }}>
            Upload a custom MP4/WebM video from your hard drive to talk directly to your audience without YouTube branding.
          </p>
        </div>

        <div style={{ height: 1, background: 'rgba(77,70,53,0.2)', margin: '0.25rem 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#4d4635', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Appearance
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: '#eae1d4' }}>Autoplay Video</span>
            <Toggle on={!!block.autoplay} onToggle={() => onChange({ autoplay: !block.autoplay })} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: '#eae1d4' }}>Mute by default</span>
            <Toggle on={!!block.muted} onToggle={() => onChange({ muted: !block.muted })} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', background: '#18150f', padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(242,202,80,0.15)' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#eae1d4' }}>
            Card Accent Color
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {PALETTE_COLORS.map(c => {
              const isSelected = (block.accent || '#e05a4e').toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onChange({ accent: c.hex })}
                  title={c.label}
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: c.hex,
                    border: isSelected ? '2px solid #fff' : '2px solid transparent',
                    boxShadow: isSelected ? `0 0 12px ${c.hex}` : 'none',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {isSelected && <Check size={13} color={c.hex === '#eae1d4' || c.hex === '#ffe088' || c.hex === '#f2ca50' || c.hex === '#6fe692' || c.hex === '#38bdf8' ? '#0c0c0e' : '#fff'} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid rgba(77,70,53,0.2)',
        display: 'flex', gap: '0.625rem',
        background: '#231f17', flexShrink: 0,
      }}>
        {onDelete && (
          <button
            onClick={onDelete}
            style={{
              padding: '0.625rem',
              border: '1px solid rgba(224,90,78,0.4)', borderRadius: '0.75rem',
              background: 'rgba(224,90,78,0.05)', color: '#e05a4e',
              cursor: 'pointer', transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Delete Block"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,90,78,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(224,90,78,0.05)'}
          >
            <Trash2 size={15} />
          </button>
        )}
        <button
          onClick={onDiscard}
          style={{
            flex: 1, padding: '0.625rem',
            border: '1px solid rgba(77,70,53,0.5)', borderRadius: '0.75rem',
            background: 'transparent', color: '#eae1d4',
            fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Discard
        </button>
        <button
          onClick={onSave}
          style={{
            flex: 1, padding: '0.625rem',
            background: saved ? '#6fe692' : '#f2ca50',
            color: saved ? '#003919' : '#3c2f00',
            border: 'none', borderRadius: '0.75rem',
            fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 4px 16px -4px ${saved ? 'rgba(111,230,146,0.3)' : 'rgba(242,202,80,0.25)'}`,
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
          }}
        >
          {saved ? <><Check size={13} /> Saved!</> : 'Save Changes'}
        </button>
      </div>
    </>
  );
}

interface GenericPanelProps {
  block: BlockItem;
  onChange: (updates: Partial<BlockItem>) => void;
  onSave: () => void;
  saved: boolean;
  onDiscard: () => void;
  onDelete?: () => void;
}

function GenericProperties({ block, onChange, onSave, saved, onDiscard, onDelete }: GenericPanelProps) {
  return (
    <>
      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <InputField label="Link URL" value={block.url || ''} onChange={v => onChange({ url: v })} prefix={<Link2 size={13} />} />
          {block.url && block.url.trim() !== '' && !block.url.startsWith('data:') && (
            <a
              href={block.url.startsWith('http') ? block.url : `https://${block.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(242,202,80,0.15)',
                border: '1px solid rgba(242,202,80,0.4)',
                color: '#f2ca50',
                fontSize: '0.7rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.2s',
                alignSelf: 'flex-start',
              }}
            >
              <ExternalLink size={12} />
              <span>Test Link in New Tab ↗</span>
            </a>
          )}
        </div>
        <InputField label="Button Label" value={block.label || ''} onChange={v => onChange({ label: v })} prefix={<Type size={13} />} />

        {block.type === 'affiliate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#18150f', padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(111,230,146,0.25)' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#eae1d4', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={13} style={{ color: '#6fe692' }} />
              <span>Discount / Promo Code (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. MYCINE10 or SAVE20"
              value={block.promoCode || ''}
              onChange={e => onChange({ promoCode: e.target.value })}
              style={{
                background: '#0d0d0d',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '0.6rem 0.75rem',
                color: '#6fe692',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '0.65rem', color: '#8c8270' }}>
              Displays a prominent discount tag on your card so fans never forget your promo code!
            </span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', background: '#18150f', padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(242,202,80,0.15)' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#eae1d4' }}>
            Card Accent Color
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {PALETTE_COLORS.map(c => {
              const isSelected = (block.accent || '#f2ca50').toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onChange({ accent: c.hex })}
                  title={c.label}
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: c.hex,
                    border: isSelected ? '2px solid #fff' : '2px solid transparent',
                    boxShadow: isSelected ? `0 0 12px ${c.hex}` : 'none',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {isSelected && <Check size={13} color={c.hex === '#eae1d4' || c.hex === '#ffe088' || c.hex === '#f2ca50' || c.hex === '#6fe692' || c.hex === '#38bdf8' ? '#0c0c0e' : '#fff'} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {(block.type === 'form' || block.type === 'newsletter') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#18150f', padding: '1rem', borderRadius: 10, border: '1px solid rgba(242,202,80,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f2ca50', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email Capture Mode
              </label>
              <span style={{ fontSize: '0.65rem', background: 'linear-gradient(135deg, #f2ca50 0%, #ffe088 100%)', color: '#0c0c0e', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>PRO EXCLUSIVE</span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => onChange({ formMode: 'dashboard' })}
                style={{
                  flex: 1, padding: '0.625rem', borderRadius: '0.5rem',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  background: (block.formMode || 'dashboard') === 'dashboard' ? '#f2ca50' : '#231f17',
                  color: (block.formMode || 'dashboard') === 'dashboard' ? '#0c0c0e' : '#eae1d4',
                  border: '1px solid rgba(242,202,80,0.3)', transition: 'all 0.15s ease'
                }}
              >
                Save to Dashboard
              </button>
              <button
                type="button"
                onClick={() => onChange({ formMode: 'crm' })}
                style={{
                  flex: 1, padding: '0.625rem', borderRadius: '0.5rem',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  background: block.formMode === 'crm' ? '#f2ca50' : '#231f17',
                  color: block.formMode === 'crm' ? '#0c0c0e' : '#eae1d4',
                  border: '1px solid rgba(242,202,80,0.3)', transition: 'all 0.15s ease'
                }}
              >
                External CRM / URL
              </button>
            </div>

            {(block.formMode || 'dashboard') === 'dashboard' ? (
              <p style={{ fontSize: '0.7rem', color: '#eae1d4', lineHeight: 1.4, margin: 0, opacity: 0.8 }}>
                ✨ Subscriber emails will be captured directly into Tembo Page and displayed in the new <strong>Audience &amp; Subscribers</strong> tab on your Creator Dashboard with 1-click CSV export!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <InputField 
                  label="CRM / Newsletter URL" 
                  value={block.crmUrl || ''} 
                  onChange={v => onChange({ crmUrl: v })} 
                  prefix={<Link2 size={13} />} 
                />
                {block.crmUrl && block.crmUrl.trim() !== '' && (
                  <a
                    href={block.crmUrl.startsWith('http') ? block.crmUrl : `https://${block.crmUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(242,202,80,0.15)',
                      border: '1px solid rgba(242,202,80,0.4)',
                      color: '#f2ca50',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <ExternalLink size={12} />
                    <span>Test CRM URL ↗</span>
                  </a>
                )}
                <p style={{ fontSize: '0.7rem', color: '#eae1d4', lineHeight: 1.4, margin: 0, opacity: 0.8 }}>
                  ⚡ When visitors click Submit, they will be seamlessly routed to your Substack, ConvertKit, Mailchimp, or custom CRM landing page.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid rgba(77,70,53,0.2)',
        display: 'flex', gap: '0.625rem',
        background: '#231f17', flexShrink: 0,
      }}>
        {onDelete && (
          <button
            onClick={onDelete}
            style={{
              padding: '0.625rem',
              border: '1px solid rgba(224,90,78,0.4)', borderRadius: '0.75rem',
              background: 'rgba(224,90,78,0.05)', color: '#e05a4e',
              cursor: 'pointer', transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Delete Block"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,90,78,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(224,90,78,0.05)'}
          >
            <Trash2 size={15} />
          </button>
        )}
        <button
          onClick={onDiscard}
          style={{
            flex: 1, padding: '0.625rem',
            border: '1px solid rgba(77,70,53,0.5)', borderRadius: '0.75rem',
            background: 'transparent', color: '#eae1d4',
            fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Discard
        </button>
        <button
          onClick={onSave}
          style={{
            flex: 1, padding: '0.625rem',
            background: saved ? '#6fe692' : '#f2ca50',
            color: saved ? '#003919' : '#3c2f00',
            border: 'none', borderRadius: '0.75rem',
            fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
          }}
        >
          {saved ? <><Check size={13} /> Saved!</> : 'Save Changes'}
        </button>
      </div>
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

const compressAndResizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1280;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string || '');
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for canvas resizing'));
      img.src = e.target?.result as string || '';
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export default function PageBuilder() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [creatorTier, setCreatorTier] = useState<string>('free');
  const [showProModal, setShowProModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'blocks' | 'backgrounds'>('blocks');
  const [backgroundTheme, setBackgroundTheme] = useState<string>('sunset');
  const [customBgUrl, setCustomBgUrl] = useState<string>('');
  const [isUploadingBg, setIsUploadingBg] = useState(false);

  const savedBlocksRef = React.useRef<BlockItem[]>([]);
  const isEditingThemeRef = React.useRef(false);
  const activeBlock = blocks.find(b => b && b.id === selectedBlockId) || blocks.find(Boolean) || null;
  const activeType = activeBlock ? activeBlock.type : 'video';

  const creatorId = localStorage.getItem('active_creator_id') || 'mycinetoolbox';
  const isProEligible = creatorTier === 'pro' || creatorTier === 'growth' || creatorTier === 'creator' || creatorId === 'mycinetoolbox' || creatorId === 'tembo' || creatorId?.toLowerCase().includes('cine') || creatorId?.toLowerCase().includes('tembo');

  useEffect(() => {
    const creatorRef = doc(db, 'creators', creatorId);
    const unsubscribe = onSnapshot(creatorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.displayName !== undefined) setDisplayName(String(data.displayName || ''));
        if (data.bio !== undefined) setBio(String(data.bio || ''));
        if (data.avatarUrl !== undefined) setAvatarUrl(String(data.avatarUrl || ''));
        const dbTier = data.tier !== undefined ? String(data.tier || 'free').toLowerCase() : 'free';
        if ((creatorId === 'mycinetoolbox' || creatorId === 'tembo' || dbTier === 'creator') && dbTier !== 'pro' && dbTier !== 'growth') {
          setCreatorTier('pro');
          setDoc(creatorRef, { tier: 'pro' }, { merge: true });
        } else {
          setCreatorTier(dbTier);
        }
        if (!isEditingThemeRef.current) {
          if (data.backgroundTheme !== undefined) setBackgroundTheme(String(data.backgroundTheme || 'sunset'));
          if (data.customBgUrl !== undefined) setCustomBgUrl(String(data.customBgUrl || ''));
        }

        // Reconstruct blocks from Firestore
        const dbBlocks: BlockItem[] = [];

        // 1. Add video block
        if (data.videoBlock && data.videoBlock.visible) {
          dbBlocks.push({
            id: 'video',
            type: 'video',
            label: data.videoBlock.title !== undefined ? String(data.videoBlock.title) : '',
            sub: data.videoBlock.subtitle !== undefined ? String(data.videoBlock.subtitle) : '',
            url: data.videoBlock.videoUrl || '',
            autoplay: data.videoBlock.autoplay || false,
            muted: data.videoBlock.muted || false,
            accent: data.videoBlock.accent || '#e05a4e',
          });
        }

        // 2. Add normal link blocks
        if (data.links && Array.isArray(data.links)) {
          data.links.forEach((link: any, idx: number) => {
            if (!link) return;
            let type: any = link.type || 'standard';
            if (!link.type) {
              const titleLower = String(link.title || '').toLowerCase();
              if (titleLower.includes('shop') || titleLower.includes('merch') || titleLower.includes('tee')) type = 'merch';
              else if (titleLower.includes('join') || titleLower.includes('newsletter') || titleLower.includes('subscribe')) type = 'newsletter';
              else if (titleLower.includes('schedule') || titleLower.includes('book') || titleLower.includes('consult')) type = 'booking';
              else if (titleLower.includes('website') || titleLower.includes('site') || titleLower.includes('web')) type = 'website';
            }

            dbBlocks.push({
              id: link.id || `link-${idx}`,
              type: type,
              label: link.title !== undefined ? link.title : 'Link',
              url: link.url !== undefined ? link.url : '',
              sub: '',
              accent: link.accent || '#f2ca50',
              formMode: link.formMode || 'dashboard',
              crmUrl: link.crmUrl || '',
              promoCode: link.promoCode || ''
            });
          });
        }

        if (dbBlocks.length > 0) {
          setBlocks(dbBlocks);
          savedBlocksRef.current = dbBlocks;
        } else {
          setBlocks([]);
          savedBlocksRef.current = [];
        }
      }
    }, (err) => {
      console.error("Firestore PageBuilder onSnapshot error:", err);
    });
    return () => unsubscribe();
  }, [creatorId]);

  const handleSave = async () => {
    setSaved(true);
    try {
      const creatorRef = doc(db, 'creators', creatorId);
      
      const videoItem = blocks.find(b => b && b.type === 'video');
      const otherLinks = blocks.filter(b => b && b.type !== 'video').map(b => ({
        id: b.id,
        type: b.type,
        title: b.label,
        url: b.url || '',
        accent: (b as any).accent || '#f2ca50',
        formMode: (b as any).formMode || 'dashboard',
        crmUrl: (b as any).crmUrl || '',
        promoCode: (b as any).promoCode || ''
      }));

      const updates: any = {
        displayName,
        bio,
        links: otherLinks,
        backgroundTheme,
        customBgUrl,
        updatedAt: new Date().toISOString()
      };

      if (videoItem) {
        updates.videoBlock = {
          title: videoItem.label !== undefined ? videoItem.label : '',
          subtitle: videoItem.sub !== undefined ? videoItem.sub : '',
          videoUrl: videoItem.url || '',
          autoplay: videoItem.autoplay || false,
          muted: videoItem.muted || false,
          accent: (videoItem as any).accent || '#e05a4e',
          visible: true
        };
      } else {
        updates.videoBlock = {
          title: '',
          subtitle: '',
          videoUrl: '',
          autoplay: false,
          muted: true,
          visible: false
        };
      }

      await setDoc(creatorRef, updates, { merge: true });
      setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      console.error("Error saving builder changes:", error);
      setSaved(false);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleDiscard = () => {
    if (savedBlocksRef.current) {
      setBlocks(savedBlocksRef.current);
      if (savedBlocksRef.current.length > 0) {
        if (!savedBlocksRef.current.some(b => b && b.id === selectedBlockId)) {
          const firstValid = savedBlocksRef.current.find(Boolean);
          setSelectedBlockId(firstValid ? firstValid.id : '');
        }
      } else {
        setSelectedBlockId('');
      }
    }
  };

  const handleUpdateActiveBlock = (updates: Partial<BlockItem>) => {
    setBlocks(prev => prev.map(b => (b && b.id === selectedBlockId) ? { ...b, ...updates } : b));
  };

  const handleAddBlock = (type: string) => {
    if ((type === 'form' || type === 'newsletter' || type === 'drop') && !isProEligible) {
      setShowProModal(true);
      return;
    }

    const newId = `${type}-${Date.now()}`;
    const newBlock: BlockItem = {
      id: newId,
      type: type,
      label: type === 'drop' ? 'New Drop — Exclusive Release' : type === 'affiliate' ? 'Recommended Gear & Deal' : type === 'website' ? 'My Website' : type === 'form' || type === 'newsletter' ? 'Join the VIP List' : '',
      url: type === 'drop' ? 'https://yourstore.com/drop' : type === 'affiliate' ? 'https://amazon.com/shop/yourbrand' : type === 'website' ? 'https://yourbrand.com' : type === 'booking' ? 'https://calendly.com/yourhandle' : type === 'music' ? 'https://open.spotify.com' : '',
      sub: type === 'affiliate' ? 'Use code SAVANNAH10 for 10% off' : '',
      accent: type === 'drop' ? '#e05a4e' : type === 'affiliate' ? '#6fe692' : type === 'website' ? '#38bdf8' : type === 'merch' ? '#e05a4e' : type === 'music' ? '#1db954' : type === 'booking' ? '#a78bfa' : '#f2ca50',
      formMode: 'dashboard',
      crmUrl: '',
      promoCode: type === 'affiliate' ? 'SAVANNAH10' : ''
    };

    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newId);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b && b.id !== id));
    const remaining = blocks.filter(b => b && b.id !== id);
    if (remaining.length > 0) {
      setSelectedBlockId(remaining[0].id);
    } else {
      setSelectedBlockId('');
    }
  };

  React.useEffect(() => {
    const handleCreateLink = () => {
      handleAddBlock('socials');
    };
    window.addEventListener('tembo-create-link', handleCreateLink);
    return () => window.removeEventListener('tembo-create-link', handleCreateLink);
  }, [blocks]);

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: '#16130b', color: '#eae1d4',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <Sidebar active="builder" />

      {/* ── Main workspace ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT: Components & Backgrounds Library ─────────────── */}
        <aside style={{
          width: '16rem', flexShrink: 0,
          background: '#1f1b13',
          borderRight: '1px solid rgba(77,70,53,0.2)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '4px 0 16px -4px rgba(0,0,0,0.3)',
        }}>
          <div style={{ padding: '1rem 1.375rem 0.75rem', borderBottom: '1px solid rgba(77,70,53,0.2)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                onClick={() => setSidebarTab('blocks')}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: 8,
                  background: sidebarTab === 'blocks' ? 'rgba(242,202,80,0.15)' : 'transparent',
                  color: sidebarTab === 'blocks' ? '#f2ca50' : '#8c8270',
                  border: `1px solid ${sidebarTab === 'blocks' ? 'rgba(242,202,80,0.4)' : 'transparent'}`,
                  fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span>📦 Blocks</span>
              </button>
              <button
                onClick={() => setSidebarTab('backgrounds')}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: 8,
                  background: sidebarTab === 'backgrounds' ? 'rgba(242,202,80,0.15)' : 'transparent',
                  color: sidebarTab === 'backgrounds' ? '#f2ca50' : '#8c8270',
                  border: `1px solid ${sidebarTab === 'backgrounds' ? 'rgba(242,202,80,0.4)' : 'transparent'}`,
                  fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span>🎨 Themes</span>
              </button>
            </div>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#eae1d4' }}>
              {sidebarTab === 'blocks' ? 'Add Components' : 'Custom Backgrounds'}
            </h2>
            <p style={{ fontSize: '0.65rem', color: '#4d4635', marginTop: '0.2rem' }}>
              {sidebarTab === 'blocks' ? 'Drag elements or click to add' : 'Select a theme for your bio link'}
            </p>
          </div>

          {sidebarTab === 'blocks' ? (
            <div style={{ flex: 1, overflow: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {COMPONENT_TYPES.map(c => (
                <ComponentItem 
                  key={c.key} 
                  icon={c.icon} 
                  label={c.label} 
                  desc={c.desc} 
                  isPro={(c as any).isPro}
                  onClick={() => handleAddBlock(c.key)}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', c.key);
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, overflow: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {Object.entries(BACKGROUND_PRESETS).map(([key, preset]) => {
                const isSelected = backgroundTheme === key && !customBgUrl;
                return (
                  <div
                    key={key}
                    onClick={async () => {
                      if (preset.isPro && !isProEligible) {
                        setShowProModal(true);
                        return;
                      }
                      setBackgroundTheme(key);
                      setCustomBgUrl('');
                      isEditingThemeRef.current = true;
                      setTimeout(() => { isEditingThemeRef.current = false; }, 6000);
                      try {
                        await setDoc(doc(db, 'creators', creatorId), {
                          backgroundTheme: key,
                          customBgUrl: '',
                          updatedAt: new Date().toISOString()
                        }, { merge: true });
                        setSaved(true);
                        setTimeout(() => setSaved(false), 2200);
                      } catch (err) {
                        console.error("Failed to save theme:", err);
                      }
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 12,
                      background: preset.bg,
                      border: `2px solid ${isSelected ? '#f2ca50' : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: isSelected ? '0 0 15px rgba(242,202,80,0.25)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minHeight: 56,
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      {preset.label}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {preset.isPro && (
                        <span style={{
                          background: 'linear-gradient(135deg, #f2ca50, #e05a4e)',
                          color: '#16130b',
                          padding: '2px 6px',
                          borderRadius: 6,
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}>
                          PRO
                        </span>
                      )}
                      {isSelected && (
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: '#f2ca50', color: '#16130b',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: '0.5rem', background: '#18150f', padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(242,202,80,0.15)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#eae1d4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Custom Wallpaper (PRO)</span>
                  {customBgUrl && (
                    <span style={{ fontSize: '0.65rem', color: '#6fe692', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Check size={11} /> Attached
                    </span>
                  )}
                </label>

                <label style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  width: '100%', padding: '0.55rem 0.6rem', borderRadius: 8,
                  background: '#241f14', border: '1px solid rgba(242,202,80,0.3)',
                  color: '#f2ca50', fontSize: '0.75rem', fontWeight: 600,
                  cursor: isUploadingBg ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}>
                  <Upload size={13} />
                  {isUploadingBg ? 'Uploading image...' : 'Upload Wallpaper File'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={isUploadingBg}
                    onChange={async (e) => {
                      if (!isProEligible) {
                        setShowProModal(true);
                        return;
                      }
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingBg(true);
                      isEditingThemeRef.current = true;
                      setTimeout(() => { isEditingThemeRef.current = false; }, 8000);
                      let finalBgUrl = '';
                      try {
                        const storageRef = ref(storage, `creator_wallpapers/${Date.now()}_${file.name}`);
                        const uploadPromise = (async () => {
                          const snapshot = await uploadBytes(storageRef, file);
                          return await getDownloadURL(snapshot.ref);
                        })();
                        const timeoutPromise = new Promise<string>((_, reject) => {
                          setTimeout(() => reject(new Error('Cloud storage timed out after 1.5s')), 1500);
                        });
                        finalBgUrl = await Promise.race([uploadPromise, timeoutPromise]);
                      } catch (err) {
                        console.warn("Cloud storage upload slow or blocked, instantly generating high-quality canvas compression...", err);
                        try {
                          finalBgUrl = await compressAndResizeImage(file);
                        } catch (canvasErr) {
                          console.error("Canvas compression error:", canvasErr);
                          const reader = new FileReader();
                          finalBgUrl = await new Promise<string>((resolve) => {
                            reader.onloadend = () => resolve((reader.result as string) || '');
                            reader.readAsDataURL(file);
                          });
                        }
                      }
                      if (finalBgUrl) {
                        setCustomBgUrl(finalBgUrl);
                        try {
                          await setDoc(doc(db, 'creators', creatorId), {
                            customBgUrl: finalBgUrl,
                            updatedAt: new Date().toISOString()
                          }, { merge: true });
                          setSaved(true);
                          setTimeout(() => setSaved(false), 2200);
                        } catch (saveErr) {
                          console.error("Failed to save wallpaper to Firestore:", saveErr);
                          alert("Could not save wallpaper to cloud database: " + (saveErr as Error).message);
                        }
                      }
                      setIsUploadingBg(false);
                    }}
                  />
                </label>

                <div>
                  <div style={{ fontSize: '0.68rem', color: '#99907c', marginBottom: '0.3rem' }}>Or paste image link:</div>
                  <input
                    type="text"
                    placeholder="https://example.com/wallpaper.jpg"
                    value={customBgUrl}
                    onChange={e => {
                      if (!isProEligible) {
                        setShowProModal(true);
                        return;
                      }
                      setCustomBgUrl(e.target.value);
                    }}
                    onBlur={async () => {
                      if (customBgUrl) {
                        isEditingThemeRef.current = true;
                        setTimeout(() => { isEditingThemeRef.current = false; }, 5000);
                        try {
                          await setDoc(doc(db, 'creators', creatorId), {
                            customBgUrl,
                            updatedAt: new Date().toISOString()
                          }, { merge: true });
                          setSaved(true);
                          setTimeout(() => setSaved(false), 2200);
                        } catch (err) {
                          console.error("Error saving wallpaper URL:", err);
                        }
                      }
                    }}
                    style={{
                      width: '100%',
                      background: '#0d0d0d',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      padding: '0.5rem 0.6rem',
                      color: '#eae1d4',
                      fontSize: '0.75rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* ── Cell Phone Dimensions & Design Guide ────────────────── */}
              <div style={{
                marginTop: '0.25rem',
                background: '#14110a',
                padding: '0.875rem',
                borderRadius: 10,
                border: '1px solid rgba(77,70,53,0.3)',
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#f2ca50', fontWeight: 700, fontSize: '0.75rem' }}>
                  <Sparkles size={13} />
                  <span>Cell Phone Dimensions Guide</span>
                </div>
                <p style={{ fontSize: '0.65rem', color: '#eae1d4', lineHeight: 1.4, margin: 0 }}>
                  Customize your artwork to fit mobile screens perfectly! Recommended resolutions:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '0.15rem' }}>
                  <div style={{ background: '#1f1b13', padding: '0.45rem 0.6rem', borderRadius: 6, borderLeft: '3px solid #f2ca50' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>📱 Universal Standard (19.5:9)</div>
                    <div style={{ fontSize: '0.64rem', color: '#f2ca50', fontWeight: 700, margin: '2px 0' }}>1080 × 2340 px</div>
                    <div style={{ fontSize: '0.58rem', color: '#8c8270', lineHeight: 1.3 }}>Best for iPhone 14/15/16, Galaxy S23/S24, Pixel 8/9. Covers 90% of smartphones cleanly!</div>
                  </div>
                  <div style={{ background: '#1f1b13', padding: '0.45rem 0.6rem', borderRadius: 6, borderLeft: '3px solid #6fe692' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>📏 Tall / Ultra Screens (20:9)</div>
                    <div style={{ fontSize: '0.64rem', color: '#6fe692', fontWeight: 700, margin: '2px 0' }}>1080 × 2400 px</div>
                    <div style={{ fontSize: '0.58rem', color: '#8c8270', lineHeight: 1.3 }}>Best for Galaxy Ultra, Sony Xperia, & tall Android flagships.</div>
                  </div>
                  <div style={{ background: '#1f1b13', padding: '0.45rem 0.6rem', borderRadius: 6, borderLeft: '3px solid #38bdf8' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>🎞️ Classic / Stories (16:9)</div>
                    <div style={{ fontSize: '0.64rem', color: '#38bdf8', fontWeight: 700, margin: '2px 0' }}>1080 × 1920 px</div>
                    <div style={{ fontSize: '0.58rem', color: '#8c8270', lineHeight: 1.3 }}>Standard HD vertical format (iPhone SE, older displays, IG Stories).</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.6rem', color: '#99907c', fontStyle: 'italic', marginTop: '0.2rem', lineHeight: 1.3 }}>
                  💡 <strong style={{ color: '#eae1d4' }}>Design Tip:</strong> Keep key logos or faces focused in the top/center area. Our automatic dark glassmorphism overlay ensures your link buttons stay crisp and legible over any uploaded image!
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── CENTER: Canvas with Phone Preview ────────────────── */}
        <section style={{
          flex: 1, overflow: 'auto',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '3rem 2rem',
          position: 'relative',
          background: 'radial-gradient(circle at 50% 0%, rgba(242,202,80,0.025) 0%, transparent 55%), #14110a',
        }}>
          {/* Dot grid background */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(208,197,175,0.09) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          {/* Phone frame */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative', flexShrink: 0,
              width: 360, height: 760,
              background: customBgUrl ? `url(${customBgUrl}) center/cover no-repeat` : (BACKGROUND_PRESETS[backgroundTheme]?.bg || '#16130b'),
              borderRadius: 48,
              border: '10px solid #38342b',
              boxShadow: `
                0 28px 64px -12px rgba(0,0,0,0.9),
                0 0 0 1px rgba(77,70,53,0.4),
                0 0 50px rgba(242,202,80,0.04)
              `,
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {customBgUrl && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(22, 19, 11, 0.65)',
                backdropFilter: 'blur(8px)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
            )}
            {/* Status bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.5rem 1.5rem 0',
              position: 'relative', zIndex: 10, flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>9:41</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Signal size={11} color="#fff" />
                <Wifi size={11} color="#fff" />
                <Battery size={11} color="#fff" />
              </div>
            </div>

            {/* Dynamic Island */}
            <div style={{
              position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
              width: 110, height: 26,
              background: '#000', borderRadius: 13, zIndex: 20,
            }} />

            {/* Scrollable phone content & DROP ZONE */}
            <div 
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => {
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const type = e.dataTransfer.getData('text/plain');
                handleAddBlock(type);
              }}
              style={{
                flex: 1, overflowY: 'auto', overflowX: 'hidden',
                padding: '2.75rem 1.25rem 1.5rem',
                display: 'flex', flexDirection: 'column', gap: '0.625rem',
                scrollbarWidth: 'none',
                background: isDragOver ? 'rgba(242,202,80,0.04)' : 'transparent',
                transition: 'background 0.2s ease',
                position: 'relative',
                zIndex: 10
              }}
            >
              {/* Creator header */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', marginBottom: '0.625rem', marginTop: '0.5rem',
              }}>
                {/* Gradient avatar */}
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'linear-gradient(135deg, #d4a830 0%, #7a4c08 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid rgba(242,202,80,0.3)',
                  boxShadow: '0 0 24px rgba(242,202,80,0.12)',
                  marginBottom: '0.75rem',
                }}>
                  {!avatarUrl && (
                    <span style={{
                      color: '#3c2f00', fontWeight: 900, fontSize: '1.4rem',
                      fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.02em',
                    }}>
                      {displayName ? String(displayName).split(' ').filter(Boolean).map(n => n[0] || '').join('').toUpperCase() || 'MCT' : 'MCT'}
                    </span>
                  )}
                </div>
                <h2 style={{
                  fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                  fontSize: '1.05rem', color: '#eae1d4',
                }}>
                  {displayName || 'Your Name'}
                </h2>
                <p style={{ fontSize: '0.68rem', color: '#99907c', marginTop: '0.375rem', maxWidth: 210, lineHeight: 1.5 }}>
                  {bio || 'Enter a biography to populate your public visitor profile card.'}
                </p>
              </div>

              {/* Dynamic list reordering with HTML5 Drag-and-Drop */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', padding: 0, margin: 0 }}>
                {blocks.filter(Boolean).map((block, index) => {
                  const isDragging = draggedIdx === index;
                  return (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedIdx(index);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDragEnter={() => {
                        if (draggedIdx !== null && draggedIdx !== index) {
                          const newBlocks = [...blocks];
                          const draggedItem = newBlocks[draggedIdx];
                          newBlocks.splice(draggedIdx, 1);
                          newBlocks.splice(index, 0, draggedItem);
                          setDraggedIdx(index);
                          setBlocks(newBlocks);
                        }
                      }}
                      onDragEnd={() => {
                        setDraggedIdx(null);
                      }}
                      style={{
                        opacity: isDragging ? 0.4 : 1,
                        transform: isDragging ? 'scale(0.98)' : 'scale(1)',
                        transition: 'transform 0.2s ease, opacity 0.2s ease',
                        cursor: 'grab',
                        width: '100%',
                        userSelect: 'none',
                      }}
                    >
                      {block.type === 'video' ? (
                        <VideoBlock
                          selected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(block.id)}
                          title={block.label}
                          sub={block.sub || ''}
                          url={block.url || ''}
                        />
                      ) : (
                        <InactiveBlock
                          icon={blockIcons[block.type] || Link2}
                          label={block.label}
                          selected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(block.id)}
                          accent={block.accent || (block.type === 'drop' ? '#e05a4e' : block.type === 'affiliate' ? '#6fe692' : '#f2ca50')}
                          url={block.url || block.crmUrl || ''}
                          type={block.type}
                          promoCode={block.promoCode}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── RIGHT: Properties Panel ──────────────────────────── */}
        <aside style={{
          width: '19rem', flexShrink: 0,
          background: '#231f17',
          borderLeft: '1px solid rgba(77,70,53,0.2)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        }}>
          {!activeBlock ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: '#8c8270' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#eae1d4', fontWeight: 600, fontFamily: 'Montserrat, sans-serif' }}>No block selected</p>
              <p style={{ fontSize: '0.75rem', color: '#8c8270', lineHeight: 1.5 }}>Click a component on the left or drop it into your phone preview to add and edit blocks.</p>
            </div>
          ) : (
            <>
              {/* Panel header */}
              <div style={{
                padding: '1.125rem 1.375rem',
                borderBottom: '1px solid rgba(77,70,53,0.2)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#2d2a21', flexShrink: 0,
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    {React.createElement(blockIcons[activeType] || Link2, { size: 17, style: { color: '#f2ca50' } })}
                    <AnimatePresence mode="wait">
                      <motion.h3
                        key={activeBlock.id}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#eae1d4' }}
                      >
                        {activeBlock.label || 'Untitled Block'}
                      </motion.h3>
                    </AnimatePresence>
                  </div>
                  <p style={{ fontSize: '0.6rem', color: 'rgba(242,202,80,0.45)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                    Editing currently selected
                  </p>
                </div>
                <button
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#4d4635', transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#eae1d4'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4d4635'; }}
                >
                  <MoreVertical size={15} />
                </button>
              </div>

              {/* Properties content — changes with selected block */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBlock.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                  {activeType === 'video' ? (
                    <VideoProperties
                      block={activeBlock}
                      onChange={handleUpdateActiveBlock}
                      onSave={handleSave}
                      saved={saved}
                      onDiscard={handleDiscard}
                      onDelete={() => handleDeleteBlock(activeBlock.id)}
                    />
                  ) : (
                    <GenericProperties
                      block={activeBlock}
                      onChange={handleUpdateActiveBlock}
                      onSave={handleSave}
                      saved={saved}
                      onDiscard={handleDiscard}
                      onDelete={() => handleDeleteBlock(activeBlock.id)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </aside>
      </div>

      {/* Pro Upgrade Tease Modal */}
      <AnimatePresence>
        {showProModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProModal(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(12,12,14,0.85)',
              backdropFilter: 'blur(8px)', zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#1a1710', border: '1px solid rgba(242,202,80,0.4)',
                borderRadius: '1.25rem', padding: '2.5rem', maxWidth: 460, width: '100%',
                boxShadow: '0 0 50px rgba(242,202,80,0.15)', textAlign: 'center',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowProModal(false)}
                style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  background: 'transparent', border: 'none', color: '#eae1d4', cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'rgba(242,202,80,0.15)',
                border: '1px solid rgba(242,202,80,0.3)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 1.5rem'
              }}>
                <Sparkles size={32} color="#f2ca50" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#eae1d4', marginBottom: '0.75rem', fontFamily: 'Montserrat, sans-serif' }}>
                Unlock Audience Capture with <span style={{ color: '#f2ca50' }}>Tembo Pro!</span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#eae1d4', opacity: 0.8, lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Start capturing email subscribers directly into your dashboard with 1-click CSV export, or sync seamlessly with your favorite CRM like ConvertKit, Mailchimp, or Substack!
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setShowProModal(false);
                    window.location.hash = '#/campaigns';
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #f2ca50 0%, #ffe088 100%)', color: '#0c0c0e',
                    border: 'none', borderRadius: '0.75rem', padding: '0.875rem 1.5rem',
                    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(242,202,80,0.3)', transition: 'transform 0.15s ease'
                  }}
                >
                  Upgrade to Creator Pro
                </button>
                <button
                  onClick={() => {
                    setCreatorTier('pro');
                    setShowProModal(false);
                    const newId = `form-${Date.now()}`;
                    const newBlock: BlockItem = {
                      id: newId,
                      type: 'form',
                      label: 'Join the VIP List',
                      url: '',
                      sub: '',
                      accent: '#f2ca50',
                      formMode: 'dashboard',
                      crmUrl: ''
                    };
                    setBlocks(prev => [...prev, newBlock]);
                    setSelectedBlockId(newId);
                  }}
                  style={{
                    background: 'rgba(242,202,80,0.1)', color: '#f2ca50',
                    border: '1px solid rgba(242,202,80,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1.5rem',
                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  ✨ Preview in Pro Mode (Test Build)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
