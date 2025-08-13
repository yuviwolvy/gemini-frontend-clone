import React from "react";
import { Bot } from "lucide-react";

const WelcomePlaceholder: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-slate-50 dark:bg-gray-800 h-full">
      <div className="p-6 bg-indigo-500 rounded-full text-white mb-6 animate-bob">
        {" "}
        <Bot size={48} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Welcome to Gemini
      </h2>
      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        Your conversational AI assistant. Select a chat from the sidebar to
        continue a conversation, or start a new one to explore new ideas.
      </p>
    </div>
  );
};

export default WelcomePlaceholder;
