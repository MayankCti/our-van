import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import Header from "../../layout/Header";
import Layout from "../../layout/Layout";
import { pageRoutes } from "../../routes/PageRoutes";
import PaginationDropdown from "../../components/table/PaginationDropdown";
import Pagination from "../../components/table/Pagination";
import ErrorMessage from "../../components/form/ErrorMessage";
import useDebounce from "../../hooks/useDebounce";
import {
  getDealersList,
  createDealer,
  toggleBlockDealer,
} from "../../redux/slices/dealerSlice";
import { dealerSchema } from "../../utils/Schema";

const Dealer = () => {
  const dispatch = useDispatch();
  const addModalCloseRef = useRef(null);

  const {
    dealersList = [],
    dealersMeta = {},
    isDealersLoading = false,
    isCreateDealerLoading = false,
  } = useSelector((state) => state.dealerReducer || {});

  const [togglingId, setTogglingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const isDealerActive = (item) => {
    if (!item) return false;
    if (typeof item.status === "string") {
      const s = item.status.trim().toUpperCase();
      if (s === "BLOCKED" || s === "INACTIVE" || s === "BLOCK" || s === "0" || s === "FALSE") {
        return false;
      }
      if (s === "ACTIVE" || s === "COMPLETED" || s === "1" || s === "TRUE") {
        return true;
      }
    }
    if (item.status === 0 || item.status === false) return false;
    if (item.is_active === false || item.is_active === 0 || item.is_active === "0") return false;
    if (item.isActive === false || item.isActive === 0 || item.isActive === "0") return false;
    if (item.is_blocked === true || item.is_blocked === 1 || item.is_blocked === "1") return false;
    if (item.isBlocked === true || item.isBlocked === 1 || item.isBlocked === "1") return false;
    return true;
  };

  const handleToggleBlockDealer = (dealer) => {
    const dealerId = dealer?.dealerId || dealer?.id || dealer?.dealer_id;
    if (!dealerId) return;

    setTogglingId(dealerId);
    dispatch(
      toggleBlockDealer({
        dealerId,
        callback: () => {
          setTogglingId(null);
          dispatch(
            getDealersList({
              page: currentPage,
              limit: listPerPages,
              search: debouncedSearch,
            })
          );
        },
      })
    );
  };

  // Formik for Add Dealer Modal
  const formik = useFormik({
    initialValues: {
      dealer_name: "",
      email: "",
      phone_number: "",
    },
    validationSchema: dealerSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(
        createDealer({
          payload: {
            dealer_name: values.dealer_name.trim(),
            email: values.email.trim().toLowerCase(),
            phone_number: values.phone_number.trim(),
          },
          callback: (res) => {
            if (
              res?.success === true ||
              res?.status === true ||
              res?.status === 200 ||
              res?.statusCode === 200 ||
              res?.statusCode === 201 ||
              res?.data ||
              !res?.error
            ) {
              addModalCloseRef.current?.click();
              resetForm();
              if (currentPage !== 1) {
                setCurrentPage(1);
              } else {
                dispatch(
                  getDealersList({
                    page: 1,
                    limit: listPerPages,
                    search: debouncedSearch,
                  })
                );
              }
            }
          },
        })
      );
    },
  });

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
            onClick={() => formik.resetForm()}
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
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isDealersLoading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                          <span className="text-muted ct_fs_14">Loading dealers...</span>
                        </div>
                      </td>
                    </tr>
                  ) : dealersList?.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted ct_fs_14">
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
                      const isActive = isDealerActive(dealer);
                      const isCurrentlyToggling = togglingId === dealerId;

                      return (
                        <tr key={dealerId || index}>
                          <td>{serialNumber}</td>
                          <td className="ct_fw_600">{dealerName}</td>
                          <td>{email}</td>
                          <td>{ownersCount}</td>
                          <td>{dateRegistered}</td>
                          <td>
                            <label
                              className="toggle-switch"
                              style={{
                                opacity: isCurrentlyToggling ? 0.6 : 1,
                                cursor: isCurrentlyToggling ? "not-allowed" : "pointer",
                              }}
                              title={isActive ? "Active (Click to Block)" : "Inactive / Blocked (Click to Activate)"}
                            >
                              <input
                                type="checkbox"
                                checked={isActive}
                                disabled={isCurrentlyToggling}
                                onChange={() => handleToggleBlockDealer(dealer)}
                              />
                              <div className="toggle-switch-background">
                                <div className="toggle-switch-handle"></div>
                              </div>
                            </label>
                          </td>
                          <td>
                            <Link
                              to={`${pageRoutes.dealerDetail}?id=${dealerId}`}
                              className="ct_action_icon_btn ct_view_btn"
                              title="View Details"
                            >
                              <i className="fa-regular fa-eye"></i>
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

              <button
                type="button"
                ref={addModalCloseRef}
                className="btn-close shadow-none"
                data-bs-dismiss="modal"
                onClick={() => formik.resetForm()}
              ></button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="modal-body pt-4">
                <div className="mb-3">
                  <label className="ct_label">
                    Dealer Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="dealer_name"
                    className={`form-control ct_input ${
                      formik.errors.dealer_name && formik.touched.dealer_name
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter dealer name"
                    value={formik.values.dealer_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <ErrorMessage
                    errors={formik.errors}
                    touched={formik.touched}
                    fieldName="dealer_name"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="ct_label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ct_input ${
                        formik.errors.email && formik.touched.email
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <ErrorMessage
                      errors={formik.errors}
                      touched={formik.touched}
                      fieldName="email"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="ct_label">
                      Phone No. <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      className={`form-control ct_input ${
                        formik.errors.phone_number && formik.touched.phone_number
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter phone no."
                      value={formik.values.phone_number}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <ErrorMessage
                      errors={formik.errors}
                      touched={formik.touched}
                      fieldName="phone_number"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 pt-4 ct_flex_col_575">
                <button
                  type="button"
                  className="btn ct_btn_gray ct_btn_h_50 ct_w_100_575"
                  data-bs-dismiss="modal"
                  onClick={() => formik.resetForm()}
                  disabled={isCreateDealerLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn ct_green_btn ct_btn_h_50 ct_w_100_575"
                  disabled={isCreateDealerLoading}
                >
                  {isCreateDealerLoading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div
                        className="spinner-border spinner-border-sm text-white"
                        role="status"
                      ></div>
                      <span>Adding Dealer...</span>
                    </div>
                  ) : (
                    "Add Dealer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dealer;