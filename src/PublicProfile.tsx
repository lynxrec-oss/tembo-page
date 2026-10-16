/**
 * TEMBO PAGE — Public Creator Profile Canvas
 * 
 * High-fidelity, mobile-optimized link-in-bio page for visitors.
 * Conforms strictly to the Savannah Sunset HSL premium design system.
 * Supports multiple creators: Elena Rust (elenarust) and Tembo The Wise (tembo).
 * Includes interactive modular drawers for booking, shopping, masterclass video player, 
 * email capture verification, and a fully interactive AI chatbot advisor.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { 
  ShoppingBag, Music, PlaySquare, Star, Mail, MessageSquare, 
  ChevronRight, Sparkles, Send, Check, Heart, Share2, Compass, Play,
  Calendar, X, CheckCircle2, MessageCircle, ArrowRight, Laptop, Clock, User, RefreshCw,
  Link as LinkIcon, Globe, Flame, Tag
} from 'lucide-react';
import { doc, onSnapshot, setDoc, arrayUnion, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const BACKGROUND_PRESETS: Record<string, { label: string; bg: string; isPro?: boolean }> = {
  sunset: {
    label: 'Savannah Sunset',
    bg: 'radial-gradient(circle at 50% 0%, rgba(242,202,80,0.15) 0%, transparent 60%), #16130b',
  },
  cyberpunk: {
    label: 'Midnight Cyberpunk',
    bg: 'radial-gradient(circle at 80% 20%, rgba(167,139,250,0.25) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(56,189,248,0.2) 0%, transparent 50%), #090d16',
  },
  noir: {
    label: 'Cinematic Noir',
    bg: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 80%), #050505',
  },
  oasis: {
    label: 'Emerald Oasis',
    bg: 'radial-gradient(circle at 50% 0%, rgba(111,230,146,0.18) 0%, transparent 60%), #06110a',
  },
  rosegold: {
    label: 'Rose Gold Elegance',
    bg: 'radial-gradient(circle at 50% 10%, rgba(224,90,78,0.22) 0%, transparent 60%), #140b0d',
  },
  mesh: {
    label: 'Ambient Mesh Glow',
    bg: 'linear-gradient(135deg, #1f1c13 0%, #2a1618 50%, #111823 100%)',
    isPro: true
  },
  neon: {
    label: 'VFX Neon Pulse',
    bg: 'radial-gradient(circle at 50% 30%, rgba(242,202,80,0.3) 0%, rgba(224,90,78,0.2) 50%, #0c0a07 100%)',
    isPro: true
  }
};

type TrafficSource = 'tiktok' | 'instagram' | 'youtube' | 'newsletter';

interface ProfileCard {
  id: string;
  type: 'video' | 'booking' | 'merch' | 'form' | 'spotify' | 'standard' | 'newsletter' | 'website' | 'socials' | 'drop' | 'music' | 'affiliate';
  title: string;
  subtitle: string;
  accent: string;
  icon: React.ReactNode;
  sources: TrafficSource[];
  promoCode?: string;
}

// ─── ELENA RUST CONFIGURATION ────────────────────────────────────────────────
const ELENA_CARDS: ProfileCard[] = [
  {
    id: 'merch',
    type: 'merch',
    title: 'New Drop — Savannah Tee',
    subtitle: 'Limited Edition · 47 left in inventory',
    accent: '#f2ca50',
    icon: <ShoppingBag size={18} />,
    sources: ['tiktok', 'newsletter', 'instagram'],
  },
  {
    id: 'youtube-video',
    type: 'video',
    title: 'Cinematic Vlog: Golden Hour in the Savanna',
    subtitle: '2.1M views · Watch direct embed',
    accent: '#e05a4e',
    icon: <PlaySquare size={18} />,
    sources: ['youtube', 'instagram'],
  },
  {
    id: 'spotify-music',
    type: 'spotify',
    title: 'Listen to my Savannah Sunset Vibes',
    subtitle: 'Curated compilation playlist · Spotify',
    accent: '#1db954',
    icon: <Music size={18} />,
    sources: ['tiktok', 'instagram', 'youtube'],
  },
  {
    id: 'newsletter-form',
    type: 'form',
    title: 'Join the Inner Circle',
    subtitle: 'Get exclusive drops & stories',
    accent: '#a78bfa',
    icon: <Mail size={18} />,
    sources: ['newsletter', 'youtube'],
  },
  {
    id: 'collab-inquiries',
    type: 'standard',
    title: 'Brand Partnership Inquiries',
    subtitle: 'Open for Spring/Summer 2026',
    accent: '#6fe692',
    icon: <MessageSquare size={18} />,
    sources: ['instagram', 'newsletter'],
  }
];

// ─── TEMBO THE WISE CONFIGURATION (Matches new HTML request exactly!) ──────────
const TEMBO_CARDS: ProfileCard[] = [
  {
    id: 'video-card',
    type: 'video',
    title: 'Latest Masterclass',
    subtitle: 'Cinematic creator guide. Play in high resolution.',
    accent: '#f2ca50',
    icon: <PlaySquare size={18} />,
    sources: ['tiktok', 'youtube', 'instagram'],
  },
  {
    id: 'booking-card',
    type: 'booking',
    title: 'Book a Strategy Session',
    subtitle: '1-on-1 consultation',
    accent: '#6fe692',
    icon: <Calendar size={18} />,
    sources: ['instagram', 'youtube'],
  },
  {
    id: 'merch-card',
    type: 'merch',
    title: 'Exclusive Merch',
    subtitle: 'Limited edition apparel',
    accent: '#f2ca50',
    icon: <ShoppingBag size={18} />,
    sources: ['tiktok', 'newsletter'],
  },
  {
    id: 'newsletter-card',
    type: 'form',
    title: 'Join the Inner Circle',
    subtitle: 'Get exclusive insights delivered to your inbox.',
    accent: '#eae1d4',
    icon: <Mail size={18} />,
    sources: ['newsletter', 'youtube', 'instagram'],
  }
];

const SOURCE_INFOS: Record<TrafficSource, { label: string; desc: string; color: string }> = {
  tiktok: { label: 'TikTok', desc: 'Merch Drop & video content highlighted first', color: '#f2ca50' },
  instagram: { label: 'Instagram', desc: 'Booking sessions & social links prioritized first', color: '#6fe692' },
  youtube: { label: 'YouTube', desc: 'Masterclass video player & booking slot positioned first', color: '#e05a4e' },
  newsletter: { label: 'Newsletter', desc: 'Inner Circle signup & merch collections prioritized first', color: '#a78bfa' }
};

interface PublicProfileProps {
  creatorId?: string;
}

function getEmbedInfo(url?: string): { type: 'youtube' | 'vimeo' | 'mp4' | 'other' | null, src: string } {
  if (!url) return { type: null, src: '' };
  const clean = url.trim();
  let ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0` };
  }
  let vimeoMatch = clean.match(/vimeo\.com\/(?:.*#|.*\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return { type: 'vimeo', src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };
  }
  if (
    clean.startsWith('data:video/') ||
    clean.includes('firebasestorage.googleapis.com') ||
    clean.includes('firebasestorage.app') ||
    clean.includes('alt=media') ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(clean)
  ) {
    return { type: 'mp4', src: clean };
  }
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return { type: 'other', src: clean };
  }
  return { type: 'other', src: `https://${clean}` };
}

export default function PublicProfile({ creatorId }: PublicProfileProps) {
  const getCreatorIdFromUrl = () => {
    if (creatorId) return creatorId.startsWith('@') ? creatorId.substring(1) : creatorId;
    if (typeof window === 'undefined') return 'elenarust';
    // 1. Check hash
    const h = window.location.hash.toLowerCase();
    const rawHash = h.startsWith('#/') ? h.substring(2) : h.startsWith('#') ? h.substring(1) : '';
    const cleanHash = (rawHash.startsWith('@') ? rawHash.substring(1) : rawHash).split('?')[0].replace(/\/+$/, '');
    const staticPages = ['dashboard', 'builder', 'analytics', 'campaigns', 'settings', 'chat', 'profile', 'owner-admin', 'help', 'onboarding', 'pricing', 'about', 'privacy', 'terms', 'contact', 'blog', 'affiliate', 'fund', 'login', 'index.html', ''];
    if (cleanHash && !staticPages.includes(cleanHash)) {
      return cleanHash;
    }
    // 2. Check pathname
    const p = window.location.pathname.toLowerCase();
    const rawPath = p.replace(/^\/+/, '').replace(/\/+$/, '');
    const cleanPath = (rawPath.startsWith('@') ? rawPath.substring(1) : rawPath).split('?')[0];
    if (cleanPath && !staticPages.includes(cleanPath)) {
      return cleanPath;
    }
    return 'elenarust';
  };
  const resolvedCreator = getCreatorIdFromUrl();

  const detectTrafficSource = (): TrafficSource => {
    if (typeof window === 'undefined') return 'tiktok';
    const searchParams = new URLSearchParams(window.location.search || '');
    let hashQuery = '';
    if (window.location.hash.includes('?')) {
      hashQuery = window.location.hash.substring(window.location.hash.indexOf('?'));
    }
    const hashParams = new URLSearchParams(hashQuery);

    const raw = (
      searchParams.get('utm_source') || 
      searchParams.get('source') || 
      hashParams.get('utm_source') || 
      hashParams.get('source') || 
      ''
    ).toLowerCase().trim();

    if (raw.includes('tiktok') || raw === 'tt') return 'tiktok';
    if (raw.includes('instagram') || raw.includes('insta') || raw === 'ig') return 'instagram';
    if (raw.includes('youtube') || raw === 'yt') return 'youtube';
    if (raw.includes('newsletter') || raw.includes('email') || raw.includes('mail') || raw === 'substack') return 'newsletter';

    const ref = (typeof document !== 'undefined' ? document.referrer || '' : '').toLowerCase();
    if (ref.includes('tiktok')) return 'tiktok';
    if (ref.includes('instagram')) return 'instagram';
    if (ref.includes('youtube')) return 'youtube';
    if (ref.includes('substack') || ref.includes('mail') || ref.includes('newsletter')) return 'newsletter';

    return 'tiktok';
  };

  const [activeSource, setActiveSource] = useState<TrafficSource>(detectTrafficSource);

  // Sync activeSource when URL hash or query params change
  useEffect(() => {
    const onUrlUpdate = () => {
      setActiveSource(detectTrafficSource());
    };
    window.addEventListener('hashchange', onUrlUpdate);
    window.addEventListener('popstate', onUrlUpdate);
    return () => {
      window.removeEventListener('hashchange', onUrlUpdate);
      window.removeEventListener('popstate', onUrlUpdate);
    };
  }, []);

  // Dispatch visit telemetry ping to Firestore analytics
  useEffect(() => {
    if (!resolvedCreator) return;
    const recordVisit = async () => {
      try {
        await addDoc(collection(db, 'analytics'), {
          creatorId: resolvedCreator,
          eventType: 'view',
          source: activeSource,
          pathway: activeSource,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Firestore Smart Pixel view ping error:", err);
      }
    };
    recordVisit();
  }, [resolvedCreator, activeSource]);
  
  // Likes State
  const [likes, setLikes] = useState(resolvedCreator === 'tembo' ? 942 : 148);
  const [hasLiked, setHasLiked] = useState(false);

  // Modal / Sheet States
  const [activeModal, setActiveModal] = useState<'video' | 'booking' | 'merch' | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('');
  
  // Checkout & Interactive Simulator States
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'success'>('details');
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow, May 26');
  const [selectedTime, setSelectedTime] = useState<string>('2:00 PM (EST)');
  const [bookingName, setBookingName] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'tembo' | 'user'; text: string }>>([
    { sender: 'tembo', text: "Salama! I am Tembo's Wise Advisor. Ask me anything about tracking visitor pathways, customizing profiles, or custom domains." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const [subscriberEmail, setSubscriberEmail] = useState('');

  const handleSubscribe = async (e: React.FormEvent, card?: any) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;

    if (card && card.formMode === 'crm' && card.crmUrl) {
      let targetUrl = card.crmUrl.trim();
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setEmailSubscribed(true);
      return;
    }

    setIsSubscribing(true);
    try {
      const docRef = doc(db, 'creators', resolvedCreator);
      await setDoc(docRef, {
        subscribers: arrayUnion({
          email: subscriberEmail.trim(),
          timestamp: new Date().toISOString(),
          source: card?.title || 'Bio Link Form'
        })
      }, { merge: true });
      // Log conversion to analytics
      addDoc(collection(db, 'analytics'), {
        creatorId: resolvedCreator,
        eventType: 'conversion',
        source: activeSource,
        pathway: activeSource,
        timestamp: serverTimestamp()
      }).catch(() => {});
      setIsSubscribing(false);
      setEmailSubscribed(true);
      setSubscriberEmail('');
    } catch (err) {
      console.error("Error saving subscriber:", err);
      setIsSubscribing(false);
      setEmailSubscribed(true);
    }
  };

  const handleChatQuestion = (question: string, answer: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: question }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { sender: 'tembo', text: answer }]);
    }, 1500);
  };

  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const docRef = doc(db, 'creators', resolvedCreator);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfileData(snapshot.data());
      }
    }, (err) => {
      console.error("Firestore PublicProfile onSnapshot error:", err);
    });
    return () => unsubscribe();
  }, [resolvedCreator]);

  const isAaron = ['aaron', 'aaronstowers', 'mycinetoolbox', 'cinetoolbox'].includes(resolvedCreator);
  const isBeta = ['beta', 'beta-tester', 'beta-tester-2026', 'savannah-beta', 'tembo-beta'].includes(resolvedCreator);
  const activeCreatorInfo = resolvedCreator === 'tembo' ? {
    name: 'Tembo The Wise',
    handle: 'tembo',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVKJMxxf0clrV5N1ea5CNvP-qy5i0-7w1zzzLuylHZR6RDokoIZ_OCDjHWFa5V3htOeb9h40feqED8fa2Zq-MOTa8X_nOqpZc9dCvnPC1HPrYQm69SESoz1hKtA0yFkBa39nKhkHHxwnJdH7A0upaX4SZmkLcK7k2OPGffl9TV_jQRmRh148P1Nb71thXpdJXtDXdn-YCUfW5IivgpV-8LyW7GNDxAxIIMFE6MpafYMLIuVJw0WKK-vvOT8Qi6Xd3ekS1Mb-7YJaY',
    bio: 'Digital savanna guide. Sharing wisdom on design, tech, and the creator economy.',
    cards: TEMBO_CARDS
  } : isBeta ? {
    name: 'Beta Explorer',
    handle: resolvedCreator,
    avatar: 'BE',
    bio: 'Official Tembo Page Beta Workspace. Discover dynamic link pathways in the digital savanna.',
    cards: []
  } : isAaron ? {
    name: 'Aaron Stowers',
    handle: resolvedCreator,
    avatar: 'AS',
    bio: 'Creator of My Cine Toolbox. VFX & unmixing lab.',
    cards: []
  } : resolvedCreator === 'elenarust' ? {
    name: 'Elena Rust',
    handle: 'elenarust',
    avatar: 'ER',
    bio: 'Visual artist & storyteller. Exploring the digital savanna.',
    cards: ELENA_CARDS
  } : {
    name: resolvedCreator.charAt(0).toUpperCase() + resolvedCreator.slice(1),
    handle: resolvedCreator,
    avatar: resolvedCreator.slice(0, 2).toUpperCase(),
    bio: 'Creator profile on Tembo Page.',
    cards: []
  };

  const resolvedName = profileData?.displayName || activeCreatorInfo.name;
  const resolvedBio = profileData?.bio || activeCreatorInfo.bio;
  const resolvedAvatar = profileData?.avatarUrl || activeCreatorInfo.avatar;

  const getAvatarInitials = () => {
    if (resolvedName) {
      const parts = resolvedName.split(' ');
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return resolvedName.slice(0, 2).toUpperCase();
    }
    return 'ER';
  };

  const getResolvedCards = (): ProfileCard[] => {
    if (!profileData) return activeCreatorInfo.cards;

    const cards: ProfileCard[] = [];

    // Add Video Block first if visible
    if (profileData.videoBlock && profileData.videoBlock.visible) {
      cards.push({
        id: 'video-card-db',
        type: 'video',
        title: profileData.videoBlock.title || 'Featured Video',
        subtitle: profileData.videoBlock.subtitle || 'Watch direct embed',
        accent: profileData.videoBlock.accent || '#e05a4e',
        icon: <PlaySquare size={18} />,
        sources: ['youtube', 'instagram', 'tiktok', 'newsletter']
      });
    }

    // Add links from Firestore
    if (profileData.links && Array.isArray(profileData.links)) {
      profileData.links.forEach((link: any, idx: number) => {
        if (!link) return;
        let iconNode = <Compass size={18} />;
        if (link.type === 'website') iconNode = <Globe size={18} />;
        else if (link.type === 'socials') iconNode = <Share2 size={18} />;
        else if (link.type === 'merch') iconNode = <ShoppingBag size={18} />;
        else if (link.type === 'music') iconNode = <Music size={18} />;
        else if (link.type === 'booking') iconNode = <Calendar size={18} />;
        else if (link.type === 'form' || link.type === 'newsletter') iconNode = <Mail size={18} />;
        else if (link.type === 'drop') iconNode = <Flame size={18} />;
        else if (link.type === 'affiliate') iconNode = <Tag size={18} />;
        else {
          const titleLower = String(link.title || '').toLowerCase();
          if (titleLower.includes('youtube')) iconNode = <PlaySquare size={18} />;
          else if (titleLower.includes('dehancer') || titleLower.includes('color') || titleLower.includes('off')) iconNode = <Star size={18} />;
          else if (titleLower.includes('facebook') || titleLower.includes('insta')) iconNode = <MessageSquare size={18} />;
          else if (titleLower.includes('website') || titleLower.includes('site') || titleLower.includes('web')) iconNode = <Globe size={18} />;
        }

        cards.push({
          id: link.id || `link-db-${idx}`,
          type: link.type || 'standard',
          title: link.title || 'Link',
          subtitle: link.url || '',
          accent: link.accent || '#f2ca50',
          formMode: link.formMode || 'dashboard',
          crmUrl: link.crmUrl || '',
          icon: iconNode,
          sources: ['youtube', 'instagram', 'tiktok', 'newsletter'],
          url: link.url,
          promoCode: link.promoCode || ''
        } as any);
      });
    }

    return cards.length > 0 ? cards : activeCreatorInfo.cards;
  };

  const resolvedCards = getResolvedCards();

  // Dynamic personalization pathway score for intelligent card ordering
  const getPathwayScore = (card: ProfileCard, source: TrafficSource): number => {
    const type = (card.type || '').toLowerCase();
    const title = (card.title || '').toLowerCase();
    let score = 50;

    switch (source) {
      case 'tiktok':
        if (type === 'drop') score += 100;
        else if (type === 'merch') score += 80;
        else if (type === 'video') score += 60;
        else if (type === 'affiliate') score += 50;
        else if (type === 'music') score += 40;
        else if (type === 'booking') score += 10;
        else if (type === 'form' || type === 'newsletter') score += 5;

        if (title.includes('drop') || title.includes('merch') || title.includes('shop') || title.includes('tee') || title.includes('store')) score += 30;
        if (title.includes('video') || title.includes('watch') || title.includes('masterclass')) score += 20;
        break;

      case 'instagram':
        if (type === 'booking') score += 100;
        else if (type === 'socials') score += 80;
        else if (type === 'website') score += 60;
        else if (type === 'music') score += 50;
        else if (type === 'drop') score += 40;
        else if (type === 'merch') score += 30;
        else if (type === 'video') score += 20;
        else if (type === 'form' || type === 'newsletter') score += 10;

        if (title.includes('book') || title.includes('call') || title.includes('session') || title.includes('consult')) score += 30;
        if (title.includes('instagram') || title.includes('social') || title.includes('portfolio')) score += 25;
        break;

      case 'youtube':
        if (type === 'video') score += 100;
        else if (type === 'booking') score += 80;
        else if (type === 'website') score += 50;
        else if (type === 'music') score += 40;
        else if (type === 'merch') score += 30;
        else if (type === 'drop') score += 25;
        else if (type === 'form' || type === 'newsletter') score += 20;

        if (title.includes('masterclass') || title.includes('video') || title.includes('vlog') || title.includes('watch') || title.includes('youtube')) score += 35;
        if (title.includes('session') || title.includes('strategy') || title.includes('call')) score += 25;
        break;

      case 'newsletter':
        if (type === 'form' || type === 'newsletter') score += 100;
        else if (type === 'drop') score += 70;
        else if (type === 'merch') score += 60;
        else if (type === 'website') score += 45;
        else if (type === 'booking') score += 35;
        else if (type === 'video') score += 20;

        if (title.includes('circle') || title.includes('newsletter') || title.includes('join') || title.includes('subscribe') || title.includes('inbox')) score += 40;
        if (title.includes('exclusive') || title.includes('drop') || title.includes('member')) score += 25;
        break;
    }

    return score;
  };

  // Re-order sorting based on dynamic personalization source (Personalization Engine)
  const sortCards = (cards: ProfileCard[]) => {
    if (!cards || cards.length === 0) return [];
    const visible = cards.filter(c => !c.sources || !Array.isArray(c.sources) || c.sources.length === 0 || c.sources.includes(activeSource));
    const targetCards = visible.length > 0 ? visible : cards;

    return [...targetCards].sort((a, b) => {
      const scoreA = getPathwayScore(a, activeSource);
      const scoreB = getPathwayScore(b, activeSource);
      return scoreB - scoreA;
    });
  };

  const sortedCards = sortCards(resolvedCards);
  const currentConfig = SOURCE_INFOS[activeSource];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert(`Public pathway url copied: ${url}`);
  };

    const activeBackground = profileData?.customBgUrl
      ? `url(${profileData.customBgUrl}) center/cover no-repeat fixed #16130b`
      : profileData?.backgroundTheme && BACKGROUND_PRESETS[profileData.backgroundTheme]
        ? BACKGROUND_PRESETS[profileData.backgroundTheme].bg
        : resolvedCreator === 'tembo'
          ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f2ca50' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") #16130b`
          : (BACKGROUND_PRESETS.sunset?.bg || '#16130b');

    return (
      <div 
        className="min-h-screen w-full relative flex flex-col items-center justify-start py-8 px-4"
        style={{ 
          color: '#eae1d4', 
          fontFamily: 'Inter, sans-serif',
          background: activeBackground,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {profileData?.customBgUrl && (
          <div 
            className="fixed inset-0 pointer-events-none z-0" 
            style={{ 
              background: 'rgba(22, 19, 11, 0.65)', 
              backdropFilter: 'blur(8px)' 
            }} 
          />
        )}
      {/* Dynamic backdrop glows */}
      <div className="fixed inset-0 noise-texture z-0 pointer-events-none opacity-20" />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700" 
        style={{ 
          background: `radial-gradient(circle, ${currentConfig.color}40, transparent 70%)`,
          transform: 'translateX(-50%) scale(1.3)'
        }} 
      />

      {/* Dynamic CSS Styling Inject */}
      <style dangerouslySetInnerHTML={{__html: `
        .glowing-card {
          background: linear-gradient(145deg, #1f1b13, #121212);
          border-top: 1px solid rgba(242, 202, 80, 0.1);
          border-left: 1px solid rgba(242, 202, 80, 0.1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.4);
          border-right: 1px solid rgba(0, 0, 0, 0.4);
          box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.5), 0 0 20px -5px rgba(242, 202, 80, 0.05);
          transition: all 0.3s ease;
        }
        .glowing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px -4px rgba(0, 0, 0, 0.6), 0 0 30px -5px rgba(242, 202, 80, 0.15);
        }
        .text-gradient-gold {
          background: linear-gradient(135deg, #f2ca50 0%, #ffe088 50%, #e9c349 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}} />

      {/* Simulator float header (Visual representation of Traffic Engine USP) */}
      <div 
        className="w-full max-w-[500px] rounded-2xl p-4 mb-8 z-20 border relative overflow-hidden"
        style={{ 
          background: 'rgba(26,23,16,0.85)', 
          backdropFilter: 'blur(16px)', 
          borderColor: 'rgba(242,202,80,0.15)', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)' 
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse" />
            <span className="text-[9px] font-black tracking-widest uppercase font-display" style={{ color: '#f2ca50' }}>Personalization Simulator</span>
          </div>
          <span className="text-[8px] font-bold text-[#99907c] font-body tracking-wider">SELECT TRAFFIC PATHWAY</span>
        </div>

        {/* Pill switcher */}
        <div className="grid grid-cols-4 gap-1 p-1.5 pb-2 rounded-xl bg-black/60 mb-3">
          {(Object.keys(SOURCE_INFOS) as TrafficSource[]).map(src => (
            <button
              key={src}
              onClick={() => setActiveSource(src)}
              className="py-2.5 rounded-lg text-[9px] font-black transition-all capitalize cursor-pointer font-display"
              style={activeSource === src 
                ? { background: `${SOURCE_INFOS[src].color}15`, color: SOURCE_INFOS[src].color, border: `1px solid ${SOURCE_INFOS[src].color}30` } 
                : { color: '#4d4635', border: '1px solid transparent' }
              }
            >
              {src}
            </button>
          ))}
        </div>

        <div className="mt-2.5 text-center text-[9px] font-bold tracking-wide uppercase transition-colors font-body" style={{ color: currentConfig.color }}>
          ✦ Active Personalization: {currentConfig.desc}
        </div>
      </div>

      {/* Main Mobile layout canvas container */}
      <main className="w-full max-w-[500px] z-10 flex flex-col items-center">
        
        {/* Quick Profile Actions (Likes / Share) */}
        <div className="w-full flex justify-between items-center mb-6 px-1 z-10">
          <button 
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer font-body"
            style={{ 
              background: hasLiked ? 'rgba(224,90,78,0.1)' : 'rgba(255,255,255,0.02)', 
              borderColor: hasLiked ? 'rgba(224,90,78,0.3)' : 'rgba(77,70,53,0.3)',
              color: hasLiked ? '#e05a4e' : '#eae1d4'
            }}
          >
            <Heart size={11} fill={hasLiked ? '#e05a4e' : 'none'} />
            {likes} Likes
          </button>

          <button 
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center rounded-full border text-[#99907c] transition-all hover:text-white cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(77,70,53,0.3)' }}
          >
            <Share2 size={11} />
          </button>
        </div>

        {/* Creator Identity Profile Header */}
        <header className="flex flex-col items-center text-center gap-4 mb-10 z-10">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20 p-1 glowing-card shrink-0">
            {resolvedAvatar && (resolvedAvatar.startsWith('http') || resolvedAvatar.startsWith('/') || resolvedAvatar.startsWith('data:')) ? (
              <img 
                src={resolvedAvatar} 
                alt={resolvedName} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full rounded-full flex items-center justify-center font-black text-3xl"
                style={{ background: 'linear-gradient(135deg, #f2ca50, #ffe088)', color: '#3c2f00' }}
              >
                {getAvatarInitials()}
              </div>
            )}
          </div>
          
          <h2 className="font-display font-bold text-display-md text-primary tracking-tighter mt-1">
            {resolvedName}
          </h2>
          
          <p className="font-body text-sm text-on-surface-variant max-w-sm leading-relaxed">
            {resolvedBio}
          </p>

          {/* Active Personalization indicator */}
          <div 
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[9px] font-bold border transition-all font-body"
            style={{ background: `${currentConfig.color}10`, borderColor: `${currentConfig.color}30`, color: currentConfig.color }}
          >
            <Sparkles size={9} /> Personalization engine: served custom layout for your {currentConfig.label} pathway
          </div>
        </header>

        {/* DRAGGABLE / PERSONALIZED LINKS SECTION */}
        <div className="w-full space-y-4 z-10">
          {sortedCards.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-2xl bg-surface-container-low/50 border border-outline-variant/20 font-body glowing-card">
              <Sparkles className="w-8 h-8 text-primary/70 mx-auto mb-3" />
              <h3 className="text-sm font-display font-bold text-on-surface mb-1">Savannah Sanctuary Curating</h3>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                This creator is assembling their cards and experiences. Check back soon!
              </p>
            </div>
          ) : (
            <LayoutGroup>
              <AnimatePresence mode="popLayout">
                {sortedCards.map((card, i) => {
                  // Determine layout custom style triggers
                  const isPersonalizedActive = i === 0; // Highlight the top bubble
                return (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.96 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 280, damping: 26 },
                      delay: i * 0.05,
                      duration: 0.3
                    }}
                    onClick={() => {
                      // Dispatch click ping to Firestore analytics
                      try {
                        addDoc(collection(db, 'analytics'), {
                          creatorId: resolvedCreator,
                          eventType: 'click',
                          source: activeSource,
                          pathway: activeSource,
                          targetUrl: (card as any).url || card.title,
                          timestamp: serverTimestamp()
                        }).catch(() => {});
                      } catch (err) {}

                      if (card.type === 'video') {
                        setActiveVideoUrl((card as any).url || profileData?.videoBlock?.videoUrl || '');
                        setActiveModal('video');
                      }
                      else if (card.type === 'booking') setActiveModal('booking');
                      else if (card.type === 'merch') setActiveModal('merch');
                      else if ((card as any).url) {
                        let targetUrl = (card as any).url.trim();
                        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('mailto:') && !targetUrl.startsWith('tel:')) {
                          targetUrl = `https://${targetUrl}`;
                        }
                        window.open(targetUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className={`glowing-card rounded-xl p-5 relative overflow-hidden group cursor-pointer transition-all border ${
                      card.type === 'drop'
                        ? 'border-[#e05a4e]/60 ring-1 ring-[#e05a4e]/40 shadow-[0_0_30px_rgba(224,90,78,0.2)] bg-gradient-to-r from-[#1c140f] to-[#261814]'
                        : isPersonalizedActive ? 'ring-1' : ''
                    }`}
                    style={isPersonalizedActive && card.type !== 'drop' ? {
                      borderColor: `${currentConfig.color}90`,
                      boxShadow: `0 0 25px ${currentConfig.color}25`
                    } : {}}
                  >
                    {/* Background slide overlay on hover */}
                    <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Highlights accent border */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5" 
                      style={{ background: isPersonalizedActive ? currentConfig.color : card.accent }} 
                    />

                    {/* Standard details split layout (Booking, Merch, Video links) */}
                    <div className="flex items-center gap-4 relative z-10">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: isPersonalizedActive ? `${currentConfig.color}20` : `${card.accent}15`, 
                          color: isPersonalizedActive ? currentConfig.color : card.accent 
                        }}
                      >
                        {card.icon}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-base text-on-surface truncate group-hover:text-primary transition-colors">
                            {card.title}
                          </h3>
                          {card.type === 'drop' && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f2ca50] to-[#e05a4e] text-[#16130b] shadow-[0_0_12px_rgba(224,90,78,0.5)] uppercase tracking-widest font-display select-none animate-pulse">
                              🔥 NEW DROP
                            </span>
                          )}
                          {card.type === 'affiliate' && card.promoCode && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#6fe692]/15 text-[#6fe692] border border-[#6fe692]/30 uppercase tracking-wider font-display select-none flex items-center gap-1">
                              🏷️ {card.promoCode}
                            </span>
                          )}
                          {isPersonalizedActive && (
                            <span 
                              className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest font-display select-none flex items-center gap-1"
                              style={{ 
                                background: `${currentConfig.color}20`, 
                                color: currentConfig.color, 
                                border: `1px solid ${currentConfig.color}40` 
                              }}
                            >
                              ✦ {currentConfig.label} Pathway Pick
                            </span>
                          )}
                        </div>
                        <p className="font-body text-xs text-on-surface-variant mt-0.5 truncate">
                          {card.subtitle}
                        </p>
                      </div>

                      <ChevronRight 
                        size={15} 
                        className="text-[#4d4635] group-hover:text-primary transition-colors group-hover:translate-x-1 duration-200" 
                      />
                    </div>

                    {/* Render Inline Capture Forms (For Joint Inner Circle newsletters & Forms) */}
                    {(card.type === 'form' || card.type === 'newsletter') && (
                      <div className="mt-4 pt-4 border-t border-outline-variant/30 relative z-10" onClick={(e) => e.stopPropagation()}>
                        {emailSubscribed ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-3 rounded-lg flex items-center gap-3 bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-semibold"
                          >
                            <CheckCircle2 size={15} />
                            <span>Welcome to the VIP List! You're officially subscribed.</span>
                          </motion.div>
                        ) : (
                          <form onSubmit={(e) => handleSubscribe(e, card)} className="flex gap-2">
                            <input 
                              required
                              type="email" 
                              value={subscriberEmail}
                              onChange={e => setSubscriberEmail(e.target.value)}
                              placeholder={(card as any).formMode === 'crm' ? "Enter email to join..." : "Email address"}
                              className="flex-grow bg-surface-container-highest border border-outline-variant/50 rounded-lg px-4 py-2.5 text-xs text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40 font-body"
                            />
                            <button 
                              type="submit"
                              disabled={isSubscribing}
                              className="bg-primary text-on-primary font-display font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-primary-fixed-dim hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(242,202,80,0.25)] flex items-center justify-center shrink-0"
                            >
                              {isSubscribing ? <RefreshCw className="animate-spin" size={12} /> : (card as any).formMode === 'crm' ? 'Join / Visit' : 'Subscribe'}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </LayoutGroup>
          )}
        </div>

        {/* Footer branding details */}
        <footer className="mt-16 mb-16 text-center flex flex-col items-center gap-1.5 z-10 select-none">
          <div className="flex items-center gap-1.5 text-[9px] font-black text-[#4d4635] tracking-wider uppercase font-display">
            <Compass size={11} className="text-[#f2ca50] font-black" />
            BUILT ON TEMBO PAGE 🐘
          </div>
          <p className="text-[8px] text-[#4d4635] font-body">Your Bio Link Should Think · © 2026</p>
        </footer>

      </main>

      {/* INTERACTIVE DRAWERS / MODALS SIMULATORS */}
      <AnimatePresence>
        {/* 1. LATEST MASTERCLASS VIDEO DRAWER */}
        {activeModal === 'video' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glowing-card rounded-2xl overflow-hidden z-10 border border-outline-variant/30 bg-[#121212]"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <PlaySquare size={16} className="text-primary" />
                  <span className="font-display font-bold text-sm">
                    {profileData?.videoBlock?.title || 'Video Player'}
                  </span>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-outline hover:text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {/* Player canvas */}
              <div className="relative aspect-video bg-black flex items-center justify-center w-full overflow-hidden">
                {(() => {
                  const url = activeVideoUrl || profileData?.videoBlock?.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                  const info = getEmbedInfo(url);
                  if (!info.src) {
                    return (
                      <div className="flex flex-col items-center justify-center p-6 text-center text-on-surface-variant">
                        <PlaySquare size={36} className="text-primary/40 mb-2" />
                        <p className="font-display font-bold text-sm text-on-surface">No Video URL Configured</p>
                        <p className="text-xs text-outline mt-1">Add a YouTube, Vimeo, or direct video link in the Page Builder to play it here.</p>
                      </div>
                    );
                  }
                  if (info.type === 'mp4') {
                    return (
                      <video src={info.src} controls autoPlay className="w-full h-full object-contain" />
                    );
                  }
                  return (
                    <iframe
                      src={info.src}
                      title="Video player"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                })()}
              </div>

              {/* Description */}
              <div className="p-6">
                <h4 className="font-display font-bold text-lg text-primary mb-2">
                  {profileData?.videoBlock?.title || 'Featured Video'}
                </h4>
                {profileData?.videoBlock?.subtitle && (
                  <p className="text-xs text-on-surface-variant font-body leading-relaxed mb-4">
                    {profileData?.videoBlock?.subtitle}
                  </p>
                )}
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#1f1b13] border border-outline-variant/30 text-outline-variant flex items-center gap-1">
                    <User size={10} /> By {resolvedName}
                  </span>
                </div>
              </div>

            </motion.div>
          </div>
        )}

        {/* 2. INTERACTIVE BOOKING CALENDAR SHEET */}
        {activeModal === 'booking' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glowing-card rounded-2xl p-6 z-10 border border-outline-variant/30 bg-[#121212] font-body"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#6fe692]" />
                  <span className="font-display font-bold text-sm">Book Strategy Session</span>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-outline hover:text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {bookingSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-[#6fe692]/10 border border-[#6fe692]/30 flex items-center justify-center mx-auto mb-4 text-[#6fe692]">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#eae1d4] mb-2">Strategy Session Confirmed!</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto mb-6">
                    Congratulations, <strong>{bookingName || 'Guest'}</strong>! Your 1-on-1 wisdom exchange is booked for <strong>{selectedDate} at {selectedTime}</strong>. A calendar invitation has been dispatched.
                  </p>
                  <button 
                    onClick={() => {
                      setBookingSuccess(false);
                      setBookingName('');
                      setActiveModal(null);
                    }}
                    className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-display font-bold text-xs hover:bg-primary-fixed transition-all cursor-pointer"
                  >
                    Return to Savannah
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  {/* Select Date */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-2">SELECT DATE</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Tomorrow, May 26', 'Wed, May 27', 'Thu, May 28'].map(date => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedDate === date
                              ? 'bg-[#6fe692]/15 text-[#6fe692] border border-[#6fe692]/35'
                              : 'bg-surface-container border border-outline-variant/30 text-outline hover:text-white'
                          }`}
                        >
                          {date.split(',')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Time */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-2">SELECT TIME SLOT</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['10:00 AM (EST)', '2:00 PM (EST)', '4:30 PM (EST)', '7:00 PM (EST)'].map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedTime === time
                              ? 'bg-[#6fe692]/15 text-[#6fe692] border border-[#6fe692]/35'
                              : 'bg-surface-container border border-outline-variant/30 text-outline hover:text-white'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact details */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-2">YOUR NAME</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Enter your name"
                      value={bookingName}
                      onChange={e => setBookingName(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-outline-variant/30 outline-none text-[#eae1d4] bg-[#0c0a06] focus:border-[#6fe692]/50 transition-colors"
                    />
                  </div>

                  {/* Submit button */}
                  <button 
                    disabled={!bookingName.trim()}
                    onClick={() => {
                      setBookingSuccess(true);
                      addDoc(collection(db, 'analytics'), {
                        creatorId: resolvedCreator,
                        eventType: 'conversion',
                        source: activeSource,
                        pathway: activeSource,
                        targetUrl: 'Strategic Consultation Booking',
                        timestamp: serverTimestamp()
                      }).catch(() => {});
                    }}
                    className="w-full py-3 rounded-lg bg-[#6fe692] text-[#003919] font-display font-bold text-xs hover:bg-[#83fba5] transition-all cursor-pointer disabled:opacity-50"
                  >
                    Confirm Strategic Slot
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}

        {/* 3. INTERACTIVE MERCH DROPS DRAWER */}
        {activeModal === 'merch' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glowing-card rounded-2xl p-6 z-10 border border-outline-variant/30 bg-[#121212] font-body"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} className="text-primary" />
                  <span className="font-display font-bold text-sm">Savannah Drops Store</span>
                </div>
                <button onClick={() => { setActiveModal(null); setCheckoutStep('details'); }} className="text-outline hover:text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {checkoutStep === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#eae1d4] mb-2">Order Dispatched successfully!</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto mb-6">
                    Excellent choice! Your <strong>Organic Savannah Tee (Size {selectedSize})</strong> is registered. We've allocated inventory, and dispatch will follow. Welcome to the Herd!
                  </p>
                  <button 
                    onClick={() => {
                      setCheckoutStep('details');
                      setActiveModal(null);
                    }}
                    className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-display font-bold text-xs hover:bg-primary-fixed transition-all cursor-pointer"
                  >
                    Explore More Drops
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  <div className="flex gap-4 p-3 bg-surface-container rounded-xl border border-outline-variant/20">
                    <div className="w-16 h-16 rounded-lg bg-[#38342b] flex items-center justify-center font-black text-2xl select-none text-primary">
                      👕
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#eae1d4]">Organic Savannah Tee</h4>
                      <p className="text-xs text-[#f2ca50] font-bold mt-0.5">$28.00 USD</p>
                      <p className="text-[10px] text-[#99907c] mt-1">100% Organic African Cotton · Vintage Wash</p>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-2">CHOOSE SIZE</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['S', 'M', 'L', 'XL'] as const).map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedSize === size
                              ? 'bg-primary/15 text-primary border border-primary/35'
                              : 'bg-surface-container border border-outline-variant/30 text-outline hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checkout summaries */}
                  <div className="pt-4 border-t border-outline-variant/30 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-outline">Subtotal</span>
                      <span className="text-[#eae1d4] font-bold">$28.00</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-outline">Savannah Delivery</span>
                      <span className="text-[#6fe692] font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed border-outline-variant/30">
                      <span className="text-on-surface font-bold">Total</span>
                      <span className="text-primary font-black">$28.00 USD</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCheckoutStep('success')}
                    className="w-full py-3 rounded-lg bg-primary text-on-primary font-display font-bold text-xs hover:bg-primary-fixed transition-all cursor-pointer shadow-[0_4px_16px_rgba(242,202,80,0.25)]"
                  >
                    Checkout (Simulate)
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}

        {/* 4. CONVERSATIONAL AI CHATBOT ADVISOR */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
              className="fixed bottom-24 right-6 w-[360px] h-[500px] glowing-card rounded-2xl overflow-hidden z-50 border border-outline-variant/30 bg-[#121212] flex flex-col font-body shadow-2xl"
            >
              {/* Chat Header */}
              <div className="bg-[#1f1b13] px-4 py-4 flex items-center justify-between border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-lg shrink-0">
                    🐘
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-on-surface">Wise Elephant AI</h4>
                    <p className="text-[9px] text-[#6fe692] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6fe692] animate-pulse" />
                      Savanna Guide Active
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-outline hover:text-white cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              {/* Chat Scrollbox */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-[#0a0a0a]">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-on-primary rounded-tr-none font-semibold'
                          : 'bg-surface-container border border-outline-variant/20 text-[#c9bfab] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-surface-container border border-outline-variant/20 text-outline rounded-2xl rounded-tl-none p-3 text-xs flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-[#4d4635] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#4d4635] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#4d4635] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Questions block */}
              <div className="p-3 bg-[#121212] border-t border-outline-variant/30 space-y-2">
                <span className="text-[8px] font-bold text-[#4d4635] uppercase tracking-wider block mb-1">ASK A SAVANNA QUESTION:</span>
                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
                  {[
                    {
                      q: "How do I configure my Smart Pixel?",
                      a: "The tracking of herd movements is essential. In the Settings tab under Smart Pixel Setup, copy the Javascript snippet and place it above the </head> tag of your site. Click 'Verify Connection' to trigger a handshake signal. It's like tracking footprints in the savanna sand!"
                    },
                    {
                      q: "What is your unique personalization engine?",
                      a: "Every visitor walks a unique path. Tembo reads where the visitor comes from (like Instagram or TikTok) and automatically re-orders and updates your link cards to present exactly what they seek. Try clicking the pathway selector at the top of this profile to see it in action!"
                    },
                    {
                      q: "Can I claim a custom domain?",
                      a: "An elephant claims its own territory. You can map any custom domain mask (like bio.yourname.com) inside Settings. Simply add a DNS CNAME record pointing to cname.tembo.page."
                    },
                    {
                      q: "Tell me a wise savanna proverb.",
                      a: "He who walks slowly across the savanna goes far. Do not rush to compile complex grids—craft beautiful, harmonious experiences that wow your herd at first glance."
                    }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChatQuestion(item.q, item.a)}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20 hover:border-primary/20 text-[9px] font-semibold text-outline hover:text-primary transition-all text-left cursor-pointer"
                    >
                      {item.q}
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic chat toggle button */}
        <button 
          onClick={() => setIsChatOpen(prev => !prev)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_8px_30px_-4px_rgba(242,202,80,0.35)] flex items-center justify-center hover:scale-110 transition-all z-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isChatOpen ? 'close' : 'chat'}
          </span>
        </button>

      </AnimatePresence>

    </div>
  );
}
