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
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 2rem",
                borderBottom: "1px solid #ccc",
                fontFamily: "sans-serif",
            }}
        >
            <strong>JobTrack</strong>

            <Link to="/">Dashboard</Link>
            <Link to="/applications">Applications</Link>

            <span style={{ marginLeft: "auto" }}>{user?.name}</span>

            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
}

export default Navbar;