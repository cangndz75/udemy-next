import { Badge } from "@/components/ui/badge";
import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboardIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import TitleForm from "./_components/TitleForm";

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
  ];

  const totalFields = RequiredFields.length;
  const completeFields = RequiredFields.filter(Boolean).length;
  const completeText = `(${completeFields}/${totalFields})`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-3">
          <h1 className="text-2xl md:text-3xl text-purple-600 font-semibold">
            Course Setup
          </h1>
          <span className="text-base">
            Complete all fields {completeFields}
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
          <TitleForm initaldata={course} courseId={course.id}/>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
