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
import {
  addPartSchema,
  editPartSchema,
  completePartRequestSchema,
} from '../../utils/Schema';
import {
  getParts,
  createPart,
  updatePart,
  deletePart,
  getDealerPartRequests,
  completeDealerPartRequest,
} from '../../redux/slices/partSlice';

const Parts = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    partsList = [],
    isPartsLoading = false,
    partRequestsList = [],
    partRequestsMeta = {},
    isPartRequestsLoading = false,
    isActionLoading = false,
  } = useSelector((state) => state.partReducer || {});

  // Tab State: 'parts' (Inventory) vs 'requested_parts' (Part Requests)
  const [activeTab, setActiveTab] = useState('parts');

  // ==================== Tab 1: Parts Inventory States ====================
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Modal states for Parts
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  // ==================== Tab 2: Requested Parts States ====================
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const debouncedRequestSearch = useDebounce(requestSearchTerm, 400);
  const [requestListPerPages, setRequestListPerPages] = useState(10);
  const [requestCurrentPage, setRequestCurrentPage] = useState(0);

  // Complete Request Modal state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // ==================== Effects ====================
  // Fetch parts inventory
  useEffect(() => {
    dispatch(
      getParts({
        search: debouncedSearch,
      })
    );
  }, [dispatch, debouncedSearch]);

  // Fetch requested parts (status=0 for pending part requests)
  useEffect(() => {
    dispatch(
      getDealerPartRequests({
        status: 0,
        search: debouncedRequestSearch,
      })
    );
  }, [dispatch, debouncedRequestSearch]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, listPerPages, activeTab]);

  useEffect(() => {
    setRequestCurrentPage(0);
  }, [debouncedRequestSearch, requestListPerPages, activeTab]);

  // ==================== Helpers & Formatting ====================
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

  const getRequestStatusBadge = (status) => {
    const numStatus = Number(status);
    switch (numStatus) {
      case 0:
        return (
          <span
            className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"
            style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
          >
            Requested
          </span>
        );
      case 1:
        return (
          <span
            className="badge bg-success-subtle text-success border border-success-subtle"
            style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
          >
            Part Added
          </span>
        );
      case 2:
        return (
          <span
            className="badge bg-danger-subtle text-danger border border-danger-subtle"
            style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
          >
            Rejected
          </span>
        );
      default:
        return (
          <span
            className="badge bg-secondary-subtle text-secondary border border-secondary-subtle"
            style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}
          >
            {status}
          </span>
        );
    }
  };

  // ==================== Tab 1 Filtering & Pagination ====================
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

  const totalItems = filteredParts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / listPerPages));
  const displayedParts = useMemo(() => {
    const start = currentPage * listPerPages;
    return filteredParts.slice(start, start + listPerPages);
  }, [filteredParts, currentPage, listPerPages]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // ==================== Tab 2 Filtering & Pagination ====================
  const filteredRequests = useMemo(() => {
    if (!Array.isArray(partRequestsList)) return [];
    if (!debouncedRequestSearch.trim()) return partRequestsList;
    const query = debouncedRequestSearch.toLowerCase().trim();
    return partRequestsList.filter((req) => {
      const partName = (req.part_name || '').toLowerCase();
      const mTitle = (req.maintenance_title || req.task_title || '').toLowerCase();
      const supName = (req.supplier_name || req.supplier_company_name || '').toLowerCase();
      const techName = (req.technician_name || '').toLowerCase();
      const type = (req.requested_by_type || '').toLowerCase();
      return (
        partName.includes(query) ||
        mTitle.includes(query) ||
        supName.includes(query) ||
        techName.includes(query) ||
        type.includes(query)
      );
    });
  }, [partRequestsList, debouncedRequestSearch]);

  const totalRequestItems = filteredRequests.length;
  const totalRequestPages = Math.max(1, Math.ceil(totalRequestItems / requestListPerPages));
  const displayedRequests = useMemo(() => {
    const start = requestCurrentPage * requestListPerPages;
    return filteredRequests.slice(start, start + requestListPerPages);
  }, [filteredRequests, requestCurrentPage, requestListPerPages]);

  const handleRequestPageClick = ({ selected }) => {
    setRequestCurrentPage(selected);
  };

  // ==================== Part Modal Handlers ====================
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
            if (
              (res?.success === true ||
                res?.status === true ||
                res?.statusCode === 200 ||
                res?.statusCode === 201) &&
              res?.success !== false &&
              res?.status !== false
            ) {
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
            if (
              (res?.success === true ||
                res?.status === true ||
                res?.statusCode === 200 ||
                res?.statusCode === 201) &&
              res?.success !== false &&
              res?.status !== false
            ) {
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
          if (
            (res?.success === true ||
              res?.status === true ||
              res?.statusCode === 200 ||
              res?.statusCode === 201) &&
            res?.success !== false &&
            res?.status !== false
          ) {
            handleCloseDelete();
            dispatch(getParts({ search: debouncedSearch }));
          }
        },
      })
    );
  };

  // ==================== Complete Part Request Handlers ====================
  const handleOpenCompleteRequest = (req) => {
    setSelectedRequest(req);
    setShowCompleteModal(true);
  };

  const handleCloseCompleteRequestModal = () => {
    setShowCompleteModal(false);
    setSelectedRequest(null);
  };

  const handleSubmitCompleteRequest = (values, { setSubmitting, resetForm }) => {
    if (!selectedRequest?.id) return;
    const payload = {
      quantity: Number(values.quantity),
      manufacturer: values.manufacturer?.trim(),
      original_cost: Number(values.original_cost),
      service_cost: Number(values.service_cost),
      low_stock_threshold: Number(values.low_stock_threshold),
    };

    dispatch(
      completeDealerPartRequest({
        id: selectedRequest.id,
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
            handleCloseCompleteRequestModal();
            resetForm();
            dispatch(
              getDealerPartRequests({
                status: 0,
                search: debouncedRequestSearch,
              })
            );
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

  const initialCompleteRequestValues = {
    quantity:
      selectedRequest?.remaining_quantity ||
      selectedRequest?.requested_quantity ||
      selectedRequest?.quantity ||
      1,
    manufacturer: selectedRequest?.part_manufacturer || '',
    original_cost: '',
    service_cost: '',
    low_stock_threshold: 2,
  };

  return (
    <Layout>
      <SubHeader
        title="Parts Management"
        subtitle="Track stock, view pricing, and manage spare parts inventory and requests."
      >
        {activeTab === 'parts' ? (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575 d-flex align-items-center justify-content-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add New Part</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              dispatch(
                getDealerPartRequests({
                  status: 0,
                  search: debouncedRequestSearch,
                })
              );
            }}
            className="btn btn-outline-success ct_btn_h_42 fs-6 ct_w_100_575 d-flex align-items-center justify-content-center gap-2 bg-white"
            disabled={isPartRequestsLoading}
          >
            <i className={`fa-solid fa-arrows-rotate ${isPartRequestsLoading ? 'fa-spin' : ''}`}></i>
            <span>Refresh Requests</span>
          </button>
        )}
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">

          {/* Simple Clean Tabs */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <button
              type="button"
              className={`btn px-4 py-2 ct_fs_14 ct_fw_600 border ${
                activeTab === 'parts'
                  ? 'ct_green_btn text-white border-0'
                  : 'bg-white text-muted'
              }`}
              onClick={() => setActiveTab('parts')}
              style={{ borderRadius: '8px', minHeight: '40px' }}
            >
              Parts ({partsList.length})
            </button>

            <button
              type="button"
              className={`btn px-4 py-2 ct_fs_14 ct_fw_600 border ${
                activeTab === 'requested_parts'
                  ? 'ct_green_btn text-white border-0'
                  : 'bg-white text-muted'
              }`}
              onClick={() => setActiveTab('requested_parts')}
              style={{ borderRadius: '8px', minHeight: '40px' }}
            >
              Requested Parts ({partRequestsMeta?.totalItems ?? partRequestsList.length})
            </button>
          </div>

          {/* ==================== TAB 1: PARTS INVENTORY ==================== */}
          {activeTab === 'parts' && (
            <>
              {/* Summary Cards */}
              <div className="row">
                <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
                  <div className="ct_dash_card">
                    <div className="ct_icon_box">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3D8B37"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                        <path d="M12 22V12" />
                        <path d="m3.3 7 8.7 5 8.7-5" />
                        <path d="m7.5 4.5 9 5" />
                      </svg>
                    </div>
                    <div className="ct_card_content">
                      <p>Total Parts</p>
                      <h3>{isPartsLoading ? "..." : stats.total}</h3>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
                  <div className="ct_dash_card">
                    <div className="ct_icon_box">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3D8B37"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 16l2 2 4-4" />
                        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                        <path d="m7.5 4.27 9 5.15" />
                        <polyline points="3.29 7 12 12 20.71 7" />
                        <line x1="12" x2="12" y1="22" y2="12" />
                      </svg>
                    </div>
                    <div className="ct_card_content">
                      <p>In Stock</p>
                      <h3>{isPartsLoading ? "..." : stats.inStock}</h3>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
                  <div className="ct_dash_card">
                    <div className="ct_icon_box">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3D8B37"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div className="ct_card_content">
                      <p>Low Stock Alert</p>
                      <h3>{isPartsLoading ? "..." : stats.lowStock}</h3>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
                  <div className="ct_dash_card">
                    <div className="ct_icon_box">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3D8B37"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                        <path d="m7.5 4.27 9 5.15" />
                        <polyline points="3.29 7 12 12 20.71 7" />
                        <line x1="12" x2="12" y1="22" y2="12" />
                        <path d="m17 13 5 5" />
                        <path d="m22 13-5 5" />
                      </svg>
                    </div>
                    <div className="ct_card_content">
                      <p>Out of Stock</p>
                      <h3>{isPartsLoading ? "..." : stats.outOfStock}</h3>
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

              {/* Parts Inventory Table */}
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
                          {searchTerm
                            ? 'No parts match your search criteria.'
                            : 'No parts found in inventory. Click "Add New Part" to add one.'}
                        </td>
                      </tr>
                    ) : (
                      displayedParts.map((part, index) => {
                        return (
                          <tr key={part.id || index}>
                            <td>{currentPage * listPerPages + index + 1}</td>
                            <td className="ct_fw_600">{part.part_name || 'N/A'}</td>
                            <td>{part.manufacturer || 'N/A'}</td>
                            <td className="ct_fw_600">{part.stock_quantity ?? 0}</td>
                            <td className="ct_para_clr">{formatCurrency(part.original_cost)}</td>
                            <td className="ct_fw_600">{formatCurrency(part.service_cost)}</td>
                            <td className="text-muted">{part.low_stock_threshold ?? 0}</td>
                            <td>{getStockStatusBadge(part)}</td>
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

              {/* Pagination UI for Parts */}
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
            </>
          )}

          {/* ==================== TAB 2: REQUESTED PARTS ==================== */}
          {activeTab === 'requested_parts' && (
            <>
              {/* Search Bar for Requested Parts */}
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
                  placeholder="Search by Part Name, Task, or Requester..."
                  value={requestSearchTerm}
                  onChange={(e) => setRequestSearchTerm(e.target.value)}
                />

                {requestSearchTerm && (
                  <button
                    type="button"
                    className="btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                    onClick={() => {
                      setRequestSearchTerm('');
                      setRequestCurrentPage(0);
                    }}
                    aria-label="Clear search"
                    style={{ background: 'none', cursor: 'pointer', zIndex: 5 }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {/* Requested Parts Table */}
              <div className="table-responsive ct_custom_table">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Part Name</th>
                      <th>Task / Maintenance</th>
                      <th>Requested By</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Requested Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {isPartRequestsLoading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                            <span className="text-muted ct_fs_14">Loading part requests...</span>
                          </div>
                        </td>
                      </tr>
                    ) : displayedRequests.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted ct_fs_14">
                          {requestSearchTerm
                            ? 'No part requests match your search criteria.'
                            : 'No part requests found.'}
                        </td>
                      </tr>
                    ) : (
                      displayedRequests.map((req, index) => {
                        const rowNum = requestCurrentPage * requestListPerPages + index + 1;
                        const reqQty = req.requested_quantity || req.quantity || 1;
                        const taskTitle = req.maintenance_title || req.task_title || (req.maintenance_id || req.task_id ? `Task #${req.maintenance_id || req.task_id}` : 'N/A');
                        const reqBy =
                          req.requested_by_type === 'TECHNICIAN'
                            ? req.technician_name || 'Technician'
                            : req.supplier_name || req.supplier_company_name || 'Supplier';
                        const isPending = Number(req.status) === 0;

                        return (
                          <tr key={req.id || index}>
                            <td>{rowNum}</td>
                            <td className="ct_fw_600">{req.part_name || 'N/A'}</td>
                            <td className="ct_fw_600">{taskTitle}</td>
                            <td>
                              <span>{reqBy}</span>
                              {req.requested_by_type && (
                                <span className="text-muted ct_fs_12 ms-1">({req.requested_by_type})</span>
                              )}
                            </td>
                            <td className="ct_fw_600">{reqQty}</td>
                            <td>{getRequestStatusBadge(req.status)}</td>
                            <td>{formatDate(req.created_at)}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {isPending ? (
                                  <button
                                    type="button"
                                    className="ct_action_icon_btn"
                                    style={{
                                      backgroundColor: '#ECFDF5',
                                      color: '#059669',
                                      borderColor: '#A7F3D0',
                                    }}
                                    title="Add Part to Inventory"
                                    onClick={() => handleOpenCompleteRequest(req)}
                                  >
                                    <i className="fa-solid fa-plus"></i>
                                  </button>
                                ) : Number(req.status) === 1 ? (
                                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1" style={{ fontSize: '11px', fontWeight: '600', borderRadius: '20px' }}>
                                    <i className="fa-solid fa-check me-1"></i> Completed
                                  </span>
                                ) : (
                                  <span className="text-muted ct_fs_13">-</span>
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

              {/* Pagination UI for Requested Parts */}
              {totalRequestItems > 10 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                  <div>
                    <PaginationDropdown
                      listPerPages={requestListPerPages}
                      options={[5, 10, 25, 50, 100]}
                      onChange={(val) => {
                        setRequestListPerPages(val);
                        setRequestCurrentPage(0);
                      }}
                    />
                  </div>
                  <div>
                    <ReactPagination
                      pageCount={totalRequestPages}
                      onPageChange={handleRequestPageClick}
                      currentPage={requestCurrentPage}
                    />
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ==================== MODAL 1: Add / Edit Inventory Part ==================== */}
      {showPartModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: "800px" }}>
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
                                placeholder="Enter part name"
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
                                placeholder="Enter manufacturer name"
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
                                placeholder="Enter original cost"
                                value={values.original_cost}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
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
                                placeholder="Enter service cost"
                                value={values.service_cost}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
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
                                placeholder="Enter stock quantity"
                                value={values.stock_quantity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
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
                                placeholder="Enter low stock alert threshold"
                                value={values.low_stock_threshold}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="low_stock_threshold" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer border-0 pt-0 pb-4 px-4 d-flex gap-2 justify-content-end">
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

      {/* ==================== MODAL 2: Complete Requested Part ==================== */}
      {showCompleteModal && selectedRequest && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: "800px" }}>
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="ct_fs_20 ct_fw_700 ct_head_clr mb-1">
                    Add Requested Part
                  </h4>
                  <p className="text-muted ct_fs_13 mb-0">
                    Fill in the details below to add the requested part into inventory and fulfill the request.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseCompleteRequestModal}
                ></button>
              </div>

              <Formik
                initialValues={initialCompleteRequestValues}
                validationSchema={completePartRequestSchema}
                enableReinitialize
                onSubmit={handleSubmitCompleteRequest}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => {
                  return (
                    <Form>
                      <div className="modal-body px-4 py-3">
                        <div className="row g-3">
                          {/* Part Name (Read Only) */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="req_part_name">
                                Part Name
                              </label>
                              <input
                                type="text"
                                id="req_part_name"
                                className="form-control ct_input bg-light"
                                value={selectedRequest?.part_name || ''}
                                disabled
                                readOnly
                              />
                            </div>
                          </div>

                          {/* Manufacturer */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="req_manufacturer">
                                Manufacturer <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="req_manufacturer"
                                name="manufacturer"
                                className="form-control ct_input"
                                placeholder="Enter manufacturer name"
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
                              <label className="mb-2 ct_label" htmlFor="req_original_cost">
                                Original Cost ($) <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="req_original_cost"
                                name="original_cost"
                                step="0.01"
                                min="0"
                                className="form-control ct_input"
                                placeholder="Enter original cost"
                                value={values.original_cost}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="original_cost" />
                            </div>
                          </div>

                          {/* Service Cost */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="req_service_cost">
                                Service Cost ($) <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="req_service_cost"
                                name="service_cost"
                                step="0.01"
                                min="0"
                                className="form-control ct_input"
                                placeholder="Enter service cost"
                                value={values.service_cost}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="service_cost" />
                            </div>
                          </div>

                          {/* Stock Quantity */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="req_quantity">
                                Stock Quantity <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="req_quantity"
                                name="quantity"
                                min="1"
                                step="1"
                                className="form-control ct_input"
                                placeholder="Enter stock quantity"
                                value={values.quantity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="quantity" />
                            </div>
                          </div>

                          {/* Low Stock Threshold */}
                          <div className="col-md-6">
                            <div className="form-group text-start">
                              <label className="mb-2 ct_label" htmlFor="req_low_stock_threshold">
                                Low Stock Alert Threshold <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                id="req_low_stock_threshold"
                                name="low_stock_threshold"
                                min="0"
                                step="1"
                                className="form-control ct_input"
                                placeholder="Enter low stock alert threshold"
                                value={values.low_stock_threshold}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
                              />
                              <ErrorMessage errors={errors} touched={touched} fieldName="low_stock_threshold" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer border-0 pt-0 pb-4 px-4 d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn ct_btn_gray px-4 py-2 ct_btn_h_45"
                          onClick={handleCloseCompleteRequestModal}
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

      {/* ==================== MODAL 3: Delete Confirmation Modal ==================== */}
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
                    className="btn btn-danger px-4 py-2 ct_fw_600 flex-grow-1"
                    onClick={handleConfirmDelete}
                    disabled={isActionLoading}
                    style={{ minHeight: '44px', borderRadius: "10px" }}
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
