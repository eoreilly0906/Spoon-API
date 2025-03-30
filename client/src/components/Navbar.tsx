import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-links">
          <Link to="/" className="navbar-brand">
            Recipe App
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/recipes" className="navbar-link">
                My Recipes
              </Link>
              <Link to="/search" className="navbar-link">
                Search Recipes
              </Link>
              <Link to="/recipes/new" className="navbar-link">
                New Recipe
              </Link>
            </>
          )}
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
