import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function get(req: Request) {
    try {
        const {userId} = auth();
        const {title} = await req.json();

        if(!userId) {
            throw new Error('You must be logged in to create a course');
        }

        if(!title) {
            throw new Error('You must provide a title for the course');
        }
        const course = await prismadb.course.create({
            data:{
                userId,
                title
            }
        })

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSES", error);
        return new NextResponse("An error occurred", {status: 500});
    }
}