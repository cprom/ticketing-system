import { Navigate } from "react-router";
import { useSession } from "../hooks/useSession";

const ProtectedRoute = ({ children }) => {
  const { data: session, isLoading } = useSession();

  if (isLoading) return <div>Loading...</div>;

  if (!session) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
