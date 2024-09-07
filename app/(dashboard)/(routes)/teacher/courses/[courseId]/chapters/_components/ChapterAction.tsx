"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ChapterActionProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterAction = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {};

  const onDelete = async () => {};

  return <div>ChapterAction</div>;
};

export default ChapterAction;
