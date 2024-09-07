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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Chapter } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

interface ChapterAccessFormProps {
  initaldata: Chapter;
  courseId: string;
  chapterId: string;
}

const ChapterAccessForm = ({
  initaldata,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initaldata.isFree,
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
        <h1 className="font-semibold">Chapter Price Status</h1>
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
        <div className="text-base mt-3">
          {initaldata.isFree ? (
            <p className="text-green-500">This chapter is free</p>
          ) : (
            <p className="text-red-700">This chapter is not free</p>
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    <div>
                      <p>Check is your chapter is free or money</p>
                    </div>
                  </FormDescription>
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

export default ChapterAccessForm;
