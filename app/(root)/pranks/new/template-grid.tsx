"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PrankTemplateIndexType } from "@/lib/prank-templates"

export default function TemplateGrid({ templates }: { templates: PrankTemplateIndexType[] }) {
    const [templateModal, setTemplateModal] = useState<PrankTemplateIndexType>()

    return (
        <div className="w-full justify-center mt-2 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Dialog>

                    {templates.map((template) => (
                        <Card key={template.id}>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">
                                    {template.title}
                                </CardTitle>
                                <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="justify-between">

                                <Button variant="outline" asChild onClick={() => setTemplateModal(template)}>
                                    <DialogTrigger>
                                        See more
                                    </DialogTrigger>
                                </Button>

                                <Button asChild>
                                    <Link href={`/pranks/new/${template.id}`}>
                                        Choose
                                    </Link>
                                </Button>

                            </CardFooter>
                        </Card>
                    ))}

                    <DialogContent>
                        <Image 
                            className="rounded-md"
                            src={templateModal?.imageURL as string}
                            alt={`${templateModal?.title} template screenshot`} 
                            width={400}
                            height={400}
                        />

                        <DialogHeader className="text-left">
                            <DialogTitle>
                                {templateModal?.title}
                            </DialogTitle>
                            <DialogDescription>
                                {templateModal?.description}
                            </DialogDescription>
                        </DialogHeader>

                        <Button className="ml-auto" asChild>
                            <Link href={`/pranks/new/${templateModal?.id}`}>
                                Choose
                            </Link>
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
    )
}