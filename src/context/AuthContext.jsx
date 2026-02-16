import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_BASE = "http://localhost:8080";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decoded = parseJwt(storedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setUser(decoded);
      } else {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (data) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.token) {
      localStorage.setItem("token", result.token);
      const decoded = parseJwt(result.token);
      setUser(decoded);
      setToken(result.token);
    }

    return result;
  };

  const register = async (data) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.token) {
      localStorage.setItem("token", result.token);
      const decoded = parseJwt(result.token);
      setUser(decoded);
      setToken(result.token);
    }

    return result;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
