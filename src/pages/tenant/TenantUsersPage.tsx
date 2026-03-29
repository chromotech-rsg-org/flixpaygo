import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUsers, setUsers, getProfiles, getTenantBySlug } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function TenantUsersPage() {
  const { slug } = useParams();
  const { user: currentUser } = useAuth();
  const tenant = slug ? getTenantBySlug(slug) : null;
  const tenantId = tenant?.id || currentUser?.tenantId || '';

  const [users, setUsersState] = useState(getUsers().filter(u => u.tenantId === tenantId && u.role === 'tenant_admin'));
  const [editing, setEditing] = useState<User | null>(null);
  const [changingPw, setChangingPw] = useState<{ userId: string; newPw: string } | null>(null);
  const profiles = getProfiles('tenant', tenantId);

  const handleSave = () => {
    if (!editing || !editing.email || !editing.name) { toast.error('Campos obrigatórios'); return; }
    const allUsers = getUsers();
    const idx = allUsers.findIndex(u => u.id === editing.id);
    if (idx >= 0) allUsers[idx] = editing; else allUsers.push({ ...editing, role: 'tenant_admin', tenantId });
    setUsers(allUsers);
    setUsersState(allUsers.filter(u => u.tenantId === tenantId && u.role === 'tenant_admin'));
    setEditing(null);
    toast.success('Usuário salvo!');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Excluir este usuário?')) return;
    const allUsers = getUsers().filter(u => u.id !== id);
    setUsers(allUsers);
    setUsersState(allUsers.filter(u => u.tenantId === tenantId && u.role === 'tenant_admin'));
    toast.success('Usuário excluído');
  };

  const handleChangePw = () => {
    if (!changingPw || !changingPw.newPw) return;
    const allUsers = getUsers();
    const idx = allUsers.findIndex(u => u.id === changingPw.userId);
    if (idx >= 0) { allUsers[idx].password = changingPw.newPw; setUsers(allUsers); }
    setChangingPw(null);
    toast.success('Senha alterada!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Usuários</h1>
          <p className="text-muted-foreground text-sm">Gerencie os usuários da sua equipe</p>
        </div>
        <button onClick={() => setEditing({ id: crypto.randomUUID(), role: 'tenant_admin', email: '', password: '', name: '', tenantId })}
          className="btn-brand flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nome</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">E-mail</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Perfil</th>
              <th className="text-right p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="border-b border-border/50 hover:bg-secondary/20">
                <td className="p-4 font-semibold">{u.name}</td>
                <td className="p-4 text-muted-foreground">{u.email}</td>
                <td className="p-4">{profiles.find(p => p.id === u.profileId)?.name || '—'}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing({ ...u })} className="p-2 rounded hover:bg-accent"><Edit size={14} /></button>
                    <button onClick={() => setChangingPw({ userId: u.id, newPw: '' })} className="p-2 rounded hover:bg-accent text-primary" title="Alterar senha"><Key size={14} /></button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {users.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nenhum usuário.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Usuário</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Nome</label>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">E-mail</label>
                <input type="email" value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>
              {!getUsers().find(u => u.id === editing.id) && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Senha</label>
                  <input type="password" value={editing.password} onChange={e => setEditing({ ...editing, password: e.target.value })}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Perfil</label>
                <select value={editing.profileId || ''} onChange={e => setEditing({ ...editing, profileId: e.target.value || undefined })}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option value="">Sem perfil</option>
                  {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm">Cancelar</button>
              <button onClick={handleSave} className="btn-brand flex items-center gap-2 text-sm"><Save size={14} /> Salvar</button>
            </div>
          </div>
        </div>
      )}

      {changingPw && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setChangingPw(null)}>
          <div className="glass-card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Alterar Senha</h2>
            <input type="password" value={changingPw.newPw} onChange={e => setChangingPw({ ...changingPw, newPw: e.target.value })}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary mb-4" placeholder="Nova senha" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setChangingPw(null)} className="px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm">Cancelar</button>
              <button onClick={handleChangePw} className="btn-brand text-sm">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
