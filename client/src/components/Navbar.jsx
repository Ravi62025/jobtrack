import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          JobTrack
        </Link>

        <div className="navbar-links">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/applications">Applications</NavLink>
        </div>

        <div className="navbar-right">
          <span className="navbar-avatar" aria-hidden="true">
            {initial}
          </span>
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