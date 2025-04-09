import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
    };
  }

  interface User {
    id: string;
    accessToken: string;
  }
}