import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(req:Request,{params}:{params:{courseId:string}} ){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("You must be logged in to update a course",{status:401});
        }
        const course = await prismadb.course.findUnique({
            where:{
                id:params.courseId,
                userId
            },
            include:{
                chapters:{
                    include:{
                        muxData:true
                    }
                }
            }
        });

        if(!course){
            return new NextResponse("Course not found",{status:404});
        }
        const hasPublishChapter = course.chapters.some(chapter=>chapter.isPublished);
        if(!course.title || !course.description || !course.imageUrl || !course.categoryId  || !hasPublishChapter){
            return new NextResponse("You must complete all required fields to publish a course",{status:400});
        }
        const publishedCourse = await prismadb.course.update({
            where:{
                id:params.courseId,
                userId
            },
            data:{
                isPublished:false
            }
        });
        return NextResponse.json(publishedCourse);

    } catch (error) {
        return new NextResponse("An error occurred",{status:500});
    }
}