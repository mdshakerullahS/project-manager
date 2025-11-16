import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import dbConnect from "@/src/lib/db";
import User from "@/src/app/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accountType: "Individual" | "Workspace" | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        await dbConnect();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const created = await User.create({
            accountType: null,
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account?.provider,
          });
        }

        return true;
      } catch (error: any) {
        console.log(error.message);

        return false;
      }
    },

    async session({ session }) {
      try {
        await dbConnect();

        if (session.user?.email) {
          const dbUser = await User.findOne({ email: session.user.email });

          if (dbUser) {
            session.user.accountType = dbUser.accountType;
            session.user.id = dbUser._id.toString();
            session.user.name = dbUser.name;
            session.user.email = dbUser.email;
            session.user.image = dbUser.image;
          }
        }
        return session;
      } catch (error: any) {
        console.log(error.message);
        return session;
      }
    },
  },

  pages: { signIn: "/sign-in" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
