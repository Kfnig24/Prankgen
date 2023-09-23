import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authConfig } from "@/lib/auth"
import OnBoardingForm from "./onboarding-form"

export default async function OnBoardingPage() {
    const session = await getServerSession(authConfig)

    if(!session) return redirect("/auth/sign-in")
    
    return (
        <div>
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">
                    Welcome to Prankgen
                </h1>
                <p className="text-xs text-muted-foreground">
                    Please give us some more information to begin pranking your friends
                </p>
            </div>
            <OnBoardingForm name={session.user?.name || ""} image={session.user?.image || ""} />
        </div>
    )
}