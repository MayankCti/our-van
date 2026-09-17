import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/Layout";
import Header from "../../layout/Header";
import { pageRoutes } from "../../routes/PageRoutes";
import PaginationDropdown from "../../components/table/PaginationDropdown";
import Pagination from "../../components/table/Pagination";
import useDebounce from "../../hooks/useDebounce";
import { getOwnersList, toggleBlockOwner } from "../../redux/slices/ownerSlice";

const Owners = () => {
  const dispatch = useDispatch();

  const {
    ownersList = [],
    ownersMeta = {},
    isOwnersLoading = false,
  } = useSelector((state) => state.ownerReducer || {});

  const [togglingId, setTogglingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const isOwnerActive = (item) => {
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

  const handleToggleBlockOwner = (owner) => {
    const ownerId = owner?.ownerId || owner?.id || owner?.owner_id;
    if (!ownerId) return;

    setTogglingId(ownerId);
    dispatch(
      toggleBlockOwner({
        ownerId,
        callback: (res) => {
          setTogglingId(null);
          if (
            res?.success ||
            res?.status ||
            res?.statusCode === 200 ||
            res?.statusCode === 201
          ) {
            dispatch(
              getOwnersList({
                page: currentPage,
                limit: listPerPages,
                search: debouncedSearch,
              })
            );
          }
        },
      })
    );
  };

  // Reset to first page when debounced search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch owners list when page, limit, or debounced search changes
  useEffect(() => {
    dispatch(
      getOwnersList({
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
    ownersMeta?.totalPages ||
    Math.ceil((ownersMeta?.totalItems || 0) / listPerPages) ||
    1;

  const totalItems = ownersMeta?.totalItems ?? ownersList.length;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * listPerPages + 1;
  const endItem = Math.min(currentPage * listPerPages, totalItems);

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />
        <div className="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
          <div>
            <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Owners</h4>
            <p className="mb-0 ct_para_clr">
              Manage all registered van owners across the platform.
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
                placeholder="Search by owner name, email..."
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
                    <th>Owner Name</th>
                    <th>Email</th>
                    <th>Assigned Van</th>
                    <th>Dealer</th>
                    <th>Date Registered</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isOwnersLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div
                            className="spinner-border spinner-border-sm text-success"
                            role="status"
                          ></div>
                          <span className="text-muted ct_fs_14">Loading owners...</span>
                        </div>
                      </td>
                    </tr>
                  ) : ownersList?.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted ct_fs_14">
                        No owners found.
                      </td>
                    </tr>
                  ) : (
                    ownersList.map((owner, index) => {
                      const ownerId = owner.ownerId || owner.id || owner.owner_id;
                      const serialNumber = (currentPage - 1) * listPerPages + index + 1;
                      const ownerName = owner.ownerName || owner.name || owner.owner_name || "N/A";
                      const email = owner.email || "N/A";

                      const assignedVansList = Array.isArray(owner.assignedVans)
                        ? owner.assignedVans
                        : Array.isArray(owner.assigned_vans)
                        ? owner.assigned_vans
                        : Array.isArray(owner.vans)
                        ? owner.vans
                        : [];

                      const vansCount =
                        owner.assignedVansCount ??
                        owner.vansCount ??
                        owner.assigned_vans_count ??
                        owner.vans_count ??
                        assignedVansList.length;

                      const dealers =
                        assignedVansList.length > 0
                          ? [
                              ...new Set(
                                assignedVansList
                                  .map((v) => v.dealer || v.dealerName || v.dealer_name)
                                  .filter(Boolean)
                              ),
                            ].join(", ") || "-"
                          : "-";

                      const dateRegistered = formatDate(
                        owner.dateRegistered || owner.date_registered || owner.createdAt
                      );
                      const isActive = isOwnerActive(owner);
                      const isCurrentlyToggling = togglingId === ownerId;

                      return (
                        <tr key={ownerId || index}>
                          <td>{serialNumber}</td>
                          <td className="ct_fw_600">{ownerName}</td>
                          <td>{email}</td>
                          <td>{vansCount}</td>
                          <td>{dealers}</td>
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
                                onChange={() => handleToggleBlockOwner(owner)}
                              />
                              <div className="toggle-switch-background">
                                <div className="toggle-switch-handle"></div>
                              </div>
                            </label>
                          </td>
                          <td>
                            <Link
                              to={`${pageRoutes.owner_detail}?id=${ownerId}`}
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
            {!isOwnersLoading && ownersList?.length > 0 && (
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
                    Showing {startItem} to {endItem} of {totalItems} owners
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

export default Owners;