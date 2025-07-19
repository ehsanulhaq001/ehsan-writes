import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLocation } from "react-router-dom";

const ThemeSelector: React.FC = () => {
  const { currentTheme, themes, setTheme, loading } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Make even more subtle on home page
  const isHomePage = location.pathname === "/";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const currentThemeData = themes.find((theme) => theme.id === currentTheme);

  return (
    <div
      className={`theme-selector ${isHomePage ? "home-page" : ""}`}
      ref={dropdownRef}
    >
      <button
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        title="Change theme"
      >
        <div className="theme-preview">
          {currentThemeData && (
            <>
              <div
                className="preview-dot"
                style={{ backgroundColor: currentThemeData.preview.primary }}
              />
              <div
                className="preview-dot"
                style={{ backgroundColor: currentThemeData.preview.secondary }}
              />
              <div
                className="preview-dot"
                style={{ backgroundColor: currentThemeData.preview.accent }}
              />
            </>
          )}
        </div>
        <span className="theme-selector-text">
          {loading ? "Loading..." : currentThemeData?.name || "Theme"}
        </span>
        <svg
          className={`theme-selector-arrow ${isOpen ? "open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">
            <h3>Choose Theme</h3>
          </div>
          <div className="theme-grid">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`theme-option ${
                  theme.id === currentTheme ? "active" : ""
                }`}
                onClick={() => handleThemeSelect(theme.id)}
                title={theme.description}
              >
                <div className="theme-option-preview">
                  <div
                    className="preview-color primary"
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                  <div
                    className="preview-color secondary"
                    style={{ backgroundColor: theme.preview.secondary }}
                  />
                  <div
                    className="preview-color accent"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                </div>
                <div className="theme-option-info">
                  <span className="theme-name">{theme.name}</span>
                  <span className="theme-description">{theme.description}</span>
                </div>
                {theme.id === currentTheme && (
                  <div className="active-indicator">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
