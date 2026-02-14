import { useState } from "react";
import { Outlet } from "react-router";
import TeacherNavbar from "./TeacherNavbar";
import { TeacherSidebar } from "./TeacherSidebar";

export function TeacherLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-main">
      <TeacherSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300 min-w-0">
        <TeacherNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        <footer className="py-4 px-8 text-center md:text-left text-xs text-text-secondary border-t border-border">
          <p>© {new Date().getFullYear()} Estuda Fácil - Painel do Professor</p>
        </footer>
      </div>
    </div>
  );
}
