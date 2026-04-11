export type UserRole = 'superadmin' | 'tenant_admin' | 'subscriber';
export type PlanType = 'start' | 'pro' | 'ultra';
export type LicenseStatus = 'ativo' | 'inadimplente' | 'suspenso' | 'trial';
export type SubscriptionStatus = 'active' | 'inactive' | 'overdue' | 'cancelled';
export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled' | 'refunded';
export type PaymentMethod = 'credit_card' | 'boleto' | 'pix';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  password: string;
  name: string;
  tenantId?: string;
  profileId?: string;
  photoUrl?: string;
}

export interface CurrentUser {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  tenantId?: string;
  profileId?: string;
}

export interface TenantAddress {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface TenantResponsavel {
  nome: string;
  cpf: string;
  email: string;
  phone: string;
  cargo: string;
}

export interface TenantFinanceiro {
  implantacaoValor: number;
  licencaValorMensal: number;
  licencaVencimentoDia: number;
  licencaStatus: LicenseStatus;
  contratoInicio: string;
  observacoes: string;
}

export interface TenantDominio {
  slug: string;
  subdomain: string;
  customDomain: string;
  minhaConta: string;
  dnsStatus: 'pendente' | 'ativo' | 'erro';
  streamingPortalUrl: string;
}

export interface StreamingEndpoint {
  method: string;
  path: string;
}

export interface TenantStreamingApi {
  baseUrl: string;
  authType: 'bearer' | 'apikey' | 'basic' | 'youcast';
  login: string;
  secret: string;
  credential: string;
  endpoints: {
    createUser: StreamingEndpoint;
    authenticateUser: StreamingEndpoint;
    findUser: StreamingEndpoint;
    searchUser: StreamingEndpoint;
    updateUser: StreamingEndpoint;
    enablePlan: StreamingEndpoint;
    disablePlan: StreamingEndpoint;
    checkStatus: StreamingEndpoint;
    listPlans: StreamingEndpoint;
    getVendors: StreamingEndpoint;
  };
}

export interface TenantAsaas {
  apiKey: string;
  environment: 'sandbox' | 'production';
  webhookUrl: string;
  webhookToken: string;
  status: string;
}

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export interface ContentCategory {
  title: string;
  items: Array<{ image: string; title: string }>;
}

export interface FeatureHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface EditorialSection {
  type: 'manifesto' | 'experience' | 'filmTypes' | 'catalog' | 'audience' | 'whyRare';
  heading: string;
  body: string;
  image: string;
  quote?: string;
  bulletPoints?: string[];
}

export interface TenantTheme {
  template: 'cinema-dark' | 'gradient-flow' | 'minimal-premium' | 'darkflix-editorial';
  mode: 'dark' | 'light';
  primaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  heroSlides?: HeroSlide[];
  contentCategories?: ContentCategory[];
  featureHighlights?: FeatureHighlight[];
  editorialSections?: EditorialSection[];
  loginSideImage?: string;
  section2BgImage?: string;
  section3BgImage?: string;
  section4BgImage?: string;
}

export interface Tenant {
  id: string;
  name: string;
  razaoSocial: string;
  cpfCnpj: string;
  logoUrl: string;
  faviconUrl: string;
  logoHomeUrl?: string;
  logoFooterUrl?: string;
  logoLoginUrl?: string;
  logoSystemUrl?: string;
  address: TenantAddress;
  email: string;
  phone: string;
  website: string;
  responsavel: TenantResponsavel;
  financeiro: TenantFinanceiro;
  dominio: TenantDominio;
  streamingApi: TenantStreamingApi;
  asaas: TenantAsaas;
  plano: PlanType;
  theme: TenantTheme;
  showOnHomepage?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'quarterly' | 'yearly';
  asaasPlanId: string;
  streamingPlanId: string;
  active: boolean;
  highlight: boolean;
  features: string[];
}

export interface Subscriber {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  asaasCustomerId: string;
  streamingUserId: string;
  planId: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionId: string;
  nextBillingDate: string;
  createdAt: string;
  password?: string;
  photoUrl?: string;
  paymentMethod?: PaymentMethod;
  cardLast4?: string;
}

export interface Invoice {
  id: string;
  subscriberId: string;
  tenantId: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt: string | null;
  asaasPaymentId: string;
  paymentMethod: PaymentMethod;
}

export interface ProposalItem {
  id: string;
  description: string;
  included: boolean;
  category: string;
}

export interface ProposalExtraItem {
  id: string;
  description: string;
  value: number;
}

export interface Proposal {
  id: string;
  tenantId?: string;
  clientName: string;
  clientRazaoSocial: string;
  clientEmail: string;
  plano: PlanType;
  implantacaoValor: number;
  mensalidadeValor: number;
  items: ProposalItem[];
  extraItems: ProposalExtraItem[];
  totalImplantacao: number;
  totalMensal: number;
  status: 'rascunho' | 'enviada' | 'aprovada' | 'recusada';
  createdAt: string;
  updatedAt: string;
}

export interface ApiLog {
  id: string;
  tenantId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  requestBody: string;
  responseBody: string;
  timestamp: string;
}

export interface Coupon {
  id: string;
  tenantId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

// Permissions & Profiles
export interface Permission {
  page: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Profile {
  id: string;
  name: string;
  scope: 'superadmin' | 'tenant';
  tenantId?: string;
  permissions: Permission[];
}

// Commercial Plans (SuperAdmin)
export interface CommercialPlan {
  id: string;
  name: string;
  type: PlanType;
  implantacao: number;
  mensal: number;
  description: string;
  features: string[];
  active: boolean;
}
