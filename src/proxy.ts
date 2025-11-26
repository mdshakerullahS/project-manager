import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./app/api/auth/[...nextauth]/route";

export async function proxy(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user)
    return NextResponse.redirect(new URL("/sign-in", request.url));

  if (!session.user.accountType)
    return NextResponse.redirect(new URL("/onboarding", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
