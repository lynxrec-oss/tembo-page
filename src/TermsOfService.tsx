/**
 * TEMBO PAGE — Terms of Service Page
 * 
 * High-fidelity, premium dark-themed terms page matching the Savannah Sunset design system.
 * Outlines creator responsibilities, billing guidelines, and community herd rules.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Scale, CheckCircle2, ChevronDown, Search, HelpCircle, 
  ArrowRight, ShieldCheck, Heart, Menu, X
} from 'lucide-react';
import { TemboBrand } from './TemboBrand';

interface TermsSection {
  id: string;
  title: string;
  description: string;
  details: string[];
}

export default function TermsOfService() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('acceptance');

  const termsList: TermsSection[] = [
    {
      id: 'acceptance',
      title: '1. Joining the Herd (Acceptance of Terms)',
      description: 'By creating a Tembo account, you agree to form a sacred pact to respect community guidelines and uphold platform integrity.',
      details: [
        'User Eligibility: You must be at least 13 years of age to host a profile in the digital savannah.',
        'Account Responsibility: You are responsible for keeping your login credentials secure. Any clicks, updates, or chats originating from your account belong entirely to you.',
        'Acceptance: Accessing any portion of our platform means you accept these terms in full. If you disagree, you should not wander into our territory.'
      ]
    },
    {
      id: 'sovereignty',
      title: '2. Creator Sovereignty & Intellectual Property',
      description: 'You own your brand, your links, your uploads, and your audience. We simply provide the intelligent canvas.',
      details: [
        'Ownership: All custom themes, bios, booking files, and avatar images remain 100% your property.',
        'License to Host: You grant Tembo Page a worldwide, royalty-free license to display and distribute your page content to visitors on your behalf.',
        'Respecting Others: You pledge not to upload copyrighted logos, materials, or brands that do not belong to you.'
      ]
    },
    {
      id: 'rules',
      title: '3. Rules of the Savannah (Forbidden Activities)',
      description: 'Elephants are gentle and wise. To keep the watering hole safe, we prohibit harmful, abusive, or deceptive behavior.',
      details: [
        'No Phishing or Deception: Do not create fake profiles or links designed to steal passwords, credentials, or private details from your visitors.',
        'No Spam: Do not deploy automated search bots or flood the platform with empty or broken profile directories.',
        'Malicious Content: We strictly prohibit spreading viruses, malicious code, or links to illegal or dangerous external marketplaces.',
        'Herd Enforcement: We reserve the absolute right to suspend or ban any profile that violates community trust or compromises platform stability.'
      ]
    },
    {
      id: 'billing',
      title: '4. Subscription Plans, Billing & Upgrades',
      description: 'Simple, honest transaction frameworks for our premium packages. No hidden fees or surprise costs.',
      details: [
        'Billing Cycles: Premium plans are billed monthly or annually at the rates displayed on our pricing page.',
        'Refund Policy: You can cancel your subscription at any time. We do not offer prorated refunds, but your premium features will remain active until the end of your current cycle.',
        'Taxes & Fees: All fees are displayed clearly prior to checkout. You are responsible for standard localized processing taxes.'
      ]
    },
    {
      id: 'warranty',
      title: '5. Platform Continuity & Limitation of Liability',
      description: 'We strive for 100% uptime, but our services are provided on an "as-is" and "as-available" basis.',
      details: [
        'Savannah Uptime: While we target 99% uptime, we are not liable for temporary edge network drops or database maintenance cycles.',
        'Limitation of Damages: Under no circumstances shall Tembo Page be liable for lost profits, click revenue, or secondary damages resulting from platform downtime.'
      ]
    }
  ];

  const filteredTerms = termsList.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.details.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div 
      className="relative min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden" 
      style={{ background: '#0c0c0e', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Background gradients and noise overlay */}
      <div className="fixed inset-0 noise-texture z-[99] pointer-events-none opacity-25" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-5 bg-primary pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-5 bg-primary pointer-events-none z-0" />

      {/* Styled class templates */}
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

      {/* Main Canvas Area */}
      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10 font-body">
        
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <Scale size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-[#eae1d4] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Terms of <span className="text-gradient-gold">Service.</span>
          </h1>
          <p className="text-xs text-[#c9bfab] max-w-lg mx-auto leading-relaxed">
            Last Updated: May 25, 2026. Setting clean guidelines to cultivate a thriving, secure visual landscape.
          </p>
        </div>

        {/* 🌟 HERD HARMONY CALLOUT */}
        <div className="glow-card border border-outline-variant/30 rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-sm font-display font-bold text-[#eae1d4] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              The Herd Harmony Covenant
            </h3>
            <p className="text-xs text-[#c9bfab] leading-relaxed">
              We promise to treat you as a sovereign creator, offering transparent pricing, zero hidden algorithms, and robust secure storage. In return, you promise to maintain a positive presence and protect the watering hole from spam or abuse.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="Search terms topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16130b] border border-outline-variant/30 rounded-full py-3 pl-11 pr-5 text-sm text-[#eae1d4] focus:outline-none focus:border-primary/50 transition-all font-body"
            style={{ border: '1px solid rgba(77,70,53,0.4)' }}
          />
          <Search size={18} className="absolute left-4 top-3.5 text-[#99907c]" />
        </div>

        {/* Terms list accordion */}
        <div className="flex flex-col gap-4">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((t) => {
              const isExpanded = expandedSection === t.id;
              return (
                <div 
                  key={t.id}
                  className="glow-card border border-outline-variant/30 rounded-xl transition-all overflow-hidden"
                >
                  <button 
                    onClick={() => setExpandedSection(isExpanded ? null : t.id)}
                    className="w-full text-left p-6 flex justify-between items-start gap-4 hover:bg-primary/5 transition-colors focus:outline-none"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-display font-bold text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {t.title}
                        </h3>
                        <p className="text-xs text-[#c9bfab] mt-1">
                          {t.description}
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
                          {t.details.map((detail, idx) => (
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
              <HelpCircle size={32} className="mx-auto mb-4 text-[#99907c]" />
              <p className="text-xs text-[#c9bfab]">No policy sections found matching your search term.</p>
            </div>
          )}
        </div>

        {/* Support Callout */}
        <div className="mt-16 glow-card border border-outline-variant/30 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <HelpCircle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-display font-bold text-[#eae1d4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Need Help Clarifying These Terms?
              </h4>
              <p className="text-[11px] text-[#c9bfab] mt-0.5">
                Our support team is always available to answer any questions about our operational covenant.
              </p>
            </div>
          </div>
          <a 
            href="#/help" 
            className="px-6 py-3 border border-outline-variant hover:border-primary hover:text-primary transition-all text-xs font-semibold rounded-full text-decoration-none inline-flex items-center gap-1.5"
            style={{ color: '#eae1d4' }}
          >
            Contact Help Center
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
            {['Privacy', 'Help', 'Affiliate', 'Creator Fund', 'Contact'].map(l => (
              <a
                key={l}
                href={
                  l === 'Privacy' ? '#/privacy' :
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
