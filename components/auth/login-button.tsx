import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const LoginButton = () => {
  return (
    <ClerkSignInButton mode="modal">
      <Button size="sm">Login</Button>
    </ClerkSignInButton>
  );
};
