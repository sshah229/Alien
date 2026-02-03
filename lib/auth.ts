import { createAuthClient, type AuthClient } from "@alien_org/auth-client";

// Singleton auth client
let authClient: AuthClient | null = null;

export function getAuthClient(): AuthClient {
  if (!authClient) {
    authClient = createAuthClient();
  }
  return authClient;
}

/**
 * Verify an access token and return the token info
 * The 'sub' field contains the user's Alien ID
 */
export async function verifyToken(accessToken: string) {
  const client = getAuthClient();
  return client.verifyToken(accessToken);
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
