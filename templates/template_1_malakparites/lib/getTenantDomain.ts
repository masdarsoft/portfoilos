/**
 * Returns the tenant domain for the current request.
 * In production: read from the incoming host header (handled in middleware or serverside).
 * In development: read from TENANT_DOMAIN env var.
 */
export function getTenantDomain(): string {
  return process.env.TENANT_DOMAIN ?? process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'najdalzian.com';
}
