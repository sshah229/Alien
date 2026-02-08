"use client";

import { useAuth } from "@alien_org/sso-sdk-react";
import { useAlien } from "@alien_org/react";
import { useQuery } from "@tanstack/react-query";
import { UserDTO } from "../dto";

async function fetchCurrentUser(authToken: string): Promise<UserDTO> {
  const res = await fetch("/api/me", {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error ?? "Request failed");
  }

  return UserDTO.parse(await res.json());
}

export function useCurrentUser() {
  // Try SSO auth token first, fallback to Mini App token
  const { auth: ssoAuth } = useAuth();
  const { authToken: miniappToken } = useAlien();
  
  // Prefer SSO token if available, otherwise use Mini App token
  const authToken = ssoAuth.token ?? miniappToken ?? null;

  const { data: user, isLoading: loading, error } = useQuery({
    queryKey: ["currentUser", authToken],
    queryFn: () => fetchCurrentUser(authToken!),
    enabled: !!authToken,
  });

  return {
    user: user ?? null,
    loading,
    error: error?.message ?? null,
    isAuthenticated: !!authToken,
  };
}
