import { JWT } from "next-auth/jwt"
import NextAuth, { DefaultSession } from "next-auth"
import type { ObjectId } from "mongodb"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
}