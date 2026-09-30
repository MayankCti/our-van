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
import { createSupplierSchema } from '../../utils/Schema';
import {
  getSuppliersByDealer,
  createSupplier,
  toggleBlockSupplier,
  deleteSupplier,
} from '../../redux/slices/supplierSlice';

const Suppliers = () => {
  const dispatch = useDispatch();

  const {
    suppliersList = [],
    isSuppliersLoading = false,
    isActionLoading = false,
  } = useSelector((state) => state.supplierReducer || {});

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Modal & action states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingToggleId, setLoadingToggleId] = useState(null);

  // Fetch suppliers on mount and on debouncedSearch
  useEffect(() => {
    dispatch(
      getSuppliersByDealer({
        search: debouncedSearch,
      })
    );
  }, [dispatch, debouncedSearch]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, listPerPages]);

  // Client-side filtering
  const filteredSuppliers = useMemo(() => {
    if (!debouncedSearch.trim()) return suppliersList;
    const query = debouncedSearch.toLowerCase().trim();
    return suppliersList.filter((sup) => {
      const name = (sup.name || sup.full_name || sup.company_name || '').toLowerCase();
      const email = (sup.email || '').toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [suppliersList, debouncedSearch]);

  // Pagination calculation
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / listPerPages));
  const displayedSuppliers = useMemo(() => {
    const start = currentPage * listPerPages;
    return filteredSuppliers.slice(start, start + listPerPages);
  }, [filteredSuppliers, currentPage, listPerPages]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
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

  const isSupplierActive = (sup) => {
    if (sup.is_block !== undefined && sup.is_block !== null) {
      return sup.is_block === 0;
    }
    return sup.status === 1;
  };

  // Toggle Block / Unblock
  const handleToggleBlock = (sup) => {
    const suppId = sup?.id || sup?.supplier_id;
    if (!suppId) return;
    setLoadingToggleId(suppId);
    dispatch(
      toggleBlockSupplier({
        id: suppId,
        callback: () => {
          setLoadingToggleId(null);
          dispatch(
            getSuppliersByDealer({
              search: debouncedSearch,
            })
          );
        },
      })
    );
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setShowAddModal(true);
  };

  // Close Add Modal
  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (sup) => {
    setSelectedSupplier(sup);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedSupplier(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!selectedSupplier?.id) return;
    setIsDeleting(true);
    dispatch(
      deleteSupplier({
        id: selectedSupplier.id,
        callback: (res) => {
          setIsDeleting(false);
          if (res) {
            handleCloseDelete();
          }
        },
      })
    );
  };

  // Form Initial Values (Only 2 fields: full_name and email)
  const initialSupplierValues = {
    full_name: '',
    email: '',
  };

  // Create Supplier Submit Handler
  const handleCreateSupplier = (values, { setSubmitting, resetForm }) => {
    const payload = {
      full_name: values.full_name?.trim(),
      email: values.email?.trim(),
    };

    dispatch(
      createSupplier({
        data: payload,
        callback: (res) => {
          setSubmitting(false);
          if (res) {
            handleCloseModal();
            resetForm();
            dispatch(getSuppliersByDealer({ search: debouncedSearch }));
          }
        },
      })
    );
  };

  return (
    <Layout>
      <SubHeader
        title="Suppliers"
        subtitle="View and manage all suppliers assigned to your dealership."
      >
        <button
          type="button"
          onClick={handleOpenAdd}
          className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add New Supplier</span>
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
              placeholder="Search by Supplier Name or Email..."
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

          {/* Suppliers Table */}
          <div className="table-responsive ct_custom_table">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Supplier Name</th>
                  <th>Email Address</th>
                  <th>Assigned Jobs</th>
                  <th>Completed Jobs</th>
                  <th>Joined On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {isSuppliersLoading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                        <span className="text-muted ct_fs_14">Loading suppliers...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted ct_fs_14">
                      {searchTerm ? 'No suppliers match your search.' : 'No suppliers found. Click "Add New Supplier" to create one.'}
                    </td>
                  </tr>
                ) : (
                  displayedSuppliers.map((sup, index) => {
                    const active = isSupplierActive(sup);
                    const isToggling = loadingToggleId === sup.id;
                    const displayName = sup.name || sup.full_name || sup.company_name || 'N/A';
                    const assignedJobs = sup.job_summary?.total_assigned_jobs ?? sup.total_assigned_jobs ?? 0;
                    const completedJobs = sup.job_summary?.total_completed_jobs ?? sup.total_completed_jobs ?? 0;

                    return (
                      <tr key={sup.id || index}>
                        <td>{currentPage * listPerPages + index + 1}</td>

                        {/* Supplier Name */}
                        <td className="ct_fw_600">
                          {displayName}
                        </td>

                        {/* Email Address */}
                        <td>{sup.email || 'N/A'}</td>

                        {/* Assigned Jobs Count */}
                        <td>

                          {assignedJobs}

                        </td>

                        {/* Completed Jobs Count */}
                        <td>

                          {completedJobs}

                        </td>

                        {/* Joined Date */}
                        <td>{formatDate(sup.created_at)}</td>

                        {/* Status Toggle Switch */}
                        <td>
                          <label
                            className="toggle-switch"
                            style={{
                              opacity: isToggling ? 0.6 : 1,
                              cursor: isToggling ? 'not-allowed' : 'pointer',
                            }}
                            title={active ? 'Active (Click to Block)' : 'Inactive / Blocked (Click to Activate)'}
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              disabled={isToggling}
                              onChange={() => handleToggleBlock(sup)}
                            />
                            <div className="toggle-switch-background">
                              <div className="toggle-switch-handle"></div>
                            </div>
                          </label>
                        </td>

                        {/* Action Buttons */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Link
                              to={`${pageRoutes.supplier_detail}?id=${sup.id}`}
                              className="ct_action_icon_btn ct_view_btn"
                              title="View Details"
                            >
                              <i className="fa-regular fa-eye"></i>
                            </Link>
                            <button
                              type="button"
                              className="ct_action_icon_btn ct_delete_btn"
                              title="Delete Supplier"
                              onClick={() => handleOpenDelete(sup)}
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

      {/* Add Supplier Modal (Only 2 Fields: Name & Email) */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '520px' }}>
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="ct_fs_20 ct_fw_700 ct_head_clr mb-1">
                    Add New Supplier
                  </h4>
                  <p className="text-muted ct_fs_13 mb-0">
                    Fill in the details below to add a new supplier to your network.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>

              <Formik
                initialValues={initialSupplierValues}
                enableReinitialize
                validationSchema={createSupplierSchema}
                onSubmit={handleCreateSupplier}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => {
                  return (
                    <Form>
                      <div className="modal-body px-4 py-3">
                        <div className="row g-3">
                          {/* 1. Supplier Name (full_name) */}
                          <div className="col-12">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="full_name">
                                Contact Person / Full Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                className="form-control ct_input"
                                placeholder="Enter full name"
                                value={values.full_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="full_name" />
                            </div>
                          </div>

                          {/* 2. Email Address */}
                          <div className="col-12">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="email">
                                Email Address <span className="text-danger">*</span>
                              </label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control ct_input"
                                placeholder="Enter email address"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="email" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer border-0 pt-0 pb-4 px-4 d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn ct_btn_gray px-4 py-2 ct_btn_h_45"
                          onClick={handleCloseModal}
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
                              <span>Creating...</span>
                            </>
                          ) : (
                            'Create Supplier'
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

                <h3 className="ct_fs_20 ct_fw_600 text-dark mb-2">Delete Supplier</h3>

                <p className="ct_para_clr mb-4 mx-auto" style={{ maxWidth: '360px', fontSize: '14px' }}>
                  Are you sure you want to delete{' '}
                  <strong className="text-dark">
                    {selectedSupplier?.name || selectedSupplier?.full_name || selectedSupplier?.company_name || 'this supplier'}
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

export default Suppliers;
