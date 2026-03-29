import { PlanType } from './types';

export const PLAN_FEATURES = {
  start: {
    landingTemplates: 1,
    landingDarkLightToggle: false,
    landingAdvancedSections: false,
    landingAnimations: false,
    landingExclusiveLayout: false,
    adminMetricCards: 4,
    adminCharts: false,
    adminExportCSV: false,
    adminAlerts: false,
    adminCoupons: false,
    adminMultiUser: false,
    subscriberSelfUpgrade: false,
    subscriberPWA: false,
    subscriberReferral: false,
    integrationEmails: false,
    integrationWhatsApp: false,
    integrationRetry: false,
    customDomain: false,
  },
  pro: {
    landingTemplates: 2,
    landingDarkLightToggle: true,
    landingAdvancedSections: true,
    landingAnimations: true,
    landingExclusiveLayout: false,
    adminMetricCards: 8,
    adminCharts: true,
    adminExportCSV: true,
    adminAlerts: true,
    adminCoupons: false,
    adminMultiUser: false,
    subscriberSelfUpgrade: true,
    subscriberPWA: false,
    subscriberReferral: false,
    integrationEmails: true,
    integrationWhatsApp: false,
    integrationRetry: false,
    customDomain: true,
  },
  ultra: {
    landingTemplates: 3,
    landingDarkLightToggle: true,
    landingAdvancedSections: true,
    landingAnimations: true,
    landingExclusiveLayout: true,
    adminMetricCards: 12,
    adminCharts: true,
    adminExportCSV: true,
    adminAlerts: true,
    adminCoupons: true,
    adminMultiUser: true,
    subscriberSelfUpgrade: true,
    subscriberPWA: true,
    subscriberReferral: true,
    integrationEmails: true,
    integrationWhatsApp: true,
    integrationRetry: true,
    customDomain: true,
  }
} as const;

export const PLAN_PRICES = {
  start: { implantacao: 1500, mensal: 220 },
  pro: { implantacao: 2900, mensal: 380 },
  ultra: { implantacao: 4900, mensal: 580 },
} as const;

export const PLAN_NAMES: Record<PlanType, string> = {
  start: 'Start',
  pro: 'Pro',
  ultra: 'Ultra',
};

export const PLAN_DESCRIPTIONS: Record<PlanType, string> = {
  start: 'Entrada no mercado. Valide seu modelo com o essencial.',
  pro: 'Negócio em escala. Mais controle, relatórios e profissionalismo.',
  ultra: 'Experiência premium. Layout exclusivo e controle financeiro total.',
};

export interface PlanFeatureItem {
  label: string;
  category: string;
  start: boolean;
  pro: boolean;
  ultra: boolean;
}

export const ALL_PLAN_FEATURES: PlanFeatureItem[] = [
  // Landing Page
  { label: '1 template padrão', category: 'Landing Page', start: true, pro: true, ultra: true },
  { label: 'Cores + logo customizáveis', category: 'Landing Page', start: true, pro: true, ultra: true },
  { label: 'Seção hero, planos e CTA', category: 'Landing Page', start: true, pro: true, ultra: true },
  { label: '2 templates (switch a qualquer hora)', category: 'Landing Page', start: false, pro: true, ultra: true },
  { label: 'Cor primária + cor de acento', category: 'Landing Page', start: false, pro: true, ultra: true },
  { label: 'Todas as seções + depoimentos e FAQ', category: 'Landing Page', start: false, pro: true, ultra: true },
  { label: 'Animações Framer Motion + hover 3D', category: 'Landing Page', start: false, pro: true, ultra: true },
  { label: '3 templates + layout 100% exclusivo', category: 'Landing Page', start: false, pro: false, ultra: true },
  { label: 'Design system completo da marca', category: 'Landing Page', start: false, pro: false, ultra: true },
  { label: 'Glassmorphism + efeitos 3D premium', category: 'Landing Page', start: false, pro: false, ultra: true },
  { label: 'Player de trailer/preview embutido', category: 'Landing Page', start: false, pro: false, ultra: true },
  { label: 'Galeria filtrada por categoria', category: 'Landing Page', start: false, pro: false, ultra: true },
  // Painel Admin
  { label: '4 métricas básicas', category: 'Painel Admin', start: true, pro: true, ultra: true },
  { label: 'Gestão de assinantes e faturas', category: 'Painel Admin', start: true, pro: true, ultra: true },
  { label: 'Gestão de planos', category: 'Painel Admin', start: true, pro: true, ultra: true },
  { label: '8 métricas + gráficos (12 meses)', category: 'Painel Admin', start: false, pro: true, ultra: true },
  { label: 'Filtros avançados + busca + CSV', category: 'Painel Admin', start: false, pro: true, ultra: true },
  { label: 'Alertas de inadimplência e erros', category: 'Painel Admin', start: false, pro: true, ultra: true },
  { label: 'Editor visual da landing page', category: 'Painel Admin', start: false, pro: true, ultra: true },
  { label: 'MRR, ARR, LTV, churn, forecast', category: 'Painel Admin', start: false, pro: false, ultra: true },
  { label: 'Mapa de calor + notificações real-time', category: 'Painel Admin', start: false, pro: false, ultra: true },
  { label: 'Cupons e períodos de trial', category: 'Painel Admin', start: false, pro: false, ultra: true },
  { label: 'Multi-usuário admin (equipe)', category: 'Painel Admin', start: false, pro: false, ultra: true },
  { label: 'Log completo da API streaming', category: 'Painel Admin', start: false, pro: false, ultra: true },
  // Assinante / Integrações
  { label: 'Minha Conta básica', category: 'Assinante / Integrações', start: true, pro: true, ultra: true },
  { label: 'Asaas (cartão, boleto, PIX)', category: 'Assinante / Integrações', start: true, pro: true, ultra: true },
  { label: 'API streaming (criar + ativar/desativar)', category: 'Assinante / Integrações', start: true, pro: true, ultra: true },
  { label: 'Upgrade/downgrade self-service', category: 'Assinante / Integrações', start: false, pro: true, ultra: true },
  { label: 'Histórico filtrado + comprovante PDF', category: 'Assinante / Integrações', start: false, pro: true, ultra: true },
  { label: 'E-mails transacionais automáticos', category: 'Assinante / Integrações', start: false, pro: true, ultra: true },
  { label: 'Pesquisa de churn no cancelamento', category: 'Assinante / Integrações', start: false, pro: true, ultra: true },
  { label: 'App PWA instalável (mobile)', category: 'Assinante / Integrações', start: false, pro: false, ultra: true },
  { label: 'Programa de indicação (Referral)', category: 'Assinante / Integrações', start: false, pro: false, ultra: true },
  { label: 'WhatsApp automático (vencimento, boas-vindas)', category: 'Assinante / Integrações', start: false, pro: false, ultra: true },
  { label: 'Retry automático de cobranças', category: 'Assinante / Integrações', start: false, pro: false, ultra: true },
  { label: 'Notificações push + NF eletrônica', category: 'Assinante / Integrações', start: false, pro: false, ultra: true },
];

export const PLAN_BADGES: Record<PlanType, string[]> = {
  start: ['Subdomínio FlixPay', 'Suporte 48h'],
  pro: ['Domínio customizado', 'Dark + Light mode', 'Suporte 24h'],
  ultra: ['Layout exclusivo', 'Multi-admin', 'PWA', 'Referral', 'Suporte 4h'],
};
