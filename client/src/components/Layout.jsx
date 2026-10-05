import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Layout;