import { Link } from 'react-router-dom';
import { Tenant } from '@/lib/types';
import { motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { getPlans } from '@/lib/storage';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } };

interface Props {
  tenant: Tenant;
}

export default function DarkflixEditorialTemplateV2({ tenant }: Props) {
  const pc = tenant.theme.primaryColor || '#E50914';
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
    <div className="min-h-screen bg-[#050505] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background: blurred movie posters grid */}
        <div className="absolute inset-0">
          {tenant.theme.heroImage && (
            <img src={tenant.theme.heroImage} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-[rgba(5,5,5,0.4)]" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0) 50%, #050505 100%)' }} />
        </div>


        {/* Character image (clown) on right side - only show if tenant has custom image */}
        {(catalog?.image || whyRare?.image) && (
          <div className="absolute right-0 bottom-0 z-[2] h-[85%] w-[45%] flex items-end justify-end">
            <img src={catalog?.image || whyRare?.image || ''} alt=""
              className="h-full w-auto object-contain object-right-bottom" />
          </div>
        )}

        {/* Logo */}
        <div className="absolute top-8 left-8 md:left-16 z-10">
          {(tenant.logoHomeUrl || tenant.logoUrl) ? (
            <img src={tenant.logoHomeUrl || tenant.logoUrl} alt={tenant.name} className="h-16 md:h-20 object-contain" />
          ) : (
            <span className="text-2xl font-bold" style={{ color: pc }}>{tenant.name}</span>
          )}
        </div>

        {/* Hero text content - left side */}
        <div className="relative z-10 px-8 md:px-16 max-w-2xl">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl lg:text-[52px] font-bold leading-[1.1] mb-3"
            style={{ fontStyle: 'italic' }}>
            <span style={{ background: 'linear-gradient(90deg, #E4E4E4 0%, #5A5A5A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {tenant.theme.heroTitle || 'Você poderia assistir\nalgo leve hoje.'}
            </span>
          </motion.h1>
          <motion.p {...fadeUp} className="text-2xl md:text-3xl font-semibold text-white mb-4">
            {tenant.theme.heroSubtitle || 'Mas veio parar aqui.'}
          </motion.p>
          <motion.p {...fadeUp} className="text-sm text-white/50 mb-8 leading-relaxed max-w-sm">
            Sabe que não é confortável.<br />E mesmo assim voltou.
          </motion.p>
          <motion.div {...fadeUp}>
            <Link to={`/${slug}/assinar`}
              className="inline-flex items-center gap-2 px-10 py-3.5 border text-xs uppercase tracking-[3px] font-medium transition-all hover:bg-white/5"
              style={{ borderColor: `${pc}66`, color: pc }}>
              {tenant.theme.heroCtaText || 'ACESSAR AGORA'}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <ChevronDown size={20} className="text-white/20" />
        </div>
      </section>

      {/* ===== SECTION 2: NUMBERED MOVIE CARDS + TEXT ===== */}
      <section className="relative py-24 overflow-hidden">
        {/* Background image */}
        {tenant.theme.section2BgImage && (
          <div className="absolute inset-0">
            <img src={tenant.theme.section2BgImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[rgba(5,5,5,0.75)]" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left: numbered movie cards */}
            <motion.div {...fadeUp}>
              {manifesto?.image ? (
                <img src={manifesto.image} alt="" className="w-full max-w-[540px] object-contain" />
              ) : (
                <img src="/darkflix/movie-cards-numbered.png" alt="" className="w-full max-w-[540px] object-contain" />
              )}
            </motion.div>

            {/* Right: text block */}
            <motion.div {...fadeUp} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white">
                {manifesto?.heading || 'você não chegou aqui por acaso.\na maioria das pessoas passa direto'}
              </h2>
              <p className="text-base text-white/50 leading-relaxed">
                {manifesto?.body || 'você ainda pode fechar esta página. a maioria faz isso. os outros continuam… e raramente se arrependem. raramente.'}
              </p>
              <Link to={`/${slug}/assinar`}
                className="inline-flex items-center px-8 py-3 border text-xs uppercase tracking-[3px] transition-all hover:bg-white/5"
                style={{ borderColor: `${pc}66`, color: pc }}>
                VER O QUE ESTÁ EM EXIBIÇÃO
              </Link>
              <p className="text-sm font-medium">
                <span style={{ color: pc }}>Aviso:</span>{' '}
                <span style={{ color: `${pc}cc` }}>{manifesto?.quote || 'este não é um lugar confortável.'}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: MANIFESTO - "NÃO É UM STREAMING TRADICIONAL" ===== */}
      <section className="relative py-28 overflow-hidden bg-[#050505]">
        <div className="relative max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left: text block */}
            <motion.div {...fadeUp} className="space-y-6">
              <p className="text-sm italic text-white/60" style={{ fontFamily: "'Georgia', serif" }}>
                "se parecer desconfortável, está funcionando."
              </p>
              <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]">
                <span style={{ background: 'linear-gradient(90deg, #DADADA 0%, #6A6A6A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {experience?.heading || 'A Darkflix não é um streaming tradicional.'}
                </span>
              </h2>
              <p className="text-base text-white/60 leading-relaxed">
                {experience?.body || 'É um espaço onde filmes fora do circuito comercial voltam a circular — '}
                {!experience?.body && <strong className="text-white">obras atmosféricas, cultuadas e difíceis de encontrar.</strong>}
              </p>
              <p className="text-base text-white/50 leading-relaxed">
                Filmes que não foram feitos para agradar.<br />
                Foram feitos para permanecer.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: pc }}>
                Alguns espectadores <strong>desligam na metade,</strong><br />
                outros <strong>não dormem depois.</strong>
              </p>
            </motion.div>

            {/* Right: section 3 image (customizable via editor) */}
            {(tenant.theme.section3Image || (tenant.theme as any).section3BgImage) && (
              <motion.div {...fadeUp} className="relative">
                <img src={tenant.theme.section3Image || (tenant.theme as any).section3BgImage} alt="" className="w-full rounded-lg" />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: "UMA EXPERIÊNCIA DIFERENTE" with zombie ===== */}
      <section className="relative py-8 overflow-hidden">
        {/* Background image - city ruins */}
        <div className="absolute inset-0">
          <img src={tenant.theme.section4BgImage || '/darkflix/city-ruins-bg.png'} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[rgba(5,5,5,0.5)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-8">
          {/* Zombie / creature image */}
          <motion.div {...fadeUp} className="relative flex justify-center">
            <img src={whyRare?.image || '/darkflix/zombie-full.png'} alt=""
              className="max-h-[550px] w-auto object-contain relative z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent z-20" />
          </motion.div>

          {/* Quote above heading */}
          <motion.div {...fadeUp} className="relative z-30 -mt-24 text-center space-y-4">
            <p className="text-sm italic text-white/50" style={{ fontFamily: "'Georgia', serif" }}>
              {whyRare?.quote || '"não recomendamos assistir sozinho. nem acompanhado."'}
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tight">
              <span className="text-white">UMA </span>
              <span style={{ color: pc }}>EXPERIÊNCIA</span>
              <br />
              <span className="text-white">DIFERENTE</span>
            </h2>
          </motion.div>

          {/* Body text */}
          <motion.div {...fadeUp} className="text-center mt-10 space-y-6 max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-white font-semibold leading-relaxed">
              Aqui, o silêncio não é vazio. É parte da narrativa.
            </p>
            <p className="text-base text-white/70 leading-relaxed">
              Sem fórmulas reconfortantes. Sem trilhas que avisam o susto.<br />
              Sem resoluções fáceis. A tensão não explode.<br />
              Ela se instala.
            </p>
            <p className="text-sm text-white font-semibold leading-relaxed">
              *se você gosta de assistir com o celular na mão,<br />
              este lugar não foi feito para você.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 5: FILM TYPES - poster grid background ===== */}
      <section className="relative overflow-hidden" style={{ minHeight: '600px' }}>
        {/* Background: movie poster grid */}
        <div className="absolute inset-0 z-0">
          <img src={filmTypes?.image || '/darkflix/poster-grid-bg.png'} alt=""
            className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.7) 60%, rgba(5,5,5,1) 100%)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pt-40 pb-20">
          <div className="flex flex-col md:flex-row items-end gap-12">
            {/* Left: quote + heading */}
            <motion.div {...fadeUp} className="flex-1">
              <p className="text-sm mb-4 italic text-white/50" style={{ fontFamily: "'Georgia', serif" }}>
                "alguns filmes não terminam quando os créditos sobem."
              </p>
              <h2 className="text-4xl md:text-[56px] font-extrabold leading-[0.95] tracking-tight">
                <span className="text-white">TIPOS DE FILMES</span><br />
                <span className="text-white">QUE </span>
                <span style={{ color: pc }}>VOCÊ</span><br />
                <span className="text-white">ENCONTRA</span>
              </h2>
            </motion.div>

            {/* Right: bullet points */}
            <motion.div {...fadeUp} className="flex-1">
              <ul className="space-y-3 text-base font-light text-white/80">
                {(filmTypes?.bulletPoints || [
                  '• terror psicológico e atmosférico',
                  '• cults europeus dos anos 60, 70 e 80',
                  '• horror asiático inquietante',
                  '• produções independentes difíceis de localizar',
                  '• obras restauradas e redescobertas',
                  '• filmes estranhos demais para o circuito comercial',
                ]).map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: ATMOSPHERE + CLOWN ===== */}
      <section className="relative py-12">
        {/* Top text: "Não é sobre sustos fáceis" */}
        <div className="text-center mb-16">
          <motion.p {...fadeUp} className="text-lg font-semibold text-white">
            Não é sobre sustos fáceis.
          </motion.p>
          <motion.p {...fadeUp} className="text-lg font-semibold" style={{ color: pc }}>
            É sobre atmosfera.
          </motion.p>
        </div>

        {/* Clown image + heading */}
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: clown/demon image with logo */}
            <motion.div {...fadeUp} className="relative">
              {(tenant.logoUrl) && (
                <img src={tenant.logoUrl} alt="" className="absolute top-0 left-0 h-24 object-contain opacity-60 z-10" />
              )}
              <img src={catalog?.image || '/darkflix/clown-logo.png'} alt=""
                className="w-full max-h-[600px] object-contain" />
            </motion.div>

            {/* Right: heading */}
            <motion.div {...fadeUp} className="-mt-32">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white/90"
                style={{ fontStyle: 'italic' }}>
                {catalog?.heading || 'POR QUE VOCÊ NÃO ENCONTRA ESSES FILMES FACILMENTE'}
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="text-center mt-16">
          <motion.p {...fadeUp} className="text-sm italic text-white/40" style={{ fontFamily: "'Georgia', serif" }}>
            "o silêncio costuma ser a parte mais perturbadora."
          </motion.p>
        </div>
      </section>

      {/* ===== SECTION 7: MOVING CATALOG ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="relative rounded-[32px] overflow-hidden">
            <img src={audience?.image || '/darkflix/catalog.png'} alt=""
              className="w-full h-[320px] object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)' }} />
            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-10 md:p-14 gap-8">
              <motion.div {...fadeUp} className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {audience?.heading || 'UM CATÁLOGO EM MOVIMENTO'}
                </h2>
                <p className="text-base text-white/80 mt-3">
                  O catálogo não é estático.{' '}
                  <span style={{ color: pc }}>Filmes surgem.</span>
                </p>
              </motion.div>
              <motion.div {...fadeUp} className="flex-1">
                <p className="text-base text-white/80 leading-relaxed">
                  Outros saem.{' '}
                  <span style={{ color: pc }} className="font-semibold">Raridades retornam.</span><br />
                  Novas descobertas entram.
                </p>
                <p className="text-base text-white font-semibold mt-3">
                  Você nunca verá exatamente o<br />
                  mesmo catálogo duas vezes.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: PARA QUEM FAZ SENTIDO ===== */}
      <section className="relative py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-start">
            {/* Left column */}
            <motion.div {...fadeUp} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight"
                style={{ background: 'linear-gradient(90deg, #DADADA 0%, #5A5A5A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                PARA QUEM FAZ SENTIDO
              </h2>
              <p className="text-base text-white font-semibold leading-relaxed">
                Para quem gosta de encontrar o que não estava procurando.
              </p>
              <p className="text-base text-white/60 leading-relaxed">
                quem prefere atmosfera ao excesso.<br />
                quem sente curiosidade pelo estranho.<br />
                Para quem acredita que o cinema ainda<br />
                pode surpreender.
              </p>
            </motion.div>

            {/* Center: silhouette image placeholder */}
            <motion.div {...fadeUp} className="hidden md:flex items-center justify-center">
              <div className="w-px h-[300px] bg-white/5" />
            </motion.div>

            {/* Right column */}
            <motion.div {...fadeUp} className="space-y-6">
              <p className="text-base leading-relaxed">
                <span style={{ color: pc }}>Não é para todos.</span><br />
                <span className="text-white">talvez não seja para você.</span><br />
                <span className="text-white font-semibold">(e tudo bem.)</span>
              </p>
              <p className="text-base text-white/60 leading-relaxed">
                Algumas pessoas assistem um<br />
                filme e esquecem.<br />
                <strong className="text-white">outras são lembradas por ele.</strong>
              </p>
            </motion.div>
          </div>

          {/* Bottom quote */}
          <div className="text-center mt-16">
            <motion.p {...fadeUp} className="text-sm italic text-white/40" style={{ fontFamily: "'Georgia', serif" }}>
              "nem todo medo precisa fazer barulho."
            </motion.p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 9: PLANO ANUAL ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* Faded background */}
        <div className="absolute inset-0">
          <img src="/darkflix/haunted-house-bg.png" alt="" className="w-full h-full object-cover opacity-20" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto px-8 text-center">
          <motion.h2 {...fadeUp} className="text-5xl md:text-6xl font-normal uppercase tracking-[4px] mb-14"
            style={{
              fontFamily: "'Georgia', serif",
              background: `linear-gradient(91deg, ${pc} 0%, #661317 72%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
            PLANO ANUAL
          </motion.h2>

          {/* Pricing card */}
          <motion.div {...fadeUp}
            className="p-8 rounded-[20px] text-left border"
            style={{
              borderColor: `${pc}33`,
              background: 'linear-gradient(180deg, rgba(11,11,11,0.7) 0%, rgba(30,5,5,0.5) 100%)'
            }}>
            <h3 className="text-xl text-white/60 mb-1">
              <strong className="text-white">acesso contínuo</strong> ao<br />
              acervo em circulação
            </h3>

            <div className="mt-4 mb-1">
              <span className="text-sm text-white/40 line-through">De R$ 109,90</span>
            </div>
            <div className="mb-1">
              <span className="text-xs text-white/40">por</span>
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
                  <span className="text-sm text-white/80 font-light">{f}</span>
                </div>
              ))}
            </div>

            <Link to={`/${slug}/assinar`}
              className="block w-full text-center py-3.5 border text-xs uppercase tracking-[3px] font-medium transition-all hover:bg-white/5"
              style={{ borderColor: `${pc}66`, color: pc }}>
              ASSINAR AGORA
            </Link>
          </motion.div>

          {/* Side effects */}
          <motion.div {...fadeUp} className="mt-14 text-left">
            <p className="text-sm font-semibold italic mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              * efeitos colaterais relatados:
            </p>
            <div className="space-y-1">
              {['noites silenciosas demais', 'obsessão por diretores obscuros', 'desconfiança de trilhas sonoras alegres', 'incapacidade de voltar ao "normal"'].map((effect, i) => (
                <p key={i} className="text-xs italic text-white/50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {effect}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 flex flex-col items-center gap-4">
        {(tenant.logoFooterUrl || tenant.logoUrl) ? (
          <img src={tenant.logoFooterUrl || tenant.logoUrl} alt={tenant.name} className="h-20 object-contain opacity-80" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold tracking-wider">
              <span className="text-white">DARK</span>
              <span style={{ color: pc }}>FLIX</span>
            </span>
          </div>
        )}
      </footer>
    </div>
  );
}
