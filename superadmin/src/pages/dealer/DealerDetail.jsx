import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/Layout";
import { pageRoutes } from "../../routes/PageRoutes";
import Header from "../../layout/Header";
import PaginationDropdown from "../../components/table/PaginationDropdown";
import Pagination from "../../components/table/Pagination";
import {
  getDealerDetails,
  toggleBlockDealer,
} from "../../redux/slices/dealerSlice";

const DealerDetail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const modalCloseRef = useRef(null);

  const dealerId =
    searchParams.get("id") ||
    searchParams.get("dealerId") ||
    searchParams.get("dealer_id");

  const {
    dealerDetails = null,
    assignedVans = [],
    assignedVansMeta = {},
    isDealerDetailsLoading = false,
    isToggleBlockLoading = false,
  } = useSelector((state) => state.dealerReducer || {});

  const [listPerPages, setListPerPages] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch dealer details on mount and when page / limit changes
  useEffect(() => {
    if (dealerId) {
      dispatch(
        getDealerDetails({
          dealerId,
          page: currentPage,
          limit: listPerPages,
        })
      );
    }
  }, [dispatch, dealerId, currentPage, listPerPages]);

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

  const isBlocked =
    dealerDetails?.status?.toUpperCase() === "BLOCKED" ||
    dealerDetails?.status?.toUpperCase() === "INACTIVE";

  const handleToggleBlock = () => {
    if (!dealerId) return;
    dispatch(
      toggleBlockDealer({
        dealerId,
        callback: (res) => {
          if (res?.success) {
            modalCloseRef.current?.click();
            dispatch(
              getDealerDetails({
                dealerId,
                page: currentPage,
                limit: listPerPages,
              })
            );
          }
        },
      })
    );
  };

  const dealerName =
    dealerDetails?.dealerName ||
    dealerDetails?.name ||
    dealerDetails?.dealer_name ||
    (dealerDetails?.email ? dealerDetails.email.split("@")[0] : "Dealer");

  const totalPages =
    assignedVansMeta?.totalPages ||
    Math.ceil((assignedVansMeta?.totalItems || assignedVans.length) / listPerPages) ||
    1;

  const totalItems = assignedVansMeta?.totalItems ?? assignedVans.length;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * listPerPages + 1;
  const endItem = Math.min(currentPage * listPerPages, totalItems);

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />
        <div className="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-start gap-2">
          <Link to={pageRoutes.dealers} aria-label="Back to Dealers">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25 30L15 20L25 10"
                stroke="#1E293B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div>
            <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Dealer Details</h4>
            <p className="mb-0 ct_para_clr">
              View and manage dealer information, vans, owners, and activities.
            </p>
          </div>
        </div>

        <div className="ct_px_30 mt-4 pb-4">
          <div className="container-fluid">
            {/* Top Profile Card */}
            <div className="ct_profile_card mb-4" style={{ paddingBlock: "28px" }}>
              {isDealerDetailsLoading && !dealerDetails ? (
                <div className="d-flex align-items-center justify-content-center py-4 gap-2">
                  <div
                    className="spinner-border spinner-border-sm text-success"
                    role="status"
                  ></div>
                  <span className="text-muted ct_fs_14">Loading dealer details...</span>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center mb-0 flex-wrap gap-4">
                  <div className="d-flex align-items-center gap-4 ct_flex_col_575">
                    <img
                      src={
                        dealerDetails?.profile_image ||
                        dealerDetails?.profileImage ||
                        "image.png"
                      }
                      className="rounded-circle object-fit-cover shadow-sm"
                      width="85"
                      height="85"
                      alt={dealerName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "image.png";
                      }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <h4 className="fs-4 ct_fw_600 ct_head_clr mb-0">
                          {dealerName}
                        </h4>
                        {dealerDetails?.status && (
                          <span
                            className={`badge text-uppercase ${
                              dealerDetails.status.toUpperCase() === "ACTIVE"
                                ? "bg-success-subtle text-success border border-success-subtle"
                                : "bg-danger-subtle text-danger border border-danger-subtle"
                            }`}
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              letterSpacing: "0.5px",
                              borderRadius: "6px",
                              padding: "4px 10px",
                            }}
                          >
                            {dealerDetails.status}
                          </span>
                        )}
                      </div>

                      <p className="ct_para_clr ct_fs_14 mb-1 d-flex align-items-center">
                        <svg
                          width="18"
                          height="18"
                          className="me-2 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.96484 6.42833L7.78151 10.3067C8.58401 10.8408 8.98484 11.1083 9.41818 11.2125C9.80151 11.3042 10.2007 11.3042 10.5832 11.2125C11.0165 11.1083 11.4173 10.8408 12.2198 10.3067L18.0365 6.42833M5.96484 16.25H14.0365C15.4365 16.25 16.1365 16.25 16.6715 15.9775C17.1416 15.7377 17.5237 15.3553 17.7632 14.885C18.0365 14.35 18.0365 13.65 18.0365 12.25V7.75C18.0365 6.35 18.0365 5.65 17.764 5.115C17.5243 4.64462 17.1419 4.26218 16.6715 4.0225C16.1365 3.75 15.4365 3.75 14.0365 3.75H5.96484C4.56484 3.75 3.86484 3.75 3.32984 4.0225C2.85977 4.26232 2.47764 4.64474 2.23818 5.115C1.96484 5.65 1.96484 6.35 1.96484 7.75V12.25C1.96484 13.65 1.96484 14.35 2.23734 14.885C2.47702 15.3554 2.85946 15.7378 3.32984 15.9775C3.86484 16.25 4.56484 16.25 5.96484 16.25Z"
                            stroke="#475569"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {dealerDetails?.email || "N/A"}
                      </p>

                      <p className="ct_para_clr ct_fs_14 mb-0 d-flex align-items-center">
                        <svg
                          width="18"
                          height="18"
                          className="me-2 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.52146 13.4756C4.7293 11.68 3.35106 9.51448 2.48313 7.13061C2.00563 5.82727 2.44313 4.39561 3.42479 3.41394L4.03229 2.80727C4.19562 2.64362 4.38961 2.51379 4.60317 2.4252C4.81673 2.33661 5.04567 2.29102 5.27688 2.29102C5.50808 2.29102 5.73702 2.33661 5.95058 2.4252C6.16414 2.51379 6.35814 2.64362 6.52146 2.80727L7.94396 4.22977C8.10761 4.3931 8.23745 4.58709 8.32603 4.80065C8.41462 5.01422 8.46022 5.24315 8.46022 5.47436C8.46022 5.70556 8.41462 5.9345 8.32603 6.14806C8.23745 6.36162 8.10761 6.55562 7.94396 6.71894L7.59396 7.06894C7.45386 7.20901 7.34273 7.3753 7.26691 7.55832C7.19109 7.74134 7.15207 7.9375 7.15207 8.13561C7.15207 8.33371 7.19109 8.52988 7.26691 8.7129C7.34273 8.89592 7.45386 9.06221 7.59396 9.20227L10.794 12.4031C10.934 12.5432 11.1003 12.6543 11.2833 12.7302C11.4664 12.806 11.6625 12.845 11.8606 12.845C12.0587 12.845 12.2549 12.806 12.4379 12.7302C12.6209 12.6543 12.7872 12.5432 12.9273 12.4031L13.2781 12.0531C13.4414 11.8895 13.6354 11.7596 13.849 11.671C14.0626 11.5824 14.2915 11.5368 14.5227 11.5368C14.7539 11.5368 14.9829 11.5824 15.1964 11.671C15.41 11.7596 15.604 11.8895 15.7673 12.0531L17.1898 13.4756C17.3534 13.6389 17.4833 13.8329 17.5719 14.0465C17.6605 14.26 17.7061 14.489 17.7061 14.7202C17.7061 14.9514 17.6605 15.1803 17.5719 15.3939C17.4833 15.6075 17.3534 15.8015 17.1898 15.9648L16.5831 16.5714C15.6015 17.5539 14.1698 17.9914 12.8665 17.5139C10.4826 16.646 8.3171 15.2678 6.52146 13.4756Z"
                            stroke="#475569"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {dealerDetails?.phoneNumber ||
                          dealerDetails?.phone_number ||
                          dealerDetails?.phone ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="btn text-nowrap d-inline-flex align-items-center gap-2 shadow-none"
                      data-bs-target="#blockDealerModal"
                      data-bs-toggle="modal"
                      style={{
                        padding: "8px 18px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        backgroundColor: isBlocked ? "#F0FDF4" : "#FEF2F2",
                        color: isBlocked ? "#16A34A" : "#EF4444",
                        border: `1px solid ${isBlocked ? "#BBF7D0" : "#FECACA"}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isBlocked
                          ? "#DCFCE7"
                          : "#FEE2E2";
                        e.currentTarget.style.borderColor = isBlocked
                          ? "#86EFAC"
                          : "#FCA5A5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isBlocked
                          ? "#F0FDF4"
                          : "#FEF2F2";
                        e.currentTarget.style.borderColor = isBlocked
                          ? "#BBF7D0"
                          : "#FECACA";
                      }}
                    >
                      {isBlocked ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 1.33325C4.31811 1.33325 1.33334 4.31802 1.33334 7.99992C1.33334 11.6818 4.31811 14.6666 8 14.6666C11.6819 14.6666 14.6667 11.6818 14.6667 7.99992C14.6667 4.31802 11.6819 1.33325 8 1.33325ZM11.1893 6.4714L7.43934 10.2214C7.29871 10.3621 7.10797 10.4411 6.90909 10.4411C6.71021 10.4411 6.51947 10.3621 6.37884 10.2214L4.81067 8.65325C4.51778 8.36036 4.51778 7.88549 4.81067 7.5926C5.10357 7.29971 5.57843 7.29971 5.87133 7.5926L6.90909 8.63036L10.1287 5.41074C10.4216 5.11785 10.8964 5.11785 11.1893 5.41074C11.4822 5.70364 11.4822 6.17851 11.1893 6.4714Z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.40261 14.1419C4.59149 13.7917 3.88594 13.3166 3.28594 12.7166C2.68594 12.1166 2.21105 11.411 1.86127 10.5999C1.51149 9.78881 1.33638 8.92214 1.33594 7.99992C1.33549 7.0777 1.51061 6.21103 1.86127 5.39992C2.21194 4.58881 2.68683 3.88325 3.28594 3.28325C3.88505 2.68325 4.59061 2.20836 5.40261 1.85859C6.21461 1.50881 7.08127 1.3337 8.0026 1.33325C8.92394 1.33281 9.7906 1.50792 10.6026 1.85859C11.4146 2.20925 12.1202 2.68414 12.7193 3.28325C13.3184 3.88236 13.7935 4.58792 14.1446 5.39992C14.4957 6.21192 14.6706 7.07859 14.6693 7.99992C14.6679 8.92125 14.4928 9.78792 14.1439 10.5999C13.795 11.4119 13.3202 12.1175 12.7193 12.7166C12.1184 13.3157 11.4128 13.7908 10.6026 14.1419C9.79238 14.493 8.92572 14.6679 8.0026 14.6666C7.07949 14.6653 6.21283 14.4908 5.40261 14.1419ZM8.0026 13.3333C8.6026 13.3333 9.18038 13.2361 9.73594 13.0419C10.2915 12.8477 10.8026 12.567 11.2693 12.1999L3.8026 4.73325C3.43594 5.19992 3.15527 5.71103 2.9606 6.26659C2.76594 6.82214 2.66883 7.39992 2.66927 7.99992C2.66927 9.48881 3.18594 10.7499 4.21927 11.7833C5.2526 12.8166 6.51372 13.3333 8.0026 13.3333ZM12.2026 11.2666C12.5693 10.7999 12.8499 10.2888 13.0446 9.73325C13.2393 9.1777 13.3364 8.59992 13.3359 7.99992C13.3359 6.51103 12.8193 5.24992 11.7859 4.21659C10.7526 3.18325 9.49149 2.66659 8.0026 2.66659C7.4026 2.66659 6.82483 2.7637 6.26927 2.95792C5.71372 3.15214 5.2026 3.43281 4.73594 3.79992L12.2026 11.2666Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                      <span>{isBlocked ? "Unblock" : "Block"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Heading */}
            <div className="d-flex justify-content-between align-items-end mb-3">
              <div>
                <h5 className="ct_fw_600 ct_head_clr mb-1">Assigned Vans</h5>
                <p className="ct_para_clr ct_fs_12 mb-0">
                  View all vans registered under this dealership.
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="ct_table_wrapper p-0">
              <div className="table-responsive">
                <table className="table ct_custom_table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Van Name</th>
                      <th>Registration Number</th>
                      <th>Owner Name</th>
                      <th>Date Registered</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isDealerDetailsLoading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <div
                              className="spinner-border spinner-border-sm text-success"
                              role="status"
                            ></div>
                            <span className="text-muted ct_fs_14">
                              Loading assigned vans...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : assignedVans?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted ct_fs_14">
                          No assigned vans found for this dealer.
                        </td>
                      </tr>
                    ) : (
                      assignedVans.map((van, index) => {
                        const vanId = van.vanId || van.id || van.van_id;
                        const serialNumber = (currentPage - 1) * listPerPages + index + 1;
                        const vanName = van.vanName || van.van_name || "N/A";
                        const registrationNumber =
                          van.registrationNumber || van.registration_number || "N/A";
                        const ownerName = van.ownerName || van.owner_name || "N/A";
                        const dateRegistered = formatDate(
                          van.dateRegistered || van.date_registered || van.createdAt
                        );

                        return (
                          <tr key={vanId || index}>
                            <td>{serialNumber}</td>
                            <td className="ct_fw_600">{vanName}</td>
                            <td>{registrationNumber}</td>
                            <td>{ownerName}</td>
                            <td>{dateRegistered}</td>
                            <td>
                              <Link
                                to={`${pageRoutes.van_detail}?id=${vanId}`}
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
            </div>

            {/* Pagination footer */}
            {!isDealerDetailsLoading && assignedVans?.length > 0 && (
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
                    Showing {startItem} to {endItem} of {totalItems} vans
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

      {/* Block / Unblock Dealer Modal */}
      <div className="modal fade" id="blockDealerModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content ct_modal">
            <div className="modal-body p-4 position-relative">
              {/* Close */}
              <button
                type="button"
                ref={modalCloseRef}
                className="btn-close ct_delete_close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              {/* Heading */}
              <h3 className="ct_head_clr ct_fw_600 mb-3">
                {isBlocked ? "Unblock Dealer?" : "Block Dealer?"}
              </h3>

              {/* Description */}
              <p className="ct_para_clr ct_fs_18 mb-5">
                {isBlocked
                  ? "Are you sure you want to unblock this dealer? They will regain access to the platform."
                  : "Are you sure you want to block this dealer? They will lose access to the platform."}
              </p>

              {/* Buttons */}
              <div className="d-flex gap-3">
                <button
                  type="button"
                  className="btn ct_btn_gray ct_btn_h_50 w-100"
                  data-bs-dismiss="modal"
                  disabled={isToggleBlockLoading}
                >
                  No, Cancel
                </button>

                <button
                  type="button"
                  className={`btn ct_btn_h_50 w-100 ${
                    isBlocked ? "ct_green_btn" : ""
                  }`}
                  style={
                    !isBlocked
                      ? {
                          backgroundColor: "#EF4444",
                          borderColor: "#EF4444",
                          color: "#fff",
                          borderRadius: "10px",
                          fontWeight: "600",
                        }
                      : {
                          borderRadius: "10px",
                          fontWeight: "600",
                        }
                  }
                  onClick={handleToggleBlock}
                  disabled={isToggleBlockLoading}
                >
                  {isToggleBlockLoading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div
                        className="spinner-border spinner-border-sm text-white"
                        role="status"
                      ></div>
                      <span>Processing...</span>
                    </div>
                  ) : isBlocked ? (
                    "Yes, Unblock"
                  ) : (
                    "Yes, Block"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DealerDetail;