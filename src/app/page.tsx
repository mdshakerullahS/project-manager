"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      if (status === "unauthenticated") router.push("/sign-in");

      if (status === "authenticated") {
        if (session.user.accountType === "Workspace") router.push("/dashboard");
        if (session.user.accountType === "Individual")
          router.push("/dashboard/my-tasks");
      }
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return null;
}
