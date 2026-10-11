/**
 * TEMBO PAGE — Blog & Creator Journal
 * 
 * Beautiful marketing journal page styled under the Savannah Sunset design system.
 * Includes category pills, featured articles, live query search, and an interactive 
 * inline reading drawer that opens articles instantly inside the page context.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, Calendar, Clock, ArrowRight, Heart, Star, 
  Share2, ChevronRight, X, User, ArrowLeft, Bookmark, Menu
} from 'lucide-react';
import { TemboBrand } from './TemboBrand';

interface BlogPost {
  id: string;
  category: 'ai' | 'pixel' | 'growth' | 'security';
  categoryLabel: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
    color: string;
  };
  featured: boolean;
  color: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'ai-advisors',
    category: 'ai',
    categoryLabel: 'AI Wisdom',
    title: 'How Serverless Vertex AI Powers Digital Watering Holes at 2 AM',
    excerpt: 'Behind the scenes of training lightweight LLM parameters to represent creator brands contextually, politely, and automatically while you sleep.',
    content: [
      'In the digital savannah, creator attention is the most finite resource. Traditional Link-in-Bio pages act as static, cold directories—expecting visitors to dig through lists of external folders to find what they need. We knew there had to be a warmer, more human way.',
      'That is why we designed Tembo Chat: an intelligent, serverless Vertex AI Gemini bubble embedded on every creator’s profile. Instead of a sterile list of urls, visitors can ask, "Where can I find her latest art course?" or "Does he do custom brand deals?" and receive a friendly response trained in the creator\'s own brand metaphors.',
      'Our backend orchestrates these interactions through secure Cloud Functions that load dynamic vector indexes on the fly. This keeps bandwidth lightweight (under 2KB payload) while unlocking robust contextual intelligence. An elephant never forgets—neither should your bio link.'
    ],
    date: 'May 24, 2026',
    readTime: '5 min read',
    author: {
      name: 'Alesia Sterling',
      role: 'AI Research Lead',
      avatarInitials: 'AS',
      color: 'linear-gradient(135deg, #a78bfa, #c084fc)'
    },
    featured: true,
    color: 'linear-gradient(135deg, rgba(242,202,80,0.15), rgba(255,224,136,0.05))'
  },
  {
    id: 'smart-pixel',
    category: 'pixel',
    categoryLabel: 'Pixel Integration',
    title: 'Silent Footprints: Attributing CTR Conversions Without Cookie Friction',
    excerpt: 'How our 2.8KB Smart Pixel maps event pathways and referral segments serverlessly while maintaining absolute privacy standard compliance.',
    content: [
      'With public privacy regulations tightening and browser cookie deprecation on the horizon, creators need a modern way to measure conversions without violating user trust. Traditional tracking tags drag heavy scripts and prompt intrusive cookie consents.',
      'Our solution is the Tembo Smart Pixel. Occupying only 2.8KB of asynchronously loaded Javascript, the pixel registers referrers (e.g. knowing a click arrived from a specific TikTok drop) and aggregates CTRs into a single metadata document.',
      'Because all event flows are dispatched through anonymized serverless firewalls, we never track user footprints across other sites, drop cross-origin cookies, or compromise private devices. Elegant data integrity built for the modern creator.'
    ],
    date: 'May 20, 2026',
    readTime: '4 min read',
    author: {
      name: 'Lead Systems Architect',
      role: 'Core Engineering',
      avatarInitials: 'ZV',
      color: 'linear-gradient(135deg, #10b981, #6fe692)'
    },
    featured: false,
    color: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(111,230,146,0.02))'
  },
  {
    id: 'static-to-living',
    category: 'growth',
    categoryLabel: 'Growth & Scaling',
    title: 'From Cold Directories to Living digital Watering Holes',
    excerpt: 'Why static link trees are failing modern conversion metrics and how to cultivate traffic personalization for peak active audiences.',
    content: [
      'A static directory is where creator conversions go to die. Expected CTR margins shrink by up to 40% when users are hit with a wall of 15 unorganized, standard link buttons. The human brain craves visual hierarchy and contextual relevance.',
      'By implementing traffic-aware routing profiles, Tembo Page detects the incoming visitor segment in real time. If they click from a YouTube video description, we prioritize masterclass video player boxes. If they arrive from a newsletter link, we prioritize scheduling forms first.',
      'Our creators have registered up to a 28% increase in email subscriptions and course sales simply by introducing dynamic bento structures. Let your page think—so your conversions can soar.'
    ],
    date: 'May 15, 2026',
    readTime: '6 min read',
    author: {
      name: 'Nia Adebayo',
      role: 'Growth Strategy Lead',
      avatarInitials: 'NA',
      color: 'linear-gradient(135deg, #f2ca50, #ffe088)'
    },
    featured: false,
    color: 'linear-gradient(135deg, rgba(242,202,80,0.1), rgba(255,224,136,0.02))'
  },
  {
    id: 'cname-security',
    category: 'security',
    categoryLabel: 'Domain & Security',
    title: 'CNAME Domains & Global SSL: Safeguarding Creator Brand Equity',
    excerpt: 'Understanding custom DNS configurations, safe Firebase storage isolation, and how mapping personal domains builds visitor trust.',
    content: [
      'Trust is the currency of creator commerce. Sending an audience to a generic link subpath can raise alarms. A custom branded CNAME domain (e.g. bio.yourbrand.com) immediately reassures visitors.',
      'Under the hood, we manage secure domain provisioning via automated Cloudflare edge hooks. When a creator maps a custom CNAME, our backend automatically generates SSL certificates, handles validation pings, and distributes the landing page files across edge networks.',
      'This guarantees that your public pages not only look incredibly professional, but operate with absolute end-to-end HTTPS encryption, protecting checkout pipelines and visitor metadata.'
    ],
    date: 'May 10, 2026',
    readTime: '4 min read',
    author: {
      name: 'Core Systems herd',
      role: 'Infrastructure',
      avatarInitials: 'CS',
      color: 'linear-gradient(135deg, #a78bfa, #c084fc)'
    },
    featured: false,
    color: 'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(192,132,252,0.02))'
  }
];

export default function Blog() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  // Filter posts based on search and category
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.some(paragraph => paragraph.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = BLOG_POSTS.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured || selectedCategory !== 'all');

  return (
    <div 
      className="relative min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden" 
      style={{ background: '#0c0c0e', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Global Noise Overlay and Lighting */}
      <div className="fixed inset-0 noise-texture z-[99] pointer-events-none opacity-25" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full blur-[180px] opacity-[0.04] bg-primary pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] rounded-full blur-[180px] opacity-[0.03] bg-primary pointer-events-none z-0" />

      {/* Dynamic Keyframe Injection */}
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
            <a href="#/login" className="text-sm font-medium px-4 py-2 hover:text-primary transition-colors text-decoration-none" style={{ color: '#eae1d4' }}>Log In</a>
            <a href="#/onboarding" className="glow-button bg-primary text-[#3c2f00] text-sm font-bold px-5 py-2.5 rounded-full text-decoration-none">Join Tembo</a>
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
                  <a href="#/onboarding" className="w-full text-center text-sm font-bold py-2.5 rounded-full glow-button bg-primary text-[#3c2f00] text-decoration-none">Join Tembo</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-16 relative z-10">
        
        {/* Title Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto select-none">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <BookOpen size={30} />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-[#eae1d4] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            The Savannah <span className="text-gradient-gold">Journal.</span>
          </h1>
          <p className="text-xs text-[#c9bfab] leading-relaxed">
            Developer updates, split-test strategies, AI chatbot models, and stories from our creators scaling directories in the digital savannah.
          </p>
        </div>

        {/* Categories & Search Grid Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-[#4d4635]/20 pb-8 font-body">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 select-none">
            {[
              { id: 'all',      label: 'All Journal Entries' },
              { id: 'ai',       label: 'AI Wisdom' },
              { id: 'pixel',    label: 'Smart Pixel & Code' },
              { id: 'growth',   label: 'Growth & Split-Testing' },
              { id: 'security', label: 'CNAMES & Security' }
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-[#3c2f00] border-primary'
                    : 'bg-surface-container/30 border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-primary/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar input */}
          <div className="relative w-full md:w-80 shrink-0">
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#16130b] border border-outline-variant/30 rounded-full py-2.5 pl-10 pr-4 text-xs text-[#eae1d4] focus:outline-none focus:border-primary/50 transition-all"
              style={{ border: '1px solid rgba(77,70,53,0.4)' }}
            />
            <Search size={14} className="absolute left-4 top-3 text-[#99907c]" />
          </div>
        </div>

        {/* FEATURED POST SECTION (Top visual callout, only shown when category is "all" and search is empty) */}
        {selectedCategory === 'all' && !searchQuery && featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glow-card border border-outline-variant/20 rounded-2xl p-6 md:p-10 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer relative overflow-hidden"
            onClick={() => setActiveArticle(featuredPost)}
            style={{ background: featuredPost.color }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-[0.06] bg-primary pointer-events-none" />
            
            {/* Visual branding stamp representation */}
            <div className="lg:col-span-5 aspect-[16/10] bg-[#0c0c0e] rounded-xl border border-primary/10 flex items-center justify-center relative select-none">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(242,202,80,0.08),transparent)]" />
              <div className="flex flex-col items-center gap-4 text-center">
                <TemboBrand iconSize={64} showWordmark={false} iconOnly={true} />
                <span className="text-[10px] font-bold tracking-widest uppercase text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">
                  Featured Article
                </span>
              </div>
            </div>

            {/* Post data */}
            <div className="lg:col-span-7 flex flex-col h-full justify-center font-body">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
                <span>{featuredPost.categoryLabel}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4d4635]" />
                <span className="text-[#99907c]">{featuredPost.date}</span>
              </div>

              <h2 className="text-xl md:text-3xl font-display font-black text-[#eae1d4] leading-tight mb-4 group-hover:text-primary transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {featuredPost.title}
              </h2>

              <p className="text-xs text-[#c9bfab] leading-relaxed mb-6">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#4d4635]/20">
                {/* Author badge */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs text-[#3c2f00]" style={{ background: featuredPost.author.color }}>
                    {featuredPost.author.avatarInitials}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-[#eae1d4]">{featuredPost.author.name}</h4>
                    <p className="text-[9px] text-[#99907c] mt-0.5">{featuredPost.author.role}</p>
                  </div>
                </div>

                <div className="text-xs font-bold text-primary inline-flex items-center gap-1">
                  Read Full Entry
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ARTICLE LIST GRID */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-body">
            {regularPosts.map((post) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glow-card border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                onClick={() => setActiveArticle(post)}
                style={{ background: post.featured ? post.color : 'rgba(22,19,11,0.85)' }}
              >
                <div>
                  {/* Category, Date & Read Time */}
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-primary mb-4 select-none">
                    <span>{post.categoryLabel}</span>
                    <span className="text-[#99907c]">{post.date}</span>
                  </div>

                  <h3 className="text-sm md:text-base font-display font-bold text-[#eae1d4] leading-snug mb-3 group-hover:text-primary transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#c9bfab] leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card footer block */}
                <div className="flex items-center justify-between pt-4 border-t border-[#4d4635]/20 mt-4 select-none">
                  {/* Author initials */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-[9px] text-[#3c2f00]" style={{ background: post.author.color }}>
                      {post.author.avatarInitials}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-[#eae1d4]">{post.author.name}</h4>
                      <p className="text-[8px] text-[#99907c]">{post.author.role}</p>
                    </div>
                  </div>
                  
                  <div className="text-[10px] font-bold text-primary flex items-center gap-1">
                    Read
                    <ChevronRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glow-card border border-outline-variant/30 rounded-2xl select-none font-body">
            <BookOpen size={36} className="mx-auto mb-4 text-[#99907c]" />
            <h3 className="text-sm font-bold text-[#eae1d4] mb-1">No Journal Entries Found</h3>
            <p className="text-xs text-[#c9bfab]">Try adjusting or clearing your search filter parameters.</p>
          </div>
        )}

      </main>

      {/* INLINE ARTICLE READING DRAWER VIEW (Seamless UX) */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Reading Pane Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl h-screen bg-[#121008] border-l border-primary/20 shadow-2xl z-10 flex flex-col justify-between font-body overflow-y-auto"
            >
              
              {/* Top sticky controls */}
              <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-[#4d4635]/30 p-6 flex justify-between items-center bg-[#121008]/90">
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="flex items-center gap-2 text-xs font-semibold text-[#c9bfab] hover:text-primary transition-colors cursor-pointer bg-transparent border-none focus:outline-none"
                >
                  <ArrowLeft size={16} />
                  Back to Journal
                </button>
                
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-lg border border-outline-variant/30 hover:border-primary/30 text-[#99907c] hover:text-primary transition-colors cursor-pointer bg-transparent">
                    <Bookmark size={15} />
                  </button>
                  <button 
                    onClick={() => setActiveArticle(null)}
                    className="p-2.5 rounded-lg border border-outline-variant/30 hover:border-primary/30 text-[#99907c] hover:text-white transition-colors cursor-pointer bg-transparent"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Main reading viewport */}
              <div className="flex-grow p-8 md:p-12 space-y-8 select-text">
                
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <span>{activeArticle.categoryLabel}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4d4635]" />
                  <span className="text-[#99907c]">{activeArticle.date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4d4635]" />
                  <span className="text-[#99907c]">{activeArticle.readTime}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-4xl font-display font-black text-[#eae1d4] leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {activeArticle.title}
                </h1>

                {/* Author block details */}
                <div className="flex items-center gap-4 py-6 border-y border-[#4d4635]/20 select-none">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs text-[#3c2f00]" style={{ background: activeArticle.author.color }}>
                    {activeArticle.author.avatarInitials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#eae1d4]">{activeArticle.author.name}</h4>
                    <p className="text-[10px] text-[#99907c] mt-0.5">{activeArticle.author.role}</p>
                  </div>
                </div>

                {/* Paragraph Content */}
                <div className="text-sm text-[#c9bfab] leading-relaxed space-y-6">
                  {activeArticle.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

              </div>

              {/* Footer support card */}
              <div className="p-8 md:p-12 border-t border-[#4d4635]/30 bg-[#0c0c0e] select-none text-center">
                <TemboBrand iconSize={36} showWordmark={false} iconOnly={true} className="mx-auto mb-4" />
                <h4 className="text-xs font-display font-bold text-[#eae1d4] mb-2 uppercase tracking-wider">Join our intelligence revolution</h4>
                <p className="text-[11px] text-[#99907c] leading-relaxed max-w-sm mx-auto mb-6">
                  Are you ready to transition from raw link trees to live, thinking profile directories?
                </p>
                <a 
                  href="#/onboarding" 
                  onClick={() => setActiveArticle(null)}
                  className="inline-flex py-3.5 px-8 bg-primary text-[#3c2f00] rounded-full font-display font-bold text-xs uppercase tracking-wider glow-button text-decoration-none"
                >
                  Create Your Free Page
                </a>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#0c0c0e]/80 border-t border-primary/5 py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-body">
          <div className="flex items-center gap-3">
            <TemboBrand iconSize={18} showWordmark={false} iconOnly={true} />
            <p className="text-xs" style={{ color: '#4d4635' }}>
              © {new Date().getFullYear()} Tembo Page, Inc. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 select-none">
            {['Privacy', 'Terms', 'Help', 'Affiliate', 'Creator Fund', 'Contact'].map(l => (
              <a
                key={l}
                href={
                  l === 'Privacy' ? '#/privacy' :
                  l === 'Terms' ? '#/terms' :
                  l === 'Help' ? '#/help' :
                  l === 'Affiliate' ? '#/affiliate' :
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
