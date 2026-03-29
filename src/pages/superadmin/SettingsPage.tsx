import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Save, Palette, Bell, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, theme, toggleTheme } = useAuth();
  const [companyName, setCompanyName] = useState('FlixPay');
  const [companyEmail, setCompanyEmail] = useState('contato@flixpay.app');
  const [companyPhone, setCompanyPhone] = useState('(11) 96916-9869');
  const [whatsappNumber, setWhatsappNumber] = useState('5511969169869');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [autoSuspend, setAutoSuspend] = useState(true);
  const [suspendDays, setSuspendDays] = useState(15);

  const handleSave = () => {
    localStorage.setItem('flixpay:settings', JSON.stringify({
      companyName, companyEmail, companyPhone, whatsappNumber, emailNotifs, autoSuspend, suspendDays,
    }));
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black uppercase tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-sm">Configurações gerais da plataforma FlixPay</p>
      </motion.div>

      {/* General */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Dados da Empresa</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">Nome</label>
            <input value={companyName} onChange={e => setCompanyName(e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">Email</label>
            <input value={companyEmail} onChange={e => setCompanyEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">Telefone</label>
            <input value={companyPhone} onChange={e => setCompanyPhone(e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">WhatsApp (sem +)</label>
            <input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Aparência</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Tema</p>
            <p className="text-xs text-muted-foreground">Alterne entre claro e escuro</p>
          </div>
          <button onClick={toggleTheme} className="px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm font-semibold hover:bg-secondary transition-colors">
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Notificações</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Notificações por email</p>
            <p className="text-xs text-muted-foreground">Receber alertas de inadimplência e novos cadastros</p>
          </div>
          <button onClick={() => setEmailNotifs(!emailNotifs)}
            className={`w-12 h-6 rounded-full transition-all relative ${emailNotifs ? 'bg-primary' : 'bg-secondary'}`}>
            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${emailNotifs ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Políticas</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Suspensão automática</p>
            <p className="text-xs text-muted-foreground">Suspender tenants inadimplentes automaticamente</p>
          </div>
          <button onClick={() => setAutoSuspend(!autoSuspend)}
            className={`w-12 h-6 rounded-full transition-all relative ${autoSuspend ? 'bg-primary' : 'bg-secondary'}`}>
            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${autoSuspend ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        {autoSuspend && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">Dias de tolerância</label>
            <input type="number" value={suspendDays} onChange={e => setSuspendDays(Number(e.target.value))}
              className="w-24 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        )}
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 rounded-xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Conta</h2>
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
          <p><span className="text-muted-foreground">Role:</span> <span className="text-primary font-bold uppercase">{user?.role}</span></p>
        </div>
      </motion.div>

      <button onClick={handleSave} className="btn-brand flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
        <Save size={16} /> Salvar Configurações
      </button>
    </div>
  );
}
