import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

/** Public shell for /login — bounces straight to /projects if already signed in. */
export function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/projects" replace />;
  return <Outlet />;
}
