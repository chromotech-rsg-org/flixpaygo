

## Analysis

The zombie's head is being clipped because section 4 has `overflow-hidden`, which clips content in **all** directions — including upward where the zombie needs to protrude. Previous attempts with z-index and negative margins didn't help because `overflow-hidden` always wins over z-index.

CSS has a known limitation: you can't set `overflow-x: hidden` and `overflow-y: visible` independently (they collapse). However, the newer CSS value `overflow: clip` with `overflow-clip-margin` or using `overflow-x: clip` specifically solves this.

## Plan

**Single file change** in `src/components/landing/DarkflixEditorialTemplateV2.tsx` (line 170):

1. Replace `overflow-hidden` on the section 4 container with an inline style that uses `overflowX: 'clip', overflowY: 'visible'`. This allows the zombie to visually break out of the top boundary while still preventing horizontal scrollbars from the wide image.

```tsx
// Before
<section className="relative overflow-hidden">

// After  
<section className="relative" style={{ overflowX: 'clip', overflowY: 'visible' }}>
```

That's the only change needed — the negative margins and z-index already in place will then work correctly.

