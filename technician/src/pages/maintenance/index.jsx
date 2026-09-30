import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import PaginationDropdown from '../../components/table/PaginationDropdown';
import ReactPagination from '../../components/table/ReactPagination';
import useDebounce from '../../hooks/useDebounce';
import { pageRoutes } from '../../routes/PageRoutes';
import { getTechnicianAssignedTasks } from '../../redux/slices/maintenanceSlice';

const MaintenanceTasks = () => {
  const dispatch = useDispatch();

  const {
    tasksList = [],
    tasksSummary = {},
    isTasksLoading = false,
  } = useSelector((state) => state.maintenanceReducer || {});

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch Assigned Maintenance Tasks on mount and on filter changes
  useEffect(() => {
    dispatch(
      getTechnicianAssignedTasks({
        search: debouncedSearch,
        priority: selectedPriority,
        status: selectedStatus,
      })
    );
  }, [dispatch, debouncedSearch, selectedPriority, selectedStatus]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, selectedPriority, selectedStatus, listPerPages]);

  // Client-side filtering as safety
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasksList)) return [];
    return tasksList.filter((task) => {
      // Priority filter
      if (
        selectedPriority !== 'all' &&
        (task.priority || '').toLowerCase() !== selectedPriority.toLowerCase()
      ) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all') {
        const tStatus = (task.task_status || '').toLowerCase();
        const filterVal = selectedStatus.toLowerCase();
        if (tStatus !== filterVal) {
          return false;
        }
      }
      // Search query filter
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const title = (task.title || '').toLowerCase();
        const vanName = (task.van?.van_name || '').toLowerCase();
        const reg = (task.van?.registration_number || '').toLowerCase();
        const location = (task.job_location || '').toLowerCase();
        const dealerName = (task.dealer?.name || task.dealer?.dealer_name || '').toLowerCase();
        return (
          title.includes(query) ||
          vanName.includes(query) ||
          reg.includes(query) ||
          location.includes(query) ||
          dealerName.includes(query)
        );
      }
      return true;
    });
  }, [tasksList, selectedPriority, selectedStatus, debouncedSearch]);

  // Pagination calculation
  const totalItems = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / listPerPages));
  const displayedTasks = useMemo(() => {
    const start = currentPage * listPerPages;
    return filteredTasks.slice(start, start + listPerPages);
  }, [filteredTasks, currentPage, listPerPages]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

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

  return (
    <Layout>
      <SubHeader
        title="Maintenance Tasks"
        subtitle="Manage and track your assigned maintenance tasks, vehicle repairs, and schedules."
      />

      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">
          {/* Summary Cards */}
          <div className="row">
            {/* Card 1 - Total Assigned */}
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
                  <p>Total Assigned</p>
                  <h3>{isTasksLoading ? "..." : (tasksSummary.total_assigned ?? tasksList.length ?? 0)}</h3>
                </div>
              </div>
            </div>

            {/* Card 2 - Completed Tasks */}
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
                  <p>Completed Tasks</p>
                  <h3>{isTasksLoading ? "..." : (tasksSummary.total_completed ?? 0)}</h3>
                </div>
              </div>
            </div>

            {/* Card 3 - Pending Tasks */}
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
                  <p>Pending Tasks</p>
                  <h3>{isTasksLoading ? "..." : (tasksSummary.total_pending ?? 0)}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
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
                  placeholder="Search by Title, Van, Registration, Location, or Dealer..."
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
                  <option value="rejected">Rejected</option>
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
                  <th>Van Details</th>
                  <th>Assigned By (Dealer)</th>
                  <th>Job Location</th>
                  <th>Schedule</th>
                  <th>Priority</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isTasksLoading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-muted ct_fs_14 mb-0">Loading assigned tasks...</p>
                    </td>
                  </tr>
                ) : displayedTasks.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5 text-muted ct_fs_14">
                      {searchTerm || selectedPriority !== 'all' || selectedStatus !== 'all'
                        ? 'No maintenance tasks match your filter criteria.'
                        : 'No maintenance tasks assigned to your technician account yet.'}
                    </td>
                  </tr>
                ) : (
                  displayedTasks.map((task, index) => {
                    const rowNumber = currentPage * listPerPages + index + 1;
                    const taskId = task.maintenance_id || task.id;
                    const van = task.van || {};
                    const vanName = van.van_name || van.model || 'N/A';
                    const regNumber = van.registration_number || '';
                    const dealer = task.dealer || {};
                    const dealerName = dealer.name || dealer.dealer_name || 'N/A';
                    const taskStatusVal = task.task_status || 'pending';

                    return (
                      <tr key={taskId || index}>
                        <td>{rowNumber}</td>

                        {/* Task Title */}
                        <td className="ct_fw_600">
                          {task.title || 'N/A'}
                        </td>

                        {/* Van Details */}
                        <td>
                          {vanName}
                          {regNumber ? ` (${regNumber})` : ''}
                        </td>

                        {/* Dealer Details */}
                        <td>
                          <span className="ct_fw_600">{dealerName}</span>
                          {dealer.phone && (
                            <div className="text-muted ct_fs_12">
                              {dealer.phone}
                            </div>
                          )}
                        </td>

                        {/* Job Location */}
                        <td>
                          <span
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: '180px' }}
                            title={task.job_location || 'N/A'}
                          >
                            {task.job_location || 'N/A'}
                          </span>
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

                        {/* Status (Normal Task Status Badge) */}
                        <td>
                          <span
                            className={`badge ${getStatusBadgeClass(taskStatusVal)} px-3 py-1 text-capitalize`}
                            style={{ fontSize: '11px', fontWeight: '600', borderRadius: '6px' }}
                          >
                            {taskStatusVal}
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
                              to={`${pageRoutes.maintenance_detail}?id=${taskId}`}
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

          {/* Pagination UI */}
          {totalItems > 10 && (
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
        </div>
      </div>
    </Layout>
  );
};

export default MaintenanceTasks;
