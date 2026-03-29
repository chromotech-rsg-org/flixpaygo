import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTenant } from '@/lib/storage';
import { motion } from 'framer-motion';
import { Save, Building2, Globe, Palette, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function TenantSettingsPage() {
  const { user } = useAuth();
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;

  const [companyName] = useState(tenant?.name || '');
  const [email, setEmail] = useState(tenant?.email || '');
  const [phone, setPhone] = useState(tenant?.phone || '');
  const [website, setWebsite] = useState(tenant?.website || '');
  const [notifyNewSub, setNotifyNewSub] = useState(true);
  const [notifyOverdue, setNotifyOverdue] = useState(true);

  const handleSave = () => {
    toast.success('Configurações salvas!');
  };

  if (!tenant) return <p className="text-muted-foreground p-8">Tenant não encontrado.</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black uppercase tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-sm">Gerencie as configurações de {tenant.name}</p>
      </motion.div>

      {/* Company Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Building2 size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Dados da Empresa</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">Nome</label>
            <input value={companyName} readOnly className="w-full px-3 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm opacity-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">CNPJ</label>
            <input value={tenant.cpfCnpj} readOnly className="w-full px-3 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm opacity-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">Telefone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">Website</label>
            <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
      </motion.div>

      {/* Domain Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Domínio & Streaming</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Subdomínio</p>
            <p className="font-semibold">{tenant.dominio.subdomain || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Domínio Custom</p>
            <p className="font-semibold">{tenant.dominio.customDomain || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">DNS Status</p>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
              tenant.dominio.dnsStatus === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>{tenant.dominio.dnsStatus}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Portal Streaming</p>
            <a href={tenant.dominio.streamingPortalUrl} target="_blank" className="text-primary hover:underline">{tenant.dominio.streamingPortalUrl || '-'}</a>
          </div>
        </div>
      </motion.div>

      {/* Plan Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-xl space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Palette size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Plano & Licença</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Plano</p>
            <span className="text-primary font-black uppercase text-lg">{tenant.plano}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mensalidade</p>
            <p className="font-bold text-lg">R$ {tenant.financeiro.licencaValorMensal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status Licença</p>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
              tenant.financeiro.licencaStatus === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>{tenant.financeiro.licencaStatus}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Para alterar seu plano, entre em contato com o suporte FlixPay.</p>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Notificações</h2>
        </div>
        {[
          { label: 'Novo assinante', desc: 'Receber alerta quando um novo assinante se cadastrar', val: notifyNewSub, set: setNotifyNewSub },
          { label: 'Inadimplência', desc: 'Receber alerta de faturas vencidas', val: notifyOverdue, set: setNotifyOverdue },
        ].map(n => (
          <div key={n.label} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{n.label}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
            </div>
            <button onClick={() => n.set(!n.val)}
              className={`w-12 h-6 rounded-full transition-all relative ${n.val ? 'bg-primary' : 'bg-secondary'}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${n.val ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </motion.div>

      <button onClick={handleSave} className="btn-brand flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
        <Save size={16} /> Salvar
      </button>
    </div>
  );
}
