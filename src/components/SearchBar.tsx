import React, { useState, useRef, useEffect } from "react";
import { BlogPost, SearchResult } from "../types";
import { searchPosts } from "../utils/content";

interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
  availableTags?: string[];
  selectedTags?: string[];
  onTagToggle?: (tag: string) => void;
  posts?: BlogPost[];
  onPostSelect?: (postId: string) => void;
  tagFilterMode?: "AND" | "OR";
  onTagFilterModeToggle?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onSearch,
  availableTags = [],
  selectedTags = [],
  onTagToggle,
  posts = [],
  onPostSelect,
  tagFilterMode = "OR",
  onTagFilterModeToggle,
}) => {
  const [isTagMode, setIsTagMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle search suggestions based on current query
  useEffect(() => {
    if (query.startsWith("#")) {
      // Tag mode - show tag suggestions
      setIsTagMode(true);
      const searchTerm = query.slice(1).toLowerCase();
      const filtered = availableTags.filter(
        (tag) =>
          (searchTerm === "" || tag.toLowerCase().includes(searchTerm)) &&
          !selectedTags.includes(tag)
      );
      setFilteredTags(filtered);
      setSearchResults([]);
      setShowSuggestions(filtered.length > 0);
    } else if (query.trim().length >= 2) {
      // Content search mode - show post results
      setIsTagMode(false);
      setFilteredTags([]);
      const results = searchPosts(posts, query.trim());
      setSearchResults(results);
      setShowSuggestions(results.length > 0);
    } else {
      // No search
      setIsTagMode(false);
      setShowSuggestions(false);
      setFilteredTags([]);
      setSearchResults([]);
    }
  }, [query, availableTags, selectedTags, posts]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
  };

  // Handle tag selection from suggestions
  const handleTagSelect = (tag: string) => {
    if (onTagToggle) {
      onTagToggle(tag);
    }
    onSearch(""); // Clear search after selecting tag
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle post selection from search results
  const handlePostSelect = (postId: string) => {
    if (onPostSelect) {
      onPostSelect(postId);
    }
    onSearch(""); // Clear search after selecting post
    setShowSuggestions(false);
  };

  // Render text snippet with highlighted search term
  const renderHighlightedText = (text: string, start: number, end: number) => {
    if (start >= end || start < 0 || end > text.length) {
      return <span>{text}</span>;
    }

    return (
      <span>
        {text.slice(0, start)}
        <span className="search-highlight">{text.slice(start, end)}</span>
        {text.slice(end)}
      </span>
    );
  };

  // Handle key events for better UX
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      onSearch("");
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search posts or type # for tags..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        {showSuggestions && (
          <div ref={suggestionsRef} className="search-suggestions">
            {/* Tag suggestions */}
            {isTagMode && filteredTags.length > 0 && (
              <>
                <div className="suggestions-header">Tags</div>
                {filteredTags.map((tag) => (
                  <button
                    key={tag}
                    className="suggestion-item"
                    onClick={() => handleTagSelect(tag)}
                  >
                    <span className="suggestion-hash">#</span>
                    <span className="suggestion-tag">{tag}</span>
                  </button>
                ))}
              </>
            )}

            {/* Search results */}
            {!isTagMode && searchResults.length > 0 && (
              <>
                <div className="suggestions-header">
                  {searchResults.length === 1
                    ? "1 result"
                    : `${searchResults.length} results`}
                </div>
                {searchResults.slice(0, 5).map((result) => (
                  <button
                    key={result.post.id}
                    className="search-result-item"
                    onClick={() => handlePostSelect(result.post.id)}
                  >
                    <div className="search-result-title">
                      {result.matchType === "title" &&
                      result.snippets.length > 0
                        ? renderHighlightedText(
                            result.snippets[0].text,
                            result.snippets[0].highlightStart,
                            result.snippets[0].highlightEnd
                          )
                        : result.post.title}
                    </div>
                    <div className="search-result-meta">
                      {result.post.date} • {result.post.readTime || 1} min read
                    </div>
                    {result.snippets.length > 0 &&
                      result.matchType !== "title" && (
                        <div className="search-result-snippet">
                          {renderHighlightedText(
                            result.snippets[0].text,
                            result.snippets[0].highlightStart,
                            result.snippets[0].highlightEnd
                          )}
                          {result.snippets[0].text.length >= 140 && "..."}
                        </div>
                      )}
                  </button>
                ))}
              </>
            )}

            {/* No results message */}
            {!isTagMode &&
              searchResults.length === 0 &&
              query.trim().length >= 2 && (
                <div className="no-results">
                  <div className="suggestions-header">No results found</div>
                  <div className="no-results-text">
                    Try different keywords or check your spelling
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="selected-tags">
          <div className="selected-tags-header">
            <span className="selected-tags-label">
              {selectedTags.length > 1 && tagFilterMode === "AND"
                ? "Posts with all tags:"
                : "Posts with tags:"}
            </span>
            {selectedTags.length > 1 && onTagFilterModeToggle && (
              <button
                className="filter-mode-toggle"
                onClick={onTagFilterModeToggle}
                title={
                  tagFilterMode === "OR"
                    ? "Click to show posts that have ALL selected tags"
                    : "Click to show posts that have ANY selected tag"
                }
              >
                {tagFilterMode === "OR" ? "any" : "all"}
              </button>
            )}
          </div>
          <div className="selected-tags-list">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                className="selected-tag"
                onClick={() => onTagToggle && onTagToggle(tag)}
                title={`Remove ${tag} filter`}
              >
                #{tag}
                <span className="remove-tag">×</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
