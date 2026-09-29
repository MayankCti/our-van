import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import PaginationDropdown from '../../components/table/PaginationDropdown';
import ReactPagination from '../../components/table/ReactPagination';
import ErrorMessage from '../../components/form/ErrorMessage';
import useDebounce from '../../hooks/useDebounce';
import { serviceSchema } from '../../utils/Schema';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../redux/slices/serviceSlice';

const Services = () => {
  const dispatch = useDispatch();

  const {
    servicesList = [],
    isServicesLoading = false,
    isActionLoading = false,
  } = useSelector((state) => state.serviceReducer || {});

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Modal states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch services on mount & search
  useEffect(() => {
    dispatch(
      getServices({
        search: debouncedSearch,
      })
    );
  }, [dispatch, debouncedSearch]);

  // Reset pagination on search / page size change
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, listPerPages]);

  // Client-side filtering fallback
  const filteredServices = useMemo(() => {
    if (!Array.isArray(servicesList)) return [];
    if (!debouncedSearch.trim()) return servicesList;
    const query = debouncedSearch.toLowerCase().trim();
    return servicesList.filter((service) => {
      const name = (service.name || '').toLowerCase();
      const cost = String(service.cost || '');
      return name.includes(query) || cost.includes(query);
    });
  }, [servicesList, debouncedSearch]);

  // Pagination calculation
  const totalItems = filteredServices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / listPerPages));
  const displayedServices = useMemo(() => {
    const start = currentPage * listPerPages;
    return filteredServices.slice(start, start + listPerPages);
  }, [filteredServices, currentPage, listPerPages]);

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

  // Add / Edit Handlers
  const handleOpenAdd = () => {
    setEditingService(null);
    setShowServiceModal(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
  };

  const handleSubmitService = (values, { setSubmitting, resetForm }) => {
    const payload = {
      name: values.name?.trim(),
      cost: Number(values.cost),
    };

    if (editingService?.id) {
      dispatch(
        updateService({
          id: editingService.id,
          data: payload,
          callback: (res) => {
            setSubmitting(false);
            if (res) {
              handleCloseServiceModal();
              resetForm();
              dispatch(getServices({ search: debouncedSearch }));
            }
          },
        })
      );
    } else {
      dispatch(
        createService({
          data: payload,
          callback: (res) => {
            setSubmitting(false);
            if (res) {
              handleCloseServiceModal();
              resetForm();
              dispatch(getServices({ search: debouncedSearch }));
            }
          },
        })
      );
    }
  };

  // Delete Handlers
  const handleOpenDelete = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedService(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = () => {
    if (!selectedService?.id) return;
    setIsDeleting(true);
    dispatch(
      deleteService({
        id: selectedService.id,
        callback: (res) => {
          setIsDeleting(false);
          if (res) {
            handleCloseDelete();
            dispatch(getServices({ search: debouncedSearch }));
          }
        },
      })
    );
  };

  // Initial Formik values
  const initialServiceValues = {
    name: editingService?.name || '',
    cost: editingService?.cost !== undefined && editingService?.cost !== null ? editingService.cost : '',
  };

  return (
    <Layout>
      <SubHeader
        title="Services"
        subtitle="Manage all dealership services, labor rates, and maintenance pricing."
      >
        <button
          type="button"
          onClick={handleOpenAdd}
          className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add New Service</span>
        </button>
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">
          {/* Search Bar */}
          <div className="mb-4 position-relative">
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
              placeholder="Search by Service Name or Cost..."
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

          {/* Services Table */}
          <div className="table-responsive">
            <table className="table ct_custom_table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Name</th>
                  <th>Service Cost</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isServicesLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                        <span className="text-muted ct_fs_14">Loading services...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedServices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted ct_fs_14">
                      {searchTerm
                        ? 'No services match your search.'
                        : 'No services found. Click "Add New Service" to create one.'}
                    </td>
                  </tr>
                ) : (
                  displayedServices.map((service, index) => {
                    const displayName = service.name || 'N/A';
                    const displayCost = formatCurrency(service.cost);

                    return (
                      <tr key={service.id || index}>
                        <td>{currentPage * listPerPages + index + 1}</td>

                        {/* Service Name */}
                        <td className="ct_fw_600">
                          {displayName}
                        </td>

                        {/* Cost */}
                        <td className="ct_fw_700 text-dark">
                          {displayCost}
                        </td>

                        {/* Created Date */}
                        <td>{formatDate(service.created_at)}</td>



                        {/* Actions */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              className="ct_action_icon_btn ct_edit_btn"
                              title="Edit Service"
                              onClick={() => handleOpenEdit(service)}
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>

                            <button
                              type="button"
                              className="ct_action_icon_btn ct_delete_btn"
                              title="Delete Service"
                              onClick={() => handleOpenDelete(service)}
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
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

      {/* Add / Edit Service Modal */}
      {showServiceModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="ct_fs_20 ct_fw_700 ct_head_clr mb-1">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h4>
                  <p className="text-muted ct_fs_13 mb-0">
                    {editingService
                      ? 'Update the service details and pricing below.'
                      : 'Fill in the details below to add a new service to your catalog.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseServiceModal}
                ></button>
              </div>

              <Formik
                enableReinitialize
                initialValues={initialServiceValues}
                validationSchema={serviceSchema}
                onSubmit={handleSubmitService}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => {
                  return (
                    <Form>
                      <div className="modal-body px-4 py-3">
                        <div className="row g-3">
                          {/* Service Name */}
                          <div className="col-12">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="service_name">
                                Service Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="service_name"
                                name="name"
                                className="form-control ct_input"
                                placeholder="Enter service name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="name" />
                            </div>
                          </div>

                          {/* Service Cost */}
                          <div className="col-12">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="service_cost">
                                Service Cost ($) <span className="text-danger">*</span>
                              </label>
                              <div className="position-relative">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  id="service_cost"
                                  name="cost"
                                  className="form-control ct_input"
                                  placeholder="Enter service cost"
                                  value={values.cost}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  onWheel={(e) => e.target.blur()}
                                />
                              </div>
                              <ErrorMessage errors={errors} touched={touched} fieldName="cost" />
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="modal-footer border-0 pt-0 pb-4 px-4 d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn ct_btn_gray px-4 py-2 ct_btn_h_45"
                          onClick={handleCloseServiceModal}
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
                              <span>{editingService ? 'Updating...' : 'Creating...'}</span>
                            </>
                          ) : (
                            editingService ? 'Update Service' : 'Create Service'
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-body text-center p-4 p-sm-5">
                <div className="mb-4">
                  <div
                    className="mx-auto d-flex align-items-center justify-content-center"
                    style={{
                      width: '68px',
                      height: '68px',
                      background: '#FEE2E2',
                      borderRadius: '50%',
                    }}
                  >
                    <i className="fa-solid fa-triangle-exclamation text-danger fs-2"></i>
                  </div>
                </div>

                <h3 className="ct_fs_20 ct_fw_600 text-dark mb-2">Delete Service</h3>

                <p className="ct_para_clr mb-4 mx-auto" style={{ maxWidth: '360px', fontSize: '14px' }}>
                  Are you sure you want to delete{' '}
                  <strong className="text-dark">
                    {selectedService?.name || 'this service'}
                  </strong>?
                  This action cannot be undone.
                </p>

                <div className="d-flex gap-3 justify-content-center">
                  <button
                    type="button"
                    className="previous action-button-previous px-4 py-2 border-0 flex-grow-1"
                    onClick={handleCloseDelete}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4 py-2 ct_fw_600 flex-grow-1 "
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    style={{ minHeight: '44px', borderRadius: "10px" }}
                  >
                    {isDeleting ? (
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Services;
