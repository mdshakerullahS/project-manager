"use client";

import { Button } from "@/src/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function Page() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, []);

  const handleSignIn = async (provider: "google" | "github") => {
    await signIn(provider, {
      callbackUrl: "/dashboard",
    });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen p-4 mx-auto flex flex-col items-center justify-center gap-20 border border-border">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome!</h1>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <Button variant="outline" onClick={() => handleSignIn("google")}>
          <FaGoogle /> Sign in with Google
        </Button>
        <Button variant="outline" onClick={() => handleSignIn("github")}>
          <FaGithub /> Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
