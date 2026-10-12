import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/Layout";
import Header from "../../layout/Header";
import { pageRoutes } from "../../routes/PageRoutes";
import PaginationDropdown from "../../components/table/PaginationDropdown";
import Pagination from "../../components/table/Pagination";
import useDebounce from "../../hooks/useDebounce";
import { getTechniciansList } from "../../redux/slices/technicianSlice";

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

const formatFileUrl = (url) => {
  if (!url) return "image.png";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace("/api", "");
  return `${baseUrl}/${url.startsWith("/") ? url.slice(1) : url}`;
};

const Technicians = () => {
  const dispatch = useDispatch();

  const {
    techniciansList = [],
    techniciansMeta = {},
    isTechniciansLoading = false,
  } = useSelector((state) => state.technicianReducer || {});

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch technicians list from API
  useEffect(() => {
    dispatch(
      getTechniciansList({
        page: currentPage,
        limit: listPerPages,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, listPerPages, debouncedSearch]);

  // Handle client-side search fallback if API returns full unfiltered dataset
  const filteredList = useMemo(() => {
    if (!debouncedSearch) return techniciansList;
    const term = debouncedSearch.toLowerCase().trim();
    return techniciansList.filter((item) => {
      const name = (item.full_name || "").toLowerCase();
      const email = (item.email || "").toLowerCase();
      const role = (item.job_role || "").toLowerCase();
      const phone = (item.phone_number || "").toLowerCase();
      const dealer = (item.dealer?.dealer_name || "").toLowerCase();
      const address = (item.address || "").toLowerCase();
      return (
        name.includes(term) ||
        email.includes(term) ||
        role.includes(term) ||
        phone.includes(term) ||
        dealer.includes(term) ||
        address.includes(term)
      );
    });
  }, [techniciansList, debouncedSearch]);

  // Handle client-side pagination if server returned all items at once
  const isServerPaginated =
    techniciansMeta?.totalPages > 1 ||
    (techniciansMeta?.totalItems > techniciansList.length && techniciansList.length <= listPerPages);

  const displayList = isServerPaginated
    ? filteredList
    : filteredList.slice(
        (currentPage - 1) * listPerPages,
        currentPage * listPerPages
      );

  const totalItems = isServerPaginated
    ? techniciansMeta?.totalItems ?? filteredList.length
    : filteredList.length;

  const totalPages = isServerPaginated
    ? techniciansMeta?.totalPages || 1
    : Math.ceil(totalItems / listPerPages) || 1;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * listPerPages + 1;
  const endItem = Math.min(currentPage * listPerPages, totalItems);

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />
        <div className="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
          <div>
            <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Technicians</h4>
            <p className="mb-0 ct_para_clr">
              Manage all technicians assigned under dealerships across the platform.
            </p>
          </div>
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
                placeholder="Search by technician name, email, job role, dealer..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
                    <th>Technician</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Job Role</th>
                    <th>Dealer</th>
                    <th>Date Registered</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isTechniciansLoading ? (
                    <tr>
                      <td colSpan="9" className="text-center py-5">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div
                            className="spinner-border spinner-border-sm text-success"
                            role="status"
                          ></div>
                          <span className="text-muted ct_fs_14">Loading technicians...</span>
                        </div>
                      </td>
                    </tr>
                  ) : displayList.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-5 text-muted ct_fs_14">
                        No technicians found.
                      </td>
                    </tr>
                  ) : (
                    displayList.map((technician, index) => {
                      const technicianId = technician.id || technician.technician_id;
                      const serialNumber = (currentPage - 1) * listPerPages + index + 1;
                      const fullName = technician.full_name || "N/A";
                      const email = technician.email || "N/A";
                      const phone = technician.phone_number || "N/A";
                      const jobRole = technician.job_role || "-";
                      const dealerName = technician.dealer?.dealer_name || "-";
                      const dateRegistered = formatDate(
                        technician.created_at || technician.createdAt
                      );
                      const isBlocked = technician.is_block === 1 || technician.is_blocked === 1;
                      const isActive = technician.status === 1 && !isBlocked;

                      return (
                        <tr key={technicianId || index}>
                          <td>{serialNumber}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={formatFileUrl(technician.profile_image)}
                                alt={fullName}
                                className="rounded-circle object-fit-cover shadow-sm flex-shrink-0"
                                width="34"
                                height="34"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "image.png";
                                }}
                              />
                              <span className="ct_fw_600 text-truncate" style={{ maxWidth: "160px" }}>
                                {fullName}
                              </span>
                            </div>
                          </td>
                          <td>{email}</td>
                          <td>{phone}</td>
                          <td>
                            <span className="badge bg-light text-dark border px-2 py-1">
                              {jobRole}
                            </span>
                          </td>
                          <td>{dealerName}</td>
                          <td>{dateRegistered}</td>
                          <td>
                            <span
                              className={`badge ${
                                isBlocked
                                  ? "bg-danger-subtle text-danger border border-danger-subtle"
                                  : isActive
                                  ? "bg-success-subtle text-success border border-success-subtle"
                                  : "bg-warning-subtle text-warning border border-warning-subtle"
                              }`}
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                letterSpacing: "0.5px",
                                borderRadius: "6px",
                                padding: "4px 8px",
                              }}
                            >
                              {isBlocked ? "BLOCKED" : isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>
                          <td>
                            <Link
                              to={`${pageRoutes.technician_detail}?id=${technicianId}`}
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
            {!isTechniciansLoading && totalItems > 0 && (
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
                    Showing {startItem} to {endItem} of {totalItems} technicians
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
    </Layout>
  );
};

export default Technicians;
