import { useConvexAuth } from "convex/react";

export const useAuth = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const authenticated = isAuthenticated && !isLoading;
  const loading = !isAuthenticated && isLoading;
  const unknown = !isAuthenticated && !isLoading;

  return { authenticated, loading, unknown };
};
