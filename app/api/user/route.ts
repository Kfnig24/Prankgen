import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { utapi } from "uploadthing/server"

import { authConfig } from "@/lib/auth";
import { getKeyFromUrl, isSelfHostedImage } from "@/lib/utils";
import mongoose from "mongoose";

export const PUT = async (req: NextRequest) => {
    const session = await getServerSession(authConfig)

    if (!session) return new NextResponse("Unauthorized", { status: 403 })

    const body = await req.json()

    try {
        const { db } = mongoose.connection
        const users = await db.collection("users")

        const user = await users.findOne({ email: session.user.email })

        if (body.image && isSelfHostedImage(user?.image)) {
            const imageKey = getKeyFromUrl(user?.image)
            await utapi.deleteFiles(imageKey)
        }

        await users.updateOne({ _id: user?._id }, { $set: {
            email: body.email || user?.email,
            name: body.name || user?.name,
            image: body.image || user?.image,
        } }, { upsert: false })

        return new NextResponse("User updated successfuly", { status: 201 })
    } catch (err) {
        console.error("[USER_PUT]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSession(authConfig)

    if (!session) return new NextResponse("Unauthorized", { status: 403 })

    try {
        const imageURL = session.user.image as string
        
        const { db } = mongoose.connection
        const users = await db.collection("users")
        const accounts = await db.collection("accounts")
        const sessions = await db.collection("sessions")

        const user = await users.findOne({ email: session.user.email })

        await users.deleteOne({
            _id: user?._id
        })
        await accounts.deleteMany({
            userId: user?._id
        })
        await sessions.deleteMany({
            userId: user?._id
        })
            
        if (isSelfHostedImage(imageURL)) {
            await utapi.deleteFiles(getKeyFromUrl(imageURL))
        }

        // TODO: Delete all user prank, etc

        return new NextResponse("User deleted successfuly", { status: 200 })
        
    } catch (err) {
        console.error("[USER_DELETE]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}