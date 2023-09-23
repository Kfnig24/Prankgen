import { HackingTemplate } from "@/components/templates/hacking"

type Field = "normal" | "image" | "audio"

export interface PrankTemplateIndexType {
    id: string,
    title: string,
    description: string,
    imageURL: string,
    component: React.FC,
    requiredField?: {
        text1?: {
            required: boolean,
            description: string
        },
        text2?: {
            required: boolean,
            description: string
        },
        image?: {
            required: boolean,
            description: string
        },
        audio?: {
            required: boolean,
            description: string
        },
    }
}

export const index: PrankTemplateIndexType[] = [
    {
        id: "hacking",
        title: "Hacking screen",
        description: "Display a screen that look like your friends is hacked",
        imageURL: "/screenshot_test.png",
        component: HackingTemplate,
    },
]