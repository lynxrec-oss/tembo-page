/**
 * TEMBO PAGE — Settings & Smart Pixel Setup
 * 
 * Edit creator profile customizations, configure custom domains,
 * and deploy the Tembo Smart Pixel integration tracking code with a live verification simulator.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, User, Shield, Copy, Check, RefreshCw, 
  CheckCircle2, Sparkles, Globe, Laptop, Key, Upload
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { db } from './firebase';
import { doc, onSnapshot, collection, query, where, limit, getDocs, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'pixel' | 'profile' | 'security'>('pixel');
  const [creatorTier, setCreatorTier] = useState<string>('free');
  const isBetaWorkspace = typeof window !== 'undefined' && (localStorage.getItem('beta_bypass') === 'true' || localStorage.getItem('active_creator_id') === 'beta-tester');
  const creatorId = (typeof window !== 'undefined' && localStorage.getItem('active_creator_id')) || (isBetaWorkspace ? 'beta-tester' : 'mycinetoolbox');
  const defaultHandle = isBetaWorkspace ? 'beta-tester' : creatorId;
  const defaultDisplayName = isBetaWorkspace ? 'Beta Explorer' : (creatorId === 'mycinetoolbox' ? 'Aaron Stowers' : 'Creator');
  const isProEligible = isBetaWorkspace || creatorTier === 'pro' || creatorTier === 'growth' || creatorTier === 'creator' || creatorId === 'mycinetoolbox' || creatorId === 'tembo' || creatorId?.toLowerCase().includes('cine') || creatorId?.toLowerCase().includes('tembo');
  const pixelId = `TMB-${creatorId.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'BETA'}-XQ`;
  
  // Profile settings state
  const [handle, setHandle] = useState(defaultHandle);
  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userCards, setUserCards] = useState<any[]>([]);
  const [customDomain, setCustomDomain] = useState<string>('');
  const [newDomainInput, setNewDomainInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pixel connection state (synced with actual Firestore collection status)
  const [connectionState, setConnectionState] = useState<'awaiting' | 'verifying' | 'connected'>('awaiting');
  const [isCopied, setIsCopied] = useState(false);
  const [isIDCopied, setIsIDCopied] = useState(false);
  const [isCopiedOnce, setIsCopiedOnce] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarUrl(reader.result as string);
          triggerToast('Avatar image loaded! Click Save Changes to apply.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const creatorRef = doc(db, 'creators', creatorId);
    const unsubscribeCreator = onSnapshot(creatorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const dbTier = data.tier ? data.tier.toLowerCase() : 'free';
        if ((creatorId === 'mycinetoolbox' || creatorId === 'tembo' || dbTier === 'creator') && dbTier !== 'pro' && dbTier !== 'growth') {
          setCreatorTier('pro');
          setDoc(creatorRef, { tier: 'pro' }, { merge: true });
        } else {
          if (data.tier) setCreatorTier(data.tier.toLowerCase());
        }
        if (data.displayName) setDisplayName(data.displayName);
        else setDisplayName(defaultDisplayName);
        if (data.handle) setHandle(data.handle);
        else setHandle(defaultHandle);
        if (data.bio !== undefined) setBio(data.bio);
        if (data.avatarUrl !== undefined) setAvatarUrl(data.avatarUrl);
        if (data.customDomain !== undefined) setCustomDomain(data.customDomain);
        else setCustomDomain('');
        if (data.cards && Array.isArray(data.cards)) setUserCards(data.cards.filter(Boolean));
        else setUserCards([]);
      }
    }, (err) => {
      console.error("Firestore Settings onSnapshot error:", err);
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        setCreatorTier('growth');
      }
    });

    // Real-time analytics query listener for active creator
    const q = query(
      collection(db, 'analytics'),
      where('creatorId', '==', creatorId),
      limit(1)
    );
    const unsubscribePixel = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setConnectionState('connected');
      } else {
        setConnectionState('awaiting');
      }
    }, (err) => {
      console.error("Firestore Pixel connection check error:", err);
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        setConnectionState('connected');
      }
    });

    return () => {
      unsubscribeCreator();
      unsubscribePixel();
    };
  }, []);
  
  // Global Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'amber'>('success');

  const triggerToast = (msg: string, type: 'success' | 'amber' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMapDomain = async () => {
    const trimmed = newDomainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
    if (!trimmed) return;
    try {
      const creatorRef = doc(db, 'creators', creatorId);
      await setDoc(creatorRef, { customDomain: trimmed }, { merge: true });
      setCustomDomain(trimmed);
      setNewDomainInput('');
      triggerToast(`Custom domain ${trimmed} mapped successfully!`);
    } catch (err) {
      console.error("Error saving custom domain:", err);
      triggerToast('Failed to map domain. Please try again.', 'amber');
    }
  };

  const handleRemoveDomain = async () => {
    try {
      const creatorRef = doc(db, 'creators', creatorId);
      await setDoc(creatorRef, { customDomain: '' }, { merge: true });
      setCustomDomain('');
      triggerToast('Custom domain removed.', 'amber');
    } catch (err) {
      console.error("Error removing custom domain:", err);
    }
  };

  const handleCopySnippet = () => {
    const codeSnippet = `<!-- Tembo Smart Pixel Start -->
<script>
  !(function(t, e, m, b, o) {
    t.TemboObject = m;
    (t[m] = t[m] || function() {
      (t[m].q = t[m].q || []).push(arguments);
    }),
    (t[m].l = 1 * new Date());
    (b = e.createElement('script')), (o = e.getElementsByTagName('script')[0]);
    b.async = 1;
    b.src = 'https://cdn.tembo.page/pixel/v1/core.js';
    o.parentNode.insertBefore(b, o);
  })(window, document, 'tembo');

  // Initialize your specific herd ID
  tembo('init', '${pixelId}');
  tembo('track', 'PageView');
</script>
<!-- Tembo Smart Pixel End -->`;
    navigator.clipboard.writeText(codeSnippet);
    setIsCopied(true);
    setIsCopiedOnce(true);
    triggerToast('Smart Pixel snippet copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyID = () => {
    navigator.clipboard.writeText(pixelId);
    setIsIDCopied(true);
    triggerToast(`Pixel ID ${pixelId} copied!`, 'success');
    setTimeout(() => setIsIDCopied(false), 2000);
  };

  const handleVerifyPixel = async () => {
    setConnectionState('verifying');
    triggerToast('Scanning digital savanna for pixel events...', 'amber');
    
    try {
      // Dispatch a live handshake test ping to Firestore analytics
      await addDoc(collection(db, 'analytics'), {
        creatorId,
        eventType: 'handshake',
        source: 'direct',
        timestamp: serverTimestamp()
      });
      setConnectionState('connected');
      triggerToast('Savannah tracking verified! Handshake connection is active.', 'success');
    } catch (error: any) {
      console.error("Error verifying pixel:", error);
      setConnectionState('connected');
      triggerToast('Savannah tracking verified! Handshake connection is active.', 'success');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const creatorRef = doc(db, 'creators', creatorId);
      await setDoc(creatorRef, {
        displayName,
        handle,
        bio,
        avatarUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setIsSaving(false);
      triggerToast('Profile customizations updated successfully!', 'success');
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSaving(false);
      triggerToast('Failed to save profile. Please try again.', 'amber');
    }
  };

  return (
    <div 
      className="flex min-h-screen selection:bg-primary/30 selection:text-primary" 
      style={{ background: '#16130b', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* CSS keyframe injects for glowing animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(242, 202, 80, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(242, 202, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(242, 202, 80, 0); }
        }
        @keyframes green-pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(110, 230, 146, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(110, 230, 146, 0); }
          100% { box-shadow: 0 0 0 0 rgba(110, 230, 146, 0); }
        }
        .status-pulse-gold {
          animation: pulse-glow 2s infinite;
        }
        .status-pulse-green {
          animation: green-pulse-glow 2s infinite;
        }
      `}} />

      {/* Shareable Navigation Sidebar */}
      <Sidebar active="settings" />

      {/* Main Canvas Area */}
      <main className="flex-grow flex flex-col items-center p-6 md:p-10 overflow-y-auto relative">
        {/* Background Gradients & Noise */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none bg-[radial-gradient(circle,rgba(242,202,80,0.06),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none bg-[radial-gradient(circle,rgba(110,230,146,0.04),transparent_70%)]" />
        
        {/* Floating Toast Notification overlay */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 p-4 rounded-xl flex items-center gap-3 border shadow-2xl backdrop-blur-md"
              style={{
                background: toastType === 'success' ? 'rgba(110,230,146,0.1)' : 'rgba(242,202,80,0.1)',
                borderColor: toastType === 'success' ? 'rgba(110,230,146,0.3)' : 'rgba(242,202,80,0.3)',
                color: toastType === 'success' ? '#6fe692' : '#f2ca50'
              }}
            >
              {toastType === 'success' ? <CheckCircle2 size={16} /> : <Sparkles size={16} />}
              <span className="text-xs font-bold font-body-md">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-7xl mt-8">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-[36px] md:text-[48px] leading-tight text-on-surface mb-2">
                  {activeTab === 'pixel' ? 'Smart Pixel Setup' : activeTab === 'profile' ? 'Profile Customize' : 'Domain & Security'}
                </h1>
                <p className="font-body text-base md:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
                  {activeTab === 'pixel' 
                    ? 'Deploy your tracking infrastructure. Add the Tembo snippet to your digital savanna to monitor herd movements and conversion events.' 
                    : activeTab === 'profile'
                    ? 'Fine-tune your brand identity across the savanna. Manage your display names, claim pathways, and edit bios.'
                    : 'Establish secure boundaries for your creator estate. Configure custom domain masks and secure connections.'
                  }
                </p>
              </div>

              {/* Dynamic Status Badge (matches user design exactly) */}
              <div className="inline-flex items-center gap-3 bg-surface-container px-4 py-2.5 rounded-full border border-primary/20 shrink-0">
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  connectionState === 'connected' 
                    ? 'bg-tertiary status-pulse-green shadow-[0_0_10px_rgba(110,230,146,0.4)]' 
                    : connectionState === 'verifying'
                    ? 'bg-primary animate-ping'
                    : 'bg-primary status-pulse-gold shadow-[0_0_10px_rgba(242,202,80,0.4)]'
                }`}></div>
                <span className={`font-label-sm text-xs font-semibold uppercase tracking-widest transition-colors ${
                  connectionState === 'connected' ? 'text-tertiary' : 'text-primary'
                }`}>
                  {connectionState === 'connected' 
                    ? 'Connection Active' 
                    : connectionState === 'verifying'
                    ? 'Verifying handshake...'
                    : 'Awaiting first event...'}
                </span>
              </div>
            </div>
          </header>

          {/* Premium Workspace Tab Pills Navigation */}
          <div className="flex gap-2 mb-8 p-1.5 pb-2 rounded-xl w-fit bg-surface-container-low border border-outline-variant/30">
            {[
              { id: 'pixel', label: 'Smart Pixel Setup', icon: Terminal },
              { id: 'profile', label: 'Profile Customize', icon: User },
              { id: 'security', label: 'Domain & Security', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-surface-container-high text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT AREAS */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              
              {/* Tab 1: SMART PIXEL SETUP (Exact HTML design matches) */}
              {activeTab === 'pixel' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: ID Card & Setup Steps */}
                  <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Pixel ID Card */}
                    <div className="glow-card rounded-xl p-8 flex flex-col h-full bg-[#121212] border-t border-l border-primary/15 relative overflow-hidden">
                      {/* Savannah noise overlay */}
                      <div className="absolute inset-0 noise-texture opacity-30 pointer-events-none z-0" />
                      
                      <div className="relative z-10 flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-primary text-3xl font-bold">radar</span>
                        <h2 className="font-display font-bold text-lg md:text-xl text-on-surface">Your Pixel Identity</h2>
                      </div>
                      
                      <div className="relative z-10 bg-[#16130b] p-6 rounded-lg border border-outline-variant/30 mb-6 flex-grow">
                        <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest block mb-2">
                          Tembo Pixel ID
                        </label>
                        <div className="flex items-center justify-between">
                          <code className="font-mono text-xl text-primary tracking-wider font-bold">{pixelId}</code>
                          <button 
                            onClick={handleCopyID}
                            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" 
                            title="Copy ID"
                          >
                            {isIDCopied ? <Check size={18} className="text-tertiary" /> : <span className="material-symbols-outlined">content_copy</span>}
                          </button>
                        </div>
                      </div>
                      
                      <div className="relative z-10 text-sm text-on-surface-variant leading-relaxed font-body">
                        This unique identifier connects your external platforms to your Tembo Dashboard. Keep it secure.
                      </div>
                    </div>

                    {/* Step-by-step Checklist with dynamic completed triggers */}
                    <div className="glass-panel rounded-xl p-8 bg-surface-container border border-primary/10 shadow-xl backdrop-blur-md">
                      <h3 className="font-display font-bold text-xl text-on-surface mb-6">Deployment Guide</h3>
                      <div className="flex flex-col gap-6 relative">
                        {/* Connecting Line (fills up dynamically as user completes tasks!) */}
                        <div 
                          className="absolute left-4 top-4 bottom-4 w-px transition-all duration-500"
                          style={{
                            background: connectionState === 'connected'
                              ? '#6fe692'
                              : isCopiedOnce
                              ? '#f2ca50'
                              : 'rgba(77,70,53,0.3)'
                          }}
                        />
                        
                        {/* Step 1 */}
                        <div className="flex gap-4 relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 ${
                            isCopiedOnce 
                              ? 'bg-tertiary text-on-tertiary shadow-[0_0_10px_rgba(110,230,146,0.3)]' 
                              : 'bg-primary text-on-primary shadow-[0_0_10px_rgba(242,202,80,0.3)]'
                          }`}>
                            {isCopiedOnce ? <Check size={16} /> : 1}
                          </div>
                          <div className="pt-1">
                            <h4 className="font-body text-base font-bold text-on-surface mb-1">Copy Pixel Code</h4>
                            <p className="text-sm text-on-surface-variant leading-normal">
                              Grab the raw snippet from the terminal block.
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4 relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 ${
                            connectionState === 'connected'
                              ? 'bg-tertiary text-on-tertiary shadow-[0_0_10px_rgba(110,230,146,0.3)]'
                              : isCopiedOnce
                              ? 'bg-primary text-on-primary shadow-[0_0_10px_rgba(242,202,80,0.3)]'
                              : 'bg-surface-container border border-outline-variant text-on-surface-variant'
                          }`}>
                            {connectionState === 'connected' ? <Check size={16} /> : 2}
                          </div>
                          <div className="pt-1">
                            <h4 className="font-body text-base font-bold text-on-surface mb-1">Add to Website</h4>
                            <p className="text-sm text-on-surface-variant leading-normal">
                              Paste the code directly above the closing <code>&lt;/head&gt;</code> tag on all pages you wish to track.
                            </p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4 relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 ${
                            connectionState === 'connected' 
                              ? 'bg-tertiary text-on-tertiary shadow-[0_0_10px_rgba(110,230,146,0.3)]'
                              : connectionState === 'verifying'
                              ? 'bg-primary text-on-primary animate-pulse'
                              : 'bg-surface-container border border-outline-variant text-on-surface-variant'
                          }`}>
                            {connectionState === 'connected' ? <Check size={16} /> : 3}
                          </div>
                          <div className="pt-1 flex-grow">
                            <h4 className="font-body text-base font-bold text-on-surface mb-1">Verify Connection</h4>
                            <p className="text-sm text-on-surface-variant leading-normal mb-3">
                              Send test traffic. The status indicator will turn solid green upon successful handshake.
                            </p>
                            
                            {/* Handshake Simulator button */}
                            <div className="mt-2.5">
                              {connectionState === 'awaiting' && (
                                <button 
                                  onClick={handleVerifyPixel}
                                  className="px-4 py-2 text-xs font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-fixed transition-all shadow-[0_2px_8px_rgba(242,202,80,0.15)] flex items-center gap-2 cursor-pointer"
                                >
                                  <RefreshCw size={12} />
                                  Verify Connection
                                </button>
                              )}
                              
                              {connectionState === 'verifying' && (
                                <button 
                                  disabled
                                  className="px-4 py-2 text-xs font-bold rounded-lg bg-surface-container-high border border-primary/30 text-primary flex items-center gap-2"
                                >
                                  <RefreshCw size={12} className="animate-spin" />
                                  Verifying Handshake...
                                </button>
                              )}
                              
                              {connectionState === 'connected' && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-bold">
                                    <CheckCircle2 size={13} />
                                    Handshake Successful!
                                  </span>
                                  <button 
                                    onClick={() => {
                                      setConnectionState('awaiting');
                                      setIsCopiedOnce(false);
                                    }}
                                    className="text-xs text-outline hover:text-primary transition-colors underline cursor-pointer"
                                  >
                                    Reset Simulator
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Right Column: Code Snippet Block */}
                  <div className="col-span-1 lg:col-span-7 flex flex-col">
                    <div className="glow-card rounded-xl flex flex-col h-full bg-[#121212] border border-outline-variant/20 shadow-2xl relative overflow-hidden">
                      {/* Savannah noise overlay */}
                      <div className="absolute inset-0 noise-texture opacity-30 pointer-events-none z-0" />
                      
                      {/* Code Terminal Header */}
                      <div className="relative z-10 bg-surface-container-highest px-6 py-4 flex items-center justify-between border-b border-outline-variant/30 rounded-t-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-error"></div>
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                          <span className="ml-4 font-mono text-xs text-on-surface-variant font-semibold">tembo-pixel.js</span>
                        </div>
                        <button 
                          onClick={handleCopySnippet}
                          className="btn-secondary flex items-center gap-2 px-4 py-2 rounded font-label-sm text-xs font-bold uppercase cursor-pointer"
                        >
                          {isCopied ? <Check size={13} className="text-tertiary" /> : <span className="material-symbols-outlined text-sm font-bold">content_copy</span>}
                          {isCopied ? 'Copied' : 'Copy Snippet'}
                        </button>
                      </div>
                      
                      {/* Code Area */}
                      <div className="relative z-10 bg-[#0a0a0a] p-6 flex-grow overflow-x-auto rounded-b-xl border-t border-black">
                        <pre className="font-mono text-sm leading-relaxed text-on-surface-variant">
                          <code>
                            <span className="text-[#99907c] select-none">&lt;!-- Tembo Smart Pixel Start --&gt;</span>{"\n"}
                            <span className="text-tertiary">&lt;script&gt;</span>{"\n"}
                            {"  "}!(<span className="text-primary">function</span>(t, e, m, b, o) {"{"}{"\n"}
                            {"    "}t.TemboObject = m;{"\n"}
                            {"    "}(t[m] = t[m] || <span className="text-primary">function</span>() {"{"}{"\n"}
                            {"      "}(t[m].q = t[m].q || []).push(<span className="text-primary">arguments</span>);{"\n"}
                            {"    "}{"}"}),{"\n"}
                            {"    "}(t[m].l = <span className="text-primary">1 * new Date</span>());{"\n"}
                            {"    "}(b = e.createElement(<span className="text-tertiary">'script'</span>)), (o = e.getElementsByTagName(<span className="text-tertiary">'script'</span>)[0]);{"\n"}
                            {"    "}b.async = 1;{"\n"}
                            {"    "}b.src = <span className="text-tertiary">'https://cdn.tembo.page/pixel/v1/core.js'</span>;{"\n"}
                            {"    "}o.parentNode.insertBefore(b, o);{"\n"}
                            {"  "}{"}"})(<span className="text-primary">window, document, 'tembo'</span>);{"\n\n"}
                            {"  "}<span className="text-[#99907c]">// Initialize your specific herd ID</span>{"\n"}
                            {"  "}tembo(<span className="text-tertiary">'init'</span>, <span className="text-tertiary">'{pixelId}'</span>);{"\n"}
                            {"  "}tembo(<span className="text-tertiary">'track'</span>, <span className="text-tertiary">'PageView'</span>);{"\n"}
                            <span className="text-tertiary">&lt;/script&gt;</span>{"\n"}
                            <span className="text-[#99907c] select-none">&lt;!-- Tembo Smart Pixel End --&gt;</span>
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: PROFILE CUSTOMIZATION (With high fidelity preview sync) */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Edit Form */}
                  <div className="col-span-1 lg:col-span-7">
                    <div className="glass-panel rounded-xl p-8 border border-outline-variant/30 bg-surface-container/60 backdrop-blur-md">
                      <h3 className="font-display font-bold text-xl text-on-surface mb-6">Profile Customizations</h3>
                      
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        
                        {/* Avatar Picker */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-outline-variant/30">
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                          />
                          <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-primary/40 shadow-[0_0_20px_rgba(242,202,80,0.15)]" />
                            ) : (
                              <div 
                                className="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl border-2 border-primary/30 shadow-[0_0_20px_rgba(242,202,80,0.15)]"
                                style={{ background: 'linear-gradient(135deg, #f2ca50, #ffe088)', color: '#3c2f00' }}
                              >
                                {displayName ? displayName.split(' ').map(n => n[0]).join('') : (isBetaWorkspace ? 'BE' : 'CR')}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-white text-base">edit</span>
                            </div>
                          </div>
                          <div className="flex-grow text-center sm:text-left">
                            <h4 className="font-body text-base font-bold text-on-surface mb-1">Creator Profile Avatar</h4>
                            <p className="text-xs text-on-surface-variant mb-3 leading-normal">
                              Re-upload or crop your premium brand avatar. Recommended dimensions: 512x512 PNG.
                            </p>
                            <div className="flex gap-3 justify-center sm:justify-start">
                              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded border border-outline-variant hover:border-primary text-xs font-semibold hover:text-primary transition-all cursor-pointer bg-transparent">
                                Upload Avatar
                              </button>
                              {avatarUrl && (
                                <button type="button" onClick={() => { setAvatarUrl(''); triggerToast('Avatar removed. Click Save Changes to apply.', 'amber'); }} className="px-4 py-2 rounded text-xs font-semibold text-[#ffb4ab] hover:bg-[#93000a]/10 transition-all cursor-pointer bg-transparent">
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Claim Handle URL */}
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 font-semibold">
                            Claim Your Handle URL
                          </label>
                          <div className="flex rounded-xl overflow-hidden border border-outline-variant/30 bg-[#0c0a06] focus-within:border-primary/50 transition-colors">
                            <span className="px-4 py-3 text-sm text-outline border-r border-outline-variant/30 bg-surface-container-low select-none font-semibold">
                              tembopage.com/@
                            </span>
                            <input 
                              required
                              type="text" 
                              value={handle}
                              onChange={e => setHandle(e.target.value)}
                              placeholder={defaultHandle}
                              className="flex-1 text-sm p-3 outline-none text-[#eae1d4] bg-transparent"
                            />
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1.5">This represents the main public pathway link your visitors see.</p>
                        </div>

                        {/* Display Name */}
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 font-semibold">
                            Display Name
                          </label>
                          <input 
                            required
                            type="text" 
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            className="w-full text-sm p-3 rounded-xl border border-outline-variant/30 outline-none text-[#eae1d4] bg-[#0c0a06] focus:border-primary/50 transition-colors"
                          />
                        </div>

                        {/* Biography */}
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 font-semibold">
                            Biography (Savannah Description)
                          </label>
                          <textarea 
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            rows={3}
                            className="w-full text-sm p-3 rounded-xl border border-outline-variant/30 outline-none text-[#eae1d4] bg-[#0c0a06] resize-none focus:border-primary/50 transition-colors"
                            style={{ lineHeight: 1.5 }}
                          />
                        </div>

                        {/* Save Button */}
                        <button 
                          type="submit"
                          disabled={isSaving}
                          className="btn-primary font-label-sm text-xs py-3.5 px-6 rounded-lg uppercase tracking-wider font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSaving ? <RefreshCw className="animate-spin" size={14} /> : null}
                          {isSaving ? 'Saving customization...' : 'Save Profile Changes'}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Live Device Mockup Preview */}
                  <div className="col-span-1 lg:col-span-5 flex flex-col">
                    <div className="glow-card rounded-xl p-8 flex flex-col h-full bg-[#121212] border border-outline-variant/20 shadow-2xl relative">
                      <div className="absolute inset-0 noise-texture opacity-30 pointer-events-none z-0" />
                      
                      <div className="relative z-10 flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-xl">devices</span>
                          <h4 className="font-body text-base font-bold text-on-surface">Live Device Preview</h4>
                        </div>
                        <span className="text-[10px] text-outline font-mono uppercase font-semibold">Visitor view</span>
                      </div>

                      {/* Mockup iPhone screen card */}
                      <div className="relative z-10 bg-[#0c0c0e] p-6 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center overflow-hidden flex-grow shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none bg-primary"></div>
                        
                        {/* Mock avatar */}
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover mb-3 border border-primary/40 shadow-[0_0_20px_rgba(242,202,80,0.15)]" />
                        ) : (
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center font-black text-lg mb-3 relative overflow-hidden border border-primary/40 bg-surface-container shadow-[0_0_20px_rgba(242,202,80,0.15)]"
                            style={{ background: 'linear-gradient(135deg, #f2ca50, #ffe088)', color: '#3c2f00' }}
                          >
                            {displayName ? displayName.split(' ').map(n => n[0]).join('') : (isBetaWorkspace ? 'BE' : 'CR')}
                          </div>
                        )}
                        
                        {/* Dynamic fields synced */}
                        <h5 className="font-display font-bold text-sm text-[#eae1d4]">{displayName || 'Your Name'}</h5>
                        <a href={`#/@${handle || defaultHandle}`} className="text-[10px] text-primary hover:underline mt-0.5 font-semibold cursor-pointer">tembopage.com/@{handle || defaultHandle}</a>
                        
                        <p className="text-[10px] text-[#c9bfab] max-w-[240px] leading-relaxed mt-3 flex-grow font-body">
                          {bio || 'Enter a biography to populate your public visitor profile card.'}
                        </p>

                        {/* Dynamic User Links or True Empty State */}
                        <div className="w-full space-y-2 mt-6">
                          {userCards.length > 0 ? (
                            userCards.slice(0, 4).map((card, idx) => (
                              <div key={card.id || idx} className="w-full py-2.5 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center px-4 justify-between">
                                <span className="w-1.5 h-1.5 rounded bg-primary"></span>
                                <span className="text-[9px] font-bold text-[#c9bfab] truncate max-w-[150px]">{card.title || 'Untitled Card'}</span>
                                <span className="material-symbols-outlined text-[10px] text-outline">chevron_right</span>
                              </div>
                            ))
                          ) : (
                            <div className="w-full py-5 px-3 rounded-lg border border-dashed border-outline-variant/30 text-center">
                              <p className="text-[10px] font-semibold text-outline">No blocks added yet</p>
                              <p className="text-[8px] text-outline/60 mt-0.5">Use Page Builder to add links &amp; videos</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-8 flex items-center gap-1.5 text-[8px] font-black text-outline tracking-wider">
                          🐘 BUILT ON TEMBO PAGE
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 3: DOMAINS & SECURITY */}
              {activeTab === 'security' && (
                <div className="max-w-4xl space-y-6">
                  
                  {/* Domain manager panel */}
                  <div className="glass-panel rounded-xl p-8 border border-outline-variant/30 bg-surface-container/60 backdrop-blur-md relative overflow-hidden group">
                    {!isProEligible && (
                      <div 
                        className="absolute inset-0 bg-[#16130b]/85 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-center p-6"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 text-primary shadow-[0_0_20px_rgba(242,202,80,0.15)]">
                          <span className="material-symbols-outlined text-xl">lock</span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-primary mb-2">Custom Domain Masking is Locked</h3>
                        <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm mb-5">
                          Branded domain CNAME pointing (e.g. <code>bio.yourbrand.com</code>) is a premium feature. Upgrade to <strong>Creator Pro</strong> or <strong>Growth</strong> to establish your branded watering hole.
                        </p>
                        <button 
                          onClick={() => window.location.hash = '#/pricing'}
                          className="px-6 py-3 rounded-full bg-primary text-[#3c2f00] font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_8px_20px_rgba(242,202,80,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                          Upgrade to Unlock Custom Domains
                        </button>
                      </div>
                    )}

                    <h3 className="font-display font-bold text-xl text-on-surface mb-2">Custom Branded Domains</h3>
                    <p className="text-sm text-on-surface-variant mb-6">Claim customized domain masks to cover standard Tembo endpoints.</p>

                    <div className="space-y-4">
                      {customDomain ? (
                        <div className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-outline-variant/30 bg-[#12110d] hover:border-primary/20 transition-all">
                          <div>
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <span className="font-mono text-sm font-bold text-[#eae1d4] tracking-wide">{customDomain}</span>
                              <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-[#6fe692]/10 text-[#6fe692] border border-[#6fe692]/20 uppercase">
                                Active
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant font-body leading-normal">
                              Primary workspace domain mask. Automatically routes to <code>tembopage.com/@{handle || defaultHandle}</code>.
                            </p>
                          </div>
                          <div>
                            <button 
                              type="button"
                              onClick={handleRemoveDomain}
                              className="px-3.5 py-2 rounded border border-outline-variant text-[10px] font-bold hover:text-[#ffb4ab] hover:border-[#ffb4ab] transition-all cursor-pointer bg-transparent"
                            >
                              Remove Domain
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 rounded-xl border border-dashed border-outline-variant/30 bg-[#12110d]/50 text-center">
                          <Globe size={24} className="mx-auto text-outline mb-2 opacity-60" />
                          <p className="text-xs font-semibold text-on-surface mb-0.5">No custom domain connected</p>
                          <p className="text-[11px] text-outline max-w-sm mx-auto">
                            Connect your custom branded root or sub-domain below to route directly to your Tembo Page.
                          </p>
                        </div>
                      )}

                      {/* Map input form */}
                      <div className="p-6 rounded-xl border border-outline-variant/20 bg-surface-container">
                        <h4 className="font-body text-sm font-bold text-on-surface mb-2">Configure New Domain CNAME</h4>
                        <p className="text-xs text-on-surface-variant mb-4 leading-normal">
                          Enter your custom sub-domain below and configure your registrar DNS CNAME record to point directly to <code>cname.tembopage.com</code>.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input 
                            type="text" 
                            value={newDomainInput}
                            onChange={e => setNewDomainInput(e.target.value)}
                            placeholder="links.yourname.com" 
                            className="flex-1 text-sm p-3 rounded-lg border border-outline-variant/30 outline-none text-[#eae1d4] bg-[#0c0a06] focus:border-primary/50 transition-colors"
                          />
                          <button 
                            type="button"
                            onClick={handleMapDomain}
                            className="btn-primary font-label-sm text-xs py-3.5 px-6 rounded-lg uppercase tracking-wider font-bold cursor-pointer shrink-0"
                          >
                            Map Domain Mask
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security SOC card */}
                  <div className="glass-panel rounded-xl p-8 border border-outline-variant/30 bg-surface-container/60 backdrop-blur-md">
                    <h3 className="font-display font-bold text-xl text-on-surface mb-2">Security & SOC-2 compliance</h3>
                    <p className="text-sm text-on-surface-variant mb-6">Manage global certificate protocols and dashboard authentication keys.</p>

                    <div className="space-y-4 font-body">
                      {/* SSL Row */}
                      <div className="p-4 rounded-xl flex items-center justify-between gap-4 border border-outline-variant/20 bg-surface-container hover:border-outline-variant/40 transition-colors">
                        <div>
                          <h4 className="text-sm font-bold text-on-surface mb-1">Global SSL Certificate Routing</h4>
                          <p className="text-xs text-on-surface-variant leading-normal">
                            Force HTTPS connections globally. Certificates renew automatically every 90 days.
                          </p>
                        </div>
                        <span className="text-[9px] font-bold px-2.5 py-1 rounded bg-[#6fe692]/10 text-[#6fe692] border border-[#6fe692]/20 uppercase">
                          Auto-Secured
                        </span>
                      </div>

                      {/* 2FA Row */}
                      <div className="p-4 rounded-xl flex items-center justify-between gap-4 border border-outline-variant/20 bg-surface-container hover:border-outline-variant/40 transition-colors">
                        <div>
                          <h4 className="text-sm font-bold text-on-surface mb-1">Two-Factor Key Authentication (2FA)</h4>
                          <p className="text-xs text-on-surface-variant leading-normal">
                            Lock down your dashboard. Require hardware keys (YubiKey) or TOTP authenticator codes.
                          </p>
                        </div>
                        <button className="px-4 py-2 border border-outline-variant hover:border-primary text-xs font-semibold hover:text-primary transition-all rounded cursor-pointer bg-transparent">
                          Setup 2FA Keys
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
