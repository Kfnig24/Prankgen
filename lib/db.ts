import mongoose from "mongoose"

let isConnected = false

export const connectToDB = async () => {
    mongoose.set("strictQuery", true)

    if (!process.env.MONGODB_URI) return console.log("[MONGOOSE] MONGODB_URI not found")
    if (isConnected) return console.log("[MONGOOSE] Already connected to MongoDB")

    try {
        await mongoose.connect(process.env.MONGODB_URI)

        isConnected = true

        console.log("[MONGOOSE] Connected to MongoDB")
    } catch (error) {
        console.log("[MONGOOSE] ", error)
    }
}