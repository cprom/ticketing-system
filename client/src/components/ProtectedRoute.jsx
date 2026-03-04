import { Navigate } from "react-router";
import { useSession } from "../hooks/useSession";

const ProtectedRoute = ({ children }) => {
  const { data, isLoading, isError } = useSession();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
