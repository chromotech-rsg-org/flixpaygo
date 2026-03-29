import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProposal, saveProposal, getTenants } from '@/lib/storage';
import { Proposal, ProposalItem, ProposalExtraItem, PlanType } from '@/lib/types';
import { PLAN_PRICES, PLAN_NAMES, ALL_PLAN_FEATURES } from '@/lib/plan-features';
import { ArrowLeft, Save, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const createDefaultItems = (plan: PlanType): ProposalItem[] =>
  ALL_PLAN_FEATURES.map(f => ({
    id: crypto.randomUUID(),
    description: f.label,
    included: f[plan],
    category: f.category,
  }));

const emptyProposal = (): Proposal => ({
  id: crypto.randomUUID(),
  clientName: '', clientRazaoSocial: '', clientEmail: '',
  plano: 'pro',
  implantacaoValor: PLAN_PRICES.pro.implantacao,
  mensalidadeValor: PLAN_PRICES.pro.mensal,
  items: createDefaultItems('pro'),
  extraItems: [],
  totalImplantacao: PLAN_PRICES.pro.implantacao,
  totalMensal: PLAN_PRICES.pro.mensal,
  status: 'rascunho',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default function ProposalFormPage() {
  const { id } = useParams();
  const isNew = id === 'nova';
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal>(emptyProposal());
  const tenants = getTenants();

  useEffect(() => {
    if (!isNew && id) {
      const p = getProposal(id);
      if (p) setProposal(p);
      else navigate('/superadmin/propostas');
    }
  }, [id]);

  const recalcTotals = (p: Proposal) => {
    p.totalImplantacao = p.implantacaoValor + p.extraItems.reduce((s, e) => s + e.value, 0);
    p.totalMensal = p.mensalidadeValor;
    return p;
  };

  const update = (field: string, value: any) => {
    setProposal(prev => {
      const copy = { ...prev, [field]: value };
      return recalcTotals(copy);
    });
  };

  const handlePlanChange = (plan: PlanType) => {
    setProposal(prev => recalcTotals({
      ...prev,
      plano: plan,
      implantacaoValor: PLAN_PRICES[plan].implantacao,
      mensalidadeValor: PLAN_PRICES[plan].mensal,
      items: createDefaultItems(plan),
    }));
  };

  const toggleItem = (itemId: string) => {
    setProposal(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === itemId ? { ...i, included: !i.included } : i),
    }));
  };

  const addExtraItem = () => {
    setProposal(prev => recalcTotals({
      ...prev,
      extraItems: [...prev.extraItems, { id: crypto.randomUUID(), description: '', value: 0 }],
    }));
  };

  const updateExtraItem = (eid: string, field: keyof ProposalExtraItem, value: any) => {
    setProposal(prev => recalcTotals({
      ...prev,
      extraItems: prev.extraItems.map(e => e.id === eid ? { ...e, [field]: field === 'value' ? Number(value) : value } : e),
    }));
  };

  const removeExtraItem = (eid: string) => {
    setProposal(prev => recalcTotals({ ...prev, extraItems: prev.extraItems.filter(e => e.id !== eid) }));
  };

  const linkToTenant = (tenantId: string) => {
    const t = tenants.find(x => x.id === tenantId);
    if (!t) return;
    setProposal(prev => recalcTotals({
      ...prev,
      tenantId: t.id,
      clientName: t.name,
      clientRazaoSocial: t.razaoSocial,
      clientEmail: t.email,
      plano: t.plano,
      implantacaoValor: t.financeiro.implantacaoValor,
      mensalidadeValor: t.financeiro.licencaValorMensal,
      items: createDefaultItems(t.plano),
    }));
  };

  const handleSave = () => {
    proposal.updatedAt = new Date().toISOString();
    saveProposal(proposal);
    toast.success('Proposta salva!');
    navigate('/superadmin/propostas');
  };

  // Group items by category
  const categories = [...new Set(proposal.items.map(i => i.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/superadmin/propostas')} className="p-2 rounded-lg hover:bg-accent transition-colors"><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">{isNew ? 'Nova Proposta' : 'Editar Proposta'}</h1>
        </div>
        {!isNew && (
          <button onClick={() => window.open(`/proposta/${proposal.id}`, '_blank')} className="flex items-center gap-2 text-sm text-primary hover:underline">
            <ExternalLink size={16} /> Ver proposta pública
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client info */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold">Dados do Cliente</h2>
            {tenants.length > 0 && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Vincular a um tenant existente</label>
                <select onChange={e => e.target.value && linkToTenant(e.target.value)} value={proposal.tenantId || ''}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm">
                  <option value="">— Proposta independente —</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Nome do cliente *</label>
                <input value={proposal.clientName} onChange={e => update('clientName', e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Razão Social</label>
                <input value={proposal.clientRazaoSocial} onChange={e => update('clientRazaoSocial', e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">E-mail</label>
                <input type="email" value={proposal.clientEmail} onChange={e => update('clientEmail', e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Status</label>
                <select value={proposal.status} onChange={e => update('status', e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm">
                  <option value="rascunho">Rascunho</option>
                  <option value="enviada">Enviada</option>
                  <option value="aprovada">Aprovada</option>
                  <option value="recusada">Recusada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Plan selection */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold">Plano Base</h2>
            <div className="grid grid-cols-3 gap-3">
              {(['start', 'pro', 'ultra'] as PlanType[]).map(p => (
                <button key={p} onClick={() => handlePlanChange(p)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${proposal.plano === p ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}>
                  <span className="font-black uppercase">{PLAN_NAMES[p]}</span>
                  {p === 'pro' && <span className="ml-1 text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-bold">⭐</span>}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Implantação (R$)</label>
                <input type="number" value={proposal.implantacaoValor} onChange={e => update('implantacaoValor', Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Mensalidade (R$)</label>
                <input type="number" value={proposal.mensalidadeValor} onChange={e => update('mensalidadeValor', Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          {/* Feature checklist */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold">Itens da Proposta</h2>
            {categories.map(cat => (
              <div key={cat}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{cat}</h3>
                <div className="space-y-1.5">
                  {proposal.items.filter(i => i.category === cat).map(item => (
                    <label key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/20 cursor-pointer transition-colors">
                      <input type="checkbox" checked={item.included} onChange={() => toggleItem(item.id)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                      <span className={`text-sm ${item.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>{item.description}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Extra items */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Itens Adicionais</h2>
              <button onClick={addExtraItem} className="flex items-center gap-1 text-sm text-primary hover:underline"><Plus size={14} /> Adicionar</button>
            </div>
            {proposal.extraItems.map(ei => (
              <div key={ei.id} className="flex gap-3 items-center">
                <input value={ei.description} onChange={e => updateExtraItem(ei.id, 'description', e.target.value)} placeholder="Ex: LP customizada, API extra..."
                  className="flex-1 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                <input type="number" value={ei.value} onChange={e => updateExtraItem(ei.id, 'value', e.target.value)} placeholder="R$"
                  className="w-32 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                <button onClick={() => removeExtraItem(ei.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded"><Trash2 size={16} /></button>
              </div>
            ))}
            {proposal.extraItems.length === 0 && <p className="text-sm text-muted-foreground">Nenhum item adicional.</p>}
          </div>
        </div>

        {/* Right column - Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4 sticky top-20">
            <h2 className="text-lg font-bold">Resumo</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Implantação base</span>
                <span className="font-semibold">R$ {proposal.implantacaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              {proposal.extraItems.filter(e => e.value > 0).map(e => (
                <div key={e.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{e.description || 'Item extra'}</span>
                  <span className="font-semibold">R$ {e.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-bold uppercase text-sm">Total Implantação</span>
                  <span className="text-xl font-black text-primary">R$ {proposal.totalImplantacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold uppercase text-sm">Mensal</span>
                <span className="text-lg font-black">R$ {proposal.totalMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<span className="text-sm text-muted-foreground font-normal">/mês</span></span>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <button onClick={handleSave} className="btn-brand w-full flex items-center justify-center gap-2 text-sm">
                <Save size={16} /> Salvar Proposta
              </button>
              {!isNew && (
                <button onClick={() => window.open(`/proposta/${proposal.id}`, '_blank')} className="w-full px-6 py-3 border border-primary text-primary rounded-lg font-semibold text-sm hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink size={16} /> Ver Proposta Pública
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
