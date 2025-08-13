import React from "react";
import { Bot, User, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { type Message as MessageType } from "../../types";
import { cn } from "../../lib/utils";

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      toast.success("Message copied to clipboard!");
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-4 my-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          isUser ? "bg-indigo-500 text-white" : "bg-slate-200 dark:bg-gray-700"
        )}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div
        className={cn(
          "relative group p-4 rounded-xl max-w-lg lg:max-w-2xl",
          isUser
            ? "bg-indigo-500 text-white"
            : "bg-white dark:bg-gray-700 dark:text-gray-200"
        )}
      >
        {message.text && (
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        )}
        {message.image && (
          <div className="mt-2">
            <img
              src={message.image}
              alt="Uploaded content"
              className="rounded-lg max-w-full h-auto max-h-80"
            />
          </div>
        )}
        <div className="text-xs opacity-60 mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/10 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
        >
          <Copy size={14} />
        </button>
      </div>
    </div>
  );
};

export default Message;
