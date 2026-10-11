import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Key, Trash2, Plus, RefreshCw, XCircle, 
  Award, Users, MessageSquare, ExternalLink, Check, Clock
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { db } from './firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function OwnerAdmin() {
  const [activeTab, setActiveTab] = useState<'keys' | 'grants' | 'affiliates' | 'support'>('keys');

  // Beta Keys
  const [betaKeys, setBetaKeys] = useState<any[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  // Grant Applications
  const [grantApps, setGrantApps] = useState<any[]>([]);

  // Affiliate Applications
  const [affiliateApps, setAffiliateApps] = useState<any[]>([]);

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  useEffect(() => {
    // 1. Beta Keys subscription
    const unsubKeys = onSnapshot(collection(db, 'beta_keys'), (snapshot) => {
      const keys = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBetaKeys(keys);
    }, (err) => console.warn('Beta keys sync note:', err));

    // 2. Grant Applications subscription
    const unsubGrants = onSnapshot(collection(db, 'grant_applications'), (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGrantApps(apps);
    }, (err) => console.warn('Grants sync note:', err));

    // 3. Affiliate Applications subscription
    const unsubAffiliates = onSnapshot(collection(db, 'affiliate_applications'), (snapshot) => {
      const partners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAffiliateApps(partners);
    }, (err) => console.warn('Affiliates sync note:', err));

    // 4. Support Tickets subscription
    const unsubSupport = onSnapshot(collection(db, 'support_tickets'), (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSupportTickets(tickets);
    }, (err) => console.warn('Support sync note:', err));

    return () => {
      unsubKeys();
      unsubGrants();
      unsubAffiliates();
      unsubSupport();
    };
  }, []);

  const triggerToast = (message: string, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newAssignee.trim()) return;
    
    setIsSubmitting(true);
    const normalizedKey = newKey.trim().toLowerCase();
    
    try {
      await setDoc(doc(db, 'beta_keys', normalizedKey), {
        assignedTo: newAssignee.trim().toLowerCase(),
        active: true,
        createdAt: new Date().toISOString()
      });
      triggerToast(`Key ${normalizedKey} generated successfully!`);
      setNewKey('');
      setNewAssignee('');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to create key', 'error');
    }
    setIsSubmitting(false);
  };

  const handleRevokeKey = async (keyId: string, currentActive: boolean) => {
    try {
      await updateDoc(doc(db, 'beta_keys', keyId), { active: !currentActive });
      triggerToast(`Key ${currentActive ? 'revoked' : 'restored'}`);
    } catch (err) {
      triggerToast('Failed to update key status', 'error');
    }
  };

  const handleWipeWorkspace = async (creatorId: string) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY wipe the workspace for '${creatorId}'?`)) return;
    
    try {
      await deleteDoc(doc(db, 'creators', creatorId));
      triggerToast(`Workspace '${creatorId}' wiped permanently.`, 'amber');
    } catch (err) {
      triggerToast(`Failed to wipe workspace`, 'error');
    }
  };

  const handleUpdateGrantStatus = async (appId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'grant_applications', appId), { status: newStatus });
      triggerToast(`Application ${appId} marked as ${newStatus}`);
    } catch (err) {
      triggerToast('Failed to update application status', 'error');
    }
  };

  const handleUpdateAffiliateStatus = async (code: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'affiliate_applications', code), { status: newStatus });
      triggerToast(`Partner ${code} marked as ${newStatus}`);
    } catch (err) {
      triggerToast('Failed to update partner status', 'error');
    }
  };

  return (
    <div className="flex bg-[#16130b] min-h-screen text-[#eae1d4] font-body selection:bg-[#f2ca50]/30 overflow-hidden">
      <Sidebar active="owner-admin" />
      
      <main className="flex-1 overflow-y-auto relative h-screen">
        <div className="max-w-6xl mx-auto px-8 py-10">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-gradient-gold mb-2 flex items-center gap-3">
                <Shield className="text-[#f2ca50]" />
                Owner Admin Headquarters
              </h1>
              <p className="text-[#99907c] text-sm">
                Control access keys, review Creator Fund applications, and inspect affiliate partners in real-time.
              </p>
            </div>

            {/* Tab switchers */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1a1710] border border-[#f2ca50]/15">
              <button
                onClick={() => setActiveTab('keys')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'keys'
                    ? 'bg-[#f2ca50] text-[#3c2f00]'
                    : 'text-[#99907c] hover:text-[#eae1d4]'
                }`}
              >
                <Key size={14} /> Beta Keys ({betaKeys.length})
              </button>
              <button
                onClick={() => setActiveTab('grants')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'grants'
                    ? 'bg-[#f2ca50] text-[#3c2f00]'
                    : 'text-[#99907c] hover:text-[#eae1d4]'
                }`}
              >
                <Award size={14} /> Grant Applications ({grantApps.length})
              </button>
              <button
                onClick={() => setActiveTab('affiliates')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'affiliates'
                    ? 'bg-[#f2ca50] text-[#3c2f00]'
                    : 'text-[#99907c] hover:text-[#eae1d4]'
                }`}
              >
                <Users size={14} /> Affiliates ({affiliateApps.length})
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-[#f2ca50] text-[#3c2f00]'
                    : 'text-[#99907c] hover:text-[#eae1d4]'
                }`}
              >
                <MessageSquare size={14} /> Support ({supportTickets.length})
              </button>
            </div>
          </div>

          {/* TAB 1: BETA KEYS */}
          {activeTab === 'keys' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-1">
                <div className="bg-[#1a1710] border-t border-l border-[#f2ca50]/10 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-lg font-display font-bold text-[#eae1d4] mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-[#f2ca50]" /> Generate Key
                  </h2>
                  <form onSubmit={handleCreateKey} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs text-[#99907c] mb-1 block uppercase tracking-wider font-bold">Access Key</label>
                      <input
                        type="text"
                        value={newKey}
                        onChange={e => setNewKey(e.target.value)}
                        placeholder="e.g. beta-max-2026"
                        className="w-full bg-[#16130b] border border-[#f2ca50]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#f2ca50]/50 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#99907c] mb-1 block uppercase tracking-wider font-bold">Assign to Profile ID</label>
                      <input
                        type="text"
                        value={newAssignee}
                        onChange={e => setNewAssignee(e.target.value)}
                        placeholder="e.g. max"
                        className="w-full bg-[#16130b] border border-[#f2ca50]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#f2ca50]/50 transition-colors"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#f2ca50] text-[#3c2f00] font-bold py-3 rounded-lg hover:bg-[#ffe17a] transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    >
                      <Key size={16} /> Generate Beta Key
                    </button>
                  </form>
                </div>
              </div>

              {/* Keys List */}
              <div className="lg:col-span-2">
                <div className="bg-[#1a1710] border-t border-l border-[#f2ca50]/10 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-lg font-display font-bold text-[#eae1d4] mb-4 flex items-center gap-2">
                    <Key size={18} className="text-[#f2ca50]" /> Active Beta Keys
                  </h2>
                  
                  {betaKeys.length === 0 ? (
                    <div className="py-12 text-center text-[#99907c] border border-dashed border-[#f2ca50]/20 rounded-xl bg-[#16130b]/50">
                      <Shield className="mx-auto mb-3 opacity-50" size={24} />
                      <p className="text-sm">No beta keys active.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {betaKeys.map(key => (
                        <div key={key.id} className="flex items-center justify-between bg-[#16130b] border border-[#f2ca50]/10 rounded-xl p-4 transition-colors hover:border-[#f2ca50]/30">
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${key.active ? 'bg-[#6fe692] shadow-[0_0_10px_rgba(111,230,146,0.5)]' : 'bg-[#e05a4e]'}`} />
                            <div>
                              <p className="font-mono text-sm text-[#f2ca50] font-bold">{key.id}</p>
                              <p className="text-xs text-[#99907c] mt-0.5">Assigned Workspace: <strong className="text-[#eae1d4]">{key.assignedTo}</strong></p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRevokeKey(key.id, key.active)}
                              className="p-2 rounded-lg bg-[#231f17] hover:bg-[#332d21] text-[#99907c] hover:text-[#eae1d4] transition-colors cursor-pointer"
                              title={key.active ? "Revoke Key" : "Restore Key"}
                            >
                              {key.active ? <XCircle size={16} className="text-[#ffb4ab]" /> : <RefreshCw size={16} className="text-[#6fe692]" />}
                            </button>
                            <button
                              onClick={() => handleWipeWorkspace(key.assignedTo)}
                              className="p-2 rounded-lg bg-[#231f17] hover:bg-[#332d21] text-[#e05a4e] transition-colors cursor-pointer"
                              title="Wipe Workspace Data"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRANT APPLICATIONS */}
          {activeTab === 'grants' && (
            <div className="bg-[#1a1710] border-t border-l border-[#f2ca50]/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#4d4635]/30">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#eae1d4] flex items-center gap-2">
                    <Award size={20} className="text-[#f2ca50]" /> Creator Fund Grant Queue
                  </h2>
                  <p className="text-xs text-[#99907c] mt-1">
                    Incoming applications submitted through the public portal (<code className="text-[#f2ca50]">#/fund</code>). Stored in <code className="text-[#f2ca50]">grant_applications</code>.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/20">
                  {grantApps.length} Total Submissions
                </span>
              </div>

              {grantApps.length === 0 ? (
                <div className="py-16 text-center text-[#99907c] border border-dashed border-[#f2ca50]/20 rounded-xl bg-[#16130b]/50">
                  <Award className="mx-auto mb-3 opacity-40 text-[#f2ca50]" size={32} />
                  <p className="text-sm font-semibold">No grant applications submitted yet.</p>
                  <p className="text-xs text-[#99907c] mt-1">Applications submitted on <a href="#/fund" className="text-[#f2ca50] underline">tembopage.com/#/fund</a> will appear here instantly.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {grantApps.map((app) => (
                    <div key={app.id} className="p-5 rounded-xl bg-[#16130b] border border-[#f2ca50]/15 hover:border-[#f2ca50]/30 transition-all">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30">
                              {app.trackingId || app.id}
                            </span>
                            <h3 className="text-base font-bold text-[#eae1d4]">{app.creatorName}</h3>
                            <span className="text-xs text-[#99907c]">({app.email})</span>
                          </div>
                          <p className="text-xs text-[#f2ca50] font-semibold mt-1">
                            Target Tier: <strong className="text-[#eae1d4]">{app.targetTierName || app.targetTier}</strong> {app.targetTierAmount ? `(${app.targetTierAmount})` : ''} · Niche: {app.niche || 'Not specified'} · Reach: {app.audienceReach || 'Not specified'}
                          </p>
                        </div>

                        {/* Status badges & controls */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            app.status === 'approved' ? 'bg-[#6fe692]/20 text-[#6fe692] border border-[#6fe692]/40' :
                            app.status === 'rejected' ? 'bg-[#e05a4e]/20 text-[#e05a4e] border border-[#e05a4e]/40' :
                            'bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40'
                          }`}>
                            {app.status || 'pending_review'}
                          </span>
                          <button
                            onClick={() => handleUpdateGrantStatus(app.id, 'approved')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#231f17] hover:bg-[#6fe692]/20 text-[#6fe692] border border-[#4d4635] hover:border-[#6fe692]/40 transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateGrantStatus(app.id, 'rejected')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#231f17] hover:bg-[#e05a4e]/20 text-[#e05a4e] border border-[#4d4635] hover:border-[#e05a4e]/40 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      {/* Proposal text */}
                      <div className="p-3 rounded-lg bg-[#0c0c0e] border border-[#4d4635]/30 text-xs text-[#c9bfab] leading-relaxed mb-3">
                        <strong className="text-[#eae1d4] block mb-1">Proposal:</strong>
                        {app.proposal}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#99907c]">
                        <span>Profile: {app.profileUrl ? <a href={app.profileUrl} target="_blank" rel="noreferrer" className="text-[#f2ca50] hover:underline inline-flex items-center gap-1">{app.profileUrl} <ExternalLink size={10} /></a> : 'None'}</span>
                        <span>Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : 'Recently'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AFFILIATE APPLICATIONS */}
          {activeTab === 'affiliates' && (
            <div className="bg-[#1a1710] border-t border-l border-[#f2ca50]/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#4d4635]/30">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#eae1d4] flex items-center gap-2">
                    <Users size={20} className="text-[#f2ca50]" /> Affiliate Partner Network
                  </h2>
                  <p className="text-xs text-[#99907c] mt-1">
                    Incoming partners registered through the affiliate portal (<code className="text-[#f2ca50]">#/affiliate</code>). Stored in <code className="text-[#f2ca50]">affiliate_applications</code>.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/20">
                  {affiliateApps.length} Total Partners
                </span>
              </div>

              {affiliateApps.length === 0 ? (
                <div className="py-16 text-center text-[#99907c] border border-dashed border-[#f2ca50]/20 rounded-xl bg-[#16130b]/50">
                  <Users className="mx-auto mb-3 opacity-40 text-[#f2ca50]" size={32} />
                  <p className="text-sm font-semibold">No affiliate partners registered yet.</p>
                  <p className="text-xs text-[#99907c] mt-1">Partners registering on <a href="#/affiliate" className="text-[#f2ca50] underline">tembopage.com/#/affiliate</a> will appear here instantly.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {affiliateApps.map((partner) => (
                    <div key={partner.id} className="p-5 rounded-xl bg-[#16130b] border border-[#f2ca50]/15 hover:border-[#f2ca50]/30 transition-all">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30">
                              {partner.referralCode || partner.id}
                            </span>
                            <h3 className="text-base font-bold text-[#eae1d4]">{partner.partnerName}</h3>
                            <span className="text-xs text-[#99907c]">({partner.email})</span>
                          </div>
                          <p className="text-xs text-[#c9bfab] mt-1">
                            Audience: <strong className="text-[#eae1d4]">{partner.audienceSize || 'Unspecified'}</strong> · Payout: <strong className="text-[#f2ca50] uppercase">{partner.payoutMethod || 'stripe'}</strong>
                          </p>
                        </div>

                        {/* Status badges & controls */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            partner.status === 'active' ? 'bg-[#6fe692]/20 text-[#6fe692] border border-[#6fe692]/40' :
                            partner.status === 'suspended' ? 'bg-[#e05a4e]/20 text-[#e05a4e] border border-[#e05a4e]/40' :
                            'bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40'
                          }`}>
                            {partner.status || 'active'}
                          </span>
                          <button
                            onClick={() => handleUpdateAffiliateStatus(partner.id, partner.status === 'active' ? 'suspended' : 'active')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#231f17] hover:bg-[#332d21] text-[#c9bfab] border border-[#4d4635] transition-colors cursor-pointer"
                          >
                            {partner.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </div>

                      {/* Strategy */}
                      {partner.strategy && (
                        <div className="p-3 rounded-lg bg-[#0c0c0e] border border-[#4d4635]/30 text-xs text-[#c9bfab] leading-relaxed mb-3">
                          <strong className="text-[#eae1d4] block mb-1">Promotion Strategy:</strong>
                          {partner.strategy}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-[#99907c]">
                        <span>Channel: {partner.channelUrl ? <a href={partner.channelUrl} target="_blank" rel="noreferrer" className="text-[#f2ca50] hover:underline inline-flex items-center gap-1">{partner.channelUrl} <ExternalLink size={10} /></a> : 'None specified'}</span>
                        <span>Tracking URL: <code className="text-[#f2ca50]">https://tembopage.com/?ref={partner.referralCode || partner.id}</code></span>
                        <span>Registered: {partner.submittedAt ? new Date(partner.submittedAt).toLocaleDateString() : 'Recently'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUPPORT TICKETS */}
          {activeTab === 'support' && (
            <div className="bg-[#1a1710] border-t border-l border-[#f2ca50]/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#4d4635]/30">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#eae1d4] flex items-center gap-2">
                    <MessageSquare size={20} className="text-[#f2ca50]" /> Support Dispatch Tickets
                  </h2>
                  <p className="text-xs text-[#99907c] mt-1">
                    Incoming tickets submitted through the contact channel (<code className="text-[#f2ca50]">#/contact</code>). Stored in <code className="text-[#f2ca50]">support_tickets</code>.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/20">
                  {supportTickets.length} Total Tickets
                </span>
              </div>

              {supportTickets.length === 0 ? (
                <div className="py-16 text-center text-[#99907c] border border-dashed border-[#f2ca50]/20 rounded-xl bg-[#16130b]/50">
                  <MessageSquare className="mx-auto mb-3 opacity-40 text-[#f2ca50]" size={32} />
                  <p className="text-sm font-semibold">No support tickets submitted yet.</p>
                  <p className="text-xs text-[#99907c] mt-1">User inquiries sent from <a href="#/contact" className="text-[#f2ca50] underline">tembopage.com/#/contact</a> will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-5 rounded-xl bg-[#16130b] border border-[#f2ca50]/15 hover:border-[#f2ca50]/30 transition-all">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50]">
                              {ticket.ticketId || ticket.id}
                            </span>
                            <h3 className="text-sm font-bold text-[#eae1d4]">{ticket.name}</h3>
                            <span className="text-xs text-[#99907c]">({ticket.email})</span>
                            <span className="text-[11px] font-semibold text-[#f2ca50] uppercase px-2 py-0.5 rounded bg-[#231f17]">
                              {ticket.category || 'general'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#99907c]">
                          {ticket.submittedAt ? new Date(ticket.submittedAt).toLocaleString() : 'Recently'}
                        </span>
                      </div>
                      <p className="text-xs text-[#c9bfab] bg-[#0c0c0e] p-3 rounded-lg border border-[#4d4635]/30 whitespace-pre-wrap">
                        {ticket.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 border-t border-l"
          style={{
            background: '#1a1710',
            borderColor: toast.type === 'error' || toast.type === 'amber' ? 'rgba(224,90,78,0.3)' : 'rgba(111,230,146,0.3)',
          }}
        >
          <div className={`w-2 h-2 rounded-full ${toast.type === 'error' || toast.type === 'amber' ? 'bg-[#e05a4e] shadow-[0_0_8px_rgba(224,90,78,0.8)]' : 'bg-[#6fe692] shadow-[0_0_8px_rgba(111,230,146,0.8)]'}`} />
          <span className="text-sm font-bold text-[#eae1d4]">{toast.message}</span>
        </motion.div>
      )}
    </div>
  );
}
