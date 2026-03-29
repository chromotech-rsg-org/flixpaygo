import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getTenantBySlug } from '@/lib/storage';
import { useTenantMeta } from '@/hooks/useTenantMeta';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { LOGO_FLIXPAY } from '@/lib/constants';

export default function TenantLoginPage() {
  const { slug } = useParams();
  const tenant = slug ? getTenantBySlug(slug) : null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  useTenantMeta(tenant, 'Login');

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-black text-foreground">Portal não encontrado</h1>
          <p className="text-muted-foreground mt-2">Verifique o endereço e tente novamente.</p>
        </div>
      </div>
    );
  }

  const pc = tenant.theme.primaryColor;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(email, password, { type: 'tenant', slug });
    if (!res.success) { setError(res.error || 'Erro'); return; }
    navigate(res.redirectTo || `/${slug}/admin`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15 blur-[120px]" style={{ background: pc }} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-10 blur-[100px]" style={{ background: pc }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md mx-4">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            {tenant.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant.name} className="h-14 mx-auto mb-4 object-contain" />
            ) : (
              <h1 className="text-3xl font-black mb-4" style={{ color: pc }}>{tenant.name}</h1>
            )}
            <p className="text-muted-foreground text-sm">Acesse sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="seu@email.com" required />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">Senha</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive text-center">{error}</motion.p>}

            <button type="submit" className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              style={{ background: pc, boxShadow: `0 0 20px ${pc}40` }}>
              <LogIn size={18} /> Entrar
            </button>
          </form>
        </div>

        <div className="mt-6 text-center opacity-40">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Powered by </span>
          <img src={LOGO_FLIXPAY} alt="FlixPay" className="h-3.5 inline ml-1" />
        </div>
      </motion.div>
    </div>
  );
}
