import React from "react";
import "./index.css";

const Pagination = ({ totalPages = 1, currentPage = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <ul className="pagination ct_pagination_main justify-content-end mb-0">
      <li className={`previous ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      </li>

      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <li key={`ellipsis-${index}`} className="break-me">
              <span>...</span>
            </li>
          );
        }
        return (
          <li
            key={page}
            className={currentPage === page ? "active" : ""}
          >
            <button type="button" onClick={() => handlePageClick(page)}>
              {page}
            </button>
          </li>
        );
      })}

      <li className={`next ${currentPage === totalPages ? "disabled" : ""}`}>
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
