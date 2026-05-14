import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🖥️ IT HelpDesk | USF
      </div>

      <div className="navbar-right">
        <span className="navbar-user">👤 {user?.name}</span>

        {user?.role === "admin" && (
          <button className="btn btn-gold btn-sm" onClick={function() { navigate("/admin"); }}>
            Dashboard
          </button>
        )}

        {user?.role === "customer" && (
          <button className="btn btn-gold btn-sm" onClick={function() { navigate("/my-tickets"); }}>
            My Tickets
          </button>
        )}

        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;