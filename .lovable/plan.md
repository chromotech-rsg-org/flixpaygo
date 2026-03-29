

# Plan: Proposta Genérica + Layout Premium + Light Theme + Tenant URLs + Missing Features

## 1. Proposta Genérica (sem tenant)

The proposal form already supports creating without a tenant (the dropdown has "Proposta independente"). The issue is the public proposal page needs to work well without a client name. Minor adjustment: if `clientName` is empty, show "Proposta Genérica FlixPay" as title.

**Files:** `src/pages/PublicProposalPage.tsx`, `src/pages/superadmin/ProposalFormPage.tsx`

## 2. Redesign Public Proposal Page to Match HTML Template

The uploaded HTML has a rich, multi-section layout that the current `PublicProposalPage.tsx` doesn't replicate. Will rebuild it to match:

- **Sticky header**: FlixPay logo + "Proposta / Apresentação" badge + client name subtitle
- **Hero section**: 4 glassmorphism feature cards (Landing Page, Gestão, Pagamentos, Streaming) with SVG icons and hover animations
- **"O que Oferecemos"**: Split layout — bullet list left, dashboard image right with parallax offset
- **"Como funciona a Plataforma"**: 3 cards with images (Dashboard, Asaas, Streaming) — use placeholder images or external URLs from the HTML
- **"Processo de Implantação"**: 4 step cards with giant step numbers and colored icons
- **"O que compõe este projeto?"**: Dynamic sections — implantação padrão + recorrente + each extra item rendered as an "Add-on" card with red gradient
- **"Resumo de Investimento"**: Financial summary table with all line items, total implantação highlighted big, monthly below
- **CTA**: WhatsApp button "Aprovar Escopo e Iniciar Projeto"
- **Footer**: RSG × Chromotech logos with grayscale→color hover

All sections use the `dark-glass-card` styling, step-number effects, and brand colors from the HTML. Dynamic data from the proposal (plan, items, extras, values, client name) populates the relevant sections.

**File:** `src/pages/PublicProposalPage.tsx` (full rewrite)

## 3. Fix Light Theme

Current `.glass-card` light variant uses `.light` selector but the app uses class `dark` on `<html>` — when dark is removed, there's no `.light` class added. Fix:

- Change `.light .glass-card` to `:root:not(.dark) .glass-card`
- Improve light mode CSS variables: increase contrast for borders, card backgrounds, muted text
- Ensure `toggleTheme` in AuthContext adds/removes `dark` class properly (it does via `classList.toggle`)

**File:** `src/index.css`

## 4. Per-Tenant Portal URLs

Restructure routing so each tenant gets `/:slug/admin/*`, `/:slug/minha-conta`, `/:slug/login`:

- **New `TenantLoginPage.tsx`**: Resolves tenant by slug, shows tenant's logo/branding
- **Update `App.tsx`**: Add `/:slug/login`, `/:slug/admin/*`, `/:slug/minha-conta` routes
- **Update `AuthContext.tsx`**: Redirect tenant_admin to `/{slug}/admin`, subscriber to `/{slug}/minha-conta`
- **Update `TenantAdminLayout.tsx`**: Read tenant from URL slug param
- **Update `TenantFormPage.tsx`**: Show provisional URL field based on slug

**Files:** New `src/pages/TenantLoginPage.tsx`, edit `src/App.tsx`, `src/contexts/AuthContext.tsx`, `src/layouts/TenantAdminLayout.tsx`

## 5. FlixPay Commercial Landing Page (`/`)

Create a premium landing page for FlixPay itself at `/` instead of redirect to login:
- Hero with FlixPay logo, headline, CTA
- Features showcase, 3 plans comparison, WhatsApp CTA, footer

**File:** New `src/pages/FlixPayLandingPage.tsx`, update route in `App.tsx`

## 6. Enhanced Tenant Landing Pages

Add missing sections to `LandingPage.tsx` gated by plan features:
- Testimonials, FAQ, Benefits (Pro+)
- WhatsApp floating button (Pro+)
- Dark/Light toggle for Pro+ tenants

**File:** `src/pages/landing/LandingPage.tsx`

## 7. Missing Data Types

Add `ApiLog` and `Coupon` interfaces to types and storage helpers.

**Files:** `src/lib/types.ts`, `src/lib/storage.ts`

---

## Technical Details

### Execution Order
1. Fix `index.css` light theme
2. Rewrite `PublicProposalPage.tsx` to match HTML template
3. Minor tweak to `ProposalFormPage.tsx` for generic proposals
4. Create `TenantLoginPage.tsx` + update routing in `App.tsx`
5. Update `AuthContext.tsx` for slug-aware redirects
6. Update `TenantAdminLayout.tsx` to resolve tenant from slug
7. Create `FlixPayLandingPage.tsx`
8. Enhance `LandingPage.tsx` with missing sections
9. Add `ApiLog`/`Coupon` to types and storage

### New Files
- `src/pages/FlixPayLandingPage.tsx`
- `src/pages/TenantLoginPage.tsx`

### Edited Files
- `src/index.css`
- `src/pages/PublicProposalPage.tsx`
- `src/pages/superadmin/ProposalFormPage.tsx`
- `src/App.tsx`
- `src/contexts/AuthContext.tsx`
- `src/layouts/TenantAdminLayout.tsx`
- `src/pages/landing/LandingPage.tsx`
- `src/lib/types.ts`
- `src/lib/storage.ts`

