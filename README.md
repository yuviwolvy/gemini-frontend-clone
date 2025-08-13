# Gemini Chat Clone - Frontend Prototype

A feature-rich, responsive, and visually appealing frontend for a conversational AI chat application, built with React and TypeScript. This project simulates a complete user experience from authentication to real-time chat, focusing on modern UI/UX patterns and frontend best practices without a backend.

## Features Implemented

### Authentication

- **OTP-Based Login/Signup:** A simulated OTP flow with a custom, searchable country code selector.
- **API Integration:** Fetches country data (flags, dial codes) from the `restcountries.com` API.
- **Robust Form Validation:** Utilizes `React Hook Form` and `Zod` for real-time, schema-based validation and error handling.

### ️ Dashboard & Chat Management

- **Chatroom List:** Displays all user chatrooms, sorted by the most recently active.
- **Create/Delete/Rename:** Full CRUD functionality for chatrooms managed via modals and confirmation dialogs.
- **Debounced Search:** A responsive search bar to instantly filter chatrooms by title.

### Chat Interface

- **Real-time Messaging:** Simulates user and AI messages with timestamps.
- **Cancellable AI Responses:** A "Stop generating" button appears while the AI is "typing," allowing the user to cancel the response.
- **Image Uploads:** Supports image previews with a simulated upload loader.
- **Reverse Infinite Scroll:** Seamlessly load older messages in batches of 20 by scrolling to the top of the chat.
- **Auto-Scroll & Manual Scroll:** Automatically scrolls to the latest message, with a scroll to bottom button appearing when the user scrolls up.
- **Message Actions:** Copy-to-clipboard functionality on message hover.

### Global UX/UI Features

- **Fully Responsive:** A mobile-first design with a collapsible sidebar for smaller screens.
- **Dark Mode:** A sleek, persistent dark mode toggle with a soft, eye-friendly light mode color scheme.
- **Loading Skeletons:** Skeletons appear to indicate when the AI is replying.
- **Toast Notifications:** Non-intrusive notifications for key actions (e.g., login, chat creation, message copy).
- **Accessibility:** Keyboard-accessible forms (`Enter` to submit) and focus management.

---

## Tech Stack

- **Framework:** React (with Vite)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Form Validation:** React Hook Form + Zod
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

---

## Project Structure

The project is organized into a modular and scalable folder structure to separate concerns.

src/
|-- api/ # API call functions (e.g., fetching countries)
|-- components/ # Reusable React components
| |-- auth/ # Components related to login/signup
| |-- chat/ # Components for the chat interface
| |-- common/ # Globally shared components (e.g., ThemeToggle)
| |-- dashboard/ # Components for the main dashboard layout
| |-- layout/ # High-level layout components (e.g., MainLayout)
|-- hooks/ # Custom hooks (e.g., useDebounce, useIntersectionObserver)
|-- lib/ # Utility functions and dummy data
|-- pages/ # Top-level page components
|-- store/ # Redux Toolkit store, slices, and types
|-- types/ # Global TypeScript type definitions

---

## Setup and Run Instructions

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd gemini-clone
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Key Implementation Details

### Form Validation

Validation is handled by **Zod**, which defines a schema for the form data. This schema is passed to **React Hook Form** via the `@hookform/resolvers/zod` adapter. This provides real-time validation, error message display, and ensures type safety for all form submissions.

### Reverse Infinite Scroll & Pagination

This feature is simulated entirely on the client-side for demonstration.

1.  **Data:** A large array of 100 dummy messages is generated and stored in the Redux state.
2.  **Pagination:** A `page` state variable tracks which batch of messages to display. We use `useMemo` to calculate a `messagesToShow` array, which slices the full message list based on the current page (`totalMessages - page * 20`).
3.  **Trigger:** A custom `useIntersectionObserver` hook watches an invisible `<div>` at the top of the chat. When it enters the viewport, it signifies the user has reached the top.
4.  **Loading:** When triggered, a loading state is activated, and the `page` number is incremented. This causes `messagesToShow` to re-calculate, prepending the next 20 older messages.
5.  **Scroll Preservation:** To prevent the view from jumping, a `useLayoutEffect` hook saves the `scrollHeight` of the chat container _before_ new messages are added. After they are rendered, it calculates the difference and adjusts the `scrollTop` to keep the user's view perfectly stable.
