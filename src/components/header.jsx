import { Link, useLocation } from "react-router-dom";
import "./header.css";
import Logo from "../assets/logo.web.png";

export function Header() {
  const location = useLocation();
  const isInPlanner = location.pathname.endsWith("planner");

  return (
    <div className="header-container">
      <div className="logo-container">
        <Link to="/">
          <img src={Logo} width={100} alt="logo" />
        </Link>
      </div>
      {!isInPlanner && (
        <div className="login-container">
          <button className="signin-button">Sign In</button>
          <button className="signup-button">Sign Up</button>
        </div>
      )}
    </div>
  );
}
