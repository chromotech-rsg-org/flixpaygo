import { useParams } from 'react-router-dom';
import { getTenants, getPlans } from '@/lib/storage';
import { PLAN_FEATURES } from '@/lib/plan-features';
import { PlanType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Check, Play, Star, MessageCircle, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function LandingPage() {
  const { slug } = useParams();
  const tenants = getTenants();
  const tenant = tenants.find(t => t.dominio.slug === slug);
  const [isDarkLocal, setIsDarkLocal] = useState<boolean | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!tenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black">Streaming não encontrado</h1>
          <p className="text-muted-foreground mt-2">Verifique o endereço e tente novamente.</p>
        </div>
      </div>
    );
  }

  const plan = tenant.plano as PlanType;
  const features = PLAN_FEATURES[plan];
  const plans = getPlans(tenant.id).filter(p => p.active);
  const pc = tenant.theme.primaryColor;
  const ac = tenant.theme.accentColor;
  const isDark = isDarkLocal !== null ? isDarkLocal : tenant.theme.mode === 'dark';
  const bg = isDark ? '#050505' : '#ffffff';
  const fg = isDark ? '#ffffff' : '#09090b';
  const muted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const borderC = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const template = tenant.theme.template;
  const canToggle = features.landingDarkLightToggle;
  const hasAdvanced = features.landingAdvancedSections;

  const whatsappLink = `https://api.whatsapp.com/send?phone=5511969169869&text=${encodeURIComponent(`Olá! Tenho interesse no ${tenant.name}.`)}`;

  // FAQ data
  const faqs = [
    { q: 'Como funciona o pagamento?', a: 'Aceitamos cartão de crédito, boleto bancário e PIX. A cobrança é automática e recorrente.' },
    { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura quando quiser, sem multas ou taxas adicionais.' },
    { q: 'Em quantos dispositivos posso assistir?', a: 'Depende do seu plano. Consulte os detalhes de cada plano para saber o número de telas simultâneas.' },
    { q: 'Como acesso o conteúdo?', a: 'Após a assinatura, você recebe acesso imediato à plataforma de streaming com login e senha.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    { name: 'Maria S.', text: 'Melhor plataforma de streaming que já usei! Conteúdo incrível e interface fácil de usar.', rating: 5 },
    { name: 'Carlos R.', text: 'O suporte é excelente e a qualidade do streaming é impecável. Recomendo!', rating: 5 },
    { name: 'Ana P.', text: 'Variedade de conteúdo surpreendente. Vale muito a pena cada centavo investido.', rating: 5 },
  ];

  const benefits = [
    { title: 'Conteúdo Exclusivo', desc: 'Acesso a títulos que você não encontra em nenhuma outra plataforma.' },
    { title: 'Qualidade Premium', desc: 'Streaming em alta definição com tecnologia de última geração.' },
    { title: 'Multi-Dispositivo', desc: 'Assista no celular, tablet, smart TV ou computador.' },
    { title: 'Sem Anúncios', desc: 'Experiência limpa e ininterrupta, sem propagandas.' },
  ];

  return (
    <div style={{ background: bg, color: fg, fontFamily: 'Inter, sans-serif' }} className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: borderC, background: isDark ? 'rgba(5,5,5,0.8)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.name} className="h-8" />
          ) : (
            <span className="font-black text-xl" style={{ color: pc }}>{tenant.name}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <a href="#planos" className="text-sm font-semibold" style={{ color: muted }}>Planos</a>
          {hasAdvanced && <a href="#beneficios" className="text-sm font-semibold hidden md:inline" style={{ color: muted }}>Benefícios</a>}
          {hasAdvanced && <a href="#faq" className="text-sm font-semibold hidden md:inline" style={{ color: muted }}>FAQ</a>}
          {tenant.dominio.streamingPortalUrl && (
            <a href={tenant.dominio.streamingPortalUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold" style={{ color: muted }}>Acessar</a>
          )}
          {canToggle && (
            <button onClick={() => setIsDarkLocal(!isDark)} className="p-2 rounded-lg transition-colors" style={{ color: muted }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <a href={slug ? `/${slug}/login` : '/login'} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: pc }}>Login</a>
        </div>
      </nav>

      {/* Hero */}
      {template === 'cinema-dark' && (
        <section className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at center, ${pc}, transparent 70%)` }} />
          {tenant.theme.heroImage && <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${tenant.theme.heroImage})` }} />}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative text-center max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-6">
              {tenant.theme.heroTitle || tenant.name}
            </h1>
            <p className="text-lg md:text-xl mb-8" style={{ color: muted }}>
              {tenant.theme.heroSubtitle || 'Seu streaming favorito, quando e onde quiser.'}
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="#planos" className="px-8 py-4 rounded-xl text-white font-black uppercase tracking-wider text-sm" style={{ background: pc, boxShadow: `0 0 30px ${pc}40` }}>
                {tenant.theme.heroCtaText || 'Assine Agora'}
              </a>
              {tenant.dominio.streamingPortalUrl && (
                <a href={tenant.dominio.streamingPortalUrl} target="_blank" className="flex items-center gap-2 px-6 py-4 rounded-xl border font-semibold text-sm" style={{ borderColor: borderC }}>
                  <Play size={16} /> Acessar Streaming
                </a>
              )}
            </div>
          </motion.div>
        </section>
      )}

      {template === 'gradient-flow' && (
        <section className="min-h-[80vh] flex items-center px-6" style={{ background: `linear-gradient(135deg, ${pc}20, ${bg})` }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-none mb-6">
                {tenant.theme.heroTitle || tenant.name}
              </h1>
              <p className="text-lg mb-8" style={{ color: muted }}>
                {tenant.theme.heroSubtitle || 'O melhor conteúdo na sua tela.'}
              </p>
              <a href="#planos" className="inline-block px-8 py-4 rounded-xl text-white font-black uppercase text-sm" style={{ background: `linear-gradient(135deg, ${pc}, ${ac})` }}>
                {tenant.theme.heroCtaText || 'Comece agora'}
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block">
              <div className="rounded-2xl border p-8 text-center" style={{ borderColor: borderC, background: cardBg }}>
                <Play size={64} className="mx-auto mb-4" style={{ color: pc }} />
                <p className="font-bold text-lg">{tenant.name}</p>
                <p className="text-sm" style={{ color: muted }}>Sua plataforma de streaming</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {template === 'minimal-premium' && (
        <section className="min-h-[70vh] flex items-center px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-none mb-6" style={{ color: pc }}>
                {tenant.theme.heroTitle || tenant.name}
              </h1>
              <p className="text-xl max-w-lg mb-8" style={{ color: muted }}>
                {tenant.theme.heroSubtitle || 'Entretenimento de qualidade.'}
              </p>
              <a href="#planos" className="inline-block px-8 py-4 rounded-xl text-white font-black uppercase text-sm" style={{ background: pc }}>
                {tenant.theme.heroCtaText || 'Ver planos'}
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Benefits Section (Pro+) */}
      {hasAdvanced && (
        <section id="beneficios" className="px-6 py-20 border-t" style={{ borderColor: borderC }}>
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Por que nos escolher?</h2>
              <p className="mt-3" style={{ color: muted }}>Vantagens exclusivas para nossos assinantes</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border text-center" style={{ borderColor: borderC, background: cardBg }}>
                  <div className="h-12 w-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${pc}15` }}>
                    <Check size={20} style={{ color: pc }} />
                  </div>
                  <h3 className="font-bold mb-2">{b.title}</h3>
                  <p className="text-sm" style={{ color: muted }}>{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plans Section */}
      <section id="planos" className="px-6 py-20 border-t" style={{ borderColor: borderC }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Escolha seu Plano</h2>
            <p className="mt-3" style={{ color: muted }}>Comece a assistir agora mesmo</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.id} {...fadeUp} transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-6 flex flex-col relative`}
                style={{
                  borderColor: plan.highlight ? `${pc}60` : borderC,
                  background: plan.highlight ? `${pc}08` : cardBg,
                }}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ background: pc }}>
                    <Star size={10} /> Mais Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-black">{plan.name}</h3>
                  <p className="text-sm" style={{ color: muted }}>{plan.description}</p>
                </div>
                <p className="text-4xl font-black mb-6" style={{ color: plan.highlight ? pc : fg }}>
                  R$ {plan.price.toFixed(2)}
                  <span className="text-sm font-normal" style={{ color: muted }}>/mês</span>
                </p>
                <div className="flex-1 space-y-2 mb-6">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-sm">
                      <Check size={14} style={{ color: pc }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#" className="w-full py-3 rounded-xl text-center font-bold uppercase tracking-wider text-sm transition-all block"
                  style={{
                    background: plan.highlight ? pc : 'transparent',
                    color: plan.highlight ? '#fff' : fg,
                    border: plan.highlight ? 'none' : `1px solid ${borderC}`,
                  }}>
                  Assinar
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Pro+) */}
      {hasAdvanced && (
        <section className="px-6 py-20 border-t" style={{ borderColor: borderC }}>
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">O que dizem nossos assinantes</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border" style={{ borderColor: borderC, background: cardBg }}>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} fill={pc} style={{ color: pc }} />
                    ))}
                  </div>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: muted }}>"{t.text}"</p>
                  <p className="font-bold text-sm">{t.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section (Pro+) */}
      {hasAdvanced && (
        <section id="faq" className="px-6 py-20 border-t" style={{ borderColor: borderC }}>
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Perguntas Frequentes</h2>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border overflow-hidden" style={{ borderColor: borderC, background: cardBg }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left font-semibold text-sm">
                    {faq.q}
                    {openFaq === i ? <ChevronUp size={16} style={{ color: muted }} /> : <ChevronDown size={16} style={{ color: muted }} />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm leading-relaxed" style={{ color: muted }}>{faq.a}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-center space-y-3" style={{ borderColor: borderC }}>
        <p className="text-sm font-semibold">{tenant.name}</p>
        <p className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Powered by FlixPay — RSG Group & Chromotech</p>
      </footer>

      {/* WhatsApp Float (Pro+) */}
      {hasAdvanced && (
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Fale conosco no WhatsApp">
          <MessageCircle size={24} />
        </a>
      )}
    </div>
  );
}
