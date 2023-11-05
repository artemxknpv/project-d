"use client";

import { useUser } from "@clerk/nextjs";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const DocumentsPage = () => {
  const { user } = useUser();

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="font-medium text-lg">Hello, {user?.fullName}</h2>
      <Button className="flex gap-2 items-center">
        <PlusCircle className="h-4 w-4" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
