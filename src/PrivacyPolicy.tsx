/**
 * TEMBO PAGE — Privacy Policy Page
 * 
 * High-fidelity, premium dark-themed privacy page matching the Savannah Sunset design system.
 * Emphasizes the sacred brand pledge: "We will never share or sell your data."
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, EyeOff, Lock, Heart, Award, ArrowRight, 
  Search, FileText, CheckCircle, Menu, X, ChevronDown
} from 'lucide-react';
import { TemboBrand } from './TemboBrand';

interface PolicySection {
  id: string;
  title: string;
  description: string;
  details: string[];
}

export default function PrivacyPolicy() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('pledge');

  const policies: PolicySection[] = [
    {
      id: 'collection',
      title: '1. What We Collect (And What We Don’t)',
      description: 'We believe in data minimization. We only collect what is strictly necessary to run your intelligent landing page.',
      details: [
        'Account Information: Email address and login credentials when you create a Tembo account.',
        'Profile Content: The links, images, bio text, and custom widgets you choose to show on your public page.',
        'Smart Pixel Data: Anonymized click metrics and referrer channels (e.g. knowing a user came from Instagram) aggregated without cookies.',
        'What we NEVER collect: We do not track search history across other websites, read clipboard data, or log keystrokes.'
      ]
    },
    {
      id: 'usage',
      title: '2. How Your Data Is Utilized',
      description: 'Your information is used purely to provide, improve, and secure the Tembo Page platform.',
      details: [
        'Displaying your public page beautifully and serving it with high performance worldwide.',
        'Powering the Vertex AI Chatbot to represent your brand contextually to visitors.',
        'Generating analytics graphs on your Dashboard so you can see your click CTRs and traffic flow.',
        'Preventing spam, abuse, or unauthorized logins to keep your digital herd safe.'
      ]
    },
    {
      id: 'protection',
      title: '3. Security & Silent Footprints',
      description: 'We safeguard your digital footprints with industry-leading encryption and modern secure database isolation.',
      details: [
        'All Firestore transactions are guarded by robust backend security rules that prevent unauthorized reads/writes.',
        'Your API credentials and chatbot configurations are encrypted at rest and in transit.',
        'Our 2.8KB Smart Pixel does not drops intrusive cookies or compromise your visitors\' private devices.'
      ]
    },
    {
      id: 'rights',
      title: '4. Your Digital Sovereignty',
      description: 'You own your data, your brand, and your audience relationships. You have complete control over your account.',
      details: [
        'Right to Access & Export: You can download or view all your public links and analytics anytime.',
        'Right to Erasure: If you choose to delete your Tembo account, we instantly wipe all your profile documents and custom configurations from our database.',
        'Compliance: We fully respect and uphold GDPR, CCPA, and global privacy frameworks.'
      ]
    }
  ];

  const filteredPolicies = policies.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.details.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div 
      className="relative min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden" 
      style={{ background: '#0c0c0e', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Decorative noise and lighting overlays */}
      <div className="fixed inset-0 noise-texture z-[99] pointer-events-none opacity-25" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-5 bg-primary pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-5 bg-primarypointer-events-none z-0" />

      {/* Embedded CSS rules */}
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

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10 font-body">
        
        {/* Title / Hero Intro */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-[#eae1d4] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Privacy First. <span className="text-gradient-gold">Always.</span>
          </h1>
          <p className="text-xs text-[#c9bfab] max-w-lg mx-auto leading-relaxed">
            Effective Date: May 25, 2026. Because you own your digital watering hole, and we are just here to keep it watering.
          </p>
        </div>

        {/* 🌟 SACRED PLEDGE STAMP (High Visibility & Honor) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glow-card border border-primary/20 rounded-2xl p-8 mb-16 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(22,19,11,0.9) 0%, rgba(35,30,15,0.9) 100%)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] bg-primary rounded-full blur-xl pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full border border-primary/10 flex items-center justify-center text-primary/10 font-bold select-none pointer-events-none text-7xl">
            ★
          </div>

          <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
            <Award size={16} />
            Our Sacred Pledge
          </div>

          <h2 className="text-xl md:text-3xl font-display font-black text-[#eae1d4] mb-4 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            "We pledge to never share or sell anyone’s data."
          </h2>

          <p className="text-xs text-[#c9bfab] leading-relaxed max-w-xl mx-auto">
            Unlike classic advertising directories that commoditize your audience, Tembo Page does not monetize your visitors' attention or private details. We make money solely by offering powerful premium features to creators, maintaining absolute integrity in the digital savannah.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2.5 text-[10px] font-bold text-[#f2ca50] uppercase tracking-wider">
            <CheckCircle size={14} className="text-primary" />
            No Ad Networks • No Third-Party Tracking • 100% Creator Aligned
          </div>
        </motion.div>

        {/* Search Bar / Fast Navigation */}
        <div className="relative mb-10 max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="Search privacy topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16130b] border border-outline-variant/30 rounded-full py-3 pl-11 pr-5 text-sm text-[#eae1d4] focus:outline-none focus:border-primary/50 transition-all font-body"
            style={{ border: '1px solid rgba(77,70,53,0.4)' }}
          />
          <Search size={18} className="absolute left-4 top-3.5 text-[#99907c]" />
        </div>

        {/* Policies Accordion Grid */}
        <div className="flex flex-col gap-4">
          {filteredPolicies.length > 0 ? (
            filteredPolicies.map((p) => {
              const isExpanded = expandedSection === p.id;
              return (
                <div 
                  key={p.id}
                  className="glow-card border border-outline-variant/30 rounded-xl transition-all overflow-hidden"
                >
                  <button 
                    onClick={() => setExpandedSection(isExpanded ? null : p.id)}
                    className="w-full text-left p-6 flex justify-between items-start gap-4 hover:bg-primary/5 transition-colors focus:outline-none"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-display font-bold text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {p.title}
                        </h3>
                        <p className="text-xs text-[#c9bfab] mt-1">
                          {p.description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={`text-[#99907c] transition-transform duration-300 mt-2 flex-shrink-0 ${isExpanded ? 'rotate-180 text-primary' : ''}`} 
                    />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-[#4d4635]/30 bg-[#0c0c0e]/50 overflow-hidden"
                      >
                        <div className="p-6 pl-20 flex flex-col gap-4 text-xs text-[#c9bfab] leading-relaxed">
                          {p.details.map((detail, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 glow-card border border-outline-variant/30 rounded-xl">
              <EyeOff size={32} className="mx-auto mb-4 text-[#99907c]" />
              <p className="text-xs text-[#c9bfab]">No policy sections found matching your search term.</p>
            </div>
          )}
        </div>

        {/* Contact / Inquiries block */}
        <div className="mt-16 glow-card border border-outline-variant/30 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-display font-bold text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Have Privacy Inquiries?
              </h4>
              <p className="text-[11px] text-[#c9bfab] mt-0.5">
                Our DPO (Data Protection Officer) herd is here to assist you with compliance queries.
              </p>
            </div>
          </div>
          <a 
            href="#/help" 
            className="px-6 py-3 border border-outline-variant hover:border-primary hover:text-primary transition-all text-xs font-semibold rounded-full text-decoration-none inline-flex items-center gap-1.5"
            style={{ color: '#eae1d4' }}
          >
            Contact Privacy Herd
            <ArrowRight size={14} />
          </a>
        </div>

      </main>

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
            {['Terms', 'Help', 'Affiliate', 'Creator Fund', 'Contact'].map(l => (
              <a
                key={l}
                href={
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
