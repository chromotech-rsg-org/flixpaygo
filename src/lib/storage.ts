import { User, Tenant, Subscriber, Invoice, SubscriptionPlan, Proposal } from './types';

const KEYS = {
  theme: 'flixpay:theme',
  currentUser: 'flixpay:currentUser',
  users: 'flixpay:users',
  tenants: 'flixpay:tenants',
  proposals: 'flixpay:proposals',
  plans: (tid: string) => `flixpay:plans:${tid}`,
  subscribers: (tid: string) => `flixpay:subscribers:${tid}`,
  invoices: (tid: string) => `flixpay:invoices:${tid}`,
  seeded: 'flixpay:seeded',
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

// Current User
export function getCurrentUser() { return get<import('./types').CurrentUser | null>(KEYS.currentUser, null); }
export function setCurrentUser(u: import('./types').CurrentUser | null) { set(KEYS.currentUser, u); }

// Users
export function getUsers(): User[] { return get(KEYS.users, []); }
export function setUsers(u: User[]) { set(KEYS.users, u); }

// Tenants
export function getTenants(): Tenant[] { return get(KEYS.tenants, []); }
export function setTenants(t: Tenant[]) { set(KEYS.tenants, t); }
export function getTenant(id: string) { return getTenants().find(t => t.id === id); }
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

// Seeded?
export function isSeeded(): boolean { return localStorage.getItem(KEYS.seeded) === 'true'; }
export function markSeeded() { localStorage.setItem(KEYS.seeded, 'true'); }
