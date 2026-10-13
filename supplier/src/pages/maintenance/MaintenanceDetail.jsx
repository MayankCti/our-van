import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import { pageRoutes } from '../../routes/PageRoutes';
import {
  getSupplierMaintenanceDetail,
  respondToSupplierMaintenanceTask,
  clearMaintenanceDetails,
} from '../../redux/slices/maintenanceSlice';

const MaintenanceDetail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('id') || searchParams.get('maintenance_id');
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    taskDetails,
    isDetailsLoading = false,
    detailsError = null,
  } = useSelector((state) => state.maintenanceReducer || {});

  useEffect(() => {
    if (taskId) {
      dispatch(getSupplierMaintenanceDetail({ id: taskId }));
    }
    return () => {
      dispatch(clearMaintenanceDetails());
    };
  }, [dispatch, taskId]);

  const task = taskDetails?.data || taskDetails || {};
  const van = task.van || task.van_details || {};
  const dealer = task.dealer || task.dealer_details || {};
  const services = Array.isArray(task.services) ? task.services : [];
  const quotation = task.quotation_breakdown || task.quotation || {};
  const partsUsed = Array.isArray(task.parts_used) ? task.parts_used : [];
  const consumables = Array.isArray(task.consumables) ? task.consumables : [];
  const partRequests = Array.isArray(task.part_requests) ? task.part_requests : [];
  const cdsSheet = task.cds_sheet || null;
  const completion = task.completion || null;
  const completionImages = Array.isArray(task.completion_images) ? task.completion_images : [];
  const timer = task.timer || null;

  const handleSupplierResponse = (newStatus) => {
    if (!taskId || !newStatus || isUpdating) return;
    setIsUpdating(true);
    dispatch(
      respondToSupplierMaintenanceTask({
        id: taskId,
        status: newStatus,
        callback: (res) => {
          setIsUpdating(false);
          if (res?.success || res?.status || res?.statusCode === 200) {
            dispatch(getSupplierMaintenanceDetail({ id: taskId }));
          }
        },
      })
    );
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

  const formatMinutes = (mins) => {
    if (!mins && mins !== 0) return 'N/A';
    const m = Number(mins);
    if (isNaN(m)) return 'N/A';
    if (m < 60) return `${m} mins`;
    const hrs = Math.floor(m / 60);
    const remain = m % 60;
    return remain > 0 ? `${hrs} hr ${remain} mins` : `${hrs} hrs`;
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

  const resolveImageUrl = (imgObjOrUrl) => {
    if (!imgObjOrUrl) return '/image.png';
    const rawUrl =
      typeof imgObjOrUrl === 'string'
        ? imgObjOrUrl
        : imgObjOrUrl.file_url || imgObjOrUrl.url || imgObjOrUrl.file_name || '';
    if (!rawUrl) return '/image.png';
    if (
      rawUrl.startsWith('http://') ||
      rawUrl.startsWith('https://') ||
      rawUrl.startsWith('blob:') ||
      rawUrl.startsWith('data:')
    ) {
      return rawUrl;
    }
    if (rawUrl.startsWith('/')) {
      return rawUrl;
    }
    return `/assets/img/${rawUrl}`;
  };

  const isCommenceTask = (status) => {
    const s = String(status || '').toLowerCase().trim().replace(/[\s_-]+/g, '');
    return s === 'commencedtask' || s === 'commencetask' || s === 'commence' || s === 'overdue';
  };

  const isCommenced = (status) => {
    const s = String(status || '').toLowerCase().trim().replace(/[\s_-]+/g, '');
    return s === 'commenced' || s === 'inprogress';
  };

  const isCompletedTask = (status) => {
    const s = String(status || '').toLowerCase().trim().replace(/[\s_-]+/g, '');
    return s === 'completed' || task.is_completed === true;
  };

  const formatStatusLabel = (status) => {
    if (!status) return 'Pending';
    const s = String(status).toLowerCase().trim().replace(/[\s_-]+/g, '');
    if (s === 'commencedtask' || s === 'commencetask' || s === 'commence') {
      return 'Commence Task';
    }
    if (s === 'inprogress' || s === 'in_progress') {
      return 'In Progress';
    }
    if (s === 'commenced') {
      return 'Commenced';
    }
    if (s === 'overdue') {
      return 'Overdue';
    }
    return String(status)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getStatusBadgeClass = (status) => {
    const s = String(status || '').toLowerCase().replace(/[\s_-]+/g, '');
    switch (s) {
      case 'completed':
      case 'accepted':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'inprogress':
      case 'commencedtask':
      case 'commenced':
      case 'commence':
      case 'commencetask':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'pending':
        return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'overdue':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      case 'cancelled':
      case 'rejected':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    }
  };

  const taskStatusVal = task.task_status || task.status || 'pending';
  const supplierStatusVal = (task.supplier_status || 'pending').toLowerCase();
  const dealerName = dealer.full_name || dealer.dealer_name || dealer.name || 'N/A';

  // Calculations for used parts, consumables, and services
  const totalServicesCost =
    quotation.services_total ??
    quotation.total_services ??
    quotation.system_services_total ??
    task.services_total ??
    task.estimated_services_amount ??
    services.reduce((acc, s) => acc + (Number(s.cost) || 0), 0);

  const totalPartsCost =
    quotation.parts_total ??
    task.parts_total ??
    partsUsed.reduce((acc, p) => acc + (Number(p.total_cost) || 0), 0);

  const totalConsumablesCost =
    quotation.consumables_total ??
    task.consumables_total ??
    consumables.reduce((acc, c) => acc + (Number(c.total_price) || 0), 0);

  const grandTotalCost =
    task.total_amount ??
    task.grand_total ??
    quotation.total_amount ??
    quotation.grand_total ??
    (Number(totalServicesCost || 0) + Number(totalPartsCost || 0) + Number(totalConsumablesCost || 0));

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
              className={`badge ${getStatusBadgeClass(taskStatusVal)}`}
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: '20px',
              }}
            >
              Task: {formatStatusLabel(taskStatusVal)}
            </span>
            <span
              className={`badge ${getStatusBadgeClass(supplierStatusVal)}`}
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: '20px',
              }}
            >
              Supplier: {formatStatusLabel(supplierStatusVal)}
            </span>

            {/* If commence_task -> CDS Job Sheet button */}
            {isCommenceTask(taskStatusVal) && (
              <Link
                to={`${pageRoutes.maintenance_cds_sheet}?id=${taskId}`}
                className="btn btn-sm btn-primary px-3 fw-semibold shadow-sm text-decoration-none d-inline-flex align-items-center gap-1 ms-1"
                style={{ borderRadius: '8px' }}
                title="Open CDS Job Sheet"
              >
                <i className="fa-solid fa-file-signature"></i>
                <span>CDS Job Sheet</span>
              </Link>
            )}

            {/* If commenced / inprogress -> Complete Task button */}
            {isCommenced(taskStatusVal) && (
              <Link
                to={`${pageRoutes.maintenance_complete_task}?id=${taskId}`}
                className="btn btn-sm btn-success px-3 fw-semibold shadow-sm text-decoration-none d-inline-flex align-items-center gap-1 ms-1"
                style={{ borderRadius: '8px' }}
                title="Complete Maintenance Task"
              >
                <i className="fa-solid fa-circle-check"></i>
                <span>Complete Task</span>
              </Link>
            )}



            {/* Accept / Reject actions if supplier status is pending */}
            {supplierStatusVal === 'pending' && (
              <div className="d-flex align-items-center gap-2 ms-2">
                <button
                  type="button"
                  className="btn btn-sm btn-success px-3 fw-semibold shadow-sm"
                  disabled={isUpdating}
                  onClick={() => handleSupplierResponse('accepted')}
                  style={{ borderRadius: '8px' }}
                >
                  {isUpdating ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  ) : (
                    <i className="fa-solid fa-check me-1"></i>
                  )}
                  Accept Task
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger px-3 fw-semibold shadow-sm bg-white"
                  disabled={isUpdating}
                  onClick={() => handleSupplierResponse('rejected')}
                  style={{ borderRadius: '8px' }}
                >
                  {isUpdating ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  ) : (
                    <i className="fa-solid fa-xmark me-1"></i>
                  )}
                  Reject Task
                </button>
              </div>
            )}
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
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex justify-content-center mb-3">
              <i className="fa-solid fa-triangle-exclamation text-warning fs-1"></i>
            </div>
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
            {/* Left Column */}
            <div className="col-xl-8">
              {/* 1. Task Overview Card */}
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

                {/* Timer Info (if available) */}
                {timer && (timer.job_start_time || timer.total_active_minutes !== undefined) && (
                  <div className="mt-3 p-3 border rounded-3" style={{ backgroundColor: '#F8FAFC' }}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <i className="fa-solid fa-stopwatch text-primary fs-5"></i>
                        <div>
                          <span className="ct_fs_12 text-muted d-block">Work Duration</span>
                          <span className="ct_fw_700 text-dark ct_fs_14">
                            {formatMinutes(timer.total_active_minutes ?? timer.current_active_minutes)}
                          </span>
                        </div>
                      </div>

                      {timer.job_start_time && (
                        <div>
                          <span className="ct_fs_12 text-muted d-block">Job Started</span>
                          <span className="ct_fw_600 text-dark ct_fs_13">
                            {formatDateTime(timer.job_start_time)}
                          </span>
                        </div>
                      )}

                      {timer.job_end_time && (
                        <div>
                          <span className="ct_fs_12 text-muted d-block">Job Ended</span>
                          <span className="ct_fw_600 text-dark ct_fs_13">
                            {formatDateTime(timer.job_end_time)}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="badge bg-secondary-subtle text-dark border px-2 py-1 ct_fs_12 text-capitalize">
                          Timer: {timer.timer_status || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Task Completion Report Card (Shown if task is completed / has completion data) */}
              {(completion || completionImages.length > 0) && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 flex-wrap gap-2">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-clipboard-check text-success fs-5"></i>
                      <span>Task Completion Report</span>
                    </h6>
                    {completion?.completed_at && (
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 ct_fs_12">
                        Completed on {formatDateTime(completion.completed_at)}
                      </span>
                    )}
                  </div>

                  <div className="row g-3">
                    {/* Task Info */}
                    {completion?.task_info && (
                      <div className="col-12">
                        <label className="ct_fs_13 ct_fw_600 text-muted mb-1">
                          Task Summary / Work Details
                        </label>
                        <div className="p-3 border rounded-3 bg-light text-dark ct_fs_14">
                          {completion.task_info}
                        </div>
                      </div>
                    )}

                    {/* Maintenance Notes */}
                    {completion?.notes && (
                      <div className="col-12">
                        <label className="ct_fs_13 ct_fw_600 text-muted mb-1">
                          Notes / Observations
                        </label>
                        <div className="p-3 border rounded-3 bg-light text-dark ct_fs_14">
                          {completion.notes}
                        </div>
                      </div>
                    )}

                    {/* Future Watch List */}
                    {completion?.future_watch_list && (
                      <div className="col-md-6">
                        <label className="ct_fs_13 ct_fw_600 text-muted mb-1">
                          Future Watch List / Recommendations
                        </label>
                        <div className="p-3 border rounded-3 bg-light text-dark ct_fs_14">
                          {completion.future_watch_list}
                        </div>
                      </div>
                    )}

                    {/* Next Recommended Due Date */}
                    {completion?.recommended_due_date && (
                      <div className="col-md-6">
                        <label className="ct_fs_13 ct_fw_600 text-muted mb-1">
                          Next Recommended Service Date
                        </label>
                        <div className="p-3 border rounded-3 bg-light-subtle d-flex align-items-center gap-2">
                          <i className="fa-regular fa-calendar-check text-success fs-5"></i>
                          <span className="ct_fw_600 ct_fs_14 text-dark">
                            {formatDate(completion.recommended_due_date)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Completion Photos / Evidence */}
                    {completionImages.length > 0 && (
                      <div className="col-12 mt-4 pt-3 border-top">
                        <h6 className="ct_fs_13 ct_fw_600 ct_para_clr mb-2 text-uppercase">
                          WORK EVIDENCE PHOTOS ({completionImages.length})
                        </h6>
                        <div className="upload-imgs ct_custom_scroll d-flex flex-wrap gap-2 mt-0">
                          {completionImages.map((img, idx) => {
                            const imgUrl = resolveImageUrl(img);
                            return (
                              <div className="img-item position-relative" key={img.id || idx}>
                                <img
                                  src={imgUrl}
                                  alt={img.file_name || `Evidence Photo ${idx + 1}`}
                                  style={{ cursor: 'pointer' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/image.png';
                                  }}
                                  onClick={() => imgUrl && window.open(imgUrl, '_blank')}
                                  title="Click to view full image in new tab"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. CDS - Job / Services Sheet Card (if commenced / filled) */}
              {cdsSheet && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 flex-wrap gap-2">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-file-signature text-primary fs-5"></i>
                      <span>CDS - Job / Services Sheet</span>
                    </h6>
                    {cdsSheet.created_at && (
                      <span className="badge bg-light text-muted border px-2 py-1 ct_fs_12">
                        Submitted: {formatDateTime(cdsSheet.created_at)}
                      </span>
                    )}
                  </div>

                  <div className="row g-3">
                    {/* Work Carried Out */}
                    {cdsSheet.work_carried_out && (
                      <div className="col-12">
                        <label className="ct_fs_13 ct_fw_600 text-muted mb-1">
                          Work Carried Out
                        </label>
                        <div className="p-3 border rounded-3 bg-light text-dark ct_fs_14">
                          {cdsSheet.work_carried_out}
                        </div>
                      </div>
                    )}

                    {/* Work To Be Carried Out */}
                    {cdsSheet.work_to_be_carried_out && (
                      <div className="col-12">
                        <label className="ct_fs_13 ct_fw_600 text-muted mb-1">
                          Work To Be Carried Out
                        </label>
                        <div className="p-3 border rounded-3 bg-light text-dark ct_fs_14">
                          {cdsSheet.work_to_be_carried_out}
                        </div>
                      </div>
                    )}

                    {/* CDS Digital Signature */}
                    {(cdsSheet.cds_signature_url || cdsSheet.cds_signature_path) && (
                      <div className="col-md-6 mt-3">
                        <label className="ct_fs_13 ct_fw_600 text-muted mb-2 d-flex align-items-center gap-1">
                          <i className="fa-solid fa-signature text-success"></i>
                          <span>CDS Digital Signature</span>
                        </label>
                        <div
                          className="p-3 border rounded-3 bg-white text-center shadow-sm d-inline-block"
                          style={{ maxWidth: '320px', width: '100%' }}
                        >
                          <img
                            src={cdsSheet.cds_signature_url || cdsSheet.cds_signature_path}
                            alt="CDS Signature"
                            className="img-fluid"
                            style={{ maxHeight: '90px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="border-top mt-2 pt-1 text-muted ct_fs_11">
                            Verified Digital Signature
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Parts Used Table (if parts were added during CDS / maintenance) */}
              {partsUsed.length > 0 && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-gears text-primary"></i>
                      <span>Parts Used ({partsUsed.length})</span>
                    </h6>
                    <span className="ct_fw_700 text-dark ct_fs_14">
                      Total: {formatCurrency(totalPartsCost)}
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table ct_custom_table align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Part Name</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th className="text-end">Unit Cost</th>
                          <th className="text-end">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partsUsed.map((p, idx) => (
                          <tr key={p.id || idx}>
                            <td>{idx + 1}</td>
                            <td className="ct_fw_600 text-dark">{p.part_name || 'N/A'}</td>
                            <td>
                              {p.is_manual || !p.part_id ? (
                                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1">
                                  Manual
                                </span>
                              ) : (
                                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                  Inventory
                                </span>
                              )}
                            </td>
                            <td>{p.quantity || 1}</td>
                            <td className="text-end">
                              {p.unit_cost !== undefined ? formatCurrency(p.unit_cost) : 'N/A'}
                            </td>
                            <td className="text-end ct_fw_700 text-dark">
                              {formatCurrency(p.total_cost ?? (Number(p.quantity || 1) * Number(p.unit_cost || 0)))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. Consumables Used Table (if consumables were added) */}
              {consumables.length > 0 && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-box-open text-primary"></i>
                      <span>Consumables ({consumables.length})</span>
                    </h6>
                    <span className="ct_fw_700 text-dark ct_fs_14">
                      Total: {formatCurrency(totalConsumablesCost)}
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table ct_custom_table align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Consumable Name</th>
                          <th>Description</th>
                          <th>Quantity</th>
                          <th className="text-end">Unit Price</th>
                          <th className="text-end">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumables.map((c, idx) => (
                          <tr key={c.id || idx}>
                            <td>{idx + 1}</td>
                            <td className="ct_fw_600 text-dark">{c.consumable_name || 'N/A'}</td>
                            <td className="text-muted ct_fs_13">{c.description || '-'}</td>
                            <td>{c.quantity || 1}</td>
                            <td className="text-end">{formatCurrency(c.unit_price)}</td>
                            <td className="text-end ct_fw_700 text-dark">
                              {formatCurrency(c.total_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 6. Requested Extra Parts Table */}
              {partRequests.length > 0 && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-cart-flatbed text-primary"></i>
                      <span>Requested Parts to Dealer ({partRequests.length})</span>
                    </h6>
                  </div>

                  <div className="table-responsive">
                    <table className="table ct_custom_table align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Part Name</th>
                          <th>Manufacturer</th>
                          <th>Qty</th>
                          <th>Requested Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partRequests.map((req, idx) => {
                          const isApproved =
                            Number(req.status) === 1 ||
                            String(req.status).toLowerCase() === 'approved' ||
                            String(req.status).toLowerCase() === 'added';
                          const isRejected =
                            Number(req.status) === 2 ||
                            String(req.status).toLowerCase() === 'rejected';

                          return (
                            <tr key={req.id || idx}>
                              <td>{idx + 1}</td>
                              <td className="ct_fw_600 text-dark">{req.part_name || 'N/A'}</td>
                              <td className="text-muted ct_fs_13">{req.part_manufacturer || '-'}</td>
                              <td>{req.requested_quantity || req.quantity || 1}</td>
                              <td className="ct_fs_13">{formatDate(req.created_at)}</td>
                              <td>
                                {isApproved ? (
                                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                    <i className="fa-solid fa-circle-check me-1"></i> Part Added
                                  </span>
                                ) : isRejected ? (
                                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                                    <i className="fa-solid fa-circle-xmark me-1"></i> Rejected
                                  </span>
                                ) : (
                                  <span className="badge bg-warning-subtle text-dark border border-warning-subtle px-2 py-1">
                                    <i className="fa-solid fa-clock text-warning me-1"></i> Requested
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 7. Original Requested Services Table Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                  <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-list-check text-success"></i>
                    <span>Services ({services.length})</span>
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

            {/* Right Column */}
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

                  {(van.owner_name || van.owner_phone) && (
                    <div className="border-top pt-2 mt-1">
                      <span className="text-muted ct_fs_12 d-block">Customer / Owner</span>
                      <span className="ct_fw_600 ct_fs_14 text-dark d-block">
                        {van.owner_name || 'N/A'}
                      </span>
                      {van.owner_phone && (
                        <span className="text-muted ct_fs_12 d-block mt-1">
                          <i className="fa-solid fa-phone me-1 text-success"></i>
                          {van.owner_phone}
                        </span>
                      )}
                      {van.owner_email && (
                        <span className="text-muted ct_fs_12 d-block">
                          <i className="fa-regular fa-envelope me-1 text-success"></i>
                          {van.owner_email}
                        </span>
                      )}
                    </div>
                  )}
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

                  {(dealer.phone || dealer.phone_number) && (
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <i className="fa-solid fa-phone text-success"></i>
                      <a
                        href={`tel:${dealer.phone || dealer.phone_number}`}
                        className="text-decoration-none text-dark"
                      >
                        {dealer.phone || dealer.phone_number}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Quotation & Cost Summary Card */}
              <div
                className="card border-0 shadow-sm rounded-4 p-4 text-white"
                style={{
                  background: 'linear-gradient(135deg, #0f5132 0%, #198754 100%)',
                }}
              >
                <h6 className="ct_fw_700 mb-3 text-white d-flex align-items-center gap-2 border-bottom border-light pb-2">
                  <i className="fa-solid fa-file-invoice-dollar"></i>
                  <span>Cost & Quotation Summary</span>
                </h6>

                <div className="d-flex flex-column gap-2 ct_fs_14">
                  <div className="d-flex justify-content-between text-light">
                    <span>Services{services.length ? ` (${services.length})` : ''}:</span>
                    <span className="ct_fw_600">{formatCurrency(totalServicesCost)}</span>
                  </div>

                  {totalPartsCost > 0 && (
                    <div className="d-flex justify-content-between text-light">
                      <span>Parts Used ({partsUsed.length}):</span>
                      <span className="ct_fw_600">{formatCurrency(totalPartsCost)}</span>
                    </div>
                  )}

                  {totalConsumablesCost > 0 && (
                    <div className="d-flex justify-content-between text-light">
                      <span>Consumables ({consumables.length}):</span>
                      <span className="ct_fw_600">{formatCurrency(totalConsumablesCost)}</span>
                    </div>
                  )}

                  <div className="border-top border-light pt-3 mt-2 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-light ct_fs_12 d-block">Total Final Cost</span>
                      <h4 className="ct_fw_700 mb-0 text-white">
                        {formatCurrency(grandTotalCost)}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Modal for Photo Previews */}
      {previewImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1060 }}
          onClick={() => setPreviewImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-4 overflow-hidden bg-dark">
              <div className="modal-header border-0 pb-0 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setPreviewImage(null)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <img
                  src={resolveImageUrl(previewImage)}
                  alt="Work Evidence Preview"
                  className="img-fluid rounded-3 shadow"
                  style={{ maxHeight: '75vh', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image.png';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MaintenanceDetail;
