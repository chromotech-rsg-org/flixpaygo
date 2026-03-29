import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getTenant, getTenantBySlug, getSubscribers, setSubscribers, getInvoices, getPlans, getUsers, setUsers } from '@/lib/storage';
import { useTenantMeta } from '@/hooks/useTenantMeta';
import { PLAN_FEATURES } from '@/lib/plan-features';
import { PlanType, Subscriber } from '@/lib/types';
import { motion } from 'framer-motion';
import { ExternalLink, CreditCard, FileText, Calendar, LogOut, Sun, Moon, Camera, Eye, EyeOff, Check, X, Edit, Save } from 'lucide-react';
import { UpsellLock } from '@/components/UpsellLock';
import { LOGO_FLIXPAY } from '@/lib/constants';
import { toast } from 'sonner';

const passwordChecks = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: '1 letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: '1 letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: '1 número', test: (p: string) => /\d/.test(p) },
  { label: '1 caractere especial', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export default function MinhaContaPage() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const { slug } = useParams();

  const tenant = slug ? getTenantBySlug(slug) : (user?.tenantId ? getTenant(user.tenantId) : null);
  useTenantMeta(tenant, 'Minha Conta');

  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [changingCard, setChangingCard] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [currentPwInput, setCurrentPwInput] = useState('');

  if (!tenant) return <p className="text-muted-foreground p-8">Tenant não encontrado.</p>;

  const plan = tenant.plano as PlanType;
  const features = PLAN_FEATURES[plan];
  const subscribers = getSubscribers(tenant.id);
  const subscriber = subscribers.find(s => s.email === user?.email) || subscribers[0];
  if (!subscriber) return <p className="text-muted-foreground p-8">Assinante não encontrado.</p>;

  const invoices = getInvoices(tenant.id).filter(i => i.subscriberId === subscriber.id);
  const plans = getPlans(tenant.id);
  const currentPlan = plans.find(p => p.id === subscriber.planId);

  const [editName, setEditName] = useState(subscriber.name);
  const [editPhone, setEditPhone] = useState(subscriber.phone);

  const statusLabel: Record<string, string> = { active: 'Ativo', inactive: 'Inativo', overdue: 'Inadimplente', cancelled: 'Cancelado' };
  const statusColor: Record<string, string> = {
    active: 'bg-green-500/20 text-green-600 dark:text-green-400', inactive: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
    overdue: 'bg-red-500/20 text-red-600 dark:text-red-400', cancelled: 'bg-red-500/20 text-red-600 dark:text-red-400',
  };
  const invStatusLabel: Record<string, string> = { paid: 'Pago', pending: 'Pendente', overdue: 'Vencido', cancelled: 'Cancelado', refunded: 'Estornado' };
  const invStatusColor: Record<string, string> = {
    paid: 'bg-green-500/20 text-green-600 dark:text-green-400', pending: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    overdue: 'bg-red-500/20 text-red-600 dark:text-red-400', cancelled: 'bg-gray-500/20 text-gray-600 dark:text-gray-400', refunded: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  };

  const handleLogout = () => {
    logout({ type: 'subscriber', slug });
    window.location.href = slug ? `/${slug}/login` : '/login';
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const subs = getSubscribers(tenant.id);
      const idx = subs.findIndex(s => s.id === subscriber.id);
      if (idx >= 0) { subs[idx].photoUrl = reader.result as string; setSubscribers(tenant.id, subs); }
      toast.success('Foto atualizada!');
      window.location.reload();
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const subs = getSubscribers(tenant.id);
    const idx = subs.findIndex(s => s.id === subscriber.id);
    if (idx >= 0) { subs[idx].name = editName; subs[idx].phone = editPhone; setSubscribers(tenant.id, subs); }
    setEditingProfile(false);
    toast.success('Perfil atualizado!');
  };

  const pwChecks = passwordChecks.map(c => ({ ...c, passed: c.test(newPw) }));
  const allPwPassed = pwChecks.every(c => c.passed);
  const pwMatch = newPw === confirmPw && confirmPw.length > 0;

  const handleChangePw = () => {
    if (subscriber.password && currentPwInput !== subscriber.password) { toast.error('Senha atual incorreta'); return; }
    const subs = getSubscribers(tenant.id);
    const idx = subs.findIndex(s => s.id === subscriber.id);
    if (idx >= 0) { subs[idx].password = newPw; setSubscribers(tenant.id, subs); }
    const users = getUsers();
    const uidx = users.findIndex(u => u.email === subscriber.email);
    if (uidx >= 0) { users[uidx].password = newPw; setUsers(users); }
    setChangingPw(false); setNewPw(''); setConfirmPw(''); setCurrentPwInput('');
    toast.success('Senha alterada!');
  };

  const handleCancelPlan = () => {
    if (!confirm('Deseja cancelar sua assinatura? Você manterá o acesso até o fim do período atual.')) return;
    const subs = getSubscribers(tenant.id);
    const idx = subs.findIndex(s => s.id === subscriber.id);
    if (idx >= 0) { subs[idx].subscriptionStatus = 'cancelled'; setSubscribers(tenant.id, subs); }
    toast.success('Cancelamento solicitado');
    window.location.reload();
  };

  const handleUpgrade = (planId: string) => {
    const subs = getSubscribers(tenant.id);
    const idx = subs.findIndex(s => s.id === subscriber.id);
    if (idx >= 0) { subs[idx].planId = planId; subs[idx].subscriptionStatus = 'active'; setSubscribers(tenant.id, subs); }
    toast.success('Plano atualizado!');
    window.location.reload();
  };

  const pc = tenant.theme.primaryColor;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {tenant.logoUrl ? <img src={tenant.logoUrl} alt={tenant.name} className="h-8" /> : <span className="font-black text-primary text-xl">{tenant.name}</span>}
        </div>
        <div className="flex items-center gap-3">
          {tenant.dominio.streamingPortalUrl && (
            <a href={tenant.dominio.streamingPortalUrl} target="_blank" rel="noopener noreferrer" className="btn-brand flex items-center gap-2 text-sm !py-2">
              <ExternalLink size={14} /> Acessar Streaming
            </a>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl overflow-hidden">
              {subscriber.photoUrl ? <img src={subscriber.photoUrl} alt="" className="w-full h-full object-cover" /> : subscriber.name.charAt(0)}
            </div>
            <label className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
              <Camera size={12} />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Minha Conta</h1>
            <p className="text-muted-foreground text-sm">Olá, {subscriber.name}!</p>
          </div>
        </motion.div>

        {subscriber.subscriptionStatus === 'cancelled' && (
          <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
            <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">⚠️ Cancelamento solicitado — Você mantém o acesso até o fim do período atual.</p>
          </div>
        )}

        {/* Profile edit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Dados Pessoais</h2>
            {!editingProfile ? (
              <button onClick={() => setEditingProfile(true)} className="text-xs text-primary hover:underline flex items-center gap-1"><Edit size={12} /> Editar</button>
            ) : (
              <button onClick={handleSaveProfile} className="text-xs text-primary hover:underline flex items-center gap-1"><Save size={12} /> Salvar</button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Nome</p>
              {editingProfile ? (
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm" />
              ) : <p className="font-semibold">{subscriber.name}</p>}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">E-mail</p>
              <p className="font-semibold text-muted-foreground">{subscriber.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">CPF</p>
              <p className="font-semibold text-muted-foreground">{subscriber.cpf}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Telefone</p>
              {editingProfile ? (
                <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm" />
              ) : <p className="font-semibold">{subscriber.phone}</p>}
            </div>
          </div>
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
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-2xl font-black">R$ {currentPlan.price.toFixed(2)}<span className="text-sm text-muted-foreground font-normal">/mês</span></p>
              {subscriber.cardLast4 && <p className="text-xs text-muted-foreground">•••• {subscriber.cardLast4}</p>}
            </div>
          )}
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Segurança</h2>
            {!changingPw && <button onClick={() => setChangingPw(true)} className="text-xs text-primary hover:underline">Alterar senha</button>}
          </div>
          {changingPw && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Senha atual</label>
                <input type="password" value={currentPwInput} onChange={e => setCurrentPwInput(e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nova senha</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="mt-2 space-y-1">
                  {pwChecks.map((c, i) => (
                    <div key={i} className={`flex items-center gap-1.5 text-xs ${c.passed ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {c.passed ? <Check size={10} /> : <X size={10} />} {c.label}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Confirmar nova senha</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" />
                {confirmPw && !pwMatch && <p className="text-xs text-destructive mt-1">Senhas não coincidem</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setChangingPw(false); setNewPw(''); setConfirmPw(''); }} className="px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm">Cancelar</button>
                <button onClick={handleChangePw} disabled={!allPwPassed || !pwMatch} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold disabled:opacity-40">Salvar</button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Upgrade/Downgrade (Pro+) */}
        {features.subscriberSelfUpgrade ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Trocar de Plano</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {plans.filter(p => p.active).map(p => (
                <div key={p.id} className={`p-4 rounded-xl border-2 transition-all ${p.id === subscriber.planId ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30 cursor-pointer'}`}
                  onClick={() => p.id !== subscriber.planId && handleUpgrade(p.id)}>
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

        {/* Change Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Forma de Pagamento</h2>
            <button onClick={() => setChangingCard(!changingCard)} className="text-xs text-primary hover:underline">
              {changingCard ? 'Cancelar' : 'Trocar cartão'}
            </button>
          </div>
          {subscriber.cardLast4 && !changingCard && (
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-muted-foreground" />
              <p className="text-sm">Cartão terminando em <span className="font-bold">{subscriber.cardLast4}</span></p>
            </div>
          )}
          {changingCard && (
            <div className="space-y-3">
              <input className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" placeholder="Número do cartão" />
              <div className="grid grid-cols-2 gap-3">
                <input className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" placeholder="MM/AA" />
                <input className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" placeholder="CVV" />
              </div>
              <input className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" placeholder="Nome no cartão" />
              <button onClick={() => { setChangingCard(false); toast.success('Cartão atualizado!'); }} className="btn-brand text-sm">Salvar cartão</button>
            </div>
          )}
        </motion.div>

        {/* Referral (Ultra) */}
        {features.subscriberReferral ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Programa de Indicação</h2>
            <p className="text-sm text-muted-foreground mb-3">Compartilhe seu link e ganhe descontos!</p>
            <div className="flex gap-2">
              <input readOnly value={`https://${tenant.dominio.subdomain}/ref/${subscriber.id.slice(0, 8)}`}
                className="flex-1 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm" />
              <button onClick={() => { navigator.clipboard.writeText(`https://${tenant.dominio.subdomain}/ref/${subscriber.id.slice(0, 8)}`); toast.success('Copiado!'); }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold">Copiar</button>
            </div>
          </motion.div>
        ) : plan !== 'ultra' ? (
          <UpsellLock featureName="Programa de Indicação (Referral)" requiredPlan="ultra" currentPlan={plan} />
        ) : null}

        {/* Cancel */}
        {subscriber.subscriptionStatus !== 'cancelled' && (
          <div className="text-center py-4">
            <button onClick={handleCancelPlan} className="text-sm text-muted-foreground hover:text-destructive transition-colors">
              Cancelar minha assinatura
            </button>
          </div>
        )}
      </div>

      <footer className="border-t border-border py-4 text-center opacity-40">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Powered by </span>
        <img src={LOGO_FLIXPAY} alt="FlixPay" className="h-3 inline" />
      </footer>
    </div>
  );
}
