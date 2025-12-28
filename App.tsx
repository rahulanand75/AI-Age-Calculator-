
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, RefreshCw, Star, Info, Globe, Sparkles, ChevronRight, Hash, Sun, Moon, Brain, Compass, TrendingUp, Smartphone, ShieldCheck, Zap, Share2, Copy, ExternalLink, Cloud, Settings, Terminal, Download, Users, CheckCircle2, Package, FileCode, FolderOpen, Play, Rocket } from 'lucide-react';
import { calculateAge, calculatePlanetAges } from './utils/dateUtils';
import { getAIInsights } from './services/geminiService';
import { AgeDetails, PlanetAge, AIInsight } from './types';

const App: React.FC = () => {
  const [day, setDay] = useState<string>('15');
  const [month, setMonth] = useState<string>('06');
  const [year, setYear] = useState<string>('1998');
  
  const [ageDetails, setAgeDetails] = useState<AgeDetails | null>(null);
  const [planetAges, setPlanetAges] = useState<PlanetAge[]>([]);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'planets' | 'ai' | 'info'>('summary');

  const handleCalculate = useCallback(async () => {
    const d = parseInt(day);
    const m = parseInt(month) - 1; 
    const y = parseInt(year);

    if (isNaN(d) || isNaN(m) || isNaN(y) || y < 1900 || y > new Date().getFullYear()) {
      return;
    }

    const dateObj = new Date(y, m, d);
    if (dateObj.getMonth() !== m) return;

    const details = calculateAge(dateObj);
    setAgeDetails(details);
    setPlanetAges(calculatePlanetAges(dateObj));
    
    setIsLoading(true);
    const insights = await getAIInsights(dateObj);
    setAiInsight(insights);
    setIsLoading(false);
  }, [day, month, year]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LifeCycle Pro',
          text: 'Check out this advanced Age Calculator with AI Insights and Zodiac tracking!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('App link copied to clipboard!');
    }
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  const inputClasses = "bg-white/10 text-white placeholder:text-white/40 text-center font-bold text-lg rounded-xl py-2 w-full focus:bg-white/20 focus:outline-none border border-white/10 transition-all";

  return (
    <div className="flex-1 flex flex-col items-center overflow-hidden h-full">
      <main className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative">
        <header className="bg-indigo-600 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-10 px-6 rounded-b-[40px] text-white shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar size={18} />
              </div>
              LifeCycle Pro
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-90"
                title="Share App"
              >
                <Share2 size={18} />
              </button>
              <button 
                onClick={handleCalculate}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-90"
              >
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1 text-center">
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="DD"
                  maxLength={2}
                  value={day}
                  onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
                  className={inputClasses}
                />
                <label className="text-[9px] font-black opacity-60 uppercase tracking-widest">Day</label>
              </div>
              <div className="flex-1 space-y-1 text-center">
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="MM"
                  maxLength={2}
                  value={month}
                  onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
                  className={inputClasses}
                />
                <label className="text-[9px] font-black opacity-60 uppercase tracking-widest">Month</label>
              </div>
              <div className="flex-[1.5] space-y-1 text-center">
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="YYYY"
                  maxLength={4}
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                  className={inputClasses}
                />
                <label className="text-[9px] font-black opacity-60 uppercase tracking-widest">Year</label>
              </div>
            </div>
            <button 
              onClick={handleCalculate}
              className="mt-4 w-full bg-white text-indigo-700 py-3.5 rounded-2xl font-black text-sm shadow-xl active:scale-[0.97] transition-all hover:bg-indigo-50 border-b-4 border-indigo-100"
            >
              CALCULATE AGE
            </button>
          </div>
        </header>

        <div className="px-6 -mt-6 flex-1 pb-32 overflow-y-auto scroll-smooth">
          {activeTab === 'summary' && ageDetails && (
             <div className="space-y-6 pt-2">
              <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 flex items-center justify-between group transition-all hover:border-indigo-200">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Your Exact Age</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-800 tabular-nums tracking-tighter">{ageDetails.years}</span>
                    <span className="text-xl font-bold text-slate-400">Years</span>
                  </div>
                  <p className="text-indigo-600 font-bold mt-2 text-sm bg-indigo-50 px-4 py-1.5 rounded-full inline-block">
                    {ageDetails.months} Months, {ageDetails.days} Days
                  </p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-100 to-indigo-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                  🎂
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] p-6 text-white shadow-2xl overflow-hidden relative border border-white/10">
                <div className="absolute -right-6 -bottom-6 opacity-10">
                   <Star size={120} fill="white" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Calendar size={16} />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-100">Birthday Countdown</h3>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 text-center border border-white/10">
                    <p className="text-3xl font-black tabular-nums">{ageDetails.nextBirthday.months}</p>
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">Months</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 text-center border border-white/10">
                    <p className="text-3xl font-black tabular-nums">{ageDetails.nextBirthday.days}</p>
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">Days Left</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'planets' && (
             <div className="space-y-4 py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600">
                  <Globe size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Planetary Age</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {planetAges.map((planet) => (
                  <div key={planet.name} className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${planet.color}`}>
                        {planet.icon}
                      </div>
                      <p className="text-slate-800 font-black text-lg">{planet.name}</p>
                    </div>
                    <span className="text-3xl font-black text-slate-800 tabular-nums">{planet.age}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
             <div className="space-y-6 py-6 pb-12">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 rounded-xl text-purple-600">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">AI Cosmic Insights</h2>
              </div>
              {!isLoading && aiInsight ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-6 rounded-[32px] shadow-inner relative overflow-hidden">
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-3">Era Flashback: {year}</p>
                    <p className="text-slate-700 leading-relaxed font-bold text-lg italic pr-4">"{aiInsight.birthYearFact}"</p>
                  </div>
                  <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Future Outlook</p>
                    <p className="text-base leading-relaxed font-medium text-indigo-50">{aiInsight.futurePredictions}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <RefreshCw className="text-indigo-400 animate-spin mb-4" size={40} />
                  <p className="text-slate-400 font-bold">Aligning the Stars...</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-8 py-6 pb-12">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4">
                      <Rocket size={24} /> Get Public URL
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
                      Want to share this app with friends for testing right now? Run this single command in your terminal:
                    </p>
                    <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                       <code className="text-teal-300 font-mono text-sm">npx vercel</code>
                       <button onClick={() => copyToClipboard('npx vercel')} className="p-2 hover:bg-white/10 rounded-lg"><Copy size={16}/></button>
                    </div>
                    <p className="text-[10px] mt-4 opacity-70 font-bold uppercase tracking-widest text-center">Your URL will be ready in 30s</p>
                  </div>
                  <div className="absolute -right-10 -bottom-10 opacity-10">
                    <Globe size={180} />
                  </div>
                </div>

               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
                    <Play size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Full Android Setup</h2>
                </div>

                <div className="bg-slate-900 p-6 rounded-[32px] shadow-xl text-white space-y-6">
                   <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <Terminal size={18} className="text-teal-400" />
                      <p className="text-xs font-black uppercase tracking-widest text-teal-400">Terminal Workflow</p>
                   </div>
                   
                   <div className="space-y-5">
                      <div className="group">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">1. Install Engines</p>
                         <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
                            <code className="text-xs text-indigo-300">npm install</code>
                            <button onClick={() => copyToClipboard('npm install')} className="text-white/20 hover:text-white"><Copy size={14}/></button>
                         </div>
                      </div>

                      <div className="group">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">2. Create Android Project</p>
                         <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
                            <code className="text-xs text-indigo-300">npm run cap:add</code>
                            <button onClick={() => copyToClipboard('npm run cap:add')} className="text-white/20 hover:text-white"><Copy size={14}/></button>
                         </div>
                      </div>

                      <div className="group">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">3. Build & Sync</p>
                         <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
                            <code className="text-xs text-indigo-300">npm run cap:sync</code>
                            <button onClick={() => copyToClipboard('npm run cap:sync')} className="text-white/20 hover:text-white"><Copy size={14}/></button>
                         </div>
                      </div>

                      <div className="group">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">4. Open Android Studio</p>
                         <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
                            <code className="text-xs text-indigo-300">npm run cap:open</code>
                            <button onClick={() => copyToClipboard('npm run cap:open')} className="text-white/20 hover:text-white"><Copy size={14}/></button>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border-2 border-dashed border-indigo-100 shadow-sm space-y-5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                         <Smartphone size={20} />
                      </div>
                      <h3 className="font-black text-slate-800">Android Studio Build</h3>
                   </div>
                   
                   <p className="text-sm text-slate-600 leading-relaxed">
                      Once Android Studio opens, follow the visual path to your APK:
                   </p>
                   
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center text-white font-bold">1</div>
                         <p className="text-xs font-bold text-slate-700">Go to: <span className="text-indigo-600">Build</span> menu</p>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center text-white font-bold">2</div>
                         <p className="text-xs font-bold text-slate-700">Select: <span className="text-indigo-600">Build Bundle(s) / APK(s)</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center text-white font-bold">3</div>
                         <p className="text-xs font-bold text-slate-700">Click: <span className="text-indigo-600 font-black">Build APK(s)</span></p>
                      </div>
                   </div>
                </div>
            </div>
          )}
        </div>

        <nav className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-between items-center z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <button onClick={() => setActiveTab('summary')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'summary' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50'}`}>
               <Calendar size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase">Summary</span>
          </button>
          
          <button onClick={() => setActiveTab('planets')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'planets' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'planets' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50'}`}>
               <Globe size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase">Planets</span>
          </button>

          <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'ai' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50'}`}>
               <Sparkles size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase">AI</span>
          </button>

          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'info' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'info' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50'}`}>
               <Package size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase">Build</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;
