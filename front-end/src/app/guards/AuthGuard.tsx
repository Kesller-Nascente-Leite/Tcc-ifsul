import { Outlet } from "react-router";
import { useTokenValidation } from "@/app/hooks/useTokenValidation";

export function AuthGuard() {
  useTokenValidation();
  
  return <Outlet />;
}