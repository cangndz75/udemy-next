import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const muxVideo = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
  try {
    const { userId } = await auth(); // auth()'u await ile kullandım
    const { isPublished, ...values } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Kurs sahibini doğrulama
    const courseOwner = await prismadb.course.findUnique({
      where: { id: params.courseId, userId: userId },
    });

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    // Bölümü güncelle
    const chapter = await prismadb.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    // Video URL'si varsa Mux işlemleri yap
    if (values.videoUrl) {
      console.log("[MUX] Video URL:", values.videoUrl);

      const existingMuxData = await prismadb.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      // Eğer eski video varsa Mux'dan sil ve veritabanından kaldır
      if (existingMuxData) {
        try {
            await muxVideo.video.assets.delete(existingMuxData.assetId);
        } catch (error) {
            console.log("[MUX] Asset Delete Error:", error);
        }
        
        await prismadb.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      // Yeni videoyu Mux'a yükle
      const asset = await muxVideo.video.assets.create({
        input: values.videoUrl, // 'input_url' yerine 'input' kullanılıyor
        playback_policy: ["public"],
        encoding_tier: "smart",
      });
      console.log("[MUX] Asset Created:", asset);

      // playback_ids varlığını kontrol et
      if (!asset.playback_ids || asset.playback_ids.length === 0) {
        console.error("[MUX] Playback ID not found");
        return new NextResponse("Playback ID not found", { status: 500 });
      }

      // Mux verilerini veritabanına kaydet
      await prismadb.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: params.chapterId,
          playbackId: asset.playback_ids[0].id, // playback_ids'in ilk elemanı kullanılıyor
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTERID ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
      const { userId } = await auth(); // auth()'u await ile kullandım
  
      if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  
      // Kurs sahibini doğrulama
      const courseOwner = await prismadb.course.findUnique({
        where: { id: params.courseId, userId: userId },
      });
  
      if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });
  
      // Bölümü sil
      const chapter = await prismadb.chapter.findUnique({
        where: {
          id: params.chapterId,
          courseId: params.courseId,
        },
      });

      if(!chapter) return new NextResponse("Chapter not found", { status: 404 });

  
      // Video URL'si varsa Mux işlemleri yap
      if (chapter.videoUrl) {
        const existingMuxData = await prismadb.muxData.findFirst({
          where: {
            chapterId: params.chapterId,
          },
        });
  
        // Eğer eski video varsa Mux'dan sil ve veritabanından kaldır
        if (existingMuxData) {
            try {
                await muxVideo.video.assets.delete(existingMuxData.assetId);
            } catch (error) {
                console.log("[MUX] Asset Delete Error:", error);
            }
          await prismadb.muxData.delete({
            where: {
              id: existingMuxData.id,
            },
          });
        }
      }
      const deletedChapter = await prismadb.chapter.delete({
        where: {
          id: params.chapterId,
        },
      });

      const publishedChapter = await prismadb.chapter.findMany({
        where: {
          courseId: params.courseId,
          isPublished: true
        }
      });
      if(!publishedChapter.length) {
        await prismadb.course.update({
            where:{
                id:params.courseId,
            },
            data:{
                isPublished:false,
            }
        })
    }
      return NextResponse.json(deletedChapter);
    } catch (error) {
      console.error("[CHAPTERID ERROR]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  