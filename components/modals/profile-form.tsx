"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { uploadFiles } from "@/lib/uploadthing"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProfileFormModalProviderProps {
    children: React.ReactNode,
    email: string,
    name: string,
    image: string,
    update: any
}

const formSchema = z.object({
    name: z.string().min(4).max(20),
    imageURL: z.string().url({ message: "Invalid image" }).nonempty(),
    email: z.string().email().min(5).max(20)
})

export const ProfileFormModalProvider: React.FC<ProfileFormModalProviderProps> = ({ children, name, email, image, update }) => {
    const [file, setFile] = useState<File>()
    const [loading, setLoading] = useState<boolean>(false)
    const { toast } = useToast()

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
                    email: values.email,
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
                    email: values.email,
                    image: values.imageURL
                })
                toast({
                    title: "Profile updated",
                    description: "Your profile was successfuly updated",
                    variant: "default"
                })
            }

            setLoading(false)
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
            imageURL: image,
            email: email
        }
    })

    return (
        <Dialog>
            {children}
            <DialogContent>
                <DialogHeader className="text-left">
                    <DialogTitle>Profile settings</DialogTitle>
                    <DialogDescription>Edit your profile informations</DialogDescription>
                </DialogHeader>

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

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="my-4">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription className="text-red-500">
                                        Be careful to match the email with the one of the social account you connected with. If you don't, it may created a new Prankgen account the next time you connect  
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                    <div className="flex w-full justify-end">
                        <Button className="mt-4 ml-auto" disabled={loading} type="submit">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""} Save
                        </Button>
                    </div>

                    </form>
                </Form> 

            </DialogContent>
        </Dialog>
    )
}

interface ProfileFormModalTriggerProps {
    children: React.ReactNode
}

export const ProfileFormModalTrigger: React.FC<ProfileFormModalTriggerProps> = ({ children }) => {
    return (
        <DialogTrigger asChild>
            { children }
        </DialogTrigger>
    )
}