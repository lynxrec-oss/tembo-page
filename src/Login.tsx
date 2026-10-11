import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { auth, functions } from './firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

export default function Login() {
  const [accessKey, setAccessKey] = useState('');
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);
  const [keyError, setKeyError] = useState(false);

  const [loginMode, setLoginMode] = useState<'email' | 'key'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsVerifyingKey(true);
    setLoginError(false);
    
    try {
      // Lazy load to avoid import issues if not explicitly added to imports
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Let App.tsx onAuthStateChanged handle the redirect
      window.location.hash = '#/dashboard';
      window.location.reload();
    } catch (err) {
      console.error(err);
      setLoginError(true);
    }
    setIsVerifyingKey(false);
  };

  const handleVerifyOwnerKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) return;

    setIsVerifyingKey(true);
    setKeyError(false);
    sessionStorage.setItem('authenticating_key', 'true');

    try {
      const { signInAnonymously } = await import('firebase/auth');
      const userCredential = await signInAnonymously(auth);
      const uid = userCredential.user.uid;

      const validateAccessKey = httpsCallable(functions, 'validateAccessKey');
      const response = await validateAccessKey({ accessKey, uid });
      const data = response.data as any;

      if (data.valid) {
        // Ensure localStorage flags are set for backward compatibility of UI state
        localStorage.setItem('has_active_session', 'true');
        localStorage.setItem('active_creator_id', data.creatorId);
        if (data.type === 'owner') {
          localStorage.setItem('savannah_bypass', 'true');
        } else if (data.type === 'beta') {
          localStorage.setItem('beta_bypass', 'true');
        }
        sessionStorage.removeItem('authenticating_key');
        
        // Force redirect to dashboard to reload the app with the new Firebase auth context
        window.location.hash = '#/dashboard';
        window.location.reload();
      } else {
        sessionStorage.removeItem('authenticating_key');
        try {
          const { signOut } = await import('firebase/auth');
          await signOut(auth);
        } catch (e) {}
        setKeyError(true);
      }
    } catch (err) {
      console.error(err);
      sessionStorage.removeItem('authenticating_key');
      try {
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
      } catch (e) {}
      setKeyError(true);
    }
    setIsVerifyingKey(false);
  };

  return (
    <div className="min-h-screen bg-[#16130b] text-[#eae1d4] font-body flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#1a1710] border border-[#f2ca50]/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f2ca50] to-transparent opacity-20" />
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-gradient-gold mb-2">Welcome Back</h2>
          <p className="text-sm text-[#99907c]">Log in to manage your creator ecosystem.</p>
        </div>

        <div className="flex gap-2 p-1.5 pb-2 rounded-xl w-fit mx-auto bg-[#12110d] border border-outline-variant/30 font-body mb-6">
          <button
            type="button"
            onClick={() => { setLoginMode('email'); setLoginError(false); setKeyError(false); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              loginMode === 'email' ? 'bg-surface-container-high text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-outline hover:text-on-surface'
            }`}
          >
            Email Login
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('key'); setLoginError(false); setKeyError(false); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              loginMode === 'key' ? 'bg-surface-container-high text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-outline hover:text-on-surface'
            }`}
          >
            Access Key
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loginMode === 'email' ? (
            <motion.form key="email-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-xs text-[#99907c] mb-1 block uppercase tracking-wider font-bold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="creator@example.com"
                  className="w-full bg-[#16130b] border border-[#f2ca50]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f2ca50]/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-[#99907c] mb-1 block uppercase tracking-wider font-bold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16130b] border border-[#f2ca50]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f2ca50]/50 transition-colors"
                />
              </div>

              <AnimatePresence>
                {loginError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm text-[#e05a4e] bg-[#e05a4e]/10 p-3 rounded-lg border border-[#e05a4e]/20">
                    Invalid email or password.
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" disabled={isVerifyingKey || !email.trim() || !password.trim()} className="w-full glow-button bg-[#f2ca50] text-[#3c2f00] font-bold py-3.5 rounded-xl hover:bg-[#ffe17a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4">
                {isVerifyingKey ? <Loader2 size={18} className="animate-spin" /> : <>Log In <ArrowRight size={18} /></>}
              </button>
            </motion.form>
          ) : (
            <motion.form key="key-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleVerifyOwnerKey} className="space-y-4">
              <div>
                <label className="text-xs text-[#99907c] mb-1 block uppercase tracking-wider font-bold">Access Key</label>
                <input
                  type="text"
                  value={accessKey}
                  onChange={e => setAccessKey(e.target.value)}
                  placeholder="e.g. beta-tester-2026"
                  className="w-full bg-[#16130b] border border-[#f2ca50]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f2ca50]/50 transition-colors"
                />
              </div>

              <AnimatePresence>
                {keyError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm text-[#e05a4e] bg-[#e05a4e]/10 p-3 rounded-lg border border-[#e05a4e]/20">
                    Invalid access key. Please check and try again.
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" disabled={isVerifyingKey || !accessKey.trim()} className="w-full glow-button bg-[#f2ca50] text-[#3c2f00] font-bold py-3.5 rounded-xl hover:bg-[#ffe17a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4">
                {isVerifyingKey ? <Loader2 size={18} className="animate-spin" /> : <><KeyRound size={18} /> Unlock <ArrowRight size={18} /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <a href="#/" className="text-xs text-[#99907c] hover:text-[#f2ca50] transition-colors">← Back to Homepage</a>
        </div>
      </motion.div>
    </div>
  );
}
