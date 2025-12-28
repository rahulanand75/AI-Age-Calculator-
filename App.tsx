
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, RefreshCw, Star, Info, Globe, Sparkles, ChevronRight, Hash, Sun, Moon, Brain, Compass, TrendingUp, Smartphone, ShieldCheck, Zap, Share2, Copy, ExternalLink, Cloud, Settings, Terminal, Download, Users, CheckCircle2, Package, FileCode, FolderOpen, Play, Rocket, Github, History, User, HeartPulse, Lightbulb } from 'lucide-react';
import { calculateAge, calculatePlanetAges, getGeneration } from './utils/dateUtils';
import { getAIInsights } from './services/geminiService';
import { AgeDetails, PlanetAge, AIInsight } from './types';

const App: React.FC = () => {
  const [day, setDay] = useState<string>('15');
  const [month, setMonth] = useState<string>('06');
  const [year, setYear] = useState<string>('1998');
  
  const [ageDetails, setAgeDetails] = useState<AgeDetails | null>(null);
  const [planetAges, setPlanetAges] = useState<PlanetAge[]>([]);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [localGeneration, setLocalGeneration] = useState<string>('');
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
    setLocalGeneration(getGeneration(y));
    
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
              
              <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                    <Compass size={18} className="text-indigo-500" />
                    Life Stats
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Days</p>
                    <p className="text-xl font-black text-slate-800 tabular-nums">{ageDetails.totalDays.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Weeks</p>
                    <p className="text-xl font-black text-slate-800 tabular-nums">{ageDetails.totalWeeks.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Months</p>
                    <p className="text-xl font-black text-slate-800 tabular-nums">{ageDetails.totalMonths.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Zodiac</p>
                    <p className="text-xl font-black text-slate-800">{ageDetails.zodiacIcon} {ageDetails.zodiac}</p>
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

              {/* Instant Local Generation Mapping (Always Visible) */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-[32px] text-white shadow-xl transition-all hover:scale-[1.01]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Generation Mapping</p>
                    <h3 className="text-2xl font-black">{localGeneration || "Calculating..."}</h3>
                    {aiInsight?.generation && (
                      <p className="text-[11px] font-bold text-white/70 mt-1 max-w-[200px]">
                        {aiInsight.generation.split(' - ')[1] || "A generation of change-makers."}
                      </p>
                    )}
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg">
                    <Users size={28} />
                  </div>
                </div>
              </div>
              
              {!isLoading && aiInsight ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {/* Era Flashback */}
                  <div className="bg-amber-50 border border-amber-100 p-6 rounded-[32px] shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <History size={16} className="text-amber-600" />
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Era Flashback: {year}</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-bold italic">"{aiInsight.birthYearFact}"</p>
                  </div>

                  {/* Personality */}
                  <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <User size={16} className="text-rose-600" />
                      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Personality Nature</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{aiInsight.personalityNature}</p>
                  </div>

                  {/* Historical Context */}
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-[32px] shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe size={16} className="text-blue-600" />
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Historical Context</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{aiInsight.historicalContext}</p>
                  </div>

                  {/* Life Path Advice */}
                  <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[32px] shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={16} className="text-emerald-600" />
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Life Path Advice</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">{aiInsight.lifePathAdvice}</p>
                  </div>

                  {/* Future Outlook */}
                  <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                      <TrendingUp size={120} />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <HeartPulse size={16} className="text-indigo-400" />
                      <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Future Outlook</p>
                    </div>
                    <p className="text-base leading-relaxed font-medium text-indigo-50">{aiInsight.futurePredictions}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <RefreshCw className="text-indigo-400 animate-spin mb-4" size={40} />
                  <p className="text-slate-400 font-bold">Consulting the Cosmic Records...</p>
                  <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-2">Fetching AI Insights</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-8 py-6 pb-12">
                <div className="bg-gradient-to-br from-teal-600 to-emerald-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4">
                      <Globe size={24} /> Deploy to Netlify
                    </h3>
                    <p className="text-teal-50 text-sm leading-relaxed mb-6 font-medium">
                      Sync with GitHub & Netlify for 24/7 hosting:
                    </p>
                    <ol className="space-y-3 text-xs font-bold text-teal-100">
                      <li className="flex gap-2"><span className="opacity-50">1.</span> Create a repo on GitHub</li>
                      <li className="flex gap-2"><span className="opacity-50">2.</span> Push your code using Git</li>
                      <li className="flex gap-2"><span className="opacity-50">3.</span> Connect GitHub to Netlify</li>
                      <li className="flex gap-2"><span className="opacity-50">4.</span> Set 'API_KEY' in Site Env Vars</li>
                    </ol>
                  </div>
                  <div className="absolute -right-10 -bottom-10 opacity-10">
                    <Github size={180} />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4">
                      <Rocket size={24} /> Instant Vercel URL
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
                      Quick test? Run this in your terminal:
                    </p>
                    <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                       <code className="text-teal-300 font-mono text-sm">npx vercel</code>
                       <button onClick={() => copyToClipboard('npx vercel')} className="p-2 hover:bg-white/10 rounded-lg"><Copy size={16}/></button>
                    </div>
                  </div>
                </div>

               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
                    <Play size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Android App Steps</h2>
                </div>

                <div className="bg-slate-900 p-6 rounded-[32px] shadow-xl text-white space-y-6">
                   <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <Terminal size={18} className="text-teal-400" />
                      <p className="text-xs font-black uppercase tracking-widest text-teal-400">Local Terminal Commands</p>
                   </div>
                   
                   <div className="space-y-5">
                      <div className="group">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">1. Install Dependencies</p>
                         <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
                            <code className="text-xs text-indigo-300">npm install</code>
                            <button onClick={() => copyToClipboard('npm install')} className="text-white/20 hover:text-white"><Copy size={14}/></button>
                         </div>
                      </div>

                      <div className="group">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">2. Prep Android</p>
                         <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
                            <code className="text-xs text-indigo-300">npm run cap:add</code>
                            <button onClick={() => copyToClipboard('npm run cap:add')} className="text-white/20 hover:text-white"><Copy size={14}/></button>
                         </div>
                      </div>

                      <div className="group">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">3. Sync Code</p>
                         <div className="bg-black/40 p-3 rounded-xl flex items-center justify-between">
                            <code className="text-xs text-indigo-300">npm run cap:sync</code>
                            <button onClick={() => copyToClipboard('npm run cap:sync')} className="text-white/20 hover:text-white"><Copy size={14}/></button>
                         </div>
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
