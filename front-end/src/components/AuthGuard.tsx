import { Outlet } from "react-router";
import { useTokenValidation } from "../hooks/useTokenValidation";

export function AuthGuard() {
  useTokenValidation();
  
  return <Outlet />;
}