
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Share2, 
  Snowflake, 
  Zap, 
  Music,
  User,
  Frame,
  Send,
  ChevronDown,
  Layout,
  Star,
  Trees,
  Gift,
  Bell,
  Heart,
  Volume2,
  Printer,
  Copy,
  Check,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  X,
  Eye,
  Settings2
} from 'lucide-react';
import * as htmlToImage from 'https://esm.sh/html-to-image@1.11.11';
import { CardState, CardTone, CardFrameStyle, SealType } from './types';
import { generateWishAI, generateCardImageAI, generateSpeechAI } from './services/gemini';
import SnowEffect from './components/SnowEffect';

const TONES: CardTone[] = ['Heartfelt', 'Funny', 'Professional', 'Poetic', 'Short & Sweet'];
const FRAMES: CardFrameStyle[] = ['Classic', 'Candy Cane', 'Winter Frost', 'Forest Pine', 'Midnight Sleigh', 'Santa’s Workshop'];
const SEALS: SealType[] = ['Reindeer', 'Snowflake', 'Tree', 'Star', 'Heart', 'None'];

const SEAL_ICONS: Record<SealType, React.ReactNode> = {
  'Reindeer': <span className="text-2xl">🦌</span>,
  'Snowflake': <Snowflake className="w-6 h-6 text-red-100" />,
  'Tree': <Trees className="w-6 h-6 text-red-100" />,
  'Star': <Star className="w-6 h-6 text-red-100 fill-red-100" />,
  'Heart': <Heart className="w-6 h-6 text-red-100 fill-red-100" />,
  'None': null
};

const App: React.FC = () => {
  const [state, setState] = useState<CardState>({
    recipient: 'Dear Family',
    sender: 'Santa’s Helper',
    tone: 'Heartfelt',
    frameStyle: 'Classic',
    sealType: 'Tree',
    message: 'May your home be filled with the magic of Santa’s visit and your heart with the warmth of love. Wishing you a Christmas that sparkles with joy and wonder!',
    imageUrl: 'https://images.unsplash.com/photo-1512433990356-47065c86f7e3?q=80&w=1000&auto=format&fit=crop',
    isGeneratingText: false,
    isGeneratingImage: false,
    isGeneratingAudio: false,
    isExporting: false,
  });

  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const cardRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playChime = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const handleGenerateWish = async () => {
    playChime();
    setState(prev => ({ ...prev, isGeneratingText: true }));
    const wish = await generateWishAI(state.recipient, state.sender, state.tone);
    setState(prev => ({ ...prev, message: wish, isGeneratingText: false }));
  };

  const handleGenerateImage = async () => {
    playChime();
    setState(prev => ({ ...prev, isGeneratingImage: true }));
    const img = await generateCardImageAI(state.tone);
    setState(prev => ({ ...prev, imageUrl: img, isGeneratingImage: false }));
  };

  const handleGenerateAudio = async () => {
    playChime();
    setState(prev => ({ ...prev, isGeneratingAudio: true }));
    const base64 = await generateSpeechAI(state.message);
    if (base64) {
      const audioData = atob(base64);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const dataInt16 = new Int16Array(arrayBuffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    }
    setState(prev => ({ ...prev, isGeneratingAudio: false }));
  };

  const handleDownload = async (format: 'png' | 'jpeg' = 'png') => {
    if (cardRef.current) {
      setState(prev => ({ ...prev, isExporting: true }));
      try {
        // html-to-image options to help avoid the 'Cannot access rules' error
        // skipFonts: false allows font embedding, but ensure crossorigin is set in index.html
        const options = { 
          pixelRatio: 2, // 3 can sometimes exceed memory limits on mobile
          backgroundColor: '#ffffff',
          cacheBust: true,
          style: {
            transform: 'scale(1)',
          },
          // Filter out problematic elements that might cause CSS rule access issues
          filter: (node: HTMLElement) => {
            if (node.tagName === 'SCRIPT' || node.classList?.contains('no-print')) {
              return false;
            }
            return true;
          }
        };

        const dataUrl = format === 'png' 
          ? await htmlToImage.toPng(cardRef.current, options)
          : await htmlToImage.toJpeg(cardRef.current, options);
          
        const link = document.createElement('a');
        link.download = `Santa-Poster-${state.recipient.trim().replace(/\s+/g, '-')}.${format}`;
        link.href = dataUrl;
        link.click();
      } catch (err: any) {
        console.error('Download error:', err);
        alert('Magic error! Could not export the poster. Please try again or take a screenshot.');
      } finally {
        setState(prev => ({ ...prev, isExporting: false }));
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`🎄 Merry Christmas from ${state.sender}!\n\n"${state.message}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `🎄 Merry Christmas! 🎅\n\n"${state.message}"\n\n- Love, ${state.sender}`;
    const url = window.location.href;
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=A Festive Christmas Card for You!&body=${encodeURIComponent(text)}`;
        break;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShareMenu(false);
  };

  const getFrameStyle = (): React.CSSProperties => {
    switch (state.frameStyle) {
      case 'Candy Cane':
        return {
          border: 'min(5vw, 20px) solid',
          borderImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 20px, #ffffff 20px, #ffffff 40px) 20',
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.3)'
        };
      case 'Winter Frost':
        return {
          border: 'min(4vw, 15px) solid #dbeafe',
          boxShadow: 'inset 0 0 60px rgba(96, 165, 250, 0.5), 0 0 30px rgba(96, 165, 250, 0.3)',
          background: 'linear-gradient(to bottom, rgba(219, 234, 254, 0.2), transparent)'
        };
      case 'Forest Pine':
        return {
          border: 'min(4vw, 14px) solid #064e3b',
          outline: 'min(1vw, 4px) solid #fbbf24',
          outlineOffset: '-min(3vw, 10px)',
          boxShadow: '0 0 40px rgba(6, 78, 59, 0.4)'
        };
      case 'Midnight Sleigh':
        return {
          border: 'min(4vw, 14px) solid #1e3a8a',
          outline: 'min(1vw, 3px) solid #e2e8f0',
          outlineOffset: '-min(2.5vw, 8px)',
          boxShadow: '0 0 40px rgba(30, 58, 138, 0.5)'
        };
      case 'Santa’s Workshop':
        return {
          border: 'min(5vw, 18px) solid #dc2626',
          borderImage: 'repeating-linear-gradient(90deg, #dc2626, #dc2626 20px, #166534 20px, #166534 40px, #ffffff 40px, #ffffff 60px) 1',
          boxShadow: '0 0 40px rgba(220, 38, 38, 0.4)'
        };
      case 'Classic':
      default:
        return {
          border: 'min(3vw, 12px) double #991b1b',
          outline: 'min(1vw, 4px) solid #fbbf24',
          outlineOffset: '-min(3vw, 10px)',
          boxShadow: '0 0 60px rgba(153, 27, 27, 0.3)'
        };
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-zinc-950 overflow-x-hidden">
      <SnowEffect />

      {/* Magical Background Glows */}
      <div className="fixed top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-[-1]" />

      {/* Header - More compact on mobile */}
      <header className="z-20 text-center py-8 md:py-12 px-4 space-y-4 animate-fade-in w-full max-w-4xl no-print">
        <div className="inline-flex items-center gap-2 md:gap-3 bg-red-600/20 border border-red-500/30 px-4 md:px-6 py-2 md:py-3 rounded-full mb-1 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
          <Star className="w-3 h-3 md:w-5 md:h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-red-500">North Pole Studio</span>
          <Star className="w-3 h-3 md:w-5 md:h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-8xl font-black tracking-tighter text-white leading-tight drop-shadow-2xl">
          SANTA’S <span className="text-red-600 italic">MAGIC</span> <span className="text-emerald-600">POSTER</span>
        </h1>
        <p className="text-zinc-500 font-bold tracking-[0.15em] text-[9px] md:text-sm uppercase opacity-90 max-w-md mx-auto">
          AI-Powered Vertical Holiday Art & Wishes
        </p>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="z-30 sticky top-0 w-full flex lg:hidden bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 no-print">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-500'}`}
        >
          <Settings2 className="w-4 h-4" /> Editor
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-zinc-500'}`}
        >
          <Eye className="w-4 h-4" /> Preview
        </button>
      </div>

      <main className="z-20 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start px-4 md:px-8 pb-32 lg:pb-12">
        {/* Creator Tools - Hidden based on tab on mobile */}
        <aside className={`lg:col-span-5 xl:col-span-4 order-2 lg:order-1 space-y-6 md:space-y-8 lg:sticky lg:top-8 no-print ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="glass rounded-[2rem] md:rounded-[4rem] p-6 md:p-10 shadow-2xl border border-white/10 relative overflow-hidden">
            <h2 className="text-xl md:text-3xl font-black mb-6 md:mb-10 flex items-center gap-3">
              <div className="p-3 bg-red-600/30 rounded-2xl">
                <Bell className="w-5 h-5 md:w-7 md:h-7 text-red-400 animate-ring" />
              </div>
              Magic Console
            </h2>

            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Recipient</label>
                  <input 
                    type="text"
                    value={state.recipient}
                    onChange={(e) => setState(p => ({ ...p, recipient: e.target.value }))}
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl px-6 md:px-8 py-4 md:py-5 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-red-600/30 transition-all text-white font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Your Name</label>
                  <input 
                    type="text"
                    value={state.sender}
                    onChange={(e) => setState(p => ({ ...p, sender: e.target.value }))}
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl px-6 md:px-8 py-4 md:py-5 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-emerald-600/30 transition-all text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Holiday Vibe</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setState(p => ({ ...p, tone: t }))}
                      className={`px-3 py-3 text-[9px] md:text-[11px] font-black rounded-xl md:rounded-2xl transition-all border-2 ${
                        state.tone === t 
                          ? 'bg-red-600 border-red-400 text-white shadow-lg' 
                          : 'bg-zinc-900/40 border-white/5 text-zinc-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Wax Seal</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                  {SEALS.map(s => (
                    <button
                      key={s}
                      onClick={() => setState(p => ({ ...p, sealType: s }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl md:rounded-2xl border-2 transition-all ${
                        state.sealType === s 
                          ? 'bg-zinc-100 border-zinc-200 text-red-600 shadow-md' 
                          : 'bg-zinc-900/40 border-white/5 text-zinc-600'
                      }`}
                    >
                      <div className="h-6 md:h-8 flex items-center justify-center">
                        {s === 'None' ? <X className="w-4 h-4" /> : SEAL_ICONS[s]}
                      </div>
                      <span className="text-[8px] md:text-[9px] font-black uppercase mt-1">{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleGenerateWish}
                  disabled={state.isGeneratingText}
                  className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 md:py-6 rounded-2xl md:rounded-[2rem] hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
                >
                  {state.isGeneratingText ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-5 h-5 text-red-600" />}
                  Generate AI Wish
                </button>
                <button
                  onClick={handleGenerateImage}
                  disabled={state.isGeneratingImage}
                  className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white font-black py-4 md:py-6 rounded-2xl md:rounded-[2rem] hover:bg-zinc-800 transition-all border border-white/10 disabled:opacity-50"
                >
                  {state.isGeneratingImage ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ImageIcon className="w-5 h-5 text-emerald-500" />}
                  Generate AI Art
                </button>
              </div>
            </div>
          </div>

          {/* Desktop/Sticky Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={handleGenerateAudio} disabled={state.isGeneratingAudio} className="glass-button rounded-2xl py-4 flex flex-col items-center justify-center gap-1 font-black text-[9px] uppercase tracking-widest transition-all">
              {state.isGeneratingAudio ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Volume2 className="w-5 h-5 text-yellow-500" />}
              AI Voice
            </button>
            <button onClick={handlePrint} className="glass-button rounded-2xl py-4 flex flex-col items-center justify-center gap-1 font-black text-[9px] uppercase tracking-widest">
              <Printer className="w-5 h-5 text-blue-400" />
              Print
            </button>
            <button onClick={() => handleDownload('png')} className="glass-button rounded-2xl py-4 flex flex-col items-center justify-center gap-1 font-black text-[9px] uppercase tracking-widest">
              <Download className="w-5 h-5 text-emerald-400" />
              PNG HD
            </button>
            <button onClick={() => setShowShareMenu(true)} className="glass-button rounded-2xl py-4 flex flex-col items-center justify-center gap-1 font-black text-[9px] uppercase tracking-widest bg-emerald-600/10 border-emerald-500/20">
              <Share2 className="w-5 h-5 text-emerald-500" />
              Share
            </button>
          </div>
        </aside>

        {/* Card Preview - Sticky on desktop, Tab-dependent on mobile */}
        <div className={`lg:col-span-7 xl:col-span-8 order-1 lg:order-2 flex flex-col items-center w-full ${activeTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div 
            id="card-export-target"
            ref={cardRef}
            className={`card-shadow w-full max-w-[480px] aspect-[9/16] bg-[#fffaf5] text-zinc-900 rounded-[1.5rem] md:rounded-[3rem] relative flex flex-col overflow-hidden border border-white/20 transition-all duration-700 ${state.isExporting ? 'shadow-none' : ''}`}
          >
            {/* Fine Paper Texture */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-30 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            
            {/* Dynamic Poster Frame Layer */}
            <div className="absolute inset-0 pointer-events-none z-10 rounded-[1.5rem] md:rounded-[3rem] transition-all duration-1000 ease-in-out" style={getFrameStyle()} />

            {/* Poster Content */}
            <div className="relative z-20 h-full flex flex-col p-8 sm:p-12 md:p-16 overflow-hidden">
              
              {/* Header */}
              <div className="flex justify-center mb-6 md:mb-10 relative">
                 <div className="text-center relative pt-2 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-2 md:gap-4 mb-2 md:mb-4">
                       <span className="text-3xl md:text-5xl drop-shadow-lg">🎅</span>
                       <div className="w-8 md:w-12 h-[1px] md:h-[2px] bg-red-600/20" />
                    </div>
                    <h3 className="font-['Mountains_of_Christmas'] text-4xl sm:text-5xl md:text-7xl font-black text-red-700 tracking-tighter leading-tight">
                      Merry<br/>Christmas
                    </h3>
                 </div>
              </div>

              {/* AI Art Section */}
              <div className="flex-[2] relative mb-6 md:mb-12 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-white shadow-xl border border-zinc-200/50 group">
                <img 
                  src={state.imageUrl} 
                  alt="Festive Scene" 
                  className="w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-110"
                />
                
                {state.isGeneratingImage && (
                  <div className="absolute inset-0 bg-[#fffaf5]/90 backdrop-blur-2xl flex flex-col items-center justify-center text-zinc-900 p-4 text-center">
                    <div className="w-12 h-12 md:w-20 md:h-20 border-4 md:border-8 border-red-600 border-t-emerald-600 rounded-full animate-spin mb-4" />
                    <span className="font-black tracking-[0.3em] text-[10px] md:text-xs uppercase opacity-60">Mixing Elven Magic...</span>
                  </div>
                )}
                
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.1)] pointer-events-none" />
              </div>

              {/* Message Typography Area */}
              <div className="flex-1 space-y-6 md:space-y-10 text-center flex flex-col items-center justify-center relative">
                <div className="space-y-3 md:space-y-6 w-full">
                  <p className="font-['Playfair_Display'] italic text-xl md:text-3xl text-zinc-400">
                    To {state.recipient},
                  </p>
                  
                  <div className="min-h-[100px] md:min-h-[160px] flex items-center justify-center relative px-2">
                    {state.isGeneratingText && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-10 rounded-2xl">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" />
                          <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                        </div>
                      </div>
                    )}
                    <p className="font-['Playfair_Display'] text-xl sm:text-2xl md:text-4xl leading-relaxed text-zinc-800 font-bold italic">
                      "{state.message}"
                    </p>
                  </div>
                </div>

                {/* Signature */}
                <div className="pt-6 md:pt-12 border-t border-zinc-100 w-full relative group flex flex-col items-center">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fffaf5] px-4 md:px-8">
                     <Star className="w-4 h-4 md:w-6 md:h-6 text-yellow-500 fill-yellow-500 animate-pulse" />
                  </div>
                  
                  <div className="relative">
                    <p className="font-['Rochester'] text-4xl md:text-6xl text-red-600 drop-shadow-sm">
                      {state.sender}
                    </p>
                    {state.sealType !== 'None' && (
                      <div className="absolute -right-8 md:-right-12 -top-2 md:-top-4 w-8 h-8 md:w-12 md:h-12 bg-red-700 rounded-full border-2 md:border-4 border-red-800 flex items-center justify-center shadow-lg transform rotate-12">
                        {SEAL_ICONS[state.sealType]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-12 mb-8 flex flex-col items-center gap-4 opacity-30 text-center no-print px-4">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                Created with Santa’s Magic Studio 2024
             </p>
          </footer>
        </div>
      </main>

      {/* Improved Mobile Share Menu (Bottom Sheet Style) */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 sm:pb-12 bg-black/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                <Share2 className="w-5 h-5 text-emerald-400" /> Share Card
              </h3>
              <button onClick={() => setShowShareMenu(false)} className="p-2 bg-white/5 rounded-full text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { id: 'whatsapp', icon: <Share2 className="w-6 h-6" />, label: 'WA', color: 'bg-emerald-600' },
                { id: 'twitter', icon: <Twitter className="w-6 h-6" />, label: 'Tweet', color: 'bg-sky-500' },
                { id: 'facebook', icon: <Facebook className="w-6 h-6" />, label: 'FB', color: 'bg-blue-700' },
                { id: 'email', icon: <Mail className="w-6 h-6" />, label: 'Mail', color: 'bg-red-600' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleShare(item.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform active:scale-90`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">{item.label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Sleigh' : 'Copy Message Text'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button (Mobile) - Better positioned for accessibility */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden no-print">
        <button 
          onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
          className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(220,38,38,0.5)] border-2 border-white/20 active:scale-90 transition-all group"
        >
          {activeTab === 'editor' ? <Eye className="w-7 h-7" /> : <Settings2 className="w-7 h-7" />}
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-in-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
