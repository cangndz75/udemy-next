import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request, {params}: {params: {courseId: string}}) {
    try {
        const {userId} = auth();
        const {url} = await req.json();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });

        // Save the attachment to the database
        const courseOwner = await prismadb.course.findUnique({
            where: {id: params.courseId,userId:userId}, 

        })
        
        if(!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

        const attachment = await prismadb.attachment.create({
            data:{
                url,
                name:url.split("/").pop(),
                courseId:params.courseId
            }
        })

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("[ATTACHMENT]",error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}