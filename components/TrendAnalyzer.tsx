
import React, { useEffect, useState } from 'react';
import { TrendTopic, PostState, PostCategory, Tone, PostFormat } from '../types';
import { generateTrendSuggestions } from '../services/geminiService';
import { TrendingUp, ArrowUpRight, Flame, Loader2, Plus, RefreshCw, Search, Sparkles, Globe, Radio, BarChart3, SignalHigh } from 'lucide-react';

interface TrendAnalyzerProps {
  onUseTrend: (partialState: Partial<PostState>) => void;
}

const TrendAnalyzer: React.FC<TrendAnalyzerProps> = ({ onUseTrend }) => {
  const [trends, setTrends] = useState<TrendTopic[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    setLoading(true);
    try {
        const data = await generateTrendSuggestions();
        setTrends(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  // Newsroom Loading Animation
  const RadarLoading = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-fadeIn bg-slate-900 rounded-[2rem] relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900"></div>
        
        {/* Grid Background */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative w-48 h-48 mb-8">
            {/* Radar Scan */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30"></div>
            <div className="absolute inset-[20%] rounded-full border border-blue-500/20"></div>
            <div className="absolute inset-[40%] rounded-full border border-blue-500/10"></div>
            
            {/* Sweep */}
            <div className="absolute inset-0 rounded-full overflow-hidden animate-[spin_4s_linear_infinite]">
                <div className="w-full h-1/2 bg-gradient-to-t from-blue-500/50 to-transparent blur-xl origin-bottom"></div>
            </div>

            {/* Blips */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-green-500 rounded-full animate-ping animation-delay-500"></div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
                <Globe className="w-12 h-12 text-blue-400" />
            </div>
        </div>
        
        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Global Scan</h3>
        <p className="text-blue-300/60 text-xs font-mono animate-pulse">
            ANALYZING SEARCH VECTORS...
        </p>
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-fadeIn bg-slate-50 pb-24 lg:pb-0">
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
            
            {/* Dashboard Header */}
            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest animate-pulse">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div> Live
                            </span>
                            <span className="text-xs text-slate-400 font-mono">BRA_REGION_SE</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight leading-none">Google Trends Intel</h2>
                        <p className="text-slate-400 text-sm mt-1">Monitoramento de buscas em saúde ortopédica.</p>
                    </div>
                    
                    <button 
                        onClick={fetchTrends}
                        disabled={loading}
                        className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {loading ? (
                <RadarLoading />
            ) : (
                <>
                    {/* Featured / Viral Trend */}
                    {trends.length > 0 && (
                        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl shadow-orange-500/30 group cursor-pointer transition-transform hover:scale-[1.01]"
                             onClick={() => onUseTrend({ 
                                topic: trends[0].keyword, 
                                customInstructions: `Trend Viral: ${trends[0].keyword}. Headline: ${trends[0].suggestedHeadline}. Foco: ${trends[0].growth}`,
                                category: PostCategory.LIFESTYLE,
                                tone: Tone.EDUCATIONAL,
                                format: PostFormat.FEED
                            })}
                        >
                            {/* Decorative Background */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            
                            <div className="relative p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 flex items-center gap-2">
                                        <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-bounce" />
                                        <span className="text-xs font-black uppercase tracking-wide">Viral Alert</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold opacity-80 uppercase">Crescimento</p>
                                        <p className="text-2xl font-black leading-none">{trends[0].growth}</p>
                                    </div>
                                </div>
                                
                                <h3 className="text-3xl font-black mb-2 leading-tight tracking-tight">
                                    {trends[0].keyword}
                                </h3>
                                <p className="text-white/80 text-sm font-medium mb-6 line-clamp-2">
                                    "{trends[0].suggestedHeadline}"
                                </p>

                                <div className="bg-white text-red-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
                                    <Sparkles className="w-4 h-4" /> Criar Conteúdo Agora
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Heatmap Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {trends.slice(1).map((trend, idx) => (
                            <button 
                                key={idx}
                                onClick={() => onUseTrend({ 
                                    topic: trend.keyword, 
                                    customInstructions: `Trend: ${trend.keyword}. Headline: ${trend.suggestedHeadline}`,
                                    category: PostCategory.LIFESTYLE,
                                    tone: Tone.EDUCATIONAL,
                                    format: PostFormat.FEED
                                })}
                                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all text-left group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-blue-100 transition-colors"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{trend.category}</span>
                                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                            <SignalHigh className="w-3 h-3" />
                                            {trend.volume}
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-700 transition-colors">
                                        {trend.keyword}
                                    </h4>
                                    
                                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-500 group-hover:text-blue-600">
                                        <Plus className="w-4 h-4" /> Usar Pauta
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {trends.length === 0 && !loading && (
                        <div className="text-center py-20 opacity-50">
                            <BarChart3 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                            <p className="text-sm font-bold text-slate-400">Sistema em Standby</p>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
  );
};

export default TrendAnalyzer;
