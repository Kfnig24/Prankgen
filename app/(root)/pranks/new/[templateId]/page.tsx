import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { PrankTemplateIndexType, index } from "@/lib/prank-templates"
import CreatePrankForm from "./create-prank-form"

interface NewPrankProps {
    params: {
        templateId: string
    }
}

const NewPrankPage: React.FC<NewPrankProps> = ({ params }) => {
    const template = index.find((el) => el.id === params.templateId)

    return (
        <>
            <Link className="flex flex-row items-center font-semibold text-sm mb-4" href="/pranks/new">
                <ArrowLeft className="mr-2 h-4 w-4" /> Choose another template
            </Link>
            <CreatePrankForm template={template as PrankTemplateIndexType} />
        </>
    )
}

export default NewPrankPage