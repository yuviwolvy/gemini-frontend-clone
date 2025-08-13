import React from "react";
import { Bot } from "lucide-react";

const MessageSkeleton: React.FC = () => {
  return (
    <div className="flex items-start gap-4 my-6 animate-pulse">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-200 dark:bg-gray-700">
        <Bot size={20} />
      </div>
      <div className="p-4 rounded-xl max-w-lg lg:max-w-2xl bg-white dark:bg-gray-700 w-full">
        <div className="h-4 bg-slate-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
