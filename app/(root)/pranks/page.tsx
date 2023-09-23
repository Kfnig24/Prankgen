import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authConfig } from "@/lib/auth"

async function getPranks() {
    const res = await fetch("http://localhost:3000/api/prank")

    if (!res.ok) {
        throw new Error(res.statusText)
    }

    return res.json()
}

export default async function PranksPage() {
    const session = await getServerSession(authConfig)

    if (!session) return redirect("/auth/sign-in")

    const pranks = await getPranks()

    console.log(pranks)

    return "Test"
}