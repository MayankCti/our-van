import ReactPaginate from 'react-paginate';
import "./index.css";

const ReactPagination = ({ pageCount, onPageChange, currentPage = 0 }) => {
    return (
        <ReactPaginate
            previousLabel={<i className="fa-solid fa-angle-left"></i>}
            nextLabel={<i className="fa-solid fa-angle-right"></i>}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
            containerClassName={"ct_pagination_ul_21"}
            activeClassName={"active"}
            disabledClassName={"disabled"}
            forcePage={currentPage}
        />
    );
};

export default ReactPagination;
