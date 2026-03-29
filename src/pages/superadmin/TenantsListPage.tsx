import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTenants, deleteTenant, getSubscribers } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { PLAN_NAMES } from '@/lib/plan-features';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit, Copy, LogIn, Building2 } from 'lucide-react';
import { Tenant, PlanType, LicenseStatus } from '@/lib/types';
import { toast } from 'sonner';

export default function TenantsListPage() {
  const [tenants, setTenants] = useState(getTenants());
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<PlanType | ''>('');
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | ''>('');
  const navigate = useNavigate();
  const { impersonate } = useAuth();

  const filtered = tenants.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.cpfCnpj.includes(search)) return false;
    if (planFilter && t.plano !== planFilter) return false;
    if (statusFilter && t.financeiro.licencaStatus !== statusFilter) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    if (!confirm('Excluir este tenant?')) return;
    deleteTenant(id);
    setTenants(getTenants());
    toast.success('Tenant excluído');
  };

  const handleDuplicate = (t: Tenant) => {
    const newT: Tenant = {
      ...t,
      id: crypto.randomUUID(),
      name: `${t.name} (Cópia)`,
      razaoSocial: '',
      cpfCnpj: '',
      email: '',
      phone: '',
      responsavel: { nome: '', cpf: '', email: '', phone: '', cargo: '' },
      dominio: { ...t.dominio, slug: `${t.dominio.slug}-copy`, subdomain: `${t.dominio.slug}-copy.flixpay.app`, customDomain: '', minhaConta: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const all = getTenants();
    all.push(newT);
    import('@/lib/storage').then(s => s.setTenants(all));
    setTenants([...all]);
    toast.success('Tenant duplicado');
  };

  const handleImpersonate = (tid: string) => {
    impersonate(tid);
    navigate('/admin');
  };

  const statusBadge = (s: LicenseStatus) => {
    const map: Record<LicenseStatus, string> = {
      ativo: 'bg-green-500/20 text-green-400',
      inadimplente: 'bg-red-500/20 text-red-400',
      suspenso: 'bg-gray-500/20 text-gray-400',
      trial: 'bg-blue-500/20 text-blue-400',
    };
    return map[s] || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Tenants</h1>
          <p className="text-muted-foreground text-sm">{tenants.length} empresas cadastradas</p>
        </div>
        <button onClick={() => navigate('/superadmin/tenants/novo')} className="btn-brand flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Tenant
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="Buscar por nome ou CNPJ..." />
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value as any)} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
          <option value="">Todos os planos</option>
          <option value="start">Start</option>
          <option value="pro">Pro</option>
          <option value="ultra">Ultra</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inadimplente">Inadimplente</option>
          <option value="suspenso">Suspenso</option>
          <option value="trial">Trial</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Empresa</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plano</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Assinantes</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Vencimento</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const subsCount = getSubscribers(t.id).length;
                return (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.cpfCnpj}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        t.plano === 'ultra' ? 'bg-yellow-500/20 text-yellow-400' :
                        t.plano === 'pro' ? 'bg-primary/20 text-primary' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>{PLAN_NAMES[t.plano]}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${statusBadge(t.financeiro.licencaStatus)}`}>
                        {t.financeiro.licencaStatus}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{subsCount}</td>
                    <td className="p-4 text-muted-foreground">Dia {t.financeiro.licencaVencimentoDia}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/superadmin/tenants/${t.id}`)} className="p-2 rounded hover:bg-accent transition-colors" title="Editar"><Edit size={15} /></button>
                        <button onClick={() => handleDuplicate(t)} className="p-2 rounded hover:bg-accent transition-colors" title="Duplicar"><Copy size={15} /></button>
                        <button onClick={() => handleImpersonate(t.id)} className="p-2 rounded hover:bg-accent transition-colors text-primary" title="Acessar como tenant"><LogIn size={15} /></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 rounded hover:bg-destructive/10 text-destructive transition-colors" title="Excluir"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum tenant encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
