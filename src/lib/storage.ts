import { User, Tenant, Subscriber, Invoice, SubscriptionPlan, Proposal, ApiLog, Coupon, Profile, CommercialPlan, CurrentUser } from './types';

const KEYS = {
  theme: 'flixpay:theme',
  currentUser: 'flixpay:currentUser',
  users: 'flixpay:users',
  tenants: 'flixpay:tenants',
  proposals: 'flixpay:proposals',
  plans: (tid: string) => `flixpay:plans:${tid}`,
  subscribers: (tid: string) => `flixpay:subscribers:${tid}`,
  invoices: (tid: string) => `flixpay:invoices:${tid}`,
  apiLogs: (tid: string) => `flixpay:apilogs:${tid}`,
  coupons: (tid: string) => `flixpay:coupons:${tid}`,
  seeded: 'flixpay:seeded',
  // Multi-session keys
  sessionSuperadmin: 'flixpay:session:superadmin',
  sessionTenant: (slug: string) => `flixpay:session:tenant:${slug}`,
  sessionSubscriber: (slug: string) => `flixpay:session:subscriber:${slug}`,
  // Profiles & Commercial Plans
  profiles: 'flixpay:profiles',
  tenantProfiles: (tid: string) => `flixpay:profiles:${tid}`,
  commercialPlans: 'flixpay:commercialPlans',
};

function get<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Theme
export function getTheme(): 'dark' | 'light' {
  return (localStorage.getItem(KEYS.theme) as 'dark' | 'light') || 'dark';
}
export function setTheme(t: 'dark' | 'light') {
  localStorage.setItem(KEYS.theme, t);
  document.documentElement.classList.toggle('dark', t === 'dark');
}

// Current User (legacy single session — kept for backward compat)
export function getCurrentUser() { return get<CurrentUser | null>(KEYS.currentUser, null); }
export function setCurrentUser(u: CurrentUser | null) { set(KEYS.currentUser, u); }

// Multi-session
export function getSession(type: 'superadmin' | 'tenant' | 'subscriber', slug?: string): CurrentUser | null {
  if (type === 'superadmin') return get<CurrentUser | null>(KEYS.sessionSuperadmin, null);
  if (type === 'tenant' && slug) return get<CurrentUser | null>(KEYS.sessionTenant(slug), null);
  if (type === 'subscriber' && slug) return get<CurrentUser | null>(KEYS.sessionSubscriber(slug), null);
  return null;
}

export function setSession(type: 'superadmin' | 'tenant' | 'subscriber', user: CurrentUser | null, slug?: string) {
  if (type === 'superadmin') set(KEYS.sessionSuperadmin, user);
  else if (type === 'tenant' && slug) set(KEYS.sessionTenant(slug), user);
  else if (type === 'subscriber' && slug) set(KEYS.sessionSubscriber(slug), user);
}

export function clearSession(type: 'superadmin' | 'tenant' | 'subscriber', slug?: string) {
  if (type === 'superadmin') localStorage.removeItem(KEYS.sessionSuperadmin);
  else if (type === 'tenant' && slug) localStorage.removeItem(KEYS.sessionTenant(slug));
  else if (type === 'subscriber' && slug) localStorage.removeItem(KEYS.sessionSubscriber(slug));
}

// Users
export function getUsers(): User[] { return get(KEYS.users, []); }
export function setUsers(u: User[]) { set(KEYS.users, u); }

// Tenants
export function getTenants(): Tenant[] { return get(KEYS.tenants, []); }
export function setTenants(t: Tenant[]) { set(KEYS.tenants, t); }
export function getTenant(id: string) { return getTenants().find(t => t.id === id); }
export function getTenantBySlug(slug: string) { return getTenants().find(t => t.dominio.slug === slug); }
export function saveTenant(tenant: Tenant) {
  const all = getTenants();
  const idx = all.findIndex(t => t.id === tenant.id);
  if (idx >= 0) all[idx] = tenant; else all.push(tenant);
  setTenants(all);
}
export function deleteTenant(id: string) { setTenants(getTenants().filter(t => t.id !== id)); }

// Plans
export function getPlans(tid: string): SubscriptionPlan[] { return get(KEYS.plans(tid), []); }
export function setPlans(tid: string, p: SubscriptionPlan[]) { set(KEYS.plans(tid), p); }

// Subscribers
export function getSubscribers(tid: string): Subscriber[] { return get(KEYS.subscribers(tid), []); }
export function setSubscribers(tid: string, s: Subscriber[]) { set(KEYS.subscribers(tid), s); }
export function getAllSubscribers(): Subscriber[] {
  return getTenants().flatMap(t => getSubscribers(t.id));
}

// Invoices
export function getInvoices(tid: string): Invoice[] { return get(KEYS.invoices(tid), []); }
export function setInvoices(tid: string, inv: Invoice[]) { set(KEYS.invoices(tid), inv); }

// API Logs
export function getApiLogs(tid: string): ApiLog[] { return get(KEYS.apiLogs(tid), []); }
export function setApiLogs(tid: string, logs: ApiLog[]) { set(KEYS.apiLogs(tid), logs); }

// Coupons
export function getCoupons(tid: string): Coupon[] { return get(KEYS.coupons(tid), []); }
export function setCoupons(tid: string, c: Coupon[]) { set(KEYS.coupons(tid), c); }

// Proposals
export function getProposals(): Proposal[] { return get(KEYS.proposals, []); }
export function setProposals(p: Proposal[]) { set(KEYS.proposals, p); }
export function getProposal(id: string) { return getProposals().find(p => p.id === id); }
export function saveProposal(p: Proposal) {
  const all = getProposals();
  const idx = all.findIndex(x => x.id === p.id);
  if (idx >= 0) all[idx] = p; else all.push(p);
  setProposals(all);
}
export function deleteProposal(id: string) { setProposals(getProposals().filter(p => p.id !== id)); }

// Profiles
export function getProfiles(scope: 'superadmin', tenantId?: undefined): Profile[];
export function getProfiles(scope: 'tenant', tenantId: string): Profile[];
export function getProfiles(scope: 'superadmin' | 'tenant', tenantId?: string): Profile[] {
  if (scope === 'superadmin') return get(KEYS.profiles, []);
  return get(KEYS.tenantProfiles(tenantId!), []);
}

export function setProfiles(scope: 'superadmin' | 'tenant', profiles: Profile[], tenantId?: string) {
  if (scope === 'superadmin') set(KEYS.profiles, profiles);
  else set(KEYS.tenantProfiles(tenantId!), profiles);
}

export function saveProfile(profile: Profile) {
  const key = profile.scope === 'superadmin' ? KEYS.profiles : KEYS.tenantProfiles(profile.tenantId!);
  const all = get<Profile[]>(key, []);
  const idx = all.findIndex(p => p.id === profile.id);
  if (idx >= 0) all[idx] = profile; else all.push(profile);
  set(key, all);
}

export function deleteProfile(id: string, scope: 'superadmin' | 'tenant', tenantId?: string) {
  const key = scope === 'superadmin' ? KEYS.profiles : KEYS.tenantProfiles(tenantId!);
  set(key, get<Profile[]>(key, []).filter(p => p.id !== id));
}

// Commercial Plans
export function getCommercialPlans(): CommercialPlan[] { return get(KEYS.commercialPlans, []); }
export function setCommercialPlans(p: CommercialPlan[]) { set(KEYS.commercialPlans, p); }
export function saveCommercialPlan(plan: CommercialPlan) {
  const all = getCommercialPlans();
  const idx = all.findIndex(p => p.id === plan.id);
  if (idx >= 0) all[idx] = plan; else all.push(plan);
  setCommercialPlans(all);
}
export function deleteCommercialPlan(id: string) { setCommercialPlans(getCommercialPlans().filter(p => p.id !== id)); }

// Seeded?
export function isSeeded(): boolean { return localStorage.getItem(KEYS.seeded) === 'true'; }
export function markSeeded() { localStorage.setItem(KEYS.seeded, 'true'); }
