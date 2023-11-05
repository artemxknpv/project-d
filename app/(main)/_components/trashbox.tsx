import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, MouseEvent as RMouseEvent } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export const Trashbox = () => {
  const router = useRouter();
  const params = useParams();
  const docs = useQuery(api.documents.getArchived);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");

  const filteredDocs = search
    ? docs?.filter((d) =>
        d.title.toLocaleLowerCase().includes(search.toLowerCase()),
      )
    : docs;

  const onClick = (docId: string) => {
    router.push(`/documents/${docId}`);
  };

  const onRestore = (
    e: RMouseEvent<HTMLDivElement, MouseEvent>,
    id: Id<"documents">,
  ) => {
    e.stopPropagation();
    const promise = restore({ id });

    toast.promise(promise, {
      loading: "Restoring the note...",
      success: "Note has been restored",
      error: "Note could not be restored",
    });
  };

  const onRemove = (id: Id<"documents">) => {
    const promise = remove({ id });

    toast.promise(promise, {
      loading: "Deleting the note...",
      success: "Note has been deleted",
      error: "Note could not be deleted",
    });

    if (params.documentId === id) {
      router.push("/documents");
    }
  };

  if (!docs) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title"
        />
      </div>
      <div className="mt-2 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found
        </p>
        {filteredDocs?.map((d) => {
          const docId = d._id;
          return (
            <div
              key={docId}
              role="button"
              onClick={() => onClick(docId)}
              className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
            >
              <span className="truncate">{d.title}</span>
              <div className="flex items-center">
                <div
                  onClick={(e) => onRestore(e, docId)}
                  className="rounded-sm p-2 hover:bg-neutral-200"
                >
                  <Undo className="h-4 w-4 text-muted-foreground" />
                </div>
                <ConfirmModal onConfirm={() => onRemove(docId)}>
                  <div
                    role="button"
                    className="rounded-sm p-2 hover:bg-neutral-200"
                  >
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </div>
                </ConfirmModal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
