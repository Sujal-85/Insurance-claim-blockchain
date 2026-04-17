import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "user" | "admin";
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("auth_token");
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  if (!token || !userData) {
    console.warn("[ProtectedRoute] Missing token or user data. Redirecting to /select-role", { hasToken: !!token, hasUser: !!userData });
    return <Navigate to="/select-role" state={{ from: location }} replace />;
  }

  // Define normalized roles for comparison
  const requiredRole = role?.toUpperCase();
  const userRole = userData?.role?.toUpperCase();

  console.log("[ProtectedRoute] Access check:", { requiredRole, userRole, path: location.pathname });

  if (requiredRole && userRole && userRole !== requiredRole) {
    console.warn(`[ProtectedRoute] Role mismatch. User is ${userRole}, but ${requiredRole} is required. Redirecting...`);
    // If user has the wrong role, redirect to their respective dashboard
    const redirectPath = userRole === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
