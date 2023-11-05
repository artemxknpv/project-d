import { SignOutButton } from "@clerk/nextjs";
import { FC, PropsWithChildren } from "react";

export const LogoutButton: FC<PropsWithChildren> = () => {
  return <SignOutButton>Logout</SignOutButton>;
};
