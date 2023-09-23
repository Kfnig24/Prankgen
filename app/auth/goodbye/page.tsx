import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GoodbyePage() {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">
                We're sorry that you quit us
            </h1>
            <p className="text-muted-foreground">
                Hope that your life will not be boring without us
            </p>

            <Button asChild>
                <Link className="mt-4" href="/auth/sign-in">
                    <ArrowRight className="mr-2 h-4 w-4" /> Connect
                </Link>
            </Button>
        </div>
    )
}