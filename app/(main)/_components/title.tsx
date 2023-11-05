"use client";

import {
  KeyboardEvent,
  ChangeEventHandler,
  ElementRef,
  useRef,
  useState,
} from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type TitleProps = {
  initialData: Doc<"documents">;
};

export const Title = ({ initialData }: TitleProps) => {
  const update = useMutation(api.documents.update);
  const titleInputRef = useRef<ElementRef<"input">>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title || "Untitled");

  const enableInput = () => {
    setTitle(initialData.title);
    setEditing(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.setSelectionRange(
        0,
        titleInputRef.current.value.length,
      );
    });
  };

  const disableInput = () => {
    setEditing(false);
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value);
    update({
      id: initialData._id,
      title: e.target.value || "Untitled",
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toLowerCase() === "enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {initialData && <p>{initialData.icon}</p>}
      {editing ? (
        <Input
          ref={titleInputRef}
          onKeyDown={onKeyDown}
          value={title}
          onBlur={disableInput}
          onChange={onChange}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          size="sm"
          variant="ghost"
          className="font-normal h-auto p1"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-16 rounded-md" />;
};
