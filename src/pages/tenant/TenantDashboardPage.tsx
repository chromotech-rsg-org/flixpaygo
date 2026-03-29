import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, DollarSign, TrendingUp, TrendingDown, CreditCard, AlertTriangle, BarChart3, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getTenant, getSubscribers, getInvoices, getPlans } from '@/lib/storage';
import { PLAN_FEATURES } from '@/lib/plan-features';
import { PlanType } from '@/lib/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UpsellLock } from '@/components/UpsellLock';

export default function TenantDashboardPage() {
  const { user } = useAuth();
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;
  if (!tenant) return <p className="text-muted-foreground">Tenant não encontrado.</p>;

  const plan = tenant.plano as PlanType;
  const features = PLAN_FEATURES[plan];
  const subscribers = getSubscribers(tenant.id);
  const invoices = getInvoices(tenant.id);
  const plans = getPlans(tenant.id);

  const totalSubs = subscribers.length;
  const activeSubs = subscribers.filter(s => s.subscriptionStatus === 'active').length;
  const inactiveSubs = subscribers.filter(s => s.subscriptionStatus === 'inactive' || s.subscriptionStatus === 'cancelled').length;
  const overdueSubs = subscribers.filter(s => s.subscriptionStatus === 'overdue').length;

  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const receitaMes = paidInvoices.reduce((s, i) => s + i.amount, 0);
  const ticketMedio = paidInvoices.length > 0 ? receitaMes / paidInvoices.length : 0;

  // New subs this month
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const newThisMonth = subscribers.filter(s => {
    const d = new Date(s.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const cancelados = subscribers.filter(s => s.subscriptionStatus === 'cancelled').length;
  const churnRate = totalSubs > 0 ? ((cancelados / totalSubs) * 100).toFixed(1) : '0';

  // Basic 4 cards
  const basicCards = [
    { label: 'Total Assinantes', value: totalSubs, icon: Users, color: 'text-blue-400' },
    { label: 'Ativos', value: activeSubs, icon: UserCheck, color: 'text-green-400' },
    { label: 'Inativos', value: inactiveSubs, icon: UserX, color: 'text-gray-400' },
    { label: 'Receita do Mês', value: `R$ ${receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-primary' },
  ];

  // Pro+ cards
  const proCards = [
    { label: 'Novos no Mês', value: newThisMonth, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Cancelamentos', value: cancelados, icon: TrendingDown, color: 'text-red-400' },
    { label: 'Inadimplentes', value: overdueSubs, icon: AlertTriangle, color: 'text-yellow-400' },
    { label: 'Ticket Médio', value: `R$ ${ticketMedio.toFixed(2)}`, icon: CreditCard, color: 'text-blue-400' },
  ];

  // Ultra cards
  const ultraCards = [
    { label: 'MRR', value: `R$ ${receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: BarChart3, color: 'text-primary' },
    { label: 'ARR', value: `R$ ${(receitaMes * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: BarChart3, color: 'text-yellow-400' },
    { label: 'Churn Rate', value: `${churnRate}%`, icon: TrendingDown, color: 'text-red-400' },
    { label: 'LTV Estimado', value: `R$ ${(ticketMedio * 12).toFixed(2)}`, icon: Activity, color: 'text-green-400' },
  ];

  const allCards = [
    ...basicCards,
    ...(features.adminMetricCards >= 8 ? proCards : []),
    ...(features.adminMetricCards >= 12 ? ultraCards : []),
  ];

  // Chart data
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const growthData = months.map((m, i) => ({
    name: m,
    assinantes: Math.round(totalSubs * (0.3 + (i / 12) * 0.7 + Math.random() * 0.1)),
  }));

  const revenueData = months.slice(6).map((m, i) => ({
    name: m,
    receita: Math.round(receitaMes * (0.7 + Math.random() * 0.4)),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral — {tenant.name}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c.label}</span>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className="text-2xl font-black">{c.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Locked cards for lower plans */}
      {features.adminMetricCards < 8 && (
        <UpsellLock featureName="Métricas avançadas" requiredPlan="pro" currentPlan={plan} />
      )}

      {/* Charts (Pro+) */}
      {features.adminCharts ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-tight mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Crescimento de Assinantes</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
                  <Line type="monotone" dataKey="assinantes" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-tight mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Receita Mensal</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={v => `R$${v}`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Receita']} />
                  <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      ) : (
        <UpsellLock featureName="Gráficos e Relatórios" requiredPlan="pro" currentPlan={plan} />
      )}

      {/* Alerts (Pro+) */}
      {features.adminAlerts && overdueSubs > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="font-semibold text-sm">Atenção: {overdueSubs} assinante(s) inadimplente(s)</p>
              <p className="text-xs text-muted-foreground">Verifique a seção de assinantes para detalhes.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
