"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, ImageIcon, PlusIcon, Undo } from "lucide-react";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
import { url } from "inspector";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image url is required",
  }),
});

interface ImageFormProps {
  initaldata: Course;
  courseId: string;
}

const ImageForm = ({ initaldata, courseId }: ImageFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: ""
    },
  });

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
        <h1 className="font-semibold">Course Image </h1>
        <Button variant={"ghost"} onClick={toogleEditing}>
          {/* eğer düzenleme yapılıyorsa  */}
          {isEditing && (
            <>
              <Undo className="w-4 h-4 mr-2" />
              Cancel
            </>
          )}
          {!isEditing && !initaldata.imageUrl && (
            <>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add an Image
            </>
          )}

          {!isEditing && initaldata.imageUrl && (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initaldata.imageUrl ? (
          <>
            <div className="flex items-center justify-center h-80 bg-slate-200 mt-2">
              <ImageIcon className="h-16 w-16" />
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-video mt-2">
              <Image
                alt=""
                fill
                src={initaldata.imageUrl}
                className="object-cover"
              />
            </div>
          </>
        ))}

      {isEditing && (
        <>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default ImageForm;
