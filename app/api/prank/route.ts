import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { authConfig } from "@/lib/auth";
import { index } from "@/lib/prank-templates";
import { connectToDB } from "@/lib/db";
import { Prank, PrankType } from "@/lib/models/Prank";

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authConfig)

    if (!session) return new NextResponse("Unauthorized", { status: 403 })

    try {
        await connectToDB()
        const { db } = mongoose.connection
        const users = await db.collection("users")

        const user = await users.findOne({ email: session.user.email })

        const pranks = await Prank.find<PrankType>({ author: user?._id })

        return NextResponse.json(pranks, { status: 200 })
    } catch (err) {
        console.error("[PRANKS_GET]", err)
        return new NextResponse("Internal Server Error", { status: 501 })
    }
}

interface PrankDraft {
    templateId: string,
    title: string,
    mainText: string,
    text1?: string,
    text2?: string,
    image?: string,
    audio?: string
}

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authConfig)

    if (!session) return new NextResponse("Unauthorized", { status: 403 })

    const body: PrankDraft = await req.json()

    if (!body.templateId || !body.title || !body.mainText) return new NextResponse("Paramaters are missing", { status: 404 })

    const template = index.find((el) => el.id === body.templateId)
    if (!template) return new NextResponse("Template doesn't exist", { status: 404 })

    if (
        (!body.text1 && template.requiredField?.text1?.required) ||
        (!body.text2 && template.requiredField?.text2?.required) ||
        (!body.image && template.requiredField?.image?.required) ||
        (!body.audio && template.requiredField?.audio?.required) 
    ) return new NextResponse("Parameters are missing", { status: 403 })

    try {
        await connectToDB()
        const { db } = mongoose.connection
        const users = await db.collection("users")

        const user = await users.findOne({ email: session.user.email })

        await connectToDB()
        const prank = new Prank({
            title: body.title,
            author: user?._id,
            templateId: template.id,
            prankMainText: body.mainText,
            prankText1: body.text1,
            prankText2: body.text2,
            prankImage: body.image,
            prankAudio: body.audio
        })
        const newPrank = await prank.save()

        return NextResponse.json(newPrank, { status: 201 })

    } catch (err) {
        console.error("[PRANK_POST]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}