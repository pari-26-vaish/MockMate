import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Restore logged-in user after page refresh
  useEffect(() => {
    const restoreUser = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) return;

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    };

    restoreUser();
  }, []);

  // Login
  const login = async (userData) => {
    const data = await loginUser(userData);

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // Register
  const register = async (userData) => {
    const data = await registerUser(userData);

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);