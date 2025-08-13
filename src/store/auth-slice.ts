import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
}

// Check localStorage for an existing token
const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("auth-token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("auth-token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
