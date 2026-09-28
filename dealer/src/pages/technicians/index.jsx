import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import PaginationDropdown from '../../components/table/PaginationDropdown';
import ReactPagination from '../../components/table/ReactPagination';
import ErrorMessage from '../../components/form/ErrorMessage';
import PhoneInputField from '../../components/form/PhoneInputField';
import Eye from '../../components/form/Eye';
import useDebounce from '../../hooks/useDebounce';
import { pageRoutes } from '../../routes/PageRoutes';
import { createTechnicianSchema } from '../../utils/Schema';
import {
  getTechniciansByDealer,
  createTechnician,
  toggleBlockTechnician,
  deleteTechnician,
} from '../../redux/slices/technicianSlice';

const Technicians = () => {
  const dispatch = useDispatch();

  const {
    techniciansList = [],
    isTechniciansLoading = false,
    isActionLoading = false,
  } = useSelector((state) => state.technicianReducer || {});

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Modal & action states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingToggleId, setLoadingToggleId] = useState(null);

  // Fetch technicians on mount and on debouncedSearch
  useEffect(() => {
    dispatch(
      getTechniciansByDealer({
        search: debouncedSearch,
      })
    );
  }, [dispatch, debouncedSearch]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, listPerPages]);

  // Client-side filtering in case API returns full list
  const filteredTechnicians = useMemo(() => {
    if (!debouncedSearch.trim()) return techniciansList;
    const query = debouncedSearch.toLowerCase().trim();
    return techniciansList.filter((tech) => {
      const name = (tech.full_name || tech.name || '').toLowerCase();
      const email = (tech.email || '').toLowerCase();
      const role = (tech.job_role || '').toLowerCase();
      const phone = `${tech.country_code || ''} ${tech.phone_number || tech.contact_number || ''}`.toLowerCase();
      return name.includes(query) || email.includes(query) || phone.includes(query) || role.includes(query);
    });
  }, [techniciansList, debouncedSearch]);

  // Pagination calculation
  const totalItems = filteredTechnicians.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / listPerPages));
  const displayedTechnicians = useMemo(() => {
    const start = currentPage * listPerPages;
    return filteredTechnicians.slice(start, start + listPerPages);
  }, [filteredTechnicians, currentPage, listPerPages]);

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

  const isTechnicianActive = (tech) => {
    if (tech.is_block !== undefined && tech.is_block !== null) {
      return tech.is_block === 0;
    }
    return tech.status === 1;
  };

  // Toggle Block / Unblock
  const handleToggleBlock = (tech) => {
    const techId = tech?.id || tech?.technician_id;
    if (!techId) return;
    setLoadingToggleId(techId);
    dispatch(
      toggleBlockTechnician({
        id: techId,
        callback: () => {
          setLoadingToggleId(null);
          dispatch(
            getTechniciansByDealer({
              search: debouncedSearch,
            })
          );
        },
      })
    );
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (tech) => {
    setSelectedTech(tech);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedTech(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!selectedTech?.id) return;
    setIsDeleting(true);
    dispatch(
      deleteTechnician({
        id: selectedTech.id,
        callback: (res) => {
          setIsDeleting(false);
          if (res) {
            handleCloseDelete();
          }
        },
      })
    );
  };

  // Create Technician Form Handlers
  const initialTechnicianValues = {
    name: '',
    email: '',
    password: '',
    job_role: '',
    contact_number: '',
    home_address: '',
  };

  const handleCreateTechnician = (values, { setSubmitting, resetForm }) => {
    const payload = {
      name: values.name?.trim(),
      email: values.email?.trim(),
      password: values.password,
      job_role: values.job_role?.trim() || undefined,
      contact_number: values.contact_number?.trim(),
      home_address: values.home_address?.trim() || undefined,
    };

    dispatch(
      createTechnician({
        data: payload,
        callback: (res) => {
          setSubmitting(false);
          if (res) {
            setShowAddModal(false);
            setShowPassword(false);
            resetForm();
            dispatch(getTechniciansByDealer({ search: debouncedSearch }));
          }
        },
      })
    );
  };

  return (
    <Layout>
      <SubHeader
        title="Technicians"
        subtitle="View and manage all technicians assigned to your dealership."
      >
        <button
          type="button"
          onClick={() => {
            setShowPassword(false);
            setShowAddModal(true);
          }}
          className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add New Technician</span>
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
              placeholder="Search by Technician Name, Email, or Phone..."
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

          {/* Technicians Table */}
          <div className="table-responsive ct_custom_table">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Technician Name</th>
                  <th>Job Role</th>
                  <th>Email Address</th>
                  <th>Mobile Number</th>
                  <th>Joined On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {isTechniciansLoading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                        <span className="text-muted ct_fs_14">Loading technicians...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedTechnicians.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted ct_fs_14">
                      {searchTerm ? 'No technicians match your search.' : 'No technicians found. Click "Add New Technician" to create one.'}
                    </td>
                  </tr>
                ) : (
                  displayedTechnicians.map((tech, index) => {
                    const active = isTechnicianActive(tech);
                    const isToggling = loadingToggleId === tech.id;
                    const phoneVal = tech.phone_number || tech.contact_number;
                    const phoneDisplay = phoneVal
                      ? (phoneVal.startsWith('+')
                        ? phoneVal
                        : `${tech.country_code ? tech.country_code + ' ' : ''}${phoneVal}`)
                      : 'N/A';
                    const displayName = tech.full_name || tech.name || 'N/A';
                    const roleName = tech.job_role || 'Technician';

                    return (
                      <tr key={tech.id || index}>
                        <td>{currentPage * listPerPages + index + 1}</td>

                        {/* Technician Name */}
                        <td className="ct_fw_600">
                          {displayName}
                        </td>

                        {/* Job Role */}
                        <td className="ct_fw_500">
                          {roleName}
                        </td>

                        <td>{tech.email || 'N/A'}</td>
                        <td>{phoneDisplay}</td>
                        <td>{formatDate(tech.created_at)}</td>

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
                              onChange={() => handleToggleBlock(tech)}
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
                              to={`${pageRoutes.technician_detail}?id=${tech.id}`}
                              className="ct_action_icon_btn ct_view_btn"
                              title="View Details"
                            >
                              <i className="fa-regular fa-eye"></i>
                            </Link>
                            <button
                              type="button"
                              className="ct_action_icon_btn ct_delete_btn"
                              title="Delete Technician"
                              onClick={() => handleOpenDelete(tech)}
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
          {filteredTechnicians.length > 0 && (
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

      {/* Create Technician Modal */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="ct_fs_20 ct_fw_700 ct_head_clr mb-1">
                    Add New Technician
                  </h4>
                  <p className="text-muted ct_fs_13 mb-0">
                    Fill in the details below to register a technician to your dealership.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>

              <Formik
                initialValues={initialTechnicianValues}
                validationSchema={createTechnicianSchema}
                onSubmit={handleCreateTechnician}
              >
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, isSubmitting }) => {
                  return (
                    <Form>
                      <div className="modal-body px-4 py-3">
                        <div className="row g-3">
                          {/* Technician Name */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="name">
                                Full Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control ct_input"
                                placeholder="Enter full name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="name" />
                            </div>
                          </div>

                          {/* Email Address */}
                          <div className="col-md-6">
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

                          {/* Password */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="password">
                                Password <span className="text-danger">*</span>
                              </label>
                              <div className="position-relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  id="password"
                                  name="password"
                                  className="form-control ct_input ct_input_pe_40"
                                  placeholder="Enter password"
                                  value={values.password}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <Eye isEye={showPassword} onClick={setShowPassword} />
                              </div>
                              <ErrorMessage errors={errors} touched={touched} fieldName="password" />
                            </div>
                          </div>

                          {/* Contact Number */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="contact_number">
                                Contact Number <span className="text-danger">*</span>
                              </label>
                              <PhoneInputField
                                id="contact_number"
                                name="contact_number"
                                value={values.contact_number}
                                placeholder="Enter contact number"
                                onChange={(val) => setFieldValue('contact_number', val)}
                                onBlur={() => setFieldTouched('contact_number', true)}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="contact_number" />
                            </div>
                          </div>

                          {/* Job Role */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="job_role">
                                Job Role / Specialization
                              </label>
                              <input
                                type="text"
                                id="job_role"
                                name="job_role"
                                className="form-control ct_input"
                                placeholder="Enter job role"
                                value={values.job_role}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="job_role" />
                            </div>
                          </div>

                          {/* Home Address */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="home_address">
                                Home Address
                              </label>
                              <input
                                type="text"
                                id="home_address"
                                name="home_address"
                                className="form-control ct_input"
                                placeholder="Enter home address"
                                value={values.home_address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="home_address" />
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="modal-footer border-0 pt-0 pb-4 px-4 d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn ct_btn_gray px-4 py-2 ct_btn_h_45"
                          onClick={() => setShowAddModal(false)}
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
                            'Create Technician'
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

                <h3 className="ct_fs_20 ct_fw_600 text-dark mb-2">Delete Technician</h3>

                <p className="ct_para_clr mb-4 mx-auto" style={{ maxWidth: '360px', fontSize: '14px' }}>
                  Are you sure you want to delete{' '}
                  <strong className="text-dark">{selectedTech?.full_name || selectedTech?.name || 'this technician'}</strong>?
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
                    className="btn btn-danger px-4 py-2 ct_fw_600 flex-grow-1 rounded-3"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    style={{ minHeight: '44px' }}
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

export default Technicians;
