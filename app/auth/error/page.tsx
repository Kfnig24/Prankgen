import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ErrorPageProps {
    searchParams: {
        error: string
    }
}

interface Error {
    title: string,
    text: string,
    code: string
}

const errors: Error[] = [
    {
        code: "Configuration",
        title: "Internal Error",
        text: "Sorry, we faced an internal error"
    },
    {
        code: "AccessDenied",
        title: "Access Denied",
        text: "You are enable to do this action"
    },
    {
        code: "Verification",
        title: "Your verification email is outdated",
        text: "Please try to connect again"
    },
    {
        code: "Default",
        title: "Error",
        text: "Please try to again"
    },
]

const ErrorPage: React.FC<ErrorPageProps> = ({ searchParams }) => {
    if (!searchParams.error) return redirect("/")

    const error = errors.find((el) => el.code === searchParams.error)

    return (
        <div className="flex-col text-center">
            <h1 className="font-bold text-2xl">
                {error?.title}
            </h1>
            <p className="text-muted-foreground text-sm my-4">
                {error?.text}
            </p>

            <Link href="/auth/sign-in">
                <Button>
                    <ArrowRight className="mr-2 h-4 w-4" /> Sign in
                </Button>
            </Link>
        </div>
    )
}

export default ErrorPage