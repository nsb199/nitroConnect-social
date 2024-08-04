import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`header ${darkMode ? 'dark' : ''}`}>
      <div className="logo">
        <Link to="/">NitroConnect</Link>
      </div>
      <div className="theme-toggle">
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="home-button">
    
      </div>
    </header>
  );
};

export default Header;
