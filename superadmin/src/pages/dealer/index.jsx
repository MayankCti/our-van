import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../layout/Header";
import Layout from "../../layout/Layout";
import { pageRoutes } from "../../routes/PageRoutes";
import PaginationDropdown from "../../components/table/PaginationDropdown";
import Pagination from "../../components/table/Pagination";
import useDebounce from "../../hooks/useDebounce";
import { getDealersList } from "../../redux/slices/dealerSlice";

const Dealer = () => {
  const dispatch = useDispatch();

  const {
    dealersList = [],
    dealersMeta = {},
    isDealersLoading = false,
  } = useSelector((state) => state.dealerReducer || {});

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when debounced search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch dealers list when page, limit, or debounced search changes
  useEffect(() => {
    dispatch(
      getDealersList({
        page: currentPage,
        limit: listPerPages,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, listPerPages, debouncedSearch]);

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
    dealersMeta?.totalPages ||
    Math.ceil((dealersMeta?.totalItems || 0) / listPerPages) ||
    1;

  const totalItems = dealersMeta?.totalItems ?? dealersList.length;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * listPerPages + 1;
  const endItem = Math.min(currentPage * listPerPages, totalItems);

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />
        <div className="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
          <div>
            <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Dealers</h4>
            <p className="mb-0 ct_para_clr">Manage all registered dealers across the platform.</p>
          </div>
          <a
            className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575 text-decoration-none d-inline-flex align-items-center justify-content-center"
            data-bs-target="#addDealerModal"
            data-bs-toggle="modal"
            style={{ cursor: "pointer" }}
          >
            Add Dealer
          </a>
        </div>
        <div className="ct_px_30 mt-4 pb-4">
          <div className="container-fluid">
            {/* Search */}
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
                placeholder="Search by dealer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm && (
                <button
                  type="button"
                  className="btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
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
                    <th>Dealer</th>
                    <th>Email</th>
                    <th>Owners</th>
                    <th>Date Registered</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isDealersLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                          <span className="text-muted ct_fs_14">Loading dealers...</span>
                        </div>
                      </td>
                    </tr>
                  ) : dealersList?.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted ct_fs_14">
                        No dealers found.
                      </td>
                    </tr>
                  ) : (
                    dealersList.map((dealer, index) => {
                      const dealerId = dealer.dealerId || dealer.id || dealer.dealer_id;
                      const serialNumber = (currentPage - 1) * listPerPages + index + 1;
                      const dealerName = dealer.dealerName || dealer.name || dealer.dealer_name || "N/A";
                      const email = dealer.email || "N/A";
                      const ownersCount =
                        dealer.ownersCount !== undefined
                          ? dealer.ownersCount
                          : dealer.owners_count !== undefined
                            ? dealer.owners_count
                            : 0;
                      const dateRegistered = formatDate(
                        dealer.dateRegistered || dealer.date_registered || dealer.createdAt || dealer.created_at
                      );

                      return (
                        <tr key={dealerId || index}>
                          <td>{serialNumber}</td>
                          <td className="ct_fw_600">{dealerName}</td>
                          <td>{email}</td>
                          <td>{ownersCount}</td>
                          <td>{dateRegistered}</td>
                          <td>
                            <Link
                              to={`${pageRoutes.dealerDetail}?id=${dealerId}`}
                              className="ct_action_link"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {!isDealersLoading && dealersList?.length > 0 && (
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-4">
                <div className="d-flex align-items-center gap-3">
                  <PaginationDropdown
                    listPerPages={listPerPages}
                    onChange={(num) => {
                      setListPerPages(num);
                      setCurrentPage(1);
                    }}
                  />
                  <span className="ct_fs_13 ct_para_clr">
                    Showing {startItem} to {endItem} of {totalItems} dealers
                  </span>
                </div>

                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Dealer Modal */}
      <div className="modal fade" id="addDealerModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "690px" }}>
          <div className="modal-content ct_modal">
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="ct_fs_20 ct_fw_600 ct_head_clr mb-1">Add Dealer</h5>
                <p className="ct_fs_14 ct_para_clr mb-0">Register a new dealer to the platform.</p>
              </div>

              <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body pt-4">
              <div className="mb-3">
                <label className="ct_label">Dealer Name</label>
                <input type="text" className="form-control ct_input" placeholder="Enter dealer name" />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="ct_label">Email</label>
                  <input type="email" className="form-control ct_input" placeholder="Enter email" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="ct_label">Phone No.</label>
                  <input type="text" className="form-control ct_input" placeholder="Enter phone no." />
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 pt-4 ct_flex_col_575">
              <button className="btn ct_btn_gray ct_btn_h_50 ct_w_100_575" data-bs-dismiss="modal">
                Cancel
              </button>

              <button className="btn ct_green_btn ct_btn_h_50 ct_w_100_575" data-bs-dismiss="modal">
                Add Dealer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dealer;