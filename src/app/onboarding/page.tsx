"use client";

import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [type, setType] = useState<"Individual" | "Workspace" | null>(null);

  const handleSubmit = async (selected: "Individual" | "Workspace") => {
    setType(selected);

    await fetch(`/api/users/${session?.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountType: selected }),
    });

    router.push("/dashboard");
  };

  useEffect(() => {
    if (!session || !session.user) {
      router.push("/sign-in");
      return;
    }

    if (session.user.accountType) {
      router.push("/dashboard");
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen p-4 mx-auto flex flex-col items-center justify-center gap-4 border border-border">
      <h2 className="text-xl font-semibold">Continue as</h2>

      <div className="flex items-center gap-3">
        <Button
          variant={type === "Individual" ? "outline" : "ghost"}
          size="lg"
          onClick={() => handleSubmit("Individual")}
          className="px-2"
        >
          Individual
        </Button>
        Or
        <Button
          variant={type === "Workspace" ? "outline" : "ghost"}
          size="lg"
          onClick={() => handleSubmit("Workspace")}
          className="px-2"
        >
          Workspace
        </Button>
      </div>
    </div>
  );
}
