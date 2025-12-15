import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken } from "../store/features/userSlice";
import { setLocalStorage } from "../utils/helpers/localStorage";
import api from "../lib/axios"; // ✅ centralized axios instance

const AuthPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (location.state?.loggedOut) {
      toast.success("Logged out successfully!");
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

      const success = await sendOtp();
      if (success) setStep("otp");
    } else {
      // Login flow
      try {
        const res = await api.post("/api/auth/login", { email, password });

        toast.success("Login successful", {
          duration: 2000, // closes in 2 seconds
        });

        dispatch(setUser(res.data.user));
        dispatch(setAccessToken(res.data.token));

        setLocalStorage("user", res.data.user);
        setLocalStorage("accessToken", res.data.token);
        navigate("/dashboard");
      } catch (err: any) {
        const msg = err.response?.data?.message || "Login failed";
        toast.error(msg);
      }
    }
  };

  const sendOtp = async () => {
    try {
      const res = await api.post("/api/auth/send-otp", {
        email,
        username,
        password,
      });

      const msg = res.data?.message;

      if (msg === "OTP sent to email") {
        toast.success("OTP sent to your email!", {
          duration: 2000, // closes in 2 seconds
        });
        setTimer(60);
        return true;
      }
      if (msg === "OTP resent to email") {
        toast.success("OTP resent to your email!", {
          duration: 2000, // closes in 2 seconds
        });
        setTimer(60);
        return true;
      }

      toast.success(msg || "OTP sent successfully", {
        duration: 2000, // closes in 2 seconds
      });
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      toast.error(msg);

      if (msg.includes("User already registered")) {
        setStep("form");
        setIsLogin(false);
      }

      return false;
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/verify-otp", {
        email,
        otp,
        password,
        username,
      });

      toast.success(res.data.message || "Signup successful!", {
        duration: 2000, // closes in 2 seconds
      });
      dispatch(setUser(res.data.user));
      dispatch(setAccessToken(res.data.token));

      setLocalStorage("user", res.data.user);
      setLocalStorage("accessToken", res.data.token);
      navigate("/dashboard");

      // Reset local state
      setStep("form");
      setIsLogin(true);
      setOtp("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid or expired OTP";
      toast.error(msg);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {step === "form" && (
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
          )}

          {step === "otp" && !isLogin && (
            <form className="space-y-4" onSubmit={handleOtpVerify}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
                Verify OTP
              </button>

              <div className="text-center mt-4">
                {timer > 0 ? (
                  <p className="text-gray-600 text-sm">
                    Resend OTP in {timer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="text-blue-600 font-medium hover:underline">
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setStep("form");
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
