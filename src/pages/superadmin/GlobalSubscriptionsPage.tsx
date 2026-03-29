import { useState, useMemo } from 'react';
import { getTenants, getSubscribers, getInvoices } from '@/lib/storage';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Users, CreditCard } from 'lucide-react';

export default function GlobalSubscriptionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tenantFilter, setTenantFilter] = useState('all');

  const tenants = getTenants();

  const allData = useMemo(() => {
    return tenants.flatMap(t => {
      const subs = getSubscribers(t.id);
      const invs = getInvoices(t.id);
      return subs.map(s => ({
        ...s,
        tenantName: t.name,
        tenantPlano: t.plano,
        invoiceCount: invs.filter(i => i.subscriberId === s.id).length,
        totalPaid: invs.filter(i => i.subscriberId === s.id && i.status === 'paid').reduce((a, i) => a + i.amount, 0),
      }));
    });
  }, []);

  const filtered = allData.filter(s => {
    if (statusFilter !== 'all' && s.subscriptionStatus !== statusFilter) return false;
    if (tenantFilter !== 'all' && s.tenantId !== tenantFilter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusLabel: Record<string, string> = { active: 'Ativo', inactive: 'Inativo', overdue: 'Inadimplente', cancelled: 'Cancelado' };
  const statusColor: Record<string, string> = { active: 'bg-green-500/20 text-green-400', inactive: 'bg-gray-500/20 text-gray-400', overdue: 'bg-red-500/20 text-red-400', cancelled: 'bg-red-500/20 text-red-400' };

  const totalActive = allData.filter(s => s.subscriptionStatus === 'active').length;
  const totalOverdue = allData.filter(s => s.subscriptionStatus === 'overdue').length;
  const totalRevenue = allData.reduce((a, s) => a + s.totalPaid, 0);

  const exportCSV = () => {
    const header = 'Tenant,Nome,Email,Status,Faturas,Total Pago\n';
    const rows = filtered.map(s => `${s.tenantName},${s.name},${s.email},${statusLabel[s.subscriptionStatus]},${s.invoiceCount},${s.totalPaid.toFixed(2)}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'assinaturas-global.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black uppercase tracking-tight">Assinaturas Global</h1>
        <p className="text-muted-foreground text-sm">Visão consolidada de todos os assinantes</p>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Assinantes', value: allData.length, icon: Users },
          { label: 'Ativos', value: totalActive, icon: Users },
          { label: 'Inadimplentes', value: totalOverdue, icon: Users },
          { label: 'Receita Total', value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: CreditCard },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <m.icon size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{m.label}</span>
            </div>
            <p className="text-2xl font-black">{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm">
          <option value="all">Todos status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="overdue">Inadimplente</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <select value={tenantFilter} onChange={e => setTenantFilter(e.target.value)}
          className="px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm">
          <option value="all">Todos tenants</option>
          {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors">
          <Download size={14} /> CSV
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tenant</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Faturas</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Pago</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-semibold">{s.tenantName}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3 text-muted-foreground">{s.email}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${statusColor[s.subscriptionStatus]}`}>
                      {statusLabel[s.subscriptionStatus]}
                    </span>
                  </td>
                  <td className="p-3">{s.invoiceCount}</td>
                  <td className="p-3 font-semibold">R$ {s.totalPaid.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">Nenhum assinante encontrado.</p>}
      </div>
    </div>
  );
}
