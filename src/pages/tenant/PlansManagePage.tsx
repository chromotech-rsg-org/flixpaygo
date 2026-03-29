import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTenant, getPlans, setPlans } from '@/lib/storage';
import { SubscriptionPlan } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PlansManagePage() {
  const { user } = useAuth();
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;

  const [plans, setPlansState] = useState(() => tenant ? getPlans(tenant.id) : []);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);

  if (!tenant) return <p className="text-muted-foreground p-8">Tenant não encontrado.</p>;

  const save = (plan: SubscriptionPlan) => {
    const updated = plans.some(p => p.id === plan.id)
      ? plans.map(p => p.id === plan.id ? plan : p)
      : [...plans, plan];
    setPlans(tenant.id, updated);
    setPlansState(updated);
    setEditing(null);
    toast.success('Plano salvo!');
  };

  const remove = (id: string) => {
    if (!confirm('Excluir plano?')) return;
    const updated = plans.filter(p => p.id !== id);
    setPlans(tenant.id, updated);
    setPlansState(updated);
    toast.success('Plano excluído');
  };

  const newPlan = (): SubscriptionPlan => ({
    id: crypto.randomUUID(), tenantId: tenant.id, name: '', description: '', price: 0,
    interval: 'monthly', asaasPlanId: '', streamingPlanId: '', active: true, highlight: false, features: [''],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Planos de Assinatura</h1>
          <p className="text-muted-foreground text-sm">{plans.length} planos configurados</p>
        </div>
        <button onClick={() => setEditing(newPlan())} className="btn-brand flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 relative ${plan.highlight ? 'border-primary/40' : ''}`}>
            {plan.highlight && (
              <div className="absolute -top-2 right-4 px-2 py-0.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded">
                <Star size={10} className="inline mr-1" />Destaque
              </div>
            )}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-black text-lg">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${plan.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {plan.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <p className="text-3xl font-black text-primary mb-1">
              R$ {plan.price.toFixed(2)}
              <span className="text-sm text-muted-foreground font-normal">/{plan.interval === 'monthly' ? 'mês' : plan.interval === 'quarterly' ? 'trim' : 'ano'}</span>
            </p>
            <div className="mt-4 space-y-1.5">
              {plan.features.map((f, fi) => (
                <div key={fi} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-3 w-3 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-[8px] text-primary">✓</span></div>
                  {f}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditing({ ...plan })} className="flex-1 py-2 text-xs font-semibold bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                <Edit size={12} className="inline mr-1" /> Editar
              </button>
              <button onClick={() => remove(plan.id)} className="py-2 px-3 text-xs text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{plans.some(p => p.id === editing.id) ? 'Editar' : 'Novo'} Plano</h2>
              <button onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Nome do plano" className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" />
            <input value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Descrição" className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} placeholder="Preço" className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" />
              <select value={editing.interval} onChange={e => setEditing({ ...editing, interval: e.target.value as any })} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm">
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">Features (uma por linha)</label>
              <textarea value={editing.features.join('\n')} onChange={e => setEditing({ ...editing, features: e.target.value.split('\n') })}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm min-h-[80px]" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Ativo</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.highlight} onChange={e => setEditing({ ...editing, highlight: e.target.checked })} /> Destaque</label>
            </div>
            <button onClick={() => save(editing)} className="btn-brand w-full flex items-center justify-center gap-2 text-sm"><Save size={16} /> Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
}
