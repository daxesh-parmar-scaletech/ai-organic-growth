import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

/** Gates a route subtree behind sign-in. No roles/permissions — this app has a single user type. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
