// lib/api/client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

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
  
  // Set default caching headers/behaviors for Next.js App Router
  const nextOptions: RequestInit = revalidate !== undefined
    ? { next: { revalidate } } as any
    : { cache: 'no-store' as RequestCache };

  const res = await fetch(`${BASE_URL}${path}`, {
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
