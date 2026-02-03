"use client";

import { useAlien } from "@alien_org/react";
import { useEffect, useState } from "react";

type User = {
  id: string;
  alienId: string;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const { authToken, isBridgeAvailable } = useAlien();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authToken) return;

    async function fetchUser() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch user");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [authToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-8 px-6 py-12">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Alien Miniapp
        </h1>

        <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Connection Status
          </h2>

          <div className="space-y-3">
            <StatusRow
              label="Bridge"
              value={isBridgeAvailable ? "Connected" : "Not available"}
              status={isBridgeAvailable ? "success" : "warning"}
            />
            <StatusRow
              label="Auth Token"
              value={authToken ? "Present" : "Missing"}
              status={authToken ? "success" : "warning"}
            />
          </div>
        </div>

        <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            User Info
          </h2>

          {loading && (
            <p className="text-sm text-zinc-500">Loading...</p>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {!authToken && !loading && (
            <p className="text-sm text-zinc-500">
              Open this app in the Alien app to authenticate.
            </p>
          )}

          {user && (
            <div className="space-y-3 text-sm">
              <InfoRow label="User ID" value={user.id} />
              <InfoRow label="Alien ID" value={user.alienId} />
              <InfoRow
                label="Created"
                value={new Date(user.createdAt).toLocaleDateString()}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "success" | "warning" | "error";
}) {
  const statusColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {value}
        </span>
        <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <span className="font-mono text-xs text-zinc-900 dark:text-zinc-100">
        {value.length > 16 ? `${value.slice(0, 8)}...${value.slice(-4)}` : value}
      </span>
    </div>
  );
}
