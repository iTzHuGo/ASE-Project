import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

export default function ProfileButton() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Verifica se o utilizador está logado sempre que muda de página
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const isProfilePage = location.pathname === "/profile";

  return (
    <Link to={isProfilePage ? "/" : (user ? "/profile" : "/login")} className="profile-floating-btn">
      <div className="profile-avatar">
        {isProfilePage ? "🏠" : (user && user.name ? user.name.charAt(0).toUpperCase() : "➜")}
      </div>
      <span className="profile-label">{isProfilePage ? "Home" : (user ? "Conta" : "Login")}</span>
    </Link>
  );
}