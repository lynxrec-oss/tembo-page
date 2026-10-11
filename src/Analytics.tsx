/**
 * TEMBO PAGE — High-Fidelity Analytics Dashboard
 * 
 * Recreated precisely from the custom-designed HTML template using HSL tokens.
 * Features:
 *   - Interactive Date Range Filters (7D, 30D, 90D) which dynamically animate SVG chart vectors and update metrics.
 *   - Premium HSL Savannah glowing cards and chart-grids.
 *   - Stylized dark heat map demographics panel with country breakdowns.
 *   - Smart Pixel conversion funnel mapping page views to conversions.
 *   - Reuses the shared sidebar navigation for total visual alignment.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { db } from './firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

type DateOption = '7D' | '30D' | '90D';

interface MetricData {
  views: string;
  viewsTrend: string;
  clicks: string;
  clicksTrend: string;
  ctr: string;
  ctrTrend: string;
  conversions: string;
  conversionsTrend: string;
  viewsPath: string;
  viewsAreaPath: string;
  clicksPath: string;
}

const METRICS_MAP: Record<DateOption, MetricData> = {
  '7D': {
    views: '28.4K',
    viewsTrend: '14.2%',
    clicks: '9.8K',
    clicksTrend: '10.5%',
    ctr: '34.5%',
    ctrTrend: '+0.7%',
    conversions: '840',
    conversionsTrend: '28.4%',
    viewsPath: 'M0,70 Q20,80 40,40 T60,50 T80,20 T100,30',
    viewsAreaPath: 'M0,70 Q20,80 40,40 T60,50 T80,20 T100,30 L100,100 L0,100 Z',
    clicksPath: 'M0,85 Q15,65 30,55 T50,60 T70,40 T90,45 T100,35'
  },
  '30D': {
    views: '124.5K',
    viewsTrend: '12.4%',
    clicks: '42.1K',
    clicksTrend: '8.2%',
    ctr: '33.8%',
    ctrTrend: '0.0%',
    conversions: '3,420',
    conversionsTrend: '24.1%',
    viewsPath: 'M0,80 Q10,75 20,60 T40,50 T60,20 T80,30 T100,10',
    viewsAreaPath: 'M0,80 Q10,75 20,60 T40,50 T60,20 T80,30 T100,10 L100,100 L0,100 Z',
    clicksPath: 'M0,90 Q15,85 30,70 T50,75 T70,50 T90,60 T100,40'
  },
  '90D': {
    views: '382.1K',
    viewsTrend: '16.8%',
    clicks: '129.4K',
    clicksTrend: '11.3%',
    ctr: '33.9%',
    ctrTrend: '+0.1%',
    conversions: '10,950',
    conversionsTrend: '31.2%',
    viewsPath: 'M0,85 Q15,60 30,40 T50,45 T70,15 T90,25 T100,5',
    viewsAreaPath: 'M0,85 Q15,60 30,40 T50,45 T70,15 T90,25 T100,5 L100,100 L0,100 Z',
    clicksPath: 'M0,95 Q20,80 40,60 T60,65 T80,35 T90,40 T100,20'
  }
};

export default function Analytics() {
  const [dateRange, setDateRange] = useState<DateOption>('30D');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');

  const isBeta = typeof window !== 'undefined' && localStorage.getItem('beta_bypass') === 'true';
  const creatorId = (typeof window !== 'undefined' && localStorage.getItem('active_creator_id')) || (isBeta ? 'beta-tester' : 'mycinetoolbox');

  const [liveAnalytics, setLiveAnalytics] = useState<{
    views: number;
    clicks: number;
    conversions: number;
    referrers: Record<string, number>;
  }>({
    views: 0,
    clicks: 0,
    conversions: 0,
    referrers: {
      tiktok: 0,
      instagram: 0,
      youtube: 0,
      newsletter: 0,
      direct: 0
    }
  });

  useEffect(() => {
    const q = query(
      collection(db, 'analytics'),
      where('creatorId', '==', creatorId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let vCount = 0;
      let cCount = 0;
      let convCount = 0;
      const refs: Record<string, number> = {
        tiktok: 0,
        instagram: 0,
        youtube: 0,
        newsletter: 0,
        direct: 0
      };

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.eventType === 'view') {
          vCount++;
        } else if (data.eventType === 'click') {
          cCount++;
        } else if (data.eventType === 'conversion') {
          convCount++;
        } else if (data.eventType === 'handshake') {
          convCount++;
        }

        const src = (data.source || data.pathway || 'direct').toLowerCase();
        if (src.includes('tiktok')) refs.tiktok = (refs.tiktok || 0) + 1;
        else if (src.includes('instagram')) refs.instagram = (refs.instagram || 0) + 1;
        else if (src.includes('youtube')) refs.youtube = (refs.youtube || 0) + 1;
        else if (src.includes('newsletter') || src.includes('email') || src.includes('mail')) refs.newsletter = (refs.newsletter || 0) + 1;
        else refs.direct = (refs.direct || 0) + 1;
      });

      setLiveAnalytics({
        views: vCount,
        clicks: cCount,
        conversions: convCount,
        referrers: refs
      });
    }, (err) => {
      console.error("Firestore Analytics onSnapshot error:", err);
    });

    return () => unsubscribe();
  }, [creatorId]);

  const scaleMetric = (metricStr: string, percentage: number): string => {
    if (metricStr.endsWith('K')) {
      const num = parseFloat(metricStr.slice(0, -1));
      return (num * percentage).toFixed(1) + 'K';
    }
    const cleaned = metricStr.replace(/,/g, '');
    const num = parseInt(cleaned, 10);
    if (!isNaN(num)) {
      return Math.round(num * percentage).toLocaleString();
    }
    return metricStr;
  };

  const totalEvents = liveAnalytics.views + liveAnalytics.clicks + liveAnalytics.conversions;
  const hasLiveData = isBeta || totalEvents > 0;

  const viewsNum = liveAnalytics.views;
  const clicksNum = liveAnalytics.clicks;
  const convNum = liveAnalytics.conversions;

  const ctrRatio = viewsNum > 0 ? ((clicksNum / viewsNum) * 100).toFixed(1) : '0.0';
  const step1To2Drop = viewsNum > 0 ? (clicksNum >= viewsNum ? 0 : Math.round((1 - clicksNum / viewsNum) * 100)) : 0;
  const step2To3Drop = clicksNum > 0 ? (convNum >= clicksNum ? 0 : Math.round((1 - convNum / clicksNum) * 100)) : (viewsNum > 0 ? 100 : 0);
  const overallConvRate = viewsNum > 0 ? ((convNum / viewsNum) * 100).toFixed(1) : '0.0';

  const getMetricData = () => {
    if (hasLiveData) {
      const hasTraffic = viewsNum > 0 || clicksNum > 0;
      return {
        views: viewsNum.toLocaleString(),
        viewsTrend: viewsNum > 0 ? '+100%' : '0.0%',
        clicks: clicksNum.toLocaleString(),
        clicksTrend: clicksNum > 0 ? '+100%' : '0.0%',
        ctr: `${ctrRatio}%`,
        ctrTrend: clicksNum > 0 ? '+0.4%' : '0.0%',
        conversions: convNum.toLocaleString(),
        conversionsTrend: convNum > 0 ? '+100%' : '0.0%',
        viewsPath: hasTraffic ? 'M0,80 Q25,60 50,40 T75,30 T100,20' : 'M0,100 L100,100',
        viewsAreaPath: hasTraffic ? 'M0,80 Q25,60 50,40 T75,30 T100,20 L100,100 L0,100 Z' : 'M0,100 L100,100 L100,100 L0,100 Z',
        clicksPath: hasTraffic ? 'M0,90 Q25,80 50,65 T75,50 T100,45' : 'M0,100 L100,100'
      };
    }

    const base = METRICS_MAP[dateRange];
    if (selectedCountry === 'ALL') return base;
    
    let pct = 1.0;
    if (selectedCountry === 'US') pct = 0.45;
    else if (selectedCountry === 'UK') pct = 0.22;
    else if (selectedCountry === 'ZA') pct = 0.12;

    return {
      ...base,
      views: scaleMetric(base.views, pct),
      clicks: scaleMetric(base.clicks, pct),
      conversions: scaleMetric(base.conversions, pct),
    };
  };

  const activeData = getMetricData();

  return (
    <div className="bg-background text-on-surface font-body-md antialiased bg-texture-elephant h-screen flex selection:bg-primary selection:text-on-primary w-full overflow-hidden">
      {/* Dynamic styles injection for customized Saas dashboard visuals */}
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }
        
        .bg-texture-elephant {
            background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.04"/></svg>');
        }
        
        .glowing-card {
            background-color: #121212;
            border: 1px solid rgba(242, 202, 80, 0.1);
            border-top: 1px solid rgba(242, 202, 80, 0.3);
            border-left: 1px solid rgba(242, 202, 80, 0.3);
            box-shadow: 0 4px 20px -2px rgba(242, 202, 80, 0.05);
            position: relative;
            overflow: hidden;
        }
        
        .glowing-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at top left, rgba(242, 202, 80, 0.08) 0%, transparent 50%);
            pointer-events: none;
        }

        .chart-grid {
            background-image: 
                linear-gradient(to right, rgba(234, 225, 212, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(234, 225, 212, 0.05) 1px, transparent 1px);
            background-size: 40px 40px;
        }
      `}} />

      {/* SideNavBar - Shared Component */}
      <Sidebar active="analytics" />

      {/* Main Canvas */}
      <main className="flex-1 w-full relative h-screen overflow-y-auto overflow-x-hidden flex flex-col px-6 md:px-10 py-1 custom-scrollbar" style={{ maxHeight: '100vh' }}>
        {/* TopAppBar (Mobile Only) */}
        <div className="md:hidden sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            <h1 className="text-headline-md font-headline-md text-primary font-bold">Analytics</h1>
          </div>
          <button 
            className="text-on-surface-variant"
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface-container border-b border-primary/10 overflow-hidden flex flex-col p-4 gap-2 z-40"
            >
              {[
                { label: 'Dashboard', hash: '#/dashboard', icon: 'dashboard' },
                { label: 'Profile', hash: '#/profile', icon: 'person' },
                { label: 'Page Builder', hash: '#/builder', icon: 'auto_fix_high' },
                { label: 'Analytics', hash: '#/analytics', icon: 'insights', active: true },
                { label: 'Campaigns', hash: '#/campaigns', icon: 'campaign' },
                { label: 'Settings', hash: '#/settings', icon: 'settings' }
              ].map(item => (
                <a 
                  key={item.label}
                  href={item.hash}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${item.active ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Area */}
        <header className="px-2 md:px-4 py-8 md:py-12 max-w-container-max-width mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Performance Metrics</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Detailed insights into your digital savanna's engagement and traffic sources over the last {dateRange === '7D' ? '7' : dateRange === '30D' ? '30' : '90'} days.
              </p>
            </div>
            
            {/* Range switcher & Export */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="bg-surface-container-high rounded-lg p-1 flex border border-outline-variant/30">
                {(['7D', '30D', '90D'] as DateOption[]).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setDateRange(opt)}
                    className={`px-4 py-2 rounded-md font-label-sm text-label-sm transition-all duration-200 cursor-pointer ${
                      dateRange === opt 
                        ? 'bg-surface-variant text-on-surface shadow-sm font-semibold' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button className="h-10 px-4 rounded-lg border border-outline-variant/50 text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-lg">download</span>
                Export
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-2 md:px-4 pb-24 max-w-container-max-width mx-auto flex flex-col gap-8 w-full">
          
          {/* Key Totals Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Views */}
            <div className="glowing-card rounded-xl p-6 transition-all hover:-translate-y-1 duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-body-md text-body-md text-on-surface-variant">Total Views</h3>
                <span className="material-symbols-outlined text-primary/70">visibility</span>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="font-display-md text-display-md text-primary font-bold">{activeData.views}</p>
                <span className="font-label-sm text-label-sm text-tertiary flex items-center bg-tertiary/10 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> {activeData.viewsTrend}
                </span>
              </div>
            </div>

            {/* Total Clicks */}
            <div className="glowing-card rounded-xl p-6 transition-all hover:-translate-y-1 duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-body-md text-body-md text-on-surface-variant">Total Clicks</h3>
                <span className="material-symbols-outlined text-primary/70">ads_click</span>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="font-display-md text-display-md text-primary font-bold">{activeData.clicks}</p>
                <span className="font-label-sm text-label-sm text-tertiary flex items-center bg-tertiary/10 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> {activeData.clicksTrend}
                </span>
              </div>
            </div>

            {/* CTR */}
            <div className="glowing-card rounded-xl p-6 transition-all hover:-translate-y-1 duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-body-md text-body-md text-on-surface-variant">Avg. CTR</h3>
                <span className="material-symbols-outlined text-primary/70">percent</span>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="font-display-md text-display-md text-on-surface font-bold">{activeData.ctr}</p>
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center bg-surface-variant px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px] mr-0.5">trending_flat</span> {activeData.ctrTrend}
                </span>
              </div>
            </div>

            {/* Conversions */}
            <div className="glowing-card rounded-xl p-6 transition-all hover:-translate-y-1 duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-body-md text-body-md text-on-surface-variant">Conversions</h3>
                <span className="material-symbols-outlined text-primary/70">monetization_on</span>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="font-display-md text-display-md text-primary font-bold">{activeData.conversions}</p>
                <span className="font-label-sm text-label-sm text-tertiary flex items-center bg-tertiary/10 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> {activeData.conversionsTrend}
                </span>
              </div>
            </div>

          </div>

          {/* Bento Grid Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Time-series Chart (Span 2) */}
            <div className="lg:col-span-2 glowing-card rounded-xl p-6 md:p-8 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Traffic Overview</h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Views vs Clicks over time</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(242,202,80,0.6)]"></div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-tertiary shadow-[0_0_8px_rgba(111,230,146,0.6)]"></div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Clicks</span>
                  </div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="flex-1 relative chart-grid border-l border-b border-outline-variant/20 mt-4 mb-2 ml-10">
                {/* Y-Axis Labels */}
                <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-on-surface-variant font-label-sm text-[10px] py-2">
                  <span>{dateRange === '90D' ? '45k' : dateRange === '7D' ? '4k' : '15k'}</span>
                  <span>{dateRange === '90D' ? '30k' : dateRange === '7D' ? '2.5k' : '10k'}</span>
                  <span>{dateRange === '90D' ? '15k' : dateRange === '7D' ? '1k' : '5k'}</span>
                  <span>0</span>
                </div>
                {/* X-Axis Labels */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-on-surface-variant font-label-sm text-[10px] px-2 md:px-4">
                  <span>{dateRange === '7D' ? 'Mon' : dateRange === '90D' ? 'Month 1' : 'Oct 1'}</span>
                  <span>{dateRange === '7D' ? 'Tue' : dateRange === '90D' ? 'Month 2' : 'Oct 8'}</span>
                  <span>{dateRange === '7D' ? 'Wed' : dateRange === '90D' ? 'Month 3' : 'Oct 15'}</span>
                  <span>{dateRange === '7D' ? 'Thu' : dateRange === '90D' ? 'Month 4' : 'Oct 22'}</span>
                  <span>{dateRange === '7D' ? 'Fri' : dateRange === '90D' ? 'Month 5' : 'Oct 30'}</span>
                </div>
                {/* Data Lines (SVG Simulation) */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <AnimatePresence mode="wait">
                    {/* Views Area Under Fill */}
                    <motion.path 
                      key={`views-area-${dateRange}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      d={activeData.viewsAreaPath} 
                      fill="url(#gold-gradient)"
                    />
                    
                    {/* Views Line (Gold) */}
                    <motion.path 
                      key={`views-${dateRange}`}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      d={activeData.viewsPath} 
                      fill="none" 
                      stroke="rgba(242,202,80,0.8)" 
                      strokeWidth="2" 
                      vectorEffect="non-scaling-stroke"
                    />
                    
                    {/* Clicks Line (Emerald) */}
                    <motion.path 
                      key={`clicks-${dateRange}`}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                      d={activeData.clicksPath} 
                      fill="none" 
                      stroke="rgba(111,230,146,0.8)" 
                      strokeWidth="2" 
                      vectorEffect="non-scaling-stroke"
                    />
                  </AnimatePresence>

                  <defs>
                    <linearGradient id="gold-gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#f2ca50"></stop>
                      <stop offset="100%" stopColor="transparent"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="lg:col-span-1 glowing-card rounded-xl p-6 md:p-8 flex flex-col">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1 font-bold">Device Breakdown</h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-8">
                {isBeta ? 'Traffic source by hardware type (Awaiting telemetry)' : 'Traffic source by hardware type'}
              </p>
              <div className="flex-1 flex flex-col justify-center gap-6">
                
                {/* Mobile Stat */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-high border border-outline-variant/10 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">smartphone</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-body-md text-body-md text-on-surface">Mobile</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">{isBeta ? '0%' : '68%'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: isBeta ? '0%' : '68%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Desktop Stat */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-high border border-outline-variant/10 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
                  <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined">desktop_windows</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-body-md text-body-md text-on-surface">Desktop</span>
                      <span className="font-headline-sm text-headline-sm text-tertiary font-bold">{isBeta ? '0%' : '32%'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary" style={{ width: isBeta ? '0%' : '32%' }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Geographic Source Map */}
            <div className="lg:col-span-1 glowing-card rounded-xl p-6 flex flex-col h-[350px] relative overflow-hidden group">
              <div className="z-10 relative">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-1 font-bold">Geographic Sources</h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {isBeta ? 'Awaiting visitor geolocation data' : 'Top engaging regions'}
                </p>
              </div>
              
              {/* Stylized Map Background */}
              <div 
                className="absolute inset-0 top-16 opacity-40 group-hover:opacity-60 transition-opacity duration-500 bg-cover bg-center" 
                style={{ 
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC69e8AA2LPIzWr3kqomPv91o0aRlq2ztLyCiGxUGu0Maa6HobhhkN5HtQ1tM737PJ5bBpNOpittuAYXPiXP8nERDP23nNI8wx_jxEm5L6b20AKox2qOdqqYzmy1N8Rk81iXUFez3KiCD9aO7zdrPuI_K9hCHFClSGgI--tQ5s9VkuH9pACRidWa1W2oaRjqBZsjLtJruThHewpe1svq_4-1P9yfm2sXX-Bprrb1ngIeWb4FHZXH1yNb8dK7krhz9L7JoTAX5S0C30')" 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent"></div>
              </div>

              {/* Top Countries List Overlay */}
              <div className="relative z-10 mt-auto flex flex-col gap-3">
                {[
                  { code: 'US', flag: '🇺🇸', name: 'United States', share: isBeta ? '0%' : '45%' },
                  { code: 'UK', flag: '🇬🇧', name: 'United Kingdom', share: isBeta ? '0%' : '22%' },
                  { code: 'ZA', flag: '🇿🇦', name: 'South Africa', share: isBeta ? '0%' : '12%' },
                ].map(c => {
                  const isActive = selectedCountry === c.code;
                  return (
                    <button
                      key={c.code}
                      onClick={() => !isBeta && setSelectedCountry(curr => curr === c.code ? 'ALL' : c.code)}
                      className={`w-full flex items-center justify-between p-3 rounded bg-[#121212]/90 backdrop-blur-md border transition-all duration-200 hover:border-primary/45 cursor-pointer text-left ${
                        isActive 
                          ? 'border-primary shadow-[0_0_12px_rgba(242,202,80,0.2)] bg-[#1d1910]/95' 
                          : 'border-outline-variant/20 hover:bg-[#121212]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{c.flag}</span>
                        <span className={`font-body-md text-body-md ${isActive ? 'text-primary font-bold' : 'text-on-surface'}`}>{c.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isActive && <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider">Filtered</span>}
                        <span className={`font-label-sm text-label-sm ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{c.share}</span>
                      </div>
                    </button>
                  );
                })}
                {!isBeta && selectedCountry !== 'ALL' && (
                  <button
                    onClick={() => setSelectedCountry('ALL')}
                    className="text-center font-mono text-[9px] uppercase tracking-wider text-primary hover:underline mt-1 cursor-pointer bg-transparent border-none"
                  >
                    Clear Country Filter
                  </button>
                )}
              </div>
            </div>

            {/* Conversion Funnel Visualization */}
            <div className="lg:col-span-2 glowing-card rounded-xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-primary">track_changes</span>
                    Smart Pixel Funnel
                  </h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">User journey drop-off analysis</p>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm border border-primary/20">
                  {hasLiveData ? (viewsNum > 0 ? 'Pixel Tracking Active' : 'Awaiting Conversions') : 'High Performing'}
                </span>
              </div>
              
              <div className="flex flex-col gap-4">
                
                {/* Funnel Step 1 */}
                <div className="relative">
                  <div className="bg-surface-container-high rounded-lg p-4 flex items-center justify-between border-l-4 border-primary z-10 relative">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-sm">1</div>
                      <div>
                        <h4 className="font-body-md text-body-md text-on-surface font-semibold">Page Landed</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Unique Visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold">{hasLiveData ? viewsNum.toLocaleString() : '124,500'}</p>
                      <p className="font-label-sm text-label-sm text-tertiary font-bold">{hasLiveData ? (viewsNum > 0 ? '100%' : '0.0%') : '100%'}</p>
                    </div>
                  </div>
                </div>

                {/* Funnel Drop-off indicator */}
                <div className="flex justify-center -my-2 z-0 relative">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-primary/30 to-outline-variant/30"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 bg-surface-container text-on-surface-variant font-label-sm text-[10px] px-2 py-0.5 rounded border border-outline-variant/30">
                    {hasLiveData ? `-${step1To2Drop}% Drop-off` : '-34% Drop-off'}
                  </div>
                </div>

                {/* Funnel Step 2 */}
                <div className="relative w-[90%] mx-auto">
                  <div className="bg-surface-container-high rounded-lg p-4 flex items-center justify-between border-l-4 border-primary/80 z-10 relative">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-sm">2</div>
                      <div>
                        <h4 className="font-body-md text-body-md text-on-surface font-semibold">Link Clicked</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Engaged Users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold">{hasLiveData ? clicksNum.toLocaleString() : '82,170'}</p>
                      <p className="font-label-sm text-label-sm text-primary font-bold">{hasLiveData ? `${ctrRatio}%` : '66%'}</p>
                    </div>
                  </div>
                </div>

                {/* Funnel Drop-off indicator */}
                <div className="flex justify-center -my-2 z-0 relative">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-primary/20 to-outline-variant/30"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 bg-surface-container text-on-surface-variant font-label-sm text-[10px] px-2 py-0.5 rounded border border-outline-variant/30">
                    {hasLiveData ? `-${step2To3Drop}% Drop-off` : '-95% Drop-off'}
                  </div>
                </div>

                {/* Funnel Step 3 */}
                <div className="relative w-[80%] mx-auto">
                  <div className="bg-surface-container-high rounded-lg p-4 flex items-center justify-between border-l-4 border-tertiary z-10 relative shadow-[0_0_20px_rgba(111,230,146,0.1)]">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary font-label-sm">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div>
                        <h4 className="font-body-md text-body-md text-on-surface font-semibold">Conversion</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Smart Pixel Fired</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline-sm text-headline-sm text-tertiary font-bold">{hasLiveData ? convNum.toLocaleString() : '3,420'}</p>
                      <p className="font-label-sm text-label-sm text-tertiary font-bold">{hasLiveData ? `${overallConvRate}% Overall` : '2.7% Overall'}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
