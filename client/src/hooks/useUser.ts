import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setAccessToken,
  setError,
  setLoading,
  type UserType,
} from "../store/features/userSlice";
import type { RootState } from "../store/store";
import api from "../lib/api";
import { getLocalStorage } from "../utils/helpers/localStorage";

export const baseURL = import.meta.env.VITE_API_URL || "";

export const useUser = () => {
  const dispatch = useDispatch();
  const { user, loading, checked } = useSelector(
    (state: RootState) => state.userAuth
  );

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const accessToken = getLocalStorage("accessToken");
        if (accessToken) {
          dispatch(setAccessToken(accessToken));

          // ✅ attach token to request
          const res = await api.get("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data: UserType = res.data;
          if (data) {
            dispatch(setUser(data));
          } else {
            throw new Error("Unauthorised");
          }
        } else {
          throw new Error("No token found");
        }
      } catch (err: any) {
        console.error(err);
        dispatch(setUser(null));
        dispatch(setError(err.response?.data?.message || "Not authenticated"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (!checked) {
      checkAuth();
    }
  }, [dispatch, checked]);

  return { user, loading, checked };
};
