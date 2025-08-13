import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Chatroom, type Message } from "../types";
import toast from "react-hot-toast";
import { generateDummyMessages } from "../lib/dummy-data";

interface ChatState {
  chatrooms: Chatroom[];
  activeChatroomId: string | null;
}

const saveChatroomsToStorage = (chatrooms: Chatroom[]) => {
  try {
    const storableChatrooms = chatrooms.map((room) => ({
      ...room,
      messages: room.messages.map(({ image, ...rest }) => rest),
    }));
    localStorage.setItem("chatrooms", JSON.stringify(storableChatrooms));
  } catch (e) {
    console.error("Failed to save chatrooms to localStorage:", e);
    toast.error("Could not save chat changes. Storage might be full.");
  }
};

const getInitialState = (): ChatState => {
  const savedChatrooms = localStorage.getItem("chatrooms");
  if (savedChatrooms && JSON.parse(savedChatrooms).length > 0) {
    const chatrooms: Chatroom[] = JSON.parse(savedChatrooms);
    if (chatrooms[0] && chatrooms[0].messages.length === 0) {
      chatrooms[0].messages = generateDummyMessages(100);
    }
    return {
      chatrooms,
      activeChatroomId: chatrooms[0]?.id || null,
    };
  }
  const defaultChatroom: Chatroom = {
    id: "1",
    title: "General Conversation",
    messages: generateDummyMessages(100),
  };
  return {
    chatrooms: [defaultChatroom],
    activeChatroomId: defaultChatroom.id,
  };
};

const initialState: ChatState = getInitialState();

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatroom: (state, action: PayloadAction<Omit<Chatroom, "messages">>) => {
      const newChatroom: Chatroom = { ...action.payload, messages: [] };
      state.chatrooms.unshift(newChatroom);
      state.activeChatroomId = newChatroom.id;
      saveChatroomsToStorage(state.chatrooms);
    },
    deleteChatroom: (state, action: PayloadAction<string>) => {
      state.chatrooms = state.chatrooms.filter(
        (room) => room.id !== action.payload
      );
      if (state.activeChatroomId === action.payload) {
        state.activeChatroomId = state.chatrooms[0]?.id || null;
      }
      saveChatroomsToStorage(state.chatrooms);
    },
    setActiveChatroom: (state, action: PayloadAction<string>) => {
      state.activeChatroomId = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatroomId: string; message: Message }>
    ) => {
      const { chatroomId, message } = action.payload;
      const chatroomIndex = state.chatrooms.findIndex(
        (room) => room.id === chatroomId
      );
      if (chatroomIndex !== -1) {
        const chatroom = state.chatrooms[chatroomIndex];
        chatroom.messages.push(message);
        if (chatroomIndex > 0) {
          state.chatrooms.splice(chatroomIndex, 1);
          state.chatrooms.unshift(chatroom);
        }
      }
      saveChatroomsToStorage(state.chatrooms);
    },
    updateChatroomTitle: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const { id, title } = action.payload;
      const chatroom = state.chatrooms.find((room) => room.id === id);
      if (chatroom) {
        chatroom.title = title;
      }
      saveChatroomsToStorage(state.chatrooms);
    },
  },
});

export const {
  addChatroom,
  deleteChatroom,
  setActiveChatroom,
  addMessage,
  updateChatroomTitle,
} = chatSlice.actions;
export default chatSlice.reducer;
