

# Plan: Tenant Portals, Auth Isolation, Profiles/Permissions, Landing Redesign, Subscriber Signup Flow

This is a large set of features. Due to scope, this plan covers everything requested but implementation will be split across multiple steps.

---

## 1. Tenant Landing Page Route: `/:slug` instead of `/landing/:slug`

- **`src/App.tsx`**: Change `/landing/:slug` to `/:slug` route — place it LAST before the catch-all `*` to avoid conflicting with `/login`, `/planos`, `/superadmin`, etc.
- Update all internal links that reference `/landing/` to use `/:slug` directly.

## 2. Dynamic SEO & Favicon per Tenant

- Create a `useTenantMeta` hook that updates `document.title` and the favicon `<link>` element dynamically based on the current tenant (resolved from URL slug).
- Apply in `TenantAdminLayout`, `TenantLoginPage`, `MinhaContaPage`, and `LandingPage`.
- When on tenant pages, title = `{Tenant Name} - Admin/Login/Minha Conta`, favicon = `tenant.faviconUrl` (fallback to FlixPay icon).

## 3. Independent Login Sessions (No Cross-Logout)

Currently there's a single `flixpay:currentUser` key — logging in as one user logs out the other.

- **Change storage keys** to be role/context-scoped:
  - `flixpay:session:superadmin` — SuperAdmin session
  - `flixpay:session:tenant:{slug}` — Tenant admin session for that slug
  - `flixpay:session:subscriber:{slug}` — Subscriber session for that slug
- **`AuthContext`**: Determine which session key to use based on current URL path. On `/superadmin/*` read superadmin session; on `/:slug/admin/*` read tenant session; on `/:slug/minha-conta` read subscriber session.
- `login()` writes to the appropriate session key. `logout()` only clears the current context's key.

## 4. SuperAdmin: Change Tenant Passwords

- **`src/pages/superadmin/TenantsListPage.tsx`** or **`TenantFormPage.tsx`**: Add a "Alterar Senha" action that lets superadmin set a new password for any tenant_admin user.
- Simple modal with new password field, updates the user in `getUsers()`/`setUsers()`.

## 5. SuperAdmin: Plans CRUD

- **New page `src/pages/superadmin/PlansManagePage.tsx`**: CRUD for the 3 FlixPay commercial plans (Start/Pro/Ultra).
- Edit plan names, prices (implantação + mensal), feature checklist, descriptions.
- Stored in localStorage under `flixpay:commercialPlans` (separate from tenant subscription plans).
- **`SuperAdminLayout`**: Add "Planos" menu item.
- **`App.tsx`**: Add route `/superadmin/planos`.

## 6. Profiles & Users Module with Granular Permissions

### Types (`src/lib/types.ts`)
```typescript
interface Permission {
  page: string; // e.g. 'dashboard', 'subscribers', 'invoices'
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface Profile {
  id: string;
  name: string;
  scope: 'superadmin' | 'tenant';
  tenantId?: string;
  permissions: Permission[];
}
```

### Storage
- `flixpay:profiles` — SuperAdmin profiles
- `flixpay:profiles:{tenantId}` — Tenant-specific profiles

### Pages
- **SuperAdmin**: `src/pages/superadmin/ProfilesPage.tsx` — CRUD profiles with permission matrix (checkboxes for view/create/edit/delete per page: Dashboard, Tenants, Propostas, Assinaturas, Relatórios, Configurações, Planos).
- **SuperAdmin**: `src/pages/superadmin/UsersPage.tsx` — CRUD users, assign profiles.
- **Tenant**: `src/pages/tenant/ProfilesPage.tsx` — Same but for tenant pages (Dashboard, Assinantes, Faturas, Planos, Landing, Configurações).
- **Tenant**: `src/pages/tenant/UsersPage.tsx` — CRUD tenant users, assign tenant profiles.
- Add menu items "Perfis" and "Usuários" to both layouts.
- Add routes in `App.tsx`.

### Isolation
- SuperAdmin profiles/users only manage superadmin-scope pages.
- Tenant profiles/users only manage that tenant's pages. No cross-tenant access.

## 7. Redesign Tenant Landing Pages (Streaming Preview Style)

Inspired by agroplustv.com and agromercado.tv.br:

- **Hero carousel/slider** with large background images, overlay text, CTA buttons (Assine Agora, Nossos Canais/Acessar Streaming).
- **Live/Preview section**: Embedded video player placeholder or thumbnail grid showing "content preview" (editable images).
- **Content categories**: Horizontal scroll cards with thumbnails (like Netflix/streaming catalogs).
- **Feature highlights**: Icons + text cards (similar to "Portal de Leilões" section).
- **Plans section** with the current pricing cards.
- **All text and images must be editable** via the tenant's Landing Editor page — extend `TenantTheme` type with:
  - `heroSlides: Array<{image, title, subtitle, ctaText, ctaLink}>`
  - `contentCategories: Array<{title, items: Array<{image, title}>}>`
  - `featureHighlights: Array<{icon, title, description}>`
- Update `LandingEditorPage.tsx` to include editors for these new sections.

## 8. Multi-Step Subscriber Signup Flow

New page: `src/pages/subscriber/SignupPage.tsx` at route `/:slug/assinar`.

### Step 1 — Dados Pessoais
- Name, CPF (validated with algorithm, unique check against storage), Email (validated format, unique check — real-time as user types), Phone.
- Real-time validation: if CPF/email already exists, show error immediately and disable "Continuar".

### Step 2 — Login e Senha
- Email (pre-filled from step 1, read-only — this is the login).
- Password with strength requirements shown as checklist that updates during typing:
  - Minimum 8 chars
  - At least 1 uppercase
  - At least 1 lowercase
  - At least 1 number
  - At least 1 special character
- Confirm password field.
- Eye icon toggle on both password fields.
- "Continuar" disabled until all checks pass AND passwords match.

### Step 3 — Escolha do Plano
- Show tenant's active plans as cards (similar to landing page).
- Select one to proceed.

### Step 4 — Pagamento
- Transparent Asaas checkout simulation (since no real backend):
  - Credit card form (number, expiry, CVV, holder name) styled as embedded checkout.
  - Show selected plan summary and price.
- On "Finalizar": create subscriber in storage, create invoice, auto-login and redirect to `/:slug/minha-conta`.

### Route
- `/:slug/assinar` — public, no auth required.
- Landing page "Assinar" buttons link here.

## 9. Enhanced Subscriber Account (`MinhaContaPage`)

Add to existing page:
- **Cancel plan**: Button that marks status as `cancelled` but keeps access (shows "Cancelamento solicitado" message).
- **Upgrade/Downgrade**: Already partially exists — make it functional (update subscriber's planId in storage).
- **Edit profile**: Name, phone, CPF (read-only), email (read-only) — save to storage.
- **Change password**: Current password verification + new password with same strength rules as signup.
- **Profile photo**: FileReader → base64, stored on subscriber object.
- **Change card**: Simulated form to "update" payment method.

---

## Technical Details

### New Files
1. `src/hooks/useTenantMeta.ts` — Dynamic SEO/favicon
2. `src/pages/superadmin/PlansManagePage.tsx` — Commercial plans CRUD
3. `src/pages/superadmin/ProfilesPage.tsx` — SuperAdmin profiles
4. `src/pages/superadmin/UsersPage.tsx` — SuperAdmin users
5. `src/pages/tenant/ProfilesPage.tsx` — Tenant profiles
6. `src/pages/tenant/UsersPage.tsx` — Tenant users
7. `src/pages/subscriber/SignupPage.tsx` — Multi-step signup

### Edited Files
1. `src/App.tsx` — Routes (/:slug, signup, profiles, users, plans)
2. `src/lib/types.ts` — Profile, Permission, TenantTheme extensions, Subscriber photo/password fields
3. `src/lib/storage.ts` — Session keys per context, profiles storage, commercial plans storage
4. `src/contexts/AuthContext.tsx` — Multi-session support
5. `src/layouts/SuperAdminLayout.tsx` — Menu items (Planos, Perfis, Usuários)
6. `src/layouts/TenantAdminLayout.tsx` — Menu items (Perfis, Usuários) + useTenantMeta
7. `src/pages/landing/LandingPage.tsx` — Full redesign with streaming preview style
8. `src/pages/tenant/LandingEditorPage.tsx` — Editors for new landing sections
9. `src/pages/subscriber/MinhaContaPage.tsx` — Profile edit, password change, photo, cancel, card
10. `src/pages/superadmin/TenantFormPage.tsx` — Change password action
11. `src/pages/superadmin/TenantsListPage.tsx` — Change password action
12. `src/pages/TenantLoginPage.tsx` — useTenantMeta
13. `src/components/ProtectedRoute.tsx` — Permission-aware (check profile permissions)

### Execution Order
1. Independent sessions + route changes (/:slug)
2. Dynamic SEO/favicon hook
3. SuperAdmin: password change, plans CRUD
4. Profiles & Users module (both scopes)
5. Landing page redesign
6. Multi-step subscriber signup
7. Enhanced MinhaContaPage

