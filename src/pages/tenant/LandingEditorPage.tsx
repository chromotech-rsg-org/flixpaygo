import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTenant, saveTenant } from '@/lib/storage';
import { PLAN_FEATURES } from '@/lib/plan-features';
import { PlanType, TenantTheme } from '@/lib/types';
import { toast } from 'sonner';
import { Save, Eye } from 'lucide-react';
import { UpsellLock } from '@/components/UpsellLock';

export default function LandingEditorPage() {
  const { user } = useAuth();
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;
  if (!tenant) return null;

  const plan = tenant.plano as PlanType;
  const features = PLAN_FEATURES[plan];
  const [theme, setTheme] = useState<TenantTheme>({ ...tenant.theme });

  const update = (field: keyof TenantTheme, value: any) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updated = { ...tenant, theme, updatedAt: new Date().toISOString() };
    saveTenant(updated);
    toast.success('Landing page atualizada!');
  };

  const templates = [
    { id: 'cinema-dark' as const, name: 'Cinema Dark', desc: 'Hero fullscreen, glassmorphism, carrossel' },
    { id: 'gradient-flow' as const, name: 'Gradient Flow', desc: 'Gradientes fluidos, split hero' },
    { id: 'minimal-premium' as const, name: 'Minimal Premium', desc: 'Clean, tipografia bold, tabela' },
    { id: 'darkflix-editorial' as const, name: 'Darkflix Editorial', desc: 'Editorial dark, tipografia premium, seções imersivas' },
  ];

  const availableTemplates = templates.slice(0, features.landingTemplates);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Landing Page</h1>
          <p className="text-muted-foreground text-sm">Personalize a página do seu streaming</p>
        </div>
        <div className="flex gap-2">
          <a href={`/${tenant.dominio.slug}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">
            <Eye size={14} /> Preview
          </a>
          <button onClick={handleSave} className="btn-brand flex items-center gap-2 text-sm">
            <Save size={16} /> Salvar
          </button>
        </div>
      </div>

      {/* Template selector */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-bold">Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map(t => {
            const available = availableTemplates.some(at => at.id === t.id);
            return (
              <button key={t.id}
                onClick={() => available && update('template', t.id)}
                disabled={!available}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  theme.template === t.id ? 'border-primary bg-primary/10' :
                  available ? 'border-border hover:border-primary/30' :
                  'border-border/50 opacity-50 cursor-not-allowed'
                }`}>
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                {!available && <p className="text-[10px] text-primary mt-2">🔒 Disponível no plano Pro+</p>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors & Mode */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-bold">Cores e Modo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Modo</label>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map(m => (
                <button key={m} onClick={() => update('mode', m)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${theme.mode === m ? 'bg-primary text-white' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>
                  {m === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Cor Primária</label>
            <input type="color" value={theme.primaryColor} onChange={e => update('primaryColor', e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Cor de Acento</label>
            <input type="color" value={theme.accentColor} onChange={e => update('accentColor', e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-bold">Conteúdo do Hero</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Título</label>
            <input value={theme.heroTitle} onChange={e => update('heroTitle', e.target.value)} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Subtítulo</label>
            <input value={theme.heroSubtitle} onChange={e => update('heroSubtitle', e.target.value)} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Texto CTA</label>
            <input value={theme.heroCtaText} onChange={e => update('heroCtaText', e.target.value)} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
      </div>

      {!features.landingAdvancedSections && (
        <UpsellLock featureName="Seções avançadas (FAQ, Depoimentos, Benefícios)" requiredPlan="pro" currentPlan={plan} />
      )}
      {!features.landingExclusiveLayout && features.landingAdvancedSections && (
        <UpsellLock featureName="Layout 100% exclusivo + Design System" requiredPlan="ultra" currentPlan={plan} />
      )}
    </div>
  );
}
