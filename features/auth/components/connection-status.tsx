"use client";

import { useAlien } from "@alien_org/react";

export function ConnectionStatus() {
  const { authToken, isBridgeAvailable } = useAlien();
  const isConnected = isBridgeAvailable && authToken;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/60 bg-white dark:border-zinc-800/60 dark:bg-zinc-900">
      <div className="p-5">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Connection
        </h2>
        <div className="space-y-3">
          <Row
            label="Bridge"
            value={isBridgeAvailable ? "Connected" : "Not available"}
            ok={isBridgeAvailable}
          />
          <Row
            label="Auth Token"
            value={authToken ? "Present" : "Missing"}
            ok={!!authToken}
          />
        </div>
        {!isConnected && (
          <div className="mt-4 space-y-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              ℹ️ This is expected in local development
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              The bridge and auth token are only available when running inside the Alien app. To test authentication and payments:
            </p>
            <ol className="ml-4 list-decimal space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li>Deploy your app to a public URL (e.g., Vercel)</li>
              <li>Register your Mini App in the <a href="https://dev.alien.org/dashboard/miniapps" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Alien Dev Portal</a></li>
              <li>Open the app in the Alien app using the deeplink</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
          {value}
        </span>
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-400"}`}
        />
      </div>
    </div>
  );
}
