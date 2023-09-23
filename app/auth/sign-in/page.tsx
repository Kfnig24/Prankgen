import { getServerSession } from "next-auth";
import { redirect } from "next/navigation"

import { authConfig } from "@/lib/auth";
import AuthForm from "./auth-form";

export default async function SignInPage() {
    const session = await getServerSession(authConfig)
    if (session?.user) return redirect("/")

    return(
        <div>
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">
                    Connect to Prankgen
                </h1>
                <p className="text-xs text-muted-foreground">
                    Enter your email below to connect
                </p>
            </div>
            <AuthForm />
        </div>
           
    )
}