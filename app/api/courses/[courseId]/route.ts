import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


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