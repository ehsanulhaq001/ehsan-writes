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
          <a href="/" onClick={handleHomeClick} className="back-button">
            ← back
          </a>
          <div className="header-compact-title">
            <span className="compact-name">e h s a n</span>
            <div className="compact-separator">/</div>
            <span className="compact-writes">writes</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="elegant-title">
          <span className="elegant-name">e h s a n</span>
          <div className="elegant-separator">/</div>
          <span className="elegant-writes">writes</span>
        </div>
        <p className="header-subtitle">thoughts, ideas, and insights</p>
      </div>
    </header>
  );
};

export default Header;
