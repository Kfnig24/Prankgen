"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

interface DeleteUserAlertProps {
    children: React.ReactNode
}

export const DeleteUserAlertProvider: React.FC<DeleteUserAlertProps> = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const deleteAccount = async () => {
        setLoading(true)

        try {
            
            const res = await fetch("/api/user", {
                method: "DELETE"
            })
            
            
            if (res.ok) {
                toast({
                    title: "Account deleted successfuly"
                })
                
                return signOut({ callbackUrl: "/auth/goodbye" })
            } else {
                toast({
                    title: "Oups, something went wrong",
                    description: "Try again",
                    variant: "destructive"
                })
            }

        } catch(err) {
            console.log(err)
            toast({
                title: "Oups, something went wrong",
                description: "Try again",
                variant: "destructive"
            })
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            {children}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""} Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={deleteAccount} className="bg-destructive">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""} Yes, I'm sure
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export const DeleteUserAlertTrigger = ({ children } : { children: React.ReactNode }) => {
    return (
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
    )
}