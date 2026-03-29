import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCommercialPlans, saveCommercialPlan, deleteCommercialPlan, setCommercialPlans } from '@/lib/storage';
import { CommercialPlan, PlanType } from '@/lib/types';
import { PLAN_PRICES, PLAN_NAMES, ALL_PLAN_FEATURES } from '@/lib/plan-features';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const defaultPlans = (): CommercialPlan[] => [
  { id: 'cp-start', name: 'Start', type: 'start', implantacao: PLAN_PRICES.start.implantacao, mensal: PLAN_PRICES.start.mensal, description: 'Entrada no mercado. Valide seu modelo com o essencial.', features: ALL_PLAN_FEATURES.filter(f => f.start).map(f => f.label), active: true },
  { id: 'cp-pro', name: 'Pro', type: 'pro', implantacao: PLAN_PRICES.pro.implantacao, mensal: PLAN_PRICES.pro.mensal, description: 'Negócio em escala. Mais controle e profissionalismo.', features: ALL_PLAN_FEATURES.filter(f => f.pro).map(f => f.label), active: true },
  { id: 'cp-ultra', name: 'Ultra', type: 'ultra', implantacao: PLAN_PRICES.ultra.implantacao, mensal: PLAN_PRICES.ultra.mensal, description: 'Experiência premium. Layout exclusivo e controle total.', features: ALL_PLAN_FEATURES.filter(f => f.ultra).map(f => f.label), active: true },
];

export default function CommercialPlansPage() {
  const stored = getCommercialPlans();
  const [plans, setPlansState] = useState<CommercialPlan[]>(stored.length > 0 ? stored : (() => { const d = defaultPlans(); setCommercialPlans(d); return d; })());
  const [editing, setEditing] = useState<CommercialPlan | null>(null);
  const [newFeature, setNewFeature] = useState('');

  const handleSave = () => {
    if (!editing) return;
    saveCommercialPlan(editing);
    setPlansState(getCommercialPlans());
    setEditing(null);
    toast.success('Plano salvo!');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Excluir este plano?')) return;
    deleteCommercialPlan(id);
    setPlansState(getCommercialPlans());
    toast.success('Plano excluído');
  };

  const addFeature = () => {
    if (!newFeature.trim() || !editing) return;
    setEditing({ ...editing, features: [...editing.features, newFeature.trim()] });
    setNewFeature('');
  };

  const removeFeature = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, features: editing.features.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Planos Comerciais</h1>
          <p className="text-muted-foreground text-sm">Gerencie os planos oferecidos pelo FlixPay</p>
        </div>
        <button onClick={() => setEditing({ id: crypto.randomUUID(), name: '', type: 'start', implantacao: 0, mensal: 0, description: '', features: [], active: true })}
          className="btn-brand flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Plano
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                plan.type === 'ultra' ? 'bg-yellow-500/20 text-yellow-400' :
                plan.type === 'pro' ? 'bg-primary/20 text-primary' :
                'bg-blue-500/20 text-blue-400'
              }`}>{plan.type}</span>
              <div className="flex gap-1">
                <button onClick={() => setEditing({ ...plan })} className="p-1.5 rounded hover:bg-accent transition-colors"><Edit size={14} /></button>
                <button onClick={() => handleDelete(plan.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <h3 className="text-xl font-black">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            <div className="mt-4 space-y-1">
              <p className="text-sm">Implantação: <span className="font-bold text-primary">R$ {plan.implantacao.toLocaleString('pt-BR')}</span></p>
              <p className="text-sm">Mensal: <span className="font-bold text-primary">R$ {plan.mensal.toLocaleString('pt-BR')}</span></p>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{plan.features.length} funcionalidades</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {plan.features.slice(0, 6).map((f, fi) => (
                  <div key={fi} className="flex items-center gap-1.5 text-xs"><Check size={10} className="text-primary shrink-0" />{f}</div>
                ))}
                {plan.features.length > 6 && <p className="text-xs text-muted-foreground">+{plan.features.length - 6} mais...</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editing.id.startsWith('cp-') ? 'Editar Plano' : 'Novo Plano'}</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Nome</label>
                  <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Tipo</label>
                  <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as PlanType })}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                    <option value="start">Start</option>
                    <option value="pro">Pro</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Descrição</label>
                <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary min-h-[60px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Implantação (R$)</label>
                  <input type="number" value={editing.implantacao} onChange={e => setEditing({ ...editing, implantacao: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Mensal (R$)</label>
                  <input type="number" value={editing.mensal} onChange={e => setEditing({ ...editing, mensal: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Funcionalidades</label>
                <div className="space-y-1 mb-2 max-h-48 overflow-y-auto">
                  {editing.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-secondary/20 rounded text-sm">
                      <Check size={12} className="text-primary shrink-0" />
                      <span className="flex-1">{f}</span>
                      <button onClick={() => removeFeature(i)} className="text-destructive hover:text-destructive/80"><X size={14} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => e.key === 'Enter' && addFeature()}
                    className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="Nova funcionalidade..." />
                  <button onClick={addFeature} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold">Adicionar</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} className="rounded" />
                <span className="text-sm">Plano ativo</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm">Cancelar</button>
              <button onClick={handleSave} className="btn-brand flex items-center gap-2 text-sm"><Save size={14} /> Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
