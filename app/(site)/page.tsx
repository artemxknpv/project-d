"use client";

import { LoginButton } from "@/components/auth/login-button";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/spinner";
import { redirect, RedirectType } from "next/navigation";

const Home = () => {
  const { loading, unknown } = useAuth();

  if (unknown) {
    return <LoginButton />;
  }

  if (loading) {
    return <Spinner />;
  }

  return redirect("/documents", RedirectType.replace);
};

export default Home;
