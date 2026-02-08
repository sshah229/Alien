"use client";

import { useEffect } from "react";
import { useAuth, SignInButton } from "@alien_org/sso-sdk-react";
import { useCurrentUser } from "../hooks/use-current-user";
import { getClientEnv } from "@/lib/env";

function truncate(value: string, max = 16) {
  return value.length > max ? `${value.slice(0, 8)}...${value.slice(-4)}` : value;
}

function formatDate(iso: string | number) {
  const d = typeof iso === "number" ? new Date(iso * 1000) : new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString();
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/60 bg-white dark:border-zinc-800/60 dark:bg-zinc-900">
      <div className="p-5">
        <div className="mb-4 h-3 w-14 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-3.5 w-14 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-3.5 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UserInfo() {
  const { auth, logout, verifyAuth } = useAuth();
  const { user, loading, error } = useCurrentUser();

  // Check if provider address looks like a placeholder
  const clientEnv = getClientEnv();
  const providerAddress = clientEnv.NEXT_PUBLIC_ALIEN_RECIPIENT_ADDRESS;
  const isPlaceholderProvider = providerAddress.includes("qqqq") || providerAddress.length < 20;

  // Verify token on mount
  useEffect(() => {
    if (auth.token) {
      verifyAuth();
    }
  }, [auth.token, verifyAuth]);

  if (loading) return <Skeleton />;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/60 bg-white dark:border-zinc-800/60 dark:bg-zinc-900">
      <div className="p-5">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          User
        </h2>
        {error ? (
          <div className="space-y-2">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : !auth.isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Sign in with your Alien ID to continue.
            </p>
            {isPlaceholderProvider ? (
              <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
                <p className="text-xs font-medium text-red-700 dark:text-red-300">
                  ⚠️ Provider Address Not Configured
                </p>
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Your provider address appears to be a placeholder. SSO login will fail until you:
                </p>
                <ol className="ml-4 mt-2 list-decimal space-y-1 text-xs text-red-600 dark:text-red-400">
                  <li>
                    Register your app in the{" "}
                    <a
                      href="https://dev.alien.org/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline"
                    >
                      Alien Dev Portal
                    </a>
                  </li>
                  <li>
                    Get your registered provider address (starts with <code className="rounded bg-red-100 px-1 py-0.5 font-mono dark:bg-red-900/50">aln1...</code>)
                  </li>
                  <li>
                    Update <code className="rounded bg-red-100 px-1 py-0.5 font-mono dark:bg-red-900/50">NEXT_PUBLIC_ALIEN_RECIPIENT_ADDRESS</code> in your <code className="rounded bg-red-100 px-1 py-0.5 font-mono dark:bg-red-900/50">.env</code> file
                  </li>
                  <li>Restart your dev server</li>
                </ol>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <SignInButton variant="short" />
                  <SignInButton variant="short" color="dark" />
                </div>
                <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    ⚠️ SSO Configuration Required
                  </p>
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    If login fails, make sure your provider address is registered in the{" "}
                    <a
                      href="https://dev.alien.org/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline"
                    >
                      Alien Dev Portal
                    </a>
                    . Update <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/50">NEXT_PUBLIC_ALIEN_RECIPIENT_ADDRESS</code> in your <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/50">.env</code> file.
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {auth.tokenInfo && (
              <dl className="space-y-3">
                {auth.tokenInfo.app_callback_session_address && (
                  <Field
                    label="Session"
                    value={truncate(auth.tokenInfo.app_callback_session_address)}
                  />
                )}
                {auth.tokenInfo.expired_at && (
                  <Field
                    label="Expires"
                    value={formatDate(auth.tokenInfo.expired_at)}
                  />
                )}
                {user && (
                  <>
                    <Field label="User ID" value={truncate(user.id)} />
                    <Field label="Alien ID" value={truncate(user.alienId)} />
                    <Field label="Created" value={formatDate(user.createdAt)} />
                  </>
                )}
              </dl>
            )}
            <button
              onClick={logout}
              className="mt-4 w-full rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}
