import React from "react";

const suggestionPrompts = [
  "Explain quantum computing in simple terms",
  "Write a short story about a robot who discovers music",
  "Give me some ideas for a 10-day trip to Japan",
  "What's the difference between a framework and a library?",
];

const EmptyChatPlaceholder: React.FC<{
  onPromptClick: (prompt: string) => void;
}> = ({ onPromptClick }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          How can I help you today?
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {suggestionPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onPromptClick(prompt)}
              className="p-4 bg-slate-100 dark:bg-gray-900/50 text-left transition-transform hover:scale-105 rounded-lg border border-slate-200 dark:border-gray-700" // Removed animation class
            >
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyChatPlaceholder;
