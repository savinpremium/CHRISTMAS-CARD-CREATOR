
import React, { useState, useRef } from 'react';
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
  Heart
} from 'lucide-react';
import * as htmlToImage from 'https://esm.sh/html-to-image@1.11.11';
import { CardState, CardTone, CardFrameStyle } from './types';
import { generateWishAI, generateCardImageAI } from './services/gemini';
import SnowEffect from './components/SnowEffect';

const TONES: CardTone[] = ['Heartfelt', 'Funny', 'Professional', 'Poetic', 'Short & Sweet'];
const FRAMES: CardFrameStyle[] = ['Classic', 'Candy Cane', 'Winter Frost', 'Forest Pine', 'Midnight Sleigh', 'Santa’s Workshop'];

const App: React.FC = () => {
  const [state, setState] = useState<CardState>({
    recipient: 'Dear Family',
    sender: 'Santa’s Little Helper',
    tone: 'Heartfelt',
    frameStyle: 'Classic',
    message: 'May your home be filled with the magic of Santa’s visit and your heart with the warmth of love. Wishing you a Christmas that sparkles with joy and wonder!',
    imageUrl: 'https://images.unsplash.com/photo-1512433990356-47065c86f7e3?q=80&w=1000&auto=format&fit=crop',
    isGeneratingText: false,
    isGeneratingImage: false,
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerateWish = async () => {
    setState(prev => ({ ...prev, isGeneratingText: true }));
    const wish = await generateWishAI(state.recipient, state.sender, state.tone);
    setState(prev => ({ ...prev, message: wish, isGeneratingText: false }));
  };

  const handleGenerateImage = async () => {
    setState(prev => ({ ...prev, isGeneratingImage: true }));
    const img = await generateCardImageAI(state.tone);
    setState(prev => ({ ...prev, imageUrl: img, isGeneratingImage: false }));
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(cardRef.current, { 
          pixelRatio: 4,
          backgroundColor: '#ffffff'
        });
        const link = document.createElement('a');
        link.download = `Santa-Card-${state.recipient}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error downloading card', err);
      }
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`🎅 Ho Ho Ho! Merry Christmas! 🎄\n\n"${state.message}"\n\n- Love, ${state.sender}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const getFrameStyle = (): React.CSSProperties => {
    switch (state.frameStyle) {
      case 'Candy Cane':
        return {
          border: '20px solid',
          borderImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 20px, #ffffff 20px, #ffffff 40px) 20',
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.3)'
        };
      case 'Winter Frost':
        return {
          border: '15px solid #dbeafe',
          boxShadow: 'inset 0 0 60px rgba(96, 165, 250, 0.5), 0 0 30px rgba(96, 165, 250, 0.3)',
          background: 'linear-gradient(to bottom, rgba(219, 234, 254, 0.2), transparent)'
        };
      case 'Forest Pine':
        return {
          border: '14px solid #064e3b',
          outline: '4px solid #fbbf24',
          outlineOffset: '-10px',
          boxShadow: '0 0 40px rgba(6, 78, 59, 0.4)'
        };
      case 'Midnight Sleigh':
        return {
          border: '14px solid #1e3a8a',
          outline: '3px solid #e2e8f0',
          outlineOffset: '-8px',
          boxShadow: '0 0 40px rgba(30, 58, 138, 0.5)'
        };
      case 'Santa’s Workshop':
        return {
          border: '18px solid #dc2626',
          borderImage: 'repeating-linear-gradient(90deg, #dc2626, #dc2626 20px, #166534 20px, #166534 40px, #ffffff 40px, #ffffff 60px) 1',
          boxShadow: '0 0 40px rgba(220, 38, 38, 0.4)'
        };
      case 'Classic':
      default:
        return {
          border: '12px double #991b1b',
          outline: '4px solid #fbbf24',
          outlineOffset: '-10px',
          boxShadow: '0 0 60px rgba(153, 27, 27, 0.3)'
        };
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start py-6 px-4 md:py-12 overflow-x-hidden pb-32">
      <SnowEffect />

      {/* Magical Background Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      <header className="z-20 text-center mb-10 space-y-6 animate-fade-in w-full max-w-4xl">
        <div className="inline-flex items-center gap-3 bg-red-600/20 border border-red-500/30 px-6 py-3 rounded-full mb-2 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.4em] text-red-500">North Pole Studio</span>
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          SANTA’S <span className="text-red-600 italic">MAGIC</span> <span className="text-emerald-600">POSTER</span>
        </h1>
        <p className="text-zinc-400 font-bold tracking-[0.2em] text-[10px] md:text-sm uppercase opacity-90 max-w-lg mx-auto">
          AI-Powered Sleigh Status & Festive Greetings
        </p>
      </header>

      <main className="z-20 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start px-4">
        {/* Creator Tools Sidebar */}
        <aside className="lg:col-span-4 order-2 lg:order-1 space-y-8 lg:sticky lg:top-8">
          <div className="glass rounded-[4rem] p-10 shadow-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-[0.05] group-hover:opacity-10 transition-opacity">
               <Gift className="w-48 h-48 rotate-12" />
            </div>
            
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
              <div className="p-4 bg-red-600/30 rounded-[1.5rem] shadow-lg shadow-red-900/40">
                <Bell className="w-7 h-7 text-red-400 animate-ring" />
              </div>
              Magic Console
            </h2>

            <div className="space-y-8">
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Whom to Bless?</label>
                  <input 
                    type="text"
                    value={state.recipient}
                    onChange={(e) => setState(p => ({ ...p, recipient: e.target.value }))}
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-3xl px-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-red-600/30 transition-all text-white placeholder:text-zinc-700 font-bold"
                    placeholder="Grandma & Grandpa"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Santa’s Secret Signature</label>
                  <input 
                    type="text"
                    value={state.sender}
                    onChange={(e) => setState(p => ({ ...p, sender: e.target.value }))}
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-3xl px-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-600/30 transition-all text-white placeholder:text-zinc-700 font-bold"
                    placeholder="Santa’s Helper"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Holiday Vibe</label>
                <div className="grid grid-cols-2 gap-3">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setState(p => ({ ...p, tone: t }))}
                      className={`px-6 py-4 text-[11px] font-black rounded-2xl transition-all border-2 ${
                        state.tone === t 
                          ? 'bg-red-600 border-red-400 text-white shadow-xl shadow-red-900/60 scale-105' 
                          : 'bg-zinc-900/40 border-white/10 text-zinc-500 hover:border-zinc-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Workshop Framing</label>
                <div className="grid grid-cols-2 gap-3">
                  {FRAMES.map(f => (
                    <button
                      key={f}
                      onClick={() => setState(p => ({ ...p, frameStyle: f }))}
                      className={`px-6 py-4 text-[11px] font-black rounded-2xl transition-all border-2 ${
                        state.frameStyle === f 
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-900/60 scale-105' 
                          : 'bg-zinc-900/40 border-white/10 text-zinc-500 hover:border-zinc-500'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <button
                  onClick={handleGenerateWish}
                  disabled={state.isGeneratingText}
                  className="w-full flex items-center justify-center gap-4 bg-white text-black font-black py-6 rounded-[2rem] hover:bg-zinc-100 transition-all active:scale-[0.95] disabled:opacity-50 shadow-2xl group overflow-hidden"
                >
                  {state.isGeneratingText ? <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-6 h-6 text-red-600 group-hover:rotate-45 transition-transform" />}
                  Summon Sleigh Wishes
                </button>
                <button
                  onClick={handleGenerateImage}
                  disabled={state.isGeneratingImage}
                  className="w-full flex items-center justify-center gap-4 bg-zinc-900 text-white font-black py-6 rounded-[2rem] hover:bg-zinc-800 transition-all border border-white/10 disabled:opacity-50 group"
                >
                  {state.isGeneratingImage ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <ImageIcon className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />}
                  Create North Pole Art
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <button onClick={handleDownload} className="col-span-3 glass-button rounded-[2rem] py-6 flex items-center justify-center gap-4 font-black text-sm uppercase tracking-widest text-white">
              <Download className="w-6 h-6" /> Export Poster
            </button>
            <button onClick={handleShareWhatsApp} className="col-span-1 glass-button rounded-[2rem] py-6 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-xl">
              <Share2 className="w-7 h-7" />
            </button>
          </div>
        </aside>

        {/* Card Preview Stage - 9:16 Vertical Poster */}
        <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center">
          <div 
            id="card-export-target"
            ref={cardRef}
            className="card-shadow w-full max-w-[500px] aspect-[9/16] bg-[#fffaf5] text-zinc-900 rounded-[3rem] relative flex flex-col overflow-hidden border border-white/20"
          >
            {/* Fine Paper Texture */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-30 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            
            {/* Dynamic Poster Frame Layer */}
            <div className="absolute inset-0 pointer-events-none z-10 rounded-[3rem] transition-all duration-1000 ease-in-out" style={getFrameStyle()} />

            {/* Poster Content */}
            <div className="relative z-20 h-full flex flex-col p-12 md:p-16 overflow-hidden">
              
              {/* Header: Sleigh & Santa Elements */}
              <div className="flex justify-center mb-10 relative">
                 <div className="absolute -top-12 flex gap-10 opacity-10 blur-[1px]">
                    <Star className="w-20 h-20 twinkle" style={{animationDelay: '0s'}} />
                    <Snowflake className="w-24 h-24" />
                    <Star className="w-20 h-20 twinkle" style={{animationDelay: '1s'}} />
                 </div>
                 <div className="text-center relative pt-4 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                       <div className="w-12 h-[2px] bg-red-600/20" />
                       <div className="relative group">
                          <span className="text-6xl group-hover:scale-125 transition-transform inline-block drop-shadow-xl">🎅</span>
                          <div className="absolute -top-2 -right-2 twinkle">
                             <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                          </div>
                       </div>
                       <div className="w-12 h-[2px] bg-red-600/20" />
                    </div>
                    <h3 className="font-['Mountains_of_Christmas'] text-6xl md:text-7xl font-black text-red-700 tracking-tighter leading-[0.85] drop-shadow-sm">
                      Merry<br/>Christmas
                    </h3>
                 </div>
              </div>

              {/* Main AI Art Section - Taller for vertical poster impact */}
              <div className="flex-[2] relative mb-12 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border border-zinc-200/50 group">
                <img 
                  src={state.imageUrl} 
                  alt="Festive Scene" 
                  className="w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-110"
                />
                
                {state.isGeneratingImage && (
                  <div className="absolute inset-0 bg-[#fffaf5]/90 backdrop-blur-2xl flex flex-col items-center justify-center text-zinc-900">
                    <div className="relative mb-8">
                       <div className="w-24 h-24 border-8 border-red-600 border-t-emerald-600 rounded-full animate-spin" />
                       <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-yellow-500 animate-pulse" />
                    </div>
                    <span className="font-black tracking-[0.5em] text-[12px] uppercase opacity-60">Mixing Elven Magic...</span>
                  </div>
                )}
                
                {/* Soft Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.15)] pointer-events-none" />
                
                {/* Bottom Decorative Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
              </div>

              {/* Message Typography Area */}
              <div className="flex-1 space-y-10 text-center flex flex-col items-center justify-center relative">
                <div className="space-y-6 w-full">
                  <p className="font-['Playfair_Display'] italic text-3xl text-zinc-400">
                    To {state.recipient},
                  </p>
                  
                  <div className="min-h-[160px] flex items-center justify-center relative px-6">
                    {state.isGeneratingText && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-10 rounded-[2rem] shadow-xl">
                        <div className="flex gap-4">
                          <div className="w-4 h-4 bg-red-600 rounded-full animate-bounce shadow-lg shadow-red-500/50" style={{animationDelay: '0s'}} />
                          <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce shadow-lg shadow-yellow-500/50" style={{animationDelay: '0.2s'}} />
                          <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce shadow-lg shadow-emerald-500/50" style={{animationDelay: '0.4s'}} />
                        </div>
                      </div>
                    )}
                    <p className="font-['Playfair_Display'] text-3xl md:text-4xl leading-[1.4] text-zinc-800 font-bold italic tracking-tight drop-shadow-sm">
                      "{state.message}"
                    </p>
                  </div>
                </div>

                {/* Final Master Signature */}
                <div className="pt-12 border-t border-zinc-100 w-full relative group">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#fffaf5] px-8 py-2">
                     <div className="flex gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" />
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" style={{animationDelay: '0.5s'}} />
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" style={{animationDelay: '1s'}} />
                     </div>
                  </div>
                  <p className="font-['Rochester'] text-6xl text-red-600 drop-shadow-md group-hover:scale-105 transition-transform duration-500">
                    {state.sender}
                  </p>
                  <div className="flex justify-center gap-2 mt-4 opacity-10">
                    <Heart className="w-4 h-4 fill-red-600" />
                    <Heart className="w-4 h-4 fill-red-600" />
                    <Heart className="w-4 h-4 fill-red-600" />
                  </div>
                </div>
              </div>

              {/* Decorative Poster Elements */}
              <div className="absolute top-20 right-8 opacity-5 -rotate-12">
                 <Bell className="w-32 h-32" />
              </div>
              <div className="absolute bottom-40 left-8 opacity-5 rotate-12">
                 <Trees className="w-32 h-32" />
              </div>
            </div>
          </div>

          <footer className="mt-16 flex flex-col items-center gap-8 opacity-30 hover:opacity-100 transition-all duration-700 cursor-default">
             <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
             <div className="flex flex-col items-center gap-5 text-[11px] font-black uppercase tracking-[0.6em] text-zinc-500 text-center">
                <span className="flex items-center gap-2">
                   <Zap className="w-4 h-4 text-yellow-500" /> 
                   Magic Artisan Poster Studio
                   <Zap className="w-4 h-4 text-yellow-500" />
                </span>
                <div className="flex items-center gap-5">
                   <div className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_15px_red]" />
                   <span className="text-zinc-600">Ultra High-Definition Output</span>
                   <div className="w-2 h-2 bg-emerald-600 rounded-full shadow-[0_0_15px_emerald]" />
                </div>
             </div>
          </footer>
        </div>
      </main>

      {/* Floating Control Button (Mobile) */}
      <div className="fixed bottom-10 right-10 z-50 lg:hidden">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-900/60 border-4 border-white/20 active:scale-90 transition-all"
        >
          <ChevronDown className="w-10 h-10 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default App;
