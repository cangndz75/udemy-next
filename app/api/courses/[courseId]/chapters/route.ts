import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request,{params}:{params:{courseId:string}}){
    try {
        const {userId} = auth();
        //bu kısımda gelen veriyi alıyoruz
        const {title} = await req.json();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });

        // Save the attachment to the database
        const courseOwner = await prismadb.course.findUnique({
            where: {id: params.courseId,userId:userId}, 

        })
        
        if(!courseOwner) return new NextResponse("Unauthorized", { status: 401 });
        const lastChapter = await prismadb.chapter.findFirst({
            where:{
                courseId:params.courseId,
            },
            orderBy:{
                position:"desc"
            }
        });
        //yeni bir chapter oluşturulur ve position değeri belirlenir.
        //eğer varsa position değeri son chapter'ın position değerine 1 eklenir.
        //:1 yazdık çünkü başlangıç değeri 1'den başlamalıdır.
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;
        const chapter = await prismadb.chapter.create({
            data:{
                title,
                courseId:params.courseId,
                position:newPosition
            }
        })
        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[CHAPTER]",error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}