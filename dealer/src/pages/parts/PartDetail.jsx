import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import ErrorMessage from '../../components/form/ErrorMessage';
import { editPartSchema } from '../../utils/Schema';
import {
  getPartById,
  updatePart,
  deletePart,
} from '../../redux/slices/partSlice';

const PartDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partId = searchParams.get('id') || searchParams.get('part_id');

  const {
    partDetails,
    isDetailsLoading = false,
    isActionLoading = false,
  } = useSelector((state) => state.partReducer || {});

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (partId) {
      dispatch(getPartById({ id: partId }));
    }
  }, [dispatch, partId]);

  const part = partDetails?.data || partDetails || {};

  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === '') return '$0.00';
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const qty = Number(part.stock_quantity ?? 0);
  const threshold = Number(part.low_stock_threshold ?? 0);
  const isOutOfStock = part.out_of_stock === true || qty <= 0;
  const isLowStock = !isOutOfStock && qty <= threshold;

  // Handle Edit Submit
  const handleSubmitEdit = (values, { setSubmitting }) => {
    const payload = {
      part_name: values.part_name?.trim(),
      manufacturer: values.manufacturer?.trim(),
      original_cost: Number(values.original_cost),
      service_cost: Number(values.service_cost),
      stock_quantity: Number(values.stock_quantity),
      low_stock_threshold: Number(values.low_stock_threshold),
    };

    dispatch(
      updatePart({
        id: partId,
        data: payload,
        callback: (res) => {
          setSubmitting(false);
          if (res) {
            setShowEditModal(false);
            dispatch(getPartById({ id: partId }));
          }
        },
      })
    );
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (!partId) return;
    dispatch(
      deletePart({
        id: partId,
        callback: (res) => {
          if (res) {
            setShowDeleteModal(false);
            navigate(pageRoutes.parts);
          }
        },
      })
    );
  };

  const initialFormValues = {
    part_name: part.part_name || '',
    manufacturer: part.manufacturer || '',
    original_cost: part.original_cost !== undefined ? part.original_cost : '',
    service_cost: part.service_cost !== undefined ? part.service_cost : '',
    stock_quantity: part.stock_quantity !== undefined ? part.stock_quantity : '',
    low_stock_threshold: part.low_stock_threshold !== undefined ? part.low_stock_threshold : '',
  };

  return (
    <Layout>
      <SubHeader
        title={part.part_name ? `${part.part_name} Details` : 'Part Details'}
        subtitle="View complete part specifications, pricing, and stock status."
        backUrl={pageRoutes.parts}
      >
        {part?.id && (
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {isOutOfStock ? (
              <span
                className="badge bg-danger-subtle text-danger border border-danger-subtle"
                style={{ fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '20px' }}
              >
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span
                className="badge bg-warning-subtle text-warning border border-warning-subtle"
                style={{ fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '20px' }}
              >
                Low Stock ({qty})
              </span>
            ) : (
              <span
                className="badge bg-success-subtle text-success border border-success-subtle"
                style={{ fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '20px' }}
              >
                In Stock ({qty})
              </span>
            )}

            <button
              type="button"
              className="btn btn-sm btn-outline-success ct_fw_600 px-3 py-1 d-flex align-items-center gap-1"
              onClick={() => setShowEditModal(true)}
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              <i className="fa-regular fa-pen-to-square"></i>
              <span>Edit Part</span>
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger ct_fw_600 px-3 py-1 d-flex align-items-center gap-1"
              onClick={() => setShowDeleteModal(true)}
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              <i className="fa-regular fa-trash-can"></i>
              <span>Delete</span>
            </button>
          </div>
        )}
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-4">
        {isDetailsLoading && !part?.id ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="spinner-border text-success mb-3 mx-auto" role="status"></div>
            <p className="text-muted ct_fs_15 mb-0">Loading part details...</p>
          </div>
        ) : !partId || (!part?.id && !isDetailsLoading) ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <i className="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Part Not Found</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              The requested part could not be found or has been removed.
            </p>
            <div className="d-flex justify-content-center">
              <Link to={pageRoutes.parts} className="ct_green_btn ct_btn_h_42 px-4">
                Back to Parts Management
              </Link>
            </div>
          </div>
        ) : (
          <section className="ct_profile_card">
            {/* Header / Basic Information */}
            <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
              <div className="ct_van_det_icon_box">
                <i className="fa-solid fa-boxes-stacked text-success"></i>
              </div>
              <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">Part Information</h5>
            </div>

            {/* Profile Banner */}
            <div className="mb-4 pb-4 border-bottom">
              <h4 className="ct_head_clr ct_fs_20 ct_fw_600 mb-1">
                {part.part_name || 'N/A'}
              </h4>
              <div className="text-muted ct_fs_13">
                <span>
                  Manufacturer: <strong className="text-dark">{part.manufacturer || 'N/A'}</strong>
                </span>
              </div>
            </div>

            {/* Fields Grid matching Table data */}
            <div className="row gy-4">
              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Part Name
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{part.part_name || 'N/A'}</h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Manufacturer
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{part.manufacturer || 'N/A'}</h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Stock Quantity
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_600">{part.stock_quantity ?? 0}</h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Low Stock Threshold
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_500">{part.low_stock_threshold ?? 0}</h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Original Cost
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_500">{formatCurrency(part.original_cost)}</h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Service Cost
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_600 ">{formatCurrency(part.service_cost)}</h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Stock Status
                </h5>
                <div className="mt-1">
                  {isOutOfStock ? (
                    <span
                      className="badge bg-danger-subtle text-danger border border-danger-subtle"
                      style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
                    >
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span
                      className="badge bg-warning-subtle text-warning border border-warning-subtle"
                      style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
                    >
                      Low Stock ({qty})
                    </span>
                  ) : (
                    <span
                      className="badge bg-success-subtle text-success border border-success-subtle"
                      style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
                    >
                      In Stock ({qty})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Edit Part Modal */}
      {showEditModal && (
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
                  <h4 className="ct_fs_20 ct_fw_700 ct_head_clr mb-1">Edit Part</h4>
                  <p className="text-muted ct_fs_13 mb-0">
                    Update part details, pricing, and stock quantity.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>

              <Formik
                initialValues={initialFormValues}
                validationSchema={editPartSchema}
                enableReinitialize
                onSubmit={handleSubmitEdit}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => {
                  return (
                    <Form>
                      <div className="modal-body px-4 py-3">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="edit_part_name">
                                Part Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="edit_part_name"
                                name="part_name"
                                className="form-control ct_input"
                                value={values.part_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="part_name" />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="edit_manufacturer">
                                Manufacturer <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="edit_manufacturer"
                                name="manufacturer"
                                className="form-control ct_input"
                                value={values.manufacturer}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="manufacturer" />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="edit_original_cost">
                                Original Cost ($) <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="edit_original_cost"
                                name="original_cost"
                                step="0.01"
                                min="0"
                                className="form-control ct_input"
                                value={values.original_cost}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="original_cost" />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="edit_service_cost">
                                Service Cost ($) <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="edit_service_cost"
                                name="service_cost"
                                step="0.01"
                                min="0"
                                className="form-control ct_input"
                                value={values.service_cost}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="service_cost" />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="edit_stock_quantity">
                                Stock Quantity <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="edit_stock_quantity"
                                name="stock_quantity"
                                min="0"
                                step="1"
                                className="form-control ct_input"
                                value={values.stock_quantity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="stock_quantity" />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="edit_low_stock_threshold">
                                Low Stock Alert Threshold <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="edit_low_stock_threshold"
                                name="low_stock_threshold"
                                min="0"
                                step="1"
                                className="form-control ct_input"
                                value={values.low_stock_threshold}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="low_stock_threshold" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer border-0 pt-0 pb-4 px-4 d-flex gap-3 justify-content-end">
                        <button
                          type="button"
                          className="btn ct_btn_gray px-4 py-2 ct_btn_h_45"
                          onClick={() => setShowEditModal(false)}
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
                              <span>Saving...</span>
                            </>
                          ) : (
                            'Update Part'
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

                <h3 className="ct_fs_20 ct_fw_600 text-dark mb-2">Delete Part</h3>

                <p className="ct_para_clr mb-4 mx-auto" style={{ maxWidth: '360px', fontSize: '14px' }}>
                  Are you sure you want to delete{' '}
                  <strong className="text-dark">{part?.part_name || 'this part'}</strong>?
                  This action cannot be undone.
                </p>

                <div className="d-flex gap-3 justify-content-center">
                  <button
                    type="button"
                    className="previous action-button-previous px-4 py-2 border-0 flex-grow-1"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isActionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4 py-2 ct_fw_600 flex-grow-1 rounded-3"
                    onClick={handleConfirmDelete}
                    disabled={isActionLoading}
                    style={{ minHeight: '44px' }}
                  >
                    {isActionLoading ? (
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

export default PartDetail;
