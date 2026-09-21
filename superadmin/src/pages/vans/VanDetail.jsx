import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/Layout";
import Header from "../../layout/Header";
import { pageRoutes } from "../../routes/PageRoutes";
import { getVanDetails, resetVanDetails } from "../../redux/slices/vanSlice";

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

const formatDocType = (docType) => {
  if (!docType) return "Document";
  return docType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatFileUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace("/api", "");
  return `${baseUrl}/${url.startsWith("/") ? url.slice(1) : url}`;
};

const VanDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vanId =
    searchParams.get("id") ||
    searchParams.get("vanId") ||
    searchParams.get("van_id");

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    vanDetails = null,
    isVanDetailsLoading = false,
    vanDetailsError = null,
  } = useSelector((state) => state.vanReducer || {});

  useEffect(() => {
    if (vanId) {
      dispatch(getVanDetails({ vanId }));
    }
    return () => {
      dispatch(resetVanDetails());
    };
  }, [dispatch, vanId]);

  // Extract structured data from response
  const data = vanDetails?.data || vanDetails || {};
  const vehicle = data?.vehicle_information || data?.vehicle || data?.van || {};
  const owner = data?.owner_details || data?.owner || {};
  const dealer = data?.dealer_details || data?.dealer || {};
  const installedComponents = Array.isArray(data?.installed_components)
    ? data.installed_components
    : Array.isArray(data?.components)
    ? data.components
    : [];
  const warranty = data?.warranty_details || data?.warranty || {};
  const documents = Array.isArray(data?.documents) ? data.documents : [];
  const maintenance = data?.maintenance_setup || data?.maintenance || {};

  const images = Array.isArray(vehicle?.images)
    ? vehicle.images
    : Array.isArray(data?.images)
    ? data.images
    : [];

  const mainImageUrl = images.length > 0 ? images[activeImageIndex] || images[0] : null;

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />

        {/* Sub Header */}
        <div className="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn p-0 border-0 bg-transparent text-decoration-none shadow-none d-inline-flex align-items-center"
              style={{ cursor: "pointer" }}
              aria-label="Go Back"
            >
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
            </button>
            <div>
              <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">
                {vehicle?.van_name ? `${vehicle.van_name} Details` : "Van Details"}
              </h4>
              <p className="mb-0 ct_para_clr">
                View and manage the complete digital profile of the assigned van.
              </p>
            </div>
          </div>

          {vehicle?.status && (
            <span
              className={`badge px-3 py-2 rounded-pill ct_fs_13 ct_fw_600 ${
                vehicle.status === "COMPLETED" || vehicle.status === "ACTIVE"
                  ? "bg-success text-white"
                  : "bg-warning text-dark"
              }`}
            >
              {vehicle.status}
            </span>
          )}
        </div>

        <div className="ct_px_30 mt-4 pb-4">
          {isVanDetailsLoading ? (
            <div className="ct_profile_card text-center py-5">
              <div
                className="spinner-border spinner-border-lg text-success mb-3"
                role="status"
              ></div>
              <p className="text-muted ct_fs_15 mb-0">Loading van details...</p>
            </div>
          ) : !vanId ? (
            <div className="ct_profile_card text-center py-5">
              <i className="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3"></i>
              <h5 className="ct_head_clr ct_fs_18 ct_fw_600">No Van Selected</h5>
              <p className="ct_para_clr ct_fs_14 mb-4">
                Please select a van from the list to view details.
              </p>
              <div className="d-flex justify-content-center">
                <Link
                  to={pageRoutes.vans}
                  className="ct_green_btn ct_btn_h_42 text-decoration-none d-inline-flex align-items-center justify-content-center px-4"
                >
                  Back to Vans
                </Link>
              </div>
            </div>
          ) : vanDetailsError && !vanDetails ? (
            <div className="ct_profile_card text-center py-5">
              <i className="fa-solid fa-circle-xmark text-danger fs-1 mb-3"></i>
              <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Failed to Load Van Details</h5>
              <p className="ct_para_clr ct_fs_14 mb-4">
                {typeof vanDetailsError === "string"
                  ? vanDetailsError
                  : "An error occurred while fetching van details."}
              </p>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="ct_green_btn ct_btn_h_42 border-0 px-4 d-inline-flex align-items-center justify-content-center"
                  onClick={() => dispatch(getVanDetails({ vanId }))}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 1. Vehicle Information Section */}
              <section className="ct_profile_card">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="ct_van_det_icon_box">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.25 3.75L7.84625 6.1625C7.89653 6.36586 8.01346 6.54652 8.1784 6.67566C8.34333 6.8048 8.54677 6.87498 8.75625 6.875H12.25"
                        stroke="#3D8B37"
                        strokeWidth="0.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 3.75H7.91812C8.88625 3.75 9.37 3.75 9.78062 3.96625C10.1906 4.1825 10.4644 4.58187 11.0119 5.38C11.395 5.94 11.7981 6.34625 12.3644 6.70812C12.9344 7.07187 13.2056 7.25 13.3556 7.53563C13.5 7.80875 13.5 8.1325 13.5 8.78062C13.5 9.635 13.5 10.0619 13.2419 10.3331L13.2081 10.3669C12.9375 10.625 12.51 10.625 11.6562 10.625M2.875 10.625C2.675 10.625 2.49062 10.625 2.39375 10.6044C2.29625 10.5831 2.205 10.5419 2.02187 10.46L1 10C1 8.00375 1.29937 6.85125 1.69125 5.90625C1.9475 5.28625 2.07625 4.97625 2.0225 4.7C1.97062 4.425 1.3125 3.75 1.3125 3.75M5.375 10.625H9.125"
                        stroke="#3D8B37"
                        strokeWidth="0.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.375 11.875C11.0654 11.875 11.625 11.3154 11.625 10.625C11.625 9.93464 11.0654 9.375 10.375 9.375C9.68464 9.375 9.125 9.93464 9.125 10.625C9.125 11.3154 9.68464 11.875 10.375 11.875Z"
                        stroke="#3D8B37"
                        strokeWidth="0.7"
                      />
                      <path
                        d="M4.125 11.875C4.81536 11.875 5.375 11.3154 5.375 10.625C5.375 9.93464 4.81536 9.375 4.125 9.375C3.43464 9.375 2.875 9.93464 2.875 10.625C2.875 11.3154 3.43464 11.875 4.125 11.875Z"
                        stroke="#3D8B37"
                        strokeWidth="0.7"
                      />
                    </svg>
                  </div>
                  <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">
                    Vehicle Information
                  </h5>
                </div>

                <div className="row">
                  {/* Main Image */}
                  <div className="col-xl-3 col-md-4 mb-3 mb-md-0">
                    {mainImageUrl ? (
                      <img
                        src={formatFileUrl(mainImageUrl)}
                        className="img-fluid ct_vehicle_img rounded-3 mb-2"
                        alt={vehicle?.van_name || "Vehicle"}
                        style={{
                          width: "100%",
                          height: "170px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(formatFileUrl(mainImageUrl), "_blank")}
                        title="Click to open image"
                      />
                    ) : (
                      <div
                        className="bg-light rounded-3 d-flex flex-column align-items-center justify-content-center text-muted border"
                        style={{ height: "170px" }}
                      >
                        <i className="fa-solid fa-van-shuttle fs-2 mb-1"></i>
                        <span className="ct_fs_12">No Image Available</span>
                      </div>
                    )}

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                      <div className="d-flex gap-2 flex-wrap mt-2">
                        {images.map((img, idx) => (
                          <img
                            key={idx}
                            src={formatFileUrl(img)}
                            className={`ct_vehicle_thumb rounded ${
                              activeImageIndex === idx ? "border border-2 border-success" : ""
                            }`}
                            alt={`Thumbnail ${idx + 1}`}
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={() => setActiveImageIndex(idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="col-xl-9 col-md-8">
                    <div className="row gy-3">
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          Van Name
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_600">
                          {vehicle?.van_name || "N/A"}
                        </h6>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          Make
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                          {vehicle?.make || "N/A"}
                        </h6>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          Model
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                          {vehicle?.model || "N/A"}
                        </h6>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          VIN
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                          {vehicle?.vin || "N/A"}
                        </h6>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          Registration
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                          {vehicle?.registration || vehicle?.registration_number || "N/A"}
                        </h6>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          Engine
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                          {vehicle?.engine || "N/A"}
                        </h6>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          Year
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                          {vehicle?.year || "N/A"}
                        </h6>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          Chassis Number
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                          {vehicle?.chassis_number || "N/A"}
                        </h6>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          Colour
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                          {vehicle?.colour || vehicle?.color || "N/A"}
                        </h6>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                          Created On
                        </h5>
                        <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                          {formatDate(vehicle?.created_at)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Owner Details Section */}
              <section className="ct_profile_card ct_mt_30">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="ct_van_det_icon_box">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.375 6.875C8.68464 6.875 8.125 6.31536 8.125 5.625C8.125 4.93464 8.68464 4.375 9.375 4.375C10.0654 4.375 10.625 4.93464 10.625 5.625C10.625 6.31536 10.0654 6.875 9.375 6.875Z"
                        stroke="#3D8B37"
                        strokeWidth="0.7"
                      />
                      <path
                        d="M6.875 9.375C6.875 10.0656 6.875 10.625 9.375 10.625C11.875 10.625 11.875 10.0656 11.875 9.375C11.875 8.68437 10.7563 8.125 9.375 8.125C7.99375 8.125 6.875 8.68437 6.875 9.375Z"
                        stroke="#3D8B37"
                        strokeWidth="0.7"
                      />
                      <path
                        d="M1.25 7.5C1.25 9.85687 1.25 11.0356 1.9825 11.7675C2.715 12.4994 3.89312 12.5 6.25 12.5H8.75C11.1069 12.5 12.2856 12.5 13.0175 11.7675C13.7494 11.035 13.75 9.85687 13.75 7.5C13.75 5.14313 13.75 3.96437 13.0175 3.2325C12.285 2.50062 11.1069 2.5 8.75 2.5H6.25C3.89312 2.5 2.71437 2.5 1.9825 3.2325C1.68875 3.52625 1.51312 3.89125 1.4075 4.375M3.125 7.5H5.625M3.125 5.625H6.25M3.125 9.375H5"
                        stroke="#3D8B37"
                        strokeWidth="0.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">
                    Owner Details
                  </h5>
                </div>

                <div className="row gy-3">
                  <div className="col-md-4 col-sm-6">
                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                      Full Name
                    </h6>
                    <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">
                      {owner?.full_name || owner?.name || "N/A"}
                    </h5>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                      Email Address
                    </h6>
                    <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">
                      {owner?.email || "N/A"}
                    </h5>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                      Phone Number
                    </h6>
                    <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">
                      {owner?.phone || owner?.phone_number || "N/A"}
                    </h5>
                  </div>
                </div>
              </section>

              {/* 3. Dealer Details Section */}
              <section className="ct_profile_card ct_mt_30">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="ct_van_det_icon_box">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.5 13.125H12.5M3.75 13.125V3.75C3.75 3.41848 3.8817 3.10054 4.11612 2.86612C4.35054 2.6317 4.66848 2.5 5 2.5H10C10.3315 2.5 10.6495 2.6317 10.8839 2.86612C11.1183 3.10054 11.25 3.41848 11.25 3.75V13.125M6.25 5.625H8.75M6.25 8.125H8.75M6.25 10.625H8.75"
                        stroke="#3D8B37"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">
                    Dealer Details
                  </h5>
                </div>

                <div className="row gy-3">
                  <div className="col-md-4 col-sm-6">
                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                      Dealer Name
                    </h6>
                    <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">
                      {dealer?.full_name || dealer?.dealer_name || dealer?.name || "N/A"}
                    </h5>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                      Email Address
                    </h6>
                    <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">
                      {dealer?.email || "N/A"}
                    </h5>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                      Phone Number
                    </h6>
                    <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">
                      {dealer?.phone || dealer?.phone_number || "N/A"}
                    </h5>
                  </div>
                </div>
              </section>

              {/* 4. Installed Components Section */}
              <section className="ct_profile_card ct_mt_30">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="ct_van_det_icon_box">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.36364 15V12.1364C0.965909 12 0.639205 11.7585 0.383523 11.4119C0.127841 11.0653 0 10.6705 0 10.2273V3.40909H1.36364V0.681818C1.36364 0.488636 1.42898 0.326705 1.55966 0.196023C1.69034 0.0653409 1.85227 0 2.04545 0C2.23864 0 2.40057 0.0653409 2.53125 0.196023C2.66193 0.326705 2.72727 0.488636 2.72727 0.681818V3.40909H4.09091V10.2273C4.09091 10.6705 3.96307 11.0653 3.70739 11.4119C3.4517 11.7585 3.125 12 2.72727 12.1364V15H1.36364ZM6.81818 15V12.1364C6.42045 12 6.09375 11.7585 5.83807 11.4119C5.58239 11.0653 5.45455 10.6705 5.45455 10.2273V3.40909H6.81818V0.681818C6.81818 0.488636 6.88352 0.326705 7.0142 0.196023C7.14489 0.0653409 7.30682 0 7.5 0C7.69318 0 7.85511 0.0653409 7.9858 0.196023C8.11648 0.326705 8.18182 0.488636 8.18182 0.681818V3.40909H9.54545V10.2273C9.54545 10.6705 9.41761 11.0653 9.16193 11.4119C8.90625 11.7585 8.57955 12 8.18182 12.1364V15H6.81818ZM12.2727 15V12.1364C11.875 12 11.5483 11.7585 11.2926 11.4119C11.0369 11.0653 10.9091 10.6705 10.9091 10.2273V3.40909H12.2727V0.681818C12.2727 0.488636 12.3381 0.326705 12.4688 0.196023C12.5994 0.0653409 12.7614 0 12.9545 0C13.1477 0 13.3097 0.0653409 13.4403 0.196023C13.571 0.326705 13.6364 0.488636 13.6364 0.681818V3.40909H15V10.2273C15 10.6705 14.8722 11.0653 14.6165 11.4119C14.3608 11.7585 14.0341 12 13.6364 12.1364V15H12.2727Z"
                        fill="#3D8B37"
                      />
                    </svg>
                  </div>
                  <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">
                    Installed Components ({installedComponents.length})
                  </h5>
                </div>

                {installedComponents.length === 0 ? (
                  <p className="text-muted ct_fs_14 mb-0">No components installed.</p>
                ) : (
                  <div className="row gy-3">
                    {installedComponents.map((comp, idx) => {
                      const compName =
                        comp.component_name || comp.component_type_name || "Component";
                      const file =
                        Array.isArray(comp.files) && comp.files.length > 0
                          ? comp.files[0]
                          : null;

                      return (
                        <div className="col-lg-6" key={comp.id || idx}>
                          <div className="p-3 border rounded-3 bg-light h-100">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <h6 className="ct_fs_15 ct_fw_600 ct_black_text mb-0">
                                {compName}
                              </h6>
                              {comp.warranty_period_months && (
                                <span className="badge bg-success-subtle text-success ct_fs_12 px-2 py-1">
                                  {comp.warranty_period_months} Months Warranty
                                </span>
                              )}
                            </div>

                            <div className="row gy-2 ct_fs_13 mt-1">
                              <div className="col-sm-6">
                                <span className="text-muted d-block ct_fs_12">Manufacturer:</span>
                                <span className="ct_fw_500 ct_head_clr">
                                  {comp.manufacturer || "N/A"}
                                </span>
                              </div>
                              <div className="col-sm-6">
                                <span className="text-muted d-block ct_fs_12">Installed On:</span>
                                <span className="ct_fw_500 ct_head_clr">
                                  {formatDate(comp.installation_date)}
                                </span>
                              </div>
                              <div className="col-sm-6">
                                <span className="text-muted d-block ct_fs_12">Replacement Schedule:</span>
                                <span className="ct_fw_500 ct_head_clr">
                                  {formatDate(comp.replacement_schedule)}
                                </span>
                              </div>
                              {comp.maintenance_notes && (
                                <div className="col-12">
                                  <span className="text-muted d-block ct_fs_12">Notes:</span>
                                  <span className="ct_para_clr">{comp.maintenance_notes}</span>
                                </div>
                              )}
                              {file?.file_url && (
                                <div className="col-12 mt-2">
                                  <a
                                    href={formatFileUrl(file.file_url)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="d-inline-flex align-items-center gap-2 text-decoration-none ct_fs_13 ct_green_text ct_fw_500"
                                  >
                                    <i className="fa-solid fa-file-arrow-down"></i>
                                    <span>{file.file_name || "View Component Document"}</span>
                                    {file.file_size_kb && (
                                      <span className="text-muted ct_fs_12">
                                        ({file.file_size_kb} KB)
                                      </span>
                                    )}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* 5. Warranty Details Section */}
              <section className="ct_profile_card ct_mt_30">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="ct_van_det_icon_box">
                    <svg
                      width="13"
                      height="15"
                      viewBox="0 0 13 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.64687 10.1625L10.2375 5.925L9.07969 4.85625L5.64687 8.025L3.94062 6.45L2.78281 7.51875L5.64687 10.1625ZM6.5 15C4.61771 14.5625 3.0638 13.5656 1.83828 12.0094C0.61276 10.4531 0 8.725 0 6.825V2.25L6.5 0L13 2.25V6.825C13 8.725 12.3872 10.4531 11.1617 12.0094C9.9362 13.5656 8.38229 14.5625 6.5 15ZM6.5 13.425C7.90833 13.0125 9.07292 12.1875 9.99375 10.95C10.9146 9.7125 11.375 8.3375 11.375 6.825V3.28125L6.5 1.59375L1.625 3.28125V6.825C1.625 8.3375 2.08542 9.7125 3.00625 10.95C3.92708 12.1875 5.09167 13.0125 6.5 13.425Z"
                        fill="#3D8B37"
                      />
                    </svg>
                  </div>
                  <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">
                    Warranty Details
                  </h5>
                </div>

                <div className="row align-items-start gy-3">
                  <div className="col-xl-9">
                    <div className="row gy-3">
                      <div className="col-md-3 col-sm-6">
                        <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                          Provider
                        </h6>
                        <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">
                          {warranty?.provider || "N/A"}
                        </h5>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                          Coverage Type
                        </h6>
                        <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">
                          {warranty?.coverage_type || "N/A"}
                        </h5>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                          Start Date
                        </h6>
                        <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">
                          {formatDate(warranty?.start_date)}
                        </h5>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                          Expiry Date
                        </h6>
                        <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">
                          {formatDate(warranty?.expiry_date)}
                        </h5>
                      </div>
                    </div>

                    <h5 className="ct_green_text ct_fs_15 ct_fw_600 my-4">
                      Claim Information
                    </h5>

                    <div className="row gy-3">
                      <div className="col-sm-6">
                        <div className="ct_claim_info_box">
                          <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">Claim Email</h6>
                          <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">
                            {warranty?.claim_email || "N/A"}
                          </h5>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="ct_claim_info_box">
                          <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">Claim Phone</h6>
                          <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">
                            {warranty?.claim_phone || "N/A"}
                          </h5>
                        </div>
                      </div>
                    </div>

                    {warranty?.claim_instructions && (
                      <div className="mt-4">
                        <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">Claim Instructions</h6>
                        <h5 className="ct_fs_15 ct_fw_400 mb-0 ct_head_clr">
                          {warranty.claim_instructions}
                        </h5>
                      </div>
                    )}
                  </div>

                  {warranty?.document_url && (
                    <div className="col-xl-3 mt-xl-0 mt-3">
                      <a
                        href={formatFileUrl(warranty.document_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="ct_doc_custom_box text-decoration-none d-flex align-items-center"
                      >
                        <i className="fa-solid fa-file-pdf fs-4 text-danger me-2"></i>
                        <span className="ct_fs_14 ct_fw_500 ct_head_clr">Warranty Document</span>
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {/* 6. Documents Section */}
              <section className="ct_profile_card ct_mt_30">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="ct_van_det_icon_box">
                    <svg
                      width="15"
                      height="11"
                      viewBox="0 0 15 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.39535 11C1.01163 11 0.68314 10.8654 0.409884 10.5961C0.136628 10.3268 0 10.0031 0 9.625V1.375C0 0.996875 0.136628 0.673177 0.409884 0.403906C0.68314 0.134635 1.01163 0 1.39535 0H5.5814L6.97674 1.375H12.5581C12.9419 1.375 13.2703 1.50964 13.5436 1.77891C13.8169 2.04818 13.9535 2.37188 13.9535 2.75H6.40116L5.00581 1.375H1.39535V9.625L3.06977 4.125H15L13.2035 10.0203C13.1105 10.3182 12.939 10.556 12.689 10.7336C12.439 10.9112 12.1628 11 11.8605 11H1.39535ZM2.86047 9.625H11.8605L13.1163 5.5H4.11628L2.86047 9.625Z"
                        fill="#3D8B37"
                      />
                    </svg>
                  </div>
                  <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">
                    Documents ({documents.length})
                  </h5>
                </div>

                {documents.length === 0 ? (
                  <p className="text-muted ct_fs_14 mb-0">No documents uploaded.</p>
                ) : (
                  <div className="d-flex gap-3 flex-wrap">
                    {documents.map((doc, idx) => (
                      <a
                        key={doc.id || idx}
                        href={formatFileUrl(doc.file_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="ct_doc_custom_box text-decoration-none d-flex align-items-center gap-2"
                        title={doc.file_name}
                      >
                        <i className="fa-solid fa-file-lines fs-5 text-primary"></i>
                        <div>
                          <span className="ct_fs_14 ct_fw_600 ct_head_clr d-block">
                            {formatDocType(doc.document_type)}
                          </span>
                          <span className="text-muted ct_fs_12">
                            {doc.file_name || "View Document"} {doc.file_size_kb ? `(${doc.file_size_kb} KB)` : ""}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </section>

              {/* 7. Maintenance Setup Section */}
              <section className="ct_profile_card ct_mt_30">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="ct_van_det_icon_box">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.125 11.175L11.175 10.125C11.25 10.05 11.2875 9.9625 11.2875 9.8625C11.2875 9.7625 11.25 9.675 11.175 9.6L8.625 7.03125C8.675 6.89375 8.7125 6.75625 8.7375 6.61875C8.7625 6.48125 8.775 6.325 8.775 6.15C8.775 5.4375 8.52188 4.82812 8.01562 4.32187C7.50938 3.81562 6.9 3.5625 6.1875 3.5625C5.975 3.5625 5.7625 3.59063 5.55 3.64688C5.3375 3.70313 5.13125 3.78125 4.93125 3.88125L6.69375 5.64375L5.64375 6.69375L3.88125 4.93125C3.78125 5.13125 3.70313 5.3375 3.64688 5.55C3.59063 5.7625 3.5625 5.975 3.5625 6.1875C3.5625 6.9 3.81562 7.50938 4.32187 8.01562C4.82812 8.52188 5.4375 8.775 6.15 8.775C6.3125 8.775 6.46562 8.7625 6.60938 8.7375C6.75313 8.7125 6.89375 8.675 7.03125 8.625L9.6 11.175C9.675 11.25 9.7625 11.2875 9.8625 11.2875C9.9625 11.2875 10.05 11.25 10.125 11.175ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4813 2.19375 12.8063C1.51875 12.1313 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1313 1.51875 12.8063 2.19375C13.4813 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4813 12.1313 12.8063 12.8063C12.1313 13.4813 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15ZM7.5 13.5C9.175 13.5 10.5938 12.9187 11.7563 11.7563C12.9187 10.5938 13.5 9.175 13.5 7.5C13.5 5.825 12.9187 4.40625 11.7563 3.24375C10.5938 2.08125 9.175 1.5 7.5 1.5C5.825 1.5 4.40625 2.08125 3.24375 3.24375C2.08125 4.40625 1.5 5.825 1.5 7.5C1.5 9.175 2.08125 10.5938 3.24375 11.7563C4.40625 12.9187 5.825 13.5 7.5 13.5Z"
                        fill="#3D8B37"
                      />
                    </svg>
                  </div>
                  <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">
                    Maintenance Setup
                  </h5>
                </div>

                <div className="row gy-3">
                  <div className="col-sm-6 col-lg-3">
                    <div className="ct_claim_info_box">
                      <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                        First Service Date
                      </h6>
                      <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">
                        {formatDate(maintenance?.first_service_date)}
                      </h5>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-4">
                    <div className="ct_claim_info_box">
                      <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                        Service Centre
                      </h6>
                      <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">
                        {maintenance?.assigned_service_centre || "N/A"}
                      </h5>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-2">
                    <div className="ct_claim_info_box">
                      <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                        Reminder
                      </h6>
                      <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">
                        {maintenance?.reminder_before_days
                          ? `${maintenance.reminder_before_days} Days Before`
                          : "N/A"}
                      </h5>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <div className="ct_claim_info_box">
                      <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">
                        Notifications
                      </h6>
                      <h5 className="ct_fs_14 ct_fw_600 mb-0 ct_head_clr d-flex gap-2">
                        <span
                          className={`badge ${
                            maintenance?.notify_push ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          Push {maintenance?.notify_push ? "On" : "Off"}
                        </span>
                        <span
                          className={`badge ${
                            maintenance?.notify_email ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          Email {maintenance?.notify_email ? "On" : "Off"}
                        </span>
                      </h5>
                    </div>
                  </div>
                </div>

                {maintenance?.notes && (
                  <div className="mt-4">
                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">Maintenance Notes</h6>
                    <h5 className="ct_fs_15 ct_fw_400 mb-0 ct_head_clr">
                      {maintenance.notes}
                    </h5>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VanDetail;