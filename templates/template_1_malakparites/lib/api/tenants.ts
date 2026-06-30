import { apiFetch, ApiError } from './client';

export interface TenantTheme {
  primary: string;
  dark: string;
  light: string;
  gold_accent: string;
  gold_light: string;
  bg_soft: string;
}

export interface TenantAnalytics {
  gtm_id?: string;
  ga_id?: string;
}

export interface Tenant {
  id: string;
  subdomain: string;
  custom_domain: string | null;
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  geo_lat: string | null;
  geo_lng: string | null;
  logo: string;
  favicon: string;
  theme: TenantTheme;
  analytics: TenantAnalytics;
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  font_family: string;
  meta_title: string;
  meta_description: string;
}

// Fallback static tenant for Malak Parties (used if API is unreachable)
export const FALLBACK_TENANT: Tenant = {
  id: 'static-fallback-malak',
  subdomain: 'malak-parties',
  custom_domain: 'malakparties.com',
  name: 'مؤسسة ملك الحفلات لتجهيز المناسبات',
  tagline: 'تجهيز المناسبات والفعاليات الراقية',
  phone: '+966569436019',
  whatsapp: '+966569436019',
  email: 'info@malakparties.com',
  address: 'الرياض، المملكة العربية السعودية',
  city: 'الرياض',
  geo_lat: '24.8122',
  geo_lng: '46.6133',
  logo: '/logo.png',
  favicon: '/icon.png',
  theme: {
    primary: '#0B132B',
    dark: '#1C2541',
    light: '#3A506B',
    gold_accent: '#C5A880',
    gold_light: '#E6D7C3',
    bg_soft: '#F8F9FA',
  },
  analytics: {
    gtm_id: '',
    ga_id: '',
  },
  language: 'ar',
  direction: 'rtl',
  font_family: 'Tajawal',
  meta_title: 'مؤسسة ملك الحفلات | تأجير خيام ومكيفات وجلسات بالرياض',
  meta_description: 'ملك الحفلات: أفضل خدمات تأجير خيام ملكية، مكيفات صحراوية وفريون، بيوت شعر، وجلسات خارجية بالرياض بأسعار منافسة.',
};

export async function getTenant(domain: string): Promise<Tenant> {
  try {
    return await apiFetch<Tenant>(`/tenants/resolve/?domain=${encodeURIComponent(domain)}`, {
      revalidate: 10,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) throw err;
    console.warn('[getTenant] API unreachable, using fallback tenant');
    return FALLBACK_TENANT;
  }
}
