"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { File } from "lucide-react";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const docs = useQuery(api.documents.getSearch);
  const [mounted, setMounted] = useState(false);

  const [open, onClose, toggle] = useSearch((s) => [
    s.open,
    s.onClose,
    s.toggle,
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if (!mounted) return null;

  return (
    <CommandDialog open={open} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s docs...`} />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup heading="Documents">
          {docs?.map((d) => (
            <CommandItem
              key={d._id}
              value={`${d._id}-${d.title}`}
              title={d.title}
              onSelect={() => onSelect(d._id)}
            >
              {d.icon ? (
                <p className="mr-2 text-[18px]">{d.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-2" />
              )}
              <span>{d.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
