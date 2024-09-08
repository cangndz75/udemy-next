import { Category, Course } from "@prisma/client";
import React from "react";
import CourseCard from "./CourseCard";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CourseListProps {
  items: CourseWithProgressWithCategory[];
}

const CourseList = ({ items }: CourseListProps) => {
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            title={item.title}
            chaptersLength={item.chapters.length}
            id={item.id}
            category={item.category?.name || "Uncategorized"}
            price={item.price || 0}
            progress={item.progress}
            imageUrl={item.imageUrl || ""}
          />
        ))}
      </div>
      <div>
        {items.length === 0 && (
          <div className="text-center text-lg mt-8">
            No courses found.
          </div>
        )}
      </div>
    </>
  );
};

export default CourseList;
