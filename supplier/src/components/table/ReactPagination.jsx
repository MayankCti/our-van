import React from "react";
import ReactPaginatePkg from "react-paginate";

const ReactPaginate = ReactPaginatePkg?.default || ReactPaginatePkg;

const ReactPagination = ({ pageCount, onPageChange, currentPage }) => {
    return (
        <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            onPageChange={onPageChange}
            containerClassName={"pagination ct_pagination_main"}
            activeClassName={"active"}
            forcePage={currentPage}
        />
    );
};

export default ReactPagination;
