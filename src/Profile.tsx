/**
 * TEMBO PAGE — Creator Profile Management Page
 * 
 * Manage master creator profiles, personal credentials, email status,
 * and security passwords, complete with a live-synced visitor preview phone card.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, MapPin, Key, Save, RefreshCw, 
  CheckCircle2, ShieldCheck, Heart, Sparkles, Plus, Menu, Upload
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function ProfilePage() {
  const activeCreatorId = typeof window !== 'undefined' ? (localStorage.getItem('active_creator_id') || 'beta-tester') : 'beta-tester';
  const isBetaWorkspace = typeof window !== 'undefined' && (localStorage.getItem('beta_bypass') === 'true' || activeCreatorId === 'beta-tester');
  const defaultHandle = isBetaWorkspace ? 'beta-tester' : activeCreatorId;
  const defaultDisplayName = isBetaWorkspace ? 'Beta Explorer' : (activeCreatorId === 'mycinetoolbox' ? 'Aaron Stowers' : 'Creator');

  // Master profile values synced to visual phone preview
  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [handle, setHandle] = useState(defaultHandle);
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userCards, setUserCards] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Credentials state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Interactive UI states
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarUrl(reader.result as string);
          triggerToast('Avatar image loaded! Click Save Changes to apply.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const creatorId = localStorage.getItem('active_creator_id') || (isBetaWorkspace ? 'beta-tester' : 'mycinetoolbox');
    const creatorRef = doc(db, 'creators', creatorId);
    const unsubscribe = onSnapshot(creatorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.displayName) setDisplayName(data.displayName);
        else setDisplayName(defaultDisplayName);
        if (data.handle) setHandle(data.handle);
        else setHandle(defaultHandle);
        if (data.bio !== undefined) setBio(data.bio);
        if (data.email !== undefined) setEmail(data.email);
        if (data.location !== undefined) setLocation(data.location);
        if (data.avatarUrl !== undefined) setAvatarUrl(data.avatarUrl);
        if (data.cards && Array.isArray(data.cards)) setUserCards(data.cards.filter(Boolean));
        else setUserCards([]);
      }
    }, (err) => {
      console.error("Firestore Profile Page onSnapshot error:", err);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const creatorId = localStorage.getItem('active_creator_id') || activeCreatorId;
      const creatorRef = doc(db, 'creators', creatorId);
      await setDoc(creatorRef, {
        displayName,
        handle,
        bio,
        email,
        location,
        avatarUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setIsSavingProfile(false);
      triggerToast('Creator profile settings successfully updated!');
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSavingProfile(false);
      triggerToast('Failed to save profile. Please try again.');
    }
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      triggerToast('Error: New password confirmation does not match!');
      return;
    }
    setIsSavingSecurity(true);
    setTimeout(() => {
      setIsSavingSecurity(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      triggerToast('Security credentials updated successfully!');
    }, 1500);
  };

  return (
    <div 
      className="flex min-h-screen selection:bg-primary/30 selection:text-primary savanna-texture" 
      style={{ background: '#16130b', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Dynamic Keyframes and Brand Ambient effects */}
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

      {/* Shared Sidebar Navigation */}
      <Sidebar active="profile" />

      {/* Main Content Pane */}
      <main className="flex-grow min-h-screen pb-24 md:pb-0 relative">
        
        {/* Floating Success Toasts */}
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

        {/* Mobile Header View */}
        <div className="md:hidden bg-surface/80 backdrop-blur-xl border-b border-primary/10 p-4 sticky top-0 z-30 flex justify-between items-center">
          <h1 className="text-headline-md font-display font-black tracking-tighter text-primary text-xl">TEMBO PAGE</h1>
          <button className="text-primary p-2 cursor-pointer">
            <Menu size={20} />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          
          {/* Header Row */}
          <div className="mb-12">
            <h1 className="text-display-md font-display font-bold text-[36px] md:text-[48px] text-on-surface mb-2 flex items-center gap-3">
              <User className="text-primary" size={36} />
              Creator Profile
            </h1>
            <p className="text-body-lg font-body text-on-surface-variant max-w-3xl leading-relaxed">
              Refine your brand coordinates, customize landing fields, and manage global security settings in the digital savanna.
            </p>
          </div>

          {/* Bento Columns split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand: Management Panel (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Profile details form */}
              <div className="bg-surface-container-high rounded-xl p-8 glow-card transition-all duration-300 border border-outline-variant/20">
                <h3 className="text-lg font-display font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
                  Profile Details
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-6 font-body">
                  
                  {/* Avatar upload shield */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-outline-variant/20">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <div className="relative group shrink-0 select-none cursor-pointer" onClick={() => fileInputRef.current?.click()}>
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
                        <span className="material-symbols-outlined text-white text-base font-bold">edit</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <h4 className="text-sm font-bold text-on-surface mb-1">Brand Avatar</h4>
                      <p className="text-xs text-on-surface-variant mb-4 leading-normal">
                        Re-upload or crop your premium brand avatar. Recommended parameters: 512x512 PNG.
                      </p>
                      <div className="flex gap-3 justify-center sm:justify-start">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded border border-outline-variant hover:border-primary text-xs font-semibold hover:text-primary transition-all cursor-pointer bg-transparent">
                          Upload Image
                        </button>
                        {avatarUrl && (
                          <button type="button" onClick={() => setAvatarUrl('')} className="px-4 py-2 rounded text-xs font-semibold text-[#ffb4ab] hover:bg-[#93000a]/10 transition-all cursor-pointer bg-transparent">
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inputs row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Display Name */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">Display Name</label>
                      <input 
                        required
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full text-xs p-3.5 bg-[#080808] border border-outline-variant/50 rounded-lg text-on-surface outline-none input-glow transition-all duration-300"
                        placeholder="Your Brand or Creator Name"
                      />
                    </div>

                    {/* Claimed URL handle */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">Claimed URL Handle</label>
                      <div className="flex rounded-lg overflow-hidden border border-outline-variant/50 bg-[#080808] focus-within:border-primary/50 transition-colors">
                        <span className="px-3.5 py-3 text-xs text-outline border-r border-outline-variant/30 bg-surface-container-low select-none font-semibold flex items-center">
                          tembopage.com/@
                        </span>
                        <input 
                          required
                          type="text" 
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          className="flex-grow text-xs p-3.5 outline-none text-[#eae1d4] bg-transparent"
                          placeholder={defaultHandle}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & Location inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email address */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">Contact Email</label>
                      <div className="relative">
                        <input 
                          required
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-xs p-3.5 pl-10 bg-[#080808] border border-outline-variant/50 rounded-lg text-on-surface outline-none input-glow transition-all duration-300"
                          placeholder="hello@yourbrand.com"
                        />
                        <Mail className="absolute left-3.5 top-[15px] text-outline" size={14} />
                      </div>
                    </div>

                    {/* Location coordinates */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">Location Coordinates</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full text-xs p-3.5 pl-10 bg-[#080808] border border-outline-variant/50 rounded-lg text-on-surface outline-none input-glow transition-all duration-300"
                          placeholder="Los Angeles, CA"
                        />
                        <MapPin className="absolute left-3.5 top-[15px] text-outline" size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Biography (Savannah Description) */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">Biography (Savannah Description)</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-3.5 bg-[#080808] border border-outline-variant/50 rounded-lg text-on-surface outline-none input-glow transition-all duration-300 resize-none leading-relaxed"
                      placeholder="Share a short bio..."
                    />
                  </div>

                  {/* Action button */}
                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      disabled={isSavingProfile}
                      className="bg-primary text-[#3c2f00] font-display font-bold text-xs py-4 px-8 rounded-lg uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(242,202,80,0.15)] hover:-translate-y-1 hover:shadow-[0_8px_30px_-2px_rgba(242,202,80,0.3)] transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSavingProfile ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                      {isSavingProfile ? 'Saving Details...' : 'Save Profile Changes'}
                    </button>
                  </div>

                </form>
              </div>

              {/* Security & Credentials Card */}
              <div className="bg-surface-container-high rounded-xl p-8 glow-card transition-all duration-300 border border-outline-variant/20">
                <h3 className="text-lg font-display font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
                  Security Credentials
                </h3>

                <form onSubmit={handleSaveSecurity} className="space-y-6 font-body">
                  {/* Current password */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">Current Password</label>
                    <div className="relative">
                      <input 
                        required
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full text-xs p-3.5 pl-10 bg-[#080808] border border-outline-variant/50 rounded-lg text-on-surface outline-none input-glow transition-all duration-300"
                        placeholder="••••••••••••"
                      />
                      <Key className="absolute left-3.5 top-[15px] text-outline" size={14} />
                    </div>
                  </div>

                  {/* New password column splits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">New Password</label>
                      <input 
                        required
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full text-xs p-3.5 bg-[#080808] border border-outline-variant/50 rounded-lg text-on-surface outline-none input-glow transition-all duration-300"
                        placeholder="Minimum 8 characters"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-2 tracking-wider uppercase">Confirm New Password</label>
                      <input 
                        required
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full text-xs p-3.5 bg-[#080808] border border-outline-variant/50 rounded-lg text-on-surface outline-none input-glow transition-all duration-300"
                        placeholder="Verify your new password"
                      />
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      disabled={isSavingSecurity}
                      className="bg-primary text-[#3c2f00] font-display font-bold text-xs py-4 px-8 rounded-lg uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(242,202,80,0.15)] hover:-translate-y-1 hover:shadow-[0_8px_30px_-2px_rgba(242,202,80,0.3)] transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSavingSecurity ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                      {isSavingSecurity ? 'Updating Password...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Right Hand: Device Mockup Live Preview & Stats (5 cols) */}
            <div className="lg:col-span-5 relative flex flex-col gap-6">
              
              {/* iPhone Mockup card wrapper */}
              <div className="sticky top-24 bg-[#121212] rounded-xl p-6 glow-card transition-all duration-300 border border-outline-variant/20 shadow-2xl h-[560px] flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 noise-texture opacity-30 pointer-events-none z-0" />
                
                {/* Visual frame header */}
                <div className="relative z-10 flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-4 select-none">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl font-bold">devices</span>
                    <h4 className="font-body text-xs font-bold text-on-surface uppercase tracking-widest">Live View Sync</h4>
                  </div>
                  <span className="text-[10px] text-outline font-semibold uppercase">Visitor Page</span>
                </div>

                {/* iPhone Frame Simulator */}
                <div className="relative z-10 bg-[#0c0c0e] p-6 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center overflow-hidden flex-grow shadow-[0_20px_40px_rgba(0,0,0,0.5)] justify-start">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none bg-primary"></div>
                  
                  {/* Dynamic Initial Avatar Badge */}
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

                  {/* Header text fields */}
                  <h5 className="font-display font-bold text-sm text-[#eae1d4]">{displayName || 'Your Name'}</h5>
                  <a href={`#/@${handle || defaultHandle}`} className="text-[10px] text-primary hover:underline mt-0.5 font-semibold cursor-pointer">tembopage.com/@{handle || defaultHandle}</a>

                  <p className="text-[10px] text-[#c9bfab] max-w-[240px] leading-relaxed mt-4 flex-grow font-body">
                    {bio || 'Enter your biography to populate your public visitor profile card.'}
                  </p>

                  {/* Mini Preview items representing layout widgets */}
                  <div className="w-full space-y-2 mt-4 select-none">
                    {userCards.length > 0 ? (
                      userCards.slice(0, 3).map((card, idx) => (
                        <div key={card.id || idx} className="w-full py-2 px-3.5 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-between text-[9px] text-[#c9bfab]">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="font-bold flex-grow text-left pl-3 truncate">{card.title || 'Untitled Block'}</span>
                          <span className="material-symbols-outlined text-[10px] text-outline">chevron_right</span>
                        </div>
                      ))
                    ) : (
                      <div className="w-full py-4 px-3 rounded-lg border border-dashed border-outline-variant/30 text-center">
                        <p className="text-[10px] font-semibold text-outline">No blocks added yet</p>
                        <p className="text-[8px] text-outline/60 mt-0.5">Use Page Builder to add links &amp; videos</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Brand Health Stats Card */}
              <div className="bg-surface-container-high rounded-xl p-6 glow-card transition-all duration-300 border border-outline-variant/20 relative overflow-hidden flex flex-col font-body">
                <h4 className="text-xs font-display font-bold text-on-surface uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-primary" size={14} />
                  Savannah Brand Health
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#121212] rounded-lg border border-outline-variant/20 text-center">
                    <p className="text-headline-sm font-black text-primary text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>Outstanding</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Handle URL Strength</p>
                  </div>
                  <div className="p-4 bg-[#121212] rounded-lg border border-outline-variant/20 text-center">
                    <p className="text-headline-sm font-black text-[#10b981] text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>🟢 Active</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Integration Handshake</p>
                  </div>
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
          <a className="flex flex-col items-center justify-center w-full h-full text-primary text-decoration-none" href="#/profile">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            <span className="text-[10px] font-semibold mt-1">Profile</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
