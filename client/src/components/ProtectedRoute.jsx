// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router";
import { useSession } from "../hooks/useSession";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { data: user, isLoading } = useSession();

  if (isLoading) return <div>Loading...</div>;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
