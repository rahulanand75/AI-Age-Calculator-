
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, RefreshCw, Star, Info, Globe, Sparkles, ChevronRight, Hash, Sun, Moon, Brain, Compass, TrendingUp, Smartphone, ShieldCheck, Zap, Share2, Copy, ExternalLink, Cloud, Settings } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Fake Status Bar */}
      <div className="w-full max-w-md bg-indigo-600 h-6 flex justify-between px-4 items-center text-[10px] text-white/80 font-medium">
        <span>12:45</span>
        <div className="flex gap-1 items-center">
          <Globe size={10} />
          <span>LTE</span>
          <div className="w-4 h-2 border border-white/50 rounded-sm relative">
            <div className="absolute left-0 top-0 h-full w-3/4 bg-white"></div>
          </div>
        </div>
      </div>

      <main className="w-full max-w-md bg-white min-h-[calc(100vh-24px)] flex flex-col shadow-2xl relative">
        <header className="bg-indigo-600 pt-8 pb-10 px-6 rounded-b-[40px] text-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">LifeCycle Pro</h1>
            <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Share App"
              >
                <Share2 size={18} />
              </button>
              <button 
                onClick={handleCalculate}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
            <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-[0.2em] mb-3 text-center opacity-70">Manual Birth Date Entry</p>
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
                <label className="text-[9px] font-bold opacity-60">DAY</label>
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
                <label className="text-[9px] font-bold opacity-60">MONTH</label>
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
                <label className="text-[9px] font-bold opacity-60">YEAR</label>
              </div>
            </div>
            <button 
              onClick={handleCalculate}
              className="mt-4 w-full bg-white text-indigo-600 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-[0.98] transition-all hover:bg-indigo-50"
            >
              CALCULATE AGE
            </button>
          </div>
        </header>

        <div className="px-6 -mt-6 flex-1 pb-28 overflow-y-auto">
          {ageDetails && activeTab === 'summary' && (
            <div className="space-y-6 pt-2">
              <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Your Exact Age</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-800 tabular-nums">{ageDetails.years}</span>
                    <span className="text-xl font-bold text-slate-400">Years</span>
                  </div>
                  <p className="text-indigo-600 font-bold mt-2 text-sm bg-indigo-50 px-3 py-1 rounded-full inline-block">
                    {ageDetails.months} Months, {ageDetails.days} Days
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
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
                <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-200">Next Celebration Day:</span>
                  <span className="text-sm font-black text-white px-3 py-1 bg-white/10 rounded-lg">{ageDetails.nextBirthday.weekday}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[32px] shadow-md border border-slate-100 flex items-center gap-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:scale-110"></div>
                 <div className="w-16 h-16 rounded-3xl bg-orange-50 flex items-center justify-center text-3xl shadow-sm z-10">
                    🕉️
                 </div>
                 <div className="z-10 flex-1">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Telugu Zodiac (రాశి)</p>
                    <p className="text-xl font-black text-slate-800 leading-tight">
                       {ageDetails.teluguRashi}
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 group hover:border-indigo-200 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
                      <Hash size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Weeks</p>
                    <p className="text-xl font-black text-slate-800 mt-1 tabular-nums">{ageDetails.totalWeeks.toLocaleString()}</p>
                 </div>
                 <div className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 group hover:border-indigo-200 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 mb-3">
                      {ageDetails.zodiacIcon}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Western Zodiac</p>
                    <p className="text-xl font-black text-slate-800 mt-1">{ageDetails.zodiac}</p>
                 </div>
                 <div className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 group hover:border-indigo-200 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 mb-3">
                      <Sun size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Hours</p>
                    <p className="text-xl font-black text-slate-800 mt-1 tabular-nums">{ageDetails.totalHours.toLocaleString()}</p>
                 </div>
                 <div className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 group hover:border-indigo-200 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500 mb-3">
                      <Moon size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Days</p>
                    <p className="text-xl font-black text-slate-800 mt-1 tabular-nums">{ageDetails.totalDays.toLocaleString()}</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'planets' && (
            <div className="space-y-4 py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                  <Globe size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Interplanetary Age</h2>
              </div>
              <p className="text-sm text-slate-500 mb-6 font-medium">See how old you would be on other planets in our solar system.</p>
              
              <div className="grid grid-cols-1 gap-4">
                {planetAges.map((planet) => (
                  <div key={planet.name} className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 flex items-center justify-between hover:scale-[1.02] transition-transform">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${planet.color}`}>
                        {planet.icon}
                      </div>
                      <div>
                        <p className="text-slate-800 font-black text-lg">{planet.name}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Orbital Years</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-3xl font-black text-slate-800 tabular-nums">{planet.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6 py-6 pb-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
                    <Sparkles size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">AI Cosmic Insights</h2>
                </div>
                {isLoading && <RefreshCw size={18} className="animate-spin text-purple-500" />}
              </div>
              
              {!isLoading && aiInsight ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-6 rounded-[32px] shadow-inner relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 opacity-5 text-purple-600">
                      <Sparkles size={140} />
                    </div>
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-3">Era Flashback: {year}</p>
                    <p className="text-slate-700 leading-relaxed font-bold text-lg italic pr-4">
                      "{aiInsight.birthYearFact}"
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                          <Brain size={20} />
                       </div>
                       <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Personality Nature</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {aiInsight.personalityNature}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <Info size={16} />
                         </div>
                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Your Generation</p>
                      </div>
                      <p className="font-black text-xl text-slate-800">{aiInsight.generation}</p>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-[32px] border border-green-100">
                       <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <Compass size={16} />
                         </div>
                         <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Global Context</p>
                      </div>
                      <p className="font-bold text-slate-700 leading-relaxed text-sm">{aiInsight.historicalContext}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                      <TrendingUp size={64} />
                    </div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                      <TrendingUp size={14} /> Future Outlook (Next 5 Years)
                    </p>
                    <p className="text-base leading-relaxed font-medium text-indigo-50">
                      {aiInsight.futurePredictions}
                    </p>
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Cosmic Advice</p>
                    <p className="text-slate-700 leading-relaxed font-bold italic text-lg text-center">
                      "{aiInsight.lifePathAdvice}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center relative">
                     <Sparkles className="text-indigo-300 animate-pulse" size={40} />
                     <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-200 animate-[spin_10s_linear_infinite]"></div>
                   </div>
                   <div className="text-center space-y-2">
                     <p className="text-slate-800 font-black">Aligning the Stars...</p>
                     <p className="text-slate-400 text-sm font-medium max-w-[200px]">Generating personality traits and future projections for you.</p>
                   </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-6 py-6 pb-12">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-xl text-teal-600">
                    <Cloud size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Netlify Deployment</h2>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                   <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 mb-2">
                      <p className="text-teal-800 font-black text-sm flex items-center gap-2">
                         <ShieldCheck size={16} /> Optimized for Netlify
                      </p>
                      <p className="text-xs text-teal-700 mt-2 leading-relaxed">
                        This app includes <code>netlify.toml</code> and <code>_redirects</code>. Your site will handle SPA routing perfectly on Netlify's global edge network.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                            <Settings size={20} />
                         </div>
                         <div>
                            <p className="font-black text-slate-800">Critical Step: API Key</p>
                            <p className="text-sm text-slate-500 leading-relaxed">Go to <strong>Site Settings > Environment Variables</strong> in Netlify and add <code>API_KEY</code> with your Gemini key.</p>
                         </div>
                      </div>

                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                            <Smartphone size={20} />
                         </div>
                         <div>
                            <p className="font-black text-slate-800">Android PWA Ready</p>
                            <p className="text-sm text-slate-500 leading-relaxed">Once deployed to Netlify, your users can "Install" this as a native-feeling app on their Android devices.</p>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={handleShare}
                     className="w-full flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-teal-100"
                   >
                     <Share2 size={20} /> SHARE DEPLOYED URL
                   </button>
                </div>

                <div className="bg-slate-900 p-8 rounded-[40px] text-white">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest mb-1 text-teal-400">Environment Ready</p>
                        <p className="text-2xl font-black italic">Netlify Friendly</p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-2xl">
                         <Zap size={24} className="text-teal-400" />
                      </div>
                   </div>
                   <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">
                      Fully configured with <code>_redirects</code> for seamless SPA navigation and <code>Cache-Control</code> headers for Service Worker reliability.
                   </p>
                </div>
            </div>
          )}
        </div>

        <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex justify-between items-center z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'summary' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 'hover:bg-slate-50'}`}>
               <Calendar size={22} strokeWidth={activeTab === 'summary' ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === 'summary' ? 'opacity-100' : 'opacity-60'}`}>Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('planets')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'planets' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'planets' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 'hover:bg-slate-50'}`}>
               <Globe size={22} strokeWidth={activeTab === 'planets' ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === 'planets' ? 'opacity-100' : 'opacity-60'}`}>Planets</span>
          </button>

          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'ai' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 'hover:bg-slate-50'}`}>
               <Sparkles size={22} strokeWidth={activeTab === 'ai' ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === 'ai' ? 'opacity-100' : 'opacity-60'}`}>Insights</span>
          </button>

          <button 
            onClick={() => setActiveTab('info')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'info' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'info' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 'hover:bg-slate-50'}`}>
               <Cloud size={22} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === 'info' ? 'opacity-100' : 'opacity-60'}`}>Deploy</span>
          </button>
        </nav>
      </main>

      <div className="fixed -z-10 top-0 left-0 w-full h-full bg-slate-50 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-purple-100 rounded-full blur-[120px] opacity-40"></div>
      </div>
    </div>
  );
};

export default App;
