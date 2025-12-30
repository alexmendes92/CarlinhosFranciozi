
import React, { useState, useMemo } from 'react';
import { publicationsData, mapLocalPublicationToPubMed } from '../services/publicationsData';
import { ScientificPublication, PubMedArticle } from '../types';
import { Search, ExternalLink, FileText, Calendar, Users, GraduationCap, Award, Sparkles, Video, PenTool, X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PublicationsListProps {
    onUseArticle?: (article: PubMedArticle, type: 'post' | 'seo') => void;
}

const PublicationsList: React.FC<PublicationsListProps> = ({ onUseArticle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPub, setSelectedPub] = useState<ScientificPublication | null>(null);

  const filteredPublications = useMemo(() => {
    if (!searchTerm) return publicationsData;
    const term = searchTerm.toLowerCase();
    return publicationsData.filter(pub => 
      pub.titulo.toLowerCase().includes(term) || 
      pub.journal.toLowerCase().includes(term) ||
      pub.ano.includes(term)
    );
  }, [searchTerm]);

  const handleRemix = (type: 'post' | 'seo') => {
      if (!selectedPub || !onUseArticle) return;
      const pubMedArticle = mapLocalPublicationToPubMed(selectedPub);
      onUseArticle(pubMedArticle, type);
      setSelectedPub(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 animate-fadeIn relative">
        
        {/* Remix Modal / Steps */}
        {selectedPub && (
            <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
                <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp relative">
                    {/* Modal Header */}
                    <div className="p-6 pb-0 relative">
                        <button 
                            onClick={() => setSelectedPub(null)} 
                            className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">Estúdio de Remix</h2>
                        <p className="text-sm text-slate-500 font-medium">Transforme sua publicação científica em conteúdo digital.</p>
                    </div>

                    {/* Content Preview (Step 1) */}
                    <div className="p-6">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Publicação Selecionada</span>
                            <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug mb-1">{selectedPub.titulo}</h3>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{selectedPub.journal}</span>
                                <span>{selectedPub.ano}</span>
                            </div>
                        </div>

                        {/* Actions (Step 2) */}
                        <div className="space-y-3">
                            <button 
                                onClick={() => handleRemix('post')}
                                className="w-full p-4 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-200 transition-all flex items-center gap-4 group active:scale-[0.98]"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                    <Video className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <h4 className="font-bold text-slate-900 text-sm">Criar Post / Social</h4>
                                    <p className="text-[11px] text-slate-500 leading-tight">Transformar em carrossel, story ou roteiro de vídeo para Instagram.</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition-colors" />
                            </button>

                            <button 
                                onClick={() => handleRemix('seo')}
                                className="w-full p-4 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-50 to-cyan-50 hover:border-blue-200 transition-all flex items-center gap-4 group active:scale-[0.98]"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                    <PenTool className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <h4 className="font-bold text-slate-900 text-sm">Reescrever Artigo (SEO)</h4>
                                    <p className="text-[11px] text-slate-500 leading-tight">Adaptar linguagem técnica para pacientes no Blog.</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> A IA usará o título e resumo como base.
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Inline Search & Stats */}
        <div className="px-6 pt-4 pb-2">
            <div className="relative mb-4">
                <input 
                    type="text" 
                    placeholder="Pesquisar artigo..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 flex-shrink-0">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><FileText className="w-3.5 h-3.5" /></div>
                    <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400">Total</p>
                        <p className="font-bold text-slate-900 text-xs">{publicationsData.length}</p>
                    </div>
                </div>
                <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 flex-shrink-0">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Calendar className="w-3.5 h-3.5" /></div>
                    <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400">Recente</p>
                        <p className="font-bold text-slate-900 text-xs">2025</p>
                    </div>
                </div>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
            {filteredPublications.map(pub => (
                <div key={pub.id} className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all duration-300 relative overflow-hidden">
                    <div className="flex justify-between items-start gap-4 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-teal-100">
                                    {pub.journal}
                                </span>
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {pub.ano}
                                </span>
                            </div>
                            
                            <h3 className="text-sm font-bold text-slate-800 mb-2 leading-tight group-hover:text-teal-700 transition-colors">
                                {pub.titulo}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100 w-fit max-w-full">
                                <Users className="w-3 h-3 shrink-0 text-slate-400" />
                                <span className="truncate">{pub.autores.split(',')[0]} et al.</span>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button 
                                    onClick={() => setSelectedPub(pub)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    <Sparkles className="w-3 h-3" /> Reutilizar com IA
                                </button>
                                <a 
                                    href={pub.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" /> Abrir
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {filteredPublications.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhuma publicação encontrada.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default PublicationsList;
