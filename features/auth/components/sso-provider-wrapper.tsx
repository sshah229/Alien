"use client";

import { useEffect } from "react";
import { AlienSsoProvider } from "@alien_org/sso-sdk-react";
import { getClientEnv } from "@/lib/env";

export function SsoProviderWrapper({ children }: { children: React.ReactNode }) {
  const clientEnv = getClientEnv();

  // Suppress 400 errors from SSO API in console when provider address is not registered
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const message = String(args[0] || "");
      // Filter out SSO 400 errors
      if (
        message.includes("sso.alien-api.com") &&
        (message.includes("400") || message.includes("Failed to load resource"))
      ) {
        return; // Suppress these errors
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <AlienSsoProvider
      config={{
        ssoBaseUrl: clientEnv.NEXT_PUBLIC_SSO_BASE_URL,
        providerAddress: clientEnv.NEXT_PUBLIC_ALIEN_RECIPIENT_ADDRESS,
      }}
    >
      {children}
    </AlienSsoProvider>
  );
}

