

# Plan: Darkflix Landing Template + Split Login + Image Remove Button

## 1. Darkflix-Style Landing Page Template ("darkflix-editorial")

Based on the Figma screenshots and CSS, create a new landing template that matches the Darkflix design exactly. This becomes a **reusable template** any tenant can select.

### Design Sections (from Figma):
1. **Hero**: Full-screen dark bg with overlay image (clown/horror), tenant logo top-left, bold headline with gradient text (`linear-gradient(90deg, #E4E4E4, #7E7E7E)`), subtle subtitle, ghost CTA button with red border, quote text. Font: Space Grotesk.
2. **Content carousel**: Tilted movie poster cards (Evil Dead, Vittra, etc.) with titles below, next to editorial text block ("você não chegou aqui por acaso...") and red-bordered CTA link.
3. **Manifesto section**: Large gradient heading "A Darkflix não é um streaming tradicional" left, "EXPRESSIONISMO" art piece right with demon logo overlay. Description text below.
4. **Experience section**: Full-width zombie image with giant gradient text "UMA EXPERIÊNCIA DIFERENTE", centered description paragraphs, italic quote.
5. **Film types section**: Rounded image card with gradient overlay, large bold heading "TIPOS DE FILMES QUE VOCÊ ENCONTRA", bullet list (terror psicológico, cults europeus, horror asiático, etc.).
6. **Why hard to find**: Demon logo + clown image composition with heading "POR QUE VOCÊ NÃO ENCONTRA ESSES FILMES FACILMENTE", quote at bottom.
7. **Moving catalog**: Rounded image with stairs/silhouette, heading "UM CATÁLOGO EM MOVIMENTO", split text columns.
8. **For whom**: Editorial text "PARA QUEM FAZ SENTIDO" left, red accent text right ("talvez não seja para você...").
9. **Annual plan card**: "PLANO ANUAL" in JetBrains Mono gradient text, glassmorphism card with price (R$ 99,90), crossed original price, feature list with red check icons, CTA button, italic "side effects" list below.
10. **Footer**: Darkflix logo centered.

### Technical approach:
- Add `'darkflix-editorial'` to `TenantTheme.template` union type.
- Extend `TenantTheme` with new fields for editorial sections:
  - `editorialSections?: Array<{ type: 'manifesto'|'experience'|'filmTypes'|'catalog'|'audience'; heading: string; body: string; image: string; quote?: string; bulletPoints?: string[] }>`
  - `loginSideImage?: string` (for split login)
- Create the template as a conditional branch inside `LandingPage.tsx` or a separate component `DarkflixEditorialTemplate.tsx`.
- All text/images/quotes are populated from `TenantTheme` so any tenant can use this template with their own content.
- Copy uploaded images (clown, zombie, expressionism art, stairs, etc.) from the ZIP to `src/assets/darkflix/` as default sample images for this template.

### Files:
- **New**: `src/components/landing/DarkflixEditorialTemplate.tsx`
- **Edit**: `src/lib/types.ts` (extend TenantTheme)
- **Edit**: `src/pages/landing/LandingPage.tsx` (render new template when selected)
- **Edit**: `src/pages/tenant/LandingEditorPage.tsx` (add editors for editorial sections)
- **Edit**: `src/lib/seed.ts` (set Darkflix tenant to use `darkflix-editorial` template with sample content)

## 2. Split-Screen Login (Image Left, Form Right)

Both SuperAdmin login (`LoginPage.tsx`) and tenant login (`TenantLoginPage.tsx`) get a split layout:
- **Left 50%**: Full-height background image with dark overlay and gradient. For SuperAdmin: a default FlixPay brand image. For tenants: uses `tenant.theme.loginSideImage` (editable).
- **Right 50%**: Current login form (logo, fields, button).
- On mobile: image hides, form goes full-width.

### Files:
- **Edit**: `src/pages/LoginPage.tsx` (split layout)
- **Edit**: `src/pages/TenantLoginPage.tsx` (split layout with tenant image)
- **Edit**: `src/lib/types.ts` (add `loginSideImage` to TenantTheme)

## 3. Image Remove Button on All Upload Fields

Any component that has image upload (TenantFormPage, LandingEditorPage, MinhaContaPage profile photo, etc.) needs an "X" remove button that clears the image back to empty string.

Pattern: When an image URL exists, show a small red "✕" button overlaid on the image preview. Clicking it sets the field to `''`.

### Files to audit and update:
- `src/pages/superadmin/TenantFormPage.tsx` (logo, favicon uploads)
- `src/pages/tenant/LandingEditorPage.tsx` (hero images, section images)
- `src/pages/subscriber/MinhaContaPage.tsx` (profile photo)
- Any other form with image fields

---

## Technical Details

### New types in `TenantTheme`:
```typescript
type TemplateType = 'cinema-dark' | 'gradient-flow' | 'minimal-premium' | 'darkflix-editorial';

interface EditorialSection {
  type: 'manifesto' | 'experience' | 'filmTypes' | 'catalog' | 'audience' | 'whyRare';
  heading: string;
  body: string;
  image: string;
  quote?: string;
  bulletPoints?: string[];
}

// Add to TenantTheme:
editorialSections?: EditorialSection[];
loginSideImage?: string;
```

### Fonts
Add Google Fonts `Space Grotesk`, `JetBrains Mono`, and `Source Serif Pro` to `index.html` for the editorial template.

### Execution Order
1. Extend types + add fonts
2. Copy Darkflix images to assets
3. Build `DarkflixEditorialTemplate.tsx` matching all 10 Figma sections
4. Wire template selection in `LandingPage.tsx`
5. Update seed data for Darkflix
6. Implement split-screen login for both pages
7. Add image remove buttons across all upload fields
8. Update `LandingEditorPage.tsx` with editorial section editors

### New Files
- `src/components/landing/DarkflixEditorialTemplate.tsx`
- Darkflix images in `src/assets/darkflix/`

### Edited Files
- `src/lib/types.ts`
- `src/pages/landing/LandingPage.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/TenantLoginPage.tsx`
- `src/pages/tenant/LandingEditorPage.tsx`
- `src/pages/superadmin/TenantFormPage.tsx`
- `src/pages/subscriber/MinhaContaPage.tsx`
- `src/lib/seed.ts`
- `index.html` (Google Fonts)

