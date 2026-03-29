import { motion } from 'framer-motion';
import { Building2, DollarSign, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { getTenants, getAllSubscribers, getInvoices } from '@/lib/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { PLAN_NAMES } from '@/lib/plan-features';

export default function SuperAdminDashboard() {
  const tenants = getTenants();
  const allSubs = getAllSubscribers();
  const navigate = useNavigate();

  const activeTenants = tenants.filter(t => t.financeiro.licencaStatus === 'ativo').length;
  const inadimplentes = tenants.filter(t => t.financeiro.licencaStatus === 'inadimplente').length;
  const totalSubs = allSubs.length;
  const receitaMensal = tenants.reduce((s, t) => s + (t.financeiro.licencaStatus !== 'suspenso' ? t.financeiro.licencaValorMensal : 0), 0);

  // Chart data (fake 12 months)
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const chartData = months.map((m, i) => ({
    name: m,
    receita: Math.round(receitaMensal * (0.5 + (i / 12) * 0.6 + Math.random() * 0.2)),
  }));

  // Tenants com vencimento próximo (7 dias)
  const today = new Date();
  const upcomingTenants = tenants.filter(t => {
    const vencDia = t.financeiro.licencaVencimentoDia;
    const nextVenc = new Date(today.getFullYear(), today.getMonth(), vencDia);
    if (nextVenc < today) nextVenc.setMonth(nextVenc.getMonth() + 1);
    const diff = (nextVenc.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  });

  const lastTenants = [...tenants].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const cards = [
    { label: 'Tenants Ativos', value: activeTenants, icon: Building2, color: 'text-green-400' },
    { label: 'Receita FlixPay/mês', value: `R$ ${receitaMensal.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-primary' },
    { label: 'Total Assinantes', value: totalSubs, icon: Users, color: 'text-blue-400' },
    { label: 'Inadimplentes', value: inadimplentes, icon: AlertTriangle, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral da plataforma FlixPay</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="metric-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c.label}</span>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className="text-3xl font-black">{c.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold uppercase tracking-tight">Receita FlixPay — Últimos 12 meses</h2>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `R$${v}`} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }}
                formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Receita']}
              />
              <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold uppercase tracking-tight mb-4">Licenças vencendo em 7 dias</h2>
          {upcomingTenants.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma licença vencendo nos próximos 7 dias.</p>
          ) : (
            <div className="space-y-3">
              {upcomingTenants.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">Venc. dia {t.financeiro.licencaVencimentoDia}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">R$ {t.financeiro.licencaValorMensal}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent tenants */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold uppercase tracking-tight mb-4">Últimos tenants cadastrados</h2>
          <div className="space-y-3">
            {lastTenants.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => navigate(`/superadmin/tenants/${t.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  t.plano === 'ultra' ? 'bg-yellow-500/20 text-yellow-400' :
                  t.plano === 'pro' ? 'bg-primary/20 text-primary' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{PLAN_NAMES[t.plano]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
