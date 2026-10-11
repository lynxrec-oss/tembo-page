/**
 * TEMBO PAGE — Tembo Chat Setup Console
 * 
 * Configure active status, welcome greetings, notification pathways,
 * and preview chat bubble interactions live inside a simulated iPhone-styled viewport.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Save, Bell, HelpCircle, LogOut, Plus, 
  CheckCircle2, Sparkles, RefreshCw, Eye, Check, X, Send, Menu
} from 'lucide-react';
import { Sidebar } from './Sidebar';

export default function ChatSetup() {
  // Config States
  const [isActive, setIsActive] = useState(true);
  const [welcomeMsg, setWelcomeMsg] = useState(
    "Welcome to my digital space! I'm here to help you navigate my links or answer any questions."
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Preview Interactivity States
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [testInput, setTestInput] = useState('');
  const [mockMessages, setMockMessages] = useState<Array<{ sender: 'tembo' | 'user'; text: string }>>([]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      triggerToast('Chat setup configurations saved successfully!');
    }, 1200);
  };

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    // Append user message
    const userText = testInput;
    setMockMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setTestInput('');

    // Trigger mock typing reply after delay
    setTimeout(() => {
      setMockMessages(prev => [
        ...prev, 
        { sender: 'tembo', text: `As a wise guide, I hear your word: "${userText}". How can I expand your bio link further?` }
      ]);
    }, 1000);
  };

  return (
    <div 
      className="flex min-h-screen selection:bg-primary/30 selection:text-primary savanna-texture" 
      style={{ background: '#16130b', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Dynamic Keyframes for Chat Setup page */}
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
      `}} />

      {/* Shared Navigation Sidebar */}
      <Sidebar active="chat" />

      {/* Main Content Area */}
      <main className="flex-grow min-h-screen pb-24 md:pb-0 relative">
        
        {/* Floating Toast Notification overlay */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 p-4 rounded-xl flex items-center gap-3 border shadow-2xl bg-surface-container border-primary/30 text-primary backdrop-blur-md font-body"
            >
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden bg-surface/80 backdrop-blur-xl border-b border-primary/10 p-4 sticky top-0 z-30 flex justify-between items-center">
          <h1 className="text-headline-md font-display font-black tracking-tighter text-primary text-xl">TEMBO PAGE</h1>
          <button className="text-primary p-2 cursor-pointer">
            <Menu size={20} />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-display-md font-display font-bold text-[36px] md:text-[48px] text-on-surface mb-2 flex items-center gap-3">
              <MessageSquare className="text-primary" size={36} />
              Tembo Chat Setup
            </h1>
            <p className="text-body-lg font-body text-on-surface-variant max-w-3xl leading-relaxed">
              Configure your premium chat experience to engage visitors directly on your savanna.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Settings (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* General Settings Card */}
              <div className="bg-surface-container-high rounded-xl p-8 glow-card transition-all duration-300 border border-outline-variant/20">
                <h3 className="text-lg font-display font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
                  General Configuration
                </h3>
                
                <div className="space-y-8 font-body">
                  {/* Active Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-outline-variant/20 hover:border-primary/20 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface mb-1">Active Status</h4>
                      <p className="text-xs text-on-surface-variant leading-normal">
                        Enable the conversational advisor bubble on your public creator pathway.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={isActive}
                        onChange={(e) => {
                          setIsActive(e.target.checked);
                          triggerToast(`Chat advisor bubble is now ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-14 h-7 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#3c2f00] after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-tertiary shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all"></div>
                    </label>
                  </div>

                  {/* Welcome Message Input */}
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1.5" htmlFor="welcome-message">
                      Welcome Message Greeting
                    </label>
                    <p className="text-xs text-on-surface-variant mb-3 leading-normal">
                      The initial introductory greeting visitors see when opening the chat bubble.
                    </p>
                    <textarea 
                      id="welcome-message" 
                      value={welcomeMsg}
                      onChange={(e) => setWelcomeMsg(e.target.value)}
                      className="w-full bg-[#080808] border border-outline-variant/50 rounded-lg p-4 text-xs text-on-surface outline-none input-glow transition-all duration-300 resize-none font-body leading-relaxed" 
                      placeholder="e.g., Welcome to the savanna! How can I help you navigate today?" 
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings Card */}
              <div className="bg-surface-container-high rounded-xl p-8 glow-card transition-all duration-300 border border-outline-variant/20 font-body">
                <h3 className="text-lg font-display font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
                  Notification Preferences
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-4 bg-[#121212] rounded-lg border border-outline-variant/20 cursor-pointer hover:bg-surface-container-highest transition-colors select-none">
                    <div className="flex items-center h-6">
                      <input 
                        type="checkbox" 
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="w-5 h-5 bg-[#080808] border-outline-variant/50 rounded text-primary focus:ring-primary focus:ring-offset-surface-container-high cursor-pointer" 
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-on-surface">Email Notifications</span>
                      <span className="block text-[11px] text-on-surface-variant mt-1 leading-normal">
                        Receive daily email digests when visitors start conversations with your AI.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 bg-[#121212] rounded-lg border border-outline-variant/20 cursor-pointer hover:bg-surface-container-highest transition-colors select-none">
                    <div className="flex items-center h-6">
                      <input 
                        type="checkbox" 
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        className="w-5 h-5 bg-[#080808] border-outline-variant/50 rounded text-primary focus:ring-primary focus:ring-offset-surface-container-high cursor-pointer" 
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-on-surface">Browser Push Notifications</span>
                      <span className="block text-[11px] text-on-surface-variant mt-1 leading-normal">
                        Get real-time browser notifications while logged in to the dashboard.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save Action */}
              <div className="flex justify-end mt-2">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary text-on-primary font-display font-bold text-xs py-4 px-8 rounded-lg uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(242,202,80,0.15)] hover:-translate-y-1 hover:shadow-[0_8px_30px_-2px_rgba(242,202,80,0.3)] transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <span className="material-symbols-outlined font-bold text-sm">save</span>}
                  {isSaving ? 'Saving Configurations...' : 'Save Configuration'}
                </button>
              </div>

            </div>

            {/* Right Column: Live Preview (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-24 bg-surface-container-high rounded-xl p-6 glow-card h-[600px] flex flex-col items-center justify-between border border-outline-variant/20 overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute inset-0 bg-surface-container opacity-50 z-0"></div>
                <div className="absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(242, 202, 80, 0.05), transparent 50%)' }}></div>
                
                {/* Preview layout */}
                <div className="z-10 w-full h-full flex flex-col relative justify-between">
                  
                  {/* Preview Top Header */}
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 mb-4">
                    <h3 className="text-xs font-display font-bold text-on-surface flex items-center gap-2 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-primary text-base font-bold">visibility</span>
                      Live Preview
                    </h3>
                    <span className={`font-display font-bold text-[9px] px-3 py-1 rounded-full border uppercase tracking-wider transition-colors duration-300 ${
                      isActive 
                        ? 'bg-tertiary/10 text-tertiary border-tertiary/20' 
                        : 'bg-surface-container-highest/20 text-outline border-outline-variant/20'
                    }`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Fake Page Content behind Chat (styled beautifully) */}
                  <div className="flex-grow opacity-10 bg-[#0c0c0e] rounded-lg border border-outline-variant/10 relative overflow-hidden mb-12 select-none pointer-events-none">
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-surface-container-highest rounded-md"></div>
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-surface-container-highest rounded-md"></div>
                  </div>

                  {/* Preview Chat Interface (Open State triggered dynamically!) */}
                  <AnimatePresence>
                    {isActive && isPreviewOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-20 right-0 w-80 bg-surface rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col z-20 font-body"
                      >
                        {/* Chat Header */}
                        <div className="bg-primary p-4 flex items-center gap-3 select-none">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-on-primary/20 shrink-0">
                            <img 
                              alt="Avatar" 
                              className="w-full h-full object-cover" 
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyEg0shgl-haSpMdpioPY4z2woy_WjVpFReJIHUyfYPqd5eDVooth8G4qPV1ovN6A-yRuZT9-TFUyGGoCEqPBwjC2tiL2VwxkzQWQjvG4g-6js7yqVEXVsbz04GbRRuB69KIxlt1WpX91y4KkmF3RDAACLBmq7WyKDQhzbkrqs9qI4AWJIAOJI-kKCtw-Dh6BlnkHD5-yR6czUAAb9HNElHm0cUd8OCEyIxBHzVPL3v_TbQ_nOERmHuKXJefHoBFyx6FzG0H6bWl0"
                            />
                          </div>
                          <div>
                            <h4 className="text-[#3c2f00] font-display font-bold text-xs leading-tight">Tembo Assistant</h4>
                            <p className="text-[#3c2f00]/80 text-[10px] font-semibold mt-0.5">Typically replies instantly</p>
                          </div>
                        </div>

                        {/* Chat Body Scroll box */}
                        <div className="p-4 h-48 bg-surface-container-lowest overflow-y-auto flex flex-col gap-3">
                          {/* Welcome bubble (updates dynamically from textbox!) */}
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-[10px] flex-shrink-0 mt-0.5 select-none">
                              🐘
                            </div>
                            <div className="bg-surface-container p-3 rounded-lg rounded-tl-none border border-outline-variant/20 flex-grow min-w-0">
                              <p className="text-on-surface text-xs leading-relaxed break-words whitespace-pre-wrap">
                                {welcomeMsg || "Welcome to the savanna!"}
                              </p>
                            </div>
                          </div>

                          {/* Render custom typed user test messages! */}
                          {mockMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div 
                                className={`max-w-[80%] p-3 rounded-lg text-xs leading-relaxed ${
                                  msg.sender === 'user'
                                    ? 'bg-primary text-on-primary rounded-tr-none font-bold'
                                    : 'bg-surface-container border border-outline-variant/20 text-[#c9bfab] rounded-tl-none'
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Chat Interactive input bar */}
                        <div className="p-3 bg-surface-container border-t border-outline-variant/20 flex items-center gap-2">
                          <input 
                            type="text"
                            value={testInput}
                            onChange={(e) => setTestInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSendTestMessage(e);
                              }
                            }}
                            className="flex-grow bg-[#080808] border border-outline-variant/50 rounded-full px-4 py-2 text-xs text-on-surface outline-none focus:border-primary font-body" 
                            placeholder="Test message..." 
                          />
                          <button 
                            onClick={handleSendTestMessage}
                            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary hover:bg-primary-fixed-dim transition-all cursor-pointer shrink-0"
                          >
                            <Send size={12} className="text-[#3c2f00] font-bold" />
                          </button>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Preview Chat Bubble (Toggle Open/Closed state dynamically) */}
                  <div className="absolute bottom-0 right-0 z-30 select-none">
                    <button 
                      type="button"
                      onClick={() => {
                        if (isActive) {
                          setIsPreviewOpen(prev => !prev);
                        } else {
                          triggerToast('Enable the Active Status toggle first to unlock the advisor bubble!');
                        }
                      }}
                      className="w-14 h-14 bg-primary rounded-full shadow-[0_4px_20px_rgba(242,202,80,0.3)] flex items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer relative group"
                    >
                      <span className="material-symbols-outlined text-[#3c2f00] text-2xl font-bold transition-transform">
                        {isActive && isPreviewOpen ? 'close' : 'chat'}
                      </span>
                      <div className="absolute inset-0 rounded-full border border-white/20"></div>
                    </button>
                  </div>

                </div>
              </div>
            </div>

          </form>
        </div>
      </main>

      {/* Mobile Bottom Navigation (Strict HTML Replication) */}
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
          <a className="flex flex-col items-center justify-center w-full h-full text-primary text-decoration-none" href="#/chat">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
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
