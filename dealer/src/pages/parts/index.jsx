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
import { addPartSchema, editPartSchema } from '../../utils/Schema';
import {
  getParts,
  createPart,
  updatePart,
  deletePart,
} from '../../redux/slices/partSlice';

const Parts = () => {
  const dispatch = useDispatch();

  const {
    partsList = [],
    isPartsLoading = false,
    isActionLoading = false,
  } = useSelector((state) => state.partReducer || {});

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Modal states
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  // Fetch parts on mount & search
  useEffect(() => {
    dispatch(
      getParts({
        search: debouncedSearch,
      })
    );
  }, [dispatch, debouncedSearch]);

  // Reset pagination on search / page size change
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, listPerPages]);

  // Client-side filtering fallback
  const filteredParts = useMemo(() => {
    if (!Array.isArray(partsList)) return [];
    if (!debouncedSearch.trim()) return partsList;
    const query = debouncedSearch.toLowerCase().trim();
    return partsList.filter((part) => {
      const name = (part.part_name || '').toLowerCase();
      const manufacturer = (part.manufacturer || '').toLowerCase();
      const origCost = String(part.original_cost || '');
      const servCost = String(part.service_cost || '');
      return (
        name.includes(query) ||
        manufacturer.includes(query) ||
        origCost.includes(query) ||
        servCost.includes(query)
      );
    });
  }, [partsList, debouncedSearch]);

  // Inventory summary metrics
  const stats = useMemo(() => {
    if (!Array.isArray(partsList)) {
      return { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 };
    }
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    partsList.forEach((p) => {
      const qty = Number(p.stock_quantity ?? 0);
      const threshold = Number(p.low_stock_threshold ?? 0);
      const isOutOfStock = p.out_of_stock === true || qty <= 0;

      if (isOutOfStock) {
        outOfStock += 1;
      } else if (qty <= threshold) {
        lowStock += 1;
      } else {
        inStock += 1;
      }
    });

    return {
      total: partsList.length,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [partsList]);

  // Pagination calculation
  const totalItems = filteredParts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / listPerPages));
  const displayedParts = useMemo(() => {
    const start = currentPage * listPerPages;
    return filteredParts.slice(start, start + listPerPages);
  }, [filteredParts, currentPage, listPerPages]);

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

  const getStockStatusBadge = (part) => {
    const qty = Number(part.stock_quantity ?? 0);
    const threshold = Number(part.low_stock_threshold ?? 0);
    const isOutOfStock = part.out_of_stock === true || qty <= 0;

    if (isOutOfStock) {
      return (
        <span
          className="badge bg-danger-subtle text-danger border border-danger-subtle"
          style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
        >
          Out of Stock
        </span>
      );
    }
    if (qty <= threshold) {
      return (
        <span
          className="badge bg-warning-subtle text-warning border border-warning-subtle"
          style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
        >
          Low Stock ({qty})
        </span>
      );
    }
    return (
      <span
        className="badge bg-success-subtle text-success border border-success-subtle"
        style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
      >
        In Stock ({qty})
      </span>
    );
  };

  // Add / Edit Handlers
  const handleOpenAdd = () => {
    setEditingPart(null);
    setShowPartModal(true);
  };

  const handleOpenEdit = (part) => {
    setEditingPart(part);
    setShowPartModal(true);
  };

  const handleClosePartModal = () => {
    setShowPartModal(false);
    setEditingPart(null);
  };

  const handleSubmitPart = (values, { setSubmitting, resetForm }) => {
    const payload = {
      part_name: values.part_name?.trim(),
      manufacturer: values.manufacturer?.trim(),
      original_cost: Number(values.original_cost),
      service_cost: Number(values.service_cost),
      stock_quantity: Number(values.stock_quantity),
      low_stock_threshold: Number(values.low_stock_threshold),
    };

    if (editingPart?.id) {
      dispatch(
        updatePart({
          id: editingPart.id,
          data: payload,
          callback: (res) => {
            setSubmitting(false);
            if (res) {
              handleClosePartModal();
              resetForm();
              dispatch(getParts({ search: debouncedSearch }));
            }
          },
        })
      );
    } else {
      dispatch(
        createPart({
          data: payload,
          callback: (res) => {
            setSubmitting(false);
            if (res) {
              handleClosePartModal();
              resetForm();
              dispatch(getParts({ search: debouncedSearch }));
            }
          },
        })
      );
    }
  };

  // Delete Handlers
  const handleOpenDelete = (part) => {
    setSelectedPart(part);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedPart(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedPart?.id) return;
    dispatch(
      deletePart({
        id: selectedPart.id,
        callback: (res) => {
          if (res) {
            handleCloseDelete();
            dispatch(getParts({ search: debouncedSearch }));
          }
        },
      })
    );
  };

  const initialFormValues = {
    part_name: editingPart?.part_name || '',
    manufacturer: editingPart?.manufacturer || '',
    original_cost: editingPart?.original_cost !== undefined ? editingPart.original_cost : '',
    service_cost: editingPart?.service_cost !== undefined ? editingPart.service_cost : '',
    stock_quantity: editingPart?.stock_quantity !== undefined ? editingPart.stock_quantity : '',
    low_stock_threshold: editingPart?.low_stock_threshold !== undefined ? editingPart.low_stock_threshold : '',
  };

  return (
    <Layout>
      <SubHeader
        title="Parts Management"
        subtitle="Track stock, view pricing, and manage spare parts inventory for your dealership."
      >
        <button
          type="button"
          onClick={handleOpenAdd}
          className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add New Part</span>
        </button>
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">

          {/* Summary Cards matching Dashboard Style */}
          <div className="row">
            {/* Card 1 - Total Parts */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_1.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isPartsLoading ? "..." : stats.total}</h3>
                  <p>Total Parts</p>
                </div>
              </div>
            </div>

            {/* Card 2 - In Stock */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_2.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isPartsLoading ? "..." : stats.inStock}</h3>
                  <p>In Stock</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Low Stock Alert */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_3.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isPartsLoading ? "..." : stats.lowStock}</h3>
                  <p>Low Stock Alert</p>
                </div>
              </div>
            </div>

            {/* Card 4 - Out of Stock */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_4.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>{isPartsLoading ? "..." : stats.outOfStock}</h3>
                  <p>Out of Stock</p>
                </div>
              </div>
            </div>
          </div>

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
              placeholder="Search by Part Name, Manufacturer, or Cost..."
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

          {/* Parts Table */}
          <div className="table-responsive ct_custom_table">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Part Name</th>
                  <th>Manufacturer</th>
                  <th>Stock Quantity</th>
                  <th>Original Cost</th>
                  <th>Service Cost</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {isPartsLoading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                        <span className="text-muted ct_fs_14">Loading parts inventory...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedParts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted ct_fs_14">
                      {searchTerm ? 'No parts match your search criteria.' : 'No parts found in inventory. Click "Add New Part" to add one.'}
                    </td>
                  </tr>
                ) : (
                  displayedParts.map((part, index) => {
                    return (
                      <tr key={part.id || index}>
                        <td>{currentPage * listPerPages + index + 1}</td>

                        {/* Part Name */}
                        <td className="ct_fw_600">
                          {part.part_name || 'N/A'}
                        </td>

                        {/* Manufacturer */}
                        <td>
                          {part.manufacturer || 'N/A'}
                        </td>

                        {/* Stock Quantity */}
                        <td className="ct_fw_600">
                          {part.stock_quantity ?? 0}
                        </td>

                        {/* Original Cost */}
                        <td className="ct_para_clr">
                          {formatCurrency(part.original_cost)}
                        </td>

                        {/* Service Cost */}
                        <td className="ct_fw_600 ">
                          {formatCurrency(part.service_cost)}
                        </td>

                        {/* Low Stock Threshold */}
                        <td className="text-muted">
                          {part.low_stock_threshold ?? 0}
                        </td>

                        {/* Stock Status Badge */}
                        <td>{getStockStatusBadge(part)}</td>

                        {/* Actions */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Link
                              to={`${pageRoutes.part_detail}?id=${part.id}`}
                              className="ct_action_icon_btn ct_view_btn"
                              title="View Part Details"
                            >
                              <i className="fa-regular fa-eye"></i>
                            </Link>
                            <button
                              type="button"
                              className="ct_action_icon_btn ct_edit_btn"
                              title="Edit Part"
                              onClick={() => handleOpenEdit(part)}
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                              type="button"
                              className="ct_action_icon_btn ct_delete_btn"
                              title="Delete Part"
                              onClick={() => handleOpenDelete(part)}
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
          {filteredParts.length > 0 && (
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

      {/* Add / Edit Part Modal */}
      {showPartModal && (
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
                    {editingPart ? 'Edit Part' : 'Add New Part'}
                  </h4>
                  <p className="text-muted ct_fs_13 mb-0">
                    {editingPart
                      ? 'Update part details, pricing, and stock quantity.'
                      : 'Fill in the information below to register a new part in inventory.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClosePartModal}
                ></button>
              </div>

              <Formik
                initialValues={initialFormValues}
                validationSchema={editingPart ? editPartSchema : addPartSchema}
                enableReinitialize
                onSubmit={handleSubmitPart}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => {
                  return (
                    <Form>
                      <div className="modal-body px-4 py-3">
                        <div className="row g-3">
                          {/* Part Name */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="part_name">
                                Part Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="part_name"
                                name="part_name"
                                className="form-control ct_input"
                                placeholder="e.g. Battery / Brake Pad / Inverter"
                                value={values.part_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="part_name" />
                            </div>
                          </div>

                          {/* Manufacturer */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="manufacturer">
                                Manufacturer <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="manufacturer"
                                name="manufacturer"
                                className="form-control ct_input"
                                placeholder="e.g. Exide / Brembo / Dometic"
                                value={values.manufacturer}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="manufacturer" />
                            </div>
                          </div>

                          {/* Original Cost */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="original_cost">
                                Original Cost ($) <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="original_cost"
                                name="original_cost"
                                step="0.01"
                                min="0"
                                className="form-control ct_input"
                                placeholder="0.00"
                                value={values.original_cost}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="original_cost" />
                            </div>
                          </div>

                          {/* Service Cost */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="service_cost">
                                Service Cost ($) <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="service_cost"
                                name="service_cost"
                                step="0.01"
                                min="0"
                                className="form-control ct_input"
                                placeholder="0.00"
                                value={values.service_cost}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="service_cost" />
                            </div>
                          </div>

                          {/* Stock Quantity */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="stock_quantity">
                                Stock Quantity <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="stock_quantity"
                                name="stock_quantity"
                                min="0"
                                step="1"
                                className="form-control ct_input"
                                placeholder="e.g. 10"
                                value={values.stock_quantity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="stock_quantity" />
                            </div>
                          </div>

                          {/* Low Stock Threshold */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="low_stock_threshold">
                                Low Stock Alert Threshold <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="low_stock_threshold"
                                name="low_stock_threshold"
                                min="0"
                                step="1"
                                className="form-control ct_input"
                                placeholder="e.g. 3"
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
                          onClick={handleClosePartModal}
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
                          ) : editingPart ? (
                            'Update Part'
                          ) : (
                            'Save Part'
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
                  <strong className="text-dark">
                    {selectedPart?.part_name || 'this part'}
                  </strong>
                  {selectedPart?.manufacturer ? ` (${selectedPart.manufacturer})` : ''}?
                  This action cannot be undone.
                </p>

                <div className="d-flex gap-3 justify-content-center">
                  <button
                    type="button"
                    className="previous action-button-previous px-4 py-2 border-0 flex-grow-1"
                    onClick={handleCloseDelete}
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

export default Parts;
