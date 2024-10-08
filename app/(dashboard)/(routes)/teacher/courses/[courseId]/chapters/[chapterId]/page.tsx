import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  Badge,
  ChevronLeft,
  LayoutDashboardIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import TitleForm from "../_components/TitleForm";
import ChapterDescriptionForm from "../_components/ChapterDescriptionForm";
import ChapterAccessForm from "../_components/ChapterAccessForm";
import ChapterVideoForm from "../_components/ChapterVideoForm";
import Banner from "@/components/Banner";
import ChapterAction from "../_components/ChapterAction";

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

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!chapter?.isPublished && (
        <Banner label="This chapter is unplished" variant={"warning"}></Banner>
      )}
      <div className="p-4">
        <div className="items-center">
          <div className="w-36">
            <Link href={`/teacher/courses/${params.courseId}`} className="flex items-center">
              <ChevronLeft className="h-5 w-5 mr-2" /> Back to course
            </Link>
          </div>
          <div className="flex items-center justify-between w-full mt-4">
            <h1 className="text-4xl font-semibold">Chapter Creation</h1>
            <span>Complete all fields {completeText} </span>
            <ChapterAction
              chapterId={params.chapterId}
              courseId={params.courseId}
              disabled={!isComplete}
              isPublished={chapter.isPublished}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 md:mt-16">
          {/* col span 1 */}
          <div>
            <div className="flex items-center gap-2">
              <Badge className="p-4">
                <LayoutDashboardIcon className="h-4 w-4 text-purple-700" />
              </Badge>
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm
              initaldata={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
            <ChapterDescriptionForm
              initaldata={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
            <ChapterAccessForm
              initaldata={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>

          {/* col span 2 */}
          <div>
            <div className="flex items-center gap-2">
              <Badge className="p-4">
                <VideoIcon className="h-4 w-4 text-purple-700" />
              </Badge>
              <h2 className="text-xl">Chapter Detail</h2>
            </div>
            <ChapterVideoForm
              initaldata={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIDPage;
