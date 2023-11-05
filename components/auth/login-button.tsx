import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ComponentProps, FC, PropsWithChildren } from "react";

type LoginButton = FC<
  PropsWithChildren<{
    size?: ComponentProps<typeof Button>["size"];
  }>
>;

export const LoginButton: LoginButton = ({ size }) => {
  return (
    <SignInButton mode="modal">
      <Button size={size}>Login</Button>
    </SignInButton>
  );
};
