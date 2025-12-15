import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken } from "../store/features/userSlice";
import { setLocalStorage } from "../utils/helpers/localStorage";
import api from "../lib/axios";

const AuthPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

  useEffect(() => {
    if (location.state?.loggedOut) {
      toast.success("Logged out successfully!", { duration: 2000 });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      // Signup flow
      if (!passwordRegex.test(password)) {
        setError(
          "Password must be 8–12 chars, include letters, numbers, and special characters."
        );
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      setError("");

      try {
        const res = await api.post("/api/auth/signup", {
          email,
          username,
          password,
        });

        toast.success("Signup successful!", { duration: 2000 });

        dispatch(setUser(res.data.user));
        dispatch(setAccessToken(res.data.token));

        setLocalStorage("user", res.data.user);
        setLocalStorage("accessToken", res.data.token);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (err: any) {
        const msg = err.response?.data?.message || "Signup failed";
        toast.error(msg, { id: "auth-error" });
      }
    } else {
      // Login flow
      try {
        const res = await api.post("/api/auth/login", { email, password });

        toast.success("Login successful", { duration: 2000 });

        dispatch(setUser(res.data.user));
        dispatch(setAccessToken(res.data.token));

        setLocalStorage("user", res.data.user);
        setLocalStorage("accessToken", res.data.token);

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (err: any) {
        const msg = err.response?.data?.message || "Login failed";
        toast.error(msg, { id: "auth-error" });
      }
    }
  };

  return (
    <>
      {/* <Toaster position="top-center" /> */}
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-600 focus:ring-red-600"
                    : "focus:ring-blue-500"
                }`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be 8–12 chars, include letters, numbers, and special
                characters.
              </p>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                {error && (
                  <span className="text-red-600 text-sm font-medium">
                    {error}
                  </span>
                )}
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-600 focus:ring-red-600"
                      : "focus:ring-blue-500"
                  }`}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-blue-600 font-medium hover:underline">
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
