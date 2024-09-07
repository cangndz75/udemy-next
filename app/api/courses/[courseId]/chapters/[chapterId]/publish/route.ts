import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
      const { userId } = await auth(); // auth()'u await ile kullandım
  
      if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  
      // Kurs sahibini doğrulama
      const courseOwner = await prismadb.course.findUnique({
        where: { id: params.courseId, userId: userId },
      });
  
      if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });
      const chapter = await prismadb.chapter.findUnique({
        where: {
          id: params.chapterId,
          courseId: params.courseId,
        },
      });
      const muxData = await prismadb.muxData.findUnique({
        where: {
          chapterId: params.chapterId,
        },
      });

      if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) { 
        return new NextResponse("Chapter not found", { status: 404 });
      }

      const publishedChapter = await prismadb.chapter.update({
        where:{
            id: params.chapterId,
            courseId: params.courseId,
            },
            data:
            {
                isPublished: true
            }
      })

      return NextResponse.json(publishedChapter);
    } catch (error) {
      console.error("[CHAPTERID ERROR]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }