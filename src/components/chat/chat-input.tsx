import React, { useState, useRef, useEffect } from "react";
import { Paperclip, SendHorizonal, X, Loader2, Square } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string, image?: string) => void;
  onCancelResponse: () => void;
  isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onCancelResponse,
  isTyping,
}) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          setImage(reader.result as string);
          setIsImageLoading(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || image) {
      onSendMessage(text, image || undefined);
      setText("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (image && !isImageLoading) {
      textareaRef.current?.focus();
    }
  }, [image, isImageLoading]);

  if (isTyping) {
    return (
      <div className="p-4 border-t border-slate-200 dark:border-gray-700 flex justify-center">
        <button
          onClick={onCancelResponse}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700"
        >
          <Square size={16} />
          Stop generating
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-slate-200 dark:border-gray-700"
    >
      <div className="relative bg-slate-100 dark:bg-gray-700 rounded-2xl p-2">
        {(image || isImageLoading) && (
          <div className="p-2">
            <div className="relative inline-block w-20 h-20">
              {isImageLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-gray-600 rounded-lg">
                  <Loader2 className="animate-spin text-gray-500" />
                </div>
              ) : (
                <>
                  <img
                    src={image!}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                  >
                    <X size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-indigo-500 disabled:opacity-50"
            disabled={isImageLoading}
          >
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
            disabled={isImageLoading}
          />
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Message Gemini..."
            className="flex-1 bg-transparent p-2 focus:outline-none resize-none max-h-40 dark:text-white"
            rows={1}
            disabled={isImageLoading}
          />
          <button
            type="submit"
            disabled={isImageLoading || (!text.trim() && !image)}
            className="p-3 bg-indigo-600 text-white rounded-full disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
