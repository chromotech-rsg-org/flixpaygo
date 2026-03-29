import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTenant, getSubscribers, getInvoices, getPlans } from '@/lib/storage';
import { PLAN_FEATURES } from '@/lib/plan-features';
import { PlanType } from '@/lib/types';
import { motion } from 'framer-motion';
import { ExternalLink, CreditCard, FileText, Calendar, ArrowUpRight, LogOut, Sun, Moon } from 'lucide-react';
import { UpsellLock } from '@/components/UpsellLock';

export default function MinhaContaPage() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;
  if (!tenant) return <p className="text-muted-foreground p-8">Tenant não encontrado.</p>;

  const plan = tenant.plano as PlanType;
  const features = PLAN_FEATURES[plan];
  const subscribers = getSubscribers(tenant.id);
  const subscriber = subscribers.find(s => s.email === user?.email) || subscribers[0];
  if (!subscriber) return <p className="text-muted-foreground p-8">Assinante não encontrado.</p>;

  const invoices = getInvoices(tenant.id).filter(i => i.subscriberId === subscriber.id);
  const plans = getPlans(tenant.id);
  const currentPlan = plans.find(p => p.id === subscriber.planId);

  const statusLabel: Record<string, string> = {
    active: 'Ativo', inactive: 'Inativo', overdue: 'Inadimplente', cancelled: 'Cancelado',
  };
  const statusColor: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400', inactive: 'bg-gray-500/20 text-gray-400',
    overdue: 'bg-red-500/20 text-red-400', cancelled: 'bg-red-500/20 text-red-400',
  };
  const invStatusLabel: Record<string, string> = {
    paid: 'Pago', pending: 'Pendente', overdue: 'Vencido', cancelled: 'Cancelado', refunded: 'Estornado',
  };
  const invStatusColor: Record<string, string> = {
    paid: 'bg-green-500/20 text-green-400', pending: 'bg-yellow-500/20 text-yellow-400',
    overdue: 'bg-red-500/20 text-red-400', cancelled: 'bg-gray-500/20 text-gray-400', refunded: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.name} className="h-8" />
          ) : (
            <span className="font-black text-primary text-xl">{tenant.name}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {tenant.dominio.streamingPortalUrl && (
            <a href={tenant.dominio.streamingPortalUrl} target="_blank" rel="noopener noreferrer"
              className="btn-brand flex items-center gap-2 text-sm !py-2">
              <ExternalLink size={14} /> Acessar Streaming
            </a>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={logout} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black uppercase tracking-tight">Minha Conta</h1>
          <p className="text-muted-foreground text-sm">Olá, {subscriber.name}!</p>
        </motion.div>

        {/* Subscription summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Sua Assinatura</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Plano</p>
              <p className="text-lg font-black text-primary">{currentPlan?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${statusColor[subscriber.subscriptionStatus]}`}>
                {statusLabel[subscriber.subscriptionStatus]}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Próxima Cobrança</p>
              <p className="font-semibold flex items-center gap-1"><Calendar size={14} /> {subscriber.nextBillingDate}</p>
            </div>
          </div>
          {currentPlan && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-2xl font-black">R$ {currentPlan.price.toFixed(2)}<span className="text-sm text-muted-foreground font-normal">/mês</span></p>
            </div>
          )}
        </motion.div>

        {/* Upgrade/Downgrade (Pro+) */}
        {features.subscriberSelfUpgrade ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Trocar de Plano</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {plans.filter(p => p.active).map(p => (
                <div key={p.id} className={`p-4 rounded-xl border-2 transition-all ${p.id === subscriber.planId ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30 cursor-pointer'}`}>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-lg font-black text-primary mt-1">R$ {p.price.toFixed(2)}<span className="text-xs text-muted-foreground font-normal">/mês</span></p>
                  {p.id === subscriber.planId && <p className="text-[10px] text-primary font-bold uppercase mt-2">Plano atual</p>}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <UpsellLock featureName="Upgrade/Downgrade self-service" requiredPlan="pro" currentPlan={plan} />
        )}

        {/* Invoices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Histórico de Faturas</h2>
          <div className="space-y-2">
            {invoices.slice(0, 10).map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">R$ {inv.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Vencimento: {inv.dueDate}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${invStatusColor[inv.status]}`}>
                  {invStatusLabel[inv.status]}
                </span>
              </div>
            ))}
            {invoices.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma fatura encontrada.</p>}
          </div>
        </motion.div>

        {/* Referral (Ultra) */}
        {features.subscriberReferral ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Programa de Indicação</h2>
            <p className="text-sm text-muted-foreground mb-3">Compartilhe seu link e ganhe descontos!</p>
            <div className="flex gap-2">
              <input readOnly value={`https://${tenant.dominio.subdomain}/ref/${subscriber.id.slice(0, 8)}`}
                className="flex-1 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" />
              <button onClick={() => { navigator.clipboard.writeText(`https://${tenant.dominio.subdomain}/ref/${subscriber.id.slice(0, 8)}`); }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">Copiar</button>
            </div>
          </motion.div>
        ) : plan !== 'ultra' ? (
          <UpsellLock featureName="Programa de Indicação (Referral)" requiredPlan="ultra" currentPlan={plan} />
        ) : null}

        {/* Cancel */}
        <div className="text-center py-4">
          <button className="text-sm text-muted-foreground hover:text-destructive transition-colors">
            Cancelar minha assinatura
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center opacity-40">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Powered by </span>
        <img src="https://chromotech.com.br/wp-content/uploads/2026/03/Logo-Flixpay-1080-x-300-px.png" alt="FlixPay" className="h-3 inline" />
      </footer>
    </div>
  );
}
