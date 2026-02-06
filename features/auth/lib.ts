import { createAuthClient, type AuthClient } from "@alien_org/auth-client";

let authClient: AuthClient | null = null;

function getAuthClient(): AuthClient {
  if (!authClient) {
    authClient = createAuthClient({
      jwksUrl: "https://sso.develop.alien-api.com/oauth/jwks",
    });
  }
  return authClient;
}

export type TokenInfo = Awaited<ReturnType<AuthClient["verifyToken"]>>;

export function verifyToken(accessToken: string): Promise<TokenInfo> {
  return getAuthClient().verifyToken(accessToken);
}

export function extractBearerToken(header: string | null): string | null {
  return header?.startsWith("Bearer ") ? header.slice(7) : null;
}
