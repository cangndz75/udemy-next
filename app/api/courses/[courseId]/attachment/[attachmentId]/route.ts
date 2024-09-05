import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req:Request, {params}: {params: {courseId: string,attachmentId:string  }}) {
    try {
        //kullanıcı kimliğini alırız
        const {userId} = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });
        //kullanıcının sahip olduğu kursu alırız.
        const courseOwner = await prismadb.course.findUnique({
            where: {id: params.courseId,userId:userId}, 
        })
        if(!courseOwner) return new NextResponse("Unauthorized", { status: 401 });
        //veritabanından silme işlemi. detaylı bahsetmek gerekirse, 
        //silinecek olan dosyanın courseId ve id'si ile eşleşen dosyayı siler.
        const attachment = await prismadb.attachment.delete({
            where:{
                courseId:params.courseId,
                id:params.attachmentId
            }
        })

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("[ATTACHMENT]",error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}