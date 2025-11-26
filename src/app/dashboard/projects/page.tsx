"use client";

import Projects from "@/src/components/projects";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (session?.user.accountType === "Individual") {
    router.push("/dashboard");
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return <Projects />;
}
