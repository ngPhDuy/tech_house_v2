import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  role?: string;
}

interface User {
  userID: string;
  role: string; //member | admin
}
const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  let token = localStorage.getItem("token");
  let user: User | null = null;

  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
