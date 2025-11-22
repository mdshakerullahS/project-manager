"use client";

import Projects from "@/src/components/projects";
import { useSession } from "next-auth/react";

export default function Page() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return <Projects />;
}
