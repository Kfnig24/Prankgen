import mongoose from "mongoose";

const PrankSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    victims: {
        type: Number,
        required: true,
        default: 0
    },
    templateId: {
        type: String,
        required: true
    },
    prankMainText: {
        type: String,
        required: true
    },
    prankText1: {
        type: String,
        required: false
    },
    prankText2: {
        type: String,
        required: false
    },
    prankImage: {
        type: String,
        required: false
    },
    prankAudio: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Prank = mongoose.models.Prank || mongoose.model("Prank", PrankSchema)
export type PrankType = mongoose.InferSchemaType<typeof PrankSchema>