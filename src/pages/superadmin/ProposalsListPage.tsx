import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProposals, deleteProposal, getTenants } from '@/lib/storage';
import { Proposal } from '@/lib/types';
import { PLAN_NAMES } from '@/lib/plan-features';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Copy, ExternalLink, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function ProposalsListPage() {
  const [proposals, setProposals] = useState<Proposal[]>(getProposals());
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const tenants = getTenants();

  const filtered = proposals.filter(p =>
    !search || p.clientName.toLowerCase().includes(search.toLowerCase()) || p.clientRazaoSocial.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!confirm('Excluir proposta?')) return;
    deleteProposal(id);
    setProposals(getProposals());
    toast.success('Proposta excluída');
  };

  const handleDuplicate = (p: Proposal) => {
    const copy: Proposal = { ...p, id: crypto.randomUUID(), status: 'rascunho', clientName: `${p.clientName} (Cópia)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    import('@/lib/storage').then(s => { s.saveProposal(copy); setProposals(s.getProposals()); });
    toast.success('Proposta duplicada');
  };

  const statusBadge = (s: Proposal['status']) => {
    const map: Record<string, string> = {
      rascunho: 'bg-gray-500/20 text-gray-400',
      enviada: 'bg-blue-500/20 text-blue-400',
      aprovada: 'bg-green-500/20 text-green-400',
      recusada: 'bg-red-500/20 text-red-400',
    };
    return map[s] || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Propostas Comerciais</h1>
          <p className="text-muted-foreground text-sm">{proposals.length} propostas criadas</p>
        </div>
        <button onClick={() => navigate('/superadmin/propostas/nova')} className="btn-brand flex items-center gap-2 text-sm">
          <Plus size={16} /> Nova Proposta
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="Buscar por nome..." />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cliente</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plano</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Implantação</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mensal</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold">{p.clientName}</p>
                    <p className="text-xs text-muted-foreground">{p.clientRazaoSocial}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      p.plano === 'ultra' ? 'bg-yellow-500/20 text-yellow-400' :
                      p.plano === 'pro' ? 'bg-primary/20 text-primary' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>{PLAN_NAMES[p.plano]}</span>
                  </td>
                  <td className="p-4 font-semibold">R$ {p.totalImplantacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 font-semibold">R$ {p.totalMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${statusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/superadmin/propostas/${p.id}`)} className="p-2 rounded hover:bg-accent transition-colors" title="Editar"><Edit size={15} /></button>
                      <button onClick={() => handleDuplicate(p)} className="p-2 rounded hover:bg-accent transition-colors" title="Duplicar"><Copy size={15} /></button>
                      <button onClick={() => window.open(`/proposta/${p.id}`, '_blank')} className="p-2 rounded hover:bg-accent transition-colors text-primary" title="Ver proposta"><ExternalLink size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded hover:bg-destructive/10 text-destructive transition-colors" title="Excluir"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhuma proposta encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
