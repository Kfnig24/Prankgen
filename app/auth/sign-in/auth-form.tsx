"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Icons from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    email: z.string().email().min(5).max(20),
})

export default function AuthForm() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    })

    const emailAuth = (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            signIn("email", { email: values.email })
        } catch (error) {
            toast({
                title: "Oups, something went wrong",
                variant: "destructive"
            })
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const providerAuth = (provider: "github" | "google") => {
        try {
            setLoading(true)
            signIn(provider, { callbackUrl: "/" })
        } catch (error) {
            setLoading(true)
            toast({
                title: "Oups, something went wrong",
                variant: "destructive"
            })
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form className="my-4" onSubmit={form.handleSubmit(emailAuth)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="mb-2">
                                <FormControl>
                                    <Input disabled={loading} className="w-[340px] md:w-[380px] p-4" placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormMessage className="pl-2" />
                            </FormItem>
                        )}
                    />
                    <Button className="w-[340px] md:w-[380px]" disabled={loading} type="submit">
                        { loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : ""} Connect with Email
                    </Button>
                </form>
            </Form>

            <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or connect with
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Button onClick={() => providerAuth("github")} disabled={loading} className="w-[340px] md:w-[380px] bg-slate-900">
                    { loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Icons.github className="w-4 h-4 mr-2" /> } Connect with Github
                </Button>
                <Button onClick={() => providerAuth("google")} variant="outline" disabled={loading} className="w-[340px] md:w-[380px]">
                    { loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Icons.google className="w-4 h-4 mr-2" /> } Connect with Google
                </Button>
            </div>
        </div>
    )
}