import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function App() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  return <Navigate to="/help" />;
}

export default App;