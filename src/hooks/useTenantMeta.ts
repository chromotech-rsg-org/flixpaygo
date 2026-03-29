import { useEffect } from 'react';
import { Tenant } from '@/lib/types';
import { LOGO_FLIXPAY_ICON } from '@/lib/constants';

export function useTenantMeta(tenant: Tenant | null | undefined, suffix?: string) {
  useEffect(() => {
    if (!tenant) return;

    // Update title
    const title = suffix ? `${tenant.name} — ${suffix}` : tenant.name;
    document.title = title;

    // Update favicon
    const faviconUrl = tenant.faviconUrl || tenant.logoUrl || LOGO_FLIXPAY_ICON;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;

    return () => {
      document.title = 'FlixPay';
      if (link) link.href = LOGO_FLIXPAY_ICON;
    };
  }, [tenant, suffix]);
}
