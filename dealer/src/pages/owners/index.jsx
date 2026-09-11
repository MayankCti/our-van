import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import PaginationDropdown from '../../components/table/PaginationDropdown';
import ReactPagination from '../../components/table/ReactPagination';
import useDebounce from '../../hooks/useDebounce';
import { getDealerOwnersList } from '../../redux/slices/vanSlice';

const Owners = () => {
  const dispatch = useDispatch();

  const { ownersList = [], ownersMeta = {}, isOwnersLoading = false } = useSelector(
    (state) => state.vanReducer || {}
  );

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset to first page when debounced search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  // Fetch owners list when page, limit, or debounced search changes
  useEffect(() => {
    dispatch(
      getDealerOwnersList({
        page: currentPage + 1,
        limit: listPerPages,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, listPerPages, debouncedSearch]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString || "N/A";
    }
  };

  const totalPages =
    ownersMeta?.totalPages ||
    Math.ceil((ownersMeta?.totalItems || 0) / listPerPages) ||
    1;

  return (
    <Layout>
      <SubHeader
        title="Owners"
        subtitle="View and manage all van owners assigned to your dealership."
      />
      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">

          {/* Search  */}
          <div className="mb-4 position-relative">
            <svg
              className="ct_search_icon"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 15L11.25 11.25M0.5 6.75C0.5 3.29822 3.29822 0.5 6.75 0.5C10.2018 0.5 13 3.29822 13 6.75C13 10.2018 10.2018 13 6.75 13C3.29822 13 0.5 10.2018 0.5 6.75Z"
                stroke="#475569"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input
              type="text"
              className="form-control ct_input ct_input_ps_40 ct_fs_14"
              placeholder="Search by Owner Name, Email, Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                className="btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(0);
                }}
                aria-label="Clear search"
                style={{ background: "none", cursor: "pointer", zIndex: 5 }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Table */}
          <div className="table-responsive ct_custom_table">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Owner Name</th>
                  <th>Email Address</th>
                  <th>Mobile Number</th>
                  <th>Assigned Van</th>
                  <th>Joined On</th>
                </tr>
              </thead>

              <tbody>
                {isOwnersLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                        <span className="text-muted ct_fs_14">Loading owners...</span>
                      </div>
                    </td>
                  </tr>
                ) : ownersList?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted ct_fs_14">
                      No owners found.
                    </td>
                  </tr>
                ) : (
                  ownersList.map((owner, index) => {
                    const assignedVansText =
                      owner.assignedVans && owner.assignedVans.length > 0
                        ? owner.assignedVans
                            .map((v) => v.vanName)
                            .filter(Boolean)
                            .join(", ")
                        : "N/A";

                    return (
                      <tr key={owner.ownerId || index}>
                        <td>{currentPage * listPerPages + index + 1}</td>
                        <td>{owner.ownerName || "N/A"}</td>
                        <td>{owner.email || "N/A"}</td>
                        <td>{owner.mobileNumber || "N/A"}</td>
                        <td>{assignedVansText}</td>
                        <td>{formatDate(owner.joinedOn)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          {ownersList?.length != 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
              <div>
                <PaginationDropdown
                  listPerPages={listPerPages}
                  options={[5, 10, 25, 50, 100]}
                  onChange={(val) => {
                    setListPerPages(val);
                    setCurrentPage(0);
                  }}
                />
              </div>
              <div>
                <ReactPagination
                  pageCount={totalPages}
                  onPageChange={handlePageClick}
                  currentPage={currentPage}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Owners;
