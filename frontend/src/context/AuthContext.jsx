import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(function() {
    const stored = localStorage.getItem("helpdeskUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  function login(userData) {
    setUser(userData);
    localStorage.setItem("helpdeskUser", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("helpdeskUser");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };