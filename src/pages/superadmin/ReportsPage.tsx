import { useMemo } from 'react';
import { getTenants, getSubscribers, getInvoices } from '@/lib/storage';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingUp, DollarSign, Users, Building2 } from 'lucide-react';

export default function ReportsPage() {
  const tenants = getTenants();

  const tenantData = useMemo(() => tenants.map(t => {
    const subs = getSubscribers(t.id);
    const invs = getInvoices(t.id);
    const paid = invs.filter(i => i.status === 'paid');
    return {
      name: t.name,
      plano: t.plano,
      subscribers: subs.length,
      active: subs.filter(s => s.subscriptionStatus === 'active').length,
      revenue: paid.reduce((a, i) => a + i.amount, 0),
      invoicesPaid: paid.length,
      invoicesOverdue: invs.filter(i => i.status === 'overdue').length,
    };
  }), []);

  const totalRevenue = tenantData.reduce((a, t) => a + t.revenue, 0);
  const totalSubs = tenantData.reduce((a, t) => a + t.subscribers, 0);
  const licenseRevenue = tenants.reduce((a, t) => a + t.financeiro.licencaValorMensal, 0);

  // Revenue by tenant (bar chart)
  const revenueByTenant = tenantData.map(t => ({ name: t.name, receita: t.revenue }));

  // Subscribers by status (pie chart)
  const allSubs = tenants.flatMap(t => getSubscribers(t.id));
  const statusCounts = [
    { name: 'Ativo', value: allSubs.filter(s => s.subscriptionStatus === 'active').length, color: '#22c55e' },
    { name: 'Inativo', value: allSubs.filter(s => s.subscriptionStatus === 'inactive').length, color: '#6b7280' },
    { name: 'Inadimplente', value: allSubs.filter(s => s.subscriptionStatus === 'overdue').length, color: '#ef4444' },
    { name: 'Cancelado', value: allSubs.filter(s => s.subscriptionStatus === 'cancelled').length, color: '#f59e0b' },
  ].filter(s => s.value > 0);

  // Monthly revenue simulation (last 6 months)
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    return {
      month: d.toLocaleDateString('pt-BR', { month: 'short' }),
      receita: licenseRevenue * (0.8 + Math.random() * 0.4),
    };
  });

  // Plan distribution
  const planDist = [
    { name: 'Start', value: tenants.filter(t => t.plano === 'start').length, color: '#3b82f6' },
    { name: 'Pro', value: tenants.filter(t => t.plano === 'pro').length, color: '#E50914' },
    { name: 'Ultra', value: tenants.filter(t => t.plano === 'ultra').length, color: '#8b5cf6' },
  ].filter(p => p.value > 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black uppercase tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground text-sm">Análises e métricas da plataforma</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Receita Total', value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign },
          { label: 'Licenciamento/mês', value: `R$ ${licenseRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp },
          { label: 'Total Assinantes', value: totalSubs, icon: Users },
          { label: 'Tenants Ativos', value: tenants.filter(t => t.financeiro.licencaStatus === 'ativo').length, icon: Building2 },
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Tenant */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Receita por Tenant</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByTenant}>
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
              <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Receita Mensal FlixPay</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
              <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subscribers by Status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Assinantes por Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusCounts.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Plan Distribution */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6 rounded-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Distribuição por Plano</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={planDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {planDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tenant Performance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Performance por Tenant</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tenant</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Plano</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assinantes</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ativos</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Receita</th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Inadimplentes</th>
              </tr>
            </thead>
            <tbody>
              {tenantData.map(t => (
                <tr key={t.name} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-semibold">{t.name}</td>
                  <td className="p-3"><span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">{t.plano}</span></td>
                  <td className="p-3">{t.subscribers}</td>
                  <td className="p-3 text-green-400">{t.active}</td>
                  <td className="p-3 font-semibold">R$ {t.revenue.toFixed(2)}</td>
                  <td className="p-3 text-red-400">{t.invoicesOverdue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
