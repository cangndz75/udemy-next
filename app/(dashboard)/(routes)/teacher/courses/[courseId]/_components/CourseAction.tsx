"use client";
import ConfirmModal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface CourseActionProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const CourseAction = ({
  disabled,
  courseId,
  isPublished,
}: CourseActionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/unpublish`
        );
        toast({
          title: "Chapter unpublished",
          variant: "success",
        });
        router.refresh();
      } else {
        await axios.patch(
          `/api/courses/${courseId}/publish`
        );
        toast({
          title: "Chapter published",
          variant: "success",
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast({
        title: "Chapter is deleted",
        variant: "success",
      });
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error) {
      toast({
        title: "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

export default CourseAction;
