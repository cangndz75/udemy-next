"use client";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Chapter } from "@prisma/client";
import { Edit, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChapterListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

const ChapterList = ({ items, onReorder, onEdit }: ChapterListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const updatedChapters = Array.from(chapters);
    const [reorderedItem] = updatedChapters.splice(result.source.index, 1);
    updatedChapters.splice(result.destination.index, 0, reorderedItem);

    setChapters(updatedChapters);

    const bulkUpdateData = updatedChapters.map((chapter, index) => ({
      id: chapter.id,
      position: index,
    }));

    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-4 bg-white shadow rounded mb-2 cursor-pointer"
                    onClick={() => onEdit(item.id)}
                  >
                    <div className="flex items-center">
                      <div>
                        <Grid className="w-5 h-5 mr-2" />
                      </div>
                      <div>{item.title}</div>
                      <div className="ml-auto flex items-center">
                        <div>
                          <Badge className="p-2 bg-green-500 text-black">
                            Free
                          </Badge>
                          <Badge
                            className={cn(
                              "p-2 bg-slate-300 text-black",
                              item.isPublished && "bg-purple-500 text-white"
                            )}
                          >
                            {item.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <Button
                          variant={"ghost"}
                          onClick={() => onEdit(item.id)}
                        >
                          <Edit className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;
