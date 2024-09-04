import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {userId} = auth();
        const {title} = await req.json();

        if(!userId) {
            throw new NextResponse('Unauthorized', {status: 401});
        }
        if(!title) {
            throw new NextResponse('Title is required', {status: 400});
        }

        const course = await prismadb.course.create({
            data:{
                userId,
                title
            }
        })

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("An error occurred", {status: 500});
    }
}