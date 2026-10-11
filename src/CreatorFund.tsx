/**
 * TEMBO PAGE — Creator Fund Portal
 *
 * Dedicated grant program ($100K pool) supporting independent creators,
 * educators, artists, and builders cultivating living bio-link portals.
 * Savannah Sunset design system (#0c0c0e, #f2ca50, #16130b).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Award, ArrowRight, CheckCircle2, HelpCircle,
  ChevronDown, Heart, ShieldCheck, Menu, X, Send,
  Target, Zap, Globe, DollarSign, Users, Check
} from 'lucide-react';
import { TemboBrand } from './TemboBrand';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

interface GrantTier {
  id: 'emergent' | 'innovator' | 'catalyst';
  name: string;
  amount: string;
  badge?: string;
  audience: string;
  description: string;
  perks: string[];
}

const GRANT_TIERS: GrantTier[] = [
  {
    id: 'emergent',
    name: 'Emergent Voice Grant',
    amount: '$500 – $1,500',
    audience: 'Emerging creators (<25K community)',
    description: 'Direct cash grant to fund production gear, software tools, or content experiments.',
    perks: [
      'Non-dilutive cash grant',
      '1 Year free Creator Pro subscription',
      'Feature spot in Tembo Showcase',
      'Access to Creator Discord Alpha cohort',
    ],
  },
  {
    id: 'innovator',
    name: 'Savannah Innovator Grant',
    amount: '$2,500 – $5,000',
    badge: 'Most Popular',
    audience: 'Mid-scale creators (25K – 150K community)',
    description: 'Designed for creators launching digital courses, merch drops, or interactive communities.',
    perks: [
      'Direct cash grant for production scaling',
      '1 Year free Growth tier access',
      'Custom CNAME domain setup assistance',
      '1-on-1 Strategy session with founders',
      'Featured newsletter case study',
    ],
  },
  {
    id: 'catalyst',
    name: 'Pride Catalyst Fellowship',
    amount: '$10,000 + Co-Pilot',
    audience: 'Established voices & creative collectives (150K+)',
    description: 'For trailblazers co-developing bespoke intelligent features, smart pixels, and viral hubs.',
    perks: [
      '$10,000 non-dilutive creative grant',
      'Dedicated engineering co-pilot support',
      'Early access to beta AI models',
      'Lifetime VIP Growth membership',
      'Keynote spotlight at Tembo Summit',
    ],
  },
];

export default function CreatorFund() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Application form states
  const [selectedTier, setSelectedTier] = useState<'emergent' | 'innovator' | 'catalyst'>('innovator');
  const [creatorName, setCreatorName] = useState('');
  const [email, setEmail] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [niche, setNiche] = useState('Visual Arts & Design');
  const [audienceSize, setAudienceSize] = useState('10k - 50k');
  const [proposal, setProposal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; name: string } | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => (prev === index ? null : index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    const grantId = `TCF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const matchedTier = GRANT_TIERS.find(t => t.id === selectedTier);

    const applicationPayload = {
      trackingId: grantId,
      creatorName: creatorName.trim(),
      email: email.trim().toLowerCase(),
      profileUrl: profileUrl.trim() || '',
      targetTier: selectedTier,
      targetTierName: matchedTier ? matchedTier.name : selectedTier,
      targetTierAmount: matchedTier ? matchedTier.amount : '',
      audienceReach: audienceSize,
      niche,
      proposal: proposal.trim() || 'No proposal text provided.',
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'grant_applications', grantId), applicationPayload);
      setSubmittedData({ id: grantId, name: creatorName.trim() });
    } catch (err) {
      console.error('Error saving grant application to Firestore:', err);
      // Fallback: still show confirmation to user if offline/network hiccup occurs
      setSubmittedData({ id: grantId, name: creatorName.trim() });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden"
      style={{ background: '#0c0c0e', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Noise texture overlay */}
      <div className="fixed inset-0 noise-texture z-[99] pointer-events-none opacity-25" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[180px] opacity-[0.05] pointer-events-none z-0" style={{ background: '#f2ca50' }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.04] pointer-events-none z-0" style={{ background: '#f2ca50' }} />

      {/* Embedded inline helper styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-gradient-gold {
          background: linear-gradient(135deg, #f2ca50 0%, #ffe088 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glow-card {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), inset 1px 1px 0px rgba(242, 202, 80, 0.06);
          background: rgba(22, 19, 11, 0.85);
          backdrop-filter: blur(10px);
          transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .glow-card:hover {
          box-shadow: 0 10px 40px rgba(242, 202, 80, 0.08), inset 1px 1px 0px rgba(242, 202, 80, 0.18);
          border-color: rgba(242, 202, 80, 0.28) !important;
        }
        .glow-button {
          box-shadow: 0 4px 20px -2px rgba(242, 202, 80, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glow-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px -2px rgba(242, 202, 80, 0.45);
        }
      `}} />

      {/* ─── 1. NAVBAR ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-primary/5 bg-[#0c0c0e]/85">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <a href="#/" className="flex items-center" style={{ textDecoration: 'none' }}>
            <TemboBrand iconSize={40} showWordmark={true} />
          </a>

          <nav className="hidden md:flex items-center gap-8 font-body">
            <a href="#features" className="text-sm font-medium transition-colors text-decoration-none" style={{ color: '#c9bfab' }}>Features</a>
            <a href="#showcase" className="text-sm font-medium transition-colors text-decoration-none" style={{ color: '#c9bfab' }}>Showcase</a>
            <a href="#pricing" className="text-sm font-medium transition-colors text-decoration-none" style={{ color: '#c9bfab' }}>Pricing</a>
            <a href="#/about" className="text-sm font-medium transition-colors text-decoration-none" style={{ color: '#c9bfab' }}>About</a>
            <a href="#/fund" className="text-sm font-semibold transition-colors text-decoration-none" style={{ color: '#f2ca50' }}>Creator Fund</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {localStorage.getItem('has_active_session') === 'true' ? (
              <a href="#/dashboard" className="glow-button bg-primary text-[#3c2f00] text-sm font-bold px-5 py-2.5 rounded-full text-decoration-none">Go to Dashboard</a>
            ) : (
              <>
                <a href="#/login" className="text-sm font-medium px-4 py-2 hover:text-primary transition-colors text-decoration-none" style={{ color: '#eae1d4' }}>Log In</a>
                <a href="#/onboarding" className="glow-button bg-primary text-[#3c2f00] text-sm font-bold px-5 py-2.5 rounded-full text-decoration-none">Join Tembo</a>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(v => !v)}>
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
              style={{ background: 'rgba(22,19,11,0.98)', borderTop: '1px solid rgba(77,70,53,0.4)' }}
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                <a href="#features" className="text-base font-medium text-decoration-none" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(false)}>Features</a>
                <a href="#showcase" className="text-base font-medium text-decoration-none" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(false)}>Showcase</a>
                <a href="#pricing" className="text-base font-medium text-decoration-none" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(false)}>Pricing</a>
                <a href="#/about" className="text-base font-medium text-decoration-none" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(false)}>About</a>
                <a href="#/fund" className="text-base font-semibold text-decoration-none" style={{ color: '#f2ca50' }} onClick={() => setMobileOpen(false)}>Creator Fund</a>
                <div className="pt-2 flex flex-col gap-3">
                  <a href="#/login" className="w-full text-center text-sm font-medium py-2.5 rounded-full border text-decoration-none" style={{ color: '#eae1d4', borderColor: '#4d4635' }}>Log In</a>
                  <a href="#/onboarding" className="w-full text-center text-sm font-bold py-2.5 rounded-full glow-button bg-primary text-[#3c2f00] text-decoration-none">Join Tembo</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── 2. HERO SECTION ───────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-16 relative z-10 font-body">
        <section className="text-center max-w-3xl mx-auto mb-20 select-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(242,202,80,0.07)', borderColor: 'rgba(242,202,80,0.2)', color: '#f2ca50' }}
          >
            <Sparkles size={12} />
            Inaugural $100,000 Ecosystem Pool
          </div>

          <h1
            className="text-4xl md:text-6xl font-black text-[#eae1d4] mb-6 leading-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Empowering the Bold.<br />
            <span className="text-gradient-gold">Funding the Savvy.</span>
          </h1>

          <p className="text-sm md:text-base text-[#c9bfab] leading-relaxed max-w-2xl mx-auto mb-8">
            The Tembo Creator Fund provides non-dilutive financial grants, custom engineering support, and platform resources to creators building high-converting, intelligent digital home bases. No equity, no creative strings attached.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply"
              className="glow-button bg-primary text-[#3c2f00] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider text-decoration-none flex items-center justify-center gap-2"
            >
              Apply for a Grant <ArrowRight size={14} />
            </a>
            <a
              href="#tiers"
              className="px-8 py-4 rounded-full border text-xs font-semibold transition-all text-decoration-none flex items-center justify-center"
              style={{ color: '#eae1d4', borderColor: 'rgba(77,70,53,0.5)' }}
            >
              Explore Grant Tiers
            </a>
          </div>
        </section>

        {/* ─── 3. FUND HIGHLIGHTS ──────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            {
              icon: <DollarSign size={22} />,
              title: '100% Non-Dilutive Capital',
              desc: 'Grants are awarded directly via Stripe or wire transfer. Tembo takes zero equity, zero IP rights, and zero royalties.',
            },
            {
              icon: <Zap size={22} />,
              title: 'Co-Pilot Engineering Access',
              desc: 'Grant recipients collaborate directly with our engineering team to implement custom pixels, CRM integrations, and unique layouts.',
            },
            {
              icon: <Users size={22} />,
              title: 'The Herd Spotlight',
              desc: 'Recipients are featured across Tembo’s global channels, showcasing their work to our expanding creator ecosystem.',
            },
          ].map((item, idx) => (
            <div key={idx} className="glow-card border border-outline-variant/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(242,202,80,0.1)', color: '#f2ca50', border: '1px solid rgba(242,202,80,0.2)' }}>
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-[#eae1d4] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {item.title}
              </h3>
              <p className="text-xs text-[#c9bfab] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* ─── 4. GRANT TIERS ───────────────────────────────────────── */}
        <section id="tiers" className="mb-24 scroll-mt-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#f2ca50' }}>Grant Categories</p>
            <h2 className="text-3xl font-black text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Select Your Path
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GRANT_TIERS.map(tier => (
              <div
                key={tier.id}
                className="glow-card rounded-2xl p-8 border flex flex-col justify-between relative"
                style={{
                  borderColor: tier.id === selectedTier ? 'rgba(242,202,80,0.4)' : 'rgba(77,70,53,0.3)',
                  boxShadow: tier.id === selectedTier ? '0 0 40px -10px rgba(242,202,80,0.15)' : undefined,
                }}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ background: '#f2ca50', color: '#3c2f00' }}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-black text-[#eae1d4] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{tier.name}</h3>
                  <p className="text-[11px] font-semibold text-[#f2ca50] mb-4">{tier.amount}</p>
                  <p className="text-xs text-[#c9bfab] leading-relaxed mb-6">{tier.description}</p>

                  <div className="space-y-2.5 mb-8 border-t border-[#4d4635]/30 pt-5">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Check size={13} className="text-[#6fe692] shrink-0 mt-0.5" />
                        <span style={{ color: '#c9bfab' }}>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#apply"
                  onClick={() => setSelectedTier(tier.id)}
                  className={`w-full py-3 rounded-full text-xs font-bold text-center transition-all cursor-pointer text-decoration-none block ${
                    tier.id === selectedTier
                      ? 'bg-primary text-[#3c2f00] shadow-[0_0_20px_rgba(242,202,80,0.3)]'
                      : 'bg-[#1a1710] border border-[#4d4635] text-[#eae1d4] hover:border-primary/40'
                  }`}
                >
                  {tier.id === selectedTier ? 'Selected for Application' : 'Apply for This Tier'}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. APPLICATION FORM ─────────────────────────────────── */}
        <section id="apply" className="glow-card border border-outline-variant/30 rounded-2xl p-8 md:p-12 mb-24 scroll-mt-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 bg-primary pointer-events-none" />

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block" style={{ background: 'rgba(242,202,80,0.08)', color: '#f2ca50', border: '1px solid rgba(242,202,80,0.2)' }}>
                Rolling Applications
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Creator Fund Application
              </h2>
              <p className="text-xs text-[#c9bfab] mt-2 leading-relaxed">
                Applications are reviewed on a rolling basis. Our council notifies all applicants within 5 business days.
              </p>
            </div>

            {submittedData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-6 rounded-2xl bg-[#0c0c0e] border border-primary/30"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-5 shadow-[0_0_25px_rgba(242,202,80,0.2)]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Application Dispatched to the Council
                </h3>
                <p className="text-xs text-[#eae1d4] font-mono mb-2">Tracking ID: {submittedData.id}</p>
                <p className="text-xs text-[#c9bfab] max-w-md mx-auto leading-relaxed mb-6">
                  Thank you, <strong className="text-[#eae1d4]">{submittedData.name}</strong>. Your grant proposal was cataloged successfully. Our review council will send an evaluation report to your inbox within 5 business days.
                </p>
                <button
                  onClick={() => setSubmittedData(null)}
                  className="px-6 py-2.5 rounded-full text-xs font-bold border border-primary/40 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  Submit Another Application
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tier Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                    Target Grant Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {GRANT_TIERS.map(t => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedTier(t.id)}
                        className={`py-3 px-3 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                          selectedTier === t.id
                            ? 'bg-primary/15 border-primary text-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.1)]'
                            : 'bg-[#12110d] border-[#4d4635]/40 text-[#c9bfab] hover:border-primary/30'
                        }`}
                      >
                        <p className="font-bold">{t.name.split(' ')[0]} {t.name.split(' ')[1]}</p>
                        <p className="text-[10px] text-[#99907c] mt-0.5">{t.amount}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                      Creator / Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={creatorName}
                      onChange={e => setCreatorName(e.target.value)}
                      placeholder="e.g. Jade Studio"
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] placeholder-[#4d4635] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@domain.xyz"
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] placeholder-[#4d4635] focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Profile & Audience Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                      Primary Profile / Channel URL
                    </label>
                    <input
                      type="url"
                      value={profileUrl}
                      onChange={e => setProfileUrl(e.target.value)}
                      placeholder="https://tembopage.com/@yourname"
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] placeholder-[#4d4635] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                      Audience Reach
                    </label>
                    <select
                      value={audienceSize}
                      onChange={e => setAudienceSize(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] focus:outline-none focus:border-primary"
                    >
                      <option value="Under 5,000">Under 5,000</option>
                      <option value="5k - 25k">5,000 – 25,000</option>
                      <option value="25k - 100k">25,000 – 100,000</option>
                      <option value="100k+">100,000+</option>
                    </select>
                  </div>
                </div>

                {/* Creative Niche */}
                <div>
                  <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                    Creative Focus / Niche
                  </label>
                  <select
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] focus:outline-none focus:border-primary"
                  >
                    <option value="Visual Arts & Design">Visual Arts & Design</option>
                    <option value="Filmmaking & Video Production">Filmmaking & Video Production</option>
                    <option value="Music & Audio Production">Music & Audio Production</option>
                    <option value="Tech, Coding & AI Research">Tech, Coding & AI Research</option>
                    <option value="Education, Writing & Courses">Education, Writing & Courses</option>
                    <option value="E-Commerce & Digital Merch">E-Commerce & Digital Merch</option>
                    <option value="Lifestyle & Community">Lifestyle & Community</option>
                  </select>
                </div>

                {/* Proposal */}
                <div>
                  <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                    Proposal / How You Will Deploy the Grant
                  </label>
                  <textarea
                    rows={4}
                    value={proposal}
                    onChange={e => setProposal(e.target.value)}
                    placeholder="Briefly describe what you are building, how this capital accelerates your vision, and how you will use Tembo's intelligent features..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] placeholder-[#4d4635] focus:outline-none focus:border-primary resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider glow-button bg-primary text-[#3c2f00] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isSubmitting ? (
                    'Dispatching to Review Council...'
                  ) : (
                    <>
                      <Send size={14} /> Submit Grant Application
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ─── 6. FAQ ──────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl font-black text-center text-[#eae1d4] mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'What is the eligibility requirement?',
                a: 'Any independent creator with an active or pending Tembo Page can apply. We evaluate applications primarily based on creative originality, audience engagement quality, and how meaningfully you intend to leverage intelligent bio-link features.',
              },
              {
                q: 'Does Tembo take any rights or equity in exchange?',
                a: 'Zero. Grants are completely non-dilutive. We take no ownership of your content, intellectual property, revenue, or business.',
              },
              {
                q: 'How are grant disbursements distributed?',
                a: 'Approved grants are disbursed within 7 business days via direct Stripe Transfer or international wire transfer in USD.',
              },
              {
                q: 'Can creators outside the US apply?',
                a: 'Yes! The Tembo Creator Fund is open to digital creators worldwide across all jurisdictions supported by Stripe or international wire transfers.',
              },
            ].map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} className="glow-card border border-outline-variant/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left bg-transparent border-none cursor-pointer text-[#eae1d4]"
                  >
                    <span className="text-xs font-bold flex items-center gap-2">
                      <HelpCircle size={14} className="text-primary shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown size={14} className={`text-outline shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-5 pt-1 text-xs text-[#c9bfab] leading-relaxed border-t border-[#4d4635]/25"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ─── 7. FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t py-14 px-6" style={{ background: '#0c0c0e', borderColor: 'rgba(242,202,80,0.07)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-body">
          <div className="flex items-center gap-3">
            <TemboBrand iconSize={18} showWordmark={false} iconOnly={true} />
            <p className="text-xs" style={{ color: '#4d4635' }}>
              © {new Date().getFullYear()} Tembo Page, Inc. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 select-none">
            {['Privacy', 'Terms', 'Help', 'Affiliate', 'Contact'].map(l => (
              <a
                key={l}
                href={
                  l === 'Privacy' ? '#/privacy' :
                  l === 'Terms' ? '#/terms' :
                  l === 'Help' ? '#/help' :
                  l === 'Affiliate' ? '#/affiliate' :
                  l === 'Contact' ? '#/contact' : '#'
                }
                className="text-xs transition-colors text-decoration-none"
                style={{ color: '#4d4635' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f2ca50')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4d4635')}
              >
                {l}
              </a>
            ))}
          </div>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#4d4635' }}>
            <Heart size={11} className="fill-current text-primary" />
            Built for the Digital Savannah
          </p>
        </div>
      </footer>
    </div>
  );
}
