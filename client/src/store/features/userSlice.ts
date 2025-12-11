import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  id: string; // matches Redux user id
  username: string;
  email: string;
};

interface UserState {
  token: string | null;
  accessToken: string | null;
  user: UserType | null;
  loading: boolean;
  error: string | null;
  checked: boolean;
}

// 🔹 Safely parse user from localStorage
let parsedUser: UserType | null = null;
const storedUser = localStorage.getItem("user");
if (storedUser) {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch {
    console.warn("Invalid user in localStorage, clearing...");
    localStorage.removeItem("user");
  }
}

const initialState: UserState = {
  token: localStorage.getItem("token") || null,
  accessToken: localStorage.getItem("accessToken") || null,
  user: parsedUser,
  loading: true,
  error: null,
  checked: false,
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
      if (action.payload) localStorage.setItem("token", action.payload);
      else localStorage.removeItem("token");
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      if (action.payload) localStorage.setItem("accessToken", action.payload);
      else localStorage.removeItem("accessToken");
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
