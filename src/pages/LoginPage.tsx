import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { LOGO_FLIXPAY, LOGO_RSG, LOGO_CHROMOTECH } from '@/lib/constants';

const DEFAULT_LOGIN_IMAGE = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=1600&fit=crop&q=80';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.success) { setError(res.error || 'Erro'); return; }
    navigate(res.redirectTo || '/superadmin');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left — Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={DEFAULT_LOGIN_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 z-10">
          <img src={LOGO_FLIXPAY} alt="FlixPay" className="h-10 mb-4 opacity-80" />
          <p className="text-sm text-white/60 max-w-xs">Plataforma white-label de gestão de assinaturas para streaming.</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-[120px]" style={{ background: 'hsl(var(--primary))' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md mx-4">
          <div className="glass-card p-8 rounded-2xl">
            <div className="text-center mb-8">
              <img src={LOGO_FLIXPAY} alt="FlixPay" className="h-12 mx-auto mb-4 lg:hidden" />
              <h1 className="text-2xl font-black uppercase tracking-tight hidden lg:block mb-2">Painel SuperAdmin</h1>
              <p className="text-muted-foreground text-sm lg:hidden">Painel SuperAdmin</p>
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

              <button type="submit" className="btn-brand w-full flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                <LogIn size={18} /> Entrar
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">Contas de demonstração:</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between"><span className="font-medium text-foreground">SuperAdmin</span><span>admin@flixpay.app / flixpay2024</span></div>
                <div className="flex justify-between"><span className="font-medium text-foreground">Tenant Admin</span><span>admin@darkflix.com.br / darkflix123</span></div>
                <div className="flex justify-between"><span className="font-medium text-foreground">Assinante</span><span>joao@email.com / 123456</span></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 opacity-50 hover:opacity-80 transition-opacity">
            <img src={LOGO_RSG} alt="RSG Group" className="h-6 grayscale hover:grayscale-0 transition-all" />
            <span className="text-muted-foreground text-xs">×</span>
            <img src={LOGO_CHROMOTECH} alt="Chromotech" className="h-6 grayscale hover:grayscale-0 transition-all" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
