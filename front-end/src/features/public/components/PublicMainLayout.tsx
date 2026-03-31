import { useState } from "react";
import { Outlet } from "react-router";
import PublicNavbar from "@/features/public/components/PublicNavbar";
import { PublicSidebar } from "@/features/public/components/PublicSidebar";
import SharedFooter from "@/features/public/components/SharedFooter";

export function PublicMainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-main">
      <PublicSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        <PublicNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 mt-16 p-4 md:p-8">
          <Outlet />
        </main>

        <SharedFooter />
      </div>
    </div>
  );
}
