import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Badge, ChevronLeft, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import TitleForm from "../_components/TitleForm";
import ChapterDescriptionForm from "../_components/ChapterDescriptionForm";
import ChapterAccessForm from "../_components/ChapterAccessForm";

interface ChapterIDPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterIDPage = async ({ params }: ChapterIDPageProps) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const chapter = await prismadb.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completeText = `( ${completedFields} / ${totalFields} )`;
  return (
    <div className="p-4">
      <div className="flex items-center">
        <div className="w-full">
          <Link href={`/teacher/courses/${params.courseId}`}>
            <ChevronLeft className="h-5 w-5 mr-2" /> Back to course
          </Link>
          <div className="flex items-center justify-between w-full mt-4">
            <h1>Chapter Creation</h1>
            <span>Complete all fields {completeText} </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 md:mt-16">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="p-4">
              <LayoutDashboardIcon className="h-4 w-4 text-purple-700" />
            </Badge>
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initaldata={chapter} chapterId={params.chapterId} courseId={params.courseId} />
          <ChapterDescriptionForm initaldata={chapter} chapterId={params.chapterId} courseId={params.courseId} />
          <ChapterAccessForm  initaldata={chapter} chapterId={params.chapterId} courseId={params.courseId} />

        </div>
      </div>
    </div>
  );
};

export default ChapterIDPage;
