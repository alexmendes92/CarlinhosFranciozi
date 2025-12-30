
import React, { useState, useRef } from 'react';
import { generateAppointmentMessage } from '../services/geminiService';
import { Appointment, Tone } from '../types';
import html2canvas from 'html2canvas';
import { 
    User, Send, Sparkles, Check, Copy, Share2, Flame, RefreshCw, Zap,
    Stethoscope, FileText, CalendarCheck, HelpCircle
} from 'lucide-react';

type IntentType = 'surgery' | 'post_op' | 'exam' | 'checkin';

const PatientContentWizard: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [intent, setIntent] = useState<IntentType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const intents = [
      { id: 'surgery', label: 'Agendar Cirurgia', icon: CalendarCheck, color: 'bg-blue-50 text-blue-600', prompt: 'Mensagem para agendar cirurgia. Confirmar data, jejum e local.' },
      { id: 'post_op', label: 'Pós-Operatório', icon: Stethoscope, color: 'bg-green-50 text-green-600', prompt: 'Mensagem de acompanhamento pós-operatório. Perguntar sobre dor e curativo.' },
      { id: 'exam', label: 'Explicar Exame', icon: FileText, color: 'bg-purple-50 text-purple-600', prompt: 'Explicação simplificada de resultado de exame (RM ou RX).' },
      { id: 'checkin', label: 'Retorno/Check-in', icon: HelpCircle, color: 'bg-orange-50 text-orange-600', prompt: 'Mensagem de reativação para paciente sumido ou retorno de rotina.' },
  ];

  const handleGenerate = async (selectedIntent: IntentType) => {
      if (!patientName) {
          alert("Digite o nome do paciente.");
          return;
      }
      setIntent(selectedIntent);
      setIsGenerating(true);
      setGeneratedMessage('');

      const selectedObj = intents.find(i => i.id === selectedIntent);
      
      try {
          // Mock Appointment object just to satisfy the service signature
          const mockApt: Appointment = {
              id: 'temp',
              patientName: patientName,
              date: new Date().toISOString().split('T')[0],
              time: '00:00',
              type: 'first_visit',
              status: 'confirmed',
              phone: patientPhone
          };

          const msg = await generateAppointmentMessage({ 
              appointment: mockApt, 
              tone: Tone.EMPATHETIC,
              customNote: selectedObj?.prompt 
          });
          setGeneratedMessage(msg);
      } catch (e) {
          console.error(e);
          setGeneratedMessage("Erro ao gerar. Tente novamente.");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleShareImage = async () => {
      if (captureRef.current) {
          try {
              const canvas = await html2canvas(captureRef.current, { scale: 2, backgroundColor: '#ffffff' });
              canvas.toBlob(async (blob) => {
                  if (blob) {
                      const file = new File([blob], 'orientacao.png', { type: 'image/png' });
                      if (navigator.share) {
                          await navigator.share({ files: [file], title: 'Orientação Médica' });
                      } else {
                          const link = document.createElement('a');
                          link.download = 'orientacao.png';
                          link.href = canvas.toDataURL();
                          link.click();
                      }
                  }
              });
          } catch (e) { alert("Erro ao criar imagem."); }
      }
  };

  const reset = () => {
      setIntent(null);
      setGeneratedMessage('');
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col pb-24 lg:pb-0 animate-fadeIn">
        
        {/* Simple Header */}
        <div className="px-6 pt-6 pb-4 bg-white border-b border-slate-100">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                Comunicador Rápido
            </h1>
            <p className="text-xs text-slate-500 font-medium">Envie mensagens e orientações em segundos.</p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            <div className="max-w-md mx-auto space-y-6">
                
                {/* 1. Patient Input */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Paciente</label>
                        <input 
                            type="text" 
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="Nome Completo"
                            className="w-full font-bold text-slate-900 outline-none placeholder:text-slate-300 bg-transparent"
                        />
                    </div>
                </div>

                {/* 2. Action Grid (Visible if no message generated) */}
                {!generatedMessage && !isGenerating && (
                    <div className="animate-slideUp">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3 ml-1">O que deseja comunicar?</label>
                        <div className="grid grid-cols-2 gap-3">
                            {intents.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleGenerate(item.id as IntentType)}
                                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all text-left flex flex-col gap-3 group active:scale-95"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm leading-tight">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isGenerating && (
                    <div className="py-12 text-center animate-pulse">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                        <p className="font-bold text-slate-900">Escrevendo mensagem...</p>
                        <p className="text-xs text-slate-500">Personalizando para {patientName}</p>
                    </div>
                )}

                {/* 3. Result Area */}
                {generatedMessage && (
                    <div className="animate-scaleIn space-y-4">
                        
                        {/* Capture Card */}
                        <div ref={captureRef} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden">
                            {/* Brand Header */}
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50">
                                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                                    <Flame className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">Dr. Carlos Franciozi</h3>
                                    <p className="text-[10px] text-slate-400 font-bold">Ortopedia Especializada</p>
                                </div>
                            </div>
                            
                            {/* Message Body */}
                            <textarea 
                                value={generatedMessage}
                                onChange={(e) => setGeneratedMessage(e.target.value)}
                                className="w-full h-48 resize-none outline-none text-slate-600 font-medium text-sm leading-relaxed bg-transparent"
                            />

                            {/* Footer */}
                            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center opacity-50">
                                <span className="text-[9px] font-bold uppercase">CRM 111501</span>
                                <span className="text-[9px] font-bold uppercase">seujoelho.com</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button 
                                onClick={handleShareImage}
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95 hover:bg-indigo-700 transition-all"
                            >
                                <Share2 className="w-4 h-4" /> Gerar Imagem
                            </button>
                            <button 
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(generatedMessage)}`, '_blank')}
                                className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 active:scale-95 hover:brightness-105 transition-all"
                            >
                                <Send className="w-4 h-4" /> WhatsApp
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={handleCopy}
                                className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 hover:bg-slate-50 transition-all"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} Copiar Texto
                            </button>
                            <button 
                                onClick={reset}
                                className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 hover:bg-slate-50 transition-all"
                            >
                                <RefreshCw className="w-4 h-4" /> Novo
                            </button>
                        </div>

                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default PatientContentWizard;
