"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, Undo } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Chapter } from "@prisma/client";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Title is required",
  }),
});

interface ChapterDescriptionFormProps {
  initaldata: Chapter;
  courseId: string;
  chapterId: string;
}
const ChapterDescriptionForm = ({
  initaldata,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initaldata.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toogleEditing = () => {
    //açık olanı kapatır kapalı olanı açar
    setIsEditing((current) => !current);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast({
        title: "Course updated",
        variant: "success",
      });
      //düzenleme yapmayı kapatır
      toogleEditing();
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message || "Error",
          variant: "destructive",
        });
      } else {
        toast({
          title: "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="mt-10 bg-slate-100 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Course Description </h1>
        <Button variant={"ghost"} onClick={toogleEditing}>
          {/* eğer düzenleme yapılıyorsa  */}
          {isEditing ? (
            <>
              <Undo className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-base mt-3">
          <Preview value={initaldata.description ?? ""} />
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterDescriptionForm;
