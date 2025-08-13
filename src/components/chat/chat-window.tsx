import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../store";
import { addMessage, updateChatroomTitle } from "../../store/chat-slice";
import { Menu, Loader2, Pencil, ArrowBigDown } from "lucide-react";
import toast from "react-hot-toast";
import WelcomePlaceholder from "./welcome-placeholder";
import EmptyChatPlaceholder from "./empty-chat-placeholder";
import Message from "./message";
import ChatInput from "./chat-input";
import MessageSkeleton from "./message-skeleton";
import RenameChatModal from "./rename-chat-modal";
import { type Message as MessageType } from "../../types";
import { useIntersectionObserver } from "../../hooks/use-intersection-observer";

const MESSAGES_PER_PAGE = 20;

interface ChatWindowProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ setIsSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeChatroomId, chatrooms } = useSelector(
    (state: RootState) => state.chat
  );
  const activeChat = chatrooms.find((c) => c.id === activeChatroomId);

  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [showGoDown, setShowGoDown] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const loadingMoreRef = useRef(false);
  const isInitialLoadRef = useRef(true);
  const aiResponseTimeoutRef = useRef<number | null>(null);
  const isLoadingOldMessagesRef = useRef(false);

  const { ref: topOfChatRef, entry } = useIntersectionObserver<HTMLDivElement>({
    root: chatContainerRef.current,
    threshold: 1.0,
    rootMargin: "20px",
  });

  const hasMoreMessages = useMemo(() => {
    if (!activeChat) return false;
    return activeChat.messages.length > page * MESSAGES_PER_PAGE;
  }, [activeChat, page]);

  // Load more when top is visible
  useEffect(() => {
    if (entry?.isIntersecting && hasMoreMessages && !loadingMoreRef.current) {
      loadingMoreRef.current = true;
      isLoadingOldMessagesRef.current = true;
      setIsLoadingMore(true);

      if (chatContainerRef.current) {
        prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
      }

      setTimeout(() => {
        setPage((prev) => prev + 1);
        setIsLoadingMore(false);
        loadingMoreRef.current = false;
      }, 1000);
    }
  }, [entry, hasMoreMessages]);

  const messagesToShow = useMemo(() => {
    if (!activeChat) return [];
    const totalMessages = activeChat.messages.length;
    const startIndex = Math.max(0, totalMessages - page * MESSAGES_PER_PAGE);
    return activeChat.messages.slice(startIndex, totalMessages);
  }, [activeChat, page]);

  // Scroll handling
  useLayoutEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    if (isInitialLoadRef.current) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
      isInitialLoadRef.current = false;
      prevScrollHeightRef.current = 0;
      isLoadingOldMessagesRef.current = false;
      return;
    }

    if (isLoadingOldMessagesRef.current && prevScrollHeightRef.current > 0) {
      const newScrollHeight = chatContainer.scrollHeight;
      const diff = newScrollHeight - prevScrollHeightRef.current;
      chatContainer.scrollTop += diff;
      prevScrollHeightRef.current = 0;
      isLoadingOldMessagesRef.current = false;
      return;
    }

    const nearBottom =
      chatContainer.scrollHeight -
        chatContainer.scrollTop -
        chatContainer.clientHeight <
      100;
    if (nearBottom) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messagesToShow]);

  // Track scroll to toggle Go Down button
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setShowGoDown(!nearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset page on chat change
  useEffect(() => {
    setPage(1);
    isInitialLoadRef.current = true;
    prevScrollHeightRef.current = 0;
    isLoadingOldMessagesRef.current = false;
  }, [activeChatroomId]);

  const handleSendMessage = (text: string, image?: string) => {
    if (!activeChatroomId) return;
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
      image,
    };
    dispatch(
      addMessage({ chatroomId: activeChatroomId, message: userMessage })
    );
    setIsTyping(true);
    aiResponseTimeoutRef.current = window.setTimeout(() => {
      const aiResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        text: `This is a simulated AI response to your message: "${text}"`,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      dispatch(
        addMessage({ chatroomId: activeChatroomId, message: aiResponse })
      );
      setIsTyping(false);
    }, 2000 + Math.random() * 1500);
  };

  const handleCancelResponse = () => {
    if (aiResponseTimeoutRef.current) {
      clearTimeout(aiResponseTimeoutRef.current);
      setIsTyping(false);
      toast.error("AI response cancelled.");
    }
  };

  const handleRename = (newTitle: string) => {
    if (activeChat) {
      dispatch(updateChatroomTitle({ id: activeChat.id, title: newTitle }));
      toast.success("Chat renamed!");
      setIsRenameModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-gray-800 h-screen min-w-0">
        <header className="p-4 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1"
            >
              <Menu size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 truncate">
              {activeChat ? activeChat.title : "Welcome"}
            </h2>
          </div>
          {activeChat && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsRenameModalOpen(true)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700"
              >
                <Pencil
                  size={18}
                  className="text-slate-500 dark:text-slate-400"
                />
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 flex flex-col min-h-0 relative">
          <main ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
            {!activeChat ? (
              <div className="h-full flex items-center justify-center">
                <WelcomePlaceholder />
              </div>
            ) : activeChat.messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <EmptyChatPlaceholder
                  onPromptClick={(prompt) => handleSendMessage(prompt)}
                />
              </div>
            ) : (
              <div className="flex flex-col">
                <div ref={topOfChatRef} className="h-1 w-full" />
                {isLoadingMore && (
                  <div className="flex justify-center my-4">
                    <Loader2 className="animate-spin text-indigo-500" />
                  </div>
                )}
                {messagesToShow.map((msg) => (
                  <Message key={msg.id} message={msg} />
                ))}
                {isTyping && <MessageSkeleton />}
              </div>
            )}
          </main>

          {activeChat && (
            <ChatInput
              onSendMessage={handleSendMessage}
              onCancelResponse={handleCancelResponse}
              isTyping={isTyping}
            />
          )}

          {showGoDown && (
            <button
              onClick={() => {
                if (chatContainerRef.current) {
                  chatContainerRef.current.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: "smooth",
                  });
                }
              }}
              className="absolute bottom-25 right-6 p-3 shadow-lg bg-indigo-600 text-white rounded-full disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
            >
              <ArrowBigDown size={20} />
            </button>
          )}
        </div>
      </div>

      {activeChat && (
        <RenameChatModal
          isOpen={isRenameModalOpen}
          onClose={() => setIsRenameModalOpen(false)}
          onRename={handleRename}
          currentTitle={activeChat.title}
        />
      )}
    </>
  );
};

export default ChatWindow;
