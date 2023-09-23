import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authConfig } from "@/lib/auth"
import { TopBar } from "@/components/navbar"

interface DashboardLayoutProps {
    children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = async ({ children }) => {
    const session = await getServerSession(authConfig)

    if(!session) return redirect("/auth/sign-in")

    return (
        <>
        <TopBar />
        <main className="mt-20">
            { children }
        </main>
        </>
    )
} 

export default DashboardLayout