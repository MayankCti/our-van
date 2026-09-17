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
            <div className="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="assets/img/dash_icon_1.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.totalVans ?? 0}</h3>
                  <p>Total Vans</p>
                </div>
              </div>
            </div>

            {/* Card 2 - Total Owners */}
            <div className="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="assets/img/dash_icon_2.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.totalOwners ?? 0}</h3>
                  <p>Total Owners</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Warranty Alerts */}
            <div className="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="assets/img/dash_icon_3.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.warrantyAlerts ?? 0}</h3>
                  <p>Warranty Alerts</p>
                </div>
              </div>
            </div>

            {/* Card 4 - Upcoming Services */}
            <div className="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="assets/img/dash_icon_4.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isDashboardLoading && dashboardData == null ? "..." : summary.upcomingServices ?? 0}</h3>
                  <p>Upcoming Services</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Vans Table */}
          <div className="ct_table_wrapper mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="ct_section_title mb-0">Recent Vans</h5>
              <Link to={pageRoutes.vans} className="ct_view_all">View All <i class="fa-solid fa-arrow-right ms-1"></i></Link>
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
                              <Link
                                to={`${pageRoutes.van_detail}?van_id=${vanId}`}
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
    </Layout>
  );
};

export default Dashboard;
