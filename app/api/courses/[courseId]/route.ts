import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const muxVideo = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
})

export async function PATCH(req:Request,{params}:{params:{courseId:string}} ){
    try {
        const {userId} = auth();
        const {courseId} = params;
        //burada gelen verileri alıyoruz
        const values = await req.json();
        if(!userId){
            return new NextResponse("You must be logged in to update a course",{status:401});
        }

        const course = await prismadb.course.update({
            where:{
                id:courseId,
                userId
            },
            data:{...values}
        })
        //burada güncellenen veriyi döndürüyoruz
        return NextResponse.json(course);

    } catch (error) {
        return new NextResponse("An error occurred",{status:500});
    }
}

export async function DELETE(req:Request,{params}:{params:{courseId:string}} ){
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
        })

        if(!course){
            return new NextResponse("Course not found",{status:404});
        }
        //burada course'a ait chapter'ları siliyoruz. Çünkü course'u silebilmemiz için chapter'larını da silmemiz gerekiyor
        for(const chapter of course.chapters){
            if(chapter.muxData?.assetId){
                try {
                    await muxVideo.video.assets.delete(chapter.muxData.assetId);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        const deletedCourse = await prismadb.course.delete({
            where:{
                id:params.courseId
            }
        })
        //burada güncellenen veriyi döndürüyoruz
        return NextResponse.json(deletedCourse);

    } catch (error) {
        return new NextResponse("An error occurred",{status:500});
    }
}