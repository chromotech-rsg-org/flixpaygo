import { Lock, ExternalLink } from 'lucide-react';
import { PlanType } from '@/lib/types';
import { PLAN_NAMES } from '@/lib/plan-features';
import { useState } from 'react';

interface Props {
  featureName: string;
  requiredPlan: PlanType;
  currentPlan: PlanType;
}

const planBenefits: Record<PlanType, string[]> = {
  start: [],
  pro: ['Gráficos de crescimento e receita', 'Filtros avançados + exportação CSV', 'Alertas de inadimplência automáticos'],
  ultra: ['MRR, ARR, LTV e forecast financeiro', 'Cupons de desconto e trial', 'Multi-usuário admin e logs completos'],
};

export function UpsellLock({ featureName, requiredPlan, currentPlan }: Props) {
  const [showModal, setShowModal] = useState(false);
  const whatsappLink = `https://api.whatsapp.com/send?phone=5511969169869&text=${encodeURIComponent(`Olá! Tenho interesse em fazer upgrade do meu plano FlixPay para o plano ${PLAN_NAMES[requiredPlan]}.`)}`;

  return (
    <>
      <button onClick={() => setShowModal(true)} className="w-full p-6 rounded-xl border border-dashed border-muted-foreground/20 bg-secondary/10 flex items-center justify-center gap-3 hover:border-primary/30 transition-colors cursor-pointer group">
        <Lock className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <div className="text-left">
          <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{featureName}</p>
          <p className="text-xs text-muted-foreground">Disponível no plano <span className="text-primary font-bold">{PLAN_NAMES[requiredPlan]}</span></p>
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Recurso do plano {PLAN_NAMES[requiredPlan]}</h2>
              <p className="text-muted-foreground text-sm mt-2">{featureName} está disponível no plano {PLAN_NAMES[requiredPlan]}.</p>
            </div>

            <div className="space-y-3 mb-6">
              {planBenefits[requiredPlan]?.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-primary text-[10px]">✓</span>
                  </div>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-brand w-full flex items-center justify-center gap-2 text-sm">
                <ExternalLink size={16} /> Falar com a FlixPay
              </a>
              <a href="/planos" target="_blank" className="block w-full text-center py-3 border border-border rounded-lg text-sm font-semibold hover:bg-secondary/50 transition-colors">
                Ver todos os planos
              </a>
              <button onClick={() => setShowModal(false)} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
