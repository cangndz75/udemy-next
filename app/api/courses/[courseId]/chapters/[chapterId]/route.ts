import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req:Request, {params}: {params: {courseId: string, chapterId:string}}) {
    try {
        const {userId} = auth();
        const {isPublished, ...values} = await req.json();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });

        // Save the attachment to the database
        const courseOwner = await prismadb.course.findUnique({
            where: {id: params.courseId,userId:userId}, 

        })
        
        if(!courseOwner) return new NextResponse("Unauthorized", { status: 401 });
        const chapter = await prismadb.chapter.update({
            where:{
                id:params.chapterId,
                courseId:params.courseId
            },
            data:{
                ...values,
            }
        })

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[CHATPERID]",error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}