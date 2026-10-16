/**
 * TEMBO PAGE — Creator Help Center
 * 
 * Interactive FAQ center, categorized bento resource guides, search filters,
 * and a direct strategic support coordinator form.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, Search, Terminal, Wand2, Megaphone, 
  MessageSquare, Globe, Plus, Minus, Send, CheckCircle2,
  ChevronRight, RefreshCw, Menu
} from 'lucide-react';
import { Sidebar } from './Sidebar';

interface FAQItem {
  id: string;
  category: 'pixel' | 'builder' | 'campaign' | 'ai' | 'billing';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'pixel-1',
    category: 'pixel',
    question: 'Will the Tembo Smart Pixel slow down my visitor landing pages?',
    answer: 'Absolutely not. The Tembo Smart Pixel script is engineered to load fully asynchronously (async). It does not block rendering, occupies less than 2.8KB of bandwidth, and leverages our global edge network to fetch pings instantly without delaying your visitor page.'
  },
  {
    id: 'pixel-2',
    category: 'pixel',
    question: 'How do I verify that my Smart Pixel handshake is active?',
    answer: "Go to your Settings panel under the 'Smart Pixel Setup' tab. Click the 'Verify Connection' button. Our backend will immediately scan your site's CNAME header, dispatch a test handshake signal, and return a green active ping status once verified."
  },
  {
    id: 'builder-1',
    category: 'builder',
    question: 'How does Traffic-Based Personalization work?',
    answer: 'When a visitor lands on your bio link, our client script checks the referrer headers. If they arrive from TikTok, we automatically render layouts prioritizing visual cards (like merch drops). If they click from Instagram or email directories, we prioritize scheduling calendars or strategies.'
  },
  {
    id: 'builder-2',
    category: 'builder',
    question: 'Can I embed dynamic streaming media directly in links?',
    answer: "Yes! Using our Page Builder, you can add 'Video' or 'Music' blocks. We support fully responsive inline widgets for YouTube, Spotify, and Apple Music that play directly inside the visitor's viewport without forcing external app redirects."
  },
  {
    id: 'campaign-1',
    category: 'campaign',
    question: 'How do A/B split-tests decide a winning layout?',
    answer: 'We divide incoming visitors equally between Variant A and Variant B. Our analytics suite tracks views, click-through rates (CTR), and attributed revenue. Once a variant achieves a statistically significant margin (e.g. 95% confidence), we recommend deploying it permanently.'
  },
  {
    id: 'campaign-2',
    category: 'campaign',
    question: 'What is a Scheduled Content Drop?',
    answer: 'A Scheduled Drop allows you to automate changes. You can set specific dates and hours to pin particular cards (such as pinning a merch drop link only on Friday afternoons) to capture peak audience traffic automatically.'
  },
  {
    id: 'ai-1',
    category: 'ai',
    question: 'How do I configure my wise AI advisor, Tembo The Wise?',
    answer: "Under the 'Chat Setup' console, you can enable active status, edit your custom welcome message, and test conversations. The AI uses the Gemini 1.5 Pro engine, preloaded with instructions to act as a grandfatherly advisor using beautiful savannah wisdom."
  },
  {
    id: 'ai-2',
    category: 'ai',
    question: 'Are conversational chat logs visible to creators?',
    answer: 'Yes. All chat advisor visitor logs are securely stored in your Firestore database. You can review dialogue entries inside your dashboard analytics to understand visitor queries, and receive daily digests via email.'
  },
  {
    id: 'billing-1',
    category: 'billing',
    question: 'Can I connect my own custom CNAME domains to my page?',
    answer: "Yes, this is fully supported on the Creator Pro and Herd Leader tiers. Inside your Settings panel, navigate to 'Domain & Security' to map your personal domain (e.g., bio.yourbrand.com) via CNAME records. We provision automatic global SSL certificates."
  },
  {
    id: 'billing-2',
    category: 'billing',
    question: 'What is the savings benefit for Annual Pricing tiers?',
    answer: 'By toggling from Monthly to Annual billing on our Pricing page, we apply a 20% flat discount across all plans. For instance, the Creator Pro subscription adjusts from $19 to $15.20 per month, billed annually.'
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Support ticket form state
  const [ticketCategory, setTicketCategory] = useState('general');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(prev => (prev === id ? null : id));
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTicketMessage('');
      setTimeout(() => setIsSent(false), 4000);
    }, 1500);
  };

  // Filter FAQs based on query and category
  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="flex min-h-screen selection:bg-primary/30 selection:text-primary savanna-texture" 
      style={{ background: '#16130b', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Visual keyframes and ambient shadows inject */}
      <style dangerouslySetInnerHTML={{__html: `
        .savanna-texture {
          background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h100v100H0z" fill="none"/><path d="M10 10h10v10H10zm20 20h10v10H30zm-20 20h10v10H10zm40-20h10v10H50zm20 20h10v10H70zm-20 20h10v10H50z" fill="%23f2ca50" fill-opacity="0.03"/></svg>');
        }
        .glow-card {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), inset 1px 1px 0px rgba(242, 202, 80, 0.1);
        }
        .glow-card:hover {
          box-shadow: 0 8px 40px rgba(242, 202, 80, 0.08), inset 1px 1px 0px rgba(242, 202, 80, 0.2);
        }
        .input-glow:focus {
          box-shadow: 0 0 15px rgba(242, 202, 80, 0.15);
          border-color: #f2ca50;
        }
        .faq-accordion {
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}} />

      {/* Shared Navigation Sidebar */}
      <Sidebar active="settings" /> {/* Highlight Settings since Help is closely bound */}

      {/* Main Help Center Pane */}
      <main className="flex-grow min-h-screen pb-24 md:pb-0 relative">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden bg-surface/80 backdrop-blur-xl border-b border-primary/10 p-4 sticky top-0 z-30 flex justify-between items-center">
          <h1 className="text-headline-md font-display font-black tracking-tighter text-primary text-xl">TEMBO PAGE</h1>
          <button className="text-primary p-2 cursor-pointer">
            <Menu size={20} />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          
          {/* Header section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-display-md font-display font-bold text-[36px] md:text-[48px] text-on-surface mb-2 flex items-center gap-3">
                <HelpCircle className="text-primary" size={36} />
                Help Center
              </h1>
              <p className="text-body-lg font-body text-on-surface-variant max-w-3xl leading-relaxed">
                Find answers, explore developer guides, or contact support to scale your digital savanna brand.
              </p>
            </div>
            
            {/* Search Input bar */}
            <div className="relative w-full md:w-80 shrink-0 font-body">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080808] border border-outline-variant/50 rounded-lg py-3 pl-10 pr-4 text-xs text-on-surface outline-none input-glow transition-all duration-300" 
                placeholder="Search resources & articles..." 
              />
              <Search className="absolute left-3.5 top-[13px] text-outline" size={14} />
            </div>
          </div>

          {/* Category Quick Pills */}
          <div className="flex flex-wrap gap-2 mb-10 select-none font-body">
            {[
              { id: 'all',      label: 'All Topics' },
              { id: 'pixel',    label: 'Smart Pixel & Code' },
              { id: 'builder',  label: 'Page Builder' },
              { id: 'campaign', label: 'Campaigns & A/B' },
              { id: 'ai',       label: 'AI Chat Advisor' },
              { id: 'billing',  label: 'CNAME Domains & Billing' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-primary text-[#3c2f00] border-primary'
                    : 'bg-surface-container/40 border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-primary/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bento Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand: FAQ Accordions (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="bg-surface-container-high rounded-xl p-8 glow-card transition-all duration-300 border border-outline-variant/20">
                <h3 className="text-lg font-display font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
                  Frequently Asked Questions
                </h3>

                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12 font-body select-none">
                    <HelpCircle className="mx-auto text-outline mb-4" size={32} />
                    <p className="text-sm font-bold text-on-surface mb-1">No guides or articles found</p>
                    <p className="text-xs text-on-surface-variant">Try refining your search keyword query.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => {
                      const isExpanded = expandedFAQ === faq.id;
                      return (
                        <div 
                          key={faq.id} 
                          className="bg-[#121212] rounded-lg border border-outline-variant/20 hover:border-primary/20 transition-all duration-300 overflow-hidden font-body"
                        >
                          <button
                            onClick={() => toggleFAQ(faq.id)}
                            className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                          >
                            <span className="text-xs font-bold text-on-surface">{faq.question}</span>
                            <span className="text-primary shrink-0 transition-transform">
                              {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                            </span>
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                              >
                                <div className="p-5 pt-0 border-t border-outline-variant/10 text-xs text-on-surface-variant leading-relaxed">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right Hand: Help Desk Forms (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Direct Support Ticket Panel */}
              <div className="bg-surface-container-high rounded-xl p-8 glow-card transition-all duration-300 border border-outline-variant/20 relative">
                <div className="absolute inset-0 noise-texture opacity-30 pointer-events-none z-0" />
                
                <h3 className="text-lg font-display font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4 relative z-10">
                  Direct Savannah Support
                </h3>

                <form onSubmit={handleSendTicket} className="space-y-6 relative z-10 font-body">
                  
                  {/* Category dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">Ticket Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full text-xs p-3.5 bg-[#080808] border border-outline-variant/50 rounded-lg text-on-surface outline-none focus:border-primary/50 transition-colors cursor-pointer"
                    >
                      <option value="general">General Brand Support</option>
                      <option value="pixel">Smart Pixel & Integrations</option>
                      <option value="builder">Page Builder Widgets</option>
                      <option value="billing">Subscriptions & Payments</option>
                    </select>
                  </div>

                  {/* Message details */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">How can we advise you?</label>
                    <textarea
                      required
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      rows={5}
                      className="w-full text-xs p-3.5 bg-[#080808] border border-outline-variant/50 rounded-lg text-on-surface outline-none input-glow transition-all duration-300 resize-none leading-relaxed"
                      placeholder="Detail your request, and our savannah guides will reach out to you within 2 hours..."
                    />
                  </div>

                  {/* Submission triggers */}
                  <div className="flex items-center justify-between pt-2">
                    
                    <AnimatePresence mode="wait">
                      {isSent ? (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center gap-2 text-xs text-primary font-semibold"
                        >
                          <CheckCircle2 size={14} />
                          <span>Ticket Dispatched!</span>
                        </motion.div>
                      ) : (
                        <span className="text-[10px] text-outline font-semibold">Typical reply time: 2hr</span>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={isSending || isSent}
                      className="bg-primary text-[#3c2f00] font-display font-bold text-xs py-4 px-8 rounded-lg uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(242,202,80,0.15)] hover:-translate-y-1 hover:shadow-[0_8px_30px_-2px_rgba(242,202,80,0.3)] transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSending ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                      {isSending ? 'Dispatching...' : 'Dispatch Ticket'}
                    </button>

                  </div>

                </form>
              </div>

              {/* Developer Technical Coordinates card */}
              <div className="bg-[#121212] rounded-xl p-6 glow-card transition-all duration-300 border border-outline-variant/20 relative font-body flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-2xl font-bold mt-1">code</span>
                <div>
                  <h4 className="text-xs font-display font-bold text-on-surface uppercase tracking-widest mb-1.5">Developer Resources</h4>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed mb-3">
                    Access our REST endpoints schema, Webhook specs, or smart integration packages on GitHub.
                  </p>
                  <a className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer select-none text-decoration-none">
                    Explore API Specs
                    <ChevronRight size={10} />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Mobile view bottom nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container border-t border-primary/10 z-40 pb-safe font-body">
        <div className="flex justify-around items-center h-16 px-4">
          <a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary transition-colors text-decoration-none" href="#/dashboard">
            <span className="material-symbols-outlined text-[24px]">dashboard</span>
            <span className="text-[10px] font-semibold mt-1">Dashboard</span>
          </a>
          <a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary transition-colors text-decoration-none" href="#/analytics">
            <span className="material-symbols-outlined text-[24px]">insights</span>
            <span className="text-[10px] font-semibold mt-1">Analytics</span>
          </a>
          <div className="relative w-full h-full flex justify-center -mt-6">
            <button className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg text-on-primary border-4 border-background cursor-pointer">
              <Plus size={24} className="text-[#3c2f00] font-bold" />
            </button>
          </div>
          <a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary transition-colors text-decoration-none" href="#/chat">
            <span className="material-symbols-outlined text-[24px]">forum</span>
            <span className="text-[10px] font-semibold mt-1">Chat Setup</span>
          </a>
          <a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary transition-colors text-decoration-none" href="#/settings">
            <span className="material-symbols-outlined text-[24px]">settings</span>
            <span className="text-[10px] font-semibold mt-1">Settings</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
