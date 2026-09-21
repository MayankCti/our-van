import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import Header from "../../layout/Header";
import Layout from "../../layout/Layout";
import ErrorMessage from "../../components/form/ErrorMessage";
import { pageRoutes } from "../../routes/PageRoutes";
import { getDashboardData } from "../../redux/slices/dashboardSlice";
import { createDealer } from "../../redux/slices/dealerSlice";
import { dealerSchema } from "../../utils/Schema";

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

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addDealerModalCloseRef = useRef(null);

  const {
    dashboardData = null,
    isDashboardLoading = false,
  } = useSelector((state) => state.dashboardReducer || {});

  const { isCreateDealerLoading = false } = useSelector(
    (state) => state.dealerReducer || {}
  );

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  // Formik for Add Dealer Quick Action Modal
  const dealerFormik = useFormik({
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
              res?.statusCode === 200 ||
              res?.statusCode === 201 ||
              res?.data ||
              !res?.error
            ) {
              addDealerModalCloseRef.current?.click();
              resetForm();
              dispatch(getDashboardData());
            }
          },
        })
      );
    },
  });

  const data = dashboardData?.data || dashboardData || {};
  const counts = data?.counts || {};
  const recentRegistrations = Array.isArray(data?.recent_registrations)
    ? data.recent_registrations
    : [];

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />

        <div className="ct_inner_header_bg mt-4 ct_px_30">
          <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Dashboard</h4>
          <p className="mb-0 ct_para_clr">
            Manage your vans, customers, and ownership profiles from one place.
          </p>
        </div>

        <div className="ct_px_30 mt-4 pb-4">
          {/* Summary Cards */}
          <div className="row">
            {/* Card 1: Total Vans */}
            <div className="col-xl-4 col-md-4 col-sm-6 mb-4 mb-xl-0">
              <Link to={pageRoutes.vans} className="text-decoration-none">
                <div className="ct_dash_card">
                  <div className="ct_icon_box">
                    <img src="assets/img/dash_icon_1.png" alt="Total Vans" />
                  </div>
                  <div className="ct_card_content">
                    <p className="mb-2 mt-0">Total Vans</p>
                    <h3>
                      {isDashboardLoading ? (
                        <span className="spinner-border spinner-border-sm text-success" role="status"></span>
                      ) : (
                        counts.total_vans ?? 0
                      )}
                    </h3>

                  </div>
                </div>
              </Link>
            </div>

            {/* Card 2: Total Owners */}
            <div className="col-xl-4 col-md-4 col-sm-6 mb-4 mb-xl-0">
              <Link to={pageRoutes.owners} className="text-decoration-none">
                <div className="ct_dash_card">
                  <div className="ct_icon_box">
                    <img src="assets/img/dash_icon_2.png" alt="Total Owners" />
                  </div>
                  <div className="ct_card_content">
                    <p className="mb-2 mt-0">Total Owners</p>
                    <h3>
                      {isDashboardLoading ? (
                        <span className="spinner-border spinner-border-sm text-success" role="status"></span>
                      ) : (
                        counts.total_owners ?? 0
                      )}
                    </h3>

                  </div>
                </div>
              </Link>
            </div>

            {/* Card 3: Total Dealers */}
            <div className="col-xl-4 col-md-4 col-sm-6 mb-4 mb-xl-0">
              <Link to={pageRoutes.dealers} className="text-decoration-none">
                <div className="ct_dash_card">
                  <div className="ct_icon_box">
                    <img src="assets/img/dash_icon_3.png" alt="Total Dealers" />
                  </div>
                  <div className="ct_card_content">
                    <p className="mb-2 mt-0">Total Dealers</p>
                    <h3>
                      {isDashboardLoading ? (
                        <span className="spinner-border spinner-border-sm text-success" role="status"></span>
                      ) : (
                        counts.total_dealers ?? 0
                      )}
                    </h3>

                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Main Dashboard Section */}
          <div className="row mt-4">
            {/* Recent Registrations Table */}
            <div className="col-xl-12">
              <div className="ct_table_wrapper">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="ct_section_title mb-0">Recent Vans</h5>
                  <Link to={pageRoutes.vans} className="ct_view_all ct_fs_14 text-decoration-none">
                    View All Vans <i className="fa-solid fa-arrow-right ms-1"></i>
                  </Link>
                </div>

                <div className="table-responsive ct_custom_table">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Owner Name</th>
                        <th>Van Name</th>
                        <th>Registration Number</th>
                        <th>Dealer</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {isDashboardLoading ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <div
                                className="spinner-border spinner-border-sm text-success"
                                role="status"
                              ></div>
                              <span className="text-muted ct_fs_14">Loading recent registrations...</span>
                            </div>
                          </td>
                        </tr>
                      ) : recentRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted ct_fs_14">
                            No recent registrations found.
                          </td>
                        </tr>
                      ) : (
                        recentRegistrations.map((reg, index) => {
                          const vanId = reg.van_id || reg.id;
                          const ownerName = reg.owner_name || "-";
                          const vanName = reg.van_name || "N/A";
                          const regNumber = reg.registration_number || "-";
                          const dealerName = reg.dealer_name || "-";
                          const date = formatDate(reg.date || reg.created_at);

                          return (
                            <tr key={vanId || index}>
                              <td>{index + 1}</td>
                              <td>{ownerName}</td>
                              <td className="ct_fw_600">{vanName}</td>
                              <td>{regNumber}</td>
                              <td>{dealerName}</td>
                              <td>{date}</td>
                              <td>
                                {vanId ? (
                                  <Link
                                    to={`${pageRoutes.van_detail}?id=${vanId}`}
                                    className="ct_action_icon_btn ct_view_btn"
                                    title="View Details"
                                  >
                                    <i className="fa-regular fa-eye"></i>
                                  </Link>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Add Dealer Modal from Dashboard */}
      <div className="modal fade" id="dashAddDealerModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "690px" }}>
          <div className="modal-content ct_modal">
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="ct_fs_20 ct_fw_600 ct_head_clr mb-1">Add Dealer</h5>
                <p className="ct_fs_14 ct_para_clr mb-0">Register a new dealer to the platform.</p>
              </div>

              <button
                type="button"
                ref={addDealerModalCloseRef}
                className="btn-close shadow-none"
                data-bs-dismiss="modal"
                onClick={() => dealerFormik.resetForm()}
              ></button>
            </div>

            <form onSubmit={dealerFormik.handleSubmit}>
              <div className="modal-body pt-4">
                <div className="mb-3">
                  <label className="ct_label">
                    Dealer Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="dealer_name"
                    className={`form-control ct_input ${dealerFormik.errors.dealer_name && dealerFormik.touched.dealer_name
                      ? "is-invalid"
                      : ""
                      }`}
                    placeholder="Enter dealer name"
                    value={dealerFormik.values.dealer_name}
                    onChange={dealerFormik.handleChange}
                    onBlur={dealerFormik.handleBlur}
                  />
                  <ErrorMessage
                    errors={dealerFormik.errors}
                    touched={dealerFormik.touched}
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
                      className={`form-control ct_input ${dealerFormik.errors.email && dealerFormik.touched.email
                        ? "is-invalid"
                        : ""
                        }`}
                      placeholder="Enter email"
                      value={dealerFormik.values.email}
                      onChange={dealerFormik.handleChange}
                      onBlur={dealerFormik.handleBlur}
                    />
                    <ErrorMessage
                      errors={dealerFormik.errors}
                      touched={dealerFormik.touched}
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
                      className={`form-control ct_input ${dealerFormik.errors.phone_number && dealerFormik.touched.phone_number
                        ? "is-invalid"
                        : ""
                        }`}
                      placeholder="Enter phone no."
                      value={dealerFormik.values.phone_number}
                      onChange={dealerFormik.handleChange}
                      onBlur={dealerFormik.handleBlur}
                    />
                    <ErrorMessage
                      errors={dealerFormik.errors}
                      touched={dealerFormik.touched}
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
                  onClick={() => dealerFormik.resetForm()}
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

export default Dashboard;