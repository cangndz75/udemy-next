"use client";
import ConfirmModal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
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

  return (
    <div className="flex items-center gap-4 mt-4">
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"sm"} variant={"destructive"} disabled={isLoading}>
          <Trash className="h-5 w-5" />
        </Button>
      </ConfirmModal>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant={"default"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
    </div>
  );
};

export default ChapterAction;
