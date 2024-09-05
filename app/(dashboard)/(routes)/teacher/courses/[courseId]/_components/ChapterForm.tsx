"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Undo } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
const formSchema = z.object({
  title: z.string().min(1),
});
interface ChapterFormProps {
  initaldata: Course & { chapters: Chapter[] };
  courseId: string;
}
const ChapterForm = ({ courseId, initaldata }: ChapterFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initaldata.title || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toogleCreate = () => {
    setIsCreating((current) => !current);
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/chapters`,
        values
      );
      toast({
        title: "Course updated",
        variant: "success",
      });
      //ekleme yapmayı kapatır
      toogleCreate();
      //verileri yenilemek için
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="mt-10 bg-slate-100 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Chapters</h1>
        <Button variant={"ghost"} onClick={toogleCreate}>
          {/* eğer düzenleme yapılıyorsa  */}
          {isCreating ? (
            <>
              <Undo className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Chapter
            </>
          )}
        </Button>
      </div>

      {!isCreating && (
        <p className="text-base mt-3">
          {initaldata.chapters.length === 0 && (
            <div>
              <p>There is no chapter yet.</p>
            </div>
          )}
          {initaldata.chapters.length > 0 && (
            <div>
              {initaldata.chapters.map((chapter) => (
                <div key={chapter.id}>
                  <p>{chapter.title}</p>
                </div>
              ))}
            </div>
          )}
        </p>
      )}

      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Chapter Title"
                      {...field}
                      disabled={isSubmitting}
                    />
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

export default ChapterForm;
