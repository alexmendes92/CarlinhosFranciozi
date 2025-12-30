
import React, { useState } from 'react';
import { 
    User, Search, Plus, Calendar, ChevronRight, Phone, MessageCircle, 
    Activity, FileText, TrendingUp, Clock, MapPin, ArrowLeft, MoreHorizontal,
    Bone, AlertCircle, CheckCircle2, Sliders
} from 'lucide-react';
import PatientContentWizard from './PatientContentWizard';
import PatientJourney from './PatientJourney';

// Mock Data
const MOCK_PATIENTS = [
    { 
        id: '1', name: 'Ana Clara Souza', age: 28, 
        surgery: 'LCA + Menisco', date: '2024-10-15', 
        status: 'Pós-Op Recente', statusColor: 'bg-blue-100 text-blue-700',
        phone: '11999999999', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        stats: { pain: 3, flexion: 90, extension: 0 }
    },
    { 
        id: '2', name: 'Roberto Mendes', age: 45, 
        surgery: 'Artroplastia Total (ATJ)', date: '2024-09-01', 
        status: 'Reabilitação', statusColor: 'bg-purple-100 text-purple-700',
        phone: '11988888888', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        stats: { pain: 1, flexion: 110, extension: 0 }
    },
    { 
        id: '3', name: 'Fernanda Oliveira', age: 32, 
        surgery: 'Manguito Rotador', date: '2024-10-20', 
        status: 'Imobilizado', statusColor: 'bg-orange-100 text-orange-700',
        phone: '11977777777', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        stats: { pain: 5, flexion: 45, extension: 0 }
    },
];

const PatientManager: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<typeof MOCK_PATIENTS[0] | null>(null);
  const [view, setView] = useState<'details' | 'journey' | 'message'>('details');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = MOCK_PATIENTS.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.surgery.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- SUB-COMPONENTS FOR CLEANLINESS ---

  const PatientList = () => (
      <div className="animate-fadeIn space-y-4 p-6 pb-32">
          {/* Header & Search */}
          <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-end">
                  <div>
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Meus Pacientes</h1>
                      <p className="text-sm text-slate-500 font-medium">{MOCK_PATIENTS.length} ativos</p>
                  </div>
                  <button className="bg-slate-900 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-transform">
                      <Plus className="w-5 h-5" />
                  </button>
              </div>
              
              <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                      type="text" 
                      placeholder="Buscar por nome ou cirurgia..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/10 font-medium text-slate-700 shadow-sm"
                  />
              </div>
          </div>

          {/* Cards */}
          <div className="space-y-3">
              {filteredPatients.map(patient => (
                  <div 
                      key={patient.id} 
                      onClick={() => setSelectedPatient(patient)}
                      className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
                  >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <img src={patient.photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-slate-900 truncate text-base">{patient.name}</h3>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${patient.statusColor}`}>
                                  {patient.status}
                              </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-2">
                              <Bone className="w-3.5 h-3.5" /> {patient.surgery}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(patient.date).toLocaleDateString('pt-BR')}</span>
                              <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Dor: {patient.stats.pain}/10</span>
                          </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
              ))}
          </div>
      </div>
  );

  const PatientDetail = () => {
      if (!selectedPatient) return null;

      // Handle internal navigation for tools
      if (view === 'message') {
          return (
              <div className="h-full flex flex-col">
                  <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3">
                      <button onClick={() => setView('details')} className="p-2 hover:bg-slate-50 rounded-full"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
                      <h3 className="font-bold text-slate-900">Nova Mensagem</h3>
                  </div>
                  <div className="flex-1 overflow-hidden">
                      <PatientContentWizard />
                  </div>
              </div>
          );
      }

      if (view === 'journey') {
          return (
              <div className="h-full flex flex-col">
                  <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3">
                      <button onClick={() => setView('details')} className="p-2 hover:bg-slate-50 rounded-full"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
                      <h3 className="font-bold text-slate-900">Jornada do Paciente</h3>
                  </div>
                  <div className="flex-1 overflow-hidden">
                      <PatientJourney />
                  </div>
              </div>
          );
      }

      // Default Detail View
      return (
          <div className="h-full overflow-y-auto no-scrollbar bg-slate-50 pb-24">
              
              {/* Cover / Header */}
              <div className="bg-white pb-6 rounded-b-[3rem] shadow-sm border-b border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 w-full h-32 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                  
                  <div className="px-6 pt-6 relative z-10 flex justify-between items-start text-white">
                      <button onClick={() => setSelectedPatient(null)} className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                      <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                  </div>

                  <div className="px-6 -mt-4 relative z-10 flex flex-col items-center text-center">
                      <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-slate-200 mb-4">
                          <img src={selectedPatient.photo} className="w-full h-full object-cover" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900">{selectedPatient.name}</h2>
                      <p className="text-sm font-bold text-slate-500 mb-4">{selectedPatient.age} anos • {selectedPatient.phone}</p>
                      
                      <div className="flex gap-2 w-full max-w-xs">
                          <button onClick={() => window.open(`https://wa.me/${selectedPatient.phone}`)} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
                              <MessageCircle className="w-4 h-4" /> WhatsApp
                          </button>
                          <button onClick={() => window.open(`tel:${selectedPatient.phone}`)} className="bg-slate-100 text-slate-600 p-3 rounded-2xl hover:bg-slate-200 transition-colors">
                              <Phone className="w-5 h-5" />
                          </button>
                      </div>
                  </div>
              </div>

              <div className="p-6 space-y-6">
                  
                  {/* Status Cards */}
                  <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Pós-Operatório</span>
                          <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-blue-500" />
                              <span className="text-lg font-black text-slate-900">14 Dias</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                              <div className="w-[20%] h-full bg-blue-500 rounded-full"></div>
                          </div>
                      </div>
                      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Próx. Retorno</span>
                          <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-purple-500" />
                              <span className="text-lg font-black text-slate-900">05/Nov</span>
                          </div>
                          <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded mt-2 inline-block">10:00h</span>
                      </div>
                  </div>

                  {/* Clinical Metrics (Mock) */}
                  <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-slate-400" /> Métricas Clínicas
                      </h3>
                      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                          <div>
                              <div className="flex justify-between mb-1">
                                  <span className="text-xs font-bold text-slate-500">Nível de Dor (EVA)</span>
                                  <span className={`text-xs font-black px-2 py-0.5 rounded ${selectedPatient.stats.pain > 4 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{selectedPatient.stats.pain}/10</span>
                              </div>
                              <input type="range" min="0" max="10" value={selectedPatient.stats.pain} readOnly className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                          </div>
                          <div>
                              <div className="flex justify-between mb-1">
                                  <span className="text-xs font-bold text-slate-500">Flexão (ADM)</span>
                                  <span className="text-xs font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{selectedPatient.stats.flexion}°</span>
                              </div>
                              <input type="range" min="0" max="140" value={selectedPatient.stats.flexion} readOnly className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                          </div>
                      </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-slate-400" /> Ferramentas
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                          <button 
                              onClick={() => setView('message')}
                              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-all group active:scale-[0.98]"
                          >
                              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <MessageCircle className="w-5 h-5" />
                              </div>
                              <div className="text-left flex-1">
                                  <span className="font-bold text-slate-900 block text-sm">Criar Mensagem</span>
                                  <span className="text-xs text-slate-400 font-medium">Orientações e lembretes</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                          </button>

                          <button 
                              onClick={() => setView('journey')}
                              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-purple-200 transition-all group active:scale-[0.98]"
                          >
                              <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                  <TrendingUp className="w-5 h-5" />
                              </div>
                              <div className="text-left flex-1">
                                  <span className="font-bold text-slate-900 block text-sm">Jornada & Protocolo</span>
                                  <span className="text-xs text-slate-400 font-medium">Linha do tempo do tratamento</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                          </button>

                          <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-all group active:scale-[0.98]">
                              <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                  <FileText className="w-5 h-5" />
                              </div>
                              <div className="text-left flex-1">
                                  <span className="font-bold text-slate-900 block text-sm">Scores & Laudos</span>
                                  <span className="text-xs text-slate-400 font-medium">IKDC, Lysholm, Termos</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                          </button>
                      </div>
                  </div>

              </div>
          </div>
      );
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
        {!selectedPatient ? <PatientList /> : <PatientDetail />}
    </div>
  );
};

export default PatientManager;
