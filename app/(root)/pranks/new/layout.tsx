import { Heading } from "@/components/ui/heading";

export default function NewPrankLayout({ children } : { children: React.ReactNode }) {
    return (
        <>
        <Heading title="Create a Prank" description="Create a new Prank to start making fun of your friends" />
        <div className="p-4 md:p-6">
            {children}
        </div>
        </>
    )
}