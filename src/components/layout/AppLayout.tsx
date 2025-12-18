import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";
import { BackgroundAnimation } from "@/components/ui/BackgroundAnimation";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background relative">
      {/* Background Animation */}
      <BackgroundAnimation variant="gradient" />
      
      {/* Content */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`flex flex-1 flex-col transition-all duration-300 relative z-10 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
