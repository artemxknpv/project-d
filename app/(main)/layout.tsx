"use client";

import { FC, PropsWithChildren } from "react";
import { ProtectAuthProvider } from "@/components/auth/protect-auth-provder";
import { Navigation } from "./_components/navigation";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ProtectAuthProvider>
      <div className="h-full flex dark:bg-[#1F1F1F]">
        <Navigation />
        <main className="flex-1 h-full overflow-auto">{children}</main>
      </div>
    </ProtectAuthProvider>
  );
};

export default MainLayout;
