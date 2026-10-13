import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import { pageRoutes } from '../../routes/PageRoutes';
import {
  getMaintenanceById,
  getMaintenanceInvoice,
} from '../../redux/slices/maintenanceSlice';

const MaintenanceInvoice = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const taskId =
    searchParams.get('id') ||
    searchParams.get('maintenance_id') ||
    searchParams.get('task_id');

  const {
    invoiceDetails,
    isInvoiceLoading = false,
    invoiceError = null,
    maintenanceDetails,
  } = useSelector((state) => state.maintenanceReducer || {});

  const invoice = invoiceDetails?.data || invoiceDetails || {};
  const breakdown = invoice.invoice_breakdown || {};
  const items = Array.isArray(invoice.items) ? invoice.items : [];

  const task = maintenanceDetails?.data || maintenanceDetails || {};
  const van = task.van_details || task.van || {};
  const assignee = task.assignee || {};

  // Fetch invoice details and task details
  useEffect(() => {
    if (taskId) {
      dispatch(getMaintenanceInvoice({ id: taskId }));
      if (!task?.id || String(task.id) !== String(taskId)) {
        dispatch(getMaintenanceById({ id: taskId }));
      }
    }
  }, [dispatch, taskId]);

  // Format Currency
  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === '') return '$0.00';
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format Date
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

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase().trim();
    if (s === 'paid') {
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 text-capitalize ct_fs_12">
          Paid
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 text-capitalize ct_fs_12">
          Pending Payment
        </span>
      );
    }
    if (s === 'overdue') {
      return (
        <span className="badge ct_badge_overdue px-3 py-1 text-capitalize ct_fs_12">
          Overdue
        </span>
      );
    }
    return (
      <span className="badge ct_badge_invoiced px-3 py-1 text-capitalize ct_fs_12">
        {status || 'Invoiced'}
      </span>
    );
  };

  const getItemTypeBadge = (itemType) => {
    const t = String(itemType || '').toLowerCase();
    switch (t) {
      case 'service':
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 text-capitalize ct_fs_11">
            Service
          </span>
        );
      case 'part':
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 text-capitalize ct_fs_11">
            Part
          </span>
        );
      case 'consumable':
        return (
          <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1 text-capitalize ct_fs_11">
            Consumable
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 text-capitalize ct_fs_11">
            {itemType || 'Item'}
          </span>
        );
    }
  };

  return (
    <Layout>
      <SubHeader
        title="Invoice Detail"
        backUrl={`${pageRoutes.maintenance_detail}?id=${taskId}`}
        className="ct_flex_col_767"
      >
        {invoice?.invoice_id && (
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-sm btn-outline-secondary px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
            style={{ borderRadius: '8px', fontSize: '13px' }}
          >
            <i className="fa-solid fa-print"></i>
            <span>Print Invoice</span>
          </button>
        )}
      </SubHeader>

      <div className="invoice-printable-container ct_px_30 mt-4 pb-5">
        {isInvoiceLoading && !invoice?.invoice_id ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="spinner-border text-success mb-3 mx-auto" role="status"></div>
            <p className="text-muted ct_fs_15 mb-0">Loading invoice details...</p>
          </div>
        ) : !taskId || (!invoice?.invoice_id && !isInvoiceLoading) ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex justify-content-center mb-3">
              <i className="fa-solid fa-triangle-exclamation text-warning fs-1"></i>
            </div>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Invoice Not Found</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              {invoiceError || 'No invoice has been generated for this maintenance task yet.'}
            </p>
            <Link
              to={`${pageRoutes.maintenance_detail}?id=${taskId}`}
              className="ct_green_btn px-4 py-2"
            >
              Back to Maintenance Task
            </Link>
          </div>
        ) : (
          <div className="row g-4 invoice-print-row">
            {/* Left Column: Invoice Header, Parties, and Line Items */}
            <div className="col-xl-8 col-lg-7 invoice-print-left">
              <div className="invoice-print-top-grid">
                {/* 1. Invoice Overview Card */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white invoice-print-top-col">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-muted ct_fs_12 d-block">Invoice Number</span>
                    <h5 className="ct_head_clr ct_fw_700 mb-0">
                      {invoice.invoice_number || `INV-${invoice.invoice_id}`}
                    </h5>
                  </div>
                  <div>{getStatusBadge(invoice.status)}</div>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <span className="text-muted ct_fs_12 d-block">Issue Date</span>
                    <span className="ct_fw_600 text-dark ct_fs_14">
                      {formatDate(invoice.created_at)}
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="text-muted ct_fs_12 d-block">Due Date</span>
                    <span className="ct_fw_600 text-dark ct_fs_14">
                      {formatDate(invoice.due_date)}
                    </span>
                  </div>
                </div>
                </div>

                {/* 2. Customer & Vehicle Overview Card */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white invoice-print-top-col">
                <div className="border-bottom pb-3 mb-3">
                  <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-file-contract text-success"></i>
                    <span>Bill To & Vehicle Overview</span>
                  </h6>
                </div>

                <div className="row g-3">
                  <div className="col-md-6 border-end-md">
                    <span className="text-muted ct_fs_12 d-block mb-1">
                      <i className="fa-regular fa-user me-1 text-success"></i>
                      Customer / Owner Information
                    </span>
                    <h6 className="ct_fw_700 ct_fs_15 text-dark mb-1">
                      {van.owner_name || assignee.name || 'Vehicle Owner'}
                    </h6>
                    {(van.owner_email || assignee.email) && (
                      <p className="text-muted ct_fs_13 mb-1">
                        <i className="fa-regular fa-envelope me-1"></i>
                        {van.owner_email || assignee.email}
                      </p>
                    )}
                    {(van.owner_phone || assignee.phone) && (
                      <p className="text-muted ct_fs_13 mb-0">
                        <i className="fa-solid fa-phone me-1"></i>
                        {van.owner_phone || assignee.phone}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <span className="text-muted ct_fs_12 d-block mb-1">
                      <i className="fa-solid fa-van-shuttle me-1 text-success"></i>
                      Vehicle Details
                    </span>
                    <h6 className="ct_fw_700 ct_fs_15 text-dark mb-1">
                      {van.van_name || van.name || 'Vehicle'}
                      {van.registration_number ? ` (${van.registration_number})` : ''}
                    </h6>
                    <p className="text-muted ct_fs_13 mb-1">
                      Make / Model: {van.make || 'N/A'} {van.model ? `• ${van.model}` : ''} {van.year ? `(${van.year})` : ''}
                    </p>
                    <p className="text-muted ct_fs_13 mb-0">
                      Task Type: {task.maintenance_type || 'General Maintenance'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Invoice Items Table Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white invoice-print-table-card">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                  <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-list-check text-success"></i>
                    <span>Invoice Line Items ({items.length})</span>
                  </h6>
                  <span className="ct_fw_700 text-dark ct_fs_14">
                    Items Subtotal: {formatCurrency(breakdown.subtotal ? breakdown.subtotal - (breakdown.cleaning_fee || 0) : 0)}
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="p-4 text-center text-muted ct_fs_14">
                    No line items listed on this invoice.
                  </div>
                ) : (
                  <div className="table-responsive ct_custom_table">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: '45px' }} className="text-center">#</th>
                          <th>Item Name & Description</th>
                          <th style={{ width: '100px' }}>Type</th>
                          <th className="text-center" style={{ width: '60px' }}>Qty</th>
                          <th className="text-end" style={{ width: '110px' }}>Original Price</th>
                          <th className="text-end" style={{ width: '110px' }}>Unit Price ($)</th>
                          <th className="text-end" style={{ width: '110px' }}>Line Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={item.id || idx}>
                            <td className="text-center">{idx + 1}</td>
                            <td>
                              <span className="ct_fw_600 text-dark d-block">
                                {item.item_name}
                              </span>
                              {item.manufacturer && (
                                <small className="text-muted ct_fs_12 d-block">
                                  Brand: {item.manufacturer}
                                </small>
                              )}
                              {item.description && item.description !== item.item_name && (
                                <small className="text-muted ct_fs_12 d-block">
                                  {item.description}
                                </small>
                              )}
                            </td>
                            <td>{getItemTypeBadge(item.item_type)}</td>
                            <td className="text-center">{item.quantity || 1}</td>
                            <td className="text-end text-muted ct_fs_13">
                              {formatCurrency(item.original_unit_price)}
                            </td>
                            <td className="text-end ct_fw_600 text-dark">
                              {formatCurrency(item.invoice_unit_price)}
                            </td>
                            <td className="text-end ct_fw_700 text-dark">
                              {formatCurrency(item.line_total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Invoice Breakdown Summary */}
            <div className="col-xl-4 col-lg-5 invoice-print-right">
              <div
                className="card border-0 shadow-sm rounded-4 p-4 bg-white position-sticky invoice-summary-card"
                style={{ top: '90px', zIndex: 10 }}
              >
                <div className="border-bottom pb-3 mb-3">
                  <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-file-invoice-dollar text-success"></i>
                    <span>Invoice Summary</span>
                  </h6>
                </div>

                <div className="d-flex flex-column gap-2 ct_fs_14">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Services Total:</span>
                    <span className="ct_fw_600 text-dark">
                      {formatCurrency(breakdown.services_total)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Parts Total:</span>
                    <span className="ct_fw_600 text-dark">
                      {formatCurrency(breakdown.parts_total)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Consumables Total:</span>
                    <span className="ct_fw_600 text-dark">
                      {formatCurrency(breakdown.consumables_total)}
                    </span>
                  </div>

                  {breakdown.other_items_total > 0 && (
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Other Items:</span>
                      <span className="ct_fw_600 text-dark">
                        {formatCurrency(breakdown.other_items_total)}
                      </span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Cleaning / Service Fee:</span>
                    <span className="ct_fw_600 text-dark">
                      {formatCurrency(breakdown.cleaning_fee ?? invoice.cleaning_fee)}
                    </span>
                  </div>

                  <hr className="my-2" />

                  <div className="d-flex justify-content-between">
                    <span className="text-muted ct_fw_600">Subtotal:</span>
                    <span className="ct_fw_700 text-dark">
                      {formatCurrency(breakdown.subtotal)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-muted">
                      GST ({breakdown.gst_rate ?? invoice.gst_rate ?? 10}%):
                    </span>
                    <span className="ct_fw_600 text-dark">
                      {formatCurrency(breakdown.gst_amount ?? invoice.gst_amount)}
                    </span>
                  </div>

                  <hr className="my-2" />

                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="ct_fs_16 ct_fw_700 text-dark">Total Amount:</span>
                    <span className="ct_fs_22 ct_fw_700 ct_green_text">
                      {formatCurrency(breakdown.total_amount)}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MaintenanceInvoice;
