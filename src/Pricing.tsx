/**
 * TEMBO PAGE — Dedicated Pricing & Comparison Center
 * 
 * Includes Monthly vs Annual billing toggle, bento plan cards,
 * interactive checkout simulator, responsive feature matrix table,
 * and smart Cta routing pathways.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, ArrowRight, X, Sparkles, CreditCard, Mail, 
  CheckCircle2, Compass, Shield, Zap, ChevronRight, Menu, RefreshCw
} from 'lucide-react';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { 
  PRICING_PLANS, 
  ANNUAL_DISCOUNT_PERCENT, 
  ANNUAL_DISCOUNT_LABEL, 
  CURRENT_YEAR, 
  AGENCY_PLAN 
} from './config/siteConfig';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Interactive checkout modal state
  const [activePlanModal, setActivePlanModal] = useState<string | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const plans = PRICING_PLANS;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail.trim()) return;

    setIsProcessingCheckout(true);
    try {
      const createCheckoutSession = httpsCallable(functions, 'createStripeCheckoutSession');
      const response = await createCheckoutSession({
        creatorId: localStorage.getItem('active_creator_id') || 'mycinetoolbox', 
        planId: activePlanModal?.toLowerCase(),
        isAnnual: isAnnual
      });

      const { url } = response.data as { url: string };
      if (url) {
        window.location.href = url; 
      } else {
        throw new Error('Stripe checkout url not resolved.');
      }
    } catch (err: any) {
      console.error('Stripe Checkout Error:', err);
      triggerToast(err.message || 'An error occurred during Stripe checkout routing.', 'info');
      setIsProcessingCheckout(false);
    }
  };

  const handleModalClose = () => {
    setActivePlanModal(null);
    setCheckoutSuccess(false);
    setCheckoutEmail('');
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col justify-start font-body"
      style={{ background: '#16130b', color: '#eae1d4' }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[100] px-6 py-3 rounded-full border text-xs font-semibold shadow-2xl flex items-center gap-2.5"
            style={{
              background: 'rgba(22,19,11,0.95)',
              borderColor: toast.type === 'success' ? '#6fe692' : '#f2ca50',
              color: '#eae1d4',
              backdropFilter: 'blur(8px)'
            }}
          >
            <CheckCircle2 size={14} className={toast.type === 'success' ? 'text-[#6fe692]' : 'text-primary'} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background gradients and tactical dots texture */}
      <div className="fixed inset-0 noise-texture z-0 pointer-events-none opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.03] pointer-events-none bg-primary" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.02] pointer-events-none bg-primary" />

      {/* Styled Grid Inject (isolated classes) */}
      <style dangerouslySetInnerHTML={{__html: `
        .texture-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: -1; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f2ca50' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E");
        }
        .glass-card {
          background-color: #121212;
          border-top: 1px solid rgba(242, 202, 80, 0.1);
          border-left: 1px solid rgba(242, 202, 80, 0.1);
          border-right: 1px solid rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
        }
        .glow-popular {
          box-shadow: 0 0 40px rgba(242, 202, 80, 0.08);
          border: 1px solid rgba(242, 202, 80, 0.3) !important;
        }
        .text-gradient-gold {
          background: linear-gradient(135deg, #f2ca50 0%, #ffe088 50%, #e9c349 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}} />
      <div className="texture-overlay"></div>

      {/* Top Navigation Bar (Replicates HTML exactly) */}
      <nav className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl sticky top-0 z-50 border-b border-primary/10 shadow-[0_4px_20px_-2px_rgba(242,202,80,0.08)]">
        <div className="flex justify-between items-center w-full px-8 h-20 max-w-7xl mx-auto font-body">
          
          {/* Brand logo */}
          <a href="#/" className="flex items-center gap-2 text-decoration-none">
            <span className="material-symbols-outlined text-primary text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            <span className="font-display font-black text-lg tracking-tighter text-primary">TEMBO PAGE</span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a className="text-on-surface-variant font-semibold text-xs hover:text-primary transition-colors duration-300 uppercase tracking-widest text-decoration-none" href="#features">Features</a>
            <a className="text-on-surface-variant font-semibold text-xs hover:text-primary transition-colors duration-300 uppercase tracking-widest text-decoration-none" href="#showcase">Showcase</a>
            <a className="text-primary border-b-2 border-primary pb-1 font-semibold text-xs hover:text-primary transition-colors duration-300 uppercase tracking-widest text-decoration-none drop-shadow-[0_0_8px_rgba(242,202,80,0.5)]" href="#/pricing">Pricing</a>
            <a className="text-on-surface-variant font-semibold text-xs hover:text-primary transition-colors duration-300 uppercase tracking-widest text-decoration-none" href="#/about">About</a>
            <a className="text-on-surface-variant font-semibold text-xs hover:text-primary transition-colors duration-300 uppercase tracking-widest text-decoration-none" href="#/fund">Creator Fund</a>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => window.location.hash = '#/login'} className="text-on-surface font-display font-bold text-xs uppercase tracking-wider hover:text-primary transition-colors px-4 py-2 cursor-pointer bg-transparent border-none">
              Log In
            </button>
            <button onClick={() => window.location.hash = '#/onboarding'} className="bg-primary text-on-primary font-display font-bold text-xs px-6 py-3 rounded-full hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(242,202,80,0.2)] transition-all duration-300 uppercase tracking-wider cursor-pointer">
              Join Tembo
            </button>
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden text-primary cursor-pointer bg-transparent border-none">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Main Canvas Area */}
      <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-6 md:px-10 py-16 gap-12 relative z-10">
        
        {/* Hero Section */}
        <header className="text-center max-w-3xl flex flex-col gap-5 mt-6 select-none">
          <h1 className="font-display font-bold text-[36px] md:text-[56px] leading-tight text-on-surface tracking-tight">
            Scale Your <span className="text-gradient-gold">Digital Savannah</span>.
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Simple, transparent pricing for creators and agencies ready to lead their pack. Choose the plan that fits your journey.
          </p>

          {/* Toggle switcher monthly vs annual */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs font-bold font-body transition-colors duration-300 ${!isAnnual ? 'text-primary' : 'text-outline'}`}>
              Monthly billing
            </span>
            <button 
              onClick={() => setIsAnnual(prev => !prev)}
              className="w-12 h-6 rounded-full relative cursor-pointer border transition-colors bg-surface-container-high border-outline-variant/50"
            >
              <motion.div
                animate={{ left: isAnnual ? 'auto' : 3, right: isAnnual ? 3 : 'auto' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-4 h-4 rounded-full absolute top-0.5 bg-[#f2ca50]"
              />
            </button>
            <span className={`text-xs font-bold font-body transition-colors duration-300 flex items-center gap-1.5 ${isAnnual ? 'text-primary' : 'text-outline'}`}>
              Annual Saving ({ANNUAL_DISCOUNT_PERCENT}%)
              <span className="px-2 py-0.5 rounded text-[8px] font-black bg-tertiary/10 border border-tertiary/20 text-tertiary uppercase">
                Save
              </span>
            </span>
          </div>
        </header>

        {/* Pricing Cards Grid (Replicates HTML exactly with dynamic pricing states!) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6">
          {plans.map(plan => {
            const planPrice = isAnnual ? (plan.annualPrice > 0 ? plan.annualPrice : 0) : plan.monthlyPrice;
            return (
              <div 
                key={plan.id}
                className={`glass-card rounded-xl p-8 flex flex-col gap-6 relative group hover:-translate-y-2 transition-transform duration-300 ${
                  plan.popular ? 'glow-popular lg:-translate-y-3 hover:-translate-y-5 bg-surface-container-high/80 z-10' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-primary text-[#3c2f00] font-display font-black text-[9px] uppercase tracking-wider px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(242,202,80,0.4)]">
                    Most Popular
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <h3 className={`font-headline font-bold text-lg ${plan.popular ? 'text-primary' : 'text-on-surface'}`}>
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="font-display font-bold text-3xl text-on-surface">${planPrice}</span>
                    <span className="text-xs text-on-surface-variant font-semibold">/mo</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2 font-body">
                    {plan.subtitle}
                  </p>
                </div>

                <hr className="border-outline-variant/30" />

                <ul className="flex flex-col gap-4 text-xs text-on-surface-variant font-body flex-grow">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check size={12} className="text-primary flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    if (plan.id === 'free') {
                      window.location.hash = '#/onboarding';
                    } else {
                      setActivePlanModal(plan.name);
                    }
                  }}
                  className={`w-full py-3 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-colors mt-6 cursor-pointer border ${
                    plan.popular
                      ? 'bg-primary text-[#3c2f00] border-transparent hover:shadow-[0_8px_20px_rgba(242,202,80,0.3)]'
                      : 'border-outline text-on-surface hover:border-primary hover:text-primary bg-transparent'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </section>

        {/* Agency Info Banner */}
        <section className="w-full mt-6 max-w-4xl mx-auto glass-card rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 noise-texture opacity-25" />
          <div className="flex flex-col gap-1.5 relative z-10 text-center md:text-left">
            <h4 className="font-display font-bold text-lg text-on-surface uppercase tracking-wider">Agency Herd</h4>
            <p className="text-xs text-on-surface-variant font-body">
              Need to manage multiple creator profiles, A/B variant branches, and team accesses? Plans start at $99/mo.
            </p>
          </div>
          <button 
            onClick={() => triggerToast('Sales contact initiated! A herd coordinator will email you shortly.', 'success')}
            className="py-3 px-8 rounded-full border border-primary text-primary font-display font-bold text-xs uppercase tracking-wider hover:bg-primary/10 transition-colors whitespace-nowrap cursor-pointer z-10 bg-transparent"
          >
            Contact Sales
          </button>
        </section>

        {/* Comparison Feature Table */}
        <section className="w-full mt-12 max-w-4xl mx-auto flex flex-col gap-8 select-none font-body">
          <h2 className="font-display font-bold text-2xl text-center text-on-surface tracking-tight uppercase">Compare Features</h2>
          
          <div className="overflow-x-auto w-full glass-card rounded-xl p-6 border border-outline-variant/30 bg-surface-container-low/40">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-xs font-bold uppercase text-outline">
                  <th className="p-4 w-1/3">Feature Matrix</th>
                  <th className="p-4 text-center">Free</th>
                  <th className="p-4 text-center">Creator</th>
                  <th className="p-4 text-center text-primary">Creator Pro</th>
                  <th className="p-4 text-center">Growth</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  { name: 'Custom Domain Mapping', free: '-', creator: '-', pro: 'check', growth: 'check' },
                  { name: 'Smart Pixel Analytics', free: '-', creator: 'Basic', pro: 'Advanced', growth: 'Advanced' },
                  { name: 'AI Optimization Insights', free: '-', creator: '-', pro: 'Basic', growth: 'Full' },
                  { name: 'Priority Support Level', free: '-', creator: '-', pro: 'Email Support', growth: '24/7 Priority' }
                ].map((row, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-outline-variant/10 hover:bg-surface-variant/20 transition-all font-body"
                  >
                    <td className="p-4 font-bold text-on-surface">{row.name}</td>
                    <td className="p-4 text-center text-on-surface-variant font-semibold">
                      {row.free === 'check' ? <Check className="mx-auto text-primary" size={14} /> : row.free}
                    </td>
                    <td className="p-4 text-center text-on-surface-variant font-semibold">
                      {row.creator === 'check' ? <Check className="mx-auto text-primary" size={14} /> : row.creator}
                    </td>
                    <td className="p-4 text-center text-primary font-bold">
                      {row.pro === 'check' ? <Check className="mx-auto text-primary" size={14} /> : row.pro}
                    </td>
                    <td className="p-4 text-center text-on-surface-variant font-semibold">
                      {row.growth === 'check' ? <Check className="mx-auto text-primary" size={14} /> : row.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Checkout Simulator Modal */}
      <AnimatePresence>
        {activePlanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleModalClose}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#1f1b13] border border-primary/30 rounded-2xl p-6 shadow-2xl z-10 font-body"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3 mb-5 select-none">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-primary animate-pulse" size={16} />
                  <span className="font-display font-bold text-xs uppercase tracking-wider">Stake Premium Hub</span>
                </div>
                <button onClick={handleModalClose} className="text-outline hover:text-white cursor-pointer bg-transparent border-none">
                  <X size={16} />
                </button>
              </div>

              {checkoutSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary shadow-[0_0_20px_rgba(242,202,80,0.15)]">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-display font-bold text-lg text-primary mb-2">Checkout Successful!</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto mb-6">
                    Congratulations! Plan <strong>{activePlanModal}</strong> is active. Your creator dashboard is upgraded, and receipt sent to <strong>{checkoutEmail}</strong>.
                  </p>
                  <button 
                    onClick={() => {
                      handleModalClose();
                      window.location.hash = '#/dashboard';
                    }}
                    className="w-full py-3 rounded-lg bg-primary text-on-primary font-display font-bold text-xs uppercase tracking-wider hover:bg-primary-fixed transition-all cursor-pointer shadow-[0_4px_16px_rgba(242,202,80,0.2)]"
                  >
                    Enter Creator Console
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/20 select-none">
                    <h5 className="text-[10px] font-bold text-outline uppercase tracking-wider">SELECTED PLAN</h5>
                    <p className="text-sm font-bold text-primary mt-0.5">{activePlanModal}</p>
                    <p className="text-[10px] text-on-surface-variant mt-1">
                      Billing cycle: {isAnnual ? 'Annually (20% Savings applied)' : 'Monthly'}
                    </p>
                  </div>

                  {/* Input Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5">EMAIL ADDRESS</label>
                    <div className="flex rounded-lg overflow-hidden border border-outline-variant/30 bg-[#080808]">
                      <span className="px-3 py-3 border-r border-outline-variant/30 bg-surface-container-low text-outline flex items-center shrink-0">
                        <Mail size={12} />
                      </span>
                      <input 
                        required
                        type="email" 
                        placeholder="your@brand.com"
                        value={checkoutEmail}
                        onChange={e => setCheckoutEmail(e.target.value)}
                        className="flex-grow text-xs p-3 outline-none text-[#eae1d4] bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Card Details Mock */}
                  <div>
                    <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5">CREDIT CARD DETAILS</label>
                    <div className="flex rounded-lg overflow-hidden border border-outline-variant/30 bg-[#080808]">
                      <span className="px-3 py-3 border-r border-outline-variant/30 bg-surface-container-low text-outline flex items-center shrink-0">
                        <CreditCard size={12} />
                      </span>
                      <input 
                        required
                        type="text" 
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        className="flex-grow text-xs p-3 outline-none text-[#eae1d4] bg-transparent"
                      />
                    </div>
                  </div>

                  {/* CVV & EXP */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5">EXPIRATION</label>
                      <input 
                        required
                        type="text" 
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full text-xs p-3 rounded-lg border border-outline-variant/30 outline-none text-[#eae1d4] bg-[#0c0a06]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5">CVV CODE</label>
                      <input 
                        required
                        type="password" 
                        placeholder="***"
                        maxLength={3}
                        className="w-full text-xs p-3 rounded-lg border border-outline-variant/30 outline-none text-[#eae1d4] bg-[#0c0a06]"
                      />
                    </div>
                  </div>

                  {/* Secure note */}
                  <div className="flex items-center gap-1.5 text-[9px] text-outline font-semibold select-none">
                    <Shield size={10} className="text-[#6fe692]" /> SSL Secure 256-bit encrypted checkout parameters
                  </div>

                  {/* Submit checkout */}
                  <button 
                    type="submit"
                    disabled={isProcessingCheckout || !checkoutEmail.trim()}
                    className="w-full py-3.5 rounded-lg bg-primary text-on-primary font-display font-bold text-xs uppercase tracking-wider hover:bg-primary-fixed transition-all cursor-pointer disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_4px_16px_rgba(242,202,80,0.25)]"
                  >
                    {isProcessingCheckout ? <RefreshCw className="animate-spin" size={12} /> : null}
                    {isProcessingCheckout ? 'Processing Order...' : 'Activate Premium Membership'}
                  </button>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unified Footer */}
      <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant/20 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 w-full max-w-7xl mx-auto gap-6 md:gap-0 font-body">
          <div className="flex items-center gap-2 select-none">
            <span className="font-display font-black text-on-surface tracking-tighter uppercase text-sm">TEMBO PAGE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-on-surface-variant font-semibold text-[10px] hover:text-tertiary transition-colors text-decoration-none relative tracking-widest uppercase" href="#/terms">Terms</a>
            <a className="text-on-surface-variant font-semibold text-[10px] hover:text-tertiary transition-colors text-decoration-none relative tracking-widest uppercase" href="#/privacy">Privacy</a>
            <a className="text-on-surface-variant font-semibold text-[10px] hover:text-tertiary transition-colors text-decoration-none relative tracking-widest uppercase" href="#/contact">Contact</a>
            <a className="text-on-surface-variant font-semibold text-[10px] hover:text-tertiary transition-colors text-decoration-none relative tracking-widest uppercase" href="#/affiliate">Become an Affiliate</a>
            <a className="text-on-surface-variant font-semibold text-[10px] hover:text-tertiary transition-colors text-decoration-none relative tracking-widest uppercase" href="#/fund">Creator Fund</a>
          </div>
          <div className="text-[10px] font-semibold text-on-surface-variant text-center md:text-right uppercase tracking-wider select-none">
            © {CURRENT_YEAR} TEMBO PAGE. Built for the Digital Savannah.
          </div>
        </div>
      </footer>
    </div>
  );
}
