/**
 * TEMBO PAGE — 3-Step Premium Onboarding Flow
 * 
 * Step 1: Welcome to the Savannah (Details & Bio claim)
 * Step 2: Stake Your Territory (Connect social link pathways)
 * Step 3: Gather Your Herd (Niche theme selector with live dynamic mockup previews)
 * Complete: Calibrates dashboard access and routes to #/dashboard.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, Check, Sparkles, Instagram, 
  Youtube, Mail, Music, Laptop, Compass, CheckCircle2, RefreshCw,
  Shield, Key, Lock, ArrowUpRight
} from 'lucide-react';
import { functions, db } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type NicheTheme = 'sunset' | 'oasis' | 'forest' | 'amber';

export default function Onboarding() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Gate & Paywall States
  const [activeGateTab, setActiveGateTab] = useState<'checkout' | 'owner'>('checkout');
  const [accessKey, setAccessKey] = useState('');
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);
  const [keyError, setKeyError] = useState(false);
  const [keySuccess, setKeySuccess] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<string | null>(null);

  // Step 1: Creator Details state
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Step 2: Social Links state
  const [instagramLink, setInstagramLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [newsletterLink, setNewsletterLink] = useState('');

  // Step 3: Niche & Theme selector
  const [selectedTheme, setSelectedTheme] = useState<NicheTheme>('sunset');

  // Check if owner or paid user already has active session bypass
  useEffect(() => {
    let isOwnerBypass = false;
    let hasActiveSession = false;
    try {
      isOwnerBypass = localStorage.getItem('savannah_bypass') === 'true';
      hasActiveSession = localStorage.getItem('has_active_session') === 'true';
    } catch (e) {
      console.warn("Storage access failed:", e);
    }
    
    if ((window as any).savannahBypass === true) isOwnerBypass = true;
    if ((window as any).hasActiveSession === true) hasActiveSession = true;

    if (isOwnerBypass || hasActiveSession) {
      setStep(1); // Proceed directly to setup if authenticated
    }
  }, []);

  const handlePaywallCheckout = async (planId: string) => {
    setIsProcessingCheckout(planId);
    try {
      const createCheckoutSession = httpsCallable(functions, 'createStripeCheckoutSession');
      const response = await createCheckoutSession({
        creatorId: localStorage.getItem('active_creator_id') || 'mycinetoolbox', 
        planId: planId.toLowerCase(),
        isAnnual: false // default to monthly for direct onboarding checkouts
      });

      const { url } = response.data as { url: string };
      if (url) {
        window.location.href = url; 
      } else {
        throw new Error('Stripe checkout url not resolved.');
      }
    } catch (err: any) {
      console.error('Stripe Checkout Paywall Error:', err);
      alert(err.message || 'An error occurred during Stripe checkout routing.');
      setIsProcessingCheckout(null);
    }
  };

  const handleVerifyOwnerKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) return;

    setIsVerifyingKey(true);
    setKeyError(false);

    try {
      const validateAccessKey = httpsCallable(functions, 'validateAccessKey');
      const response = await validateAccessKey({ accessKey });
      const data = response.data as any;

      if (data && data.valid) {
        setKeySuccess(true);
        const { type, creatorId } = data;

        // Write to memory bypass instantly so App is updated in real-time
        if (type === 'owner') {
          (window as any).savannahBypass = true;
          try {
            localStorage.setItem('savannah_bypass', 'true');
            localStorage.setItem('active_creator_id', creatorId);
          } catch (err) {
            console.warn("Storage write failed:", err);
          }
        } else if (type === 'beta') {
          (window as any).betaBypass = true;
          try {
            localStorage.setItem('beta_bypass', 'true');
            localStorage.setItem('active_creator_id', creatorId);
          } catch (err) {
            console.warn("Storage write failed:", err);
          }
        }

        setTimeout(() => {
          window.location.hash = '#/dashboard';
          setIsVerifyingKey(false);
        }, 800);
      } else {
        setKeyError(true);
        setIsVerifyingKey(false);
      }
    } catch (error) {
      console.error("Key validation error", error);
      setKeyError(true);
      setIsVerifyingKey(false);
    }
  };

  const handleNextStep = async () => {
    if (step < 3) {
      setStep(prev => (prev + 1) as any);
    } else {
      setIsCompleting(true);
      try {
        const creatorId = username.trim().toLowerCase() || localStorage.getItem('active_creator_id') || 'mycinetoolbox';
        const currentActiveId = localStorage.getItem('active_creator_id') || 'elenarust';

        localStorage.setItem('active_creator_id', creatorId);
        localStorage.setItem('savannah_bypass', 'true');

        let initialData = {
          displayName: displayName || 'My Cine Toolbox',
          handle: creatorId,
          bio: bio || 'VFX & unmixing lab.',
          tier: 'Growth',
          videoBlock: { visible: true, title: 'Featured Video', subtitle: 'Watch latest drop', videoUrl: '' }
        };

        // If the user was customizing 'elenarust' before claiming their handle, copy that data!
        if (currentActiveId === 'elenarust' && creatorId !== 'elenarust') {
          try {
            const templateRef = doc(db, 'creators', 'elenarust');
            const templateSnap = await getDoc(templateRef);
            if (templateSnap.exists()) {
              initialData = {
                ...templateSnap.data(),
                ...initialData, // override handle and newly input fields if any
                handle: creatorId
              };
            }
          } catch (e) {
            console.warn("Could not copy starting template:", e);
          }
        }

        await setDoc(doc(db, 'creators', creatorId), initialData, { merge: true });
      } catch (err) {
        console.warn("Could not save onboarding profile:", err);
      }
      setTimeout(() => {
        setIsCompleting(false);
        setSuccessAnimation(true);
      }, 1500);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => (prev - 1) as any);
    } else {
      const isOwnerBypass = localStorage.getItem('savannah_bypass') === 'true';
      const hasActiveSession = localStorage.getItem('has_active_session') === 'true';
      if (isOwnerBypass || hasActiveSession) {
        window.location.hash = '#/';
      } else {
        setStep(0);
      }
    }
  };

  const themeConfig: Record<NicheTheme, { name: string; primary: string; bg: string; text: string; glow: string }> = {
    sunset: { name: 'Savannah Sunset', primary: '#f2ca50', bg: '#16130b', text: '#eae1d4', glow: 'rgba(242, 202, 80, 0.15)' },
    oasis: { name: 'Teal Oasis', primary: '#6fe692', bg: '#081c15', text: '#d8f3dc', glow: 'rgba(111, 230, 146, 0.15)' },
    forest: { name: 'Herd Forest', primary: '#ffe088', bg: '#0c1a1a', text: '#eae1d4', glow: 'rgba(255, 224, 136, 0.15)' },
    amber: { name: 'Sunrise Amber', primary: '#e9c349', bg: '#1f1605', text: '#eae1d4', glow: 'rgba(233, 195, 73, 0.15)' }
  };

  const activeTheme = themeConfig[selectedTheme];

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col justify-start bg-texture font-body"
      style={{ background: '#16130b', color: '#eae1d4' }}
    >
      {/* Background SVG Texture */}
      <style dangerouslySetInnerHTML={{__html: `
        .bg-texture {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23eae1d4' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        .glow-card {
          box-shadow: inset 1px 1px 0px 0px rgba(242, 202, 80, 0.1), 0px 4px 24px -4px rgba(242, 202, 80, 0.05);
        }
        .glow-primary {
          box-shadow: 0px 0px 24px 0px rgba(242, 202, 80, 0.15);
        }
      `}} />

      {/* Progress Bar Section (Matches HTML exactly!) */}
      {step > 0 && (
        <div className="w-full max-w-5xl mx-auto px-6 md:px-10 py-8 pt-12 select-none">
          <div className="flex justify-between items-center mb-4">
            <span className="font-display font-black text-xl text-primary tracking-tighter uppercase">TEMBO PAGE</span>
            <span className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-widest">
              Step {step} of 3
            </span>
          </div>
          <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full glow-primary transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Content Canvas Card */}
      <main className="flex-grow flex items-center justify-center px-6 md:px-10 py-8">
        <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-8 md:p-12 glow-card border border-outline-variant/10 relative overflow-hidden shadow-2xl">
          
          {/* Decorative savanna glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none z-0" />

          {/* Calibrations Celebration overlay when Onboarding is complete! */}
          <AnimatePresence>
            {isCompleting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#16130b] flex flex-col items-center justify-center text-center p-6"
              >
                <RefreshCw size={44} className="text-primary animate-spin mb-4" />
                <h3 className="font-display font-bold text-xl text-[#eae1d4] mb-2">Staking Your Domain...</h3>
                <p className="text-xs text-on-surface-variant max-w-xs leading-normal">
                  Calibrating your tracking engines, setting up HSL color layout profiles, and gathering your savanna dashboards.
                </p>
              </motion.div>
            )}

            {successAnimation && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-50 bg-[#16130b] flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(242,202,80,0.2)]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display font-bold text-2xl text-primary mb-3">Onboarding Complete!</h3>
                <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed mb-8">
                  Welcome to the herd! Your digital savanna space is active, calibrated, and initialized with theme <strong>{activeTheme.name}</strong>.
                </p>
                <button 
                  onClick={() => window.location.hash = '#/dashboard'}
                  className="px-8 py-4 rounded-full bg-primary text-on-primary font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_8px_24px_-4px_rgba(242,202,80,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Enter Creator Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            
            {/* STEP 0: Paywall & Entrance Gate */}
            {step === 0 && (
              <motion.div 
                key="step-0"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative z-10 space-y-8 animate-fade-in font-body"
              >
                <div className="text-center max-w-xl mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary shadow-[0_0_20px_rgba(242,202,80,0.15)]">
                    <Lock size={20} className="animate-pulse" />
                  </div>
                  <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-on-surface">
                    Stake Your Branded Estate
                  </h1>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    A premium subscription is required to secure your custom domains, deploy tracking pixels, and activate your personal AI advising chatbot.
                  </p>
                </div>

                {/* Tab Pill Selector */}
                <div className="flex gap-2 p-1.5 pb-2 rounded-xl w-fit mx-auto bg-[#12110d] border border-outline-variant/30 font-body mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGateTab('checkout');
                      setKeyError(false);
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeGateTab === 'checkout'
                        ? 'bg-surface-container-high text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    <Shield size={13} />
                    Premium Membership
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGateTab('owner')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeGateTab === 'owner'
                        ? 'bg-surface-container-high text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    <Key size={13} />
                    Owner Access Bypass
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeGateTab === 'checkout' ? (
                    <motion.div
                      key="checkout-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
                    >
                      {[
                        { id: 'creator', name: 'Creator', price: '$9', desc: 'Secure your custom links.' },
                        { id: 'pro', name: 'Creator Pro', price: '$19', desc: 'Custom domains & full pixels.', popular: true },
                        { id: 'growth', name: 'Growth', price: '$39', desc: 'Advanced AI insights & APIs.' }
                      ].map(plan => (
                        <div
                          key={plan.id}
                          className={`p-6 rounded-xl border flex flex-col justify-between gap-4 bg-[#12110d] transition-all relative ${
                            plan.popular ? 'border-primary/50 shadow-[0_0_15px_rgba(242,202,80,0.08)]' : 'border-outline-variant/30'
                          }`}
                        >
                          {plan.popular && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-[#3c2f00] font-display font-black text-[8px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                          <div className="space-y-1 mt-2">
                            <h4 className="font-display font-bold text-sm text-[#eae1d4]">{plan.name}</h4>
                            <p className="text-[9px] text-outline leading-tight font-body">{plan.desc}</p>
                          </div>
                          <div className="flex items-baseline gap-1.5 my-2">
                            <span className="font-display font-bold text-2xl text-on-surface">{plan.price}</span>
                            <span className="text-[10px] text-on-surface-variant font-semibold">/mo</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePaywallCheckout(plan.id)}
                            disabled={isProcessingCheckout !== null}
                            className={`w-full py-2.5 rounded-lg font-display font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              plan.popular
                                ? 'bg-primary text-[#3c2f00] border-transparent hover:shadow-[0_4px_12px_rgba(242,202,80,0.2)]'
                                : 'border border-outline text-[#eae1d4] hover:border-primary hover:text-primary bg-transparent'
                            }`}
                          >
                            {isProcessingCheckout === plan.id ? (
                              <RefreshCw size={10} className="animate-spin" />
                            ) : (
                              <ArrowUpRight size={10} />
                            )}
                            {isProcessingCheckout === plan.id ? 'Redirecting...' : 'Select Plan'}
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="owner-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="max-w-md mx-auto mt-6"
                    >
                      <form onSubmit={handleVerifyOwnerKey} className="space-y-4">
                        <div className="space-y-2 font-body">
                          <label className="text-[10px] font-bold text-on-surface uppercase tracking-wider block ml-1">
                            Private Savannah Access Key
                          </label>
                          <div className={`flex rounded-lg overflow-hidden border bg-[#080808] transition-colors ${
                            keyError ? 'border-error/50' : keySuccess ? 'border-tertiary/50' : 'border-outline-variant/30'
                          }`}>
                            <span className="px-3 py-3 border-r border-outline-variant/30 bg-surface-container-low text-outline flex items-center shrink-0">
                              <Key size={12} className={keySuccess ? 'text-tertiary' : 'text-outline'} />
                            </span>
                            <input 
                              required
                              type="password" 
                              placeholder="••••••••••••••"
                              value={accessKey}
                              onChange={e => {
                                setAccessKey(e.target.value);
                                setKeyError(false);
                              }}
                              className="flex-grow text-xs p-3 outline-none text-[#eae1d4] bg-transparent"
                            />
                          </div>
                          {keyError && (
                            <p className="text-[10px] text-error font-semibold mt-1">
                              ❌ Invalid Access Key. Premium membership required.
                            </p>
                          )}
                          {keySuccess && (
                            <p className="text-[10px] text-tertiary font-semibold mt-1">
                              ✔ Savannah Key verified! Welcome back, {
                                ['alesia', 'alesiastowers'].includes(accessKey.trim().toLowerCase()) ? 'Alesia' : 
                                ['aaron', 'aaron stowers', 'aaronstowers'].includes(accessKey.trim().toLowerCase()) ? 'Aaron' :
                                ['tembo', 'tembo-wise-pass'].includes(accessKey.trim().toLowerCase()) ? 'Tembo' : 'Creator'
                              }.
                            </p>
                          )}
                          {!keyError && !keySuccess && (
                            <p className="text-[9px] text-outline font-semibold mt-1.5 select-none" style={{ color: '#f2ca50' }}>
                              💡 Hint: Use your credentials (e.g. <code>alesia</code> or <code>savannah-owner</code>) to bypass Stripe.
                            </p>
                          )}
                        </div>

                        <button 
                          type="submit"
                          disabled={isVerifyingKey || !accessKey.trim() || keySuccess}
                          className="w-full py-3.5 rounded-lg bg-primary text-on-primary font-display font-bold text-xs uppercase tracking-wider hover:bg-primary-fixed transition-all cursor-pointer disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_4px_16px_rgba(242,202,80,0.2)]"
                        >
                          {isVerifyingKey ? <RefreshCw className="animate-spin" size={12} /> : null}
                          {isVerifyingKey ? 'Verifying Key...' : keySuccess ? 'Key Authorized' : 'Unlock Dashboard Console'}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-6 border-t border-outline-variant/20 flex justify-between items-center text-[10px] text-outline font-body select-none">
                  <span className="flex items-center gap-1"><Shield size={11} className="text-tertiary" /> SSL Secure Stripe Routing</span>
                  <a href="#/" className="hover:text-primary transition-colors uppercase tracking-widest font-bold">Back to Landing</a>
                </div>
              </motion.div>
            )}

            {/* STEP 1: Details & Bio Greeting (Exact HTML structure replication) */}
            {step === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="relative z-10 space-y-8"
              >
                <div className="space-y-2 text-center md:text-left">
                  <h1 className="font-display font-bold text-[32px] md:text-[36px] tracking-tight text-on-surface">
                    Welcome to the Savannah
                  </h1>
                  <p className="text-sm md:text-base text-on-surface-variant leading-normal">
                    Let's set up your digital domain. Who are you?
                  </p>
                </div>

                <div className="space-y-6 mt-8 font-body">
                  {/* Display Name Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider block ml-1" htmlFor="display-name">
                      Display Creator Name
                    </label>
                    <input 
                      required
                      type="text" 
                      id="display-name"
                      placeholder="e.g. Tembo The Wise"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="w-full bg-[#080808] border border-outline-variant/30 rounded-lg py-4 px-4 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-on-surface-variant/40"
                    />
                  </div>

                  {/* Username Domain claim */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider block ml-1" htmlFor="username">
                      Claim Handle URL
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-semibold select-none">tembopage.com/</span>
                      <input 
                        required
                        type="text" 
                        id="username" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="wiseleader" 
                        className="w-full bg-[#080808] border border-outline-variant/30 rounded-lg py-4 pl-28 pr-4 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-on-surface-variant/40 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Biography Area */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider block ml-1" htmlFor="bio">
                      Short Biography description
                    </label>
                    <textarea 
                      id="bio" 
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="I lead my herd to great digital pastures..." 
                      rows={3} 
                      className="w-full bg-[#080808] border border-outline-variant/30 rounded-lg py-4 px-4 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-on-surface-variant/40 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-8 flex flex-col md:flex-row justify-end gap-4">
                  <button 
                    onClick={handlePrevStep}
                    className="px-8 py-4 rounded-full border border-surface-container-highest text-on-surface font-display font-bold text-xs uppercase tracking-wider hover:bg-surface-variant/50 transition-all duration-300 w-full md:w-auto cursor-pointer text-center bg-transparent"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleNextStep}
                    disabled={!username.trim() || !displayName.trim()}
                    className="px-8 py-4 rounded-full bg-primary text-on-primary font-display font-bold text-xs uppercase tracking-wider hover:-translate-y-1 hover:shadow-[0_8px_24px_-4px_rgba(242,202,80,0.3)] transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    Next: Connect Socials
                    <ArrowRight size={14} className="font-bold" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Connect Social link pathways */}
            {step === 2 && (
              <motion.div 
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="relative z-10 space-y-8"
              >
                <div className="space-y-2 text-center md:text-left">
                  <h1 className="font-display font-bold text-[32px] md:text-[36px] tracking-tight text-on-surface">
                    Stake Your Territory
                  </h1>
                  <p className="text-sm md:text-base text-on-surface-variant leading-normal">
                    Connect your external platforms to populate your smart traffic routing engine.
                  </p>
                </div>

                <div className="space-y-5 mt-8 font-body">
                  {/* Instagram Link */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-wider block ml-1">Instagram Handle</label>
                    <div className="flex rounded-lg overflow-hidden border border-outline-variant/30 bg-[#080808]">
                      <span className="px-4 py-3 bg-surface-container-low border-r border-outline-variant/30 text-outline flex items-center shrink-0">
                        <Instagram size={14} />
                      </span>
                      <input 
                        type="text" 
                        value={instagramLink}
                        onChange={e => setInstagramLink(e.target.value)}
                        placeholder="username"
                        className="flex-grow text-xs p-3.5 outline-none text-[#eae1d4] bg-transparent"
                      />
                    </div>
                  </div>

                  {/* TikTok Link */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-wider block ml-1">TikTok Handle</label>
                    <div className="flex rounded-lg overflow-hidden border border-outline-variant/30 bg-[#080808]">
                      <span className="px-4 py-3 bg-surface-container-low border-r border-outline-variant/30 text-outline flex items-center shrink-0">
                        <Music size={14} />
                      </span>
                      <input 
                        type="text" 
                        value={tiktokLink}
                        onChange={e => setTiktokLink(e.target.value)}
                        placeholder="username"
                        className="flex-grow text-xs p-3.5 outline-none text-[#eae1d4] bg-transparent"
                      />
                    </div>
                  </div>

                  {/* YouTube Link */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-wider block ml-1">YouTube Channel</label>
                    <div className="flex rounded-lg overflow-hidden border border-outline-variant/30 bg-[#080808]">
                      <span className="px-4 py-3 bg-surface-container-low border-r border-outline-variant/30 text-outline flex items-center shrink-0">
                        <Youtube size={14} />
                      </span>
                      <input 
                        type="text" 
                        value={youtubeLink}
                        onChange={e => setYoutubeLink(e.target.value)}
                        placeholder="channelName"
                        className="flex-grow text-xs p-3.5 outline-none text-[#eae1d4] bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Newsletter Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-wider block ml-1">Newsletter Destination</label>
                    <div className="flex rounded-lg overflow-hidden border border-outline-variant/30 bg-[#080808]">
                      <span className="px-4 py-3 bg-surface-container-low border-r border-outline-variant/30 text-outline flex items-center shrink-0">
                        <Mail size={14} />
                      </span>
                      <input 
                        type="email" 
                        value={newsletterLink}
                        onChange={e => setNewsletterLink(e.target.value)}
                        placeholder="mail@brand.com"
                        className="flex-grow text-xs p-3.5 outline-none text-[#eae1d4] bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-8 flex flex-col md:flex-row justify-between gap-4">
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="px-8 py-4 rounded-full border border-surface-container-highest text-on-surface font-display font-bold text-xs uppercase tracking-wider hover:bg-surface-variant/50 transition-all duration-300 w-full md:w-auto cursor-pointer flex items-center justify-center gap-1 bg-transparent"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button 
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-4 rounded-full bg-primary text-on-primary font-display font-bold text-xs uppercase tracking-wider hover:-translate-y-1 hover:shadow-[0_8px_24px_-4px_rgba(242,202,80,0.3)] transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Next: Choose Theme
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Niche Theme selector with live preview sync */}
            {step === 3 && (
              <motion.div 
                key="step-3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="relative z-10 space-y-8"
              >
                <div className="space-y-2 text-center md:text-left">
                  <h1 className="font-display font-bold text-[32px] md:text-[36px] tracking-tight text-on-surface">
                    Gather Your Herd
                  </h1>
                  <p className="text-sm md:text-base text-on-surface-variant leading-normal">
                    Select a starter layout theme matching your brand's unique presence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-8">
                  {/* Theme pill grids (7 cols) */}
                  <div className="md:col-span-7 space-y-4 font-body">
                    {(Object.keys(themeConfig) as NicheTheme[]).map(themeKey => {
                      const theme = themeConfig[themeKey];
                      const isSelected = selectedTheme === themeKey;
                      return (
                        <div 
                          key={themeKey}
                          onClick={() => setSelectedTheme(themeKey)}
                          className={`p-4 rounded-xl flex items-center justify-between gap-4 border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-surface-container-highest border-primary shadow-[0_0_15px_rgba(242,202,80,0.08)]' 
                              : 'bg-[#121212] border-outline-variant/30 hover:border-outline-variant/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span 
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-black text-[10px]"
                              style={{ background: theme.primary }}
                            >
                              {isSelected ? <Check size={12} strokeWidth={3} /> : null}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-[#eae1d4]">{theme.name}</h4>
                              <p className="text-[10px] text-outline mt-0.5 leading-none capitalize">
                                Layout accent: {theme.primary}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-1.5 select-none">
                            <span className="w-3 h-3 rounded-full border border-white/10" style={{ background: theme.bg }} />
                            <span className="w-3 h-3 rounded-full border border-white/10" style={{ background: theme.primary }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dynamic Mobile Viewport Preview (5 cols) */}
                  <div className="md:col-span-5 flex flex-col justify-center items-center">
                    <div 
                      className="w-48 h-80 rounded-2xl border-4 border-outline-variant/50 p-3 flex flex-col justify-between items-center text-center shadow-2xl relative transition-all duration-500 overflow-hidden"
                      style={{ background: activeTheme.bg, borderColor: `${activeTheme.primary}30` }}
                    >
                      {/* Ambient glows inside preview */}
                      <div 
                        className="absolute inset-0 blur-2xl opacity-10 pointer-events-none transition-all duration-500" 
                        style={{ background: `radial-gradient(circle, ${activeTheme.primary}, transparent 70%)` }}
                      />

                      <div className="relative z-10 w-full flex flex-col items-center">
                        {/* Dynamic avatar */}
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs mb-2 relative overflow-hidden transition-all duration-500"
                          style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, #000)`, color: '#fff', border: `1.5px solid ${activeTheme.primary}` }}
                        >
                          {displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <h5 className="font-display font-bold text-[10px] truncate w-full" style={{ color: activeTheme.primary }}>
                          {displayName || 'Your Name'}
                        </h5>
                        <p className="text-[7px] text-[#99907c]">tembopage.com/{username || 'wiseleader'}</p>
                        <p className="text-[8px] max-w-[140px] leading-relaxed mt-2 text-[#c9bfab] truncate font-body">
                          {bio || 'Exploring pastures...'}
                        </p>
                      </div>

                      {/* Mock links lists */}
                      <div className="relative z-10 w-full space-y-1.5 select-none">
                        <div className="w-full py-1.5 rounded bg-white/5 border border-white/10 flex justify-between items-center px-2">
                          <span className="w-1 h-1 rounded" style={{ background: activeTheme.primary }} />
                          <span className="text-[7px] font-bold text-[#c9bfab]">Savannah Tee merch drop</span>
                          <span className="text-[8px] text-[#99907c]">➔</span>
                        </div>
                        <div className="w-full py-1.5 rounded bg-white/5 border border-white/10 flex justify-between items-center px-2">
                          <span className="w-1 h-1 rounded" style={{ background: activeTheme.primary }} />
                          <span className="text-[7px] font-bold text-[#c9bfab]">Listen on Spotify</span>
                          <span className="text-[8px] text-[#99907c]">➔</span>
                        </div>
                      </div>

                      <div className="relative z-10 text-[6px] font-black tracking-widest text-[#4d4635] uppercase select-none">
                        🐘 TEMBO PAGE
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-8 flex flex-col md:flex-row justify-between gap-4">
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="px-8 py-4 rounded-full border border-surface-container-highest text-on-surface font-display font-bold text-xs uppercase tracking-wider hover:bg-surface-variant/50 transition-all duration-300 w-full md:w-auto cursor-pointer flex items-center justify-center gap-1 bg-transparent"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button 
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-4 rounded-full bg-primary text-on-primary font-display font-bold text-xs uppercase tracking-wider hover:-translate-y-1 hover:shadow-[0_8px_24px_-4px_rgba(242,202,80,0.3)] transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Complete Savannah Setup
                    <Sparkles size={14} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
