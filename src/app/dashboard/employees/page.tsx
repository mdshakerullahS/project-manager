"use client";

import Employees from "@/src/components/employees";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session?.user.accountType !== "Workspace") {
      router.push("/dashboard");
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return <Employees />;
}
