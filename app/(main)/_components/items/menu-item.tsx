"use client";

import { MouseEvent as RMouseEvent, ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { call, cn } from "@/lib";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type MenuItemProps = {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  search?: boolean;
  level?: number;
  onExpand?: () => void;
  onClick?: () => void;
  label: ReactNode;
  icon?: LucideIcon;
};

export const MenuItem = ({
  onClick,
  label,
  icon: Icon,
  documentIcon,
  id,
  active = false,
  level = 0,
  search = false,
  onExpand,
  expanded = false,
}: MenuItemProps) => {
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const { user } = useUser();
  const router = useRouter();

  const Chevron = expanded ? ChevronDown : ChevronRight;

  const handleExpand = (e: RMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.();
  };

  const onCreate = (e: RMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    if (!id) return;

    toast.promise(
      create({ title: "Untitled", parent: id }).then((docId) => {
        if (!expanded) onExpand?.();
        router.push(`/documents/${docId}`);
      }),
      {
        loading: "Creating a new note...",
        success: "New note created!",
        error: "Failed to create a new note",
      },
    );
  };

  const onArchive = (e: RMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    if (!id) return;

    toast.promise(archive({ id }), {
      loading: "Moving to trash...",
      success: "Note moved to trash",
      error: "Failed to archive the note.",
    });
  };

  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center gap-1 text-muted-foreground font-medium",
        { "bg-primary/5 text-primary": active },
      )}
      role="button"
      onClick={onClick}
    >
      {id && (
        <div
          onClick={handleExpand}
          role="button"
          className="h-full rounde-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
        >
          <Chevron className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      <div className="flex gap-0.5">
        {call(() => {
          if (documentIcon) {
            return <div className="shrink-0 text-[18px]">{documentIcon}</div>;
          }

          if (Icon) {
            return <Icon className="shrink-0 h-[18px]" />;
          }
        })}
        <span>{label}</span>
      </div>
      {search && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full mk-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem
                onClick={onArchive}
                className="cursor-pointer w-full font-medium"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

MenuItem.Skeleton = function MenuItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
