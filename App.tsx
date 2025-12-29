
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  RefreshCw, 
  Globe, 
  Sparkles, 
  Moon, 
  Sun, 
  Compass, 
  Users, 
  History, 
  User, 
  HeartPulse, 
  Lightbulb,
  TrendingUp,
  Share2
} from 'lucide-react';
import { calculateAge, calculatePlanetAges, getGeneration } from './utils/dateUtils';
import { getAIInsights } from './services/geminiService';
import { AgeDetails, PlanetAge, AIInsight } from './types';

const App: React.FC = () => {
  const [day, setDay] = useState<string>('18');
  const [month, setMonth] = useState<string>('09');
  const [year, setYear] = useState<string>('1975');
  
  const [ageDetails, setAgeDetails] = useState<AgeDetails | null>(null);
  const [planetAges, setPlanetAges] = useState<PlanetAge[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'planets' | 'ai'>('summary');

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
    setAiInsights(insights);
    setIsLoading(false);
  }, [day, month, year]);

  useEffect(() => {
    handleCalculate();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LifeCycle Pro',
          text: `Check out my Age and Vedic Rashi on LifeCycle Pro! Born on ${day}/${month}/${year}.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const inputClasses = "bg-white/10 text-white placeholder:text-white/40 text-center font-bold text-lg rounded-xl py-3 w-full focus:bg-white/20 focus:outline-none border border-white/10 transition-all";

  return (
    <div className="flex-1 flex flex-col items-center overflow-hidden h-full bg-slate-50">
      <main className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative">
        
        {/* Header - Date Input Section */}
        <header className="bg-indigo-600 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-8 px-6 rounded-b-[40px] text-white shadow-lg z-30">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar size={18} />
              </div>
              LifeCycle Pro
            </h1>
            <button 
              onClick={handleShare}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-90"
            >
              <Share2 size={18} />
            </button>
          </div>
          
          <div className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-1 text-center">
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="DD"
                  maxLength={2}
                  value={day}
                  onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
                  className={inputClasses}
                />
                <label className="text-[9px] font-black opacity-60 uppercase tracking-widest mt-1 block">Day</label>
              </div>
              <div className="flex-1 text-center">
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="MM"
                  maxLength={2}
                  value={month}
                  onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
                  className={inputClasses}
                />
                <label className="text-[9px] font-black opacity-60 uppercase tracking-widest mt-1 block">Month</label>
              </div>
              <div className="flex-[1.5] text-center">
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="YYYY"
                  maxLength={4}
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                  className={inputClasses}
                />
                <label className="text-[9px] font-black opacity-60 uppercase tracking-widest mt-1 block">Year</label>
              </div>
            </div>
            <button 
              onClick={handleCalculate}
              disabled={isLoading}
              className="mt-4 w-full bg-white text-indigo-700 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-[0.97] transition-all hover:bg-indigo-50 border-b-4 border-indigo-100 flex items-center justify-center gap-2"
            >
              {isLoading && <RefreshCw size={16} className="animate-spin" />}
              CALCULATE JOURNEY
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="px-6 -mt-4 flex-1 pb-32 overflow-y-auto scroll-smooth">
          
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && ageDetails && (
             <div className="space-y-6 pt-2 animate-in fade-in duration-500">
              
              {/* Main Age Card */}
              <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 flex items-center justify-between group transition-all hover:border-indigo-200">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Current Age</p>
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

              {/* Vedic Identity Card - Focus on Rashi & Nakshatram */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-10">
                   <Sun size={140} fill="white" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Moon size={16} fill="white" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-amber-50">Telugu Janma Rashi Profile</h3>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center gap-4 py-6">
                    <RefreshCw className="animate-spin text-white/50" size={24} />
                    <p className="text-sm font-bold animate-pulse">Calculating Vedic Charts...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/20 pb-4">
                      <div>
                        <p className="text-[10px] font-black text-white/70 uppercase">Janma Rashi (జన్మ రాశి)</p>
                        <p className="text-2xl font-black">{aiInsights?.janmaRashi || "Finding..."}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-white/70 uppercase">Padam (పాదం)</p>
                        <p className="text-2xl font-black">{aiInsights?.padham || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/70 uppercase">Nakshatram (నక్షత్రం)</p>
                      <p className="text-3xl font-black tracking-tight">{aiInsights?.nakshatram || "Calculating..."}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Precise Metrics Grid */}
              <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                    <Compass size={18} className="text-indigo-500" />
                    Journey Stats
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Days</p>
                    <p className="text-xl font-black text-slate-800 tabular-nums">{ageDetails.totalDays.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Hours</p>
                    <p className="text-xl font-black text-slate-800 tabular-nums">{ageDetails.totalHours.toLocaleString()}</p>
                  </div>
                   <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Western Sign</p>
                    <p className="text-lg font-black text-slate-800">{ageDetails.zodiacIcon} {ageDetails.zodiac}</p>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                    <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Next Birthday</p>
                    <p className="text-lg font-black text-slate-800">{ageDetails.nextBirthday.months}m {ageDetails.nextBirthday.days}d</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLANETS */}
          {activeTab === 'planets' && (
             <div className="space-y-4 py-6 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-3 mb-2 px-2">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600">
                  <Globe size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Planetary Life Cycles</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {planetAges.map((planet) => (
                  <div key={planet.name} className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${planet.color}`}>
                        {planet.icon}
                      </div>
                      <div>
                        <p className="text-slate-800 font-black text-lg">{planet.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rotational Age</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-slate-800 tabular-nums">{planet.age}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Cycles</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COSMIC AI INSIGHTS */}
          {activeTab === 'ai' && (
             <div className="space-y-6 py-6 pb-12 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2.5 bg-purple-100 rounded-xl text-purple-600">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Cosmic AI Insights</h2>
              </div>

              {/* Generation Highlight */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-[32px] text-white shadow-xl transition-all hover:scale-[1.01]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Generation Signature</p>
                    <h3 className="text-2xl font-black">{aiInsights?.generation || "Analyzing..." }</h3>
                    <p className="text-[11px] font-bold text-white/70 mt-1 max-w-[200px]">
                      Historical context: {year}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg">
                    <Users size={28} />
                  </div>
                </div>
              </div>
              
              {!isLoading && aiInsights ? (
                <div className="space-y-6">
                  {/* Personality Section */}
                  <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5 text-rose-600">
                      <User size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <User size={16} className="text-rose-600" />
                      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Nature & Traits</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">{aiInsights.personalityNature}</p>
                  </div>

                  {/* Era Flashback Section */}
                  <div className="bg-amber-50 border border-amber-100 p-6 rounded-[32px] shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5 text-amber-600">
                      <History size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <History size={16} className="text-amber-600" />
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Era Flashback: {year}</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed italic">"{aiInsights.birthYearFact}"</p>
                  </div>

                  {/* Historical Insight */}
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-[32px] shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5 text-blue-600">
                      <Globe size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe size={16} className="text-blue-600" />
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">World When You Were Born</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{aiInsights.historicalContext}</p>
                  </div>

                  {/* Life Path Advice */}
                  <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[32px] shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5 text-emerald-600">
                      <Lightbulb size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={16} className="text-emerald-600" />
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Life Path Advice</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-bold">{aiInsights.lifePathAdvice}</p>
                  </div>

                  {/* Future Outlook */}
                  <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-20">
                      <TrendingUp size={120} />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <HeartPulse size={16} className="text-indigo-400" />
                      <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Future Roadmap</p>
                    </div>
                    <p className="text-base leading-relaxed font-medium text-indigo-50 relative z-10">{aiInsights.futurePredictions}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <RefreshCw className="text-indigo-400 animate-spin mb-4" size={40} />
                  <p className="text-slate-400 font-bold">Reading the Universal Blueprint...</p>
                  <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-2">Consulting Gemini AI</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-around items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
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
            <span className="text-[10px] font-black uppercase">Cosmic AI</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;
