"use client";

import { FC, PropsWithChildren, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { redirect, RedirectType } from "next/navigation";
import { Spinner } from "@/components/spinner";

type ProtectAuthProviderProps = PropsWithChildren<{
  redirectTo?: string;
  displayWhileLoading?: ReactNode;
  redirectType?: RedirectType;
}>;

export const ProtectAuthProvider: FC<ProtectAuthProviderProps> = ({
  children,
  redirectTo = "/",
  displayWhileLoading = <Spinner size="lg" />,
  redirectType = RedirectType.replace,
}) => {
  const { unknown, loading } = useAuth();

  if (loading) {
    return displayWhileLoading;
  }

  if (unknown) {
    return redirect(redirectTo, redirectType);
  }

  return children;
};
