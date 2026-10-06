import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <strong className="navbar-brand">JobTrack</strong>

        <Link to="/">Dashboard</Link>
        <Link to="/applications">Applications</Link>

        <div className="navbar-right">
          <span className="navbar-user">{user?.name}</span>
          <button className="btn btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;