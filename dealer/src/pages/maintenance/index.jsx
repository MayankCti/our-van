import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import PaginationDropdown from '../../components/table/PaginationDropdown';
import ReactPagination from '../../components/table/ReactPagination';
import ErrorMessage from '../../components/form/ErrorMessage';
import useDebounce from '../../hooks/useDebounce';
import { pageRoutes } from '../../routes/PageRoutes';
import { getMaintenanceList, reassignMaintenanceTask } from '../../redux/slices/maintenanceSlice';
import { getSuppliersByDealer } from '../../redux/slices/supplierSlice';
import { getTechniciansByDealer } from '../../redux/slices/technicianSlice';
import { reassignTaskSchema } from '../../utils/Schema';

const Maintenance = () => {
  const dispatch = useDispatch();

  const {
    maintenanceList = [],
    maintenanceMeta = {},
    isMaintenanceLoading = false,
    isActionLoading = false,
  } = useSelector((state) => state.maintenanceReducer || {});

  const { suppliersList = [] } = useSelector((state) => state.supplierReducer || {});
  const { techniciansList = [] } = useSelector((state) => state.technicianReducer || {});

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Reassign Modal State
  const [reassigningTask, setReassigningTask] = useState(null);
  const [showReassignModal, setShowReassignModal] = useState(false);

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

  // Fetch initial suppliers & technicians
  useEffect(() => {
    dispatch(getSuppliersByDealer({}));
    dispatch(getTechniciansByDealer({}));
  }, [dispatch]);

  // Fetch maintenance list
  const fetchTasks = () => {
    dispatch(
      getMaintenanceList({
        page: currentPage + 1,
        limit: listPerPages,
        search: debouncedSearch,
      })
    );
  };

  useEffect(() => {
    fetchTasks();
  }, [dispatch, currentPage, listPerPages, debouncedSearch]);

  const isTaskRejected = (task) => {
    const status = String(task?.status || '').toLowerCase().trim();
    const supplierStatus = String(task?.supplier_status || '').toLowerCase().trim();
    const taskStatus = String(task?.task_status || '').toLowerCase().trim();
    return status === 'rejected' || supplierStatus === 'rejected' || taskStatus === 'rejected';
  };

  const handleOpenReassignModal = (task) => {
    setReassigningTask(task);
    setShowReassignModal(true);
  };

  const handleCloseReassignModal = () => {
    setReassigningTask(null);
    setShowReassignModal(false);
  };

  const handleReassignSubmit = (values, { setSubmitting }) => {
    if (!reassigningTask?.id && !reassigningTask?.maintenance_id) return;
    const payload = {
      maintenance_id: Number(reassigningTask.id || reassigningTask.maintenance_id),
      assignee_type: values.assignee_type,
      assignee_id: Number(values.assignee_id),
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
            handleCloseReassignModal();
            fetchTasks();
          }
        },
      })
    );
  };

  // Reset pagination on search / filter
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, selectedPriority, selectedStatus]);

  // Filtered maintenance tasks
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(maintenanceList)) return [];
    return maintenanceList.filter((task) => {
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
      return true;
    });
  }, [maintenanceList, selectedPriority, selectedStatus]);

  // Pagination calculation
  const totalItems = maintenanceMeta.totalItems || filteredTasks.length;
  const totalPages = Math.max(1, maintenanceMeta.totalPages || Math.ceil(totalItems / listPerPages));

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

  return (
    <Layout>
      <SubHeader
        title="Maintenance"
        subtitle="Manage and track van maintenance requests, service assignments, and tasks."
      >
        <Link
          to={pageRoutes.create_maintenance}
          className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Create Maintenance Task</span>
        </Link>
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">
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
                {isMaintenanceLoading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-muted ct_fs_14 mb-0">Loading maintenance tasks...</p>
                    </td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5 text-muted ct_fs_14">
                      {searchTerm || selectedPriority !== 'all' || selectedStatus !== 'all'
                        ? 'No maintenance tasks match your filter criteria.'
                        : 'No maintenance tasks created yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, index) => {
                    const rowNumber = currentPage * listPerPages + index + 1;
                    return (
                      <tr key={task.id || index}>
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
                          {task.van_name || 'N/A'}
                          {task.registration_number ? ` (${task.registration_number})` : ''}
                        </td>

                        {/* Assigned To */}
                        <td>
                          {task.assigned_to_name || 'Unassigned'}
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
                            className={`badge ${getStatusBadgeClass(task.status)} px-3 py-1`}
                            style={{ fontSize: '11px', fontWeight: '600', borderRadius: '6px' }}
                          >
                            {formatStatusLabel(task.status)}
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
                              to={`${pageRoutes.maintenance_detail}?id=${task.id}`}
                              className="ct_action_icon_btn ct_view_btn"
                              title="View Details"
                            >
                              <i className="fa-regular fa-eye"></i>
                            </Link>
                            {isTaskRejected(task) && (
                              <button
                                type="button"
                                className="ct_action_icon_btn border-0"
                                style={{
                                  backgroundColor: '#FEF3C7',
                                  color: '#D97706',
                                  cursor: 'pointer',
                                }}
                                onClick={() => handleOpenReassignModal(task)}
                                title="Reassign Task"
                              >
                                <i className="fa-solid fa-arrows-rotate"></i>
                              </button>
                            )}
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

      {/* Reassign Task Modal */}
      {showReassignModal && reassigningTask && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex align-items-center justify-content-between">
                <h4 className="ct_fs_18 ct_fw_700 ct_head_clr mb-0">
                  Reassign Task
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseReassignModal}
                  disabled={isActionLoading}
                ></button>
              </div>

              <Formik
                initialValues={{
                  assignee_type: reassigningTask.assignee_type === 'technician' ? 'technician' : 'supplier',
                  assignee_id: '',
                }}
                validationSchema={reassignTaskSchema}
                onSubmit={handleReassignSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
                  const availableAssignees =
                    values.assignee_type === 'supplier' ? activeSuppliers : activeTechnicians;

                  return (
                    <Form noValidate>
                      <div className="modal-body px-4 py-3">
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
                                  <span className="ct_fw_700 text-dark">{reassigningTask.title || 'N/A'}</span>
                                </div>
                                <div className="col-sm-6">
                                  <span className="text-muted d-block ct_fs_12">Vehicle</span>
                                  <span className="ct_fw_600 text-dark">
                                    {reassigningTask.van_name || 'Vehicle'}
                                    {reassigningTask.registration_number ? ` (${reassigningTask.registration_number})` : ''}
                                  </span>
                                </div>
                                <div className="col-sm-6 mt-2">
                                  <span className="text-muted d-block ct_fs_12">Previous Assignee</span>
                                  <span className="ct_fw_600 text-secondary">
                                    {reassigningTask.assigned_to_name || 'Unassigned'}
                                    {reassigningTask.assignee_type ? ` (${reassigningTask.assignee_type})` : ''}
                                  </span>
                                </div>
                                <div className="col-sm-6 mt-2">
                                  <span className="text-muted d-block ct_fs_12">Status</span>
                                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 text-capitalize">
                                    {reassigningTask.status || reassigningTask.supplier_status || 'Rejected'}
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
                                  id="reassign_supplier"
                                  value="supplier"
                                  checked={values.assignee_type === 'supplier'}
                                  onChange={() => {
                                    setFieldValue('assignee_type', 'supplier');
                                    setFieldValue('assignee_id', '');
                                  }}
                                />
                                <label className="form-check-label ct_fs_14 ct_fw_600" htmlFor="reassign_supplier">
                                  Supplier
                                </label>
                              </div>
                              <div className="form-check d-flex align-items-center gap-2 mb-0">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="assignee_type"
                                  id="reassign_technician"
                                  value="technician"
                                  checked={values.assignee_type === 'technician'}
                                  onChange={() => {
                                    setFieldValue('assignee_type', 'technician');
                                    setFieldValue('assignee_id', '');
                                  }}
                                />
                                <label className="form-check-label ct_fs_14 ct_fw_600" htmlFor="reassign_technician">
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
                        </div>
                      </div>

                      <div className="modal-footer border-0 pt-0 pb-4 px-4 d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn ct_btn_gray px-4 py-2 ct_btn_h_45"
                          onClick={handleCloseReassignModal}
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
        </div>
      )}
    </Layout>
  );
};

export default Maintenance;

