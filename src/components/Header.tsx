import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  compact?: boolean;
}

const Header: React.FC<HeaderProps> = ({ compact = false }) => {
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  if (compact) {
    return (
      <header className="header-compact">
        <div className="header-compact-content">
          <a href="/" onClick={handleHomeClick} className="home-link">
            ← Ehsan Writes
          </a>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-content">
        <h1>Ehsan Writes</h1>
        <p>Thoughts, ideas, and insights</p>
        {/* <nav className="nav">
          <a href="/" className="active" onClick={handleHomeClick}>
            all posts
          </a>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
