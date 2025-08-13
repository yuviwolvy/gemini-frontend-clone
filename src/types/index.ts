export interface Country {
  name: string;
  flagUrl: string;
  dialCode: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "user" | "ai";
  image?: string;
}

export interface Chatroom {
  id: string;
  title: string;
  messages: Message[];
}
