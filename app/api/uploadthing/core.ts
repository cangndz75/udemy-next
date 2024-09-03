import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
const handleAuth = () => {
    const {userId} = auth();
    if(!userId){
        throw new Error("You must be logged in to upload a file");
    }
    return {userId};
} 
export const ourFileRouter = {
    courseImage:f({image:{maxFileSize:"4MB", maxFileCount:1}}).middleware(() => handleAuth()).onUploadComplete(()=> {}),
    courseAttachment:f(["image","video","pdf", "text","audio"]).middleware(() => handleAuth()).onUploadComplete(()=> {}),
    courseVideo:f({video:{maxFileSize:"128GB", maxFileCount:1}}).middleware(() => handleAuth()).onUploadComplete(()=> {}),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;