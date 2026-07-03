const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const INTERNAL_URL = 'http://127.0.0.1:8000/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { revalidate?: number | false } = {}
): Promise<T> {
  const { revalidate, ...fetchOptions } = options;
  
  // Set default caching behaviors for Next.js App Router
  const nextOptions: RequestInit = revalidate !== undefined
    ? { next: { revalidate } } as any
    : { cache: 'no-store' as RequestCache };

  const isServer = typeof window === 'undefined';
  const resolvedBase = isServer ? INTERNAL_URL : BASE_URL;

  const res = await fetch(`${resolvedBase}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
    ...nextOptions,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, body);
  }

  return res.json() as Promise<T>;
}
