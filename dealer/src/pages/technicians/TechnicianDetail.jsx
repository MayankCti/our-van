import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const modalCloseRef = useRef(null);
  const [searchParams] = useSearchParams();
  const techId = searchParams.get('id') || searchParams.get('tech_id');

  const {
    technicianDetails,
    isDetailsLoading = false,
    detailsError = null,
    isActionLoading = false,
  } = useSelector((state) => state.technicianReducer || {});

  // Tab State: 'history' (Job History) or 'activity' (Technician Activity)
  const [activeTab, setActiveTab] = useState('history');

  // Job History filters & pagination
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const debouncedHistorySearch = useDebounce(historySearchTerm, 400);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Vans Worked On pagination (inside Activity tab)
  const [vansCurrentPage, setVansCurrentPage] = useState(0);
  const vansPerPage = 5;

  useEffect(() => {
    if (techId) {
      dispatch(getTechnicianById({ id: techId }));
    }
  }, [dispatch, techId]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedHistorySearch, selectedStatus, selectedPriority, listPerPages]);

  const tech = technicianDetails?.data || technicianDetails || {};
  const overview = tech.overview || {};
  const jobSummary = tech.job_summary || {};
  const activity = tech.activity || {};
  const performanceSummary = activity.performance_summary || {};
  const jobsOverview = activity.jobs_overview || {};
  const rawChartData = Array.isArray(jobsOverview.chart_data) ? jobsOverview.chart_data : [];
  const vansWorkedOn = Array.isArray(activity.vans_worked_on) ? activity.vans_worked_on : [];

  // Job History list fallback to assigned_maintenances
  const rawJobHistory = Array.isArray(tech.job_history) && tech.job_history.length > 0
    ? tech.job_history
    : Array.isArray(tech.assigned_maintenances)
      ? tech.assigned_maintenances
      : Array.isArray(tech.tasks)
        ? tech.tasks
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

  const formatScheduledDate = (item) => {
    const d = item.scheduled_date || item.schedule_date;
    if (!d) return 'N/A';
    const formatted = formatDate(d);
    if (item.schedule_date_end) {
      return `${formatted} - ${formatDate(item.schedule_date_end)}`;
    }
    return formatted;
  };

  const getPriorityBadgeStyle = (priority) => {
    const p = (priority || '').toLowerCase();
    switch (p) {
      case 'high':
      case 'urgent':
        return {
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #FCA5A5',
        };
      case 'medium':
        return {
          backgroundColor: '#FEF3C7',
          color: '#D97706',
          border: '1px solid #FCD34D',
        };
      case 'low':
        return {
          backgroundColor: '#E0F2FE',
          color: '#0284C7',
          border: '1px solid #BAE6FD',
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          color: '#4B5563',
          border: '1px solid #E5E7EB',
        };
    }
  };

  const renderStatusIndicator = (status) => {
    const s = (status || '').toLowerCase();
    let dotColor = '#9CA3AF';
    let textColor = '#6B7280';
    let label = status || 'N/A';

    switch (s) {
      case 'completed':
        dotColor = '#3D8B37';
        textColor = '#2E6E29';
        label = 'Completed';
        break;
      case 'in_progress':
      case 'in progress':
        dotColor = '#2563EB';
        textColor = '#1D4ED8';
        label = 'In Progress';
        break;
      case 'pending':
        dotColor = '#F59E0B';
        textColor = '#D97706';
        label = 'Pending';
        break;
      case 'overdue':
        dotColor = '#EF4444';
        textColor = '#DC2626';
        label = 'Overdue';
        break;
      case 'invoiced':
        dotColor = '#8B5CF6';
        textColor = '#7C3AED';
        label = 'Invoiced';
        break;
      case 'cancelled':
      case 'rejected':
        dotColor = '#EF4444';
        textColor = '#DC2626';
        label = 'Cancelled';
        break;
      default:
        break;
    }

    return (
      <span className="d-inline-flex align-items-center gap-2 ct_fw_600 ct_fs_13" style={{ color: textColor }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: dotColor,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span className="text-capitalize">{label}</span>
      </span>
    );
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
        callback: (res) => {
          if (
            (res?.success === true ||
              res?.status === true ||
              res?.statusCode === 200 ||
              res?.statusCode === 201) &&
            res?.success !== false &&
            res?.status !== false
          ) {
            modalCloseRef.current?.click();
            dispatch(getTechnicianById({ id: techId }));
          }
        },
      })
    );
  };

  const active = isTechnicianActive();
  const displayName =
    overview.technician_name ||
    tech.full_name ||
    tech.name ||
    'Technician Details';

  // Filtered Job History
  const filteredJobHistory = useMemo(() => {
    if (!Array.isArray(rawJobHistory)) return [];
    return rawJobHistory.filter((item) => {
      // Status filter
      if (selectedStatus !== 'all') {
        const itemStatus = (item.status || '').toLowerCase();
        if (itemStatus !== selectedStatus.toLowerCase()) return false;
      }
      // Priority filter
      if (selectedPriority !== 'all') {
        const itemPriority = (item.priority || '').toLowerCase();
        if (itemPriority !== selectedPriority.toLowerCase()) return false;
      }
      // Search filter
      if (debouncedHistorySearch.trim()) {
        const q = debouncedHistorySearch.toLowerCase().trim();
        const jobName = (item.job_name || item.title || '').toLowerCase();
        const reg = (
          item.van_registration_number ||
          item.registration_number ||
          item.van?.registration_number ||
          ''
        ).toLowerCase();
        return jobName.includes(q) || reg.includes(q);
      }
      return true;
    });
  }, [rawJobHistory, debouncedHistorySearch, selectedStatus, selectedPriority]);

  const totalHistoryItems = filteredJobHistory.length;
  const totalHistoryPages = Math.max(1, Math.ceil(totalHistoryItems / listPerPages));
  const displayedJobHistory = useMemo(() => {
    const start = currentPage * listPerPages;
    return filteredJobHistory.slice(start, start + listPerPages);
  }, [filteredJobHistory, currentPage, listPerPages]);

  // Vans worked on pagination
  const totalVansPages = Math.max(1, Math.ceil(vansWorkedOn.length / vansPerPage));
  const displayedVans = useMemo(() => {
    const start = vansCurrentPage * vansPerPage;
    return vansWorkedOn.slice(start, start + vansPerPage);
  }, [vansWorkedOn, vansCurrentPage]);

  // Counts for Top 3 Cards
  const totalJobsCount =
    overview.total_jobs ??
    jobSummary.total_assigned_jobs ??
    performanceSummary.total_jobs ??
    0;
  const inProgressJobsCount =
    overview.in_progress_jobs ??
    jobSummary.in_progress_jobs ??
    performanceSummary.in_progress_jobs ??
    performanceSummary.in_progress ??
    0;
  const completedJobsCount =
    overview.completed_jobs ??
    jobSummary.total_completed_jobs ??
    performanceSummary.completed_jobs ??
    0;

  // Chart data calculation for donut
  const chartCompleted = Number(
    rawChartData.find((d) => d.label?.toLowerCase() === 'completed jobs')?.count ??
    jobsOverview.completed_jobs ??
    performanceSummary.completed_jobs ??
    0
  );
  const chartPending = Number(
    rawChartData.find((d) => d.label?.toLowerCase() === 'pending jobs')?.count ??
    jobsOverview.pending_jobs ??
    performanceSummary.pending_jobs ??
    0
  );
  const chartInProgress = Number(
    rawChartData.find((d) => d.label?.toLowerCase() === 'in progress')?.count ??
    jobsOverview.in_progress_jobs ??
    performanceSummary.in_progress_jobs ??
    0
  );
  const chartOverdue = Number(
    rawChartData.find((d) => d.label?.toLowerCase() === 'overdue jobs')?.count ??
    jobsOverview.overdue_jobs ??
    performanceSummary.overdue_jobs ??
    0
  );
  const chartTotal = Number(
    rawChartData.find((d) => d.label?.toLowerCase() === 'total jobs')?.count ??
    jobsOverview.total_jobs ??
    performanceSummary.total_jobs ??
    (chartCompleted + chartPending + chartInProgress + chartOverdue) ??
    0
  );

  const completionRateVal =
    overview.completion_rate ??
    performanceSummary.completion_rate ??
    jobSummary.completion_rate ??
    (chartTotal > 0 ? Math.round((chartCompleted / chartTotal) * 100 * 10) / 10 : 0);

  // Donut chart gradient calculation
  const donutGradient = useMemo(() => {
    const sum = chartCompleted + chartPending + chartInProgress + chartOverdue;
    if (sum === 0) {
      return 'conic-gradient(#E5E7EB 0% 100%)';
    }
    const compPct = (chartCompleted / sum) * 100;
    const pendPct = (chartPending / sum) * 100;
    const inProgPct = (chartInProgress / sum) * 100;
    const overPct = (chartOverdue / sum) * 100;

    const stop1 = compPct;
    const stop2 = stop1 + pendPct;
    const stop3 = stop2 + inProgPct;
    const stop4 = stop3 + overPct;

    return `conic-gradient(
      #3D8B37 0% ${stop1}%,
      #F59E0B ${stop1}% ${stop2}%,
      #2563EB ${stop2}% ${stop3}%,
      #DC2626 ${stop3}% ${stop4}%
    )`;
  }, [chartCompleted, chartPending, chartInProgress, chartOverdue]);

  const getMaintenanceViewUrl = (item) => {
    const mId =
      item.action?.maintenance_id ||
      item.id ||
      item.maintenance_id;
    if (mId) {
      return `${pageRoutes.maintenance_detail}?id=${mId}`;
    }
    if (item.action?.view_url) {
      return item.action.view_url;
    }
    return pageRoutes.maintenance;
  };

  return (
    <Layout>
      <SubHeader
        title="Technician Details"
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
              data-bs-toggle="modal"
              data-bs-target="#blockTechnicianModal"
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              {active ? 'Block Technician' : 'Unblock Technician'}
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
            {/* Top Overview Cards Section */}
            <div className="row g-4 mb-4">
              {/* Left Overview Card: Profile Info */}
              <div className="col-lg-6">
                <div
                  className="bg-white p-4 h-100"
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0px 0px 21px 0px #E5E7EB70',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <h4 className="ct_head_clr ct_fs_20 ct_fw_700 mb-3">{displayName}</h4>
                  <div className="d-flex flex-column gap-3 ct_fs_14">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span className="text-muted d-flex align-items-center gap-2">
                        <i className="fa-regular fa-envelope" style={{ color: '#3D8B37' }}></i> Email:
                      </span>
                      <span className="ct_fw_600 text-dark text-break">
                        {overview.email || tech.email || 'N/A'}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span className="text-muted d-flex align-items-center gap-2">
                        <i className="fa-solid fa-phone" style={{ color: '#3D8B37' }}></i> Contact No.:
                      </span>
                      <span className="ct_fw_600 text-dark">
                        {overview.contact_number ||
                          (tech.country_code ? `${tech.country_code} ` : '') + (tech.phone_number || '') ||
                          'N/A'}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span className="text-muted d-flex align-items-center gap-2">
                        <i className="fa-solid fa-briefcase" style={{ color: '#3D8B37' }}></i> Role:
                      </span>
                      <span className="ct_fw_600 text-dark">
                        {overview.role || tech.job_role || 'Technician'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Overview Card: Green Brand Gradient Stats */}
              <div className="col-lg-6">
                <div
                  className="p-4 h-100 text-white d-flex flex-column justify-content-between"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #3D8B37 0%, #275F22 100%)',
                    boxShadow: '0 8px 24px rgba(61, 139, 55, 0.25)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between py-2 border-bottom border-white border-opacity-10">
                    <span className="ct_fs_15 ct_fw_500" style={{ opacity: 0.95 }}>
                      Total Tasks
                    </span>
                    <span className="ct_fs_20 ct_fw_700">
                      {overview.total_tasks ??
                        jobSummary.total_assigned_jobs ??
                        performanceSummary.total_jobs ??
                        0}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between py-2 border-bottom border-white border-opacity-10">
                    <span className="ct_fs_15 ct_fw_500" style={{ opacity: 0.95 }}>
                      Completion Rate
                    </span>
                    <span className="ct_fs_20 ct_fw_700">{completionRateVal}%</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between py-2">
                    <span className="ct_fs_15 ct_fw_500" style={{ opacity: 0.95 }}>
                      Hourly Rate
                    </span>
                    <span className="ct_fs_20 ct_fw_700">
                      {overview.hourly_rate !== null && overview.hourly_rate !== undefined
                        ? `$${overview.hourly_rate}`
                        : '$5'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Three Middle KPI Cards matching Dashboard Card design */}
            <div className="row g-4 mb-4">
              {/* Total Jobs (Green Gradient Card) */}
              <div className="col-xl-4 col-md-4 col-sm-6">
                <div
                  className="p-4 text-white d-flex align-items-center justify-content-between position-relative overflow-hidden h-100"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #3D8B37 0%, #2E6E29 100%)',
                    boxShadow: '0 8px 20px rgba(61, 139, 55, 0.22)',
                    minHeight: '110px',
                  }}
                >
                  <div>
                    <p className="mb-2 ct_fs_14 ct_fw_500" style={{ opacity: 0.95 }}>
                      Total Jobs
                    </p>
                    <h2 className="mb-0 ct_fs_32 ct_fw_700 text-white">{totalJobsCount}</h2>
                  </div>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* In Progress Jobs */}
              <div className="col-xl-4 col-md-4 col-sm-6">
                <div
                  className="ct_dash_card"
                  style={{
                    minHeight: '110px',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div className="ct_icon_box">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3D8B37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      <path d="M18 18L19.5 19.5" />
                    </svg>
                  </div>
                  <div className="ct_card_content flex-grow-1">
                    <p className="mb-1 text-muted">In Progress Jobs</p>
                    <h3 className="mb-0 ct_fs_28 ct_fw_700">{inProgressJobsCount}</h3>
                  </div>
                </div>
              </div>

              {/* Completed Jobs */}
              <div className="col-xl-4 col-md-4 col-sm-6">
                <div
                  className="ct_dash_card"
                  style={{
                    minHeight: '110px',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div className="ct_icon_box">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3D8B37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="ct_card_content flex-grow-1">
                    <p className="mb-1 text-muted">Completed Jobs</p>
                    <h3 className="mb-0 ct_fs_28 ct_fw_700">{completedJobsCount}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Header: Job History vs Technician Activity (Green Theme) */}
            <div className="d-flex align-items-center gap-4 border-bottom mb-4">
              <button
                type="button"
                className="btn border-0 px-0 pb-3 ct_fs_16 ct_fw_700 position-relative"
                style={{
                  background: 'none',
                  color: activeTab === 'history' ? '#3D8B37' : '#64748B',
                  borderBottom: activeTab === 'history' ? '3px solid #3D8B37' : '3px solid transparent',
                  borderRadius: 0,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveTab('history')}
              >
                Job History
              </button>

              <button
                type="button"
                className="btn border-0 px-0 pb-3 ct_fs_16 ct_fw_700 position-relative"
                style={{
                  background: 'none',
                  color: activeTab === 'activity' ? '#3D8B37' : '#64748B',
                  borderBottom: activeTab === 'activity' ? '3px solid #3D8B37' : '3px solid transparent',
                  borderRadius: 0,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveTab('activity')}
              >
                Technician Activity
              </button>
            </div>

            {/* TAB 1: JOB HISTORY */}
            {activeTab === 'history' && (
              <section
                className="bg-white p-4"
                style={{
                  borderRadius: '20px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0px 0px 21px 0px #E5E7EB70',
                }}
              >
                {/* Header with Title and Responsive Search & Filters Row */}
                <div className="row g-3 align-items-center justify-content-between mb-4">
                  <div className="col-xl-4 col-lg-3 col-md-12">
                    <h5 className="ct_fs_18 ct_fw_700 ct_head_clr mb-0">Job History</h5>
                  </div>

                  <div className="col-xl-8 col-lg-9 col-md-12">
                    <div className="row g-2 justify-content-lg-end align-items-center">
                      {/* Search Input */}
                      <div className="col-12 col-sm-6 col-md-5 col-lg-5">
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
                            placeholder="Search job or reg. no..."
                            value={historySearchTerm}
                            onChange={(e) => setHistorySearchTerm(e.target.value)}
                            style={{ height: '44px', borderRadius: '10px' }}
                          />

                          {historySearchTerm && (
                            <button
                              type="button"
                              className="btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                              onClick={() => setHistorySearchTerm('')}
                              aria-label="Clear search"
                              style={{ background: 'none', cursor: 'pointer', zIndex: 5 }}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div className="col-6 col-sm-3 col-md-3 col-lg-3">
                        <select
                          className="form-select ct_input ct_fs_13"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          style={{ height: '44px', borderRadius: '10px' }}
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="overdue">Overdue</option>
                          <option value="invoiced">Invoiced</option>
                        </select>
                      </div>

                      {/* Priority Dropdown */}
                      <div className="col-6 col-sm-3 col-md-4 col-lg-3">
                        <select
                          className="form-select ct_input ct_fs_13"
                          value={selectedPriority}
                          onChange={(e) => setSelectedPriority(e.target.value)}
                          style={{ height: '44px', borderRadius: '10px' }}
                        >
                          <option value="all">All Priority</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job History Table */}
                <div className="table-responsive ct_custom_table">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>S.NO</th>
                        <th>JOB NAME</th>
                        <th>VAN REG.</th>
                        <th>DATE SCHEDULED</th>
                        <th>PRIORITY</th>
                        <th>STATUS</th>
                        <th style={{ width: '90px' }} className="text-center">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedJobHistory.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted ct_fs_14">
                            {historySearchTerm || selectedStatus !== 'all' || selectedPriority !== 'all'
                              ? 'No jobs match your filter criteria.'
                              : 'No job history available for this technician.'}
                          </td>
                        </tr>
                      ) : (
                        displayedJobHistory.map((item, index) => {
                          const sNo = item.s_no || currentPage * listPerPages + index + 1;
                          const jobName = item.job_name || item.title || 'N/A';
                          const vanReg =
                            item.van_registration_number ||
                            item.registration_number ||
                            item.van?.registration_number ||
                            'N/A';
                          const priority = item.priority || 'medium';
                          const status = item.status || 'pending';
                          const viewUrl = getMaintenanceViewUrl(item);

                          return (
                            <tr key={item.id || item.maintenance_id || index}>
                              <td>{sNo}</td>
                              <td className="ct_fw_600">{jobName}</td>
                              <td>{vanReg}</td>
                              <td>{formatScheduledDate(item)}</td>
                              <td>
                                <span
                                  className="badge px-3 py-1 text-capitalize"
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    borderRadius: '6px',
                                    ...getPriorityBadgeStyle(priority),
                                  }}
                                >
                                  {priority}
                                </span>
                              </td>
                              <td>{renderStatusIndicator(status)}</td>
                              <td className="text-center">
                                <Link
                                  to={viewUrl}
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

                {/* Pagination */}
                {totalHistoryItems > 10 && (
                  <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                    <div>
                      <PaginationDropdown
                        listPerPages={listPerPages}
                        options={[5, 10, 25, 50]}
                        onChange={(val) => {
                          setListPerPages(val);
                          setCurrentPage(0);
                        }}
                      />
                    </div>
                    <div>
                      <ReactPagination
                        pageCount={totalHistoryPages}
                        onPageChange={({ selected }) => setCurrentPage(selected)}
                        currentPage={currentPage}
                      />
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* TAB 2: TECHNICIAN ACTIVITY */}
            {activeTab === 'activity' && (
              <div className="d-flex flex-column gap-4">
                {/* 1. Performance Summary Grid (6 Cards) */}
                <section
                  className="bg-white p-4"
                  style={{
                    borderRadius: '20px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0px 0px 21px 0px #E5E7EB70',
                  }}
                >
                  <h5 className="ct_fs_18 ct_fw_700 ct_head_clr mb-4">Performance Summary</h5>

                  <div className="row g-3">
                    {/* Total Jobs */}
                    <div className="col-lg-4 col-md-6">
                      <div
                        className="p-3 d-flex align-items-center justify-content-between"
                        style={{
                          borderRadius: '14px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#FAFAFA',
                        }}
                      >
                        <div>
                          <p className="mb-1 ct_fs_13 ct_fw_500 text-muted">Total Jobs</p>
                          <h3 className="mb-0 ct_fs_24 ct_fw_700 ct_head_clr">
                            {performanceSummary.total_jobs ?? jobSummary.total_assigned_jobs ?? 0}
                          </h3>
                        </div>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: '#F5FCF5',
                            border: '1px solid #3D8B3730',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i className="fa-regular fa-clipboard fs-5" style={{ color: '#3D8B37' }}></i>
                        </div>
                      </div>
                    </div>

                    {/* Completed Jobs */}
                    <div className="col-lg-4 col-md-6">
                      <div
                        className="p-3 d-flex align-items-center justify-content-between"
                        style={{
                          borderRadius: '14px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#FAFAFA',
                        }}
                      >
                        <div>
                          <p className="mb-1 ct_fs_13 ct_fw_500 text-muted">Completed Jobs</p>
                          <h3 className="mb-0 ct_fs_24 ct_fw_700 ct_head_clr">
                            {performanceSummary.completed_jobs ?? jobSummary.total_completed_jobs ?? 0}
                          </h3>
                        </div>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: '#DCFCE7',
                            border: '1px solid #22C55E30',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i className="fa-solid fa-circle-check text-success fs-5"></i>
                        </div>
                      </div>
                    </div>

                    {/* Pending Jobs */}
                    <div className="col-lg-4 col-md-6">
                      <div
                        className="p-3 d-flex align-items-center justify-content-between"
                        style={{
                          borderRadius: '14px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#FAFAFA',
                        }}
                      >
                        <div>
                          <p className="mb-1 ct_fs_13 ct_fw_500 text-muted">Pending Jobs</p>
                          <h3 className="mb-0 ct_fs_24 ct_fw_700 ct_head_clr">
                            {performanceSummary.pending_jobs ?? jobSummary.pending_jobs ?? 0}
                          </h3>
                        </div>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #F59E0B30',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i className="fa-regular fa-clock text-warning fs-5"></i>
                        </div>
                      </div>
                    </div>

                    {/* In Progress */}
                    <div className="col-lg-4 col-md-6">
                      <div
                        className="p-3 d-flex align-items-center justify-content-between"
                        style={{
                          borderRadius: '14px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#FAFAFA',
                        }}
                      >
                        <div>
                          <p className="mb-1 ct_fs_13 ct_fw_500 text-muted">In Progress</p>
                          <h3 className="mb-0 ct_fs_24 ct_fw_700 ct_head_clr">
                            {performanceSummary.in_progress_jobs ??
                              performanceSummary.in_progress ??
                              jobSummary.in_progress_jobs ??
                              0}
                          </h3>
                        </div>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: '#E0F2FE',
                            border: '1px solid #0284C730',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i className="fa-solid fa-clipboard-user text-info fs-5"></i>
                        </div>
                      </div>
                    </div>

                    {/* Overdue Jobs */}
                    <div className="col-lg-4 col-md-6">
                      <div
                        className="p-3 d-flex align-items-center justify-content-between"
                        style={{
                          borderRadius: '14px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#FAFAFA',
                        }}
                      >
                        <div>
                          <p className="mb-1 ct_fs_13 ct_fw_500 text-muted">Overdue Jobs</p>
                          <h3 className="mb-0 ct_fs_24 ct_fw_700 ct_head_clr">
                            {performanceSummary.overdue_jobs ?? jobSummary.overdue_jobs ?? 0}
                          </h3>
                        </div>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: '#FEE2E2',
                            border: '1px solid #EF444430',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i className="fa-regular fa-calendar-xmark text-danger fs-5"></i>
                        </div>
                      </div>
                    </div>

                    {/* Completion Rate */}
                    <div className="col-lg-4 col-md-6">
                      <div
                        className="p-3 d-flex align-items-center justify-content-between"
                        style={{
                          borderRadius: '14px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#FAFAFA',
                        }}
                      >
                        <div>
                          <p className="mb-1 ct_fs_13 ct_fw_500 text-muted">Completion Rate</p>
                          <h3 className="mb-0 ct_fs_24 ct_fw_700 ct_head_clr">
                            {completionRateVal}%
                          </h3>
                        </div>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: '#F3F4F6',
                            border: '1px solid #9CA3AF30',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i className="fa-solid fa-percent text-secondary fs-5"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. Jobs Overview: Donut Chart + Horizontal Status Bars */}
                <section
                  className="bg-white p-4"
                  style={{
                    borderRadius: '20px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0px 0px 21px 0px #E5E7EB70',
                  }}
                >
                  <h5 className="ct_fs_18 ct_fw_700 ct_head_clr mb-4">Jobs Overview</h5>

                  <div className="row align-items-center g-4">
                    {/* Left: Donut Chart & Legend */}
                    <div className="col-lg-5 col-md-12 d-flex flex-column align-items-center">
                      <div
                        style={{
                          width: '180px',
                          height: '180px',
                          borderRadius: '50%',
                          background: donutGradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        {/* Inner Hole */}
                        <div
                          style={{
                            width: '126px',
                            height: '126px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)',
                          }}
                        >
                          <span className="ct_fs_22 ct_fw_700 ct_head_clr">
                            {completionRateVal}%
                          </span>
                          <span className="ct_fs_12 text-muted ct_fw_500">Done</span>
                        </div>
                      </div>

                      {/* Legend below donut */}
                      <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mt-4 ct_fs_12">
                        <span className="d-flex align-items-center gap-1">
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: '#3D8B37',
                            }}
                          />
                          <span className="text-muted ct_fw_500">Completed</span>
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: '#F59E0B',
                            }}
                          />
                          <span className="text-muted ct_fw_500">Pending</span>
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: '#2563EB',
                            }}
                          />
                          <span className="text-muted ct_fw_500">In Progress</span>
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: '#DC2626',
                            }}
                          />
                          <span className="text-muted ct_fw_500">Overdue</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Horizontal Status Bars */}
                    <div className="col-lg-7 col-md-12">
                      <div className="d-flex flex-column gap-3">
                        {/* Total Bar */}
                        <div>
                          <div className="d-flex justify-content-between ct_fs_13 ct_fw_600 mb-1">
                            <span className="text-muted">Total</span>
                            <span className="ct_head_clr">{chartTotal}</span>
                          </div>
                          <div
                            style={{
                              height: '8px',
                              borderRadius: '10px',
                              backgroundColor: '#F3F4F6',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: chartTotal > 0 ? '100%' : '0%',
                                height: '100%',
                                backgroundColor: '#3D8B37',
                                borderRadius: '10px',
                              }}
                            />
                          </div>
                        </div>

                        {/* Completed Bar */}
                        <div>
                          <div className="d-flex justify-content-between ct_fs_13 ct_fw_600 mb-1">
                            <span className="text-muted">Completed</span>
                            <span className="ct_head_clr">{chartCompleted}</span>
                          </div>
                          <div
                            style={{
                              height: '8px',
                              borderRadius: '10px',
                              backgroundColor: '#F3F4F6',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width:
                                  chartTotal > 0
                                    ? `${(chartCompleted / chartTotal) * 100}%`
                                    : '0%',
                                height: '100%',
                                backgroundColor: '#3D8B37',
                                borderRadius: '10px',
                              }}
                            />
                          </div>
                        </div>

                        {/* Pending Bar */}
                        <div>
                          <div className="d-flex justify-content-between ct_fs_13 ct_fw_600 mb-1">
                            <span className="text-muted">Pending</span>
                            <span className="ct_head_clr">{chartPending}</span>
                          </div>
                          <div
                            style={{
                              height: '8px',
                              borderRadius: '10px',
                              backgroundColor: '#F3F4F6',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width:
                                  chartTotal > 0
                                    ? `${(chartPending / chartTotal) * 100}%`
                                    : '0%',
                                height: '100%',
                                backgroundColor: '#F59E0B',
                                borderRadius: '10px',
                              }}
                            />
                          </div>
                        </div>

                        {/* In Progress Bar */}
                        <div>
                          <div className="d-flex justify-content-between ct_fs_13 ct_fw_600 mb-1">
                            <span className="text-muted">In Progress</span>
                            <span className="ct_head_clr">{chartInProgress}</span>
                          </div>
                          <div
                            style={{
                              height: '8px',
                              borderRadius: '10px',
                              backgroundColor: '#F3F4F6',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width:
                                  chartTotal > 0
                                    ? `${(chartInProgress / chartTotal) * 100}%`
                                    : '0%',
                                height: '100%',
                                backgroundColor: '#2563EB',
                                borderRadius: '10px',
                              }}
                            />
                          </div>
                        </div>

                        {/* Overdue Bar */}
                        <div>
                          <div className="d-flex justify-content-between ct_fs_13 ct_fw_600 mb-1">
                            <span className="text-muted">Overdue</span>
                            <span className="ct_head_clr">{chartOverdue}</span>
                          </div>
                          <div
                            style={{
                              height: '8px',
                              borderRadius: '10px',
                              backgroundColor: '#F3F4F6',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width:
                                  chartTotal > 0
                                    ? `${(chartOverdue / chartTotal) * 100}%`
                                    : '0%',
                                height: '100%',
                                backgroundColor: '#DC2626',
                                borderRadius: '10px',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Vans Worked On Table */}
                {vansWorkedOn.length > 0 && (
                  <section
                    className="bg-white p-4"
                    style={{
                      borderRadius: '20px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0px 0px 21px 0px #E5E7EB70',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h5 className="ct_fs_18 ct_fw_700 ct_head_clr mb-0">Vans Worked On</h5>
                      <span className="badge bg-light text-dark border px-3 py-1 ct_fs_13">
                        Total Vans: <strong className="text-success">{vansWorkedOn.length}</strong>
                      </span>
                    </div>

                    <div className="table-responsive ct_custom_table">
                      <table className="table align-middle mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '60px' }}>S.NO</th>
                            <th>VAN NAME</th>
                            <th>REGISTRATION NO.</th>
                            <th>MAKE / MODEL</th>
                            <th>OWNER</th>
                            <th>STATUS</th>
                            <th style={{ width: '90px' }} className="text-center">
                              ACTION
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedVans.map((van, index) => {
                            const sNo = van.s_no || vansCurrentPage * vansPerPage + index + 1;
                            const vId = van.van_id || van.id;

                            return (
                              <tr key={vId || index}>
                                <td>{sNo}</td>
                                <td className="ct_fw_600">{van.van_name || 'N/A'}</td>
                                <td>{van.registration_number || 'N/A'}</td>
                                <td>{van.make_model || 'N/A'}</td>
                                <td>{van.owner || 'N/A'}</td>
                                <td>{renderStatusIndicator(van.status)}</td>
                                <td className="text-center">
                                  {vId ? (
                                    <Link
                                      to={`${pageRoutes.van_detail}?van_id=${vId}`}
                                      className="ct_action_icon_btn ct_view_btn"
                                      title="View Van Details"
                                    >
                                      <i className="fa-regular fa-eye"></i>
                                    </Link>
                                  ) : (
                                    '-'
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {vansWorkedOn.length > vansPerPage && (
                      <div className="d-flex justify-content-end align-items-center mt-3">
                        <ReactPagination
                          pageCount={totalVansPages}
                          onPageChange={({ selected }) => setVansCurrentPage(selected)}
                          currentPage={vansCurrentPage}
                        />
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Block / Unblock Confirmation Modal */}
      <div
        className="modal fade"
        id="blockTechnicianModal"
        tabIndex="-1"
        aria-labelledby="blockTechnicianModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content ct_modal">
            <div className="modal-body p-4 position-relative">
              {/* Close Icon */}
              <button
                type="button"
                ref={modalCloseRef}
                className="btn-close ct_delete_close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div className="text-center">
                <div className="mb-3">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: active ? '#FEE2E2' : '#DCFCE7',
                    }}
                  >
                    <i
                      className={`fa-solid ${
                        active
                          ? 'fa-user-slash text-danger fs-3'
                          : 'fa-user-check text-success fs-3'
                      }`}
                    ></i>
                  </div>
                </div>

                <h4 className="ct_head_clr ct_fs_20 ct_fw_700 mb-2">
                  {active ? 'Block Technician?' : 'Unblock Technician?'}
                </h4>

                <p className="ct_para_clr ct_fs_14 mb-4">
                  {active
                    ? `Are you sure you want to block "${displayName}"? They will not be able to accept or work on new maintenance jobs until unblocked.`
                    : `Are you sure you want to unblock "${displayName}"? They will regain access to take assigned maintenance jobs.`}
                </p>

                <div className="d-flex align-items-center justify-content-center gap-3">
                  <button
                    type="button"
                    className="btn btn-secondary px-4 py-2 ct_fs_14 ct_fw_600"
                    data-bs-dismiss="modal"
                    style={{ borderRadius: '10px' }}
                    disabled={isActionLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className={`btn ${active ? 'btn-danger' : 'btn-success'} px-4 py-2 ct_fs_14 ct_fw_600`}
                    style={
                      active
                        ? {
                            backgroundColor: '#EF4444',
                            borderColor: '#EF4444',
                            color: '#fff',
                            borderRadius: '10px',
                            fontWeight: '600',
                          }
                        : {
                            borderRadius: '10px',
                            fontWeight: '600',
                          }
                    }
                    onClick={handleToggleStatus}
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : null}
                    {active ? 'Yes, Block' : 'Yes, Unblock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TechnicianDetail;
