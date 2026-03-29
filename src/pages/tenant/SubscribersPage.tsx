import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSubscribers, getPlans, setSubscribers as saveSubscribers, getInvoices } from '@/lib/storage';
import { getTenant } from '@/lib/storage';
import { PLAN_FEATURES } from '@/lib/plan-features';
import { Subscriber, SubscriptionStatus, PlanType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Search, Download, UserPlus, Eye, Power, CreditCard, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { UpsellLock } from '@/components/UpsellLock';

export default function SubscribersPage() {
  const { user } = useAuth();
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;
  if (!tenant) return null;

  const plan = tenant.plano as PlanType;
  const features = PLAN_FEATURES[plan];

  const [subscribers, setSubscribers] = useState(getSubscribers(tenant.id));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | ''>('');
  const plans = getPlans(tenant.id);

  const filtered = subscribers.filter(s => {
    if (statusFilter && s.subscriptionStatus !== statusFilter) return false;
    if (features.adminExportCSV && search) {
      return s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    }
    if (search) return s.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const toggleStatus = (sub: Subscriber) => {
    const newStatus: SubscriptionStatus = sub.subscriptionStatus === 'active' ? 'inactive' : 'active';
    const updated = subscribers.map(s => s.id === sub.id ? { ...s, subscriptionStatus: newStatus } : s);
    saveSubscribers(tenant.id, updated);
    setSubscribers(updated);
    toast.success(`Assinante ${newStatus === 'active' ? 'ativado' : 'desativado'}`);
  };

  const exportCSV = () => {
    const header = 'Nome,Email,CPF,Plano,Status,Próximo Vencimento\n';
    const rows = filtered.map(s => {
      const planName = plans.find(p => p.id === s.planId)?.name || '';
      return `"${s.name}","${s.email}","${s.cpf}","${planName}","${s.subscriptionStatus}","${s.nextBillingDate}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `assinantes-${tenant.name}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exportado!');
  };

  const statusBadge = (s: SubscriptionStatus) => {
    const map: Record<SubscriptionStatus, string> = {
      active: 'bg-green-500/20 text-green-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      overdue: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return map[s] || '';
  };

  const statusLabel: Record<SubscriptionStatus, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    overdue: 'Inadimplente',
    cancelled: 'Cancelado',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Assinantes</h1>
          <p className="text-muted-foreground text-sm">{subscribers.length} assinantes cadastrados</p>
        </div>
        <div className="flex gap-2">
          {features.adminExportCSV && (
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">
              <Download size={14} /> CSV
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="Buscar por nome..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
          <option value="">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="overdue">Inadimplentes</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Assinante</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plano</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Próx. Cobrança</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const planName = plans.find(p => p.id === s.planId)?.name || '-';
                return (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{planName}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${statusBadge(s.subscriptionStatus)}`}>
                        {statusLabel[s.subscriptionStatus]}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{s.nextBillingDate}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleStatus(s)} className={`p-2 rounded hover:bg-accent transition-colors ${s.subscriptionStatus === 'active' ? 'text-green-400' : 'text-muted-foreground'}`} title="Ativar/Desativar">
                          <Power size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum assinante encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!features.adminExportCSV && (
        <UpsellLock featureName="Exportação CSV e filtros avançados" requiredPlan="pro" currentPlan={plan} />
      )}
    </div>
  );
}
