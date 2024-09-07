"use client";
import React, { useState } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, ImageIcon, PlusIcon, Undo, VideoIcon } from "lucide-react";
import { Chapter, Course, MuxData } from "@prisma/client";
import FileUpload from "@/components/file-upload";
import MuxPlayer from "@mux/mux-player-react";

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

interface VideoProps {
  initaldata: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const ChapterVideoForm = ({ initaldata, chapterId, courseId }: VideoProps) => {
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
        title: "Chapter updated",
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
        <h1 className="font-semibold">Course Video </h1>
        <Button variant={"ghost"} onClick={toogleEditing}>
          {/* eğer düzenleme yapılıyorsa  */}
          {isEditing && (
            <>
              <Undo className="w-4 h-4 mr-2" />
              Cancel
            </>
          )}
          {!isEditing && !initaldata.videoUrl && (
            <>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add a video
            </>
          )}

          {!isEditing && initaldata.videoUrl && (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initaldata.videoUrl ? (
          <>
            <div className="flex items-center justify-center h-80 bg-slate-200 mt-2">
              <VideoIcon className="h-16 w-16" />
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-video mt-2">
              <MuxPlayer
                playbackId={initaldata?.muxData?.playbackId || ""}
                style={{
                  maxHeight: "500px", // Yüksekliği sınırlandırın
                  width: "100%", // Genişliği tam yapın
                  aspectRatio: "9 / 16", // Dikey videolar için oran
                }}
              />
            </div>
          </>
        ))}

      {isEditing && (
        <>
          <FileUpload
            endpoint="courseVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default ChapterVideoForm;
