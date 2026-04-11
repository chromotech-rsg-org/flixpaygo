import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTenantBySlug, getPlans, getSubscribers, setSubscribers, getInvoices, setInvoices, getUsers, setUsers } from '@/lib/storage';
import { useTenantMeta } from '@/hooks/useTenantMeta';
import { Subscriber, Invoice, User } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, EyeOff, ChevronRight, ChevronLeft, CreditCard, Shield, User as UserIcon, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { LOGO_FLIXPAY } from '@/lib/constants';

function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(clean[i]) * (10 - i);
  let d1 = 11 - (sum % 11); if (d1 >= 10) d1 = 0;
  if (Number(clean[9]) !== d1) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(clean[i]) * (11 - i);
  let d2 = 11 - (sum % 11); if (d2 >= 10) d2 = 0;
  return Number(clean[10]) === d2;
}

function formatCPF(v: string) {
  const n = v.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `${n.slice(0,3)}.${n.slice(3)}`;
  if (n.length <= 9) return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6)}`;
  return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9)}`;
}

function formatPhone(v: string) {
  const n = v.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 2) return n.length ? `(${n}` : '';
  if (n.length <= 7) return `(${n.slice(0,2)}) ${n.slice(2)}`;
  return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
}

const passwordChecks = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: '1 letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: '1 letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: '1 número', test: (p: string) => /\d/.test(p) },
  { label: '1 caractere especial', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export default function SignupPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const tenant = slug ? getTenantBySlug(slug) : null;
  useTenantMeta(tenant, 'Assinar');

  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Step 2
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 3
  const [selectedPlan, setSelectedPlan] = useState('');

  // Step 4
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [processing, setProcessing] = useState(false);

  const plans = tenant ? getPlans(tenant.id).filter(p => p.active) : [];
  const pc = tenant?.theme.primaryColor || '#E50914';

  // Real-time CPF validation
  useEffect(() => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length === 11) {
      if (!validateCPF(cpf)) { setCpfError('CPF inválido'); return; }
      const allSubs = tenant ? getSubscribers(tenant.id) : [];
      if (allSubs.some(s => s.cpf.replace(/\D/g, '') === clean)) { setCpfError('CPF já cadastrado'); return; }
      setCpfError('');
    } else { setCpfError(''); }
  }, [cpf, tenant]);

  // Real-time email validation
  useEffect(() => {
    if (!email) { setEmailError(''); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('E-mail inválido'); return; }
    const allSubs = tenant ? getSubscribers(tenant.id) : [];
    if (allSubs.some(s => s.email === email)) { setEmailError('E-mail já cadastrado'); return; }
    setEmailError('');
  }, [email, tenant]);

  const pwChecks = passwordChecks.map(c => ({ ...c, passed: c.test(password) }));
  const allPwPassed = pwChecks.every(c => c.passed);
  const pwMatch = password === confirmPw && confirmPw.length > 0;

  const step1Valid = name.trim() && cpf.replace(/\D/g, '').length === 11 && !cpfError && email && !emailError && phone.replace(/\D/g, '').length >= 10;
  const step2Valid = allPwPassed && pwMatch;
  const step3Valid = !!selectedPlan;
  const step4Valid = cardNumber.replace(/\D/g, '').length >= 13 && cardExpiry.length >= 5 && cardCvv.length >= 3 && cardHolder.trim().length > 2;

  const handleFinalize = () => {
    if (!tenant || !selectedPlan) return;
    setProcessing(true);
    setTimeout(() => {
      const subId = crypto.randomUUID();
      const plan = plans.find(p => p.id === selectedPlan)!;

      // Create subscriber
      const subs = getSubscribers(tenant.id);
      const newSub: Subscriber = {
        id: subId, tenantId: tenant.id, name, email, cpf, phone,
        asaasCustomerId: `cus_${subId.slice(0,8)}`, streamingUserId: `user_${subId.slice(0,8)}`,
        planId: selectedPlan, subscriptionStatus: 'active', subscriptionId: crypto.randomUUID(),
        nextBillingDate: new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(), password, paymentMethod: 'credit_card',
        cardLast4: cardNumber.replace(/\D/g, '').slice(-4),
      };
      subs.push(newSub);
      setSubscribers(tenant.id, subs);

      // Create invoice
      const invs = getInvoices(tenant.id);
      invs.push({
        id: crypto.randomUUID(), subscriberId: subId, tenantId: tenant.id,
        amount: plan.price, status: 'paid', dueDate: new Date().toISOString().split('T')[0],
        paidAt: new Date().toISOString(), asaasPaymentId: `pay_${crypto.randomUUID().slice(0,8)}`,
        paymentMethod: 'credit_card',
      });
      setInvoices(tenant.id, invs);

      // Create user for login
      const users = getUsers();
      users.push({ id: subId, role: 'subscriber', email, password, name, tenantId: tenant.id });
      setUsers(users);

      setProcessing(false);
      toast.success('Assinatura realizada com sucesso!');
      navigate(`/${slug}/minha-conta`);
    }, 2000);
  };

  if (!tenant) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Streaming não encontrado.</p></div>;
  }

  const steps = ['Dados Pessoais', 'Login e Senha', 'Escolha o Plano', 'Pagamento'];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-[120px] pointer-events-none" style={{ background: pc }} />

      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link to={`/${slug}`}>
            {(tenant.logoSystemUrl || tenant.logoUrl) ? <img src={tenant.logoSystemUrl || tenant.logoUrl} alt={tenant.name} className="h-8" /> : <span className="font-black text-xl" style={{ color: pc }}>{tenant.name}</span>}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to={`/${slug}`} className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
          <Link to={`/${slug}/login`} className="text-sm text-muted-foreground hover:text-foreground">Já tenho conta</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i + 1 < step ? 'text-white' : i + 1 === step ? 'text-white' : 'bg-secondary/50 text-muted-foreground'
              }`} style={i + 1 <= step ? { background: pc } : {}}>
                {i + 1 < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs hidden md:inline ${i + 1 === step ? 'font-bold' : 'text-muted-foreground'}`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2"><UserIcon size={20} style={{ color: pc }} /><h2 className="text-lg font-bold">Dados Pessoais</h2></div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Nome completo *</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="Seu nome completo" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">CPF *</label>
                <input value={cpf} onChange={e => setCpf(formatCPF(e.target.value))}
                  className={`w-full px-4 py-3 bg-secondary/50 border rounded-lg text-sm focus:outline-none ${cpfError ? 'border-destructive' : 'border-border focus:border-primary'}`} placeholder="000.000.000-00" />
                {cpfError && <p className="text-xs text-destructive mt-1">{cpfError}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">E-mail *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 bg-secondary/50 border rounded-lg text-sm focus:outline-none ${emailError ? 'border-destructive' : 'border-border focus:border-primary'}`} placeholder="seu@email.com" />
                {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Telefone *</label>
                <input value={phone} onChange={e => setPhone(formatPhone(e.target.value))}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="(11) 99999-9999" />
              </div>
              <button onClick={() => setStep(2)} disabled={!step1Valid}
                className="w-full py-3 rounded-lg font-bold text-white text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ background: step1Valid ? pc : undefined }}>
                Continuar <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2"><Lock size={20} style={{ color: pc }} /><h2 className="text-lg font-bold">Login e Senha</h2></div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">E-mail (login)</label>
                <input value={email} readOnly className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-sm text-muted-foreground" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Senha *</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary pr-12" placeholder="Crie uma senha forte" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-3 space-y-1.5">
                  {pwChecks.map((c, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs transition-colors ${c.passed ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {c.passed ? <Check size={12} /> : <X size={12} />} {c.label}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Confirmar senha *</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                    className={`w-full px-4 py-3 bg-secondary/50 border rounded-lg text-sm focus:outline-none ${confirmPw && !pwMatch ? 'border-destructive' : 'border-border focus:border-primary'} pr-12`} placeholder="Confirme sua senha" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPw && !pwMatch && <p className="text-xs text-destructive mt-1">As senhas não coincidem</p>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg font-bold text-sm border border-border hover:bg-secondary/30 flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> Voltar
                </button>
                <button onClick={() => setStep(3)} disabled={!step2Valid}
                  className="flex-1 py-3 rounded-lg font-bold text-white text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: step2Valid ? pc : undefined }}>
                  Continuar <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2"><Shield size={20} style={{ color: pc }} /><h2 className="text-lg font-bold">Escolha seu Plano</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map(plan => (
                  <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${selectedPlan === plan.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}
                    style={selectedPlan === plan.id ? { borderColor: pc } : {}}>
                    {plan.highlight && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white mb-2 inline-block" style={{ background: pc }}>Popular</span>}
                    <h3 className="text-lg font-black">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <p className="text-2xl font-black mt-3" style={selectedPlan === plan.id ? { color: pc } : {}}>
                      R$ {plan.price.toFixed(2)}<span className="text-xs text-muted-foreground font-normal">/mês</span>
                    </p>
                    <div className="mt-3 space-y-1">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs"><Check size={10} style={{ color: pc }} />{f}</div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg font-bold text-sm border border-border hover:bg-secondary/30 flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> Voltar
                </button>
                <button onClick={() => setStep(4)} disabled={!step3Valid}
                  className="flex-1 py-3 rounded-lg font-bold text-white text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: step3Valid ? pc : undefined }}>
                  Continuar <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2"><CreditCard size={20} style={{ color: pc }} /><h2 className="text-lg font-bold">Pagamento</h2></div>

              {/* Plan summary */}
              {selectedPlan && (() => {
                const plan = plans.find(p => p.id === selectedPlan);
                return plan ? (
                  <div className="p-4 rounded-xl border border-border bg-secondary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </div>
                      <p className="text-xl font-black" style={{ color: pc }}>R$ {plan.price.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/mês</span></p>
                    </div>
                  </div>
                ) : null;
              })()}

              <div className="space-y-4 p-4 rounded-xl border border-border">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Shield size={12} /> Pagamento seguro — Checkout transparente
                </p>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Número do cartão</label>
                  <input value={cardNumber} onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                    setCardNumber(v.replace(/(\d{4})/g, '$1 ').trim());
                  }} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Validade</label>
                    <input value={cardExpiry} onChange={e => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length > 2) v = `${v.slice(0,2)}/${v.slice(2)}`;
                      setCardExpiry(v);
                    }} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="MM/AA" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">CVV</label>
                    <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} type="password"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="•••" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Nome no cartão</label>
                  <input value={cardHolder} onChange={e => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="NOME COMO NO CARTÃO" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg font-bold text-sm border border-border hover:bg-secondary/30 flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> Voltar
                </button>
                <button onClick={handleFinalize} disabled={!step4Valid || processing}
                  className="flex-1 py-3 rounded-lg font-bold text-white text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: step4Valid && !processing ? pc : undefined }}>
                  {processing ? 'Processando...' : 'Finalizar Assinatura'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="border-t border-border py-4 text-center opacity-40 hover:opacity-70 transition-opacity mt-12">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Powered by </span>
        <Link to="/"><img src={LOGO_FLIXPAY} alt="FlixPay" className="h-3 inline" /></Link>
      </footer>
    </div>
  );
}
