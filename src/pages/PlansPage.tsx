import { motion } from 'framer-motion';
import { Check, X, MessageCircle } from 'lucide-react';
import { PLAN_NAMES, PLAN_PRICES, ALL_PLAN_FEATURES, PLAN_BADGES, PLAN_DESCRIPTIONS } from '@/lib/plan-features';
import { PlanType } from '@/lib/types';

export default function PlansPage() {
  const plans: PlanType[] = ['start', 'pro', 'ultra'];
  const categories = [...new Set(ALL_PLAN_FEATURES.map(f => f.category))];
  const whatsappBase = 'https://api.whatsapp.com/send?phone=5511969169869&text=';

  return (
    <div className="min-h-screen dark bg-[#050505] text-white">
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-[150px] pointer-events-none" style={{ background: '#E50914' }} />

      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-between border-b border-white/5">
        <img src="https://chromotech.com.br/wp-content/uploads/2026/03/Logo-Flixpay-1080-x-300-px.png" alt="FlixPay" className="h-8" />
        <a href="/login" className="text-sm text-white/40 hover:text-white transition-colors">Login →</a>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#E50914]/30 text-[#E50914] text-[10px] font-bold uppercase tracking-[.3em] mb-4">Planos & Preços</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Escolha o Plano<br /><span className="text-[#E50914]">Certo Para Você</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">Do modelo essencial ao premium completo — escale conforme seu negócio crescer.</p>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => {
            const isPro = plan === 'pro';
            return (
              <motion.div key={plan} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                className={`rounded-2xl border p-6 relative flex flex-col ${isPro ? 'border-[#E50914]/40 bg-gradient-to-b from-[#E50914]/10 to-transparent scale-105' : 'border-white/10 bg-white/[.02]'}`}>
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#E50914] rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Mais Popular
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[.3em] text-white/30 mb-1">Plano {String(i + 1).padStart(2, '0')}</p>
                  <h2 className={`text-3xl font-black ${isPro ? 'text-[#E50914]' : ''}`}>{PLAN_NAMES[plan]}</h2>
                  <p className="text-sm text-white/50 mt-1">{PLAN_DESCRIPTIONS[plan]}</p>
                </div>

                {/* Pricing */}
                <div className="space-y-2 mb-6 p-4 rounded-xl bg-white/[.03] border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/50">Implantação</span>
                    <span className="text-lg font-black">R$ {PLAN_PRICES[plan].implantacao.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/50">Mensalidade</span>
                    <span className="text-lg font-black text-[#E50914]">R$ {PLAN_PRICES[plan].mensal}<span className="text-sm text-white/40 font-normal">/mês</span></span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 space-y-6 mb-6">
                  {categories.map(cat => {
                    const features = ALL_PLAN_FEATURES.filter(f => f.category === cat);
                    return (
                      <div key={cat}>
                        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/25 mb-2">{cat}</p>
                        <div className="space-y-1.5">
                          {features.map(f => {
                            const included = f[plan];
                            return (
                              <div key={f.label} className="flex items-center gap-2">
                                {included ? (
                                  <div className="h-4 w-4 rounded-full bg-[#E50914]/20 flex items-center justify-center shrink-0"><Check size={10} className="text-[#E50914]" /></div>
                                ) : (
                                  <div className="h-4 w-4 rounded-full bg-white/5 flex items-center justify-center shrink-0"><X size={10} className="text-white/15" /></div>
                                )}
                                <span className={`text-xs ${included ? 'text-white/80' : 'text-white/20'}`}>{f.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {PLAN_BADGES[plan].map(b => (
                    <span key={b} className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${isPro ? 'border-[#E50914]/30 text-[#E50914]' : 'border-white/10 text-white/40'}`}>{b}</span>
                  ))}
                </div>

                {/* CTA */}
                <a href={`${whatsappBase}${encodeURIComponent(`Olá! Tenho interesse no plano ${PLAN_NAMES[plan]} do FlixPay.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm text-center block transition-all ${
                    isPro ? 'bg-[#E50914] text-white hover:bg-[#C40812] shadow-[0_0_20px_rgba(229,9,20,.3)]' :
                    'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}>
                  {isPro ? 'Escolher Pro' : plan === 'start' ? 'Começar Agora' : 'Escolher Ultra'}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center space-y-4">
        <div className="flex items-center justify-center gap-4 opacity-50">
          <img src="https://rsggroup.com.br/wp-content/uploads/2024/02/L06-3-1.png" alt="RSG Group" className="h-6 brightness-200" />
          <span className="text-white/30">×</span>
          <img src="https://chromotech.com.br/wp-content/uploads/2024/08/Logo-Chromotech-Registrado-Cinza-2.png" alt="Chromotech" className="h-6 brightness-200" />
        </div>
        <p className="text-[10px] uppercase tracking-[.3em] text-white/20">FlixPay é uma tecnologia provida por RSG Group & Chromotech</p>
      </footer>
    </div>
  );
}
