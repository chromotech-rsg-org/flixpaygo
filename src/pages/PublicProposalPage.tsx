import { useParams } from 'react-router-dom';
import { getProposal } from '@/lib/storage';
import { PLAN_NAMES } from '@/lib/plan-features';
import { motion } from 'framer-motion';
import { Check, X, MessageCircle, Layers, BarChart3, CreditCard, Tv, Rocket, Palette, Settings, Zap } from 'lucide-react';
import { LOGO_FLIXPAY, LOGO_RSG, LOGO_CHROMOTECH } from '@/lib/constants';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function PublicProposalPage() {
  const { id } = useParams();
  const proposal = id ? getProposal(id) : null;

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">Proposta não encontrada</h1>
          <p className="text-white/50 mt-2">Este link pode estar expirado ou inválido.</p>
        </div>
      </div>
    );
  }

  const clientDisplay = proposal.clientName || 'Proposta Genérica FlixPay';
  const categories = [...new Set(proposal.items.map(i => i.category))];
  const whatsappLink = `https://api.whatsapp.com/send?phone=5511969169869&text=${encodeURIComponent(`Olá! Gostaria de aprovar a proposta FlixPay${proposal.clientName ? ` para ${proposal.clientName}` : ''}.`)}`;

  const featureCards = [
    { icon: Palette, title: 'Landing Page Exclusiva', desc: 'Criamos e customizamos uma página com a identidade visual da sua marca, focada em converter mais assinantes.' },
    { icon: BarChart3, title: 'Gestão Completa', desc: 'Painel com Dashboard financeiro, controle de Usuários, Clientes, Assinaturas e Faturas em tempo real.' },
    { icon: CreditCard, title: 'Automação Pagamentos', desc: 'Integração nativa com ASAAS. Facilidade para gerenciar cobranças recorrentes, cartões e PIX.' },
    { icon: Tv, title: 'Streaming Estável', desc: 'Suporte para transmissão eficiente e segura. Alta qualidade sem interrupções para distribuir seu conteúdo.' },
  ];

  const offerItems = [
    { title: 'Integração de Pagamento (Asaas)', desc: 'Facilidade para gerenciar cobranças, mensalidades e pagamentos dos assinantes de forma automática.' },
    { title: 'Integração com Streaming', desc: 'Suporte de infraestrutura para transmissão eficiente, rápida e segura de todo o seu conteúdo em vídeo.' },
    { title: 'Sistema de Gerenciamento Completo', desc: 'Controle de clientes, criação de planos de assinatura, faturamento automatizado e personalização de pacotes.' },
  ];

  const platformCards = [
    { icon: BarChart3, title: 'Dashboard', items: ['Controle detalhado de Clientes, Planos e Usuários.', 'Gestão completa de Faturas e Assinaturas Ativas.', 'Análise de Receita Mensal em tempo real.'] },
    { icon: CreditCard, title: 'Financeiro', items: ['Automatiza pagamentos e cobranças recorrentes.', 'Integração nativa com a plataforma ASAAS.', 'Gerenciamento financeiro simplificado (PIX/Cartão).'] },
    { icon: Tv, title: 'Integração com seu Streaming', items: ['Conexão nativa da sua infraestrutura de vídeo com o nosso sistema.', 'Liberação e bloqueio automático de acessos atrelado aos pagamentos.', 'Una o seu conteúdo ao nosso motor financeiro em um só lugar.'] },
  ];

  const implantationSteps = [
    { num: '1', title: 'Domínio', desc: 'Configuração completa do sistema no domínio oficial do cliente.', icon: Layers },
    { num: '2', title: 'Personalização', desc: 'Adaptação da identidade visual: logotipos e paleta Flix Pay.', icon: Palette },
    { num: '3', title: 'Integração', desc: 'Conexão via API com os meios de pagamento (Asaas) e streaming.', icon: Settings },
    { num: '4', title: 'Lançamento', desc: 'Ajuste final, testes e disponibilização da plataforma.', icon: Rocket },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.07] blur-[180px] pointer-events-none" style={{ background: '#E50914' }} />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[150px] pointer-events-none" style={{ background: '#E50914' }} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 py-4 px-6 md:px-10 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <img src={LOGO_FLIXPAY} alt="FlixPay" className="h-7" />
        <span className="text-[9px] font-bold uppercase tracking-[.4em] text-white/25">Proposta / Apresentação</span>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none mb-4">
              Proposta Comercial
            </h1>
            <p className="text-lg md:text-xl text-white/50">
              Solução customizada para <span className="text-[#E50914] font-bold">{clientDisplay}</span>
            </p>
            {proposal.clientRazaoSocial && <p className="text-sm text-white/30 mt-2">{proposal.clientRazaoSocial}</p>}
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mt-8">
            <span className="inline-block px-6 py-2.5 rounded-full border border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914] font-black uppercase tracking-[.2em] text-xs">
              Plano {PLAN_NAMES[proposal.plano]}
            </span>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Gestão e Streaming Premium
            </h2>
            <p className="text-base text-white/40 mt-3 max-w-2xl mx-auto leading-relaxed">
              Transforme sua audiência em um negócio recorrente. Muito mais que um player de vídeo — uma plataforma ponta a ponta que une tecnologia de streaming, painel de gestão inteligente e automação de cobranças.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== 4 FEATURE CARDS ==================== */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureCards.map((card, i) => (
            <motion.div key={card.title} {...fadeUp} transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/30 hover:bg-white/[0.04] transition-all duration-500">
              <card.icon size={28} className="text-[#E50914] mb-4" />
              <h3 className="font-bold text-sm mb-2">{card.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== O QUE OFERECEMOS ==================== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[.4em] text-white/25 mb-3">Visão Geral</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">O que oferecemos?</h2>
            <p className="text-sm text-white/40 mt-3 max-w-xl leading-relaxed">
              O Flix Pay permite que você tenha total controle financeiro e gerencial sobre sua plataforma, oferecendo uma experiência premium para o seu usuário.
            </p>
          </motion.div>
          <div className="space-y-4">
            {offerItems.map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/20 transition-all">
                <div className="h-8 w-8 rounded-lg bg-[#E50914]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} className="text-[#E50914]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== COMO FUNCIONA ==================== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[.4em] text-white/25 mb-3">Como funciona a Plataforma</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platformCards.map((card, i) => (
              <motion.div key={card.title} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E50914]/20 transition-all">
                <card.icon size={32} className="text-[#E50914] mb-4" />
                <h3 className="font-bold mb-4">{card.title}</h3>
                <ul className="space-y-2.5">
                  {card.items.map((it, j) => (
                    <li key={j} className="flex gap-2 text-xs text-white/50 leading-relaxed">
                      <Check size={12} className="text-[#E50914] shrink-0 mt-0.5" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROCESSO DE IMPLANTAÇÃO ==================== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Processo de Implantação</h2>
            <p className="text-sm text-white/40 mt-3">Os 4 passos fundamentais para colocar sua plataforma no ar.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {implantationSteps.map((step, i) => (
              <motion.div key={step.num} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden group hover:border-[#E50914]/20 transition-all">
                <span className="absolute -top-4 -right-2 text-[80px] font-black text-white/[0.03] leading-none select-none group-hover:text-[#E50914]/[0.06] transition-colors">{step.num}</span>
                <step.icon size={24} className="text-[#E50914] mb-3 relative z-10" />
                <h3 className="font-bold text-sm mb-2 relative z-10">{step.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed relative z-10">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== O QUE COMPÕE ESTE PROJETO ==================== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">O que compõe este projeto?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Implantação Padrão */}
            <motion.div {...fadeUp}
              className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-[#E50914]/15 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E50914]">Fase 1</span>
                </div>
                <h3 className="font-bold">Implantação Padrão</h3>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                A fundação do seu negócio. Inclui a instalação do Front-end, configuração da API, Lista de Pacotes Padrão e a execução da implantação. Entregamos a plataforma pronta para operar.
              </p>
              <div className="text-right">
                <span className="text-lg font-black">R$ {proposal.implantacaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </motion.div>

            {/* Recorrente */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-blue-500/15 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Recorrente</span>
                </div>
                <h3 className="font-bold">Licenciamento & Infraestrutura Mensal</h3>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Custo operacional para manter tudo rodando perfeitamente. Cobre a hospedagem do sistema, estabilidade do banco de dados, licença de uso e manutenção contínua.
              </p>
              <div className="text-right">
                <span className="text-lg font-black">R$ {proposal.mensalidadeValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<span className="text-sm text-white/40 font-normal">/mês</span></span>
              </div>
            </motion.div>
          </div>

          {/* Extra items as add-on cards */}
          {proposal.extraItems.length > 0 && (
            <div className="mt-6 space-y-4">
              {proposal.extraItems.map((extra, i) => (
                <motion.div key={extra.id} {...fadeUp} transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-6 rounded-2xl border border-[#E50914]/15 bg-gradient-to-r from-[#E50914]/[0.04] to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-[#E50914]/15 rounded-lg">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#E50914]">Add-on</span>
                      </div>
                      <h3 className="font-bold text-sm">{extra.description || 'Item Adicional'}</h3>
                    </div>
                    <span className="text-lg font-black text-[#E50914]">R$ {extra.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== ITENS DO PLANO ==================== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl font-black uppercase tracking-tight">Detalhes do Plano {PLAN_NAMES[proposal.plano]}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            {categories.map((cat, ci) => (
              <motion.div key={cat} {...fadeUp} transition={{ delay: ci * 0.1 }}>
                <h3 className="text-[10px] font-bold uppercase tracking-[.3em] text-white/25 mb-3">{cat}</h3>
                <div className="space-y-1.5">
                  {proposal.items.filter(i => i.category === cat).map(item => (
                    <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                      {item.included ? (
                        <div className="h-5 w-5 rounded-full bg-[#E50914]/20 flex items-center justify-center shrink-0"><Check size={11} className="text-[#E50914]" /></div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center shrink-0"><X size={11} className="text-white/15" /></div>
                      )}
                      <span className={`text-sm ${item.included ? 'text-white/80' : 'text-white/20 line-through'}`}>{item.description}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== RESUMO DE INVESTIMENTO ==================== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[.4em] text-white/25 mb-2">Proposta Comercial</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">Resumo de Investimento</h2>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 space-y-5">
              {/* Implantação Padrão */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <p className="font-semibold text-sm">Implantação Padrão</p>
                  <p className="text-[11px] text-white/30">Front + API + Lista de Pacotes Padrão</p>
                </div>
                <span className="font-bold">R$ {proposal.implantacaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Extra items */}
              {proposal.extraItems.filter(e => e.value > 0).map(extra => (
                <div key={extra.id} className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-[#E50914] bg-[#E50914]/10 px-1.5 py-0.5 rounded">Add-on</span>
                      <p className="font-semibold text-sm">{extra.description}</p>
                    </div>
                  </div>
                  <span className="font-bold">R$ {extra.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}

              {/* Total Implantação */}
              <div className="flex items-center justify-between pt-4 pb-6 border-b border-[#E50914]/20">
                <span className="text-lg font-black uppercase">Investimento Inicial Total</span>
                <span className="text-3xl font-black text-[#E50914]">R$ {proposal.totalImplantacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Mensal */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-bold text-sm">Licenciamento Mensal</p>
                  <p className="text-[11px] text-white/30">Manutenção, infraestrutura e domínio</p>
                </div>
                <span className="text-2xl font-black">R$ {proposal.totalMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<span className="text-sm text-white/30 font-normal">/mês</span></span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="px-6 py-20 text-center">
        <motion.div {...fadeUp} className="space-y-6">
          <p className="text-lg text-white/50">Pronto para transformar sua ideia em uma plataforma real?</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white font-black uppercase tracking-wider text-sm rounded-2xl hover:bg-[#1da851] transition-all shadow-[0_0_40px_rgba(37,211,102,.2)] hover:shadow-[0_0_60px_rgba(37,211,102,.35)] hover:-translate-y-1">
            <MessageCircle size={20} /> Aprovar Escopo e Iniciar Projeto
          </a>
        </motion.div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-10 border-t border-white/5 text-center space-y-4">
        <div className="flex items-center justify-center gap-5">
          <img src={LOGO_RSG} alt="RSG Group" className="h-7 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <span className="text-white/15 text-xs">×</span>
          <img src={LOGO_CHROMOTECH} alt="Chromotech" className="h-7 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
        </div>
        <p className="text-[9px] uppercase tracking-[.4em] text-white/15">O Flix Pay é uma tecnologia provida por RSG Group & Chromotech</p>
        <p className="text-[9px] text-white/10">Documento confidencial. Proposta comercial.</p>
      </footer>
    </div>
  );
}
