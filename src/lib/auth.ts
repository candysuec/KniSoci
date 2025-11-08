import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Add other NextAuth.js configurations here as needed
  // For example:
  // callbacks: {
  //   async session({ session, token }) {
  //     // Add user ID to session
  //     if (token.sub) {
  //       session.user.id = token.sub;
  //     }
  //     return session;
  //   },
  // },
  // pages: {
  //   signIn: "/auth/signin",
  //   error: "/auth/error",
  // },
};
