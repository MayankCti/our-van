import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import { pageRoutes } from '../../routes/PageRoutes';
import {
  getTechnicianMaintenanceDetail,
  clearMaintenanceDetails,
} from '../../redux/slices/maintenanceSlice';

const MaintenanceDetail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('id') || searchParams.get('maintenance_id');

  const {
    taskDetails,
    isDetailsLoading = false,
    detailsError = null,
  } = useSelector((state) => state.maintenanceReducer || {});

  useEffect(() => {
    if (taskId) {
      dispatch(getTechnicianMaintenanceDetail({ id: taskId }));
    }
    return () => {
      dispatch(clearMaintenanceDetails());
    };
  }, [dispatch, taskId]);

  const task = taskDetails?.data || taskDetails || {};
  const van = task.van || task.van_details || {};
  const dealer = task.dealer || {};
  const services = Array.isArray(task.services) ? task.services : [];

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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
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
      case 'accepted':
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

  const taskStatusVal = task.task_status || 'pending';
  const dealerName = dealer.name || dealer.dealer_name || 'N/A';

  return (
    <Layout>
      <SubHeader
        title="Maintenance Details"
        subtitle={
          task.created_at
            ? `Created on ${formatDateTime(task.created_at)}`
            : 'View complete maintenance task specifications, vehicle info, and quotation.'
        }
        backUrl={pageRoutes.maintenance}
        className="ct_flex_col_767"
      >
        {task?.maintenance_id || task?.id ? (
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {task.priority && (
              <span
                className={`badge ${getPriorityBadgeClass(task.priority)} text-capitalize`}
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '6px 14px',
                  borderRadius: '20px',
                }}
              >
                Priority: {task.priority}
              </span>
            )}
            <span
              className={`badge ${getStatusBadgeClass(taskStatusVal)} text-capitalize`}
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: '20px',
              }}
            >
              Status: {taskStatusVal}
            </span>
          </div>
        ) : null}
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-5">
        {isDetailsLoading && !task?.maintenance_id && !task?.id ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="spinner-border text-success mb-3 mx-auto" role="status"></div>
            <p className="text-muted ct_fs_15 mb-0">Loading maintenance task details...</p>
          </div>
        ) : !taskId || (!task?.maintenance_id && !task?.id && !isDetailsLoading) ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <i className="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Task Not Found</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              {detailsError || 'The requested maintenance task could not be found or has been removed.'}
            </p>
            <div className="d-flex justify-content-center">
              <Link to={pageRoutes.maintenance} className="ct_green_btn px-4 py-2">
                Back to Maintenance List
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Left Column: Task Overview & Services */}
            <div className="col-xl-8">
              {/* Task Overview Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 flex-wrap gap-2">
                  <div>
                    <h5 className="ct_head_clr ct_fw_700 mb-1">
                      {task.title || 'Untitled Maintenance Task'}
                    </h5>
                    <span className="badge bg-light text-secondary border px-2 py-1 ct_fs_12">
                      <i className="fa-solid fa-wrench me-1 text-success"></i>
                      {task.maintenance_type || 'General Service'}
                    </span>
                  </div>
                  {task.estimated_hours && (
                    <div className="text-end">
                      <span className="text-muted ct_fs_12 d-block">Estimated Hours</span>
                      <span className="ct_fw_700 ct_fs_16 text-dark">
                        {task.estimated_hours} Hours
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="ct_fs_13 ct_fw_600 text-muted mb-1">Description & Instructions</label>
                  <p className="ct_para_clr ct_fs_14 mb-0 bg-light p-3 rounded-3">
                    {task.description || 'No specific description provided for this maintenance task.'}
                  </p>
                </div>

                {/* Grid details */}
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="p-3 border rounded-3 bg-light-subtle">
                      <span className="text-muted ct_fs_12 d-block mb-1">
                        <i className="fa-regular fa-calendar-days me-1 text-success"></i>
                        Scheduled Date & Time
                      </span>
                      <span className="ct_fw_600 text-dark ct_fs_14">
                        {formatDate(task.schedule_date)}{' '}
                        {task.schedule_time && `at ${formatTime(task.schedule_time)}`}
                      </span>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="p-3 border rounded-3 bg-light-subtle">
                      <span className="text-muted ct_fs_12 d-block mb-1">
                        <i className="fa-solid fa-location-dot me-1 text-danger"></i>
                        Job Location
                      </span>
                      <span className="ct_fw_600 text-dark ct_fs_14">
                        {task.job_location || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Table Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                  <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-list-check text-success"></i>
                    <span>Requested Services ({services.length})</span>
                  </h6>
                </div>

                {services.length === 0 ? (
                  <div className="p-4 text-center text-muted ct_fs_14">
                    No services associated with this maintenance task.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table ct_custom_table align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Service Name</th>
                          <th>Service Type</th>
                          <th className="text-end">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((srv, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td className="ct_fw_600 text-dark">{srv.service_name || srv.name}</td>
                            <td>
                              {srv.is_custom ? (
                                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1">
                                  Custom
                                </span>
                              ) : (
                                <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1">
                                  System
                                </span>
                              )}
                            </td>
                            <td className="text-end ct_fw_700 text-dark">
                              {formatCurrency(srv.cost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Van Details, Dealer Details, Quotation */}
            <div className="col-xl-4">
              {/* Vehicle Information Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                  <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-van-shuttle text-success"></i>
                    <span>Vehicle Information</span>
                  </h6>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div>
                    <span className="text-muted ct_fs_12 d-block">Van Name</span>
                    <span className="ct_fw_700 ct_fs_15 text-dark">
                      {van.van_name || (van.make ? `${van.make} ${van.model || ''}` : 'N/A')}
                    </span>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <span className="text-muted ct_fs_12 d-block">Registration</span>
                      <span className="ct_fw_600 ct_fs_13 text-dark">
                        {van.registration_number || 'N/A'}
                      </span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted ct_fs_12 d-block">Year / Model</span>
                      <span className="ct_fw_600 ct_fs_13 text-dark">
                        {van.year || van.model || 'N/A'} {van.make ? `• ${van.make}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned By (Dealer) Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                  <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-building text-success"></i>
                    <span>Assigned By (Dealer)</span>
                  </h6>
                </div>

                <div className="d-flex flex-column gap-2 ct_fs_14">
                  <div>
                    <span className="text-muted ct_fs_12 d-block">Dealer Name</span>
                    <span className="ct_fw_700 text-dark ct_fs_15">{dealerName}</span>
                  </div>

                  {dealer.email && (
                    <div className="d-flex align-items-center gap-2 text-muted mt-1">
                      <i className="fa-regular fa-envelope text-success"></i>
                      <a href={`mailto:${dealer.email}`} className="text-decoration-none text-dark">
                        {dealer.email}
                      </a>
                    </div>
                  )}

                  {dealer.phone && (
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <i className="fa-solid fa-phone text-success"></i>
                      <a href={`tel:${dealer.phone}`} className="text-decoration-none text-dark">
                        {dealer.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Quotation / Total Cost Card */}
              <div
                className="card border-0 shadow-sm rounded-4 p-4 text-white"
                style={{
                  background: 'linear-gradient(135deg, #0f5132 0%, #198754 100%)',
                }}
              >
                <h6 className="ct_fw_700 mb-3 text-white d-flex align-items-center gap-2 border-bottom border-light pb-2">
                  <i className="fa-solid fa-file-invoice-dollar"></i>
                  <span>Quotation Breakdown</span>
                </h6>

                <div className="d-flex flex-column gap-2 ct_fs_14">
                  <div className="d-flex justify-content-between text-light">
                    <span>Total Services:</span>
                    <span className="ct_fw_600">
                      {services.length} Item(s)
                    </span>
                  </div>

                  <div className="border-top border-light pt-3 mt-2 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-light ct_fs_12 d-block">Total Task Amount</span>
                      <h4 className="ct_fw_700 mb-0 text-white">
                        {formatCurrency(task.total_amount)}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MaintenanceDetail;
