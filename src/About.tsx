/**
 * TEMBO PAGE — About Page (Premium Edition)
 *
 * Sections:
 *  1. Sticky NavBar (glass morphism + polished mobile drawer)
 *  2. Hero — headline + ambient glow blob
 *  3. Live Metric Bar — animated stat counters
 *  4. Marquee — social proof ticker
 *  5. Three Philosophical Pillars (bento grid)
 *  6. Full-Bleed Interstitial Quote break
 *  7. Brand Origin Story (split layout)
 *  8. Testimonial Cards
 *  9. Meet the Herd (team grid — clearly framed as "founding creative team")
 * 10. Final CTA Banner
 * 11. Footer
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Heart, Sparkles, Brain, Award, Users, ChevronRight,
  TrendingUp, MessageSquare, ArrowRight, Star, Menu, X,
  Zap, Globe, ShieldCheck, Quote
} from 'lucide-react';
import { TemboBrand } from './TemboBrand';
import { SITE_STATS, MARQUEE_STATS } from './config/siteConfig';

// ─── Stat Bar ────────────────────────────────────────────────────────────────
const ABOUT_STATS = [
  { value: SITE_STATS.creators.display, label: 'Active Creators' },
  { value: SITE_STATS.clicks.display, label: 'Clicks Tracked' },
  { value: SITE_STATS.conversionLift.display, label: 'Conversion Lift' },
  { value: SITE_STATS.countries.display, label: 'Countries Reached' },
  { value: SITE_STATS.revenueAttributed.display, label: 'Revenue Attributed' },
  { value: SITE_STATS.uptime.display, label: 'Uptime SLA' },
];

function StatBar() {
  return (
    <div className="flex flex-col items-center mb-32">
      {/* Illustrative badge */}
      <div 
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6" 
        style={{ background: 'rgba(242,202,80,0.08)', color: '#f2ca50', border: '1px solid rgba(242,202,80,0.18)' }}
      >
        <Sparkles size={11} />
        ✦ Illustrative Platform Benchmarks
      </div>

      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px overflow-hidden rounded-2xl border border-outline-variant/20"
        style={{ background: 'rgba(242,202,80,0.04)' }}
      >
        {ABOUT_STATS.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center py-8 px-3 text-center"
            style={{ background: 'rgba(22,19,11,0.85)' }}
          >
            <p
              className="text-3xl lg:text-4xl font-black tracking-tight mb-1"
              style={{ fontFamily: 'Montserrat, sans-serif', color: '#f2ca50' }}
            >
              {s.value}
            </p>
            <p className="text-[11px] font-medium tracking-wide uppercase" style={{ color: '#7d7060' }}>
              {s.label}
            </p>
          </div>
        ))}
      </motion.section>

      <p className="text-[10px] text-center mt-3 uppercase tracking-wider" style={{ color: '#4d4635' }}>
        *Modeled benchmarks based on platform conversion architecture.
      </p>
    </div>
  );
}

// ─── Marquee ticker ──────────────────────────────────────────────────────────
const handles = [
  '@jadestudio', '@malik.creates', '@theauroralab', '@soph_designs',
  '@kaito.world', '@nyx.creative', '@vera_editions', '@omari.xyz',
  '@lunastudio', '@the_dune_co', '@obi.creative', '@rafa.media',
];

function Marquee() {
  return (
    <div className="mb-28 relative overflow-hidden">
      <div
        className="absolute left-0 top-0 w-24 h-full z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #0c0c0e 0%, transparent 100%)' }}
      />
      <div
        className="absolute right-0 top-0 w-24 h-full z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #0c0c0e 0%, transparent 100%)' }}
      />
      <div className="marquee-track flex gap-8 items-center" style={{ width: 'max-content' }}>
        {[...handles, ...handles].map((h, i) => (
          <span
            key={i}
            className="text-sm font-semibold px-5 py-2 rounded-full border flex-shrink-0"
            style={{ color: '#c9bfab', borderColor: 'rgba(77,70,53,0.4)', background: 'rgba(22,19,11,0.7)' }}
          >
            {h} <span style={{ color: '#f2ca50' }}>✦</span>
          </span>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .marquee-track {
          animation: marquee-scroll 30s linear infinite;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AboutPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pillars = [
    {
      icon: <Brain size={22} />,
      tag: 'AI Engine',
      title: 'Deep Wisdom',
      body: 'Every public profile hosts a living Gemini-powered advisor that answers visitor questions in your voice—contextually, warmly, and without you lifting a finger.',
    },
    {
      icon: <Zap size={22} />,
      tag: 'Smart Routing',
      title: 'Contextual Flow',
      body: 'Our traffic-aware engine detects where a visitor arrived from and rearranges your page blocks in real time—serving the right content to every audience segment.',
    },
    {
      icon: <ShieldCheck size={22} />,
      tag: 'Pixel Integrity',
      title: 'Silent Footprints',
      body: 'A 2.8 KB Smart Pixel aggregates conversion events serverlessly via Cloud Functions—powerful analytics with zero cookies, zero tracking consent friction.',
    },
  ];

  const testimonials = [
    {
      quote: "Tembo replaced three tools I was paying for separately. My page is now my best-performing sales asset.",
      name: 'Jade M.',
      handle: '@jadestudio',
      role: 'Visual Artist & Course Creator',
      color: 'linear-gradient(135deg, #f2ca50, #ffe088)',
    },
    {
      quote: "The AI chat on my Tembo page answered a brand deal inquiry at 2 AM while I was asleep. That's my assistant now.",
      name: 'Kaito R.',
      handle: '@kaito.world',
      role: 'Travel Filmmaker, 820K Followers',
      color: 'linear-gradient(135deg, #10b981, #6fe692)',
    },
    {
      quote: "I switched from Linktree within 20 minutes. The analytics depth here is on a completely different level.",
      name: 'Vera S.',
      handle: '@vera_editions',
      role: 'Lifestyle Creator & Podcaster',
      color: 'linear-gradient(135deg, #a78bfa, #c084fc)',
    },
  ];

  const team = [
    {
      initials: 'AW',
      name: 'Alesia (Founder)',
      role: 'Vision & Brand Strategy',
      bio: 'Creator-turned-builder. Built Tembo Page to give every digital creator the intelligent home page they deserve.',
      color: 'linear-gradient(135deg, #f2ca50, #ffe088)',
    },
    {
      initials: 'ZV',
      name: 'Lead Engineer',
      role: 'Systems Architecture',
      bio: "Serverless infrastructure specialist. Keeps Tembo's backend scaling invisibly across every continent.",
      color: 'linear-gradient(135deg, #10b981, #6fe692)',
    },
    {
      initials: 'MS',
      name: 'AI Research Lead',
      role: 'Conversational Intelligence',
      bio: "Semantic AI researcher. Crafts the contextual reasoning that makes Tembo's advisor feel genuinely thoughtful.",
      color: 'linear-gradient(135deg, #a78bfa, #c084fc)',
    },
  ];

  return (
    <div
      className="relative min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden"
      style={{ background: '#0c0c0e', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Global noise overlay */}
      <div className="fixed inset-0 noise-texture z-[99] pointer-events-none opacity-25" />

      {/* Ambient light blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-200px] right-[-200px] w-[700px] h-[700px] rounded-full blur-[180px] opacity-[0.06]" style={{ background: '#f2ca50' }} />
        <div className="absolute bottom-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full blur-[180px] opacity-[0.05]" style={{ background: '#f2ca50' }} />
      </div>

      {/* ─── Styles ──────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-gradient-gold {
          background: linear-gradient(135deg, #f2ca50 0%, #ffe5a0 60%, #f2ca50 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glow-card {
          background: rgba(22,19,11,0.85);
          box-shadow: 0 4px 30px rgba(0,0,0,0.5), inset 1px 1px 0 rgba(242,202,80,0.06);
          backdrop-filter: blur(8px);
          transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .glow-card:hover {
          box-shadow: 0 12px 50px rgba(242,202,80,0.09), inset 1px 1px 0 rgba(242,202,80,0.18);
          border-color: rgba(242,202,80,0.28) !important;
          transform: translateY(-3px);
        }
        .glow-button {
          box-shadow: 0 4px 20px -2px rgba(242,202,80,0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glow-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 36px -2px rgba(242,202,80,0.5);
        }
        .pillar-icon-ring {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(242,202,80,0.08);
          border: 1px solid rgba(242,202,80,0.14);
          color: #f2ca50;
          margin-bottom: 22px;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .glow-card:hover .pillar-icon-ring {
          background: rgba(242,202,80,0.14);
          border-color: rgba(242,202,80,0.3);
        }
        .interstitial-gradient {
          background: linear-gradient(135deg, #16130b 0%, #1d1a0e 50%, #16130b 100%);
          border-top: 1px solid rgba(242,202,80,0.1);
          border-bottom: 1px solid rgba(242,202,80,0.1);
        }
        .mobile-nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 0; border-bottom: 1px solid rgba(77,70,53,0.25);
          font-size: 15px; font-weight: 600; color: #c9bfab;
          text-decoration: none; transition: color 0.2s;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active { color: #f2ca50; }
        .mobile-nav-link .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(242,202,80,0.3); flex-shrink: 0;
          transition: background 0.2s;
        }
        .mobile-nav-link:hover .dot, .mobile-nav-link.active .dot { background: #f2ca50; }
      `}} />

      {/* ─── 1. STICKY NAVBAR ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: 'rgba(12,12,14,0.85)', borderColor: 'rgba(242,202,80,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <a href="#/" className="flex items-center" style={{ textDecoration: 'none' }}>
            <TemboBrand iconSize={68} showWordmark={true} />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {[['#features','Features'],['#showcase','Showcase'],['#pricing','Pricing'],['#/fund','Creator Fund']].map(([href,label]) => (
              <a key={href} href={href} className="text-sm font-medium transition-colors" style={{ color: '#c9bfab', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f2ca50')}
                onMouseLeave={e => (e.currentTarget.style.color = '#c9bfab')}
              >{label}</a>
            ))}
            <a href="#/about" className="text-sm font-semibold" style={{ color: '#f2ca50', textDecoration: 'none' }}>About</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="#/login" className="text-sm font-medium px-4 py-2 transition-colors" style={{ color: '#eae1d4', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f2ca50')}
              onMouseLeave={e => (e.currentTarget.style.color = '#eae1d4')}
            >Log In</a>
            <a href="#/onboarding" className="glow-button text-sm font-bold px-5 py-2.5 rounded-full" style={{ background: '#f2ca50', color: '#3c2f00', textDecoration: 'none' }}>
              Join Tembo
            </a>
          </div>

          <button
            className="md:hidden p-2.5 rounded-xl transition-colors"
            style={{ color: '#eae1d4', background: 'rgba(242,202,80,0.06)', border: '1px solid rgba(242,202,80,0.1)' }}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
              style={{ background: 'rgba(16,13,8,0.98)', borderTop: '1px solid rgba(242,202,80,0.08)' }}
            >
              <div className="px-7 pt-4 pb-8 flex flex-col">
                {[['#features','Features'],['#showcase','Showcase'],['#pricing','Pricing'],['#/fund','Creator Fund'],['#/about','About',true]].map(([href, label, active]) => (
                  <a key={href as string} href={href as string} className={`mobile-nav-link ${active ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                    <span className="dot" />
                    {label}
                  </a>
                ))}
                <div className="flex flex-col gap-3 mt-6">
                  <a href="#/login" className="w-full text-center text-sm font-semibold py-3 rounded-full border transition-all" style={{ color: '#eae1d4', borderColor: 'rgba(77,70,53,0.5)', textDecoration: 'none' }}>
                    Log In
                  </a>
                  <a href="#/onboarding" className="w-full text-center text-sm font-bold py-3 rounded-full glow-button" style={{ background: '#f2ca50', color: '#3c2f00', textDecoration: 'none' }}>
                    Join Tembo — It's Free
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── 2. HERO ──────────────────────────────────────────────── */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-24 text-center relative">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[900px] h-[400px] rounded-full blur-[140px] opacity-[0.07]" style={{ background: '#f2ca50' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-xs font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(242,202,80,0.07)', borderColor: 'rgba(242,202,80,0.18)', color: '#f2ca50' }}
            >
              <Sparkles size={11} />
              Our Story &amp; Philosophy
            </div>

            <h1
              className="font-black text-[40px] md:text-[68px] lg:text-[76px] tracking-tight text-[#eae1d4] mb-8 leading-[1.05]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              An Elephant Never Forgets.<br />
              <span className="text-gradient-gold">Neither Should Your Bio Link.</span>
            </h1>

            <p className="text-[#c9bfab] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              We believe a creator's landing page shouldn't be a static directory of cold links. It should be a living, intelligent portal — one that remembers context, adapts to every visitor, and works for you around the clock.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#/onboarding" className="glow-button font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2"
                style={{ background: '#f2ca50', color: '#3c2f00', textDecoration: 'none', fontSize: '14px' }}
              >
                Claim Your Page <ArrowRight size={15} />
              </a>
              <a href="#features" className="font-semibold px-8 py-4 rounded-full border flex items-center justify-center gap-2 transition-all"
                style={{ color: '#eae1d4', borderColor: 'rgba(77,70,53,0.5)', textDecoration: 'none', fontSize: '14px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(242,202,80,0.4)'; e.currentTarget.style.color = '#f2ca50'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(77,70,53,0.5)'; e.currentTarget.style.color = '#eae1d4'; }}
              >
                See How It Works <ChevronRight size={15} />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ─── 3. STAT BAR ──────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <StatBar />
        </div>

        {/* ─── 4. MARQUEE ───────────────────────────────────────────── */}
        <div>
          <p className="text-center text-[10px] font-semibold tracking-widest uppercase mb-6" style={{ color: '#4d4635' }}>
            Trusted by creators worldwide
          </p>
          <Marquee />
        </div>

        {/* ─── 5. THREE PILLARS ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#f2ca50' }}>What we stand for</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              The Three Pillars of the Herd
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glow-card rounded-2xl p-8 border"
                style={{ borderColor: 'rgba(77,70,53,0.3)' }}
              >
                <div className="pillar-icon-ring">{p.icon}</div>
                <span className="text-[10px] font-bold tracking-widest uppercase mb-2 block" style={{ color: '#f2ca50' }}>{p.tag}</span>
                <h3 className="text-lg font-black text-[#eae1d4] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{p.title}</h3>
                <p className="text-sm text-[#c9bfab] leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── 6. FULL-BLEED INTERSTITIAL QUOTE ────────────────────── */}
        <section className="interstitial-gradient py-28 px-6 mb-32 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] opacity-30" style={{ background: 'linear-gradient(90deg, transparent, #f2ca50, transparent)' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] opacity-30" style={{ background: 'linear-gradient(90deg, transparent, #f2ca50, transparent)' }} />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <Quote size={40} className="mx-auto mb-8 opacity-30" style={{ color: '#f2ca50' }} />
            <p className="text-2xl md:text-4xl font-black leading-tight text-[#eae1d4] mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              "Your bio link is the{' '}
              <span className="text-gradient-gold">most visited page</span>{' '}
              you're building — and most creators treat it like a footnote."
            </p>
            <p className="text-sm font-semibold" style={{ color: '#7d7060' }}>— The Tembo Page Manifesto</p>
          </motion.div>
        </section>

        {/* ─── 7. BRAND ORIGIN STORY ────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual side */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5"
            >
              <div
                className="glow-card border rounded-2xl aspect-square flex flex-col items-center justify-center relative overflow-hidden"
                style={{ borderColor: 'rgba(77,70,53,0.3)' }}
              >
                {/* Radial glow behind logo */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full blur-[80px] opacity-20" style={{ background: '#f2ca50' }} />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <TemboBrand iconSize={110} showWordmark={false} iconOnly={true} />
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold"
                    style={{ borderColor: 'rgba(242,202,80,0.25)', background: 'rgba(242,202,80,0.06)', color: '#f2ca50' }}
                  >
                    <Heart size={12} className="fill-current" />
                    Built for the Digital Savannah
                  </div>
                </div>
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{ background: 'radial-gradient(circle at top right, #f2ca50, transparent)' }} />
                <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5" style={{ background: 'radial-gradient(circle at bottom left, #f2ca50, transparent)' }} />
              </div>
            </motion.div>

            {/* Copy side */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7"
            >
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#f2ca50' }}>Origins of our name</p>
              <h2 className="text-3xl md:text-4xl font-black text-[#eae1d4] mb-7 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Why We're Called<br />
                <span className="text-gradient-gold">"Tembo"</span>
              </h2>
              <p className="text-sm text-[#c9bfab] leading-relaxed mb-5">
                In East Africa, <strong style={{ color: '#eae1d4' }}>Tembo</strong> is the Swahili word for elephant. Throughout history, elephants have been universally revered for three traits that mirror what we believe every creator's digital home should embody: <strong style={{ color: '#eae1d4' }}>remarkable memory</strong>, <strong style={{ color: '#eae1d4' }}>gentle but authoritative wisdom</strong>, and <strong style={{ color: '#eae1d4' }}>unbreakable community</strong>.
              </p>
              <p className="text-sm text-[#c9bfab] leading-relaxed mb-8">
                We designed Tembo Page as a digital tribute to these traits. Just as a herd moves across the plains with collective intelligence and calm coordination, Tembo Page empowers modern creators to orchestrate their diverse channels with unity, security, and purpose.
              </p>

              {/* Mini feature row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {[
                  { icon: <Brain size={14} />, label: 'AI-Powered Memory' },
                  { icon: <Globe size={14} />, label: 'Global Creator Network' },
                  { icon: <TrendingUp size={14} />, label: 'Built to Scale' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-2.5 text-xs font-semibold" style={{ color: '#c9bfab' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(242,202,80,0.08)', border: '1px solid rgba(242,202,80,0.14)', color: '#f2ca50' }}>
                      {f.icon}
                    </div>
                    {f.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── 8. TESTIMONIALS ──────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#f2ca50' }}>From the herd</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Creators Who Made the Switch
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glow-card rounded-2xl p-8 border flex flex-col"
                style={{ borderColor: 'rgba(77,70,53,0.3)' }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={13} className="fill-current" style={{ color: '#f2ca50' }} />
                  ))}
                </div>
                <p className="text-sm text-[#c9bfab] leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-5 border-t" style={{ borderColor: 'rgba(77,70,53,0.3)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                    style={{ background: t.color, color: '#3c2f00' }}
                  >
                    {t.name.split(' ')[0][0]}{t.name.split(' ')[1]?.[0] || ''}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#eae1d4]">{t.name}</p>
                    <p className="text-[10px] font-medium mt-0.5" style={{ color: '#7d7060' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── 9. MEET THE HERD ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#f2ca50' }}>The people behind it</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Meet the Founding Herd
            </h2>
            <p className="text-sm text-[#c9bfab] max-w-lg mx-auto mt-4 leading-relaxed">
              A small, remote team of designers, builders, and creators — united by one conviction: your bio link should do more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glow-card rounded-2xl p-8 border text-center"
                style={{ borderColor: 'rgba(77,70,53,0.3)' }}
              >
                {/* Avatar */}
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full blur-lg opacity-30 scale-110" style={{ background: m.color }} />
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center font-black text-xl"
                    style={{ background: m.color, color: '#3c2f00' }}
                  >
                    {m.initials}
                  </div>
                </div>
                <h3 className="text-sm font-black text-[#eae1d4] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{m.name}</h3>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: '#f2ca50' }}>{m.role}</p>
                <p className="text-xs text-[#c9bfab] leading-relaxed">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── 10. CTA BANNER ───────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glow-card rounded-2xl p-14 text-center relative overflow-hidden border"
            style={{ borderColor: 'rgba(242,202,80,0.12)' }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[2px] opacity-40" style={{ background: 'linear-gradient(90deg, transparent, #f2ca50, transparent)' }} />
              <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(ellipse at 50% 0%, #f2ca50, transparent 70%)' }} />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f2ca50' }}>Ready to join the herd?</p>
              <h3 className="text-3xl md:text-4xl font-black text-[#eae1d4] mb-5 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Cultivate Your Digital Savannah Today
              </h3>
              <p className="text-sm text-[#c9bfab] leading-relaxed mb-10 max-w-lg mx-auto">
                Join {SITE_STATS.creators.display} creators who replaced generic link lists with intelligent, thinking pages. Set up in under 5 minutes — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="#/onboarding" className="glow-button px-10 py-4 rounded-full text-sm font-bold flex items-center gap-2"
                  style={{ background: '#f2ca50', color: '#3c2f00', textDecoration: 'none' }}
                >
                  Get Started Free <ArrowRight size={15} />
                </a>
                <a href="#/pricing" className="px-10 py-4 rounded-full text-sm font-semibold border transition-all"
                  style={{ color: '#eae1d4', borderColor: 'rgba(77,70,53,0.5)', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(242,202,80,0.4)'; e.currentTarget.style.color = '#f2ca50'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(77,70,53,0.5)'; e.currentTarget.style.color = '#eae1d4'; }}
                >
                  View Pricing Plans
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ─── 11. FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t py-14 px-6" style={{ background: '#0c0c0e', borderColor: 'rgba(242,202,80,0.07)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <TemboBrand iconSize={18} showWordmark={false} iconOnly={true} />
            <p className="text-xs" style={{ color: '#4d4635' }}>
              © {new Date().getFullYear()} Tembo Page, Inc. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {['Privacy','Terms','Help','Become an Affiliate','Creator Fund','Contact Support'].map(l => (
              <a key={l} href={l === 'Privacy' ? '#/privacy' : l === 'Terms' ? '#/terms' : l === 'Help' ? '#/help' : l === 'Become an Affiliate' ? '#/affiliate' : l === 'Creator Fund' ? '#/fund' : l === 'Contact Support' ? '#/contact' : '#'} className="text-xs transition-colors" style={{ color: '#4d4635', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f2ca50')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4d4635')}
              >{l}</a>
            ))}
          </div>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#4d4635' }}>
            <Heart size={11} className="fill-current" style={{ color: '#f2ca50' }} />
            Built for the Digital Savannah
          </p>
        </div>
      </footer>
    </div>
  );
}
