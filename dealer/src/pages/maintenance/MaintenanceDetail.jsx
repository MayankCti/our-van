import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import ErrorMessage from '../../components/form/ErrorMessage';
import {
  getMaintenanceById,
  clearMaintenanceDetails,
  reassignMaintenanceTask,
} from '../../redux/slices/maintenanceSlice';
import { getSuppliersByDealer } from '../../redux/slices/supplierSlice';
import { getTechniciansByDealer } from '../../redux/slices/technicianSlice';
import { reassignTaskSchema } from '../../utils/Schema';

const MaintenanceDetail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('id') || searchParams.get('task_id');
  const [previewImage, setPreviewImage] = useState(null);
  const [showReassignModal, setShowReassignModal] = useState(false);

  const {
    maintenanceDetails,
    isDetailsLoading = false,
    detailsError = null,
    isActionLoading = false,
  } = useSelector((state) => state.maintenanceReducer || {});

  const { suppliersList = [] } = useSelector((state) => state.supplierReducer || {});
  const { techniciansList = [] } = useSelector((state) => state.technicianReducer || {});

  // Filter active suppliers
  const activeSuppliers = useMemo(() => {
    if (!Array.isArray(suppliersList)) return [];
    return suppliersList.filter((supplier) => {
      const status = Number(supplier.status);
      const isBlock = Number(supplier.is_block);
      return status === 1 || (supplier.status === undefined && isBlock === 0);
    });
  }, [suppliersList]);

  // Filter active technicians
  const activeTechnicians = useMemo(() => {
    if (!Array.isArray(techniciansList)) return [];
    return techniciansList.filter((tech) => {
      const status = Number(tech.status);
      const isBlock = Number(tech.is_block);
      return status === 1 || (tech.status === undefined && isBlock === 0);
    });
  }, [techniciansList]);

  useEffect(() => {
    dispatch(getSuppliersByDealer({}));
    dispatch(getTechniciansByDealer({}));
  }, [dispatch]);

  useEffect(() => {
    if (taskId) {
      dispatch(getMaintenanceById({ id: taskId }));
    }
    return () => {
      dispatch(clearMaintenanceDetails());
    };
  }, [dispatch, taskId]);

  const task = maintenanceDetails?.data || maintenanceDetails || {};
  const assignee = task.assignee || {};
  const van = task.van_details || task.van || {};
  const services = Array.isArray(task.services) ? task.services : [];
  const quotation = task.quotation_breakdown || task.quotation || {};
  const partsUsed = Array.isArray(task.parts_used) ? task.parts_used : [];
  const consumables = Array.isArray(task.consumables) ? task.consumables : [];
  const partRequests = Array.isArray(task.part_requests) ? task.part_requests : [];
  const cdsSheet = task.cds_sheet || null;
  const completion = task.completion || null;
  const completionImages = Array.isArray(task.completion_images) ? task.completion_images : [];
  const timer = task.timer || null;

  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === '') return '$0.00';
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
      case 'urgent':
        return 'bg-danger text-white';
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
      case 'cancelled':
      case 'rejected':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      case 'overdue':
        return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
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

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

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

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getDefaultTimeString = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const parseTimeToHHMM = (timeStr) => {
    if (!timeStr) return '';
    const trimmed = String(timeStr).trim();
    const matchAmPm = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
    if (matchAmPm) {
      let hours = parseInt(matchAmPm[1], 10);
      const minutes = matchAmPm[2];
      const modifier = matchAmPm[3];
      if (modifier) {
        if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
      }
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    if (/^\d{2}:\d{2}/.test(trimmed)) {
      return trimmed.slice(0, 5);
    }
    return '';
  };

  const formatTimeToAMPM = (timeStr) => {
    if (!timeStr) return '';
    const trimmed = String(timeStr).trim();
    if (/AM|PM/i.test(trimmed)) return trimmed;
    const parts = trimmed.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parts[1].slice(0, 2);
      if (!isNaN(hours)) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
      }
    }
    return trimmed;
  };

  const getPrefilledDate = (dateVal) => {
    const today = getTodayDateString();
    if (!dateVal) return today;
    const formatted = String(dateVal).split('T')[0];
    return formatted < today ? today : formatted;
  };

  const getPrefilledTime = (timeVal, dateVal) => {
    const parsed = parseTimeToHHMM(timeVal);
    const today = getTodayDateString();
    const targetDate = dateVal ? String(dateVal).split('T')[0] : today;
    if (!parsed) return getDefaultTimeString();

    if (targetDate === today) {
      const now = new Date();
      const [h, m] = parsed.split(':').map(Number);
      if (h * 60 + m <= now.getHours() * 60 + now.getMinutes()) {
        return getDefaultTimeString();
      }
    }
    return parsed;
  };

  const isTaskRejected = (t) => {
    if (!t) return false;
    const status = String(t?.status || '').toLowerCase().trim();
    const supplierStatus = String(t?.supplier_status || '').toLowerCase().trim();
    const taskStatus = String(t?.task_status || '').toLowerCase().trim();
    const ownerStatus = String(t?.owner_status || '').toLowerCase().trim();
    return (
      status === 'rejected' ||
      supplierStatus === 'rejected' ||
      taskStatus === 'rejected' ||
      ownerStatus === 'accepted'
    );
  };

  const handleReassignSubmit = (values, { setSubmitting }) => {
    if (!task?.id && !taskId) return;
    const payload = {
      maintenance_id: Number(task?.id || taskId),
      assignee_type: values.assignee_type,
      assignee_id: Number(values.assignee_id),
      estimated_hours: String(values.estimated_hours),
      schedule_date: values.schedule_date,
      schedule_time: formatTimeToAMPM(values.schedule_time),
      description: values.description ? values.description.trim() : '',
    };

    dispatch(
      reassignMaintenanceTask({
        data: payload,
        callback: (res) => {
          setSubmitting(false);
          if (
            (res?.success === true ||
              res?.status === true ||
              res?.statusCode === 200 ||
              res?.statusCode === 201) &&
            res?.success !== false &&
            res?.status !== false
          ) {
            setShowReassignModal(false);
            dispatch(getMaintenanceById({ id: taskId }));
          }
        },
      })
    );
  };

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
        {task?.id && (
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
            {task.status && (
              <span
                className={`badge ${getStatusBadgeClass(task.status)}`}
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '6px 14px',
                  borderRadius: '20px',
                }}
              >
                Status: {formatStatusLabel(task.status)}
              </span>
            )}
            {isTaskRejected(task) && (
              <button
                type="button"
                className="btn btn-sm btn-warning px-3 py-2 fw-semibold text-dark d-inline-flex align-items-center gap-1 shadow-sm ms-1"
                style={{ borderRadius: '8px', fontSize: '13px' }}
                onClick={() => setShowReassignModal(true)}
                title="Reassign Task"
              >
                <i className="fa-solid fa-arrows-rotate"></i>
                <span>Reassign Task</span>
              </button>
            )}
          </div>
        )}
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-5">
        {isDetailsLoading && !task?.id ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="spinner-border text-success mb-3 mx-auto" role="status"></div>
            <p className="text-muted ct_fs_15 mb-0">Loading maintenance task details...</p>
          </div>
        ) : !taskId || (!task?.id && !isDetailsLoading) ? (
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
            {/* Left Column: Task Overview, Completion, CDS Sheet, Parts & Services */}
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
                  <div className="text-end">
                    <span className="text-muted ct_fs_12 d-block">Estimated Hours</span>
                    <span className="ct_fw_700 ct_fs_16 text-dark">
                      {task.estimated_hours ? `${task.estimated_hours} Hours` : 'N/A'}
                    </span>
                  </div>
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

                {/* Timer Work Duration Summary (if available) */}
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

              {/* Task Completion Report Card (if completed) */}
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

                    {/* Completion Photos */}
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

              {/* CDS - Job / Services Sheet Card */}
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

              {/* Parts Used Table */}
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

              {/* Consumables Used Table */}
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

              {/* Requested Extra Parts Table */}
              {partRequests.length > 0 && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-cart-flatbed text-primary"></i>
                      <span>Part Requests ({partRequests.length})</span>
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
                            <td className="ct_fw_600 text-dark">{srv.name || srv.service_name}</td>
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

            {/* Right Column: Van Info, Assignee Info, Quotation Breakdown */}
            <div className="col-xl-4">
              {/* Van Details Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                  <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-van-shuttle text-success"></i>
                    <span>Vehicle Information</span>
                  </h6>
                  {van.van_id && (
                    <Link
                      to={`${pageRoutes.van_detail}?id=${van.van_id}`}
                      className="ct_outline_btn ct_fs_12"
                      style={{ borderRadius: '6px' }}
                    >
                      View Van
                    </Link>
                  )}
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
                        {van.year || 'N/A'} {van.model ? `• ${van.model}` : ''}
                      </span>
                    </div>
                  </div>

                  {(van.owner_name || van.owner_phone) && (
                    <div className="pt-2 border-top">
                      <span className="text-muted ct_fs_12 d-block">Owner Name</span>
                      <span className="ct_fw_600 ct_fs_14 text-dark d-block">{van.owner_name}</span>
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

              {/* Assignee Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                  <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                    <i
                      className={`fa-solid ${assignee.type === 'supplier' ? 'fa-truck-field' : 'fa-user-gear'
                        } text-success`}
                    ></i>
                    <span>Assigned {assignee.type === 'supplier' ? 'Supplier' : 'Technician'}</span>
                  </h6>
                  {assignee.type && (
                    <span className="badge bg-light text-muted border px-2 py-1 text-capitalize ct_fs_11">
                      {assignee.type}
                    </span>
                  )}
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center ct_fw_700 ct_fs_16 flex-shrink-0"
                    style={{ width: '48px', height: '48px' }}
                  >
                    {getInitials(assignee.name)}
                  </div>
                  <div>
                    <h6 className="ct_fw_700 ct_head_clr mb-0 ct_fs_15">
                      {assignee.name || 'Unassigned'}
                    </h6>
                    <span className="text-muted ct_fs_12">
                      {assignee.type === 'supplier' ? 'Registered Supplier' : 'Certified Technician'}
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2 pt-2 border-top ct_fs_13">
                  {assignee.email && (
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <i className="fa-regular fa-envelope text-success"></i>
                      <a href={`mailto:${assignee.email}`} className="text-decoration-none text-dark">
                        {assignee.email}
                      </a>
                    </div>
                  )}
                  {assignee.contact && (
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <i className="fa-solid fa-phone text-success"></i>
                      <a href={`tel:${assignee.contact}`} className="text-decoration-none text-dark">
                        {assignee.contact}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Quotation & Cost Breakdown Card */}
              <div
                className="card border-0 shadow-sm rounded-4 p-4 text-white"
                style={{
                  background: 'linear-gradient(135deg, #0f5132 0%, #198754 100%)',
                }}
              >
                <h6 className="ct_fw_700 mb-3 text-white d-flex align-items-center gap-2 border-bottom border-light pb-2">
                  <i className="fa-solid fa-file-invoice-dollar"></i>
                  <span>Cost & Quotation Breakdown</span>
                </h6>

                <div className="d-flex flex-column gap-2 ct_fs_14">
                  <div className="d-flex justify-content-between text-light">
                    <span>Requested Services{services.length ? ` (${services.length})` : ''}:</span>
                    <span className="ct_fw_600">
                      {formatCurrency(totalServicesCost)}
                    </span>
                  </div>
                  {quotation.custom_services_total > 0 && (
                    <div className="d-flex justify-content-between text-light">
                      <span>Custom Services:</span>
                      <span className="ct_fw_600">
                        {formatCurrency(quotation.custom_services_total)}
                      </span>
                    </div>
                  )}
                  {totalPartsCost > 0 && (
                    <div className="d-flex justify-content-between text-light">
                      <span>Parts Used ({partsUsed.length}):</span>
                      <span className="ct_fw_600">
                        {formatCurrency(totalPartsCost)}
                      </span>
                    </div>
                  )}
                  {totalConsumablesCost > 0 && (
                    <div className="d-flex justify-content-between text-light">
                      <span>Consumables ({consumables.length}):</span>
                      <span className="ct_fw_600">
                        {formatCurrency(totalConsumablesCost)}
                      </span>
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

      {/* Reassign Task Modal */}
      {showReassignModal && (task?.id || taskId) && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055, overflowY: 'auto' }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable my-3"
            style={{ maxHeight: 'calc(100vh - 40px)' }}
          >
            <Formik
              initialValues={{
                assignee_type: (assignee.type || task.assignee_type) === 'technician' ? 'technician' : 'supplier',
                assignee_id:
                  task.assignee_type === 'owner'
                    ? ''
                    : (task.assignee_id || task.supplier_id || task.technician_id || assignee.id || ''),
                estimated_hours:
                  task.estimated_hours !== undefined && task.estimated_hours !== null
                    ? String(task.estimated_hours)
                    : '',
                schedule_date: getPrefilledDate(task.schedule_date),
                schedule_time: getPrefilledTime(task.schedule_time, task.schedule_date),
                description: task.description || '',
              }}
              validationSchema={reassignTaskSchema}
              onSubmit={handleReassignSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
                const availableAssignees =
                  values.assignee_type === 'supplier' ? activeSuppliers : activeTechnicians;

                return (
                  <Form
                    noValidate
                    className="modal-content border-0 rounded-4 shadow"
                    style={{ maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}
                  >
                    <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex align-items-center justify-content-between flex-shrink-0">
                      <h4 className="ct_fs_18 ct_fw_700 ct_head_clr mb-0">
                        Reassign Task
                      </h4>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowReassignModal(false)}
                        disabled={isActionLoading}
                      ></button>
                    </div>

                    <div className="modal-body px-4 py-3" style={{ overflowY: 'auto', flex: '1 1 auto' }}>
                      <div className="row g-3">
                        {/* Task Summary Details */}
                        <div className="col-12">
                          <div
                            className="p-3 rounded-3 border"
                            style={{ backgroundColor: '#F8FAFC' }}
                          >
                            <div className="row g-2 ct_fs_13">
                              <div className="col-sm-6">
                                <span className="text-muted d-block ct_fs_12">Task Title</span>
                                <span className="ct_fw_700 text-dark">{task.title || 'N/A'}</span>
                              </div>
                              <div className="col-sm-6">
                                <span className="text-muted d-block ct_fs_12">Vehicle</span>
                                <span className="ct_fw_600 text-dark">
                                  {van.van_name || van.name || 'Vehicle'}
                                  {van.registration_number ? ` (${van.registration_number})` : ''}
                                </span>
                              </div>
                              <div className="col-sm-6 mt-2">
                                <span className="text-muted d-block ct_fs_12">Previous Assignee</span>
                                <span className="ct_fw_600 text-secondary">
                                  {assignee.name || task.assigned_to_name || 'Unassigned'}
                                  {assignee.type || task.assignee_type ? ` (${assignee.type || task.assignee_type})` : ''}
                                </span>
                              </div>
                              <div className="col-sm-6 mt-2">
                                <span className="text-muted d-block ct_fs_12">Status</span>
                                <span
                                  className={`badge ${
                                    String(task.owner_status || '').toLowerCase() === 'accepted'
                                      ? 'bg-success-subtle text-success border border-success-subtle'
                                      : 'bg-danger-subtle text-danger border border-danger-subtle'
                                  } px-2 py-1 text-capitalize`}
                                >
                                  {String(task.owner_status || '').toLowerCase() === 'accepted'
                                    ? 'Owner Accepted'
                                    : task.status || task.supplier_status || 'Rejected'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Assignee Type */}
                        <div className="col-12">
                          <label className="mb-2 ct_label">
                            Assignee Type <span className="text-danger">*</span>
                          </label>
                          <div className="d-flex gap-4 p-3 bg-light rounded-3 border">
                            <div className="form-check d-flex align-items-center gap-2 mb-0">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="assignee_type"
                                id="reassign_supplier_detail"
                                value="supplier"
                                checked={values.assignee_type === 'supplier'}
                                onChange={() => {
                                  setFieldValue('assignee_type', 'supplier');
                                  setFieldValue('assignee_id', '');
                                }}
                              />
                              <label className="form-check-label ct_fs_14 ct_fw_600" htmlFor="reassign_supplier_detail">
                                Supplier
                              </label>
                            </div>
                            <div className="form-check d-flex align-items-center gap-2 mb-0">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="assignee_type"
                                id="reassign_technician_detail"
                                value="technician"
                                checked={values.assignee_type === 'technician'}
                                onChange={() => {
                                  setFieldValue('assignee_type', 'technician');
                                  setFieldValue('assignee_id', '');
                                }}
                              />
                              <label className="form-check-label ct_fs_14 ct_fw_600" htmlFor="reassign_technician_detail">
                                Technician
                              </label>
                            </div>
                          </div>
                          <ErrorMessage errors={errors} touched={touched} fieldName="assignee_type" />
                        </div>

                        {/* Assignee Select */}
                        <div className="col-12">
                          <label className="mb-2 ct_label" htmlFor="assignee_id">
                            Select {values.assignee_type === 'supplier' ? 'Supplier' : 'Technician'}{' '}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            id="assignee_id"
                            name="assignee_id"
                            className="form-select ct_input ct_fs_14"
                            value={values.assignee_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="">
                              -- Select {values.assignee_type === 'supplier' ? 'Supplier' : 'Technician'} --
                            </option>
                            {availableAssignees.map((person) => {
                              const personId = person.id || person.supplier_id || person.technician_id;
                              const personName =
                                person.name || person.full_name || person.supplier_name || `ID #${personId}`;
                              return (
                                <option key={personId} value={personId}>
                                  {personName}
                                  {person.email ? ` (${person.email})` : ''}
                                </option>
                              );
                            })}
                          </select>
                          {availableAssignees.length === 0 && (
                            <small className="text-muted d-block mt-1">
                              No active {values.assignee_type === 'supplier' ? 'suppliers' : 'technicians'} available.
                            </small>
                          )}
                          <ErrorMessage errors={errors} touched={touched} fieldName="assignee_id" />
                        </div>

                        {/* Estimated Hours */}
                        <div className="col-md-4">
                          <label className="mb-2 ct_label" htmlFor="reassign_estimated_hours_detail">
                            Estimated Hours <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            min="0.1"
                            id="reassign_estimated_hours_detail"
                            name="estimated_hours"
                            className="form-control ct_input"
                            placeholder="e.g. 2"
                            value={values.estimated_hours}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage errors={errors} touched={touched} fieldName="estimated_hours" />
                        </div>

                        {/* Schedule Date */}
                        <div className="col-md-4">
                          <label className="mb-2 ct_label" htmlFor="reassign_schedule_date_detail">
                            Schedule Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            id="reassign_schedule_date_detail"
                            name="schedule_date"
                            min={getTodayDateString()}
                            className="form-control ct_input"
                            value={values.schedule_date}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage errors={errors} touched={touched} fieldName="schedule_date" />
                        </div>

                        {/* Schedule Time */}
                        <div className="col-md-4">
                          <label className="mb-2 ct_label" htmlFor="reassign_schedule_time_detail">
                            Schedule Time <span className="text-danger">*</span>
                          </label>
                          <input
                            type="time"
                            id="reassign_schedule_time_detail"
                            name="schedule_time"
                            className="form-control ct_input"
                            value={values.schedule_time}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage errors={errors} touched={touched} fieldName="schedule_time" />
                        </div>

                        {/* Description */}
                        <div className="col-12">
                          <label className="mb-2 ct_label" htmlFor="reassign_description_detail">
                            Description
                          </label>
                          <textarea
                            id="reassign_description_detail"
                            name="description"
                            rows="3"
                            className="form-control ct_input"
                            placeholder="Provide instructions or updates for assignee..."
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></textarea>
                          <ErrorMessage errors={errors} touched={touched} fieldName="description" />
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer border-0 pt-2 pb-4 px-4 d-flex gap-2 justify-content-end flex-shrink-0 bg-white" style={{ borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' }}>
                      <button
                        type="button"
                        className="btn ct_btn_gray px-4 py-2 ct_btn_h_45"
                        onClick={() => setShowReassignModal(false)}
                        disabled={isSubmitting || isActionLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ct_green_btn px-4 py-2 ct_btn_h_45 d-flex align-items-center justify-content-center gap-2"
                        disabled={isSubmitting || isActionLoading}
                      >
                        {isSubmitting || isActionLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm text-white" role="status"></span>
                            <span>Reassigning...</span>
                          </>
                        ) : (
                          <span>Reassign Task</span>
                        )}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MaintenanceDetail;

