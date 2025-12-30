
import React, { useState, useEffect } from 'react';
import { 
  Plus, Video, BookOpen, TrendingUp, Search, Bell, 
  Stethoscope, FileText, Activity, Bone, Briefcase, 
  Newspaper, PieChart, QrCode, Globe, Cuboid, GraduationCap,
  CalendarCheck2, PlayCircle, FlaskConical, ChevronRight,
  Calendar, AlertCircle, MessageCircle
} from 'lucide-react';
import { getUpcomingHolidays, Holiday } from '../services/externalApis';

interface DashboardProps {
  onSelectTool: (tool: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // API States
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loadingApis, setLoadingApis] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    const date = new Date();
    setCurrentDate(date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }));

    // Load External APIs
    const loadData = async () => {
        try {
            const holidayData = await getUpcomingHolidays();
            setHolidays(Array.isArray(holidayData) ? holidayData : []);
        } catch (e) {
            console.error("Dashboard API load error", e);
            setHolidays([]);
        } finally {
            setLoadingApis(false);
        }
    };
    loadData();
  }, []);

  return (
    <div className="pb-32 animate-fadeIn min-h-full bg-[#F8FAFC]">
      
      {/* 1. HERO HEADER */}
      <div className="pt-12 px-6 pb-6 bg-white rounded-b-[2.5rem] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] border-b border-slate-100">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{currentDate}</p>
                  <h1 className="text-3xl font-medium text-slate-900 leading-tight tracking-tight">
                      {greeting}, <br />
                      <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">Dr. Carlos!</span>
                  </h1>
              </div>
              <div className="relative">
                  <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg cursor-pointer hover:scale-105 transition-transform">
                      <img 
                          src="https://seujoelho.com/wp-content/uploads/2021/01/Dr-Carlos-Franciozi-781x1024.jpg" 
                          className="w-full h-full rounded-full object-cover border-2 border-white" 
                          alt="Profile" 
                      />
                  </div>
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
              </div>
          </div>

          {/* Search Pill */}
          <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <input 
                  type="text" 
                  placeholder="O que vamos criar hoje?" 
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-[1.5rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-inner text-sm font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <button className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-blue-600 transition-colors">
                      <Bell className="w-5 h-5" />
                  </button>
              </div>
          </div>
      </div>

      <div className="px-6 mt-8 space-y-10">
        
        {/* NEW: API WIDGETS ROW (Without Weather) */}
        {!loadingApis && holidays && holidays.length > 0 && (
            <div className="animate-slideUp">
                {/* Holiday Content Widget (Nager.Date) */}
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Oportunidades de Conteúdo</span>
                        </div>
                        <div className="space-y-3">
                            {holidays.map((h, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{h.localName}</p>
                                        <p className="text-[10px] text-slate-500">
                                            {new Date(h.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}
                                        </p>
                                    </div>
                                    <div className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                                        {h.daysUntil === 0 ? 'Hoje' : `+${h.daysUntil}d`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 2. MAIN ACTIONS (Bento Grid) */}
        <div>
            <div className="flex justify-between items-end mb-5 px-1">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Studio de Criação</h2>
                <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wide">Ver tudo</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {/* Primary Action - Create Post */}
                <button 
                    onClick={() => onSelectTool('post')}
                    className="col-span-2 bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group active:scale-[0.98] transition-all"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors"></div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 rounded-2xl flex items-center justify-center mb-4 text-white border border-white/10">
                                <Plus className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-1 tracking-tight">Criar Novo Post</h3>
                            <p className="text-slate-400 text-xs font-medium">Instagram Feed & Stories</p>
                        </div>
                        <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border border-white/5 uppercase tracking-wide">
                            IA Ativa
                        </div>
                    </div>
                </button>

                {/* Secondary - Blog/Article */}
                <button 
                    onClick={() => onSelectTool('seo')}
                    className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between h-40 group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white relative z-10 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-slate-900 text-sm mb-0.5">Artigo</h3>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">Blog & SEO</p>
                    </div>
                </button>

                {/* Secondary - Video */}
                <button 
                    onClick={() => onSelectTool('video')}
                    className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-red-100 hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between h-40 group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-50 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30 flex items-center justify-center text-white relative z-10 group-hover:scale-110 transition-transform">
                        <Video className="w-5 h-5" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-slate-900 text-sm mb-0.5">Vídeo</h3>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">Roteiros & Podcast</p>
                    </div>
                </button>
            </div>
        </div>

        {/* 3. CLINICAL TOOLS (Grid Layout with Premium Icons) */}
        <div>
            <div className="flex justify-between items-end mb-5 px-1">
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" /> 
                    Ferramentas Clínicas
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
                
                {/* 1. Bio-Age */}
                <button 
                    onClick={() => onSelectTool('clinical')} 
                    className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left group relative overflow-hidden active:scale-95"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-[3rem] -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white mb-3 relative z-10 group-hover:-translate-y-1 transition-transform">
                        <FlaskConical className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight relative z-10">Bio-Age</h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 relative z-10">Idade Biológica</p>
                </button>

                {/* 2. Scores */}
                <button 
                    onClick={() => onSelectTool('scores')} 
                    className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left group relative overflow-hidden active:scale-95"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-50 to-transparent rounded-bl-[3rem] -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30 flex items-center justify-center text-white mb-3 relative z-10 group-hover:-translate-y-1 transition-transform">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight relative z-10">Scores</h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 relative z-10">Lysholm, IKDC</p>
                </button>

                {/* 3. RTS Calc */}
                <button 
                    onClick={() => onSelectTool('calculator')} 
                    className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left group relative overflow-hidden active:scale-95"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-[3rem] -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 flex items-center justify-center text-white mb-3 relative z-10 group-hover:-translate-y-1 transition-transform">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight relative z-10">RTS Calc</h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 relative z-10">Retorno Esporte</p>
                </button>

                {/* 4. FRAX */}
                <button 
                    onClick={() => onSelectTool('frax')} 
                    className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left group relative overflow-hidden active:scale-95"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-50 to-transparent rounded-bl-[3rem] -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg shadow-violet-500/30 flex items-center justify-center text-white mb-3 relative z-10 group-hover:-translate-y-1 transition-transform">
                        <Bone className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight relative z-10">FRAX</h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 relative z-10">Risco Fratura</p>
                </button>

            </div>
        </div>

        {/* 4. MANAGEMENT LIST (Clean List with Premium Icons) */}
        <div>
            <h2 className="text-lg font-black text-slate-900 mb-5 px-1 tracking-tight">Gestão & Marca</h2>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                
                {[
                    { id: 'patient_content', label: 'Portal do Paciente', icon: MessageCircle, gradient: 'from-green-400 to-green-600', shadow: 'shadow-green-500/30' },
                    { id: 'publications', label: 'Publicações (79)', icon: GraduationCap, gradient: 'from-indigo-400 to-indigo-600', shadow: 'shadow-indigo-500/30' },
                    { id: 'site', label: 'Meu Site', icon: Globe, gradient: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/30' },
                    { id: 'marketing_roi', label: 'ROI Marketing', icon: PieChart, gradient: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/30' },
                    { id: 'card', label: 'Cartão Digital', icon: QrCode, gradient: 'from-slate-700 to-slate-900', shadow: 'shadow-slate-500/30' },
                    { id: 'news', label: 'Notícias', icon: Newspaper, gradient: 'from-pink-400 to-pink-600', shadow: 'shadow-pink-500/30' }
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => onSelectTool(item.id)}
                        className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors active:bg-slate-100 group"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${item.gradient} shadow-lg ${item.shadow} group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-left font-bold text-sm text-slate-900">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                    </button>
                ))}

            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
