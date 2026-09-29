import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import PaginationDropdown from '../../components/table/PaginationDropdown';
import ReactPagination from '../../components/table/ReactPagination';
import ErrorMessage from '../../components/form/ErrorMessage';
import useDebounce from '../../hooks/useDebounce';
import { pageRoutes } from '../../routes/PageRoutes';
import { createMaintenanceSchema } from '../../utils/Schema';
import {
  getMaintenanceList,
  createMaintenance,
} from '../../redux/slices/maintenanceSlice';
import { getVansList } from '../../redux/slices/vanSlice';
import { getSuppliersByDealer } from '../../redux/slices/supplierSlice';
import { getTechniciansByDealer } from '../../redux/slices/technicianSlice';
import { getServices } from '../../redux/slices/serviceSlice';

const Maintenance = () => {
  const dispatch = useDispatch();

  const {
    maintenanceList = [],
    maintenanceMeta = {},
    isMaintenanceLoading = false,
    isActionLoading = false,
  } = useSelector((state) => state.maintenanceReducer || {});

  const { vansList = [] } = useSelector((state) => state.vanReducer || {});
  const { suppliersList = [] } = useSelector((state) => state.supplierReducer || {});
  const { techniciansList = [] } = useSelector((state) => state.technicianReducer || {});
  const { servicesList = [] } = useSelector((state) => state.serviceReducer || {});

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Selected catalog service in modal
  const [selectedCatalogServiceId, setSelectedCatalogServiceId] = useState('');
  const [customServiceName, setCustomServiceName] = useState('');
  const [customServiceCost, setCustomServiceCost] = useState('');

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

  // Fetch reference lists when modal opens without sending page & limit
  useEffect(() => {
    if (showCreateModal) {
      dispatch(getVansList({}));
      dispatch(getSuppliersByDealer({}));
      dispatch(getTechniciansByDealer({}));
      dispatch(getServices({}));
    }
  }, [dispatch, showCreateModal]);

  // Reset pagination on search / filter
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, selectedPriority, selectedStatus]);

  // Filter completed vans for the dropdown
  const completedVans = useMemo(() => {
    if (!Array.isArray(vansList)) return [];
    return vansList.filter((van) => {
      const status = String(van.status || '').toUpperCase();
      const progress = Number(van.progress);
      return status === 'COMPLETED' || progress === 100 || status === '1' || status === 'ACTIVE';
    });
  }, [vansList]);

  // Filter active suppliers (status: 1 or is_block: 0)
  const activeSuppliers = useMemo(() => {
    if (!Array.isArray(suppliersList)) return [];
    return suppliersList.filter((supplier) => {
      const status = Number(supplier.status);
      const isBlock = Number(supplier.is_block);
      return status === 1 || (supplier.status === undefined && isBlock === 0);
    });
  }, [suppliersList]);

  // Filter active technicians (status: 1 or is_block: 0)
  const activeTechnicians = useMemo(() => {
    if (!Array.isArray(techniciansList)) return [];
    return techniciansList.filter((tech) => {
      const status = Number(tech.status);
      const isBlock = Number(tech.is_block);
      return status === 1 || (tech.status === undefined && isBlock === 0);
    });
  }, [techniciansList]);

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

  // Initial Form values for Create Task
  const initialFormValues = {
    van_id: '',
    title: '',
    maintenance_type: 'Repair & Service',
    priority: 'high',
    description: '',
    job_location: '',
    schedule_date: getTodayDateString(),
    schedule_time: getDefaultTimeString(),
    estimated_hours: 2,
    assignee_type: 'supplier',
    assignee_id: '',
    services: [],
  };

  const handleOpenCreateModal = () => {
    setSelectedCatalogServiceId('');
    setCustomServiceName('');
    setCustomServiceCost('');
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setSelectedCatalogServiceId('');
    setCustomServiceName('');
    setCustomServiceCost('');
  };

  const handleCreateSubmit = (values, { setSubmitting, resetForm }) => {
    let formattedTime = values.schedule_time;
    if (formattedTime && formattedTime.split(':').length === 2) {
      formattedTime = `${formattedTime}:00`;
    }

    const payload = {
      van_id: Number(values.van_id),
      title: values.title?.trim(),
      maintenance_type: values.maintenance_type?.trim(),
      priority: values.priority,
      description: values.description?.trim() || '',
      job_location: values.job_location?.trim(),
      schedule_date: values.schedule_date,
      schedule_time: formattedTime,
      estimated_hours: Number(values.estimated_hours),
      assignee_type: values.assignee_type,
      assignee_id: Number(values.assignee_id),
      services: values.services.map((srv) => ({
        name: srv.name?.trim(),
        cost: Number(srv.cost),
        is_custom: Boolean(srv.is_custom),
        ...(srv.service_id ? { service_id: Number(srv.service_id) } : {}),
      })),
    };

    dispatch(
      createMaintenance({
        data: payload,
        callback: (res) => {
          setSubmitting(false);
          if (res) {
            handleCloseCreateModal();
            resetForm();
            fetchTasks();
          }
        },
      })
    );
  };

  return (
    <Layout>
      <SubHeader
        title="Maintenance"
        subtitle="Manage and track van maintenance requests, service assignments, and tasks."
      >
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Create Maintenance Task</span>
        </button>
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
                              to={`${pageRoutes.maintenance_detail}?id=${task.id}`}
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

      {/* Create Maintenance Task Modal */}
      {showCreateModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, overflowY: 'auto' }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg my-4" style={{ maxWidth: "800px" }}>
            <div
              className="modal-content border-0 rounded-4 shadow d-flex flex-column"
              style={{ maxHeight: 'calc(100dvh - 50px)', overflow: 'hidden' }}
            >
              <div className="modal-header border-0 pb-2 pt-4 px-4 d-flex align-items-center justify-content-between flex-shrink-0">
                <div>
                  <h4 className="ct_fs_20 ct_fw_700 ct_head_clr mb-1">
                    Create Maintenance Task
                  </h4>
                  <p className="text-muted ct_fs_13 mb-0">
                    Fill in task details, assign technician or supplier, and add required services.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseCreateModal}
                ></button>
              </div>

              <Formik
                initialValues={initialFormValues}
                validationSchema={createMaintenanceSchema}
                onSubmit={handleCreateSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                  isSubmitting,
                }) => {
                  // Filter active assignees based on selected assignee_type
                  const availableAssignees =
                    values.assignee_type === 'supplier'
                      ? activeSuppliers
                      : activeTechnicians;

                  // Calculate live total cost
                  const liveTotalCost = values.services.reduce(
                    (sum, s) => sum + (Number(s.cost) || 0),
                    0
                  );

                  // Handler to add a catalog service
                  const handleAddCatalogService = () => {
                    if (!selectedCatalogServiceId) return;
                    const foundService = servicesList.find(
                      (s) => String(s.id) === String(selectedCatalogServiceId)
                    );
                    if (foundService) {
                      const newService = {
                        service_id: foundService.id,
                        name: foundService.name,
                        cost: Number(foundService.cost || 0),
                        is_custom: false,
                      };
                      setFieldValue('services', [...values.services, newService]);
                      setSelectedCatalogServiceId('');
                    }
                  };

                  // Handler to add custom service
                  const handleAddCustomService = () => {
                    if (!customServiceName.trim()) return;
                    const costNum = parseFloat(customServiceCost);
                    if (isNaN(costNum) || costNum < 0) return;

                    const newService = {
                      service_id: null,
                      name: customServiceName.trim(),
                      cost: costNum,
                      is_custom: true,
                    };
                    setFieldValue('services', [...values.services, newService]);
                    setCustomServiceName('');
                    setCustomServiceCost('');
                  };

                  return (
                    <Form noValidate className="d-flex flex-column flex-grow-1" style={{ overflow: 'hidden' }}>
                      <div
                        className="modal-body px-4 py-3 flex-grow-1"
                        style={{
                          maxHeight: 'calc(90vh - 145px)',
                          overflowY: 'auto',
                          overscrollBehavior: 'contain',
                        }}
                      >
                        <div className="row g-3">
                          {/* Section 1: Van & Task Info */}
                          <div className="col-12">
                            <h6 className="ct_fw_700 ct_head_clr border-bottom pb-2 mb-2 d-flex align-items-center gap-2">
                              <i className="fa-solid fa-van-shuttle text-success"></i>
                              <span>1. Vehicle & Basic Details</span>
                            </h6>
                          </div>

                          {/* Van Selection (Completed Vans only) */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="van_id">
                                Select Van <span className="text-danger">*</span>
                              </label>
                              <select
                                id="van_id"
                                name="van_id"
                                className="form-select ct_input ct_fs_14"
                                value={values.van_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="">-- Select Van --</option>
                                {completedVans.map((van) => {
                                  const vanId = van.vanId || van.id || van.van_id;
                                  const vanName =
                                    van.vanName ||
                                    van.van_name ||
                                    (van.make ? `${van.make} ${van.model || ''}` : `Van #${vanId}`);
                                  const regNo =
                                    van.registrationNumber || van.registration_number;
                                  return (
                                    <option key={vanId} value={vanId}>
                                      {vanName} {regNo ? `(${regNo})` : ''}
                                    </option>
                                  );
                                })}
                              </select>
                              <ErrorMessage errors={errors} touched={touched} fieldName="van_id" />
                            </div>
                          </div>

                          {/* Task Title */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="title">
                                Task Title <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-control ct_input"
                                placeholder="e.g. Brake Pad Replacement & Full Checkup"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="title" />
                            </div>
                          </div>

                          {/* Maintenance Type */}
                          <div className="col-md-4">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="maintenance_type">
                                Maintenance Type <span className="text-danger">*</span>
                              </label>
                              <select
                                id="maintenance_type"
                                name="maintenance_type"
                                className="form-select ct_input ct_fs_14"
                                value={values.maintenance_type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="Repair & Service">Repair & Service</option>
                                <option value="Routine Inspection">Routine Inspection</option>
                                <option value="Preventative Maintenance">Preventative Maintenance</option>
                                <option value="Oil Change & Lubrication">Oil Change & Lubrication</option>
                                <option value="Tyre & Brake Service">Tyre & Brake Service</option>
                                <option value="Engine & Transmission">Engine & Transmission</option>
                                <option value="Electrical Diagnostics">Electrical Diagnostics</option>
                                <option value="General Checkup">General Checkup</option>
                              </select>
                              <ErrorMessage errors={errors} touched={touched} fieldName="maintenance_type" />
                            </div>
                          </div>

                          {/* Priority (High, Medium, Low) */}
                          <div className="col-md-4">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="priority">
                                Priority <span className="text-danger">*</span>
                              </label>
                              <select
                                id="priority"
                                name="priority"
                                className="form-select ct_input ct_fs_14"
                                value={values.priority}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                              <ErrorMessage errors={errors} touched={touched} fieldName="priority" />
                            </div>
                          </div>

                          {/* Estimated Hours */}
                          <div className="col-md-4">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="estimated_hours">
                                Estimated Hours <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="estimated_hours"
                                name="estimated_hours"
                                step="any"
                                min="0"
                                className="form-control ct_input"
                                placeholder="e.g. 4.0"
                                value={values.estimated_hours}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="estimated_hours" />
                            </div>
                          </div>

                          {/* Job Location */}
                          <div className="col-12">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="job_location">
                                Job Location <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="job_location"
                                name="job_location"
                                className="form-control ct_input"
                                placeholder="e.g. Shop No 4, Main Auto Hub, Mumbai"
                                value={values.job_location}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="job_location" />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="col-12">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="description">
                                Description
                              </label>
                              <textarea
                                id="description"
                                name="description"
                                rows="2"
                                className="form-control ct_input"
                                placeholder="Provide brief instructions or symptoms (e.g. Brake pedal feels soft)..."
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></textarea>
                              <ErrorMessage errors={errors} touched={touched} fieldName="description" />
                            </div>
                          </div>

                          {/* Section 2: Schedule & Assignment */}
                          <div className="col-12 mt-4">
                            <h6 className="ct_fw_700 ct_head_clr border-bottom pb-2 mb-2 d-flex align-items-center gap-2">
                              <i className="fa-regular fa-calendar-check text-success"></i>
                              <span>2. Schedule & Assignment</span>
                            </h6>
                          </div>

                          {/* Schedule Date */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="schedule_date">
                                Schedule Date <span className="text-danger">*</span>
                              </label>
                              <input
                                type="date"
                                id="schedule_date"
                                name="schedule_date"
                                min={getTodayDateString()}
                                className="form-control ct_input"
                                value={values.schedule_date}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="schedule_date" />
                            </div>
                          </div>

                          {/* Schedule Time */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="schedule_time">
                                Schedule Time <span className="text-danger">*</span>
                              </label>
                              <input
                                type="time"
                                id="schedule_time"
                                name="schedule_time"
                                className="form-control ct_input"
                                value={values.schedule_time}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="schedule_time" />
                            </div>
                          </div>

                          {/* Assignee Type */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label">
                                Assignee Type <span className="text-danger">*</span>
                              </label>
                              <div className="d-flex gap-3 mt-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="assignee_type"
                                    id="assignee_supplier"
                                    value="supplier"
                                    checked={values.assignee_type === 'supplier'}
                                    onChange={() => {
                                      setFieldValue('assignee_type', 'supplier');
                                      setFieldValue('assignee_id', '');
                                    }}
                                  />
                                  <label className="form-check-label ct_fs_14" htmlFor="assignee_supplier">
                                    Supplier
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="assignee_type"
                                    id="assignee_technician"
                                    value="technician"
                                    checked={values.assignee_type === 'technician'}
                                    onChange={() => {
                                      setFieldValue('assignee_type', 'technician');
                                      setFieldValue('assignee_id', '');
                                    }}
                                  />
                                  <label className="form-check-label ct_fs_14" htmlFor="assignee_technician">
                                    Technician
                                  </label>
                                </div>
                              </div>
                              <ErrorMessage errors={errors} touched={touched} fieldName="assignee_type" />
                            </div>
                          </div>

                          {/* Assignee ID (Filtered active status: 1) */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
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
                              <ErrorMessage errors={errors} touched={touched} fieldName="assignee_id" />
                            </div>
                          </div>

                          {/* Section 3: Services & Quotation */}
                          <div className="col-12 mt-4">
                            <h6 className="ct_fw_700 ct_head_clr border-bottom pb-2 mb-2 d-flex align-items-center gap-2">
                              <i className="fa-solid fa-list-check text-success"></i>
                              <span>3. Services & Quotation</span>
                            </h6>
                          </div>

                          {/* Add from Predefined Services Card */}
                          <div className="col-12 ">
                            <div className="p-3 bg-light rounded-3 text-start border h-100 d-flex flex-column justify-content-between">
                              <label className="ct_fs_13 ct_fw_600 mb-2 text-dark">
                                Add from Predefined Services
                              </label>
                              <div className="d-flex align-items-center gap-2 ct_flex_col_575">
                                <select
                                  className="form-select ct_input ct_fs_13 flex-grow-1"
                                  style={{ height: '45px' }}
                                  value={selectedCatalogServiceId}
                                  onChange={(e) => setSelectedCatalogServiceId(e.target.value)}
                                >
                                  <option value="">-- Choose Service --</option>
                                  {Array.isArray(servicesList) &&
                                    servicesList.map((srv) => (
                                      <option key={srv.id} value={srv.id}>
                                        {srv.name} (${srv.cost})
                                      </option>
                                    ))}
                                </select>
                                <button
                                  type="button"
                                  className="ct_green_btn px-3 ct_btn_h_45 ct_w_100_575 text-nowrap d-flex align-items-center justify-content-center"
                                  style={{ height: '45px', borderRadius: '10px' }}
                                  onClick={handleAddCatalogService}
                                  disabled={!selectedCatalogServiceId}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Add Custom Service Card */}
                          <div className="col-12">
                            <div className="p-3 bg-light rounded-3 text-start border h-100 d-flex flex-column justify-content-between">
                              <label className="ct_fs_13 ct_fw_600 mb-2 text-dark">
                                Add Custom Service
                              </label>
                              <div className="d-flex align-items-center gap-2 ct_flex_col_575">
                                <input
                                  type="text"
                                  className="form-control ct_input ct_fs_13 flex-grow-1"
                                  style={{ height: '45px', }}
                                  placeholder="Service name"
                                  value={customServiceName}
                                  onChange={(e) => setCustomServiceName(e.target.value)}
                                />
                                <input
                                  type="number"
                                  className="form-control ct_input ct_fs_13 ct_w_100_575"
                                  style={{ height: '45px', width: '120px', minWidth: '120px', flexShrink: 0 }}
                                  placeholder="Cost ($)"
                                  min="0"
                                  step="any"
                                  value={customServiceCost}
                                  onChange={(e) => setCustomServiceCost(e.target.value)}
                                  onWheel={(e) => e.target.blur()}
                                />
                                <button
                                  type="button"
                                  className="ct_green_btn ct_w_100_575 px-3 ct_btn_h_45 text-nowrap d-flex align-items-center justify-content-center"
                                  style={{ height: '45px', borderRadius: '10px', flexShrink: 0 }}
                                  onClick={handleAddCustomService}
                                  disabled={!customServiceName.trim() || !customServiceCost}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Added Services List */}
                          <div className="col-12 mt-3">
                            <FieldArray name="services">
                              {({ remove }) => (
                                <div>
                                  {values.services.length === 0 ? (
                                    <div className="p-3 text-center border rounded-3 bg-light text-muted ct_fs_13">
                                      No services added yet. Please select from the catalog or add a custom service above.
                                    </div>
                                  ) : (
                                    <div className="table-responsive border rounded-3">
                                      <table className="table mb-0 ct_fs_13 align-middle ct_custom_table">
                                        <thead>
                                          <tr>
                                            <th style={{ width: '50px' }}>#</th>
                                            <th>Service Name</th>
                                            <th style={{ width: '120px' }}>Type</th>
                                            <th style={{ width: '130px' }} className="text-end">Cost ($)</th>
                                            <th style={{ width: '70px' }} className="text-center">Action</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {values.services.map((srv, idx) => (
                                            <tr key={idx}>
                                              <td>{idx + 1}</td>
                                              <td className="ct_fw_600 text-dark">{srv.name}</td>
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
                                              <td className="text-end">
                                                {srv.is_custom ? (
                                                  <input
                                                    type="number"
                                                    step="any"
                                                    min="0"
                                                    className="form-control ct_input py-1 px-2 text-end ms-auto"
                                                    style={{ maxWidth: '110px' }}
                                                    value={srv.cost}
                                                    onChange={(e) =>
                                                      setFieldValue(
                                                        `services.${idx}.cost`,
                                                        parseFloat(e.target.value) || 0
                                                      )
                                                    }
                                                    onWheel={(e) => e.target.blur()}
                                                  />
                                                ) : (
                                                  <span className="ct_fw_600 text-dark">
                                                    {formatCurrency(srv.cost)}
                                                  </span>
                                                )}
                                              </td>
                                              <td className="text-center">
                                                <button
                                                  type="button"
                                                  className="btn btn-sm text-danger p-1"
                                                  onClick={() => remove(idx)}
                                                  title="Remove Service"
                                                >
                                                  <i className="fa-regular fa-trash-can"></i>
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                        <tfoot>
                                          <tr>
                                            <td colSpan="3" className="text-end ct_fw_700">
                                              Total Estimated Amount:
                                            </td>
                                            <td colSpan="2" className="ct_fw_700 text-success ct_fs_14 text-end pe-4">
                                              {formatCurrency(liveTotalCost)}
                                            </td>
                                          </tr>
                                        </tfoot>
                                      </table>
                                    </div>
                                  )}
                                  {errors.services && typeof errors.services === 'string' && (
                                    <div className="text-danger ct_fs_12 mt-1 text-start">
                                      {errors.services}
                                    </div>
                                  )}
                                </div>
                              )}
                            </FieldArray>
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer  border-0 pt-2 pb-4 px-4 flex-nowrap d-flex gap-2 justify-content-end flex-shrink-0">
                        <button
                          type="button"
                          className="btn  ct_btn_gray px-4 py-2 ct_btn_h_45" style={{ minWidth: "100px" }}
                          onClick={handleCloseCreateModal}
                          disabled={isSubmitting || isActionLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ct_green_btn  px-4 py-2 ct_btn_h_45 d-flex align-items-center justify-content-center gap-2"
                          disabled={isSubmitting || isActionLoading || values.services.length === 0}
                        >
                          {isSubmitting || isActionLoading ? (
                            <>
                              <div
                                className="spinner-border spinner-border-sm text-white"
                                role="status"
                              ></div>
                              <span>Creating...</span>
                            </>
                          ) : (
                            <span>Create Maintenance Task</span>
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
      )
      }
    </Layout >
  );
};

export default Maintenance;
