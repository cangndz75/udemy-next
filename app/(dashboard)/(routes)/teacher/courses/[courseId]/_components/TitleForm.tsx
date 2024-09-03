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
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

interface TitleFormProps {
  initaldata: {
    title: string;
  };
  courseId: string;
}

const TitleForm = ({ initaldata, courseId }: TitleFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
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
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast({
        title: "Course updated",
        variant: "success",
      });
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
    //form yapısı için
    <div className="mt-10 bg-slate-100 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Course Title</h1>
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
      {!isEditing && <p className="text-base mt-3">{initaldata.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Course Title" {...field} />
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

export default TitleForm;
