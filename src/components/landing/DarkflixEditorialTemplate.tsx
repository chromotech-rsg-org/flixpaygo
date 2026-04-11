import { Link } from 'react-router-dom';
import { Tenant } from '@/lib/types';
import { motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { getPlans } from '@/lib/storage';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } };

interface Props {
  tenant: Tenant;
}

export default function DarkflixEditorialTemplate({ tenant }: Props) {
  const pc = tenant.theme.primaryColor || '#CC272E';
  const slug = tenant.dominio.slug;
  const sections = tenant.theme.editorialSections || [];
  const plans = getPlans(tenant.id).filter(p => p.active);
  const annualPlan = plans.find(p => p.interval === 'yearly') || plans[plans.length - 1];

  const getSection = (type: string) => sections.find(s => s.type === type);
  const manifesto = getSection('manifesto');
  const experience = getSection('experience');
  const filmTypes = getSection('filmTypes');
  const whyRare = getSection('whyRare');
  const catalog = getSection('catalog');
  const audience = getSection('audience');

  return (
    <div className="min-h-screen bg-[#020202] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* ===== HERO ===== */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {tenant.theme.heroImage && (
            <img src={tenant.theme.heroImage} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-[rgba(2,2,2,0.2)]" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2,2,2,0) 40%, #020202 100%)' }} />
        </div>

        {/* Logo */}
        <div className="absolute top-6 left-8 md:left-24 z-10">
          {(tenant.logoHomeUrl || tenant.logoUrl) ? (
            <img src={tenant.logoHomeUrl || tenant.logoUrl} alt={tenant.name} className="h-20 md:h-24 object-contain" />
          ) : (
            <span className="text-2xl font-bold" style={{ color: pc }}>{tenant.name}</span>
          )}
        </div>

        <div className="relative z-10 px-8 md:px-24 max-w-3xl">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{ background: 'linear-gradient(90deg, #E4E4E4 0%, #2F2F2F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1.5px' }}>
            {tenant.theme.heroTitle || 'você não chegou\naqui por acaso.'}
          </motion.h1>
          <motion.p {...fadeUp} className="text-2xl md:text-3xl font-light text-[#E2E2E2] mb-4">
            {tenant.theme.heroSubtitle || 'Mas veio parar aqui.'}
          </motion.p>
          <motion.p {...fadeUp} className="text-base text-white/70 mb-8 max-w-sm leading-relaxed">
            Sabe que não é confortável. E mesmo assim voltou.
          </motion.p>
          <motion.div {...fadeUp}>
            <Link to={`/${slug}/assinar`}
              className="inline-flex items-center gap-2 px-8 py-3 border text-sm uppercase tracking-[2.8px] transition-all hover:bg-white/5"
              style={{ borderColor: `${pc}4D`, color: pc }}>
              {tenant.theme.heroCtaText || 'Acessar agora'}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={20} className="text-white/20" />
        </div>
      </section>

      {/* ===== SEÇÃO 2 — MANIFESTO (Texto esquerda, Imagem direita) ===== */}
      <section className="relative py-20 overflow-hidden">
        {tenant.theme.section2BgImage && (
          <div className="absolute inset-0">
            <img src={tenant.theme.section2BgImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[rgba(2,2,2,0.75)]" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Texto à esquerda */}
            <motion.div {...fadeUp} className="space-y-6">
              <p className="text-sm italic text-white/40" style={{ fontFamily: "'Source Serif 4', serif" }}>
                "se parecer desconfortável, está funcionando."
              </p>
              <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]"
                style={{ background: 'linear-gradient(90deg, #E4E4E4 0%, #7E7E7E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {manifesto?.heading || 'A Darkflix não é um streaming tradicional.'}
              </h2>
              <p className="text-base text-[#a6a6a6cc] leading-relaxed font-light">
                {manifesto?.body || 'É um espaço onde filmes fora do circuito comercial voltam a circular — obras atmosféricas, cultuadas e difíceis de encontrar.\nFilmes que não foram feitos para agradar.\nForam feitos para permanecer.'}
              </p>
              <Link to={`/${slug}/assinar`}
                className="inline-flex items-center px-6 py-3 border text-sm uppercase tracking-[2.8px]"
                style={{ borderColor: `${pc}4D`, color: pc }}>
                ver o que está em exibição
              </Link>
              <p className="text-sm font-bold" style={{ color: 'rgba(169, 0, 0, 0.8)' }}>
                {manifesto?.quote || 'Aviso: este não é um lugar confortável.'}
              </p>
            </motion.div>
            {/* Imagem à direita */}
            <motion.div {...fadeUp}>
              {manifesto?.image ? (
                <img src={manifesto.image} alt="" className="w-full rounded-lg" style={{ boxShadow: '0 0 80px 20px rgba(0,0,0,0.6)' }} />
              ) : (
                <div className="w-full aspect-[4/5] bg-[#111] rounded-lg flex items-center justify-center text-white/20 text-sm">
                  Imagem da seção
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO 3 — EXPERIÊNCIA (Personagem centralizado + texto grande sobreposto) ===== */}
      <section className="relative py-20 overflow-hidden">
        {tenant.theme.section3BgImage && (
          <div className="absolute inset-0">
            <img src={tenant.theme.section3BgImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[rgba(2,2,2,0.5)]" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-8">
          {/* Personagem grande */}
          <motion.div {...fadeUp} className="relative flex justify-center">
            <img src={experience?.image || '/darkflix/zombie-full.png'} alt="" className="max-h-[700px] object-contain relative z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#020202] to-transparent z-20" />
          </motion.div>

          {/* Título grande sobreposto */}
          <motion.div {...fadeUp} className="relative z-30 -mt-40 text-center space-y-6">
            <h2 className="text-5xl md:text-7xl lg:text-[100px] font-bold leading-[0.95]">
              <span style={{ background: 'linear-gradient(90deg, #DADADA 0%, #747474 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                UMA{' '}
              </span>
              <span style={{ color: pc, WebkitTextFillColor: pc }}>
                EXPERIÊNCIA
              </span>
              <br />
              <span style={{ background: 'linear-gradient(90deg, #DADADA 0%, #747474 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                DIFERENTE
              </span>
            </h2>
            <p className="text-base md:text-lg text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              {experience?.body || 'Aqui, o silêncio não é vazio. É parte da narrativa.\nSem fórmulas reconfortantes. Sem trilhas que avisam o susto.\nSem resoluções fáceis. A tensão não explode, ela se instala.\nÉ encontra.'}
            </p>
            <p className="text-sm italic text-white/50" style={{ fontFamily: "'Source Serif 4', serif" }}>
              {experience?.quote || '"Se você gosta de assistir para se distrair na vida,\neste lugar não foi feito para você."'}
            </p>
          </motion.div>

          {/* Faixa de thumbnails de filmes */}
          <motion.div {...fadeUp} className="mt-16 flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[100px] h-[140px] rounded-lg overflow-hidden bg-[#1a1a1a]">
                <div className="w-full h-full bg-gradient-to-b from-[#2a1a1a] to-[#0a0a0a]" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SEÇÃO 4 — TIPOS DE FILMES (Personagem atrás, título esquerda, bullets direita) ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* Imagem de fundo do personagem (clown/scary) */}
        {filmTypes?.image && (
          <div className="absolute inset-0">
            <img src={filmTypes.image} alt="" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-[rgba(2,2,2,0.65)]" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2,2,2,0.9) 0%, rgba(2,2,2,0.4) 40%, rgba(2,2,2,0.9) 100%)' }} />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-8 md:px-16">
          <motion.p {...fadeUp} className="text-sm italic text-white/40 mb-6" style={{ fontFamily: "'Source Serif 4', serif" }}>
            "alguns filmes não terminam quando os créditos sobem."
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Título grande à esquerda */}
            <motion.div {...fadeUp}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05]"
                style={{ background: 'linear-gradient(90deg, #DADADA 0%, #747474 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {filmTypes?.heading || 'TIPOS DE FILMES\nQUE  VOCÊ\nENCONTRA'}
              </h2>
            </motion.div>

            {/* Bullet points à direita */}
            <motion.div {...fadeUp}>
              <ul className="space-y-4 text-base md:text-lg font-light text-white/90">
                {(filmTypes?.bulletPoints || [
                  '• Terror psicológico e atmosférico',
                  '• Cults europeus dos anos 60, 70 e 80',
                  '• Horror asiático ou body horror',
                  '• Produções independentes difíceis de encontrar',
                  '• Obras restauradas e redescobertas',
                  '• Filmes estranhos demais para o circuito comercial',
                ]).map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO 5 — ATMOSFERA + "POR QUE NÃO ENCONTRA" ===== */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          {/* Frase de transição */}
          <motion.p {...fadeUp} className="text-base text-white/60 text-center mb-16">
            Não é sobre sustos fáceis. É sobre atmosfera.
          </motion.p>

          {/* Título POR QUE NÃO ENCONTRA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div />
            <motion.div {...fadeUp}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                style={{ background: 'linear-gradient(270deg, #DADADA 14%, #454545 104%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {whyRare?.heading || 'POR QUE VOCÊ NÃO\nENCONTRA ESSES FILMES\nFACILMENTE'}
              </h2>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO 6 — PERSONAGEM CLOWN GRANDE ===== */}
      <section className="relative py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative">
          <motion.div {...fadeUp} className="flex justify-center">
            <img src={whyRare?.image || catalog?.image || '/darkflix/demon-clown.png'} alt=""
              className="max-h-[700px] object-contain" />
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#020202] to-transparent" />
        </div>
      </section>

      {/* ===== SEÇÃO 7 — DARK BANNER QUOTE ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          {audience?.image && (
            <>
              <img src={audience.image} alt="" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-[rgba(2,2,2,0.6)]" />
            </>
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #020202 0%, rgba(2,2,2,0) 30%, rgba(2,2,2,0) 70%, #020202 100%)' }} />
        </div>
        <div className="relative z-10 text-center">
          <motion.p {...fadeUp} className="text-sm italic text-white/20" style={{ fontFamily: "'Source Serif 4', serif" }}>
            "nem todo medo precisa fazer barulho."
          </motion.p>
        </div>
      </section>

      {/* ===== SEÇÃO 8 — CATÁLOGO EM MOVIMENTO (Card escuro) ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="relative rounded-[43px] overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)' }}>
            <div className="p-10 md:p-14 flex flex-col md:flex-row items-start justify-between gap-10">
              <motion.div {...fadeUp} className="flex-1 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold"
                  style={{ background: 'linear-gradient(0deg, #DADADA, #DADADA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {catalog?.heading || 'UM CATÁLOGO EM\nMOVIMENTO'}
                </h2>
                <p className="text-base text-white/60 leading-relaxed">
                  O catálogo não é estático.
                </p>
                <Link to={`/${slug}/assinar`}
                  className="inline-flex items-center px-6 py-2 text-sm uppercase tracking-[2px]"
                  style={{ color: pc }}>
                  Assine agora →
                </Link>
              </motion.div>
              <motion.div {...fadeUp} className="flex-1 space-y-4">
                <p className="text-sm text-white/40">Outros saem.</p>
                <p className="text-base font-medium" style={{ color: pc }}>
                  Raridades retornam.
                </p>
                <p className="text-base text-white/80 leading-relaxed">
                  Novas descobertas entram.
                </p>
                <p className="text-base text-white/80 leading-relaxed">
                  {catalog?.body || 'Você nunca verá exatamente o mesmo catálogo duas vezes.'}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARA QUEM FAZ SENTIDO ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row gap-12">
          <motion.div {...fadeUp} className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold"
              style={{ background: 'linear-gradient(90deg, #DADADA 0%, #747474 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PARA QUEM FAZ SENTIDO
            </h2>
            <p className="text-lg font-bold text-white/80 leading-relaxed">
              Para quem gosta de encontrar o que não estava procurando. quem prefere atmosfera ao excesso. quem sente curiosidade pelo estranho. Para quem acredita que o cinema ainda pode surpreender.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="flex-1 flex items-center">
            <p className="text-xl font-medium leading-relaxed" style={{ color: 'rgba(188, 0, 0, 0.8)' }}>
              Não é para todos. talvez não seja para você. (e tudo bem.) Algumas pessoas assistem um filme e esquecem. outras são lembradas por ele.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-8 md:px-16 mt-8">
          <p className="text-sm" style={{ color: 'rgba(207, 0, 0, 0.8)' }}>
            Alguns espectadores desligam na metade. outros não dormem depois.
          </p>
        </div>
      </section>

      {/* ===== PLANO ANUAL ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/darkflix/plan-bg.png" alt="" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto px-8 text-center">
          <motion.h2 {...fadeUp} className="text-5xl md:text-6xl font-normal uppercase tracking-[3.6px] mb-12"
            style={{ fontFamily: "'JetBrains Mono', monospace", background: `linear-gradient(91deg, ${pc} 0.6%, #661317 72%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PLANO ANUAL
          </motion.h2>

          <motion.div {...fadeUp}
            className="p-8 rounded-[25px] text-left"
            style={{ background: 'linear-gradient(180deg, rgba(11,11,11,0.6) 0%, rgba(20,0,0,0.6) 100%)' }}>
            <h3 className="text-2xl font-medium text-white/60 mb-4">
              acesso contínuo ao acervo em circulação
            </h3>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm text-[#928C8C] font-light">por</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-sm text-[#ACACAC] line-through">De R$ 109,90</span>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-light" style={{ color: pc }}>
                R$ {annualPlan ? annualPlan.price.toFixed(2) : '99,90'}
              </span>
              <span className="text-sm" style={{ color: pc }}>/ ano</span>
            </div>

            <div className="space-y-3 mb-8">
              {(annualPlan?.features || ['acesso completo', 'títulos em rotação constante', 'raridades difíceis de encontrar', 'experiência sem anúncios']).map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check size={16} style={{ color: `${pc}99` }} />
                  <span className="text-sm text-[#E4E4E4] font-light">{f}</span>
                </div>
              ))}
            </div>

            <Link to={`/${slug}/assinar`}
              className="block w-full text-center py-3 border text-sm uppercase tracking-[2.8px] transition-all hover:bg-white/5"
              style={{ borderColor: `${pc}66`, color: pc }}>
              assinar agora
            </Link>
          </motion.div>

          {/* Side effects */}
          <motion.div {...fadeUp} className="mt-12 text-left">
            <p className="text-base font-normal italic mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              * efeitos colaterais relatados:
            </p>
            <div className="space-y-1">
              {['noites silenciosas demais', 'obsessão por diretores obscuros', 'desconfiança de trilhas sonoras alegres', 'incapacidade de voltar ao "normal"'].map((effect, i) => (
                <p key={i} className="text-xs italic text-[#AEAEAE]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {effect}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== QUOTE FINAL ===== */}
      <section className="py-16 text-center">
        <p className="text-xs italic" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(99,99,99,0.2)' }}>
          "não recomendamos assistir sozinho. nem acompanhado."
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 flex justify-center">
        {(tenant.logoFooterUrl || tenant.logoUrl) ? (
          <img src={tenant.logoFooterUrl || tenant.logoUrl} alt={tenant.name} className="h-20 object-contain opacity-80" />
        ) : (
          <span className="text-3xl font-bold" style={{ color: pc }}>{tenant.name}</span>
        )}
      </footer>
    </div>
  );
}
