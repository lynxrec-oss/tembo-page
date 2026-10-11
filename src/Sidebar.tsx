/**
 * TEMBO PAGE — Shared Sidebar Navigation
 *
 * Used across all interior app pages.
 * Pass `active` prop to highlight the current section.
 */

import React, { useState } from 'react';
import {
  LayoutDashboard, BarChart2, Megaphone, Wand2, Settings,
  HelpCircle, LogOut, Plus, MessageSquare, User, Shield
} from 'lucide-react';
import { TemboBrand } from './TemboBrand';

export type ActivePage =
  | 'dashboard'
  | 'analytics'
  | 'campaigns'
  | 'builder'
  | 'chat'
  | 'profile'
  | 'settings'
  | 'owner-admin';

const BASE_NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    page: 'dashboard' as ActivePage, hash: '#/dashboard' },
  { icon: User,             label: 'Profile',      page: 'profile'   as ActivePage, hash: '#/profile'    },
  { icon: Wand2,            label: 'Page Builder', page: 'builder'   as ActivePage, hash: '#/builder'    },
  { icon: BarChart2,        label: 'Analytics',    page: 'analytics' as ActivePage, hash: '#/analytics'  },
  { icon: Megaphone,        label: 'Campaigns',    page: 'campaigns' as ActivePage, hash: '#/campaigns'  },
  { icon: MessageSquare,    label: 'Chat Setup',   page: 'chat'      as ActivePage, hash: '#/chat'       },
  { icon: Settings,         label: 'Settings',     page: 'settings'  as ActivePage, hash: '#/settings'   },
];

export function getNavItems() {
  const isOwner = localStorage.getItem('savannah_bypass') === 'true';
  const isBeta = localStorage.getItem('beta_bypass') === 'true';
  
  let items = [...BASE_NAV_ITEMS];
  
  if (isBeta) {
    // Beta testers don't see Campaigns or Chat
    items = items.filter(i => i.page !== 'campaigns' && i.page !== 'chat');
  }
  
  if (isOwner) {
    items.push({ icon: Shield, label: 'Owner Admin', page: 'owner-admin' as ActivePage, hash: '#/owner-admin' });
  }
  
  return items;
}

import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const FOOTER_ITEMS = [
  { icon: HelpCircle, label: 'Help Center', hash: '#/help' },
  { icon: LogOut,     label: 'Log Out',     hash: '#/', onClick: async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out error:", e);
    }
    localStorage.removeItem('savannah_bypass');
    localStorage.removeItem('beta_bypass');
    localStorage.removeItem('has_active_session');
    localStorage.removeItem('active_creator_id');
    if (typeof window !== 'undefined') {
      (window as any).savannahBypass = false;
      (window as any).betaBypass = false;
      (window as any).hasActiveSession = false;
      window.location.hash = '#/login';
      window.location.reload();
    }
  }},
];

// ─── NavLink ─────────────────────────────────────────────────────────────────

function NavLink({
  icon: Icon, label, hash, isActive, onClick,
}: {
  icon: React.ElementType;
  label: string;
  hash: string;
  isActive: boolean;
  onClick?: () => void;
  key?: any;
}) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={hash}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.625rem 1rem',
        borderRadius: '0.75rem',
        fontSize: '0.875rem', fontWeight: 500,
        background: isActive
          ? 'rgba(242,202,80,0.08)'
          : hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        color: isActive ? '#f2ca50' : hov ? '#eae1d4' : '#99907c',
        borderLeft: isActive ? '3px solid #f2ca50' : '3px solid transparent',
        transform: !isActive && hov ? 'translateX(3px)' : 'translateX(0)',
        transition: 'all 0.15s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <Icon size={17} />
      {label}
    </a>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
 
export function Sidebar({ active }: { active: ActivePage }) {
  return (
    <nav
      className="hidden md:flex"
      style={{
        flexDirection: 'column',
        height: '100vh', width: '17rem', flexShrink: 0,
        padding: '1.5rem', gap: '1.25rem',
        background: '#231f17',
        borderRight: '1px solid rgba(242,202,80,0.08)',
        boxShadow: '4px 0 32px -8px rgba(0,0,0,0.5)',
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%', marginBottom: '1.25rem' }}>
        <TemboBrand iconSize={82} showWordmark={true} />
        <div style={{ textAlign: 'center', marginTop: '-0.375rem' }}>
          <p style={{ fontSize: '0.625rem', color: '#f2ca50', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
            Dashboard Mode
          </p>
          <p style={{ fontSize: '0.55rem', color: '#7d7060', marginTop: '0.125rem', letterSpacing: '0.05em' }}>
            {localStorage.getItem('beta_bypass') === 'true' ? 'Beta Preview' : 'Wise Leader Estate'}
          </p>
        </div>
      </div>

      {/* Create CTA */}
      <button
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          padding: '0.75rem', borderRadius: '0.75rem',
          background: '#f2ca50', color: '#3c2f00',
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.875rem',
          boxShadow: '0 4px 16px -4px rgba(242,202,80,0.25)',
          border: 'none', cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(242,202,80,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px -4px rgba(242,202,80,0.25)';
        }}
      >
        <Plus size={16} />
        Create New Link
      </button>

      {/* Main nav */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {getNavItems().map(item => (
          <NavLink
            key={item.label}
            icon={item.icon}
            label={item.label}
            hash={item.hash}
            isActive={item.page === active}
          />
        ))}
      </div>

      {/* Footer nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '1rem', borderTop: '1px solid rgba(77,70,53,0.25)' }}>
        {FOOTER_ITEMS.map(item => (
          <NavLink key={item.label} icon={item.icon} label={item.label} hash={item.hash} isActive={false} onClick={item.onClick} />
        ))}
      </div>
    </nav>
  );
}
