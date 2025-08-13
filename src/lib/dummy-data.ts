import { type Message } from "../types";

// Generates a large number of dummy messages for testing reverse infinite scroll.
export const generateDummyMessages = (count: number): Message[] => {
  const messages: Message[] = [];
  const startDate = new Date();

  for (let i = 0; i < count; i++) {
    const sender = i % 2 === 0 ? "ai" : "user";
    const timestamp = new Date(startDate.getTime() - i * 5 * 60000); // 5 minutes apart

    messages.unshift({
      id: `dummy-${i}`,
      sender,
      text: `This is a simulated historical message number ${count - i}.`,
      timestamp: timestamp.toISOString(),
    });
  }
  return messages;
};
