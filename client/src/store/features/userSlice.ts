import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  id: string; // MongoDB _id
  username: string;
  email: string;
};

interface UserState {
  token: string | null;
  user: UserType | null;
  loading: boolean;
  error: string | null;
  checked: boolean;
  accessToken: string | null;
}

// 🔹 Rehydrate from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const storedAccessToken = localStorage.getItem("accessToken");

const initialState: UserState = {
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: true,
  error: null,
  checked: false,
  accessToken: storedAccessToken || null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType | null>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.checked = true;

      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      if (action.payload) {
        localStorage.setItem("accessToken", action.payload);
      } else {
        localStorage.removeItem("accessToken");
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.checked = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
      state.checked = true;

      // 🔹 Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
    },
  },
});

export const {
  setUser,
  setToken,
  setAccessToken,
  setLoading,
  setError,
  logout,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
