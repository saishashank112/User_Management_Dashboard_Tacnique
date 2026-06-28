import React from 'react';

/**
 * SearchBar — real-time text filtering across firstName, lastName, and email.
 */
const SearchBar = ({ value, onChange }) => {
  const handleClear = () => onChange('');

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        {/* Search icon */}
        <svg className="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search by name or email…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search users"
          autoComplete="off"
        />

        {/* Clear button — only visible when query is non-empty */}
        {value && (
          <button
            id="search-clear-btn"
            className="search-clear"
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear search"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
