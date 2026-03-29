import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfiles, saveProfile, deleteProfile, getTenantBySlug } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Profile, Permission } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Shield } from 'lucide-react';
import { toast } from 'sonner';

const TENANT_PAGES = [
  'Dashboard', 'Assinantes', 'Faturas', 'Planos', 'Landing Page', 'Configurações', 'Perfis', 'Usuários',
];

const emptyPermissions = (pages: string[]): Permission[] =>
  pages.map(page => ({ page, view: false, create: false, edit: false, delete: false }));

export default function TenantProfilesPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const tenant = slug ? getTenantBySlug(slug) : null;
  const tenantId = tenant?.id || user?.tenantId || '';

  const [profiles, setProfilesState] = useState(getProfiles('tenant', tenantId));
  const [editing, setEditing] = useState<Profile | null>(null);

  const handleSave = () => {
    if (!editing || !editing.name.trim()) { toast.error('Nome é obrigatório'); return; }
    saveProfile({ ...editing, scope: 'tenant', tenantId });
    setProfilesState(getProfiles('tenant', tenantId));
    setEditing(null);
    toast.success('Perfil salvo!');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Excluir este perfil?')) return;
    deleteProfile(id, 'tenant', tenantId);
    setProfilesState(getProfiles('tenant', tenantId));
    toast.success('Perfil excluído');
  };

  const togglePerm = (pageIdx: number, field: keyof Omit<Permission, 'page'>) => {
    if (!editing) return;
    const perms = [...editing.permissions];
    perms[pageIdx] = { ...perms[pageIdx], [field]: !perms[pageIdx][field] };
    setEditing({ ...editing, permissions: perms });
  };

  const toggleAll = (field: keyof Omit<Permission, 'page'>) => {
    if (!editing) return;
    const allOn = editing.permissions.every(p => p[field]);
    setEditing({ ...editing, permissions: editing.permissions.map(p => ({ ...p, [field]: !allOn })) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Perfis de Acesso</h1>
          <p className="text-muted-foreground text-sm">Gerencie perfis e permissões da sua equipe</p>
        </div>
        <button onClick={() => setEditing({ id: crypto.randomUUID(), name: '', scope: 'tenant', tenantId, permissions: emptyPermissions(TENANT_PAGES) })}
          className="btn-brand flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile, i) => (
          <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                <h3 className="font-bold">{profile.name}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing({ ...profile })} className="p-1.5 rounded hover:bg-accent"><Edit size={14} /></button>
                <button onClick={() => handleDelete(profile.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{profile.permissions.filter(p => p.view).length} páginas com acesso</p>
          </motion.div>
        ))}
        {profiles.length === 0 && <p className="text-muted-foreground text-sm col-span-3">Nenhum perfil cadastrado.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="glass-card p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Perfil de Acesso</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Nome do perfil</label>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Página</th>
                      {(['view', 'create', 'edit', 'delete'] as const).map(f => (
                        <th key={f} className="p-2 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary"
                          onClick={() => toggleAll(f)}>
                          {f === 'view' ? 'Ver' : f === 'create' ? 'Criar' : f === 'edit' ? 'Editar' : 'Excluir'}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {editing.permissions.map((perm, idx) => (
                      <tr key={perm.page} className="border-b border-border/50 hover:bg-secondary/20">
                        <td className="p-2 font-medium">{perm.page}</td>
                        {(['view', 'create', 'edit', 'delete'] as const).map(f => (
                          <td key={f} className="p-2 text-center">
                            <input type="checkbox" checked={perm[f]} onChange={() => togglePerm(idx, f)} className="rounded border-border" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm">Cancelar</button>
              <button onClick={handleSave} className="btn-brand flex items-center gap-2 text-sm"><Save size={14} /> Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
