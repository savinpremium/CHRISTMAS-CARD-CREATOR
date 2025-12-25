
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
  Gift
} from 'lucide-react';
import * as htmlToImage from 'https://esm.sh/html-to-image@1.11.11';
import { CardState, CardTone, CardFrameStyle } from './types';
import { generateWishAI, generateCardImageAI } from './services/gemini';
import SnowEffect from './components/SnowEffect';

const TONES: CardTone[] = ['Heartfelt', 'Funny', 'Professional', 'Poetic', 'Short & Sweet'];
const FRAMES: CardFrameStyle[] = ['Classic', 'Candy Cane', 'Winter Frost', 'Minimalist'];

const App: React.FC = () => {
  const [state, setState] = useState<CardState>({
    recipient: 'Dear Mom & Dad',
    sender: 'Your Loving Daughter',
    tone: 'Heartfelt',
    frameStyle: 'Classic',
    message: 'May the magic and the wonder of the holiday season stay with you throughout the coming year. You are the heart of our family, and I wish you a Christmas filled with endless joy and peace.',
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
          pixelRatio: 4,
          backgroundColor: '#ffffff'
        });
        const link = document.createElement('a');
        link.download = `Xmas-Poster-${state.recipient}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error downloading card', err);
      }
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`🎄 Merry Christmas! 🎅\n\n"${state.message}"\n\n- Love, ${state.sender}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const getFrameStyle = (): React.CSSProperties => {
    switch (state.frameStyle) {
      case 'Candy Cane':
        return {
          border: '20px solid',
          borderImage: 'repeating-linear-gradient(45deg, #dc2626 0, #dc2626 20px, #ffffff 20px, #ffffff 40px) 20',
          boxShadow: '0 0 40px rgba(220, 38, 38, 0.2)'
        };
      case 'Winter Frost':
        return {
          border: '14px solid #e0f2fe',
          boxShadow: 'inset 0 0 60px rgba(125, 211, 252, 0.4), 0 0 30px rgba(186, 230, 253, 0.3)',
          background: 'linear-gradient(rgba(224, 242, 254, 0.1), rgba(255, 255, 255, 0))'
        };
      case 'Classic':
        return {
          border: '12px double #991b1b',
          outline: '3px solid #fbbf24',
          outlineOffset: '-8px',
          boxShadow: '0 0 0 4px #991b1b'
        };
      default:
        return {
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
        };
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start py-6 px-4 md:py-10 overflow-x-hidden pb-24">
      <SnowEffect />

      {/* Header Branding */}
      <header className="z-20 text-center mb-8 space-y-4 animate-fade-in w-full">
        <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-4 py-2 rounded-full mb-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Poster Edition</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-tight drop-shadow-2xl">
          CHRISTMAS <span className="text-red-600 italic">POSTER</span> <span className="text-zinc-600">STUDIO</span>
        </h1>
        <p className="text-zinc-500 font-medium tracking-widest text-[10px] md:text-xs uppercase opacity-80 max-w-lg mx-auto leading-relaxed">
          Create Vertical Posters Optimized for WhatsApp Status
        </p>
      </header>

      <main className="z-20 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Creator Tools Sidebar */}
        <aside className="lg:col-span-4 order-2 lg:order-1 space-y-6 lg:sticky lg:top-8">
          <div className="glass rounded-[3rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <div className="p-3 bg-red-600/20 rounded-2xl">
                <Sparkles className="w-6 h-6 text-red-500" />
              </div>
              Studio Editor
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Recipient Name</label>
                  <input 
                    type="text"
                    value={state.recipient}
                    onChange={(e) => setState(p => ({ ...p, recipient: e.target.value }))}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/40 transition-all text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Your Name</label>
                  <input 
                    type="text"
                    value={state.sender}
                    onChange={(e) => setState(p => ({ ...p, sender: e.target.value }))}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/40 transition-all text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Poster Mood</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setState(p => ({ ...p, tone: t }))}
                      className={`px-4 py-3 text-[11px] font-bold rounded-xl transition-all border ${
                        state.tone === t 
                          ? 'bg-red-600 border-red-400 text-white' 
                          : 'bg-zinc-900/40 border-white/5 text-zinc-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Border Collection</label>
                <div className="grid grid-cols-2 gap-2">
                  {FRAMES.map(f => (
                    <button
                      key={f}
                      onClick={() => setState(p => ({ ...p, frameStyle: f }))}
                      className={`px-4 py-3 text-[11px] font-bold rounded-xl transition-all border ${
                        state.frameStyle === f 
                          ? 'bg-white text-black' 
                          : 'bg-zinc-900/40 border-white/5 text-zinc-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleGenerateWish}
                  disabled={state.isGeneratingText}
                  className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {state.isGeneratingText ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-5 h-5 text-red-600" />}
                  Generate AI Poem
                </button>
                <button
                  onClick={handleGenerateImage}
                  disabled={state.isGeneratingImage}
                  className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white font-black py-4 rounded-2xl hover:bg-zinc-800 transition-all border border-white/10 disabled:opacity-50"
                >
                  {state.isGeneratingImage ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ImageIcon className="w-5 h-5 text-emerald-500" />}
                  Generate Festive Art
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button onClick={handleDownload} className="col-span-3 glass-button rounded-2xl py-5 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest">
              <Download className="w-5 h-5" /> Download HD Poster
            </button>
            <button onClick={handleShareWhatsApp} className="col-span-1 glass-button rounded-2xl py-5 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* Card Preview Stage - 9:16 Vertical Poster */}
        <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center">
          <div 
            id="card-export-target"
            ref={cardRef}
            className="card-shadow w-full max-w-[450px] aspect-[9/16] bg-[#fffdfa] text-zinc-900 rounded-[2.5rem] relative flex flex-col overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10"
          >
            {/* Fine Paper Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-30 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            
            {/* Poster Border Layer */}
            <div className="absolute inset-0 pointer-events-none z-10 rounded-[2.5rem] transition-all duration-700" style={getFrameStyle()} />

            {/* Poster Content */}
            <div className="relative z-20 h-full flex flex-col p-12 md:p-14 overflow-hidden">
              
              {/* Header: Vertical poster often has hanging elements */}
              <div className="flex justify-center mb-6 relative">
                 <div className="absolute top-0 flex gap-4 -translate-y-8 opacity-20">
                    <Snowflake className="w-12 h-12" />
                    <Snowflake className="w-16 h-16" />
                    <Snowflake className="w-12 h-12" />
                 </div>
                 <div className="text-center relative pt-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                       <Gift className="w-5 h-5 text-red-600" />
                       <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                       <Gift className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="font-['Mountains_of_Christmas'] text-5xl md:text-6xl font-black text-red-700 tracking-tight leading-none">
                      Merry<br/>Christmas
                    </h3>
                 </div>
              </div>

              {/* Poster Image Section - Taller for vertical look */}
              <div className="flex-[1.5] relative mb-10 rounded-[2rem] overflow-hidden bg-white shadow-xl border border-zinc-100/50 group">
                <img 
                  src={state.imageUrl} 
                  alt="Festive Art" 
                  className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                />
                
                {state.isGeneratingImage && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center text-zinc-800">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <span className="font-black tracking-[0.3em] text-[10px] uppercase opacity-50">Artisan Painting...</span>
                  </div>
                )}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] pointer-events-none" />
              </div>

              {/* Message Typography */}
              <div className="flex-1 space-y-8 text-center flex flex-col items-center justify-center">
                <div className="space-y-4">
                  <p className="font-['Playfair_Display'] italic text-2xl text-zinc-400">
                    Dear {state.recipient},
                  </p>
                  
                  <div className="min-h-[120px] flex items-center justify-center relative px-4">
                    {state.isGeneratingText && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 rounded-3xl">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
                          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                        </div>
                      </div>
                    )}
                    <p className="font-['Playfair_Display'] text-2xl md:text-3xl leading-relaxed text-zinc-800 font-semibold italic">
                      "{state.message}"
                    </p>
                  </div>
                </div>

                {/* Final Signature Footer */}
                <div className="pt-10 border-t border-zinc-100 w-full relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fffdfa] px-6">
                     <Trees className="w-6 h-6 text-emerald-700" />
                  </div>
                  <p className="font-['Rochester'] text-5xl text-red-600">
                    {state.sender}
                  </p>
                </div>
              </div>

              {/* Poster Decorative Elements */}
              <div className="absolute top-12 left-6 opacity-5 rotate-12">
                 <Snowflake className="w-24 h-24" />
              </div>
              <div className="absolute bottom-32 right-6 opacity-5 -rotate-12">
                 <Star className="w-32 h-32" />
              </div>
            </div>
          </div>

          <footer className="mt-12 flex flex-col items-center gap-6 opacity-40">
             <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                <span>Vertical Poster Studio</span>
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_red]" />
                <span>Premium Resolution</span>
             </div>
          </footer>
        </div>
      </main>

      {/* Mobile Control Trigger */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50"
        >
          <ChevronDown className="w-8 h-8 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default App;
