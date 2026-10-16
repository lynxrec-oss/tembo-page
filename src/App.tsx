/**
 * TEMBO PAGE — Landing Page
 * "Your Bio Link Should Think."
 *
 * Full marketing landing page with:
 * - Sticky scroll-aware navbar
 * - Hero with interactive phone mockup (traffic personalization demo)
 * - Social proof marquee strip
 * - Features bento grid
 * - Feature deep-dive walkthrough
 * - Creator showcase carousel
 * - Pricing plans with billing toggle
 * - Final CTA banner
 * - Footer
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TemboBrand } from './TemboBrand';
import CreatorDashboard from './CreatorDashboard';
import PageBuilder from './PageBuilder';
import Analytics from './Analytics';
import Campaigns from './Campaigns';
import Settings from './Settings';
import PublicProfile from './PublicProfile';
import ChatSetup from './ChatSetup';
import OwnerAdmin from './OwnerAdmin';
import Onboarding from './Onboarding';
import Login from './Login';
import Pricing from './Pricing';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import Profile from './Profile';
import HelpCenter from './HelpCenter';
import About from './About';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import ContactSupport from './ContactSupport';
import Blog from './Blog';
import AffiliatePage from './Affiliate';
import CreatorFund from './CreatorFund';
import { 
  PRICING_PLANS, 
  MARQUEE_STATS, 
  SITE_STATS,
  ANNUAL_DISCOUNT_PERCENT, 
  ANNUAL_DISCOUNT_LABEL, 
  CURRENT_YEAR 
} from './config/siteConfig';






// ─── Simple hash & path-based router with normalization ─────────────────────
function normalizeRoute(raw: string): string {
  if (!raw) return '#/';
  let r = raw.trim();
  try {
    r = decodeURIComponent(r);
  } catch (e) {}
  
  if (!r.startsWith('#')) {
    r = `#${r.startsWith('/') ? '' : '/'}${r}`;
  }
  // If format is like #@creator, normalize to #/@creator
  if (r.startsWith('#@')) {
    r = `#/@${r.substring(2)}`;
  }
  // Ensure leading slash after hash if missing (e.g. #dashboard -> #/dashboard)
  // but leave in-page anchors like #pricing, #features intact if they exist on landing
  const isAnchorOnly = ['#features', '#showcase', '#pricing'].includes(r);
  if (!isAnchorOnly && r.startsWith('#') && !r.startsWith('#/')) {
    r = `#/${r.substring(1)}`;
  }
  return r;
}

function useHashRoute() {
  const getInitialRoute = () => {
    if (typeof window === 'undefined') return '#/';
    if (window.location.hash) return normalizeRoute(window.location.hash);
    const path = window.location.pathname;
    if (path && path !== '/' && path !== '/index.html') {
      return normalizeRoute(path);
    }
    return '#/';
  };

  const [hash, setHash] = useState(getInitialRoute);
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash) {
        setHash(normalizeRoute(window.location.hash));
      } else if (window.location.pathname && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        setHash(normalizeRoute(window.location.pathname));
      } else {
        setHash('#/');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, []);
  return hash;
}
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import {
  Sparkles, TrendingUp, LayoutGrid, Brain, Users, ChevronRight,
  Check, Zap, Globe, BarChart3, MessageSquare, ArrowRight, Star,
  Instagram, Youtube, Mail, Music, ShoppingBag, Link2, Play,
  Shield, Infinity, Twitter, Menu, X
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type TrafficSource = 'tiktok' | 'instagram' | 'youtube' | 'newsletter';

interface LinkCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent: string;
  sources: TrafficSource[];
}

interface Creator {
  name: string;
  handle: string;
  niche: string;
  followers: string;
  ctr: string;
  weeklyClicks: string;
  avatar: string;
  color: string;
  sampleLinks: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TRAFFIC_CONFIGS: Record<TrafficSource, {
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}> = {
  tiktok: {
    label: 'TikTok',
    icon: <Music size={14} />,
    color: '#f2ca50',
    description: 'Showing merch + trending audio first',
  },
  instagram: {
    label: 'Instagram',
    icon: <Instagram size={14} />,
    color: '#6fe692',
    description: 'Showing portfolio + collab DM first',
  },
  youtube: {
    label: 'YouTube',
    icon: <Youtube size={14} />,
    color: '#e05a4e',
    description: 'Showing latest video + membership first',
  },
  newsletter: {
    label: 'Newsletter',
    icon: <Mail size={14} />,
    color: '#a78bfa',
    description: 'Showing archive + subscriber exclusives',
  },
};

const ALL_LINK_CARDS: LinkCard[] = [
  {
    id: 'merch',
    icon: <ShoppingBag size={16} />,
    title: 'New Drop — Savannah Tee',
    subtitle: 'Limited Edition · 47 left',
    accent: '#f2ca50',
    sources: ['tiktok', 'newsletter'],
  },
  {
    id: 'latest-video',
    icon: <Youtube size={16} />,
    title: 'I Tried Every Link-in-Bio App',
    subtitle: '2.1M views · Watch now',
    accent: '#e05a4e',
    sources: ['youtube', 'instagram'],
  },
  {
    id: 'spotify',
    icon: <Music size={16} />,
    title: 'Latest Playlist',
    subtitle: 'Savannah Sunset Vibes · 12 tracks',
    accent: '#1db954',
    sources: ['tiktok', 'instagram'],
  },
  {
    id: 'collab',
    icon: <MessageSquare size={16} />,
    title: 'Brand Collab Inquiries',
    subtitle: 'Open for Spring 2026',
    accent: '#6fe692',
    sources: ['instagram', 'youtube'],
  },
  {
    id: 'membership',
    icon: <Star size={16} />,
    title: 'Join the Herd · Members Only',
    subtitle: '680 members · From $5/mo',
    accent: '#ffe088',
    sources: ['youtube', 'newsletter'],
  },
  {
    id: 'archive',
    icon: <Link2 size={16} />,
    title: 'Full Content Archive',
    subtitle: '200+ articles & videos',
    accent: '#a78bfa',
    sources: ['newsletter'],
  },
];

const CREATORS: Creator[] = [
  {
    name: 'Elena Rust',
    handle: '@elenarust',
    niche: 'Lifestyle & Travel',
    followers: '1.2M',
    ctr: '22.4%',
    weeklyClicks: '3,240',
    avatar: 'ER',
    color: '#f2ca50',
    sampleLinks: ['🗺️ Bali Travel Guide (PDF)', '📸 Preset Pack 2026', '✈️ Book Next Expedition'],
  },
  {
    name: 'Marcus Osei',
    handle: '@marcosei',
    niche: 'Tech & Productivity',
    followers: '840K',
    ctr: '18.9%',
    weeklyClicks: '2,180',
    avatar: 'MO',
    color: '#6fe692',
    sampleLinks: ['⚡ Notion Operating System', '🎙️ Savannah Podcast Ep. 42', '💻 Desk Setup Gear Guide'],
  },
  {
    name: 'Priya Voss',
    handle: '@priyavoss',
    niche: 'Fashion & Beauty',
    followers: '2.1M',
    ctr: '31.2%',
    weeklyClicks: '7,650',
    avatar: 'PV',
    color: '#a78bfa',
    sampleLinks: ['👗 Autumn Lookbook & Links', '💄 Skincare Morning Routine', '🛍️ Exclusive Discount Codes'],
  },
  {
    name: 'Kai Nakamura',
    handle: '@kainaka',
    niche: 'Music & Production',
    followers: '560K',
    ctr: '26.8%',
    weeklyClicks: '1,920',
    avatar: 'KN',
    color: '#e05a4e',
    sampleLinks: ['🎧 Stream "Savannah Drift" EP', '🎹 Drumkit & Loop Pack', '🎟️ Tour Dates & VIP Passes'],
  },
];


// ─── Hooks ───────────────────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function PhoneMockup({ activeSource }: { activeSource: TrafficSource }) {
  const visibleCards = ALL_LINK_CARDS.filter(c => c.sources.includes(activeSource));
  const config = TRAFFIC_CONFIGS[activeSource];

  return (
    <div className="relative mx-auto" style={{ width: 260 }}>
      {/* Ambient glow behind phone */}
      <div
        className="absolute inset-0 rounded-[2.5rem] blur-3xl opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${config.color}40, transparent 70%)`,
          transform: 'scale(1.2)',
        }}
      />

      {/* Phone frame */}
      <div className="phone-frame relative rounded-[2.5rem] p-[3px]" style={{ width: 260, height: 540 }}>
        <div className="phone-screen rounded-[2.4rem] overflow-hidden h-full flex flex-col">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] text-[#c9bfab] flex-shrink-0">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1.5 rounded-sm border border-[#c9bfab] relative">
                <div className="absolute inset-0.5 left-0.5 bg-[#c9bfab] rounded-sm" style={{ width: '70%' }} />
              </div>
            </div>
          </div>

          {/* Dynamic Island */}
          <div className="flex justify-center mb-2 flex-shrink-0">
            <div className="bg-black rounded-full" style={{ width: 100, height: 30 }} />
          </div>

          {/* Scroll content */}
          <div className="flex-1 overflow-hidden px-3 pb-3 flex flex-col gap-2">
            {/* Creator header */}
            <div className="flex flex-col items-center pt-1 pb-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black mb-1.5"
                style={{ background: `${config.color}20`, color: config.color, border: `2px solid ${config.color}40` }}
              >
                ER
              </div>
              <p className="text-[10px] font-bold text-[#eae1d4]">Elena Rust</p>
              <p className="text-[9px] text-[#99907c]">@elenarust</p>
              {/* AI badge */}
              <div
                className="flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[8px] font-semibold"
                style={{ background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}30` }}
              >
                <Sparkles size={8} />
                {config.description}
              </div>
            </div>

            {/* Link cards — animated reorder */}
            <LayoutGroup>
              <AnimatePresence mode="popLayout">
                {visibleCards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 340, damping: 30 },
                      delay: i * 0.05,
                      duration: 0.3,
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 flex-shrink-0"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${card.accent}25`,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${card.accent}20`, color: card.accent }}
                    >
                      {card.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold text-[#eae1d4] leading-tight truncate">{card.title}</p>
                      <p className="text-[8px] text-[#99907c] leading-tight truncate">{card.subtitle}</p>
                    </div>
                    <ChevronRight size={10} className="text-[#4d4635] ml-auto flex-shrink-0" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(22, 19, 11, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(242,202,80,0.08)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px -4px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#/" className="flex items-center" aria-label="Tembo Page home" style={{ textDecoration: 'none' }}>
          <TemboBrand iconSize={68} showWordmark={true} />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Showcase', 'Pricing', 'About', 'Creator Fund'].map(item => (
            <a
              key={item}
              href={item === 'About' ? '#/about' : item === 'Creator Fund' ? '#/fund' : `#${item.toLowerCase()}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: '#c9bfab' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f2ca50')}
              onMouseLeave={e => (e.currentTarget.style.color = '#c9bfab')}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#/login"
            className="text-sm font-medium px-4 py-2 transition-colors duration-200"
            style={{ color: '#eae1d4', textDecoration: 'none' }}
          >
            Log In
          </a>
          <a
            href="#/onboarding"
            className="glow-button text-sm font-bold px-5 py-2.5 rounded-full"
            style={{ background: '#f2ca50', color: '#3c2f00', textDecoration: 'none' }}
          >
            Join Tembo
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: '#eae1d4' }}
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(22,19,11,0.97)', borderTop: '1px solid rgba(77,70,53,0.4)' }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {['Features', 'Showcase', 'Pricing', 'About', 'Creator Fund'].map(item => (
                <a
                  key={item}
                  href={item === 'About' ? '#/about' : item === 'Creator Fund' ? '#/fund' : `#${item.toLowerCase()}`}
                  className="text-base font-medium"
                  style={{ color: '#eae1d4' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <a 
                  href="#/login"
                  className="w-full text-center text-sm font-medium py-2.5 rounded-full border text-decoration-none" 
                  style={{ color: '#eae1d4', borderColor: '#4d4635' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Log In
                </a>
                <a 
                  href="#/onboarding"
                  className="w-full text-center text-sm font-bold py-2.5 rounded-full glow-button text-decoration-none" 
                  style={{ background: '#f2ca50', color: '#3c2f00' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Join Tembo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection() {
  const [activeSource, setActiveSource] = useState<TrafficSource>('tiktok');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden hero-glow">
      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(242,202,80,0.08), transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(111,230,146,0.06), transparent)' }} />

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold"
        style={{
          background: 'rgba(242,202,80,0.08)',
          border: '1px solid rgba(242,202,80,0.2)',
          color: '#f2ca50',
        }}
      >
        <Sparkles size={12} className="ai-badge-pulse" />
        The Smartest Bio Link on the Savannah
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center font-black mb-6 leading-none"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          color: '#eae1d4',
          letterSpacing: '-0.03em',
        }}
      >
        Your Bio Link<br />
        <span className="text-gradient-gold">Should Think.</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center max-w-2xl mb-10 text-lg leading-relaxed"
        style={{ color: '#c9bfab' }}
      >
        Tembo Page turns your creator link into a smart hub — tracking every click, learning your audience, and automatically serving the right content to the right people. The savannah is vast; navigate it with wisdom.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 mb-20"
      >
        <button
          className="glow-button font-bold px-8 py-4 rounded-full text-base"
          style={{ background: '#f2ca50', color: '#3c2f00', fontFamily: 'Montserrat, sans-serif' }}
        >
          Start Building Free
        </button>
        <button
          className="flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-base border transition-all duration-200"
          style={{ color: '#eae1d4', borderColor: '#4d4635', background: 'rgba(255,255,255,0.03)' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(242,202,80,0.3)';
            e.currentTarget.style.background = 'rgba(242,202,80,0.06)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#4d4635';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          }}
        >
          <Play size={16} />
          See It In Action
        </button>
      </motion.div>

      {/* Interactive phone demo */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-xl flex flex-col items-center gap-6"
      >
        {/* Traffic source switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(77,70,53,0.5)' }}>
          {(Object.entries(TRAFFIC_CONFIGS) as [TrafficSource, typeof TRAFFIC_CONFIGS[TrafficSource]][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveSource(key)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-300"
              style={
                activeSource === key
                  ? { background: `${config.color}20`, color: config.color, border: `1px solid ${config.color}40` }
                  : { color: '#99907c', border: '1px solid transparent' }
              }
            >
              {config.icon}
              {config.label}
            </button>
          ))}
        </div>

        {/* Label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeSource}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs font-medium text-center"
            style={{ color: TRAFFIC_CONFIGS[activeSource].color }}
          >
            ✦ {TRAFFIC_CONFIGS[activeSource].description}
          </motion.p>
        </AnimatePresence>

        {/* The phone */}
        <div className="float-slow">
          <PhoneMockup activeSource={activeSource} />
        </div>

        <p className="text-xs" style={{ color: '#4d4635' }}>
          ↑ Click a source to see your page adapt in real time
        </p>
      </motion.div>
    </section>
  );
}

function SocialProofBar() {
  const doubled = [...MARQUEE_STATS, ...MARQUEE_STATS];

  return (
    <section className="relative py-6 overflow-hidden" style={{ borderTop: '1px solid rgba(77,70,53,0.3)', borderBottom: '1px solid rgba(77,70,53,0.3)', background: 'rgba(22,19,11,0.6)' }}>
      <div className="flex justify-center items-center mb-3">
        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(242,202,80,0.08)', color: '#f2ca50', border: '1px solid rgba(242,202,80,0.18)' }}>
          ✦ Illustrative Platform Benchmarks
        </span>
      </div>
      <div className="marquee-track flex items-center gap-16">
        {doubled.map((stat, i) => (
          <div key={i} className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-xl font-black" style={{ color: '#f2ca50', fontFamily: 'Montserrat, sans-serif' }}>{stat.value}</p>
              <p className="text-xs font-medium" style={{ color: '#99907c' }}>{stat.label}</p>
            </div>
            <div className="w-px h-8 opacity-20" style={{ background: '#f2ca50' }} />
          </div>
        ))}
      </div>
      <p className="text-[10px] text-center mt-3 uppercase tracking-wider" style={{ color: '#4d4635' }}>
        *Modeled benchmarks based on platform conversion architecture.
      </p>
    </section>
  );
}

function FeaturesBento() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="features" className="relative py-28 px-6 max-w-7xl mx-auto section-glow-left">
      <div
        ref={ref}
        className={`reveal-hidden ${visible ? 'reveal-visible' : ''}`}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: '#f2ca50' }}>What Makes Tembo Different</p>
          <h2 className="font-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#eae1d4', letterSpacing: '-0.02em' }}>
            Intelligence Built In
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: '#c9bfab' }}>
            Every other bio link is a static list. Tembo is a living, learning system that grows smarter with every click.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — Smart Content Cards */}
          <div className="glow-card rounded-2xl p-8 relative overflow-hidden group" style={{ background: '#1a1710', borderTop: '1px solid rgba(242,202,80,0.12)', borderLeft: '1px solid rgba(242,202,80,0.06)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'rgba(242,202,80,0.06)', transform: 'translate(30%, -30%)' }} />
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(242,202,80,0.1)', border: '1px solid rgba(242,202,80,0.2)' }}>
              <LayoutGrid size={22} style={{ color: '#f2ca50' }} />
            </div>
            <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'Montserrat, sans-serif', color: '#eae1d4' }}>Smart Content Cards</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#99907c' }}>
              Cards that adapt their layout based on content type. YouTube, Spotify, merch drops, and links — each rendered beautifully and automatically.
            </p>
          </div>

          {/* Card 2 — Traffic Personalization (spans 2 cols) */}
          <div className="glow-card rounded-2xl p-8 md:col-span-2 relative overflow-hidden group" style={{ background: '#1a1710', borderTop: '1px solid rgba(111,230,146,0.12)', borderLeft: '1px solid rgba(111,230,146,0.06)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'rgba(111,230,146,0.05)', transform: 'translate(30%, -30%)' }} />
            <div className="flex flex-col md:flex-row gap-8 h-full">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(111,230,146,0.1)', border: '1px solid rgba(111,230,146,0.2)' }}>
                  <TrendingUp size={22} style={{ color: '#6fe692' }} />
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'Montserrat, sans-serif', color: '#eae1d4' }}>Traffic-Based Personalization</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#99907c' }}>
                  Serve different links to users based on where they came from. TikTok followers see your trending content; newsletter subscribers see your archive. Automatically.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: 'rgba(111,230,146,0.1)', color: '#6fe692', border: '1px solid rgba(111,230,146,0.2)' }}>
                  <TrendingUp size={12} />
                  {SITE_STATS.conversionLift.display} Projected Conversion Lift*
                </div>
              </div>
              {/* Mini traffic viz */}
              <div className="w-full md:w-52 flex-shrink-0">
                <div className="rounded-xl p-4 h-full" style={{ background: '#231f17', border: '1px solid rgba(77,70,53,0.4)' }}>
                  <p className="text-[10px] font-semibold mb-3" style={{ color: '#4d4635' }}>TRAFFIC SOURCE PERFORMANCE</p>
                  {[
                    { label: 'TikTok', pct: 78, color: '#f2ca50' },
                    { label: 'Instagram', pct: 62, color: '#6fe692' },
                    { label: 'YouTube', pct: 91, color: '#e05a4e' },
                    { label: 'Newsletter', pct: 55, color: '#a78bfa' },
                  ].map(item => (
                    <div key={item.label} className="mb-3">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span style={{ color: '#99907c' }}>{item.label}</span>
                        <span style={{ color: item.color }}>{item.pct}% CTR</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#38342b' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 — AI Recommendations (full width) */}
          <div className="glow-card rounded-2xl p-8 md:col-span-3 relative overflow-hidden group" style={{ background: '#1a1710', borderTop: '1px solid rgba(242,202,80,0.1)', borderLeft: '1px solid rgba(242,202,80,0.05)' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(242,202,80,0.04), transparent)' }} />
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(242,202,80,0.1)', border: '1px solid rgba(242,202,80,0.2)' }}>
                  <Brain size={22} style={{ color: '#f2ca50' }} />
                </div>
                <h3 className="font-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#eae1d4', fontSize: '1.75rem', letterSpacing: '-0.02em' }}>AI Recommendations</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#99907c', maxWidth: '36ch' }}>
                  Tembo analyzes your click patterns 24/7 and surfaces precise, actionable suggestions — so your page works for you, even while you sleep.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Click Pattern Analysis', 'Revenue Attribution', 'Optimal Scheduling', 'A/B Insights'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(77,70,53,0.5)', color: '#99907c' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* AI insight card */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <div className="rounded-2xl p-5" style={{ background: '#231f17', border: '1px solid rgba(242,202,80,0.12)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center ai-badge-pulse" style={{ background: 'rgba(242,202,80,0.15)' }}>
                      <Sparkles size={14} style={{ color: '#f2ca50' }} />
                    </div>
                    <p className="text-xs font-bold" style={{ color: '#f2ca50' }}>Tembo Intelligence</p>
                  </div>
                  {[
                    { text: '68% of your TikTok traffic clicks merch between 6PM–9PM. Pin it to the top during those hours?', action: 'Apply' },
                    { text: 'Your YouTube link performs 3.2× better when placed after the Spotify card. Swap them?', action: 'Swap' },
                  ].map((insight, i) => (
                    <div key={i} className="mb-3 p-3 rounded-xl" style={{ background: '#2d2a21', border: '1px solid rgba(77,70,53,0.4)' }}>
                      <p className="text-xs mb-3 leading-relaxed" style={{ color: '#c9bfab' }}>💡 {insight.text}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-colors" style={{ background: 'rgba(242,202,80,0.15)', color: '#f2ca50' }}>
                          {insight.action}
                        </button>
                        <button className="flex-1 text-[10px] font-medium py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: '#99907c' }}>
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureWalkthrough() {
  const rows = [
    {
      icon: <LayoutGrid size={20} />,
      eyebrow: 'Smart Content Cards',
      title: 'Every Content Type. One Beautiful Page.',
      body: 'Tembo auto-detects your link type and renders the richest possible card — Spotify players with album art, YouTube embeds with live view counts, and merch cards with inventory badges. Not a plain blue hyperlink. Never again.',
      visual: (
        <div className="space-y-3">
          {[
            { icon: <Youtube size={16} />, label: 'Latest Video', sub: '2.1M views · YouTube', color: '#e05a4e', wide: true },
            { icon: <Music size={16} />, label: 'Savannah Sunset Vibes', sub: 'Playlist · Spotify', color: '#1db954', wide: false },
            { icon: <ShoppingBag size={16} />, label: 'New Drop Available', sub: 'Merch · 47 left', color: '#f2ca50', wide: false },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="flex items-center gap-3 rounded-xl p-4"
              style={{ background: '#231f17', border: `1px solid ${item.color}25` }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#eae1d4' }}>{item.label}</p>
                <p className="text-xs" style={{ color: '#99907c' }}>{item.sub}</p>
              </div>
              <ChevronRight size={14} className="ml-auto" style={{ color: '#4d4635' }} />
            </motion.div>
          ))}
        </div>
      ),
      flip: false,
      accentColor: '#f2ca50',
    },
    {
      icon: <TrendingUp size={20} />,
      eyebrow: 'Traffic-Based Personalization',
      title: 'One URL. Infinite Versions.',
      body: 'Your TikTok fans want merch and trending audio. Your newsletter readers want deep dives and archives. Your YouTube subscribers want your latest video. Tembo detects the referrer and serves each visitor a custom page — automatically, with zero extra work from you.',
      visual: (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#231f17', border: '1px solid rgba(77,70,53,0.4)' }}>
          {[
            { source: 'TikTok', icon: <Music size={12} />, links: ['🛒 New Drop — Savannah Tee', '🎵 Latest Sound', '🎭 Collab Video'], color: '#f2ca50' },
            { source: 'Newsletter', icon: <Mail size={12} />, links: ['📚 Full Archive', '⭐ Members-Only Content', '📬 Subscribe'], color: '#a78bfa' },
          ].map((item, i) => (
            <div key={i} className="p-4" style={{ borderBottom: i === 0 ? '1px solid rgba(77,70,53,0.3)' : 'none' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>
                  {item.icon} {item.source} traffic
                </div>
              </div>
              <div className="space-y-2">
                {item.links.map((link, j) => (
                  <div key={j} className="text-xs py-2 px-3 rounded-lg" style={{ background: '#2d2a21', color: '#c9bfab' }}>{link}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
      flip: true,
      accentColor: '#6fe692',
    },
    {
      icon: <Brain size={20} />,
      eyebrow: 'AI Recommendations',
      title: 'Your Personal Growth Strategist. Always On.',
      body: 'Tembo studies your audience behavior around the clock and tells you exactly what to change, when to change it, and why. It\'s like having a data scientist embedded in your link page — without the salary.',
      visual: (
        <div className="space-y-3">
          {[
            { emoji: '📈', text: 'Move your Merch card to position #1 during peak hours (6PM–9PM). Projected +18% CTR.', accepted: true },
            { emoji: '🔁', text: 'Your YouTube link sees 3.2× better performance after your Spotify card. Try swapping?', accepted: false },
            { emoji: '📅', text: 'Your Instagram audience is 40% more active on Wednesdays. Schedule your drops then.', accepted: false },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="p-4 rounded-xl"
              style={{ background: '#231f17', border: `1px solid ${item.accepted ? 'rgba(111,230,146,0.2)' : 'rgba(77,70,53,0.4)'}` }}
            >
              <div className="flex gap-3">
                <span className="text-lg flex-shrink-0">{item.emoji}</span>
                <p className="text-xs leading-relaxed flex-1" style={{ color: '#c9bfab' }}>{item.text}</p>
              </div>
              {item.accepted && (
                <div className="flex items-center gap-1 mt-2 text-[10px] font-bold" style={{ color: '#6fe692' }}>
                  <Check size={10} /> Applied automatically
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ),
      flip: false,
      accentColor: '#f2ca50',
    },
  ];

  return (
    <section id="showcase" className="py-28 px-6 max-w-7xl mx-auto section-glow-right">
      <div className="text-center mb-20">
        <p className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: '#f2ca50' }}>See It Think</p>
        <h2 className="font-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#eae1d4', letterSpacing: '-0.02em' }}>
          Every Feature, Shown
        </h2>
        <p className="max-w-xl mx-auto text-base" style={{ color: '#c9bfab' }}>
          Not a promise. A demonstration.
        </p>
      </div>

      <div className="flex flex-col gap-24">
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${row.flip ? 'lg:grid-flow-dense' : ''}`}
          >
            <div className={row.flip ? 'lg:col-start-2' : ''}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${row.accentColor}15`, color: row.accentColor }}>
                  {row.icon}
                </div>
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: row.accentColor }}>
                  {row.eyebrow}
                </span>
              </div>
              <h3 className="font-black mb-4 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: '#eae1d4', letterSpacing: '-0.02em' }}>
                {row.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: '#99907c' }}>{row.body}</p>
            </div>
            <div className={row.flip ? 'lg:col-start-1 lg:row-start-1' : ''}>
              {row.visual}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CreatorShowcase() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-28 overflow-hidden" style={{ background: '#110e07' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3" style={{ background: 'rgba(242,202,80,0.1)', color: '#f2ca50', border: '1px solid rgba(242,202,80,0.2)' }}>
            ✦ Example Showcase Profiles
          </div>
          <h2 className="font-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#eae1d4', letterSpacing: '-0.02em' }}>
            Built by Creators, for Creators
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: '#c9bfab' }}>
            From emerging voices to million-follower creators, Tembo adapts to every scale.
          </p>
        </div>

        {/* Cards */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {CREATORS.map((creator, i) => (
            <motion.div
              key={creator.handle}
              whileHover={{ y: -4 }}
              onClick={() => setActive(i)}
              className="snap-center flex-shrink-0 rounded-2xl p-6 cursor-pointer transition-all duration-200"
              style={{
                width: 300,
                background: active === i ? '#1f1b13' : '#16130b',
                border: `1px solid ${active === i ? creator.color + '30' : 'rgba(77,70,53,0.3)'}`,
                boxShadow: active === i ? `0 0 40px -10px ${creator.color}20` : 'none',
              }}
            >
              {/* Avatar */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: `${creator.color}15`, color: creator.color, border: `2px solid ${creator.color}30` }}
                >
                  {creator.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#eae1d4', fontFamily: 'Montserrat, sans-serif' }}>{creator.name}</p>
                  <p className="text-xs" style={{ color: '#99907c' }}>{creator.handle}</p>
                </div>
              </div>

              {/* Niche */}
              <div className="mb-5">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${creator.color}10`, color: creator.color, border: `1px solid ${creator.color}20` }}>
                  {creator.niche}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Followers', value: creator.followers },
                  { label: 'CTR', value: creator.ctr.endsWith('%') ? creator.ctr : `${creator.ctr}%` },
                  { label: 'Clicks/wk', value: creator.weeklyClicks },
                ].map(stat => (
                  <div key={stat.label} className="p-2.5 rounded-lg text-center" style={{ background: '#2d2a21' }}>
                    <p className="text-sm font-black" style={{ color: creator.color, fontFamily: 'Montserrat, sans-serif' }}>{stat.value}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: '#4d4635' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Mini link preview */}
              <div className="space-y-1.5">
                {creator.sampleLinks.map((link, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs py-2 px-3 rounded-lg" style={{ background: '#2d2a21', color: '#c9bfab' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: creator.color }} />
                    <span className="truncate">{link}</span>
                    <ChevronRight size={10} className="ml-auto flex-shrink-0" style={{ color: '#4d4635' }} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {CREATORS.map((creator, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: active === i ? creator.color : '#38342b', transform: active === i ? 'scale(1.3)' : 'scale(1)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPlans() {
  const [annual, setAnnual] = useState(false);
  const { ref, visible } = useScrollReveal();

  return (
    <section id="pricing" className="py-28 px-6 max-w-7xl mx-auto section-glow-left">
      <div ref={ref} className={`reveal-hidden ${visible ? 'reveal-visible' : ''}`}>
        <div className="text-center mb-16">
          <p className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: '#f2ca50' }}>Pricing</p>
          <h2 className="font-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#eae1d4', letterSpacing: '-0.02em' }}>
            Find Your Place in the Herd
          </h2>
          <p className="max-w-xl mx-auto text-base mb-8" style={{ color: '#c9bfab' }}>
            Start free, scale as you grow. No hidden fees. No surprises.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full" style={{ background: '#1f1b13', border: '1px solid rgba(77,70,53,0.4)' }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={!annual ? { background: '#f2ca50', color: '#3c2f00' } : { color: '#99907c' }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2"
              style={annual ? { background: '#f2ca50', color: '#3c2f00' } : { color: '#99907c' }}
            >
              Annual
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: annual ? 'rgba(60,47,0,0.3)' : 'rgba(111,230,146,0.15)', color: annual ? '#3c2f00' : '#6fe692' }}>
                {ANNUAL_DISCOUNT_LABEL}
              </span>
            </button>
          </div>
        </div>

        {/* Tier cards in responsive 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRICING_PLANS.map((tier, i) => (
            <motion.div
              key={tier.name}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-8 relative flex flex-col"
              style={
                tier.popular
                  ? {
                      background: 'linear-gradient(145deg, #231f17, #1a1710)',
                      border: '1px solid rgba(242,202,80,0.25)',
                      boxShadow: '0 0 60px -15px rgba(242,202,80,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }
                  : {
                      background: '#1a1710',
                      border: '1px solid rgba(77,70,53,0.4)',
                    }
              }
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full text-xs font-black" style={{ background: '#f2ca50', color: '#3c2f00', fontFamily: 'Montserrat, sans-serif' }}>
                    {tier.badge}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-black text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif', color: tier.popular ? '#f2ca50' : '#eae1d4' }}>
                  {tier.name}
                </h3>
                <p className="text-xs" style={{ color: '#99907c' }}>{tier.subtitle}</p>
              </div>

              <div className="mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={annual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-end gap-1"
                  >
                    <span className="font-black" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '2.5rem', color: '#eae1d4', lineHeight: 1 }}>
                      ${annual ? (tier.annualPrice > 0 ? tier.annualPrice : 0) : tier.monthlyPrice}
                    </span>
                    {(annual ? tier.annualPrice : tier.monthlyPrice) > 0 && (
                      <span className="text-sm mb-1" style={{ color: '#99907c' }}>/mo</span>
                    )}
                  </motion.div>
                </AnimatePresence>
                {annual && tier.annualPrice > 0 && (
                  <p className="text-xs mt-1" style={{ color: '#6fe692' }}>Billed annually · Save ${((tier.monthlyPrice - tier.annualPrice) * 12).toFixed(0)}/yr</p>
                )}
              </div>

              <div className="flex flex-col gap-3 mb-8 flex-1">
                {tier.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: tier.popular ? 'rgba(242,202,80,0.15)' : 'rgba(111,230,146,0.1)' }}>
                      <Check size={10} style={{ color: tier.popular ? '#f2ca50' : '#6fe692' }} />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: '#c9bfab' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => window.location.hash = tier.id === 'free' ? '#/onboarding' : '#/pricing'}
                className="w-full py-3.5 rounded-full font-bold text-sm transition-all duration-200 cursor-pointer"
                style={
                  tier.popular
                    ? { background: '#f2ca50', color: '#3c2f00', boxShadow: '0 0 24px -4px rgba(242,202,80,0.3)' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#eae1d4', border: '1px solid rgba(77,70,53,0.5)' }
                }
                onMouseEnter={e => {
                  if (!tier.popular) {
                    e.currentTarget.style.borderColor = 'rgba(242,202,80,0.3)';
                    e.currentTarget.style.background = 'rgba(242,202,80,0.06)';
                  }
                }}
                onMouseLeave={e => {
                  if (!tier.popular) {
                    e.currentTarget.style.borderColor = 'rgba(77,70,53,0.5)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Enterprise note */}
        <p className="text-center mt-10 text-sm" style={{ color: '#4d4635' }}>
          All plans include a 14-day free trial. No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-28 px-6 relative overflow-hidden" style={{ background: '#110e07' }}>
      {/* Ambient blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl" style={{ background: 'radial-gradient(ellipse, rgba(242,202,80,0.07), transparent)', pointerEvents: 'none' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(111,230,146,0.04), transparent)', pointerEvents: 'none' }} />

      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold inline-flex mx-auto" style={{ background: 'rgba(242,202,80,0.08)', border: '1px solid rgba(242,202,80,0.2)', color: '#f2ca50' }}>
            <Zap size={12} />
            Free to start · No credit card needed
          </div>

          <h2 className="font-black mb-6 leading-none" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#eae1d4', letterSpacing: '-0.03em' }}>
            Start Your Journey<br />
            <span className="text-gradient-gold">Across the Digital Savannah</span>
          </h2>

          <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: '#c9bfab' }}>
            Join {SITE_STATS.creators.display} creators who turned their link-in-bio from a list of URLs into a living, thinking, converting machine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="glow-button font-black px-10 py-5 rounded-full text-base"
              style={{ background: '#f2ca50', color: '#3c2f00', fontFamily: 'Montserrat, sans-serif' }}
            >
              Claim Your Free Page
            </button>
            <button
              className="flex items-center justify-center gap-2 font-semibold px-8 py-5 rounded-full text-base border transition-all duration-200"
              style={{ color: '#eae1d4', borderColor: '#4d4635', background: 'rgba(255,255,255,0.03)' }}
            >
              Book a Demo <ArrowRight size={16} />
            </button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {[
              { icon: <Shield size={14} />, label: 'SOC 2 Type II' },
              { icon: <Globe size={14} />, label: `${SITE_STATS.uptime.display} Uptime` },
              { icon: <Infinity size={14} />, label: 'Unlimited Clicks' },
              { icon: <Zap size={14} />, label: 'Setup in 2 Minutes' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-xs font-medium" style={{ color: '#4d4635' }}>
                <span style={{ color: '#f2ca50' }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#110e07', borderTop: '1px solid rgba(77,70,53,0.3)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:gap-12 mb-12">
          {/* Brand col */}
          <div className="md:col-span-1">
            <div className="mb-3">
              <TemboBrand iconSize={36} showWordmark={true} /></div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#4d4635' }}>
              Your Bio Link Should Think.<br />Built for the Digital Savannah.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Twitter size={15} />, href: 'https://twitter.com/TemboPageSupport' },
                { icon: <Instagram size={15} />, href: '#showcase' },
                { icon: <Youtube size={15} />, href: '#showcase' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{ background: '#1f1b13', color: '#4d4635', border: '1px solid rgba(77,70,53,0.3)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f2ca50'; e.currentTarget.style.borderColor = 'rgba(242,202,80,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4d4635'; e.currentTarget.style.borderColor = 'rgba(77,70,53,0.3)'; }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {[
            { title: 'Product', links: ['Features', 'Page Builder', 'Analytics', 'Smart Pixel', 'Campaign Manager', 'Tembo Chat'] },
            { title: 'Creators', links: ['Success Stories', 'Creator Fund', 'Showcase', 'Blog', 'Templates', 'API Docs'] },
            { title: 'Company', links: ['About', 'Become an Affiliate', 'Careers', 'Press', 'Privacy Policy', 'Terms of Service', 'Contact Support'] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-xs font-bold mb-4 tracking-widest uppercase" style={{ color: '#99907c' }}>{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <a
                    key={link}
                    href={
                      link === 'About' ? '#/about' :
                      link === 'Become an Affiliate' ? '#/affiliate' :
                      link === 'Privacy Policy' ? '#/privacy' :
                      link === 'Terms of Service' ? '#/terms' :
                      link === 'Contact Support' ? '#/contact' :
                      link === 'Pricing' ? '#pricing' :
                      link === 'Features' ? '#features' :
                      link === 'Showcase' ? '#showcase' :
                      link === 'Blog' ? '#/blog' :
                      link === 'Creator Fund' ? '#/fund' :
                      link === 'Success Stories' ? '#showcase' :
                      link === 'Templates' ? '#showcase' :
                      link === 'API Docs' ? '#/help' :
                      link === 'Careers' ? '#/about' :
                      link === 'Press' ? '#/about' :
                      link === 'Page Builder' ? '#/builder' :
                      link === 'Analytics' ? '#/analytics' :
                      link === 'Smart Pixel' ? '#/dashboard' :
                      link === 'Campaign Manager' ? '#/campaigns' :
                      link === 'Tembo Chat' ? '#/chat' : '#/'
                    }
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#4d4635' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#eae1d4')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#4d4635')}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(77,70,53,0.2)' }}>
          <p className="text-xs" style={{ color: '#4d4635' }}>© {CURRENT_YEAR} Tembo Page, Inc. All rights reserved.</p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#4d4635' }}>
            <TemboBrand iconSize={16} showWordmark={false} iconOnly={true} />
            Built for the Digital Savannah
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      if (targetId === 'about' || targetId === '/about') return;
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }
  }, []);

  return (
    <div className="relative">
      <div className="fixed inset-0 noise-texture z-[999] pointer-events-none opacity-30" />
      <NavBar />
      <main>
        <HeroSection />
        <SocialProofBar />
        <FeaturesBento />
        <FeatureWalkthrough />
        <CreatorShowcase />
        <PricingPlans />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

// ─── Main App Router ──────────────────────────────────────────────────────────

export default function App() {
  const hash = useHashRoute();
  const path = hash.split('?')[0];



  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      const hasBypass = localStorage.getItem('savannah_bypass') === 'true' || localStorage.getItem('beta_bypass') === 'true';
      const hasSession = localStorage.getItem('has_active_session') === 'true';
      const isAuthenticating = typeof window !== 'undefined' && sessionStorage.getItem('authenticating_key') === 'true';

      if (u) {
        if (!u.isAnonymous) {
          localStorage.setItem('has_active_session', 'true');
          setUser(u);
        } else if (hasBypass && hasSession) {
          setUser(u);
        } else if (isAuthenticating || path === '#/login') {
          // Do NOT purge! User is actively verifying an access key or on the login screen
          setUser(u);
        } else {
          // Stale or unvalidated anonymous user trying to access interior or protected route
          try {
            await signOut(auth);
          } catch (e) {}
          localStorage.removeItem('has_active_session');
          localStorage.removeItem('savannah_bypass');
          localStorage.removeItem('beta_bypass');
          localStorage.removeItem('active_creator_id');
          setUser(null);
        }
      } else {
        localStorage.removeItem('has_active_session');
        localStorage.removeItem('savannah_bypass');
        localStorage.removeItem('beta_bypass');
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, [path]);

  const hasStripeSuccess = hash.includes('session_id=') && hash.includes('plan=');

  const interiorRoutes = [
    '#/dashboard', '#/builder', '#/analytics',
    '#/campaigns', '#/settings', '#/chat', '#/profile', '#/owner-admin'
  ];
  const isInteriorRoute = interiorRoutes.some(r => path === r || path.startsWith(`${r}/`));

  const hasValidAuth = Boolean(
    user && 
    (
      !user.isAnonymous || 
      ((localStorage.getItem('savannah_bypass') === 'true' || localStorage.getItem('beta_bypass') === 'true') && localStorage.getItem('has_active_session') === 'true')
    )
  );

  if (isInteriorRoute && authLoading) {
    return (
      <div className="min-h-screen bg-[#16130b] flex items-center justify-center text-[#f2ca50] font-display text-sm tracking-widest uppercase">
        Verifying Session...
      </div>
    );
  }

  if (isInteriorRoute && !hasValidAuth && !hasStripeSuccess) {
    // Intercept unauthorized navigation and direct them to the login page
    window.location.hash = '#/login';
    return <Login />;
  }

  // Strict check for owner route
  if (path === '#/owner-admin' && localStorage.getItem('savannah_bypass') !== 'true') {
    window.location.hash = '#/dashboard';
    return <CreatorDashboard />;
  }

  if (path === '#/login') return <Login />;

  if (path === '#/dashboard') return <CreatorDashboard />;
  if (path === '#/builder') return <PageBuilder />;
  if (path === '#/analytics') return <Analytics />;
  if (path === '#/campaigns') return <Campaigns />;
  if (path === '#/settings') return <Settings />;
  if (path === '#/chat') return <ChatSetup />;
  if (path === '#/profile') return <Profile />;
  if (path === '#/owner-admin') return <OwnerAdmin />;
  if (path === '#/help') return <HelpCenter />;
  if (path === '#/onboarding') return <Onboarding />;
  if (path === '#/pricing') return <Pricing />;
  if (path === '#/about' || path === '#about') return <About />;
  if (path === '#/privacy' || path === '#privacy') return <PrivacyPolicy />;
  if (path === '#/terms' || path === '#terms') return <TermsOfService />;
  if (path === '#/contact' || path === '#contact') return <ContactSupport />;
  if (path === '#/blog' || path === '#blog') return <Blog />;
  if (path === '#/affiliate' || path === '#affiliate') return <AffiliatePage />;
  if (path === '#/fund' || path === '#fund') return <CreatorFund />;
  if (path === '#/elenarust' || path === '#/@elenarust') return <PublicProfile creatorId="elenarust" />;
  if (path === '#/tembo' || path === '#/@tembo') return <PublicProfile creatorId="tembo" />;

  // Dynamic creator page routing
  let rawHandle = path.startsWith('#/') ? path.substring(2) : path.startsWith('#') ? path.substring(1) : path;
  if (rawHandle.startsWith('@')) rawHandle = rawHandle.substring(1);
  if (rawHandle.endsWith('/')) rawHandle = rawHandle.slice(0, -1);
  const cleanCreator = rawHandle.toLowerCase().trim();

  const staticRoutes = [
    '', 'dashboard', 'analytics', 'builder', 'campaigns', 'settings', 'chat', 
    'profile', 'owner-admin', 'help', 'onboarding', 'pricing', 'about', 
    'privacy', 'terms', 'contact', 'blog', 'affiliate', 'fund', 'login',
    'index', 'index.html'
  ];

  if (cleanCreator && !staticRoutes.includes(cleanCreator) && !cleanCreator.includes('.') && !cleanCreator.startsWith('api/') && !cleanCreator.startsWith('assets/')) {
    return <PublicProfile creatorId={cleanCreator} />;
  }

  // All other routes → landing page
  return <LandingPage />;
}
