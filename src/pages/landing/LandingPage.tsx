import { useParams, Link } from 'react-router-dom';
import { getTenantBySlug, getPlans } from '@/lib/storage';
import { PLAN_FEATURES } from '@/lib/plan-features';
import { PlanType } from '@/lib/types';
import { useTenantMeta } from '@/hooks/useTenantMeta';
import { motion } from 'framer-motion';
import { Check, Play, Star, MessageCircle, ChevronDown, ChevronUp, Sun, Moon, Tv, Zap, Shield, MonitorPlay } from 'lucide-react';
import { useState } from 'react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function LandingPage() {
  const { slug } = useParams();
  const tenant = slug ? getTenantBySlug(slug) : null;
  const [isDarkLocal, setIsDarkLocal] = useState<boolean | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  useTenantMeta(tenant, undefined);

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
  const canToggle = features.landingDarkLightToggle;
  const hasAdvanced = features.landingAdvancedSections;

  const whatsappLink = `https://api.whatsapp.com/send?phone=5511969169869&text=${encodeURIComponent(`Olá! Tenho interesse no ${tenant.name}.`)}`;

  const heroSlides = tenant.theme.heroSlides?.length ? tenant.theme.heroSlides : [
    { image: tenant.theme.heroImage || '', title: tenant.theme.heroTitle || tenant.name, subtitle: tenant.theme.heroSubtitle || 'Seu streaming favorito, quando e onde quiser.', ctaText: tenant.theme.heroCtaText || 'Assine Agora', ctaLink: `/${slug}/assinar` },
  ];

  const contentCategories = tenant.theme.contentCategories?.length ? tenant.theme.contentCategories : [
    { title: 'Em Alta', items: [
      { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=170&fit=crop', title: 'Ação & Aventura' },
      { image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=170&fit=crop', title: 'Drama' },
      { image: 'https://images.unsplash.com/photo-1518676590747-1e3dcf5a04be?w=300&h=170&fit=crop', title: 'Comédia' },
      { image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=170&fit=crop', title: 'Documentários' },
      { image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=170&fit=crop', title: 'Terror' },
    ]},
    { title: 'Novidades', items: [
      { image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=170&fit=crop', title: 'Séries Originais' },
      { image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=170&fit=crop', title: 'Lançamentos' },
      { image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=170&fit=crop', title: 'Infantil' },
      { image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=300&h=170&fit=crop', title: 'Esportes' },
    ]},
  ];

  const featureHighlights = tenant.theme.featureHighlights?.length ? tenant.theme.featureHighlights : [
    { icon: 'tv', title: 'Multi-Dispositivo', description: 'Smart TV, celular, tablet e computador.' },
    { icon: 'zap', title: 'Streaming HD/4K', description: 'Qualidade cinematográfica sem travamentos.' },
    { icon: 'shield', title: '100% Seguro', description: 'Pagamento criptografado e dados protegidos.' },
    { icon: 'monitor', title: 'Conteúdo Exclusivo', description: 'Títulos que só você encontra aqui.' },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    tv: <Tv size={24} style={{ color: pc }} />,
    zap: <Zap size={24} style={{ color: pc }} />,
    shield: <Shield size={24} style={{ color: pc }} />,
    monitor: <MonitorPlay size={24} style={{ color: pc }} />,
  };

  const faqs = [
    { q: 'Como funciona o pagamento?', a: 'Aceitamos cartão de crédito, boleto bancário e PIX. A cobrança é automática e recorrente.' },
    { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura quando quiser, sem multas ou taxas adicionais.' },
    { q: 'Em quantos dispositivos posso assistir?', a: 'Depende do seu plano. Consulte os detalhes de cada plano para saber o número de telas simultâneas.' },
    { q: 'Como acesso o conteúdo?', a: 'Após a assinatura, você recebe acesso imediato à plataforma de streaming com login e senha.' },
  ];

  const testimonials = [
    { name: 'Maria S.', text: 'Melhor plataforma de streaming que já usei! Conteúdo incrível.', rating: 5 },
    { name: 'Carlos R.', text: 'O suporte é excelente e a qualidade do streaming é impecável.', rating: 5 },
    { name: 'Ana P.', text: 'Variedade de conteúdo surpreendente. Vale muito a pena!', rating: 5 },
  ];

  const currentSlide = heroSlides[heroSlide % heroSlides.length];

  return (
    <div style={{ background: bg, color: fg, fontFamily: 'Inter, sans-serif' }} className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: borderC, background: isDark ? 'rgba(5,5,5,0.9)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          {tenant.logoUrl ? <img src={tenant.logoUrl} alt={tenant.name} className="h-8" /> : <span className="font-black text-xl" style={{ color: pc }}>{tenant.name}</span>}
        </div>
        <div className="flex items-center gap-4">
          <a href="#planos" className="text-sm font-semibold" style={{ color: muted }}>Planos</a>
          {hasAdvanced && <a href="#conteudo" className="text-sm font-semibold hidden md:inline" style={{ color: muted }}>Conteúdo</a>}
          {hasAdvanced && <a href="#faq" className="text-sm font-semibold hidden md:inline" style={{ color: muted }}>FAQ</a>}
          {tenant.dominio.streamingPortalUrl && (
            <a href={tenant.dominio.streamingPortalUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold flex items-center gap-1" style={{ color: muted }}>
              <Play size={12} /> Acessar
            </a>
          )}
          {canToggle && (
            <button onClick={() => setIsDarkLocal(!isDark)} className="p-2 rounded-lg" style={{ color: muted }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <Link to={`/${slug}/login`} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: pc }}>Login</Link>
        </div>
      </nav>

      {/* Hero — Streaming style with large background */}
      <section className="relative min-h-[85vh] flex items-end pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${bg}, transparent 60%)` }} />
        {currentSlide.image && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentSlide.image})`, opacity: 0.4 }} />}
        <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at bottom left, ${pc}40, transparent 60%)` }} />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative max-w-3xl z-10">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-4">{currentSlide.title}</h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl" style={{ color: muted }}>{currentSlide.subtitle}</p>
          <div className="flex items-center gap-4">
            <Link to={currentSlide.ctaLink || `/${slug}/assinar`} className="px-8 py-4 rounded-xl text-white font-black uppercase tracking-wider text-sm inline-flex items-center gap-2"
              style={{ background: pc, boxShadow: `0 0 30px ${pc}40` }}>
              {currentSlide.ctaText}
            </Link>
            {tenant.dominio.streamingPortalUrl && (
              <a href={tenant.dominio.streamingPortalUrl} target="_blank" className="flex items-center gap-2 px-6 py-4 rounded-xl border font-semibold text-sm" style={{ borderColor: borderC }}>
                <Play size={16} /> Acessar Streaming
              </a>
            )}
          </div>
          {heroSlides.length > 1 && (
            <div className="flex gap-2 mt-6">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setHeroSlide(i)} className="h-1.5 rounded-full transition-all" style={{ width: i === heroSlide % heroSlides.length ? 32 : 12, background: i === heroSlide % heroSlides.length ? pc : `${muted}` }} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section className="px-6 py-16 border-t" style={{ borderColor: borderC }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {featureHighlights.map((fh, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl border" style={{ borderColor: borderC, background: cardBg }}>
              <div className="h-14 w-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${pc}12` }}>
                {iconMap[fh.icon] || <Tv size={24} style={{ color: pc }} />}
              </div>
              <h3 className="font-bold text-sm mb-1">{fh.title}</h3>
              <p className="text-xs" style={{ color: muted }}>{fh.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Content Preview — Streaming catalog style */}
      {hasAdvanced && (
        <section id="conteudo" className="px-6 py-16 border-t" style={{ borderColor: borderC }}>
          <div className="max-w-6xl mx-auto space-y-12">
            {contentCategories.map((cat, ci) => (
              <div key={ci}>
                <motion.h2 {...fadeUp} className="text-2xl font-black mb-6">{cat.title}</motion.h2>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                  {cat.items.map((item, ii) => (
                    <motion.div key={ii} {...fadeUp} transition={{ delay: ii * 0.05 }}
                      className="shrink-0 w-64 group cursor-pointer">
                      <div className="relative rounded-xl overflow-hidden mb-2" style={{ aspectRatio: '16/9' }}>
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: pc }}>
                            <Play size={20} className="text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold truncate">{item.title}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
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
                className="rounded-2xl border p-6 flex flex-col relative"
                style={{ borderColor: plan.highlight ? `${pc}60` : borderC, background: plan.highlight ? `${pc}08` : cardBg }}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ background: pc }}>
                    <Star size={10} /> Mais Popular
                  </div>
                )}
                <h3 className="text-xl font-black">{plan.name}</h3>
                <p className="text-sm" style={{ color: muted }}>{plan.description}</p>
                <p className="text-4xl font-black my-4" style={{ color: plan.highlight ? pc : fg }}>
                  R$ {plan.price.toFixed(2)}<span className="text-sm font-normal" style={{ color: muted }}>/mês</span>
                </p>
                <div className="flex-1 space-y-2 mb-6">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-sm"><Check size={14} style={{ color: pc }} />{f}</div>
                  ))}
                </div>
                <Link to={`/${slug}/assinar`} className="w-full py-3 rounded-xl text-center font-bold uppercase tracking-wider text-sm transition-all block"
                  style={{ background: plan.highlight ? pc : 'transparent', color: plan.highlight ? '#fff' : fg, border: plan.highlight ? 'none' : `1px solid ${borderC}` }}>
                  Assinar
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Pro+) */}
      {hasAdvanced && (
        <section className="px-6 py-20 border-t" style={{ borderColor: borderC }}>
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">O que dizem nossos assinantes</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border" style={{ borderColor: borderC, background: cardBg }}>
                  <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill={pc} style={{ color: pc }} />)}</div>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: muted }}>"{t.text}"</p>
                  <p className="font-bold text-sm">{t.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ (Pro+) */}
      {hasAdvanced && (
        <section id="faq" className="px-6 py-20 border-t" style={{ borderColor: borderC }}>
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Perguntas Frequentes</h2>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }} className="rounded-xl border overflow-hidden" style={{ borderColor: borderC, background: cardBg }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-5 flex items-center justify-between text-left font-semibold text-sm">
                    {faq.q}
                    {openFaq === i ? <ChevronUp size={16} style={{ color: muted }} /> : <ChevronDown size={16} style={{ color: muted }} />}
                  </button>
                  {openFaq === i && <div className="px-5 pb-5"><p className="text-sm leading-relaxed" style={{ color: muted }}>{faq.a}</p></div>}
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
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <MessageCircle size={24} />
        </a>
      )}
    </div>
  );
}
