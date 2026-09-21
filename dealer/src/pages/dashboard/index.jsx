import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import StatusBadge from '../../components/StatusBadge';
import { getDealerDashboard } from '../../redux/slices/vanSlice';

const Dashboard = () => {
  const dispatch = useDispatch();

  const { dashboardData, isDashboardLoading = false } = useSelector(
    (state) => state.vanReducer || {}
  );

  useEffect(() => {
    dispatch(getDealerDashboard());
  }, [dispatch]);

  const summary = dashboardData?.summary || {};
  const recentVans = Array.isArray(dashboardData?.recentVans)
    ? dashboardData.recentVans
    : [];

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

  const getProgressNum = (van) => {
    const val = van?.progress || 0;
    const num = typeof val === "number" ? val : parseFloat(String(val).replace("%", ""));
    return !isNaN(num) ? Math.min(Math.max(Math.round(num), 0), 100) : 0;
  };

  return (
    <Layout>
      <SubHeader
        title="Dashboard"
        subtitle="Manage your vans, customers, and ownership profiles from one place."
      />
      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">
          <div className="row">
            {/* Card 1 - Total Vans */}
            <div className="col-xl-4 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_1.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.totalVans ?? 0}</h3>
                  <p>Total Vans</p>
                </div>
              </div>
            </div>

            {/* Card 2 - Total Owners */}
            <div className="col-xl-4 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_2.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.totalOwners ?? 0}</h3>
                  <p>Total Owners</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Warranty Alerts */}
            <div className="col-xl-4 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_3.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.warrantyAlerts ?? 0}</h3>
                  <p>Warranty Alerts</p>
                </div>
              </div>
            </div>

            {/* Card 4 - Upcoming Services */}
            <div className="col-xl-4 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_4.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.upcomingServices ?? 0}</h3>
                  <p>Upcoming Services</p>
                </div>
              </div>
            </div>

            {/* Card 5 - Total Suppliers */}
            <div className="col-xl-4 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3H16V16H1V3Z" stroke="#3D8B37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 8H20L23 11V16H16V8Z" stroke="#3D8B37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 18.5C8 19.8807 6.88071 21 5.5 21C4.11929 21 3 19.8807 3 18.5C3 17.1193 4.11929 16 5.5 16C6.88071 16 8 17.1193 8 18.5Z" stroke="#3D8B37" strokeWidth="1.5" />
                    <path d="M21 18.5C21 19.8807 19.8807 21 18.5 21C17.1193 21 16 19.8807 16 18.5C16 17.1193 17.1193 16 18.5 16C19.8807 16 21 17.1193 21 18.5Z" stroke="#3D8B37" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.totalSuppliers ?? 0}</h3>
                  <p>Total Suppliers</p>
                </div>
              </div>
            </div>

            {/* Card 6 - Total Technicians */}
            <div className="col-xl-4 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#3D8B37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 18L19.5 19.5" stroke="#3D8B37" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.totalTechnicians ?? 0}</h3>
                  <p>Total Technicians</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Vans Table */}
          <div className="ct_table_wrapper mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="ct_section_title mb-0">Recent Vans</h5>
              <Link to={pageRoutes.vans} className="ct_view_all">View All <i className="fa-solid fa-arrow-right ms-1"></i></Link>
            </div>
            <div className="table-responsive ct_custom_table">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Owner Name</th>
                    <th>Van Name</th>
                    <th>Registration Number</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Created On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isDashboardLoading && dashboardData == null ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                          <span className="text-muted ct_fs_14">Loading dashboard data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : recentVans.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted ct_fs_14">
                        No recent vans found.
                      </td>
                    </tr>
                  ) : (
                    recentVans.map((van, index) => {
                      const progressNum = getProgressNum(van);
                      const vanId = van.vanId || van.id || van.van_id;

                      return (
                        <tr key={vanId || index}>
                          <td>{index + 1}</td>
                          <td>{van.ownerName || "N/A"}</td>
                          <td className="ct_fw_600">{van.vanName || "N/A"}</td>
                          <td>{van.registrationNumber || "N/A"}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2" style={{ minWidth: "110px", maxWidth: "150px" }}>
                              <div
                                className="progress flex-grow-1"
                                style={{
                                  height: "6px",
                                  backgroundColor: "#E2E8F0",
                                  borderRadius: "10px",
                                }}
                              >
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: `${progressNum}%`,
                                    backgroundColor: progressNum >= 100 ? "#05c46b" : "#3D8B37",
                                    borderRadius: "10px",
                                  }}
                                  aria-valuenow={progressNum}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="ct_fs_12 ct_fw_600 text-nowrap">{progressNum}%</span>
                            </div>
                          </td>
                          <td><StatusBadge status={van.status} /></td>
                          <td>{formatDate(van.datePurchased || van.created_at || van.createdAt)}</td>
                          <td>
                            {vanId ? (
                              <div className="d-flex align-items-center gap-2">
                                <Link
                                  to={`${pageRoutes.van_detail}?van_id=${vanId}`}
                                  className="ct_action_icon_btn ct_view_btn"
                                  title="View Details"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </Link>

                                <Link
                                  to={`${pageRoutes.vehicle_information}?van_id=${vanId}`}
                                  className="ct_action_icon_btn ct_edit_btn"
                                  title="Edit Van"
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </Link>
                              </div>

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
    </Layout>
  );
};

export default Dashboard;
