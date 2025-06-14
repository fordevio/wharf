import './index.css';
import wharfLogo from '../../assets/wharf.png';
import { useContext, useState } from 'react';
import UserContext from '../../context/user/userContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const userContext = useContext(UserContext);
  const location = useLocation();
  const currentPath = location.pathname;

  const [menuOpen, setMenuOpen] = useState(false);

  if (!userContext || !userContext.curUser) {
    return null;
  }

  const logout = () => {
    localStorage.removeItem('token');
    userContext.setCurUser({} as any); // Reset user context
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <nav className="nav">
      <img src={wharfLogo} className="logo" alt="wharf" />

      <div
        className={`menu ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? 'open' : ''}>
        <li>
          <Link
            to="/"
            className="link"
            style={currentPath === '/' ? { color: 'blue' } : {}}
          >
            Containers
          </Link>
        </li>
        <li>
          <Link
            to="/images"
            className="link"
            style={currentPath === '/images' ? { color: 'blue' } : {}}
          >
            Images
          </Link>
        </li>
        <li>
          <Link
            to="/volumes"
            className="link"
            style={currentPath === '/volumes' ? { color: 'blue' } : {}}
          >
            Volumes
          </Link>
        </li>
        <li>
          <Link
            to="/networks"
            className="link"
            style={currentPath === '/networks' ? { color: 'blue' } : {}}
          >
            Networks
          </Link>
        </li>
        {userContext.curUser.isAdmin && (
          <li>
            <Link
              to="/users"
              className="link"
              style={currentPath === '/users' ? { color: 'blue' } : {}}
            >
              Users
            </Link>
          </li>
        )}
      </ul>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
