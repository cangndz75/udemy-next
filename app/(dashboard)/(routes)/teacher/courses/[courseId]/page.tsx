import { Badge } from "@/components/ui/badge";
import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  BarChart3,
  CassetteTapeIcon,
  ChevronLeft,
  DollarSignIcon,
  FileX2Icon,
  ImageIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChapterForm from "./_components/ChapterForm";
import Banner from "@/components/Banner";
import Link from "next/link";
import CourseAction from "./_components/CourseAction";

interface CourseDetailProps {
  params: {
    courseId: string;
  };
}

const CourseDetail = async ({ params }: CourseDetailProps) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await prismadb.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const RequiredFields = [
    course.title,
    course.description,
    course.price,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = RequiredFields.length;
  const completedFields = RequiredFields.filter(Boolean).length;
  const completeText = `( ${completedFields} / ${totalFields} )`;
  const isComplete = RequiredFields.every(Boolean);

  const categories = await prismadb.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      {!course?.isPublished && (
        <Banner label="This chapter is unplished" variant={"warning"}></Banner>
      )}
      <div className="container mx-auto">
        <div className="items-center">
          <div className="w-36">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center"
            >
              <ChevronLeft className="h-5 w-5 mr-2" /> Back to course
            </Link>
          </div>
          <div className="flex items-center justify-between w-full mt-4">
            <span>Complete all fields {completeText} </span>
            <CourseAction
              courseId={params.courseId}
              disabled={!isComplete}
              isPublished={course.isPublished}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-3">
            <h1 className="text-2xl md:text-3xl text-purple-600 font-semibold">
              Course Setup
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="p-4" variant={"mybadge"}>
                  <LayoutDashboardIcon className="h-4 w-4 text-purple-700" />
                </Badge>
                <h2>Customize your course</h2>
              </div>
              <TitleForm initaldata={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Badge className="p-4" variant={"mybadge"}>
                  <LayoutDashboardIcon className="h-4 w-4 text-purple-700" />
                </Badge>
                <h2>Description your course</h2>
              </div>
              <DescriptionForm initaldata={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Badge className="p-4" variant={"mybadge"}>
                  <CassetteTapeIcon className="h-4 w-4 text-purple-700" />
                </Badge>
                <h2>Category your course</h2>
              </div>
              <CategoryForm
                initaldata={course}
                courseId={course.id}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="p-4" variant={"mybadge"}>
                  <BarChart3 className="h-4 w-4 text-purple-700" />
                </Badge>
                <h2>Chapter</h2>
              </div>
              <ChapterForm initaldata={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Badge className="p-4" variant={"mybadge"}>
                  <ImageIcon className="h-4 w-4 text-purple-700" />
                </Badge>
                <h2>Image your course</h2>
              </div>
              <ImageForm initaldata={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Badge className="p-4" variant={"mybadge"}>
                  <DollarSignIcon className="h-4 w-4 text-purple-700" />
                </Badge>
                <h2>Price your course</h2>
              </div>
              <PriceForm initaldata={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Badge className="p-4" variant={"mybadge"}>
                  <FileX2Icon className="h-4 w-4 text-purple-700" />
                </Badge>
                <h2>Attachment your course</h2>
              </div>
              <AttachmentForm initaldata={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
