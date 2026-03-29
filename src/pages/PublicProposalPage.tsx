import { useParams } from 'react-router-dom';
import { getProposal } from '@/lib/storage';
import { PLAN_NAMES } from '@/lib/plan-features';
import { motion } from 'framer-motion';
import { Check, X, MessageCircle } from 'lucide-react';

export default function PublicProposalPage() {
  const { id } = useParams();
  const proposal = id ? getProposal(id) : null;

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black text-foreground">Proposta não encontrada</h1>
          <p className="text-muted-foreground mt-2">Este link pode estar expirado ou inválido.</p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(proposal.items.map(i => i.category))];
  const whatsappLink = `https://api.whatsapp.com/send?phone=5511969169869&text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre a proposta FlixPay para ${proposal.clientName}.`)}`;

  return (
    <div className="min-h-screen dark bg-[#050505] text-white">
      {/* Glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-[150px] pointer-events-none" style={{ background: '#E50914' }} />

      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-between border-b border-white/5">
        <img src="https://chromotech.com.br/wp-content/uploads/2026/03/Logo-Flixpay-1080-x-300-px.png" alt="FlixPay" className="h-8" />
        <span className="text-[10px] font-bold uppercase tracking-[.3em] text-white/30">Proposta / Apresentação</span>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Proposta Comercial</h1>
          <p className="text-xl text-white/60">Solução customizada para <span className="text-[#E50914] font-bold">{proposal.clientName}</span></p>
          {proposal.clientRazaoSocial && <p className="text-sm text-white/40">{proposal.clientRazaoSocial}</p>}
        </motion.div>

        {/* Plan badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center">
          <span className="inline-block px-6 py-2 rounded-full border border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914] font-black uppercase tracking-widest text-sm">
            Plano {PLAN_NAMES[proposal.plano]}
          </span>
        </motion.div>

        {/* Features by category */}
        {categories.map((cat, ci) => (
          <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + ci * 0.1 }}>
            <h2 className="text-xs font-bold uppercase tracking-[.3em] text-white/30 mb-4">{cat}</h2>
            <div className="space-y-2">
              {proposal.items.filter(i => i.category === cat).map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[.03] border border-white/5">
                  {item.included ? (
                    <div className="h-5 w-5 rounded-full bg-[#E50914]/20 flex items-center justify-center shrink-0"><Check size={12} className="text-[#E50914]" /></div>
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center shrink-0"><X size={12} className="text-white/20" /></div>
                  )}
                  <span className={`text-sm ${item.included ? 'text-white' : 'text-white/30 line-through'}`}>{item.description}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Extra items */}
        {proposal.extraItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h2 className="text-xs font-bold uppercase tracking-[.3em] text-white/30 mb-4">Itens Adicionais</h2>
            <div className="space-y-2">
              {proposal.extraItems.map(e => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[.03] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#E50914]/20 flex items-center justify-center"><Check size={12} className="text-[#E50914]" /></div>
                    <span className="text-sm">{e.description}</span>
                  </div>
                  <span className="text-sm font-bold text-[#E50914]">R$ {e.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pricing summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="p-8 rounded-2xl border border-[#E50914]/20 bg-gradient-to-br from-white/[.05] to-transparent">
          <h2 className="text-lg font-black uppercase tracking-tight mb-6">Resumo de Investimento</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div>
                <p className="font-semibold">Implantação Padrão</p>
                <p className="text-xs text-white/40">Front + API + Configuração</p>
              </div>
              <span className="text-lg font-bold">R$ {proposal.implantacaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            {proposal.extraItems.filter(e => e.value > 0).map(e => (
              <div key={e.id} className="flex justify-between items-center pb-3 border-b border-white/5">
                <div>
                  <p className="font-semibold">{e.description}</p>
                  <p className="text-xs text-white/40">Adicional</p>
                </div>
                <span className="text-lg font-bold">R$ {e.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <span className="text-xl font-black uppercase">Investimento Inicial Total</span>
              <span className="text-3xl font-black text-[#E50914]">R$ {proposal.totalImplantacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/5">
              <div>
                <p className="font-bold">Licenciamento Mensal</p>
                <p className="text-xs text-white/40">Manutenção, infraestrutura e domínio</p>
              </div>
              <span className="text-2xl font-black">R$ {proposal.totalMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<span className="text-sm text-white/40 font-normal">/mês</span></span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-center space-y-6">
          <p className="text-lg text-white/60">Pronto para transformar sua ideia em uma plataforma real?</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#E50914] text-white font-black uppercase tracking-wider rounded-xl hover:bg-[#C40812] transition-all shadow-[0_0_30px_rgba(229,9,20,.3)] hover:shadow-[0_0_50px_rgba(229,9,20,.5)]">
            <MessageCircle size={20} /> Aprovar e Iniciar Projeto
          </a>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center space-y-4">
        <div className="flex items-center justify-center gap-4 opacity-50">
          <img src="https://rsggroup.com.br/wp-content/uploads/2024/02/L06-3-1.png" alt="RSG Group" className="h-6 brightness-200" />
          <span className="text-white/30">×</span>
          <img src="https://chromotech.com.br/wp-content/uploads/2024/08/Logo-Chromotech-Registrado-Cinza-2.png" alt="Chromotech" className="h-6 brightness-200" />
        </div>
        <p className="text-[10px] uppercase tracking-[.3em] text-white/20">O Flix Pay é uma tecnologia provida por RSG Group & Chromotech</p>
        <p className="text-[10px] text-white/15">Documento confidencial. Proposta comercial.</p>
      </footer>
    </div>
  );
}
