import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
    return (
        <>
            <div className="flex-col text-center">
                <div className="mb-4">
                    <h1 className="font-bold text-2xl">
                        Verification email sent
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Check your inbox and click on the link in the email
                    </p>
                </div>
                <Link href="/">
                    <Button>
                        <ArrowRight className="mr-2 h-4 w-4" /> Home
                    </Button>
                </Link>
            </div>
        </>
    )
}