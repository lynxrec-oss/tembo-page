/**
 * TEMBO PAGE — Become an Affiliate Program Center
 * 
 * Styled under the Savannah Sunset design system.
 * Includes interactive referral bounty simulators, structured safari path steps,
 * dedicated partner application flow with instant referral code generation,
 * accordion FAQ sections, and double-glowing conversion call-to-actions.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, DollarSign, Gift, ArrowRight, ShieldCheck, Check, 
  HelpCircle, ChevronDown, ChevronRight, Menu, X, Target, Heart,
  Send, CheckCircle2, Copy
} from 'lucide-react';
import { TemboBrand } from './TemboBrand';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AffiliatePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Commission simulator target count state
  const [referralCount, setReferralCount] = useState<10 | 50 | 100 | 500>(50);

  // Application form states
  const [partnerName, setPartnerName] = useState('');
  const [email, setEmail] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [audienceSize, setAudienceSize] = useState('5k - 25k');
  const [payoutMethod, setPayoutMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [strategy, setStrategy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPartner, setSubmittedPartner] = useState<{ code: string; name: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => (prev === index ? null : index));
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    const cleanSlug = partnerName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'PARTNER';
    const code = `TEMBO-${cleanSlug}-${Math.floor(100 + Math.random() * 900)}`;

    const partnerPayload = {
      referralCode: code,
      partnerName: partnerName.trim(),
      email: email.trim().toLowerCase(),
      channelUrl: channelUrl.trim() || '',
      audienceSize,
      payoutMethod,
      strategy: strategy.trim() || 'Direct channel promotion',
      status: 'active',
      submittedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'affiliate_applications', code), partnerPayload);
      setSubmittedPartner({ code, name: partnerName.trim() });
    } catch (err) {
      console.error('Error saving affiliate application to Firestore:', err);
      // Fallback: still show code to user if offline
      setSubmittedPartner({ code, name: partnerName.trim() });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!submittedPartner) return;
    navigator.clipboard.writeText(`https://tembopage.com/?ref=${submittedPartner.code}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Commission rates mapping
  const bountyMetrics = {
    10:  { monthly: '$57',   annual: '$684',   bonus: 'Free Creator Pro access' },
    50:  { monthly: '$285',  annual: '$3,420',  bonus: 'Priority payouts + free Growth plan' },
    100: { monthly: '$570',  annual: '$6,840',  bonus: 'Featured partner spotlight + swag pack' },
    500: { monthly: '$2,850', annual: '$34,200', bonus: 'Exclusive 35% commission bump + dedicated support' }
  };

  const currentMetrics = bountyMetrics[referralCount];

  return (
    <div 
      className="relative min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden" 
      style={{ background: '#0c0c0e', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Noise overlay and lighting grids */}
      <div className="fixed inset-0 noise-texture z-[99] pointer-events-none opacity-25" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.04] bg-primary pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.03] bg-primary pointer-events-none z-0" />

      {/* Tailwind and Custom Styling injects */}
      <style dangerouslySetInnerHTML={{__html: `
        .text-gradient-gold {
          background: linear-gradient(135deg, #f2ca50 0%, #ffe088 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glow-card {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), inset 1px 1px 0px rgba(242, 202, 80, 0.06);
          background: #16130b;
        }
        .glow-card:hover {
          box-shadow: 0 8px 40px rgba(242, 202, 80, 0.08), inset 1px 1px 0px rgba(242, 202, 80, 0.15);
          border-color: rgba(242, 202, 80, 0.25) !important;
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

      {/* Header NavBar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-primary/5 bg-[#0c0c0e]/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <a href="#/" className="flex items-center text-decoration-none">
            <TemboBrand iconSize={38} showWordmark={true} />
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-body">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors text-decoration-none" style={{ color: '#c9bfab' }}>Features</a>
            <a href="#showcase" className="text-sm font-medium hover:text-primary transition-colors text-decoration-none" style={{ color: '#c9bfab' }}>Showcase</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors text-decoration-none" style={{ color: '#c9bfab' }}>Pricing</a>
            <a href="#/about" className="text-sm font-medium hover:text-primary transition-colors text-decoration-none" style={{ color: '#c9bfab' }}>About</a>
            <a href="#/fund" className="text-sm font-medium hover:text-primary transition-colors text-decoration-none" style={{ color: '#c9bfab' }}>Creator Fund</a>
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {localStorage.getItem('has_active_session') === 'true' ? (
              <a href="#/dashboard" className="glow-button bg-primary text-[#3c2f00] text-sm font-bold px-5 py-2.5 rounded-full text-decoration-none">Go to Dashboard</a>
            ) : (
              <>
                <a href="#/login" className="text-sm font-medium px-4 py-2 hover:text-primary transition-colors text-decoration-none" style={{ color: '#eae1d4' }}>Log In</a>
                <a href="#apply" className="glow-button bg-primary text-[#3c2f00] text-sm font-bold px-5 py-2.5 rounded-full text-decoration-none">Join the Herd</a>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown menu */}
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
                <a href="#features" className="text-base font-medium text-decoration-none" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(false)}>Features</a>
                <a href="#showcase" className="text-base font-medium text-decoration-none" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(false)}>Showcase</a>
                <a href="#pricing" className="text-base font-medium text-decoration-none" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(false)}>Pricing</a>
                <a href="#/about" className="text-base font-medium text-decoration-none" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(false)}>About</a>
                <a href="#/fund" className="text-base font-medium text-decoration-none" style={{ color: '#eae1d4' }} onClick={() => setMobileOpen(false)}>Creator Fund</a>
                <div className="pt-2 flex flex-col gap-3">
                  <a href="#/login" className="w-full text-center text-sm font-medium py-2.5 rounded-full border text-decoration-none" style={{ color: '#eae1d4', borderColor: '#4d4635' }}>Log In</a>
                  <a href="#apply" className="w-full text-center text-sm font-bold py-2.5 rounded-full glow-button bg-primary text-[#3c2f00] text-decoration-none" onClick={() => setMobileOpen(false)}>Join the Herd</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-16 relative z-10 font-body">

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-20 select-none">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <Users size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-[#eae1d4] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Join the Herd. <br />
            <span className="text-gradient-gold">Earn Recurring Bounty.</span>
          </h1>
          <p className="text-xs md:text-sm text-[#c9bfab] leading-relaxed max-w-2xl mx-auto">
            Help fellow creators, agencies, and brands secure custom domain link waterholes in the digital savannah. Earn **30% lifetime recurring commissions** on every active referral, paid directly to your account.
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <a href="#apply" className="glow-button bg-primary text-[#3c2f00] px-8 py-4 rounded-full font-display font-bold text-xs uppercase tracking-wider text-decoration-none flex items-center gap-2">
              Apply to Become an Affiliate Partner <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* Highlight Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: <DollarSign size={22} />, title: '30% Lifetime Commish', desc: 'No commission caps. Keep earning as long as your referred herd member stays active on any paid plan.' },
            { icon: <Target size={22} />, title: '60-Day Tracking Cookie', desc: 'Extended tracking windows. If your referred user visits Tembo Page and upgrades within 60 days, bounty is yours.' },
            { icon: <Gift size={22} />, title: 'Partner Herd Bonuses', desc: 'Unlock complimentary premium Creator Pro access, exclusive partner swag, and higher tier payouts as you scale.' }
          ].map((item, idx) => (
            <div key={idx} className="glow-card border border-outline-variant/30 rounded-xl p-8 relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shrink-0">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-[#eae1d4] mb-2 uppercase tracking-wide">{item.title}</h3>
              <p className="text-xs text-[#c9bfab] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Interactive Earnings Simulator */}
        <section className="glow-card border border-outline-variant/20 rounded-2xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 noise-texture opacity-30 pointer-events-none" />
          <div className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl opacity-5 bg-primary pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left selector */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-xl md:text-2xl font-display font-bold text-[#eae1d4] uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Bounty Earnings Simulator
              </h2>
              <p className="text-xs text-[#c9bfab] leading-relaxed">
                Estimate your monthly and annual recurring referrals payout. Click on a herd size below to see your potential gains:
              </p>

              {/* Referral Pill Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {[10, 50, 100, 500].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setReferralCount(count as any)}
                    className={`px-5 py-3 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                      referralCount === count
                        ? 'bg-primary text-[#3c2f00] border-primary shadow-[0_0_15px_rgba(242,202,80,0.15)]'
                        : 'bg-[#12110d] border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-primary/20'
                    }`}
                  >
                    {count} Referred Herds
                  </button>
                ))}
              </div>
            </div>

            {/* Right Display Card */}
            <div className="lg:col-span-6">
              <div className="p-6 bg-[#0c0c0e] rounded-xl border border-primary/20 flex flex-col justify-between h-full relative">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline border-b border-[#4d4635]/30 pb-3">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Estimated Monthly Payout</span>
                    <span className="text-2xl md:text-3xl font-display font-black text-primary">{currentMetrics.monthly}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-[#4d4635]/30 pb-3">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Estimated Annual Payout</span>
                    <span className="text-2xl md:text-3xl font-display font-black text-[#eae1d4]">{currentMetrics.annual}</span>
                  </div>
                  <div className="pt-2 flex items-start gap-2.5">
                    <Check size={12} className="text-[#6fe692] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-bold text-outline uppercase tracking-wider">Tier Unlock Bonus</h4>
                      <p className="text-[11px] text-[#c9bfab] mt-0.5">{currentMetrics.bonus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Referral Path Steps */}
        <section className="mb-20">
          <h2 className="text-xl md:text-2xl font-display font-bold text-center text-[#eae1d4] uppercase mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            The Safari Referral Pathway
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: '01', title: 'Claim Unique Link', desc: 'Sign up to the affiliate program and secure your custom tracking links in less than 2 minutes.' },
              { step: '02', title: 'Share across the Savannah', desc: 'Promote Tembo Page inside your newsletters, blogs, bio links, or client consulting projects.' },
              { step: '03', title: 'Earn Lifetime Recurring Payouts', desc: 'Track your commissions transparently and cash out payouts net-30 directly into your PayPal/Stripe.' }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center px-4">
                <span className="font-display font-black text-4xl text-[#f2ca50]/15 mb-3 select-none">{step.step}</span>
                <h4 className="text-sm font-bold text-[#eae1d4] mb-2 uppercase tracking-wide">{step.title}</h4>
                <p className="text-xs text-[#c9bfab] leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── DEDICATED PARTNER APPLICATION FORM ──────────────────── */}
        <section id="apply" className="glow-card border border-outline-variant/30 rounded-2xl p-8 md:p-12 mb-20 scroll-mt-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-52 h-52 rounded-full blur-3xl opacity-10 bg-primary pointer-events-none" />

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block" style={{ background: 'rgba(242,202,80,0.08)', color: '#f2ca50', border: '1px solid rgba(242,202,80,0.2)' }}>
                Official Partner Intake
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Apply for Affiliate Partnership
              </h2>
              <p className="text-xs text-[#c9bfab] mt-2 leading-relaxed">
                Join our network of ambassadors, agencies, and creator educators. Approved partners receive 30% lifetime revenue share.
              </p>
            </div>

            {submittedPartner ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-6 rounded-2xl bg-[#0c0c0e] border border-primary/30"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-5 shadow-[0_0_25px_rgba(242,202,80,0.2)]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Welcome to the Herd Partner Network!
                </h3>
                <p className="text-xs text-[#c9bfab] max-w-md mx-auto leading-relaxed mb-6">
                  Congratulations, <strong className="text-[#eae1d4]">{submittedPartner.name}</strong>. Your partner account has been provisioned. Use your personalized tracking link below:
                </p>

                {/* Tracking Link Bar */}
                <div className="flex items-center gap-2 max-w-md mx-auto p-2 rounded-xl bg-[#16130b] border border-primary/30 mb-6">
                  <input
                    type="text"
                    readOnly
                    value={`https://tembopage.com/?ref=${submittedPartner.code}`}
                    className="flex-1 bg-transparent border-none text-xs text-[#f2ca50] font-mono px-2 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2 rounded-lg bg-primary text-[#3c2f00] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                    {copiedCode ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>

                <div className="flex justify-center gap-4">
                  <a
                    href="#/dashboard"
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-primary text-[#3c2f00] text-decoration-none glow-button"
                  >
                    Go to Partner Dashboard
                  </a>
                  <button
                    onClick={() => setSubmittedPartner(null)}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold border border-[#4d4635] text-[#c9bfab] hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    Register Another Account
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleApply} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                      Your Name / Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={e => setPartnerName(e.target.value)}
                      placeholder="e.g. Maya Lin / Creator Lab"
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] placeholder-[#4d4635] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                      Payout Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="payouts@domain.xyz"
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] placeholder-[#4d4635] focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                      Primary Channel / Social URL
                    </label>
                    <input
                      type="url"
                      value={channelUrl}
                      onChange={e => setChannelUrl(e.target.value)}
                      placeholder="https://youtube.com/@channel"
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] placeholder-[#4d4635] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                      Audience Size
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

                <div>
                  <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                    Preferred Payout Provider
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('stripe')}
                      className={`py-3 px-4 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        payoutMethod === 'stripe'
                          ? 'bg-primary/15 border-primary text-[#f2ca50]'
                          : 'bg-[#0c0c0e] border-[#4d4635] text-[#c9bfab]'
                      }`}
                    >
                      Stripe Direct Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('paypal')}
                      className={`py-3 px-4 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        payoutMethod === 'paypal'
                          ? 'bg-primary/15 border-primary text-[#f2ca50]'
                          : 'bg-[#0c0c0e] border-[#4d4635] text-[#c9bfab]'
                      }`}
                    >
                      PayPal Express
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#c9bfab] mb-2 uppercase tracking-wide">
                    How do you plan to promote Tembo?
                  </label>
                  <textarea
                    rows={3}
                    value={strategy}
                    onChange={e => setStrategy(e.target.value)}
                    placeholder="e.g. YouTube tutorial series, bio link review, agency client recommendations..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-[#4d4635] text-xs text-[#eae1d4] placeholder-[#4d4635] focus:outline-none focus:border-primary resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider glow-button bg-primary text-[#3c2f00] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isSubmitting ? (
                    'Registering Partner Coordinates...'
                  ) : (
                    <>
                      <Send size={14} /> Submit Affiliate Application & Get Tracking Link
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Affiliate FAQ Accordion Drawer */}
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-xl md:text-2xl font-display font-bold text-center text-[#eae1d4] uppercase mb-10" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Affiliate Program FAQ
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'How does commission tracking work?',
                a: 'When a visitor clicks your affiliate link, a 60-day tracking cookie is safely saved to their browser. If they upgrade to any premium tier (Creator, Pro, Growth) within those 60 days, the commission is locked to your payout list automatically.'
              },
              {
                q: 'When and how do I receive payouts?',
                a: 'Affiliate payouts are distributed monthly on a Net-30 schedule. Once your locked recurring commission exceeds $50, payouts are safely wired to your account via PayPal or direct Stripe Transfer.'
              },
              {
                q: 'Can I refer my own links or accounts?',
                a: 'No. Self-referrals are strictly prohibited to secure the platform’s referral system integrity. Purchasing plans through your own tracking link will disqualify commissions and suspend your affiliate coordinates.'
              },
              {
                q: 'Are promotional materials provided?',
                a: 'Yes! Upon joining the herd affiliate list, you get immediate access to our partner asset bank, containing sunset logos, high-resolution device mockup screens, email templates, and savannah-branded marketing cards.'
              }
            ].map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div 
                  key={i} 
                  className="glow-card border border-outline-variant/30 rounded-xl overflow-hidden transition-all duration-200"
                >
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

      {/* Footer */}
      <footer className="border-t py-14 px-6" style={{ background: '#0c0c0e', borderColor: 'rgba(242,202,80,0.07)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-body">
          <div className="flex items-center gap-3">
            <TemboBrand iconSize={18} showWordmark={false} iconOnly={true} />
            <p className="text-xs" style={{ color: '#4d4635' }}>
              © {new Date().getFullYear()} Tembo Page, Inc. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 select-none">
            {['Privacy', 'Terms', 'Help', 'Creator Fund', 'Contact'].map(l => (
              <a
                key={l}
                href={
                  l === 'Privacy' ? '#/privacy' :
                  l === 'Terms' ? '#/terms' :
                  l === 'Help' ? '#/help' :
                  l === 'Creator Fund' ? '#/fund' :
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
