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

  /* =========================
     AUTO LOGIN
  ========================= */

  useEffect(() => {

    const storedToken = localStorage.getItem("token");

    if (!storedToken) return;

    const decoded = parseJwt(storedToken);

    /* token invalide */
    if (!decoded) {
      localStorage.removeItem("token");
      return;
    }

    /* token expiré */
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return;
    }

    setToken(storedToken);

    setUser({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });

  }, []);

  /* =========================
     LOGIN
  ========================= */

  const login = async (data) => {

    try {

      /* nettoyage ancien login */
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        return result;
      }

      if (result.token) {

        const decoded = parseJwt(result.token);

        localStorage.setItem("token", result.token);

        setToken(result.token);

        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        });

      }

      return result;

    } catch (error) {

      console.error("Erreur login:", error);
      return { error: "Erreur serveur" };

    }

  };

  /* =========================
     REGISTER
  ========================= */

  const register = async (data) => {

    try {

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        return result;
      }

      if (result.token) {

        const decoded = parseJwt(result.token);

        localStorage.setItem("token", result.token);

        setToken(result.token);

        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        });

      }

      return result;

    } catch (error) {

      console.error("Erreur register:", error);
      return { error: "Erreur serveur" };

    }

  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);
    setToken(null);

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {
  return useContext(AuthContext);
}