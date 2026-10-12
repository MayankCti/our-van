import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/Layout";
import Header from "../../layout/Header";
import { pageRoutes } from "../../routes/PageRoutes";
import PaginationDropdown from "../../components/table/PaginationDropdown";
import Pagination from "../../components/table/Pagination";
import useDebounce from "../../hooks/useDebounce";
import { getSuppliersList } from "../../redux/slices/supplierSlice";

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

const Suppliers = () => {
  const dispatch = useDispatch();

  const {
    suppliersList = [],
    suppliersMeta = {},
    isSuppliersLoading = false,
  } = useSelector((state) => state.supplierReducer || {});

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch suppliers list from API
  useEffect(() => {
    dispatch(
      getSuppliersList({
        page: currentPage,
        limit: listPerPages,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, listPerPages, debouncedSearch]);

  // Handle client-side search fallback if API returns full unfiltered dataset
  const filteredList = useMemo(() => {
    if (!debouncedSearch) return suppliersList;
    const term = debouncedSearch.toLowerCase().trim();
    return suppliersList.filter((item) => {
      const company = (item.company_name || "").toLowerCase();
      const name = (item.full_name || "").toLowerCase();
      const email = (item.email || "").toLowerCase();
      const phone = (item.phone_number || "").toLowerCase();
      const city = (item.city || "").toLowerCase();
      const region = (item.service_region || "").toLowerCase();
      const dealer = (item.dealer?.dealer_name || "").toLowerCase();
      return (
        company.includes(term) ||
        name.includes(term) ||
        email.includes(term) ||
        phone.includes(term) ||
        city.includes(term) ||
        region.includes(term) ||
        dealer.includes(term)
      );
    });
  }, [suppliersList, debouncedSearch]);

  // Handle client-side pagination if server returned all items at once
  const isServerPaginated =
    suppliersMeta?.totalPages > 1 ||
    (suppliersMeta?.totalItems > suppliersList.length && suppliersList.length <= listPerPages);

  const displayList = isServerPaginated
    ? filteredList
    : filteredList.slice(
        (currentPage - 1) * listPerPages,
        currentPage * listPerPages
      );

  const totalItems = isServerPaginated
    ? suppliersMeta?.totalItems ?? filteredList.length
    : filteredList.length;

  const totalPages = isServerPaginated
    ? suppliersMeta?.totalPages || 1
    : Math.ceil(totalItems / listPerPages) || 1;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * listPerPages + 1;
  const endItem = Math.min(currentPage * listPerPages, totalItems);

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />
        <div className="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
          <div>
            <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Suppliers</h4>
            <p className="mb-0 ct_para_clr">
              Manage all registered parts and services suppliers across the platform.
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
                placeholder="Search by company name, contact person, email, city..."
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
                    <th>Supplier / Company</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Location</th>
                    <th>Dealer</th>
                    <th>Date Registered</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isSuppliersLoading ? (
                    <tr>
                      <td colSpan="9" className="text-center py-5">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div
                            className="spinner-border spinner-border-sm text-success"
                            role="status"
                          ></div>
                          <span className="text-muted ct_fs_14">Loading suppliers...</span>
                        </div>
                      </td>
                    </tr>
                  ) : displayList.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-5 text-muted ct_fs_14">
                        No suppliers found.
                      </td>
                    </tr>
                  ) : (
                    displayList.map((supplier, index) => {
                      const supplierId = supplier.id || supplier.supplier_id;
                      const serialNumber = (currentPage - 1) * listPerPages + index + 1;
                      const companyName = supplier.company_name || supplier.full_name || "N/A";
                      const contactPerson = supplier.full_name;
                      const email = supplier.email || "N/A";
                      const phone = supplier.phone_number || "N/A";
                      const location = supplier.city || supplier.service_region || "-";
                      const dealerName = supplier.dealer?.dealer_name || "-";
                      const dateRegistered = formatDate(
                        supplier.created_at || supplier.createdAt
                      );
                      const isBlocked = supplier.is_block === 1 || supplier.is_blocked === 1;
                      const isActive = supplier.status === 1 && !isBlocked;
                      const logoUrl = supplier.company_logo || supplier.profile_image;

                      return (
                        <tr key={supplierId || index}>
                          <td>{serialNumber}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={formatFileUrl(logoUrl)}
                                alt={companyName}
                                className="rounded-circle object-fit-cover shadow-sm flex-shrink-0"
                                width="34"
                                height="34"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "image.png";
                                }}
                              />
                              <div>
                                <span className="ct_fw_600 d-block text-truncate" style={{ maxWidth: "180px" }}>
                                  {companyName}
                                </span>
                                {contactPerson && contactPerson !== companyName && (
                                  <span className="text-muted ct_fs_12 d-block text-truncate" style={{ maxWidth: "180px" }}>
                                    {contactPerson}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{email}</td>
                          <td>{phone}</td>
                          <td>{location}</td>
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
                              to={`${pageRoutes.supplier_detail}?id=${supplierId}`}
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
            {!isSuppliersLoading && totalItems > 0 && (
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
                    Showing {startItem} to {endItem} of {totalItems} suppliers
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

export default Suppliers;
