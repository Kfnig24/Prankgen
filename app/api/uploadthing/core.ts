import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { authConfig } from "@/lib/auth";
 
const f = createUploadthing();
 
const auth = async (req: Request) => await getServerSession(authConfig); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth(req);
 
      // // If you throw, the user will not be able to upload
      if (!session) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userEmail: session.user?.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("[UPLOADTHING_PRANKFILES] Upload complete as ", metadata.userEmail);
    }),

  prankFiles: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }, audio: { maxFileSize: "4MB", maxFileCount: 1 } })
  // Set permissions and file types for this FileRoute
  .middleware(async ({ req }) => {
    // This code runs on your server before upload
    const session = await auth(req);

    // // If you throw, the user will not be able to upload
    if (!session) throw new Error("Unauthorized");

    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return { userEmail: session.user?.email };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    // This code RUNS ON YOUR SERVER after upload
    console.log("[UPLOADTHING_PRANKFILES] Upload complete as ", metadata.userEmail);
  }),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;