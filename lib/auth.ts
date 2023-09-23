import type { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github" 
import GoogleProvider from "next-auth/providers/google" 
import EmailProvider from "next-auth/providers/email" 
import { MongoDBAdapter } from '@auth/mongodb-adapter'

import clientPromise from "@/lib/mongodbclient";

export const adapter = MongoDBAdapter(clientPromise, {
    databaseName: "prankgen"
})

export const authConfig: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: adapter,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string, 
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        EmailProvider({
            server: process.env.EMAIL_SERVER as string, 
            from: process.env.EMAIL_FROM as string
        }),
    ],
    pages: {
        signIn: "/auth/sign-in",
        verifyRequest: "/auth/verify-email",
        error: "/auth/error",
        newUser: "/auth/onboarding",
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, account, trigger, session }) {
            if (account) token.id = account.userId

            if (trigger === "update" && session) {
                token.name = session.name
                token.picture = session.image

                if (session.email) token.email = session.email
            }

            return token
        },
        session({ token, session }) {
            if (session.user) {
                session.user.id = token.id
            }

            return session
        }
    }
}
