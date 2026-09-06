import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Eye, EyeOff, Mic } from "lucide-react";
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });

        setMessage("Login successful!");
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setMessage("Registration successful! You can now login.");
        setIsLogin(true);

        setFormData({
          name: "",
          email: formData.email,
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  // Simple password strength check for the register view
  const getStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0 - 4
  };

  const strength = getStrength(formData.password);
  const strengthColors = ["bg-slate-700", "bg-red-500", "bg-orange-400", "bg-lime-400", "bg-emerald-400"];

  return (
    <div
      className="bg min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10 overflow-y-auto relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.86), rgba(2,6,23,0.86)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* extra blur/darken layer so the photo stays a quiet backdrop */}
      <div className="absolute inset-0 backdrop-blur-sm bg-slate-950/40 pointer-events-none" />

      <div className="w-full max-w-[92vw] sm:max-w-md relative">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-blue-400 flex items-center justify-center bg-slate-900 shrink-0">
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <div className="leading-tight text-center">
            <p className="text-white font-bold tracking-wide text-sm sm:text-base">INTERVIEW</p>
            <p className="text-slate-300 text-[10px] sm:text-xs tracking-widest -mt-1">SIMULATOR</p>
          </div>
        </div>

        <h2
          key={isLogin ? "login-h" : "register-h"}
          className="heading text-center text-2xl sm:text-3xl font-bold text-white mb-1 px-2"
        >
          {isLogin ? "Welcome Back!" : "Get Started!"}
        </h2>
        <p
          key={isLogin ? "login-sub" : "register-sub"}
          className="subtitle text-center text-slate-300 text-sm sm:text-base mb-4 sm:mb-6 px-2"
        >
          {isLogin
            ? "Welcome back, future hire."
            : "Build your interview confidence."}
        </p>

        {/* Card */}
        <div className="card bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-blue-400 flex items-center justify-center shrink-0">
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            </div>
            <div className="leading-tight">
              <p className="text-white font-bold text-xs sm:text-sm tracking-wide">INTERVIEW</p>
              <p className="text-slate-400 text-[9px] sm:text-[10px] tracking-widest -mt-1">SIMULATOR</p>
            </div>
          </div>

          <div className="toggle flex bg-slate-800 rounded-lg p-1 mb-5 sm:mb-6 mt-3 sm:mt-4">
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`w-1/2 py-2 rounded-md font-medium text-sm sm:text-base transition ${
                isLogin ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`w-1/2 py-2 rounded-md font-medium text-sm sm:text-base transition ${
                !isLogin ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          <p className="text-slate-300 text-sm sm:text-base mb-3 sm:mb-4">
            {isLogin ? "Login to your account" : "Create Your Account"}
          </p>

          <form
            key={isLogin ? "login-form" : "register-form"}
            onSubmit={handleSubmit}
            className="form-fade space-y-3 sm:space-y-4"
            autoComplete={isLogin ? "on" : "off"}
          >
            {/* Decoy fields: keep Chrome/Edge's autofill heuristics away from the
               real Register inputs below. They are invisible and never included
               in formData, so they have no effect on submission. */}
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }}
                />
                <input
                  type="password"
                  name="fake_password"
                  autoComplete="new-password"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }}
                />
              </>
            )}

            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  autoComplete="name"
                  className="input w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-slate-100 text-slate-900 placeholder-slate-500 outline-none"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                autoComplete={isLogin ? "email" : "off"}
                className="input w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-slate-100 text-slate-900 placeholder-slate-500 outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name={isLogin ? "password" : "account_password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="input w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-slate-100 text-slate-900 placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  autoComplete="new-password"
                  className="input w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-slate-100 text-slate-900 placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {!isLogin && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`strength-bar h-1.5 flex-1 rounded-full ${
                        i < strength ? strengthColors[strength] : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  8+ chars, 1 uppercase, 1 number, 1 special char
                </p>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-xs sm:text-sm gap-2 flex-wrap">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((v) => !v)}
                    className="rounded border-slate-600 bg-slate-800"
                  />
                  Remember Me
                </label>
                <button type="button" className="text-blue-400 hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            {message && <p className="text-xs sm:text-sm text-green-400">{message}</p>}
            {error && <p className="text-xs sm:text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              className="btn w-full py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-slate-400 mt-3 sm:mt-4">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => switchMode(false)} className="text-blue-400 hover:underline">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => switchMode(true)} className="text-blue-400 hover:underline">
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;