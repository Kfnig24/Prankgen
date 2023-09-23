"use client"

import { Home, List, Loader2, LogOut, Plus, Settings, Trash } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileFormModalProvider, ProfileFormModalTrigger } from "@/components/modals/profile-form"
import { DeleteUserAlertProvider, DeleteUserAlertTrigger } from "@/components/modals/delete-user-alert"

export const TopBar: React.FC = () => {
    const { data, status, update } = useSession()

    const router = useRouter()

    if (status == "loading" && !data) return (
        <div className="flex fixed flex-row justify-center items-center p-4 top-0 left-0 w-screen bg-white">
            <Loader2 className="my-auto animate-spin" />
        </div>
    )

    if (status == "unauthenticated") router.push("/auth/sign-in")

    return (
        <div className="flex fixed flex-row justify-between items-center z-40 p-4 top-0 left-0 w-screen bg-white">

            <Link href="/" className="font-semibold text-sm">
                Hello {data?.user.name}
            </Link>

            <ProfileFormModalProvider email={data?.user.email as string} image={data?.user.image as string} name={data?.user.name as string} update={update}>
                <DeleteUserAlertProvider>
                    <DropdownMenu>

                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage alt="profile picture" src={data?.user.image as string} />
                                <AvatarFallback>Profile</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>

                            {/* Prank section */}
                            <DropdownMenuLabel>My Pranks</DropdownMenuLabel>

                            <DropdownMenuItem asChild>
                                <Link href="/pranks/new">
                                    <Plus className="mr-2 h-4 w-4" /> New Prank
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/pranks">
                                    <List className="mr-2 h-4 w-4" /> My Pranks
                                </Link>
                            </DropdownMenuItem>

                            {/* Profile section */}
                            <DropdownMenuLabel>My Profile</DropdownMenuLabel>

                            <DropdownMenuItem asChild>
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" /> Dashboard
                                </Link>
                            </DropdownMenuItem>

                            <ProfileFormModalTrigger>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" /> Profile settings
                                </DropdownMenuItem>
                            </ProfileFormModalTrigger>

                            <DropdownMenuItem onClick={() => signOut()}>
                                <LogOut className="mr-2 h-4 w-4" /> Log out
                            </DropdownMenuItem>

                            <DeleteUserAlertTrigger>
                                <DropdownMenuItem className="bg-destructive text-white font-bold hover:bg-destructive-foreground">
                                    <Trash className="mr-2 h-4 w-4" /> Delete your account
                                </DropdownMenuItem>
                            </DeleteUserAlertTrigger>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </DeleteUserAlertProvider>
            </ProfileFormModalProvider>
        </div>
    )
}