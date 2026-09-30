import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import PaginationDropdown from '../../components/table/PaginationDropdown';
import ReactPagination from '../../components/table/ReactPagination';
import useDebounce from '../../hooks/useDebounce';
import {
  getTechnicianById,
  toggleBlockTechnician,
} from '../../redux/slices/technicianSlice';

const TechnicianDetail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const techId = searchParams.get('id') || searchParams.get('tech_id');

  const {
    technicianDetails,
    isDetailsLoading = false,
    detailsError = null,
    isActionLoading = false,
  } = useSelector((state) => state.technicianReducer || {});

  // Search & Filter & Pagination for Assigned Maintenances Table
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (techId) {
      dispatch(getTechnicianById({ id: techId }));
    }
  }, [dispatch, techId]);

  // Reset pagination on filter/search change
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, selectedPriority, selectedStatus, listPerPages]);

  const tech = technicianDetails?.data || technicianDetails || {};
  const jobSummary = tech.job_summary || {};
  const assignedMaintenances = Array.isArray(tech.assigned_maintenances)
    ? tech.assigned_maintenances
    : Array.isArray(tech.tasks)
    ? tech.tasks
    : Array.isArray(tech.maintenances)
    ? tech.maintenances
    : [];

  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === '') return '$0.00';
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString || 'N/A';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      if (hours === undefined || minutes === undefined) return timeString;
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHours = h % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'high':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      case 'medium':
        return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'low':
        return 'bg-info-subtle text-info-emphasis border border-info-subtle';
      default:
        return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'in_progress':
      case 'in progress':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'pending':
        return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'cancelled':
      case 'rejected':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    }
  };

  const isTechnicianActive = () => {
    if (tech.is_block !== undefined && tech.is_block !== null) {
      return tech.is_block === 0;
    }
    return tech.status === 1;
  };

  const handleToggleStatus = () => {
    if (!techId) return;
    dispatch(
      toggleBlockTechnician({
        id: techId,
        callback: () => {
          dispatch(getTechnicianById({ id: techId }));
        },
      })
    );
  };

  const active = isTechnicianActive();
  const displayName = tech.full_name || tech.name || 'Technician Details';

  // Filtered Maintenances matching Maintenance Page criteria
  const filteredMaintenances = useMemo(() => {
    if (!Array.isArray(assignedMaintenances)) return [];
    return assignedMaintenances.filter((task) => {
      // Priority filter
      if (
        selectedPriority !== 'all' &&
        (task.priority || '').toLowerCase() !== selectedPriority.toLowerCase()
      ) {
        return false;
      }
      // Status filter
      if (
        selectedStatus !== 'all' &&
        (task.status || '').toLowerCase() !== selectedStatus.toLowerCase()
      ) {
        return false;
      }
      // Search filter
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const title = (task.title || '').toLowerCase();
        const type = (task.maintenance_type || '').toLowerCase();
        const vanName = (task.van?.van_name || task.van_name || '').toLowerCase();
        const reg = (task.van?.registration_number || task.registration_number || '').toLowerCase();
        const location = (task.job_location || '').toLowerCase();
        const assignedName = (displayName || task.assigned_to_name || '').toLowerCase();
        return (
          title.includes(q) ||
          type.includes(q) ||
          vanName.includes(q) ||
          reg.includes(q) ||
          location.includes(q) ||
          assignedName.includes(q)
        );
      }
      return true;
    });
  }, [assignedMaintenances, debouncedSearch, selectedPriority, selectedStatus, displayName]);

  const totalTasks = filteredMaintenances.length;
  const totalPages = Math.max(1, Math.ceil(totalTasks / listPerPages));
  const displayedMaintenances = useMemo(() => {
    const start = currentPage * listPerPages;
    return filteredMaintenances.slice(start, start + listPerPages);
  }, [filteredMaintenances, currentPage, listPerPages]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <Layout>
      <SubHeader
        title={displayName ? `${displayName}` : 'Technician Details'}
        subtitle="View complete information, status, and assigned maintenance tasks."
        backUrl={pageRoutes.technicians}
        className="ct_flex_col_767"
      >
        {tech?.id && (
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span
              className={`badge ${
                active
                  ? 'bg-success-subtle text-success border border-success-subtle'
                  : 'bg-danger-subtle text-danger border border-danger-subtle'
              }`}
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: '20px',
              }}
            >
              {active ? 'Active' : 'Blocked'}
            </span>

            <button
              type="button"
              className={`btn btn-sm ${
                active ? 'btn-outline-danger' : 'btn-outline-success'
              } ct_fw_600 px-3 py-1`}
              onClick={handleToggleStatus}
              disabled={isActionLoading}
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              {isActionLoading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : active ? (
                'Block Technician'
              ) : (
                'Unblock Technician'
              )}
            </button>
          </div>
        )}
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-4">
        {isDetailsLoading && !technicianDetails ? (
          <div className="ct_profile_card text-center py-5">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Loading technician details...</span>
            </div>
            <p className="text-muted ct_fs_15 mb-0">Loading technician details...</p>
          </div>
        ) : !techId ? (
          <div className="ct_profile_card text-center py-5">
            <i className="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">No Technician Selected</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              Please select a technician from the technicians list to view details.
            </p>
            <div className="d-flex justify-content-center">
              <Link
                to={pageRoutes.technicians}
                className="ct_green_btn ct_btn_h_42 text-decoration-none d-inline-flex align-items-center justify-content-center px-4"
              >
                Back to Technicians List
              </Link>
            </div>
          </div>
        ) : detailsError && !technicianDetails ? (
          <div className="ct_profile_card text-center py-5">
            <i className="fa-solid fa-circle-xmark text-danger fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Failed to Load Technician Details</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              {typeof detailsError === 'string' ? detailsError : 'An error occurred while fetching details.'}
            </p>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="ct_green_btn ct_btn_h_42 border-0 px-4 d-inline-flex align-items-center justify-content-center"
                onClick={() => dispatch(getTechnicianById({ id: techId }))}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Summary Cards matching Dashboard / Supplier / Parts style */}
            <div className="row">
              {/* Card 1 - Total Assigned Jobs */}
              <div className="col-xl-4 col-lg-4 col-md-6 mb-4 col-sm-6">
                <div className="ct_dash_card">
                  <div className="ct_icon_box">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3D8B37"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      <path d="M9 14l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="ct_card_content">
                    <p>Total Assigned Jobs</p>
                    <h3>{jobSummary.total_assigned_jobs ?? 0}</h3>
                  </div>
                </div>
              </div>

              {/* Card 2 - Completed Jobs */}
              <div className="col-xl-4 col-lg-4 col-md-6 mb-4 col-sm-6">
                <div className="ct_dash_card">
                  <div className="ct_icon_box">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3D8B37"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="ct_card_content">
                    <p>Completed Jobs</p>
                    <h3>{jobSummary.total_completed_jobs ?? 0}</h3>
                  </div>
                </div>
              </div>

              {/* Card 3 - Pending Jobs */}
              <div className="col-xl-4 col-lg-4 col-md-6 mb-4 col-sm-6">
                <div className="ct_dash_card">
                  <div className="ct_icon_box">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3D8B37"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="ct_card_content">
                    <p>Pending Jobs</p>
                    <h3>{jobSummary.total_incompleted_jobs ?? jobSummary.total_pending_jobs ?? jobSummary.total_pending ?? 0}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Technician Information Profile Section */}
            <section className="ct_profile_card p-4 rounded-4 bg-white border mb-4">
              <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
                <div className="ct_van_det_icon_box">
                  <i className="fa-solid fa-user-gear text-success"></i>
                </div>
                <h5 className="ct_green_text ct_fs_18 ct_fw_700 mb-0">Technician Information</h5>
              </div>

              {/* Profile Top Banner */}
              <div className="row align-items-center mb-4 pb-4 border-bottom">
                <div className="col-auto">
                  <img
                    src={tech.profile_image || "/image.png"}
                    alt={displayName}
                    className="rounded-circle object-fit-cover shadow-sm border"
                    style={{
                      width: '80px',
                      height: '80px',
                      cursor: tech.profile_image ? 'pointer' : 'default',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image.png';
                    }}
                    onClick={() => {
                      if (tech.profile_image) window.open(tech.profile_image, '_blank');
                    }}
                    title={tech.profile_image ? "Click to view image in full size" : "Technician Profile"}
                  />
                </div>

                <div className="col">
                  <h4 className="ct_head_clr ct_fs_20 ct_fw_700 mb-1">
                    {tech.full_name || tech.name || 'N/A'}
                  </h4>
                  <div className="d-flex flex-wrap align-items-center gap-3 text-muted ct_fs_13">
                    <span>
                      <i className="fa-regular fa-envelope me-1 text-success"></i>
                      {tech.email || 'N/A'}
                    </span>
                    {(tech.phone_number || tech.contact_number || tech.country_code) && (
                      <span>
                        <i className="fa-solid fa-phone me-1 text-success"></i>
                        {tech.country_code ? `${tech.country_code} ` : ''}
                        {tech.phone_number || tech.contact_number || ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Fields Grid */}
              <div className="row gy-4">
                <div className="col-lg-3 col-sm-6">
                  <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                    Full Name
                  </h5>
                  <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_600">
                    {tech.full_name || tech.name || 'N/A'}
                  </h6>
                </div>

                <div className="col-lg-3 col-sm-6">
                  <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                    Email Address
                  </h5>
                  <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_600 text-break">
                    {tech.email || 'N/A'}
                  </h6>
                </div>

                <div className="col-lg-3 col-sm-6">
                  <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                    Phone Number
                  </h5>
                  <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_600">
                    {tech.country_code ? `${tech.country_code} ` : ''}
                    {tech.phone_number || tech.contact_number || 'N/A'}
                  </h6>
                </div>

                <div className="col-lg-3 col-sm-6">
                  <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                    Job Role
                  </h5>
                  <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_600">
                    {tech.job_role_name || tech.job_role || 'Technician'}
                  </h6>
                </div>

                <div className="col-lg-3 col-sm-6">
                  <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                    Address
                  </h5>
                  <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_600">
                    {tech.home_address || tech.address || 'N/A'}
                  </h6>
                </div>

                <div className="col-lg-3 col-sm-6">
                  <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                    Joined Date
                  </h5>
                  <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_600">
                    {formatDate(tech.created_at)}
                  </h6>
                </div>
              </div>
            </section>

            {/* 3. Assigned Maintenances Table Section */}
            <section className="ct_profile_card p-4 rounded-4 bg-white border">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div className="ct_van_det_icon_box">
                    <i className="fa-solid fa-wrench text-success"></i>
                  </div>
                  <div>
                    <h5 className="ct_green_text ct_fs_18 ct_fw_700 mb-0">Assigned Maintenance Tasks</h5>
                    <p className="text-muted ct_fs_13 mb-0">
                      List of all maintenance jobs assigned to this technician.
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border px-3 py-2" style={{ fontSize: '13px' }}>
                    Total Tasks: <strong className="text-success">{assignedMaintenances.length}</strong>
                  </span>
                </div>
              </div>

              {/* Filter and Search Bar matching Maintenance page */}
              <div className="row g-3 mb-4 align-items-center">
                <div className="col-lg-6 col-md-12">
                  <div className="position-relative">
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
                      placeholder="Search by Title, Van, Registration, or Assignee..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && (
                      <button
                        type="button"
                        className="btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                        onClick={() => {
                          setSearchTerm('');
                          setCurrentPage(0);
                        }}
                        aria-label="Clear search"
                        style={{ background: 'none', cursor: 'pointer', zIndex: 5 }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select ct_input ct_fs_13 py-2"
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select ct_input ct_fs_13 py-2"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Maintenance Tasks Table */}
              <div className="table-responsive ct_custom_table">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Task Title</th>
                      <th>Maintenance Type</th>
                      <th>Van Details</th>
                      <th>Assigned To</th>
                      <th>Schedule</th>
                      <th>Priority</th>
                      <th>Total Cost</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedMaintenances.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="text-center py-5 text-muted ct_fs_14">
                          {searchTerm || selectedPriority !== 'all' || selectedStatus !== 'all'
                            ? 'No maintenance tasks match your filter criteria.'
                            : 'No maintenance tasks assigned to this technician yet.'}
                        </td>
                      </tr>
                    ) : (
                      displayedMaintenances.map((task, index) => {
                        const rowNumber = currentPage * listPerPages + index + 1;
                        const vanInfo = task.van || {};
                        const vanName = vanInfo.van_name || task.van_name || 'N/A';
                        const regNumber = vanInfo.registration_number || task.registration_number;
                        const assignedToName = displayName || task.assigned_to_name || 'Unassigned';

                        return (
                          <tr key={task.id || task.maintenance_id || index}>
                            <td>{rowNumber}</td>

                            {/* Task Title */}
                            <td className="ct_fw_600">
                              {task.title || 'N/A'}
                            </td>

                            {/* Maintenance Type */}
                            <td>
                              {task.maintenance_type || 'N/A'}
                            </td>

                            {/* Van Details */}
                            <td>
                              {vanName}
                              {regNumber ? ` (${regNumber})` : ''}
                            </td>

                            {/* Assigned To */}
                            <td>
                              {assignedToName}
                            </td>

                            {/* Schedule */}
                            <td>
                              {formatDate(task.schedule_date)}{' '}
                              {task.schedule_time ? formatTime(task.schedule_time) : ''}
                            </td>

                            {/* Priority */}
                            <td>
                              {task.priority ? (
                                <span
                                  className={`badge ${getPriorityBadgeClass(task.priority)} px-2 py-1 text-capitalize`}
                                  style={{ fontSize: '11px', fontWeight: '600' }}
                                >
                                  {task.priority}
                                </span>
                              ) : (
                                'N/A'
                              )}
                            </td>

                            {/* Total Cost */}
                            <td className="ct_fw_600">
                              {formatCurrency(task.total_amount)}
                            </td>

                            {/* Status */}
                            <td>
                              <span
                                className={`badge ${getStatusBadgeClass(task.status)} px-3 py-1 text-capitalize`}
                                style={{ fontSize: '11px', fontWeight: '600', borderRadius: '6px' }}
                              >
                                {task.status || 'Pending'}
                              </span>
                            </td>

                            {/* Created Date */}
                            <td>
                              {formatDate(task.created_at)}
                            </td>

                            {/* Action */}
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <Link
                                  to={`${pageRoutes.maintenance_detail}?id=${task.id || task.maintenance_id}`}
                                  className="ct_action_icon_btn ct_view_btn"
                                  title="View Details"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalTasks > 10 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                  <div>
                    <PaginationDropdown
                      listPerPages={listPerPages}
                      options={[5, 10, 25, 50, 100]}
                      onChange={(val) => {
                        setListPerPages(val);
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                  <div>
                    <ReactPagination
                      pageCount={totalPages}
                      onPageChange={handlePageClick}
                      currentPage={currentPage}
                    />
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default TechnicianDetail;
