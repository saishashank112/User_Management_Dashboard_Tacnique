import React from 'react';
import { PAGE_SIZE_OPTIONS } from '../utils/constants';
import { getPaginationLabel, getTotalPages } from '../utils/helpers';

/**
 * Pagination — page-size selector, prev/next/numbered page buttons,
 * and a "Showing X–Y of Z" label.
 */
const Pagination = ({ currentPage, pageSize, totalCount, onPageChange, onPageSizeChange }) => {
  const totalPages = getTotalPages(totalCount, pageSize);
  const label = getPaginationLabel(currentPage, pageSize, totalCount);

  // Build visible page numbers (show up to 5 at a time with ellipsis)
  const buildPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const pageNumbers = buildPageNumbers();

  return (
    <div className="pagination">
      {/* Records label + page size selector */}
      <div className="pagination-info">
        <span className="pagination-label">{label}</span>
        <div className="page-size-group">
          <label className="form-label" htmlFor="page-size-select">Show:</label>
          <select
            id="page-size-select"
            className="form-input form-select page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Records per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="pagination-label">entries</span>
        </div>
      </div>

      {/* Page navigation */}
      <div className="pagination-nav">
        <button
          id="prev-page-btn"
          className="page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {pageNumbers.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              id={`page-btn-${p}`}
              className={`page-btn ${currentPage === p ? 'page-btn--active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={currentPage === p ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          id="next-page-btn"
          className="page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
