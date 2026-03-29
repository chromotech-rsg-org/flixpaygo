import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, BarChart3, CreditCard, Tv, Palette, Zap, Shield, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { LOGO_FLIXPAY, LOGO_RSG, LOGO_CHROMOTECH } from '@/lib/constants';
import { PLAN_PRICES, PLAN_NAMES, PLAN_DESCRIPTIONS, PLAN_BADGES } from '@/lib/plan-features';
import { PlanType } from '@/lib/types';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const features = [
  { icon: Palette, title: 'Landing Page White-Label', desc: 'Cada tenant recebe sua própria landing page customizada com a identidade visual da marca.' },
  { icon: BarChart3, title: 'Painel de Gestão Inteligente', desc: 'Dashboard completo com métricas, controle de assinantes, faturas e receita em tempo real.' },
  { icon: CreditCard, title: 'Automação Financeira', desc: 'Integração nativa com Asaas para cobranças recorrentes via cartão, boleto e PIX.' },
  { icon: Tv, title: 'Integração com Streaming', desc: 'Conexão direta com sua plataforma de vídeo. Liberação e bloqueio automáticos de acessos.' },
  { icon: Shield, title: 'Multi-Tenant Seguro', desc: 'Cada empresa opera de forma isolada com seus próprios dados, domínio e branding.' },
  { icon: Zap, title: 'Deploy Rápido', desc: 'Implantação completa em dias, não meses. Sua plataforma pronta para faturar.' },
];

const plans: PlanType[] = ['start', 'pro', 'ultra'];

export default function FlixPayLandingPage() {
  const whatsappLink = `https://api.whatsapp.com/send?phone=5511969169869&text=${encodeURIComponent('Olá! Gostaria de conhecer mais sobre o FlixPay para minha empresa de streaming.')}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Ambient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.06] blur-[180px] pointer-events-none" style={{ background: '#E50914' }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <img src={LOGO_FLIXPAY} alt="FlixPay" className="h-7" />
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors hidden md:inline">Funcionalidades</a>
          <a href="#planos" className="text-sm text-white/50 hover:text-white transition-colors hidden md:inline">Planos</a>
          <Link to="/login" className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#E50914] hover:bg-[#C40812] transition-all shadow-[0_0_15px_rgba(229,9,20,.25)]">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 md:py-36">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#E50914]/20 bg-[#E50914]/10 text-[#E50914] text-[10px] font-bold uppercase tracking-[.3em] mb-8">
              Plataforma SaaS Multi-Tenant
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] mb-6">
              Transforme seu<br />
              <span className="text-[#E50914]">Streaming</span> em<br />
              Negócio Recorrente
            </h1>
            <p className="text-lg text-white/45 max-w-xl mx-auto mb-10 leading-relaxed">
              Gestão completa de assinantes, cobranças automatizadas e landing pages personalizadas — tudo em uma plataforma white-label pronta para escalar.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#E50914] text-white font-black uppercase tracking-wider text-sm rounded-xl hover:bg-[#C40812] transition-all shadow-[0_0_30px_rgba(229,9,20,.3)]">
                <MessageCircle size={18} /> Falar com Especialista
              </a>
              <a href="#planos"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-white font-bold text-sm rounded-xl hover:border-white/20 transition-all">
                Ver Planos <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Tudo que você precisa</h2>
            <p className="text-sm text-white/40 mt-3">Uma solução completa para empresas de streaming e conteúdo digital.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/20 transition-all group">
                <f.icon size={28} className="text-[#E50914] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Escolha o Plano Ideal</h2>
            <p className="text-sm text-white/40 mt-3">Soluções para todos os estágios do seu negócio.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => {
              const isPro = plan === 'pro';
              return (
                <motion.div key={plan} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className={`p-8 rounded-2xl border relative flex flex-col ${isPro ? 'border-[#E50914]/40 bg-[#E50914]/[0.05]' : 'border-white/[0.08] bg-white/[0.02]'}`}>
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E50914] text-white text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Star size={10} /> Mais Popular
                    </div>
                  )}
                  <h3 className="text-xl font-black uppercase">{PLAN_NAMES[plan]}</h3>
                  <p className="text-xs text-white/40 mt-1 mb-6">{PLAN_DESCRIPTIONS[plan]}</p>
                  <div className="mb-6">
                    <p className="text-sm text-white/30">Implantação</p>
                    <p className="text-2xl font-black">R$ {PLAN_PRICES[plan].implantacao.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-white/30">Mensal</p>
                    <p className="text-2xl font-black text-[#E50914]">R$ {PLAN_PRICES[plan].mensal}<span className="text-sm text-white/30 font-normal">/mês</span></p>
                  </div>
                  <div className="flex-1 space-y-2.5 mb-8">
                    {PLAN_BADGES[plan].map(badge => (
                      <div key={badge} className="flex items-center gap-2 text-sm">
                        <Check size={14} className="text-[#E50914]" />
                        <span className="text-white/70">{badge}</span>
                      </div>
                    ))}
                  </div>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                    className={`block w-full py-3.5 rounded-xl text-center font-bold uppercase tracking-wider text-sm transition-all ${isPro ? 'bg-[#E50914] text-white hover:bg-[#C40812]' : 'border border-white/10 text-white hover:border-white/20'}`}>
                    Contratar
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-white/5">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tight">Pronto para começar?</h2>
          <p className="text-white/40">Entre em contato e tenha sua plataforma de streaming funcionando em poucos dias.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white font-black uppercase tracking-wider text-sm rounded-2xl hover:bg-[#1da851] transition-all shadow-[0_0_40px_rgba(37,211,102,.2)]">
            <MessageCircle size={20} /> Falar pelo WhatsApp
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center space-y-4">
        <img src={LOGO_FLIXPAY} alt="FlixPay" className="h-6 mx-auto opacity-60" />
        <div className="flex items-center justify-center gap-5">
          <img src={LOGO_RSG} alt="RSG Group" className="h-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <span className="text-white/10 text-xs">×</span>
          <img src={LOGO_CHROMOTECH} alt="Chromotech" className="h-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
        </div>
        <p className="text-[9px] uppercase tracking-[.4em] text-white/15">Uma tecnologia RSG Group & Chromotech</p>
      </footer>
    </div>
  );
}
