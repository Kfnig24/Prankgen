"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChangeEvent, useState } from "react"
import { Loader2 } from "lucide-react"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PrankTemplateIndexType } from "@/lib/prank-templates"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { uploadFiles } from "@/lib/uploadthing"
import { type PrankType } from "@/lib/models/Prank"

interface CreatePrankFormProps {
    template: PrankTemplateIndexType
}

const defaultSchema = z.object({
    title: z.string().min(4).max(20).nonempty(),
    mainText: z.string().nonempty().max(40),
    // Optional
    text1: z.preprocess((foo) => {
        if (!foo || typeof foo !== 'string') return undefined
        return foo === '' ? undefined : foo
    },
        z.string().nonempty().max(40).optional()
    ),
    text2: z.preprocess((foo) => {
        if (!foo || typeof foo !== 'string') return undefined
        return foo === '' ? undefined : foo
    },
        z.string().max(40).optional()
    ),
    image: z.preprocess((foo) => {
        if (!foo || typeof foo !== 'string') return undefined
        return foo === '' ? undefined : foo
    },
        z.string().min(5).url().optional()
    ),
    audio: z.preprocess((foo) => {
        if (!foo || typeof foo !== 'string') return undefined
        return foo === '' ? undefined : foo
    },
        z.string().min(5).url().optional()
    ),
}) 


const CreatePrankForm: React.FC<CreatePrankFormProps> = ({ template }) => {
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState<File>()
    const [audio, setAudio] = useState<File>()
    const { toast } = useToast()

    const formSchema = defaultSchema.required({
        text1: template.requiredField?.text1?.required ? true : undefined,
        text2: template.requiredField?.text2?.required ? true : undefined,
        image: template.requiredField?.image?.required ? true : undefined,
        audio: template.requiredField?.audio?.required ? true : undefined,
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)

        if (
            (!values.text1 && template.requiredField?.text1?.required) ||
            (!values.text2 && template.requiredField?.text2?.required) ||
            (!values.image && template.requiredField?.image?.required) ||
            (!values.audio && template.requiredField?.audio?.required)
        ) {
            return toast({
                variant: "destructive",
                title: "Please fill ALL fields"
            })
        }

        try {

            if (template.requiredField?.image?.required && image) {
                const res = await uploadFiles({
                    files: [image],
                    endpoint: "prankFiles"
                })

                values.image = res[0].fileUrl
            }
            if (template.requiredField?.audio?.required && audio) {
                const res = await uploadFiles({
                    files: [audio],
                    endpoint: "prankFiles"
                })

                values.audio = res[0].fileUrl
            }

            const res = await fetch("/api/prank", {
                method: "POST",
                body: JSON.stringify({
                    templateId: template.id,
                    ...values
                })
            })

            if (!res.ok) {
                toast({
                    variant: "destructive",
                    title: "Oups, something went wrong",
                    description: "Try again"
                })
            } else {
                toast({
                    title: "Prank created"
                })
                const prank: PrankType = await res.json()
                return window.location.assign(`/pranks/${prank._id}`)
            }

        } catch(err) {
            console.log(err)
            toast({
                variant: "destructive",
                title: "Oups, something went wrong",
                description: "Try again"
            })
        }
        setLoading(false)
    }

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();
    
        const fileReader = new FileReader();
    
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setImage(e.target.files[0]);
    
          if (!file.type.includes("image")) return;
    
          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || "";
            fieldChange(imageDataUrl);
          };
    
          fileReader.readAsDataURL(file);
        }
    };

    const handleAudio = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
        ) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setAudio(e.target.files[0]);

            if (!file.type.includes("audio")) return;

            fileReader.onload = async (event) => {
            const audioDataUrl = event.target?.result?.toString() || "";
            fieldChange(audioDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            mainText: "",
            text1: "",
            text2: "",
            image: "",
            audio: "",
        }
    })

    return (
        <Form {...form}>
            <form className="max-w-md" onSubmit={form.handleSubmit(onSubmit)}>

                {/* Display choosed template */}
                <h4 className="text-sm">
                    Template
                </h4>
                <Alert className="cursor-pointer my-2">
                    <AlertTitle className="font-semibold">
                        {template.title}
                    </AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                        {template.description}
                    </AlertDescription>
                </Alert>

                {/* Form */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prank name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} {...field} placeholder="Prank for Jeremy" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mainText"
                    render={({ field }) => (
                        <FormItem className="my-2">
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Input disabled={loading} {...field} placeholder="I got you, that was a prank" />
                            </FormControl>
                            <FormMessage />
                            <FormDescription className="text-muted-foreground">
                                This is a message for the victim after you pranked him
                            </FormDescription>
                        </FormItem>
                    )}
                />

                {/* Display optional fields */}

                { template.requiredField?.text1?.required ? <FormField 
                    name="text1"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="mb-2">
                            <FormLabel>Text n°1</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Some text" {...field} />
                            </FormControl>
                            <FormMessage />
                            <FormDescription className="text-muted-foreground">
                                {template.requiredField?.text1?.description}
                            </FormDescription>
                        </FormItem>
                    )}
                /> : "" }

                { template.requiredField?.text2?.required ? <FormField 
                    name="text2"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="mb-2">
                            <FormLabel>Text n°2</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Some text" {...field} />
                            </FormControl>
                            <FormMessage />
                            <FormDescription className="text-muted-foreground">
                                {template.requiredField?.text2?.description}
                            </FormDescription>
                        </FormItem>
                    )}
                /> : "" }

                { template.requiredField?.image?.required ? <FormField 
                    name="image"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={loading}
                                    type="file"
                                    accept="image/*"
                                    placeholder="Upload a image"
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                            <FormDescription className="text-muted-foreground">
                                {template.requiredField?.image?.description}
                            </FormDescription>
                        </FormItem>
                    )}
                /> : "" }

                { template.requiredField?.audio?.required ? <FormField 
                    name="audio"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Audio</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={loading}
                                    type="file"
                                    accept="audio/*"
                                    placeholder="Upload a audio"
                                    onChange={(e) => handleAudio(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                            <FormDescription className="text-muted-foreground">
                                {template.requiredField?.audio?.description}
                            </FormDescription>
                        </FormItem>
                    )}
                /> : "" }

                <Button type="submit" disabled={loading} className="mt-4">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""} Create
                </Button>

            </form>
        </Form>
    )
}

export default CreatePrankForm