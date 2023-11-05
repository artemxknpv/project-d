"use client";

import { useUser } from "@clerk/nextjs";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const DocumentsPage = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = async () => {
    toast.promise(create({ title: "Untitled" }), {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to created a new note",
    });
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="font-medium text-lg">Hello, {user?.fullName}</h2>
      <Button className="flex gap-2 items-center" onClick={onCreate}>
        <PlusCircle className="h-4 w-4" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
