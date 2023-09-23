"use client"

import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangeEvent, useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { uploadFiles } from "@/lib/uploadthing"
import { useToast } from "@/components/ui/use-toast"

interface OnBoardingFormProps {
    name: string,
    image: string
}

const formSchema = z.object({
    name: z.string().min(4).max(20),
    imageURL: z.string().url({ message: "Invalid image" }).nonempty()
})

const OnBoardingForm: React.FC<OnBoardingFormProps> = ({ name, image }) => {
    const { update } = useSession()
    const [file, setFile] = useState<File>()
    const [loading, setLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
      ) => {
        e.preventDefault();
    
        const fileReader = new FileReader();
    
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setFile(e.target.files[0]);
    
          if (!file.type.includes("image")) return;
    
          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || "";
            fieldChange(imageDataUrl);
          };
    
          fileReader.readAsDataURL(file);
        }
      };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)

        try {
            
            if (image !== values.imageURL) {
                const res = await uploadFiles({
                    endpoint: "profileImage",
                    files: [file as File]
                })
                values.imageURL = res[0].fileUrl
            }
    
            const res = await fetch("/api/user", {
                method: "PUT",
                body: JSON.stringify({
                    name: values.name,
                    image: values.imageURL
                })
            })

            if (!res.ok) {
                toast({
                    title: "An error happen while updating your profile",
                    variant: "destructive"
                })
            } else {
                update({
                    name: values.name,
                    image: values.imageURL
                })
            }

            return router.push("/")
        } catch (error) {
            console.log(error)
            toast({
                title: "Oups, something went wrong",
                description: "Try again",
                variant: "destructive"
            })
            setLoading(false)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name,
            imageURL: image
        }
    })

    return (
        <Form {...form}>
            <form className="block" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="imageURL"
                    render={({ field }) => (
                        <FormItem className="flex flex-row justify-between items-center my-4">
                            <Avatar className="mx-8 w-16 h-16">
                                <AvatarImage alt="Profile picture" src={field.value} />
                                <AvatarFallback>Hello</AvatarFallback>
                            </Avatar>
                            <div className="grow">
                                <FormLabel>Profile picture</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="file"
                                        accept="image/*"
                                        placeholder="Upload a profile photo"
                                        onChange={(e) => handleImage(e, field.onChange)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="MegaPranker57" {...field} />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>This is your public name</FormDescription>
                        </FormItem>
                    )}
                />

                <Button className="mt-4 ml-auto" disabled={loading} type="submit">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""} Continue
                </Button>
            </form>
        </Form>
    )
}

export default OnBoardingForm