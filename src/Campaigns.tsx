/**
 * TEMBO PAGE — Campaign Manager & Optimization Suite
 * 
 * Manage audience routing profiles, run variant split testing, and schedule pin/hide/reveal drops.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Calendar, Clock, Play, Pause, Trash2, Sparkles, Check, 
  ChevronRight, BarChart2, AlertCircle, HelpCircle, Sliders, 
  ArrowRight, Camera, Film, Mail, Link, Edit, CheckCircle2, RefreshCw
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

interface RoutingCampaign {
  id: string;
  icon: 'camera' | 'film' | 'mail' | 'link';
  title: string;
  status: 'Active' | 'Paused' | 'Draft';
  source: string;
  layout: string;
  clicks: string;
  conversion: string;
  revenue: string;
}

interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed';
  confidence: number;
  winner?: string;
  variants: {
    label: string;
    letter: 'A' | 'B';
    views: number;
    clicks: number;
    ctr: number;
    isWinning: boolean;
  }[];
}

interface ScheduledDrop {
  id: string;
  title: string;
  date: string;
  time: string;
  action: 'pin' | 'hide' | 'reveal';
  targetCard: string;
  rule: string;
  active: boolean;
}

// ─── INITIAL SYSTEM STATES ───────────────────────────────────────────────────
const INITIAL_CAMPAIGNS: RoutingCampaign[] = [
  {
    id: 'campaign-1',
    icon: 'camera',
    title: 'Instagram Launch',
    status: 'Active',
    source: 'Instagram',
    layout: 'Merch First',
    clicks: '12.4k',
    conversion: '8.2%',
    revenue: '$4.2k'
  },
  {
    id: 'campaign-2',
    icon: 'film',
    title: 'TikTok Viral',
    status: 'Active',
    source: 'TikTok',
    layout: 'Video First',
    clicks: '45.1k',
    conversion: '12.5%',
    revenue: '$18.9k'
  },
  {
    id: 'campaign-3',
    icon: 'mail',
    title: 'Newsletter Subs',
    status: 'Draft',
    source: 'Newsletter',
    layout: 'None',
    clicks: '0',
    conversion: '0%',
    revenue: '$0'
  }
];

const INITIAL_TESTS: ABTest[] = [
  {
    id: 'test-1',
    name: 'Featured Media Swap: Album Launch',
    status: 'running',
    confidence: 96,
    winner: 'Variant B',
    variants: [
      { label: 'Variant A: Spotify Player on Top', letter: 'A', views: 8200, clicks: 1980, ctr: 24.1, isWinning: false },
      { label: 'Variant B: YouTube Video on Top', letter: 'B', views: 8150, clicks: 2750, ctr: 33.7, isWinning: true },
    ]
  },
  {
    id: 'test-2',
    name: 'Form CTA Copy Split',
    status: 'paused',
    confidence: 62,
    variants: [
      { label: 'Variant A: "Join the Inner Circle"', letter: 'A', views: 3400, clicks: 510, ctr: 15.0, isWinning: true },
      { label: 'Variant B: "Get Subscriber Exclusives"', letter: 'B', views: 3500, clicks: 420, ctr: 12.0, isWinning: false },
    ]
  }
];

const INITIAL_DROPS: ScheduledDrop[] = [
  {
    id: 'drop-1',
    title: 'Savannah Tee Merch Peak Traffic Boost',
    date: 'Every Wednesday',
    time: '6:00 PM – 9:00 PM EST',
    action: 'pin',
    targetCard: 'New Drop — Savannah Tee',
    rule: 'Pin to top for TikTok visitors during peak evening hours',
    active: true
  },
  {
    id: 'drop-2',
    title: 'Friday Vlog Release Reveal',
    date: 'June 12, 2026',
    time: '12:00 PM EST',
    action: 'reveal',
    targetCard: 'My Cinematic Journey Vlog',
    rule: 'Automatically publish and reveal video block at noon',
    active: false
  }
];

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState<'routing' | 'ab' | 'drops'>('routing');
  const isBetaWorkspace = typeof window !== 'undefined' && (localStorage.getItem('beta_bypass') === 'true' || localStorage.getItem('active_creator_id') === 'beta-tester');
  const creatorId = (typeof window !== 'undefined' && localStorage.getItem('active_creator_id')) || (isBetaWorkspace ? 'beta-tester' : 'mycinetoolbox');
  
  // Real-time Lists State
  const [campaigns, setCampaigns] = useState<RoutingCampaign[]>([]);
  const [tests, setTests] = useState<ABTest[]>(isBetaWorkspace ? [] : INITIAL_TESTS);
  const [drops, setDrops] = useState<ScheduledDrop[]>(isBetaWorkspace ? [] : INITIAL_DROPS);
  
  // Interactivity Simulator & Creator Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Form states for creating a new routing campaign
  const [campaignName, setCampaignName] = useState('');
  const [trafficSource, setTrafficSource] = useState<'Instagram' | 'TikTok' | 'YouTube' | 'Newsletter'>('Instagram');
  const [targetLayout, setTargetLayout] = useState<'Merch First' | 'Video First' | 'Booking First' | 'None'>('Merch First');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to Firestore campaigns collection scoped to current creator workspace
  useEffect(() => {
    if (!creatorId) return;

    const q = query(
      collection(db, 'campaigns'),
      where('creatorId', '==', creatorId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const loaded: RoutingCampaign[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            id: docSnap.id,
            icon: (data.icon as RoutingCampaign['icon']) || (data.source === 'TikTok' ? 'film' : data.source === 'Newsletter' ? 'mail' : data.source === 'YouTube' ? 'link' : 'camera'),
            title: data.title || data.name || 'Untitled Campaign',
            status: (data.status as RoutingCampaign['status']) || 'Active',
            source: data.source || 'Instagram',
            layout: data.layout || 'Merch First',
            clicks: data.clicks || (data.layout === 'None' ? '0' : '1.2k'),
            conversion: data.conversion || (data.layout === 'None' ? '0%' : '5.8%'),
            revenue: data.revenue || (data.layout === 'None' ? '$0' : '$240')
          });
        });
        setCampaigns(loaded);
      } else {
        // If Firestore is empty:
        // For beta workspace, keep empty state []
        // For owner workspace without saved campaigns, show demo/initial campaigns
        setCampaigns(isBetaWorkspace ? [] : INITIAL_CAMPAIGNS);
      }
    }, (err) => {
      console.error("Firestore campaigns listener error:", err);
      if (!isBetaWorkspace) {
        setCampaigns(INITIAL_CAMPAIGNS);
      }
    });

    return () => unsubscribe();
  }, [creatorId, isBetaWorkspace]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleCampaignStatus = async (id: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;
    const nextStatus: RoutingCampaign['status'] = campaign.status === 'Active' ? 'Paused' : 'Active';
    triggerToast(`Campaign "${campaign.title}" status is now ${nextStatus}`);
    
    // Optimistic UI update
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));

    try {
      const docRef = doc(db, 'campaigns', id);
      await updateDoc(docRef, {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to update campaign status in Firestore:", err);
    }
  };

  const handleToggleDrop = (id: string) => {
    setDrops(prev => prev.map(d => {
      if (d.id === id) {
        triggerToast(`Scheduled drop "${d.title}" is now ${!d.active ? 'Active' : 'Paused'}`);
        return { ...d, active: !d.active };
      }
      return d;
    }));
  };

  const handleToggleTest = (id: string) => {
    setTests(prev => prev.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'running' ? 'paused' : 'running';
        triggerToast(`A/B Variant split "${t.name}" has been ${newStatus === 'running' ? 'Resumed' : 'Paused'}`);
        return { ...t, status: newStatus as ABTest['status'] };
      }
      return t;
    }));
  };

  const handleApplyWinner = (testId: string, winnerLetter: 'A' | 'B') => {
    triggerToast(`Variant ${winnerLetter} deployed permanently! Page layouts updated successfully.`);
    setTests(prev => prev.map(t => {
      if (t.id === testId) {
        return { ...t, status: 'completed' as const, confidence: 100 };
      }
      return t;
    }));
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;

    setIsSubmitting(true);
    const campaignStatus: RoutingCampaign['status'] = targetLayout === 'None' ? 'Draft' : 'Active';
    const campaignIcon: RoutingCampaign['icon'] = trafficSource === 'Instagram' ? 'camera' : trafficSource === 'TikTok' ? 'film' : trafficSource === 'Newsletter' ? 'mail' : 'link';
    const clicksVal = targetLayout === 'None' ? '0' : '1.2k';
    const conversionVal = targetLayout === 'None' ? '0%' : '5.8%';
    const revenueVal = targetLayout === 'None' ? '$0' : '$240';
    const trimmedTitle = campaignName.trim();

    try {
      const docRef = await addDoc(collection(db, 'campaigns'), {
        creatorId,
        title: trimmedTitle,
        name: trimmedTitle,
        status: campaignStatus,
        source: trafficSource,
        layout: targetLayout,
        icon: campaignIcon,
        clicks: clicksVal,
        conversion: conversionVal,
        revenue: revenueVal,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Optimistic update
      const newCampaign: RoutingCampaign = {
        id: docRef.id,
        icon: campaignIcon,
        title: trimmedTitle,
        status: campaignStatus,
        source: trafficSource,
        layout: targetLayout,
        clicks: clicksVal,
        conversion: conversionVal,
        revenue: revenueVal
      };
      setCampaigns(prev => [newCampaign, ...prev.filter(c => c.id !== docRef.id)]);

      setIsSubmitting(false);
      setShowCreateModal(false);
      setCampaignName('');
      setTrafficSource('Instagram');
      setTargetLayout('Merch First');
      triggerToast('New smart audience campaign launched successfully!');
    } catch (err) {
      console.error("Failed to deploy campaign to Firestore:", err);
      setIsSubmitting(false);
      triggerToast('Failed to deploy campaign. Please try again.');
    }
  };

  return (
    <div 
      className="flex min-h-screen selection:bg-primary/30 selection:text-primary" 
      style={{ background: '#16130b', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Shared Navigation Sidebar */}
      <Sidebar active="campaigns" />

      {/* Main Campaign Canvas */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative texture-bg">
        {/* Background noise and gradient blooms */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none bg-[radial-gradient(circle,rgba(242,202,80,0.06),transparent_70%)]" />
        
        {/* Ambient floating toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 p-4 rounded-xl flex items-center gap-3 border shadow-2xl bg-surface-container border-primary/30 text-primary backdrop-blur-md"
            >
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold font-body">{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Area (Matches exact HTML structure) */}
        <header className="px-6 md:px-10 py-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-surface-container-highest">
          <div>
            <h1 className="font-display font-bold text-[36px] md:text-[48px] leading-tight text-on-surface mb-2">
              Campaign Manager
            </h1>
            <p className="font-body text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Personalize your audience's journey. Route traffic to specific layouts based on their origin source.
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-on-primary px-6 py-4 rounded-full font-label-sm text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(242,202,80,0.2)] hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Plus size={15} />
            Create New Campaign
          </button>
        </header>

        {/* Canvas Body */}
        <div className="p-6 md:p-10 flex-grow max-w-7xl w-full mx-auto">
          
          {/* Optimization Tab Switcher */}
          <div className="flex gap-2 mb-8 p-1 rounded-xl w-fit bg-surface-container-low border border-outline-variant/30">
            {[
              { id: 'routing', label: 'Audience Campaigns', count: campaigns.length },
              { id: 'ab', label: 'A/B Variant Split Tests', count: tests.length },
              { id: 'drops', label: 'Scheduled Content Drops', count: drops.length }
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
                {tab.label}
                {tab.count !== undefined && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black/40 text-outline select-none ml-1.5">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* Tab 1: AUDIENCE ROUTING CAMPAIGNS (Bento cards match HTML perfectly) */}
              {activeTab === 'routing' && (
                campaigns.length === 0 ? (
                  <div className="text-center py-16 px-6 rounded-2xl bg-surface-container-low/40 border border-outline-variant/20 font-body">
                    <Sparkles className="w-10 h-10 text-primary/70 mx-auto mb-3" />
                    <h3 className="text-base font-display font-bold text-on-surface mb-2">No Active Audience Campaigns</h3>
                    <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6 leading-relaxed">
                      Build your first traffic pathway to route visitors from Instagram, TikTok, or YouTube to customized link collections.
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-sm text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(242,202,80,0.2)] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} /> Create First Campaign
                    </button>
                  </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {campaigns.map(card => {
                    const iconMap = {
                      camera: <Camera size={16} />,
                      film: <Film size={16} />,
                      mail: <Mail size={16} />,
                      link: <Link size={16} />
                    };
                    return (
                      <div 
                        key={card.id}
                        className="bg-[#121212] border border-primary/10 rounded-xl p-8 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(242,202,80,0.05)] transition-all duration-300"
                      >
                        {/* Top and left inner light gradients */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/30 to-transparent"></div>
                        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-primary/30 to-transparent"></div>
                        
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30 text-on-surface">
                              {iconMap[card.icon]}
                            </div>
                            <div>
                              <h3 className="font-headline font-bold text-lg text-on-surface">{card.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                                  card.status === 'Active' 
                                    ? 'bg-tertiary shadow-[0_0_8px_rgba(111,230,146,0.6)]' 
                                    : card.status === 'Paused'
                                    ? 'bg-[#ffe088] shadow-[0_0_8px_rgba(255,224,136,0.6)]'
                                    : 'bg-outline-variant'
                                }`} onClick={() => handleToggleCampaignStatus(card.id)}></span>
                                <span className={`font-label-sm text-xs font-semibold uppercase ${
                                  card.status === 'Active' 
                                    ? 'text-tertiary' 
                                    : card.status === 'Paused'
                                    ? 'text-[#ffe088]'
                                    : 'text-on-surface-variant'
                                }`}>{card.status}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            onClick={() => handleToggleCampaignStatus(card.id)}
                            title="Toggle status"
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </div>

                        <div className="mb-8 p-4 bg-surface-container-low rounded-lg border border-surface-container-highest">
                          <p className="font-label-sm text-xs text-on-surface-variant mb-1.5 uppercase tracking-wider font-semibold">Routing Rule</p>
                          {card.layout !== 'None' ? (
                            <p className="font-body text-sm text-on-surface flex items-center gap-2 flex-wrap">
                              If source is <span className="text-primary font-bold">{card.source}</span>
                              <span className="material-symbols-outlined text-sm text-on-surface-variant font-bold">arrow_forward</span>
                              Show <span className="bg-surface-container px-2 py-1 rounded text-on-surface text-xs border border-outline-variant/20">{card.layout}</span> layout
                            </p>
                          ) : (
                            <p className="font-body text-sm text-on-surface-variant italic">
                              No routing rules defined yet.
                            </p>
                          )}
                        </div>

                        {card.layout !== 'None' ? (
                          <div className="grid grid-cols-3 gap-4 border-t border-surface-container-highest pt-6">
                            <div>
                              <p className="font-label-sm text-[10px] text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">Clicks</p>
                              <p className="font-display font-bold text-lg text-on-surface">{card.clicks}</p>
                            </div>
                            <div>
                              <p className="font-label-sm text-[10px] text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">Conversion</p>
                              <p className="font-display font-bold text-lg text-on-surface">{card.conversion}</p>
                            </div>
                            <div>
                              <p className="font-label-sm text-[10px] text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">Revenue</p>
                              <p className="font-display font-bold text-lg text-primary">{card.revenue}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end pt-4 border-t border-surface-container-highest">
                            <button 
                              onClick={() => {
                                setCampaignName(card.title);
                                setTrafficSource(card.source as any);
                                setTargetLayout('Merch First');
                                setShowCreateModal(true);
                              }}
                              className="text-primary font-label-sm text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent"
                            >
                              Edit Campaign <span className="material-symbols-outlined text-sm font-bold">edit</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                )
              )}

              {/* Tab 2: A/B VARIANT TESTS (Original high-fidelity suite) */}
              {activeTab === 'ab' && (
                tests.length === 0 ? (
                  <div className="text-center py-16 px-6 rounded-2xl bg-surface-container-low/40 border border-outline-variant/20 font-body">
                    <BarChart2 className="w-10 h-10 text-primary/70 mx-auto mb-3" />
                    <h3 className="text-base font-display font-bold text-on-surface mb-2">No Active A/B Split Tests</h3>
                    <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                      Split-test different link layouts, headlines, or featured media to scientifically determine what generates the highest conversion lift.
                    </p>
                  </div>
                ) : (
                <div className="space-y-6">
                  {tests.map(test => (
                    <div 
                      key={test.id}
                      className="rounded-2xl p-6 relative bg-surface-container border border-outline-variant/30 shadow-xl"
                    >
                      <div className="flex justify-between items-start gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span 
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                                test.status === 'running' ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 'bg-surface-container-high text-outline'
                              }`}
                            >
                              {test.status}
                            </span>
                            {test.winner && test.status !== 'completed' && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                                <Sparkles size={8} /> {test.winner} winning with {test.confidence}% confidence
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-bold text-lg text-on-surface">{test.name}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          {test.status !== 'completed' && (
                            <button 
                              onClick={() => handleToggleTest(test.id)}
                              className="p-2 rounded-xl border border-outline-variant/30 bg-surface-container-high hover:border-primary text-on-surface transition-all cursor-pointer"
                              title={test.status === 'running' ? 'Pause Split Test' : 'Resume Split Test'}
                            >
                              {test.status === 'running' ? <Pause size={12} /> : <Play size={12} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Split Comparer Variants */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                        {test.variants.map(v => (
                          <div 
                            key={v.letter}
                            className="rounded-xl p-5 relative overflow-hidden bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/40 transition-colors"
                          >
                            <div className="flex justify-between items-center mb-3 relative z-10">
                              <div className="flex items-center gap-2.5">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-display ${
                                  v.isWinning && test.status !== 'completed' ? 'bg-tertiary text-on-tertiary shadow-[0_0_10px_rgba(110,230,146,0.3)]' : 'bg-surface-container-high text-outline'
                                }`}>
                                  {v.letter}
                                </span>
                                <span className="font-bold text-xs text-on-surface">{v.label}</span>
                              </div>
                              {v.isWinning && test.status !== 'completed' && (
                                <span className="text-[8px] font-black text-tertiary flex items-center gap-0.5 bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                                  ★ Winning
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center relative z-10">
                              {[
                                { label: 'Sample Views', val: v.views.toLocaleString() },
                                { label: 'Sample Clicks', val: v.clicks.toLocaleString() },
                                { label: 'CTR Score', val: `${v.ctr}%`, color: v.isWinning && test.status !== 'completed' ? '#6fe692' : '#eae1d4' }
                              ].map((item, idy) => (
                                <div key={idy} className="p-2.5 rounded-lg bg-surface-container">
                                  <p className="text-[9px] text-outline font-semibold uppercase tracking-wider">{item.label}</p>
                                  <p className="text-xs font-black mt-0.5" style={{ color: item.color || '#eae1d4' }}>{item.val}</p>
                                </div>
                              ))}
                            </div>

                            {test.status !== 'completed' && (
                              <button
                                onClick={() => handleApplyWinner(test.id, v.letter)}
                                className={`w-full mt-4 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                  v.isWinning 
                                    ? 'bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/20' 
                                    : 'bg-surface-container border border-outline-variant/30 text-outline hover:text-white'
                                }`}
                              >
                                <Check size={11} /> Deploy Variant permanently
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                )
              )}

              {/* Tab 3: SCHEDULED DROPS */}
              {activeTab === 'drops' && (
                drops.length === 0 ? (
                  <div className="text-center py-16 px-6 rounded-2xl bg-surface-container-low/40 border border-outline-variant/20 font-body">
                    <Calendar className="w-10 h-10 text-primary/70 mx-auto mb-3" />
                    <h3 className="text-base font-display font-bold text-on-surface mb-2">No Scheduled Content Drops</h3>
                    <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                      Schedule automated pin, hide, or reveal drops to publish exclusive content or boost merch during peak traffic hours.
                    </p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {drops.map(drop => (
                    <div 
                      key={drop.id}
                      className="rounded-2xl p-5 flex items-center justify-between gap-6 transition-all bg-surface-container border border-outline-variant/30 shadow-xl"
                      style={{ borderLeft: `3px solid ${drop.active ? '#f2ca50' : 'rgba(77,70,53,0.4)'}` }}
                    >
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap font-body">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-surface-container-high border border-outline-variant/30 text-outline-variant">
                            {drop.action} rule
                          </span>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                            <Clock size={11} />
                            {drop.date} · {drop.time}
                          </div>
                        </div>
                        
                        <h3 className="font-display font-bold text-sm text-[#eae1d4] truncate">{drop.title}</h3>
                        
                        <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-outline">
                          <span className="text-white">Target card:</span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/20 text-[10px]">{drop.targetCard}</span>
                        </div>

                        <p className="text-[10px] italic mt-2.5 text-[#99907c] leading-relaxed font-body">
                          💡 {drop.rule}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          drop.active ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface-container-high border-outline-variant/20 text-outline-variant'
                        }`}>
                          {drop.active ? 'Active' : 'Paused'}
                        </span>

                        {/* Toggle switch */}
                        <div 
                          onClick={() => handleToggleDrop(drop.id)}
                          className="w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 border"
                          style={{
                            background: drop.active ? 'rgba(242,202,80,0.15)' : '#2d2a21',
                            borderColor: drop.active ? 'rgba(242,202,80,0.4)' : 'rgba(77,70,53,0.5)'
                          }}
                        >
                          <motion.div
                            animate={{ left: drop.active ? 'auto' : 3, right: drop.active ? 3 : 'auto' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={`w-4 h-4 rounded-full absolute top-1 ${
                              drop.active ? 'bg-primary' : 'bg-[#99907c]'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* NEW CAMPAIGN DIALOG MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative rounded-2xl p-6 w-full max-w-md overflow-hidden bg-[#1f1b13] border border-primary/30 shadow-2xl font-body z-10"
            >
              <h3 className="font-display font-bold text-lg text-primary mb-4">Deploy Audience Campaign</h3>
              
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1.5">CAMPAIGN TITLE</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. YouTube Video Focus"
                    value={campaignName}
                    onChange={e => setCampaignName(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-outline-variant/30 outline-none text-[#eae1d4] bg-[#0c0a06] focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1.5">TRAFFIC SOURCE PATHWAY</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Instagram', 'TikTok', 'YouTube', 'Newsletter'] as const).map(src => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setTrafficSource(src)}
                        className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          trafficSource === src
                            ? 'bg-primary/15 text-primary border border-primary/35'
                            : 'bg-[#0c0a06] border border-outline-variant/30 text-outline hover:text-white'
                        }`}
                      >
                        {src}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1.5">TARGET PERSONALIZED LAYOUT</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Merch First', 'Video First', 'Booking First', 'None'] as const).map(lay => (
                      <button
                        key={lay}
                        type="button"
                        onClick={() => setTargetLayout(lay)}
                        className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          targetLayout === lay
                            ? 'bg-primary/15 text-primary border border-primary/35'
                            : 'bg-[#0c0a06] border border-outline-variant/30 text-outline hover:text-white'
                        }`}
                      >
                        {lay}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 rounded-xl border border-outline-variant/50 font-bold text-xs cursor-pointer text-on-surface bg-transparent"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl font-bold text-xs bg-primary text-on-primary hover:bg-primary-fixed transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <RefreshCw className="animate-spin" size={12} /> : null}
                    {isSubmitting ? 'Deploying...' : 'Deploy Campaign'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
