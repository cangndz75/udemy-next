import { Badge } from "@/components/ui/badge";
import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  BarChart3,
  CassetteTapeIcon,
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

interface CourseDetailProps {
  //Burada id ile değeri almak için klasörün adını belirtiyoruz
  params: {
    courseId: string;
  };
}

const CourseDetail = async ({ params }: CourseDetailProps) => {
  //Kullanıcı eğer giriş yapmamışsa anasayfaya yönlendirme yapılıyor.
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  //courseId var mı kontrolü yapılıyor.
  const course = await prismadb.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters:{
        orderBy:{
          position:"asc"
        }
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
    //Kursun chapter'larından herhangi biri yayınlanmış mı kontrolü yapılıyor.
    course.chapters.some(chapter => chapter.isPublished)
  ];

  const totalFields = RequiredFields.length;
  const completeFields = RequiredFields.filter(Boolean).length;
  const completeText = `(${completeFields}/${totalFields})`;
  //Kategorileri almak için category tablosundan verileri çekiyoruz ve name alanına göre sıralıyoruz
  const categories = await prismadb.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-3">
          <h1 className="text-2xl md:text-3xl text-purple-600 font-semibold">
            Course Setup
          </h1>
          <span className="text-base">
            Complete all fields {completeFields}/{totalFields}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
        {/*col-span 1 */}
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
          <div className="flex items-center gap-2 mt-4">
            <Badge className="p-4" variant={"mybadge"}>
              <BarChart3 className="h-4 w-4 text-purple-700" />
            </Badge>
            <h2>Chart</h2>
          </div>
          <ChapterForm initaldata={course} courseId={course.id} />
        </div>

        {/*col-span 2 */}
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
              <ImageIcon className="h-4 w-4 text-purple-700" />
            </Badge>
            <h2>Image your course</h2>
          </div>
          <ImageForm initaldata={course} courseId={course.id} />
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
  );
};

export default CourseDetail;
