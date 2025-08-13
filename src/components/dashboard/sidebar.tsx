import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../store";
import {
  addChatroom,
  deleteChatroom,
  setActiveChatroom,
} from "../../store/chat-slice";
import {
  Plus,
  MessageSquare,
  Trash2,
  Search,
  LogOut,
  Loader2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDebounce } from "../../hooks/use-debounce";
import { cn } from "../../lib/utils";
import ThemeToggle from "../common/theme-toggle";
import NewChatModal from "./new-chat-modal";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chatrooms, activeChatroomId } = useSelector(
    (state: RootState) => state.chat
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  const handleCreateChatroom = (title: string) => {
    const newChat = { id: Date.now().toString(), title };
    dispatch(addChatroom(newChat));
    toast.success("Chatroom created!");
    setIsModalOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      dispatch(deleteChatroom(id));
      toast.error("Chatroom deleted.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const filteredChatrooms = useMemo(
    () =>
      chatrooms.filter((room) =>
        room.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ),
    [chatrooms, debouncedSearchTerm]
  );

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-full max-w-xs flex flex-col bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gemini</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
            )}
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 rounded-md bg-slate-200 dark:bg-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-grow p-4 pt-0 overflow-y-auto min-h-0">
          {" "}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-2 mb-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            New Chat
          </button>
          <nav className="space-y-2">
            {filteredChatrooms.length > 0 ? (
              filteredChatrooms.map((room) => (
                <a
                  key={room.id}
                  href="#"
                  onClick={() => {
                    dispatch(setActiveChatroom(room.id));
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md text-sm font-medium group transition-colors",
                    activeChatroomId === room.id
                      ? "bg-indigo-500 text-white shadow-md"
                      : "hover:bg-slate-200 dark:hover:bg-gray-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} />
                    <span className="truncate w-40">{room.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, room.id)}
                    className={cn(
                      "p-1 rounded-full text-gray-700 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100",
                      activeChatroomId === room.id && "opacity-100"
                    )}
                  >
                    <Trash2 size={16} />
                  </button>
                </a>
              ))
            ) : (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                <p>No chats found.</p>
                <p className="mt-2">Create a new one to get started!</p>
              </div>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
          >
            <LogOut size={16} />
            Logout
          </button>
          <ThemeToggle />
        </div>
      </div>
      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateChatroom}
      />
    </>
  );
};

export default Sidebar;
