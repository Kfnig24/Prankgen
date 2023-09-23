import { index } from "@/lib/prank-templates";
import TemplateGrid from "./template-grid";

export default function NewPrankPage() {
    return (
        <>
            <h4 className="font-semibold">
                Select a template for your Prank
            </h4>

            <TemplateGrid templates={index} />
        </>
    )
}