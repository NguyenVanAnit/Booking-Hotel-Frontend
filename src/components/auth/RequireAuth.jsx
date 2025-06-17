import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const user = localStorage.getItem("token");

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;