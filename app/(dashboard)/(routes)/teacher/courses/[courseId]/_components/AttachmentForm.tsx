"use client";
import React, { useState } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { File, Loader2Icon, PlusIcon, Trash2, Undo } from "lucide-react";
import FileUpload from "@/components/file-upload";

const formSchema = z.object({
  url: z.string().min(1),
});

interface AttachmentFormProps {
  //initaldata : Course & { attachments: Attachment[] } şeklinde tanımlanır.
  initaldata: Course & { attachments: Attachment[] };
  courseId: string;
}

const AttachmentForm = ({ initaldata, courseId }: AttachmentFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  //silme işlemi için id tanımlanır ve null değeri atanır. Sebebi ise silme işlemi yapılırken id değeri null olmamalıdır.
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toogleEditing = () => {
    //açık olanı kapatır kapalı olanı açar
    setIsEditing((current) => !current);
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/attachment`,
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
  //silme işlemi
  //burada silme işlemi yapılırken, silinecek olan dosyanın id'si ile eşleşen dosyayı siler.
  const onDelete = async (id: string) => {
    try {
      //setDeletingId fonksiyonu ile id değeri set edilir.
      setDeletingId(id);
      //axios ile silme işlemi yapılır. ${id} ile silinecek olan dosyanın id'si belirtilir.
      await axios.delete(`/api/courses/${courseId}/attachment/${id}`);
      toast({
        title: "Attachment deleted",
        variant: "success",
      });
    } catch (error) {
      console.log("[ATTACHMENT]", error);
      toast({
        title: "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      //setDeletingId fonksiyonu ile id değeri null yapılır.
      setDeletingId(null);
      router.refresh();
    }
  };
  return (
    <div className="mt-10 bg-slate-100 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">File</h1>
        <Button variant={"ghost"} onClick={toogleEditing}>
          {/* eğer düzenleme yapılıyorsa  */}
          {isEditing && (
            <>
              <Undo className="w-4 h-4 mr-2" />
              Cancel
            </>
          )}
          {!isEditing && (
            <>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add a File
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initaldata.attachments.length === 0 && <p>No attachments</p>}
          {initaldata.attachments.length > 0 && (
            <div className="space-y-3">
              {initaldata.attachments.map((attachment) => (
                <div
                  className="flex items-center justify-between w-full p-3"
                  key={attachment.id}
                >
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5" />
                    <p className="text-xs">{attachment.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {deletingId === attachment.id ? (
                      <Loader2Icon className="w-4 h-4 animate-spin" />
                    ) : (
                      <Button
                        onClick={() => onDelete(attachment.id)}
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default AttachmentForm;
