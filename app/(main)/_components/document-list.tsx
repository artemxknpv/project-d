"use client";

import { FC, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MenuItem } from "@/app/(main)/_components/items/menu-item";
import { cn } from "@/lib";
import { FileIcon } from "lucide-react";

type DocumentListProps = {
  parentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
};

export const DocumentList: FC<DocumentListProps> = ({
  parentId,
  level = 0,
}) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (docId: string) => {
    setExpanded((p) => ({
      ...p,
      [docId]: !p[docId],
    }));
  };

  const onRedirect = (docId: string) => {
    router.push(`/documents/${docId}`);
  };

  const docs = useQuery(api.documents.getDocsHierarchyList, {
    parent: parentId,
  });

  if (!docs) {
    return (
      <>
        <MenuItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <MenuItem.Skeleton level={level} />
            <MenuItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn("hidden text-sm font-medium text-muted-foreground/80", {
          "last:block": expanded && level !== 0,
          hidden: level === 0,
        })}
      >
        No pages inside
      </p>
      {docs.map((d) => {
        const active = params.docId === d._id;
        const docExpanded = expanded[d._id];
        const docId = d._id;

        return (
          <div key={docId}>
            <MenuItem
              id={docId}
              label={d.title}
              onClick={() => onRedirect(docId)}
              documentIcon={d.icon}
              level={level}
              active={active}
              onExpand={() => onExpand(docId)}
              expanded={docExpanded}
              icon={FileIcon}
            />
            {docExpanded && <DocumentList parentId={docId} level={level + 1} />}
          </div>
        );
      })}
    </>
  );
};
