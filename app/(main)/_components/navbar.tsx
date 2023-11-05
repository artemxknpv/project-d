"use client";

import { FC } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { MenuIcon } from "lucide-react";
import { Title } from "./title";

type NavbarProps = {
  collapsed?: boolean;
  onWidthReset?: () => void;
};

export const Navbar: FC<NavbarProps> = ({ collapsed, onWidthReset }) => {
  const { documentId } = useParams();

  const currentDoc = useQuery(api.documents.getById, {
    id: documentId as Id<"documents">,
  });

  if (currentDoc === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        <Title.Skeleton />
      </nav>
    );
  }

  if (currentDoc === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {collapsed && (
          <MenuIcon
            role="button"
            onClick={onWidthReset}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center">
          <Title initialData={currentDoc} />
        </div>
      </nav>
    </>
  );
};
