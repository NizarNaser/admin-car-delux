import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Navbar = ({ setShowLogin, token, setToken }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };
  useEffect(() => {
    if (!token) {
      setShowLogin(true);
    }
  }, [token]);
  return (
    <div className="navbar">
      <Link to={"/admin-car-delux"}><img className="logo" src={assets.logo} alt="Logo" /></Link>
    
        {!token ? (
         <></>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_image} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={logout}>Ausloggen</li>
            </ul>
          </div>
        )}
     

    </div>
  );
};

export default Navbar;
