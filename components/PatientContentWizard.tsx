
import React, { useState } from 'react';
import { generateAppointmentMessage } from '../services/geminiService';
import { Appointment, Tone } from '../types';
import { 
    User, MessageCircle, Send, CheckCircle2, 
    Stethoscope, Calendar, AlertCircle, Sparkles, 
    ArrowRight, Copy, Check, FileText
} from 'lucide-react';

const PatientContentWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.EMPATHETIC);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock Appointment Object for the service function to keep consistency
  const createMockAppointment = (): Appointment => ({
      id: 'temp',
      patientName: patientName,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      type: 'first_visit',
      status: 'confirmed',
      phone: patientPhone
  });

  const handleGenerate = async () => {
      setIsGenerating(true);
      try {
          const msg = await generateAppointmentMessage({ 
              appointment: createMockAppointment(), 
              tone: tone,
              customNote: context 
          });
          setGeneratedMessage(msg);
          setStep(3);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const contexts = [
      { id: 'pre_op', label: 'Pré-Operatório', icon: Calendar, desc: 'Lembretes de jejum e exames.' },
      { id: 'post_op', label: 'Pós-Operatório', icon: Stethoscope, desc: 'Como está a dor? Curativo?' },
      { id: 'exam_result', label: 'Resultado de Exame', icon: FileText, desc: 'Explicação de RM ou RX.' },
      { id: 'birthday', label: 'Aniversário', icon: Sparkles, desc: 'Felicitações e lembrança.' },
  ];

  return (
    <div className="h-full bg-slate-50 flex flex-col pb-24 lg:pb-0 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-100">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Portal do Paciente</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Comunicação direta e humanizada com a IA.</p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            
            {/* STEP 1: Patient Info */}
            {step === 1 && (
                <div className="max-w-lg mx-auto space-y-6 animate-slideUp">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" /> Dados do Paciente
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nome Completo</label>
                                <input 
                                    type="text" 
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-900"
                                    placeholder="Ex: João da Silva"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">WhatsApp (Com DDD)</label>
                                <input 
                                    type="tel" 
                                    value={patientPhone}
                                    onChange={(e) => setPatientPhone(e.target.value)}
                                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-100 font-mono text-slate-700"
                                    placeholder="Ex: 11999999999"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setStep(2)}
                        disabled={!patientName}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        Continuar <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* STEP 2: Context & Generation */}
            {step === 2 && (
                <div className="max-w-lg mx-auto space-y-6 animate-slideUp">
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Qual o motivo da mensagem?</label>
                        <div className="grid grid-cols-2 gap-3">
                            {contexts.map(c => (
                                <button 
                                    key={c.id}
                                    onClick={() => setContext(c.label)}
                                    className={`p-4 rounded-xl border text-left transition-all active:scale-[0.98]
                                    ${context === c.label ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                >
                                    <div className={`p-2 rounded-lg w-fit mb-2 ${context === c.label ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <c.icon className="w-5 h-5" />
                                    </div>
                                    <span className={`block font-bold text-sm ${context === c.label ? 'text-blue-900' : 'text-slate-900'}`}>{c.label}</span>
                                    <span className="text-[10px] text-slate-500">{c.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Instruções Específicas</label>
                        <textarea 
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            className="w-full p-3 bg-slate-50 rounded-xl outline-none text-sm font-medium h-24 resize-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="Ex: Perguntar se o inchaço diminuiu, lembrar de trazer o RX..."
                        />
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !context}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
                    >
                        {isGenerating ? <><Sparkles className="w-5 h-5 animate-spin" /> Escrevendo...</> : <><Sparkles className="w-5 h-5" /> Gerar Mensagem</>}
                    </button>
                </div>
            )}

            {/* STEP 3: Review & Send */}
            {step === 3 && (
                <div className="max-w-lg mx-auto space-y-6 animate-scaleIn">
                    <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-green-900">Mensagem Pronta!</h2>
                        <p className="text-sm text-green-700">Revise antes de enviar para {patientName}.</p>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative group">
                        <textarea 
                            value={generatedMessage}
                            onChange={(e) => setGeneratedMessage(e.target.value)}
                            className="w-full h-48 resize-none outline-none text-slate-600 font-medium leading-relaxed bg-transparent"
                        />
                        <button 
                            onClick={handleCopy}
                            className="absolute top-4 right-4 p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => { setStep(1); setPatientName(''); setPatientPhone(''); setContext(''); }}
                            className="flex-1 bg-white border border-slate-200 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Novo Paciente
                        </button>
                        <button 
                            onClick={() => window.open(`https://wa.me/${patientPhone}?text=${encodeURIComponent(generatedMessage)}`, '_blank')}
                            className="flex-[2] bg-[#25D366] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 hover:brightness-105 transition-all active:scale-95"
                        >
                            <Send className="w-5 h-5" /> Enviar WhatsApp
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default PatientContentWizard;
