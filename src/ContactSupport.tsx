/**
 * TEMBO PAGE — Contact Support Page
 * 
 * High-fidelity, premium dark-themed support channel dispatch portal.
 * Adheres strictly to the Savannah Sunset design system with interactive form feedback.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Mail, Send, CheckCircle2, ChevronRight, HelpCircle,
  Twitter, MessageCircle, AlertCircle, ArrowRight, Menu, X, ShieldCheck, Heart
} from 'lucide-react';
import { TemboBrand } from './TemboBrand';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ContactSupport() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSending(true);
    const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const ticketPayload = {
      ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category,
      message: message.trim(),
      status: 'open',
      submittedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'support_tickets', ticketId), ticketPayload);
    } catch (err) {
      console.error('Error saving support ticket to Firestore:', err);
    } finally {
      setIsSending(false);
      setIsSent(true);
      setName('');
      setEmail('');
      setMessage('');
    }
  };

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
        .input-box {
          background: #080808;
          border: 1px solid rgba(77, 70, 53, 0.4);
          color: #eae1d4;
          transition: all 0.3s ease;
        }
        .input-box:focus {
          border-color: #f2ca50;
          box-shadow: 0 0 12px rgba(242, 202, 80, 0.15);
          outline: none;
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
      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10 font-body">
        
        {/* Title Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <MessageSquare size={30} />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-[#eae1d4] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Connect With <span className="text-gradient-gold">the Herd.</span>
          </h1>
          <p className="text-xs text-[#c9bfab] max-w-lg mx-auto leading-relaxed">
            Need guidance, split-test help, CNAME mapping support, or general advice? Write to our coordinator herd and we will get back to you within 2 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Support Dispatch Ticket Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glow-card border border-outline-variant/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 noise-texture opacity-30 pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-5 bg-primary pointer-events-none" />

              <h2 className="text-xl font-display font-bold text-[#eae1d4] mb-6 pb-4 border-b border-[#4d4635]/30 flex items-center gap-2.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Send size={18} className="text-primary" />
                Dispatch Support Ticket
              </h2>

              <AnimatePresence mode="wait">
                {isSent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="text-center py-12 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-[0_0_20px_rgba(242,202,80,0.15)]">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-lg font-display font-bold text-primary mb-2">Ticket Dispatched Successfully!</h3>
                    <p className="text-xs text-[#c9bfab] leading-relaxed max-w-xs mx-auto mb-6">
                      Thank you! Your ticket was cataloged in our queue. A herd advisor will reach out to your inbox within the next 2 hours.
                    </p>
                    <button 
                      onClick={() => setIsSent(false)}
                      className="px-6 py-3 border border-outline-variant hover:border-primary hover:text-primary transition-all text-xs font-semibold rounded-full cursor-pointer bg-transparent text-[#eae1d4]"
                    >
                      Send Another Ticket
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#c9bfab] uppercase tracking-wider mb-2">Your Name</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full text-xs p-3.5 rounded-lg input-box"
                        />
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#c9bfab] uppercase tracking-wider mb-2">Your Email</label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full text-xs p-3.5 rounded-lg input-box"
                        />
                      </div>
                    </div>

                    {/* Inquiry Category */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#c9bfab] uppercase tracking-wider mb-2">Inquiry Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full text-xs p-3.5 rounded-lg input-box cursor-pointer"
                      >
                        <option value="general">General Inquiries & Feedback</option>
                        <option value="pixel">Smart Pixel Setup & Handshake Issues</option>
                        <option value="billing">Billing, Invoices & Stripe Upgrades</option>
                        <option value="builder">Page Builder Widget Customizations</option>
                        <option value="cname">CNAME Domain Mapping & SSL</option>
                      </select>
                    </div>

                    {/* Message Details */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#c9bfab] uppercase tracking-wider mb-2">Inquiry Details</label>
                      <textarea 
                        required
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please detail your request or context. If referencing pixel issues, include your CNAME domain..."
                        className="w-full text-xs p-3.5 rounded-lg input-box resize-none leading-relaxed"
                      />
                    </div>

                    {/* Secure warning note */}
                    <div className="flex items-center gap-2 text-[10px] text-[#99907c] select-none font-semibold">
                      <ShieldCheck size={14} className="text-[#6fe692]" />
                      Protected by Tembo Security Rules and direct serverless Firebase integrity layers.
                    </div>

                    {/* Submit ticket */}
                    <button 
                      type="submit"
                      disabled={isSending}
                      className="w-full py-4 bg-primary text-[#3c2f00] rounded-lg font-display font-bold text-xs uppercase tracking-wider glow-button cursor-pointer disabled:opacity-60 flex justify-center items-center gap-2"
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-[#3c2f00] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      {isSending ? 'Dispatching Ticket...' : 'Dispatch Ticket to Herd'}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Alternate Contact Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Channels list */}
            <div className="glow-card border border-outline-variant/30 rounded-2xl p-8 relative overflow-hidden">
              <h3 className="text-sm font-display font-bold text-[#eae1d4] mb-6 uppercase tracking-wider pb-3 border-b border-[#4d4635]/30" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Direct Coordinates
              </h3>

              <div className="space-y-5 font-body">
                {[
                  {
                    icon: <Mail size={16} />,
                    title: 'Email Address',
                    desc: 'herd@tembopage.com',
                    actionLabel: 'Send Direct Mail',
                    href: 'mailto:herd@tembopage.com'
                  },
                  {
                    icon: <Twitter size={16} />,
                    title: 'Support Twitter / X',
                    desc: '@TemboPageSupport',
                    actionLabel: 'Send Direct Message',
                    href: 'https://x.com/TemboPageSupport'
                  },
                  {
                    icon: <MessageCircle size={16} />,
                    title: 'Community Discord',
                    desc: 'The Tembo Herd Channel (Coming Soon)',
                    actionLabel: 'Request Invite',
                    href: 'mailto:herd@tembopage.com?subject=Discord%20Community%20Invite%20Request'
                  }
                ].map(channel => (
                  <div key={channel.title} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      {channel.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#eae1d4]">{channel.title}</h4>
                      <p className="text-[11px] text-[#c9bfab] mt-0.5">{channel.desc}</p>
                      <a 
                        href={channel.href} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-primary font-bold hover:underline inline-flex items-center gap-1 mt-2 text-decoration-none uppercase tracking-wider"
                      >
                        {channel.actionLabel}
                        <ArrowRight size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Base Shortcut Card */}
            <div className="glow-card border border-outline-variant/30 rounded-2xl p-8 relative overflow-hidden flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                <HelpCircle size={18} />
              </div>
              <div className="font-body break-words">
                <h4 className="text-xs font-bold text-[#eae1d4] uppercase tracking-wider">Search FAQ Hub first?</h4>
                <p className="text-[10px] text-[#c9bfab] mt-1.5 leading-relaxed">
                  We might already have answered your domain mapping, pixel verification, or layout split-testing query inside our Help Center guides!
                </p>
                <a 
                  href="#/help" 
                  className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1.5 mt-4 text-decoration-none"
                >
                  Explore Knowledge Base
                  <ChevronRight size={12} />
                </a>
              </div>
            </div>

          </div>

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
            {['Privacy', 'Terms', 'Help', 'Affiliate', 'Creator Fund'].map(l => (
              <a
                key={l}
                href={
                  l === 'Privacy' ? '#/privacy' :
                  l === 'Terms' ? '#/terms' :
                  l === 'Help' ? '#/help' :
                  l === 'Affiliate' ? '#/affiliate' :
                  l === 'Creator Fund' ? '#/fund' : '#'
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
