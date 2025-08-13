import React, { useState } from "react";
import Sidebar from "../dashboard/sidebar";
import ChatWindow from "../chat/chat-window";
import { cn } from "../../lib/utils";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen bg-slate-50 dark:bg-gray-800 overflow-hidden">
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/40 z-20 md:hidden",
          isSidebarOpen ? "block" : "hidden"
        )}
      />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <ChatWindow setIsSidebarOpen={setIsSidebarOpen} />
    </div>
  );
};

export default MainLayout;
