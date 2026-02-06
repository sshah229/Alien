import { ConnectionStatus } from "@/features/auth/components/connection-status";
import { UserInfo } from "@/features/user/components/user-info";

export default function Home() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Alien Miniapp
      </h1>
      <ConnectionStatus />
      <UserInfo />
    </>
  );
}
