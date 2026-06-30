import { apiFetch, ApiError } from './client';

export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  city?: string;
}

export interface RentalCategory {
  id: string;
  title: string;
  seoTitle: string;
  description: string;
  icon: any; // Can be string (from REST API) or React component (from static fallback)
  mainImage: string;
  gallery: string[];
  seoKeywords?: string[];
  seoDescription?: string;
  features?: string[];
  blogContent?: string;
  reviews?: Review[];
}

function getIconName(iconField: any): string {
  if (!iconField) return 'Sparkles';
  if (typeof iconField === 'string') return iconField;
  // If it's a function/component from static imports, extract its display/function name
  return iconField.displayName || iconField.name || 'Sparkles';
}

// Convert Django REST snake_case response to Next.js camelCase
function mapApiToFrontend(apiCat: any): RentalCategory {
  const cleanUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const origin = new URL(apiUrl).origin;
    return `${origin}/media/${url}`;
  };

  return {
    id: apiCat.slug || apiCat.id,
    title: apiCat.title,
    seoTitle: apiCat.seo_title || apiCat.title,
    description: apiCat.description,
    icon: getIconName(apiCat.icon),
    mainImage: cleanUrl(apiCat.main_image),
    gallery: (apiCat.gallery_images || []).map((imgObj: any) => cleanUrl(imgObj.image)),
    seoKeywords: apiCat.seo_keywords || [],
    seoDescription: apiCat.seo_description || '',
    features: apiCat.features || [],
    blogContent: apiCat.blog_content || '',
    reviews: (apiCat.reviews || []).map((rev: any) => ({
      name: rev.reviewer_name,
      rating: rev.rating,
      text: rev.text,
      date: rev.review_date || '',
      city: rev.city || '',
    })),
  };
}

// Fallback seed data from app/constants static file
import { RENTAL_CATEGORIES as STATIC_CATEGORIES } from '../../app/constants';

function staticToApiShape(cat: any): RentalCategory {
  return {
    id: cat.id,
    title: cat.title,
    seoTitle: cat.seoTitle,
    description: cat.description,
    icon: getIconName(cat.icon),
    mainImage: cat.mainImage,
    gallery: cat.gallery || [],
    seoKeywords: cat.seoKeywords || [],
    seoDescription: cat.seoDescription || '',
    features: cat.features || [],
    blogContent: cat.blogContent || '',
    reviews: (cat.reviews || []).map((r: any) => ({
      name: r.name,
      rating: r.rating,
      text: r.text,
      date: r.date || '',
      city: r.city || '',
    })),
  };
}

export async function getCategories(domain: string): Promise<RentalCategory[]> {
  try {
    const data = await apiFetch<any[]>(
      `/catalog/?domain=${encodeURIComponent(domain)}`,
      { revalidate: 60 }
    );
    return data.map(mapApiToFrontend);
  } catch (err) {
    console.warn('[getCategories] API unreachable or failed, using static fallback:', err);
    return STATIC_CATEGORIES.map(staticToApiShape);
  }
}

export async function getCategory(domain: string, slug: string): Promise<RentalCategory | null> {
  try {
    const data = await apiFetch<any>(
      `/catalog/${slug}/?domain=${encodeURIComponent(domain)}`,
      { revalidate: 60 }
    );
    return mapApiToFrontend(data);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    console.warn(`[getCategory] API for slug "${slug}" failed, using static fallback:`, err);
    const found = STATIC_CATEGORIES.find(c => c.id === slug);
    return found ? staticToApiShape(found) : null;
  }
}
