
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
  Layout
} from 'lucide-react';
import * as htmlToImage from 'https://esm.sh/html-to-image@1.11.11';
import { CardState, CardTone, CardFrameStyle } from './types';
import { generateWishAI, generateCardImageAI } from './services/gemini';
import SnowEffect from './components/SnowEffect';

const TONES: CardTone[] = ['Heartfelt', 'Funny', 'Professional', 'Poetic', 'Short & Sweet'];
const FRAMES: CardFrameStyle[] = ['Classic', 'Candy Cane', 'Winter Frost', 'Minimalist'];

const App: React.FC = () => {
  const [state, setState] = useState<CardState>({
    recipient: 'Dear Family',
    sender: 'The Smiths',
    tone: 'Heartfelt',
    frameStyle: 'Classic',
    message: 'May the peace and joy of Christmas be with you today and throughout the coming year. Sending you all our love and warmest holiday wishes!',
    imageUrl: 'https://images.unsplash.com/photo-1543589077-47d816067ce1?q=80&w=1000&auto=format&fit=crop',
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
          pixelRatio: 3,
          backgroundColor: '#ffffff'
        });
        const link = document.createElement('a');
        link.download = `Christmas-Card-to-${state.recipient}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error downloading card', err);
      }
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`🎄 Merry Christmas! 🎅\n\n"${state.message}"\n\n- From ${state.sender}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const getFrameStyle = (): React.CSSProperties => {
    switch (state.frameStyle) {
      case 'Candy Cane':
        return {
          border: '14px solid',
          borderImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 15px, #ffffff 15px, #ffffff 30px) 20',
        };
      case 'Winter Frost':
        return {
          border: '8px solid #bfdbfe',
          boxShadow: 'inset 0 0 30px #60a5fa, 0 0 20px rgba(96, 165, 250, 0.4)',
        };
      case 'Classic':
        return {
          border: '12px double #dc2626',
        };
      default:
        return {
          border: '1px solid #f3f4f6',
        };
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start py-6 px-4 md:py-12 overflow-x-hidden">
      <SnowEffect />

      {/* Header Branding */}
      <header className="z-20 text-center mb-12 space-y-3 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-4 py-1.5 rounded-full mb-2">
          <Snowflake className="w-4 h-4 text-red-500 animate-spin-slow" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Holiday Special</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-tight drop-shadow-[0_0_25px_rgba(220,38,38,0.3)]">
          CHRISTMAS <span className="text-red-600 italic">CARD</span> <span className="text-zinc-500">CREATOR</span>
        </h1>
        <p className="text-zinc-500 font-medium tracking-widest text-[10px] md:text-xs uppercase opacity-80 max-w-lg mx-auto leading-relaxed">
          AI-Crafted Memories for the ones you love
        </p>
      </header>

      <main className="z-20 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Creator Tools Sidebar */}
        <aside className="lg:col-span-4 order-2 lg:order-1 space-y-6 lg:sticky lg:top-8">
          <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Layout className="w-24 h-24 rotate-12" />
            </div>

            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              Studio Controls
            </h2>

            <div className="space-y-6">
              {/* Identity Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> To Whom?
                  </label>
                  <input 
                    type="text"
                    value={state.recipient}
                    onChange={(e) => setState(p => ({ ...p, recipient: e.target.value }))}
                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/40 transition-all placeholder:text-zinc-700"
                    placeholder="e.g. Grandma & Grandpa"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                    <Send className="w-3 h-3" /> From Who?
                  </label>
                  <input 
                    type="text"
                    value={state.sender}
                    onChange={(e) => setState(p => ({ ...p, sender: e.target.value }))}
                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/40 transition-all placeholder:text-zinc-700"
                    placeholder="e.g. Your Name"
                  />
                </div>
              </div>

              {/* Style Section */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                  <Music className="w-3 h-3" /> Creative Tone
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setState(p => ({ ...p, tone: t }))}
                      className={`px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all border ${
                        state.tone === t 
                          ? 'bg-red-600 border-red-500 text-white shadow-[0_10px_20px_-5px_rgba(220,38,38,0.4)]' 
                          : 'bg-zinc-800/30 border-white/5 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                  <Frame className="w-3 h-3" /> Frame Aesthetics
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                  {FRAMES.map(f => (
                    <button
                      key={f}
                      onClick={() => setState(p => ({ ...p, frameStyle: f }))}
                      className={`px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all border ${
                        state.frameStyle === f 
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)]' 
                          : 'bg-zinc-800/30 border-white/5 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main AI Generation Buttons */}
            <div className="mt-10 space-y-3">
              <button
                onClick={handleGenerateWish}
                disabled={state.isGeneratingText}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-100 transition-all active:scale-[0.98] disabled:opacity-50 group shadow-xl"
              >
                {state.isGeneratingText ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                )}
                Magic AI Message
              </button>
              
              <button
                onClick={handleGenerateImage}
                disabled={state.isGeneratingImage}
                className="w-full flex items-center justify-center gap-3 bg-zinc-800 text-white font-black py-4 rounded-2xl hover:bg-zinc-700 transition-all active:scale-[0.98] border border-white/10 disabled:opacity-50"
              >
                {state.isGeneratingImage ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
                Festive AI Art
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={handleDownload}
              className="col-span-3 glass-button rounded-2xl py-4 flex items-center justify-center gap-3 font-bold group"
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              Download High-Res
            </button>
            <button 
              onClick={handleShareWhatsApp}
              className="col-span-1 glass-button rounded-2xl py-4 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-600 transition-all"
              title="Share on WhatsApp"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* Card Preview Stage */}
        <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center">
          <div 
            id="card-export-target"
            ref={cardRef}
            className="card-shadow w-full max-w-[500px] aspect-[4/5] bg-white text-zinc-900 rounded-3xl relative flex flex-col overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"
          >
            {/* Dynamic Frame Layer */}
            <div 
              className="absolute inset-0 pointer-events-none z-10 rounded-3xl transition-all duration-500"
              style={getFrameStyle()}
            />

            {/* Interior Content Container */}
            <div className="relative z-20 h-full flex flex-col p-8 md:p-12 overflow-hidden">
              {/* Card Header Illustration */}
              <div className="text-center mb-8 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 opacity-10 pointer-events-none">
                  <Snowflake className="w-20 h-20" />
                </div>
                <span className="text-4xl md:text-5xl inline-block animate-bounce mb-3 drop-shadow-md">🎄</span>
                <h3 className="font-['Mountains_of_Christmas'] text-4xl md:text-5xl font-bold text-red-600 tracking-wide drop-shadow-sm">
                  Merry Christmas
                </h3>
              </div>

              {/* Main AI Art Container */}
              <div className="flex-1 relative mb-8 rounded-[2rem] overflow-hidden bg-zinc-50 shadow-[inset_0_4px_15px_rgba(0,0,0,0.05)] border border-zinc-100 group">
                <img 
                  src={state.imageUrl} 
                  alt="Festive Scene" 
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                />
                
                {state.isGeneratingImage && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center text-zinc-800">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                      <Sparkles className="absolute top-0 right-0 w-4 h-4 text-emerald-500 animate-pulse" />
                    </div>
                    <span className="font-black tracking-widest text-[10px] uppercase opacity-60">Painting Magic...</span>
                  </div>
                )}
                
                {/* Image Overlay Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.08)] pointer-events-none" />
              </div>

              {/* Text Body */}
              <div className="space-y-6 text-center">
                <h4 className="font-['Playfair_Display'] italic text-xl text-zinc-400">
                  To {state.recipient},
                </h4>
                
                <div className="min-h-[120px] flex items-center justify-center px-4 relative">
                  {state.isGeneratingText && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-10 transition-all rounded-xl">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                        <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                      </div>
                    </div>
                  )}
                  <p className="font-['Playfair_Display'] text-xl md:text-2xl leading-[1.6] text-zinc-800 font-medium max-w-sm">
                    {state.message}
                  </p>
                </div>

                <div className="pt-6 border-t border-zinc-100 mt-4">
                  <p className="font-['Rochester'] text-4xl text-red-600 drop-shadow-sm">
                    {state.sender}
                  </p>
                </div>
              </div>

              {/* Decor Accents */}
              <Snowflake className="absolute top-6 left-6 w-8 h-8 text-zinc-100 opacity-60 rotate-[25deg]" />
              <Snowflake className="absolute bottom-6 right-6 w-10 h-10 text-zinc-100 opacity-60 -rotate-[15deg]" />
            </div>
          </div>

          {/* Institutional Footer Credits */}
          <footer className="mt-16 flex flex-col items-center gap-6 opacity-30 group hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              <span>Premium AI Generation</span>
              <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span>Studio Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-600 font-bold">POWERED BY</span>
              <div className="h-4 w-[1px] bg-zinc-800" />
              <span className="text-[11px] text-zinc-400 font-black tracking-tighter">GEMINI AI</span>
            </div>
          </footer>
        </div>
      </main>

      {/* Floating Action Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(220,38,38,0.5)] active:scale-90 transition-transform"
        >
          <ChevronDown className="w-6 h-6 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default App;
