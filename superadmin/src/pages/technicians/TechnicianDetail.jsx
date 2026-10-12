import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/Layout";
import Header from "../../layout/Header";
import { pageRoutes } from "../../routes/PageRoutes";
import {
  getTechnicianDetails,
  resetTechnicianDetails,
} from "../../redux/slices/technicianSlice";

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

const TechnicianDetail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const technicianId =
    searchParams.get("id") ||
    searchParams.get("technicianId") ||
    searchParams.get("technician_id");

  const {
    technicianDetails = null,
    isTechnicianDetailsLoading = false,
  } = useSelector((state) => state.technicianReducer || {});

  useEffect(() => {
    if (technicianId) {
      dispatch(getTechnicianDetails({ technicianId }));
    }
    return () => {
      dispatch(resetTechnicianDetails());
    };
  }, [dispatch, technicianId]);

  const technician =
    technicianDetails?.data || technicianDetails || {};

  const fullName = technician.full_name || "N/A";
  const email = technician.email || "N/A";
  const phone = technician.phone_number || "N/A";
  const address = technician.address || "N/A";
  const jobRole = technician.job_role || "N/A";
  const totalTasks = technician.total_assigned_tasks ?? 0;
  const isBlocked = technician.is_block === 1 || technician.is_blocked === 1;
  const isActive = technician.status === 1 && !isBlocked;

  const dealer = technician.dealer || null;

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />

        {/* Sub Header */}
        <div className="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
          <div className="d-flex align-items-center gap-3">
            <Link
              to={pageRoutes.technicians}
              aria-label="Back to Technicians"
              title="Back to Technicians"
              className="ct_back_btn"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </Link>
            <div>
              <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">
                Technician Details
              </h4>
              <p className="mb-0 ct_para_clr">
                View technician information, job role, and dealer details.
              </p>
            </div>
          </div>

          <span
            className={`badge text-uppercase ${
              isBlocked
                ? "bg-danger-subtle text-danger border border-danger-subtle"
                : isActive
                ? "bg-success-subtle text-success border border-success-subtle"
                : "bg-warning-subtle text-warning border border-warning-subtle"
            }`}
            style={{
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              borderRadius: "6px",
              padding: "6px 14px",
            }}
          >
            {isBlocked ? "BLOCKED" : isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        <div className="ct_px_30 mt-4 pb-4">
          <div className="container-fluid">
            {isTechnicianDetailsLoading && !technicianDetails ? (
              <div className="ct_profile_card text-center py-5">
                <div
                  className="spinner-border spinner-border-sm text-success mb-2"
                  role="status"
                ></div>
                <p className="text-muted ct_fs_14 mb-0">Loading technician details...</p>
              </div>
            ) : (
              <>
                {/* Top Profile Card */}
                <div className="ct_profile_card mb-4" style={{ paddingBlock: "28px" }}>
                  <div className="d-flex justify-content-between align-items-center mb-0 flex-wrap gap-4">
                    <div className="d-flex align-items-center gap-4 ct_flex_col_575">
                      <img
                        src={formatFileUrl(technician.profile_image)}
                        className="rounded-circle object-fit-cover shadow-sm"
                        width="85"
                        height="85"
                        alt={fullName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "image.png";
                        }}
                      />
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                          <h4 className="fs-4 ct_fw_600 ct_head_clr mb-0">
                            {fullName}
                          </h4>
                          {technician.job_role && (
                            <span className="badge bg-light text-dark border px-2 py-1 ct_fs_12">
                              {technician.job_role}
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
                          {email}
                        </p>

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
                              d="M6.52146 13.4756C4.7293 11.68 3.35106 9.51448 2.48313 7.13061C2.00563 5.82727 2.44313 4.39561 3.42479 3.41394L4.03229 2.80727C4.19562 2.64362 4.38961 2.51379 4.60317 2.4252C4.81673 2.33661 5.04567 2.29102 5.27688 2.29102C5.50808 2.29102 5.73702 2.33661 5.95058 2.4252C6.16414 2.51379 6.35814 2.64362 6.52146 2.80727L7.94396 4.22977C8.10761 4.3931 8.23745 4.58709 8.32603 4.80065C8.41462 5.01422 8.46022 5.24315 8.46022 5.47436C8.46022 5.70556 8.41462 5.9345 8.32603 6.14806C8.23745 6.36162 8.10761 6.55562 7.94396 6.71894L7.59396 7.06894C7.45386 7.20901 7.34273 7.3753 7.26691 7.55832C7.19109 7.74134 7.15207 7.9375 7.15207 8.13561C7.15207 8.33371 7.19109 8.52988 7.26691 8.7129C7.34273 8.89592 7.45386 9.06221 7.59396 9.20227L10.794 12.4031C10.934 12.5432 11.1003 12.6543 11.2833 12.7302C11.4664 12.806 11.6625 12.845 11.8606 12.845C12.0587 12.845 12.2549 12.806 12.4379 12.7302C12.6209 12.6543 12.7872 12.5432 12.9273 12.4031L13.2781 12.0531C13.4414 11.8895 13.6354 11.7596 13.849 11.671C14.0626 11.5824 14.2915 11.5368 14.5227 11.5368C14.7539 11.5368 14.9829 11.5824 15.1964 11.671C15.41 11.7596 15.604 11.8895 15.7673 12.0531L17.1898 13.4756C17.3534 13.6389 17.4833 13.8329 17.5719 14.0465C17.6605 14.26 17.7061 14.489 17.7061 14.7202C17.7061 14.9514 17.6605 15.1803 17.5719 15.3939C17.4833 15.6075 17.3534 15.8015 17.1898 15.9648L16.5831 16.5714C15.6015 17.5539 14.1698 17.9914 12.8665 17.5139C10.4826 16.646 8.3171 15.2678 6.52146 13.4756Z"
                              stroke="#475569"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {phone}
                        </p>

                        {technician.address && (
                          <p className="ct_para_clr ct_fs_14 mb-0 d-flex align-items-center">
                            <i className="fa-solid fa-location-dot me-2 text-muted" style={{ width: "18px" }}></i>
                            {address}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-sm-end">
                      <span className="text-muted ct_fs_13 d-block">Registered On</span>
                      <span className="ct_fw_600 ct_fs_14">
                        {formatDate(technician.created_at || technician.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* General Info Card */}
                  <div className="col-lg-7">
                    <div className="ct_profile_card h-100">
                      <h5 className="ct_fw_600 ct_head_clr mb-3 pb-2 border-bottom">
                        General Information
                      </h5>

                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label className="text-muted ct_fs_13 d-block mb-1">Full Name</label>
                          <span className="ct_fw_600 ct_fs_14 text-dark">{fullName}</span>
                        </div>
                        <div className="col-sm-6">
                          <label className="text-muted ct_fs_13 d-block mb-1">Email Address</label>
                          <span className="ct_fw_600 ct_fs_14 text-dark">{email}</span>
                        </div>
                        <div className="col-sm-6">
                          <label className="text-muted ct_fs_13 d-block mb-1">Phone Number</label>
                          <span className="ct_fw_600 ct_fs_14 text-dark">{phone}</span>
                        </div>
                        <div className="col-sm-6">
                          <label className="text-muted ct_fs_13 d-block mb-1">Job Role</label>
                          <span className="ct_fw_600 ct_fs_14 text-dark">{jobRole}</span>
                        </div>
                        <div className="col-sm-6">
                          <label className="text-muted ct_fs_13 d-block mb-1">Address</label>
                          <span className="ct_fw_600 ct_fs_14 text-dark">{address}</span>
                        </div>
                        <div className="col-sm-6">
                          <label className="text-muted ct_fs_13 d-block mb-1">Total Assigned Tasks</label>
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 ct_fs_13">
                            {totalTasks} Tasks
                          </span>
                        </div>
                        <div className="col-sm-6">
                          <label className="text-muted ct_fs_13 d-block mb-1">Date Registered</label>
                          <span className="ct_fw_600 ct_fs_14 text-dark">
                            {formatDate(technician.created_at || technician.createdAt)}
                          </span>
                        </div>
                        <div className="col-sm-6">
                          <label className="text-muted ct_fs_13 d-block mb-1">Last Updated</label>
                          <span className="ct_fw_600 ct_fs_14 text-dark">
                            {formatDate(technician.updated_at || technician.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dealer Info Card */}
                  <div className="col-lg-5">
                    <div className="ct_profile_card h-100">
                      <h5 className="ct_fw_600 ct_head_clr mb-3 pb-2 border-bottom">
                        Associated Dealership
                      </h5>

                      {dealer ? (
                        <div>
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <img
                              src={formatFileUrl(dealer.profile_image)}
                              alt={dealer.dealer_name || "Dealer"}
                              className="rounded-circle object-fit-cover shadow-sm flex-shrink-0"
                              width="50"
                              height="50"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "image.png";
                              }}
                            />
                            <div>
                              <h6 className="ct_fw_600 mb-1 ct_head_clr">
                                {dealer.dealer_name || "N/A"}
                              </h6>
                              {dealer.status && (
                                <span className="badge bg-success-subtle text-success border border-success-subtle ct_fs_11 px-2 py-0">
                                  {dealer.status}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mb-2">
                            <label className="text-muted ct_fs_12 d-block mb-0">Email</label>
                            <span className="ct_fs_14 ct_fw_600">{dealer.email || "N/A"}</span>
                          </div>

                          <div className="mb-3">
                            <label className="text-muted ct_fs_12 d-block mb-0">Phone</label>
                            <span className="ct_fs_14 ct_fw_600">{dealer.phone_number || "N/A"}</span>
                          </div>

                          {dealer.id && (
                            <Link
                              to={`${pageRoutes.dealerDetail}?id=${dealer.id}`}
                              className="btn btn-outline-success btn-sm w-100"
                            >
                              <i className="fa-regular fa-eye me-1"></i> View Dealer Profile
                            </Link>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted ct_fs_14 mb-0">
                          No dealership assigned to this technician.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TechnicianDetail;
