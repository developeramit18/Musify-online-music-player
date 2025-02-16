import { Navigate } from "react-router-dom";

export const PrivateResetRoute = ({ children }) => {
  return sessionStorage.getItem("canAccessSuccess") === "true" ? (
    children
  ) : (
    <Navigate to="/" />
  );
};
