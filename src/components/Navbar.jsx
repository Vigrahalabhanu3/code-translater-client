import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { logout as logoutAPI } from '../services/authService.js';
import toast from 'react-hot-toast';
import '../styles/navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try { await logoutAPI(); } catch {}
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">CodeTranslator</Link>
        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>Editor</Link>
          <Link to="/history" className={`navbar-link ${isActive('/history') ? 'active' : ''}`}>History</Link>
        </div>
      </div>
      <div className="navbar-right">
        {user?.picture && <img src={user.picture} alt="" className="navbar-avatar" />}
        <span className="navbar-username">{user?.name}</span>
        <button className="navbar-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
