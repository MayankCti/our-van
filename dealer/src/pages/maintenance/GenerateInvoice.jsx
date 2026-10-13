import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import { pageRoutes } from '../../routes/PageRoutes';
import {
  getMaintenanceById,
  generateMaintenanceInvoice,
} from '../../redux/slices/maintenanceSlice';

const GenerateInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('id') || searchParams.get('maintenance_id');

  const {
    maintenanceDetails,
    isDetailsLoading = false,
    detailsError = null,
    isActionLoading = false,
  } = useSelector((state) => state.maintenanceReducer || {});

  const task = maintenanceDetails?.data || maintenanceDetails || {};
  const van = task.van_details || task.van || {};
  const assignee = task.assignee || {};
  const finalEstimate = task.final_quotation_estimate || {};

  // Form State
  const [dueDays, setDueDays] = useState(15);
  const [cleaningFee, setCleaningFee] = useState(0);
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [otherItems, setOtherItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Currency Formatter
  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === '') return '$0.00';
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Date Formatter
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

  // Fetch maintenance details if missing or different ID
  useEffect(() => {
    if (taskId) {
      dispatch(getMaintenanceById({ id: taskId }));
    }
  }, [dispatch, taskId]);

  // Initialize line items from final_quotation_estimate or fallback to task items
  useEffect(() => {
    if (!task?.id) return;

    // Services
    const rawServices = Array.isArray(finalEstimate.services) && finalEstimate.services.length > 0
      ? finalEstimate.services
      : Array.isArray(task.services)
      ? task.services
      : [];

    const initialServices = rawServices.map((s, idx) => {
      const originalPrice = Number(
        s.original_unit_price ??
        s.cost ??
        (s.line_total ? Number(s.line_total) / (Number(s.quantity) || 1) : 0)
      );
      return {
        source_item_id: s.source_item_id ?? s.service_id ?? s.id ?? idx + 1,
        item_name: s.item_name || s.name || s.service_name || `Service #${idx + 1}`,
        quantity: Number(s.quantity) || 1,
        original_unit_price: originalPrice,
        invoice_unit_price: originalPrice,
      };
    });

    // Parts
    const rawParts = Array.isArray(finalEstimate.parts) && finalEstimate.parts.length > 0
      ? finalEstimate.parts
      : Array.isArray(task.parts_used)
      ? task.parts_used
      : [];

    const initialParts = rawParts.map((p, idx) => {
      const originalPrice = Number(
        p.original_unit_price ??
        p.unit_price ??
        p.cost ??
        (p.line_total ? Number(p.line_total) / (Number(p.quantity) || 1) : 0)
      );
      return {
        source_item_id: p.source_item_id ?? p.part_id ?? p.id ?? idx + 1,
        item_name: p.item_name || p.part_name || p.name || `Part #${idx + 1}`,
        manufacturer: p.manufacturer || '',
        quantity: Number(p.quantity) || 1,
        original_unit_price: originalPrice,
        invoice_unit_price: originalPrice,
      };
    });

    // Consumables
    const rawConsumables = Array.isArray(finalEstimate.consumables) && finalEstimate.consumables.length > 0
      ? finalEstimate.consumables
      : Array.isArray(task.consumables)
      ? task.consumables
      : [];

    const initialConsumables = rawConsumables.map((c, idx) => {
      const originalPrice = Number(
        c.original_unit_price ??
        c.unit_price ??
        c.total_price ? Number(c.total_price) / (Number(c.quantity) || 1) :
        (c.line_total ? Number(c.line_total) / (Number(c.quantity) || 1) : 0)
      );
      return {
        source_item_id: c.source_item_id ?? c.consumable_id ?? c.id ?? idx + 1,
        item_name: c.item_name || c.name || c.description || `Consumable #${idx + 1}`,
        description: c.description || '',
        quantity: Number(c.quantity) || 1,
        original_unit_price: originalPrice,
        invoice_unit_price: originalPrice,
      };
    });

    // Other Items
    const rawOther = Array.isArray(finalEstimate.other_items) ? finalEstimate.other_items : [];
    const initialOther = rawOther.map((o, idx) => {
      const originalPrice = Number(o.original_unit_price ?? o.cost ?? o.line_total ?? 0);
      return {
        source_item_id: o.source_item_id ?? o.id ?? idx + 1,
        item_name: o.item_name || o.name || `Other Item #${idx + 1}`,
        quantity: Number(o.quantity) || 1,
        original_unit_price: originalPrice,
        invoice_unit_price: originalPrice,
      };
    });

    setServices(initialServices);
    setParts(initialParts);
    setConsumables(initialConsumables);
    setOtherItems(initialOther);
    setIsInitialized(true);
  }, [task?.id, finalEstimate]);

  // Handlers for Unit Price Change
  const handleServicePriceChange = (index, value) => {
    setServices((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], invoice_unit_price: value };
      return updated;
    });
  };

  const handlePartPriceChange = (index, value) => {
    setParts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], invoice_unit_price: value };
      return updated;
    });
  };

  const handleConsumablePriceChange = (index, value) => {
    setConsumables((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], invoice_unit_price: value };
      return updated;
    });
  };

  const handleOtherPriceChange = (index, value) => {
    setOtherItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], invoice_unit_price: value };
      return updated;
    });
  };

  // Computed Totals
  const servicesSubtotal = useMemo(() => {
    return services.reduce((acc, s) => {
      const qty = Number(s.quantity) || 1;
      const price = parseFloat(s.invoice_unit_price) || 0;
      return acc + qty * price;
    }, 0);
  }, [services]);

  const partsSubtotal = useMemo(() => {
    return parts.reduce((acc, p) => {
      const qty = Number(p.quantity) || 1;
      const price = parseFloat(p.invoice_unit_price) || 0;
      return acc + qty * price;
    }, 0);
  }, [parts]);

  const consumablesSubtotal = useMemo(() => {
    return consumables.reduce((acc, c) => {
      const qty = Number(c.quantity) || 1;
      const price = parseFloat(c.invoice_unit_price) || 0;
      return acc + qty * price;
    }, 0);
  }, [consumables]);

  const otherSubtotal = useMemo(() => {
    return otherItems.reduce((acc, o) => {
      const qty = Number(o.quantity) || 1;
      const price = parseFloat(o.invoice_unit_price) || 0;
      return acc + qty * price;
    }, 0);
  }, [otherItems]);

  const cleaningFeeNumber = useMemo(() => {
    const fee = parseFloat(cleaningFee);
    return isNaN(fee) || fee < 0 ? 0 : fee;
  }, [cleaningFee]);

  const grandInvoiceTotal = useMemo(() => {
    return servicesSubtotal + partsSubtotal + consumablesSubtotal + otherSubtotal + cleaningFeeNumber;
  }, [servicesSubtotal, partsSubtotal, consumablesSubtotal, otherSubtotal, cleaningFeeNumber]);

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskId) {
      toast.error('Task ID is missing.');
      return;
    }

    const parsedDueDays = parseInt(dueDays, 10);
    if (isNaN(parsedDueDays) || parsedDueDays < 1) {
      toast.error('Please enter a valid number of due days (at least 1 day).');
      return;
    }

    // Build items payload
    const items = [
      ...services.map((s) => ({
        item_type: 'service',
        source_item_id: Number(s.source_item_id),
        invoice_unit_price: parseFloat(s.invoice_unit_price) || 0,
      })),
      ...parts.map((p) => ({
        item_type: 'part',
        source_item_id: Number(p.source_item_id),
        invoice_unit_price: parseFloat(p.invoice_unit_price) || 0,
      })),
      ...consumables.map((c) => ({
        item_type: 'consumable',
        source_item_id: Number(c.source_item_id),
        invoice_unit_price: parseFloat(c.invoice_unit_price) || 0,
      })),
      ...otherItems.map((o) => ({
        item_type: 'other',
        source_item_id: Number(o.source_item_id),
        invoice_unit_price: parseFloat(o.invoice_unit_price) || 0,
      })),
    ];

    if (items.length === 0) {
      toast.error('No items available to generate invoice.');
      return;
    }

    const payload = {
      due_days: parsedDueDays,
      cleaning_fee: cleaningFeeNumber,
      items,
    };

    dispatch(
      generateMaintenanceInvoice({
        id: Number(taskId),
        data: payload,
        callback: (res) => {
          if (
            (res?.success === true ||
              res?.status === true ||
              res?.statusCode === 200 ||
              res?.statusCode === 201) &&
            res?.success !== false &&
            res?.status !== false
          ) {
            navigate(`${pageRoutes.maintenance_detail}?id=${taskId}`);
          }
        },
      })
    );
  };

  return (
    <Layout>
      <SubHeader
        title="Generate Invoice"
        subtitle={
          task.title
            ? `Maintenance Task #${task.id || taskId} • ${task.title}`
            : 'Configure due date, cleaning fees, and invoice line item prices.'
        }
        backUrl={`${pageRoutes.maintenance_detail}?id=${taskId}`}
        className="ct_flex_col_767"
      />

      <div className="ct_px_30 mt-4 pb-5">
        {isDetailsLoading && !task?.id ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="spinner-border text-success mb-3 mx-auto" role="status"></div>
            <p className="text-muted ct_fs_15 mb-0">Loading maintenance estimate details...</p>
          </div>
        ) : !taskId || (!task?.id && !isDetailsLoading) ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex justify-content-center mb-3">
              <i className="fa-solid fa-triangle-exclamation text-warning fs-1"></i>
            </div>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Task Not Found</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              {detailsError || 'The requested maintenance task could not be found.'}
            </p>
            <Link to={pageRoutes.maintenance} className="ct_green_btn px-4 py-2">
              Back to Maintenance List
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Left Column: Invoice Config & Line Items */}
              <div className="col-xl-8 col-lg-7">
                {/* 1. General Invoice Settings Card */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="border-bottom pb-3 mb-3">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-file-invoice text-success"></i>
                      <span>Invoice Settings</span>
                    </h6>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group text-start">
                        <label className="mb-2 ct_label ct_fw_600 text-dark" htmlFor="due_days">
                          Payment Due Days <span className="text-danger">*</span>
                        </label>
                        <select
                          id="due_days"
                          name="due_days"
                          className="form-select ct_input"
                          value={dueDays}
                          onChange={(e) => setDueDays(Number(e.target.value))}
                          required
                        >
                          <option value={7}>7 Days</option>
                          <option value={15}>15 Days</option>
                          <option value={30}>30 Days</option>
                        </select>
                        <small className="text-muted d-block mt-1 ct_fs_12">
                          Days allowed for customer to settle invoice after generation.
                        </small>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group text-start">
                        <label className="mb-2 ct_label ct_fw_600 text-dark" htmlFor="cleaning_fee">
                          Cleaning / Service Fee ($)
                        </label>
                        <input
                          type="number"
                          id="cleaning_fee"
                          name="cleaning_fee"
                          min="0"
                          step="any"
                          className="form-control ct_input"
                          placeholder="0.00"
                          value={cleaningFee}
                          onChange={(e) => setCleaningFee(e.target.value)}
                          onWheel={(e) => e.target.blur()}
                        />
                        <small className="text-muted d-block mt-1 ct_fs_12">
                          Optional additional vehicle cleaning or handover fee.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Services Table Card */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-wrench text-success"></i>
                      <span>Services ({services.length})</span>
                    </h6>
                    <span className="ct_fw_700 text-dark ct_fs_14">
                      Subtotal: {formatCurrency(servicesSubtotal)}
                    </span>
                  </div>

                  {services.length === 0 ? (
                    <div className="p-4 text-center text-muted ct_fs_14">
                      No services in this estimate.
                    </div>
                  ) : (
                    <div className="table-responsive ct_custom_table">
                      <table className="table align-middle mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }} className="text-center">#</th>
                            <th>Service Name</th>
                            <th className="text-center" style={{ width: '90px' }}>Quantity</th>
                            <th className="text-end" style={{ width: '130px' }}>Original Price</th>
                            <th className="text-end" style={{ width: '160px' }}>Invoice Unit Price ($)</th>
                            <th className="text-end" style={{ width: '130px' }}>Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((srv, idx) => {
                            const lineTotal = (Number(srv.quantity) || 1) * (parseFloat(srv.invoice_unit_price) || 0);
                            return (
                              <tr key={`srv-${srv.source_item_id || idx}`}>
                                <td className="text-center">{idx + 1}</td>
                                <td>
                                  <span className="ct_fw_600 text-dark d-block">
                                    {srv.item_name}
                                  </span>
                                </td>
                                <td className="text-center">{srv.quantity}</td>
                                <td className="text-end text-muted ct_fs_13">
                                  {formatCurrency(srv.original_unit_price)}
                                </td>
                                <td className="text-end">
                                  <input
                                    type="number"
                                    step="any"
                                    min="0"
                                    className="form-control ct_input py-1 px-2 text-end ms-auto"
                                    style={{ maxWidth: '120px' }}
                                    value={srv.invoice_unit_price}
                                    onChange={(e) => handleServicePriceChange(idx, e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    required
                                  />
                                </td>
                                <td className="text-end ct_fw_700 text-dark">
                                  {formatCurrency(lineTotal)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 3. Parts Table Card */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-gears text-success"></i>
                      <span>Parts Used ({parts.length})</span>
                    </h6>
                    <span className="ct_fw_700 text-dark ct_fs_14">
                      Subtotal: {formatCurrency(partsSubtotal)}
                    </span>
                  </div>

                  {parts.length === 0 ? (
                    <div className="p-4 text-center text-muted ct_fs_14">
                      No parts used in this maintenance task.
                    </div>
                  ) : (
                    <div className="table-responsive ct_custom_table">
                      <table className="table align-middle mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }} className="text-center">#</th>
                            <th>Part Details</th>
                            <th className="text-center" style={{ width: '90px' }}>Quantity</th>
                            <th className="text-end" style={{ width: '130px' }}>Original Price</th>
                            <th className="text-end" style={{ width: '160px' }}>Invoice Unit Price ($)</th>
                            <th className="text-end" style={{ width: '130px' }}>Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parts.map((prt, idx) => {
                            const lineTotal = (Number(prt.quantity) || 1) * (parseFloat(prt.invoice_unit_price) || 0);
                            return (
                              <tr key={`part-${prt.source_item_id || idx}`}>
                                <td className="text-center">{idx + 1}</td>
                                <td>
                                  <span className="ct_fw_600 text-dark d-block">
                                    {prt.item_name}
                                  </span>
                                  {prt.manufacturer && (
                                    <small className="text-muted ct_fs_12 d-block">
                                      Brand: {prt.manufacturer}
                                    </small>
                                  )}
                                </td>
                                <td className="text-center">{prt.quantity}</td>
                                <td className="text-end text-muted ct_fs_13">
                                  {formatCurrency(prt.original_unit_price)}
                                </td>
                                <td className="text-end">
                                  <input
                                    type="number"
                                    step="any"
                                    min="0"
                                    className="form-control ct_input py-1 px-2 text-end ms-auto"
                                    style={{ maxWidth: '120px' }}
                                    value={prt.invoice_unit_price}
                                    onChange={(e) => handlePartPriceChange(idx, e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    required
                                  />
                                </td>
                                <td className="text-end ct_fw_700 text-dark">
                                  {formatCurrency(lineTotal)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 4. Consumables Table Card */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                      <i className="fa-solid fa-box-open text-success"></i>
                      <span>Consumables ({consumables.length})</span>
                    </h6>
                    <span className="ct_fw_700 text-dark ct_fs_14">
                      Subtotal: {formatCurrency(consumablesSubtotal)}
                    </span>
                  </div>

                  {consumables.length === 0 ? (
                    <div className="p-4 text-center text-muted ct_fs_14">
                      No consumables used in this maintenance task.
                    </div>
                  ) : (
                    <div className="table-responsive ct_custom_table">
                      <table className="table align-middle mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }} className="text-center">#</th>
                            <th>Consumable Details</th>
                            <th className="text-center" style={{ width: '90px' }}>Quantity</th>
                            <th className="text-end" style={{ width: '130px' }}>Original Price</th>
                            <th className="text-end" style={{ width: '160px' }}>Invoice Unit Price ($)</th>
                            <th className="text-end" style={{ width: '130px' }}>Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {consumables.map((con, idx) => {
                            const lineTotal = (Number(con.quantity) || 1) * (parseFloat(con.invoice_unit_price) || 0);
                            return (
                              <tr key={`con-${con.source_item_id || idx}`}>
                                <td className="text-center">{idx + 1}</td>
                                <td>
                                  <span className="ct_fw_600 text-dark d-block">
                                    {con.item_name}
                                  </span>
                                  {con.description && con.description !== con.item_name && (
                                    <small className="text-muted ct_fs_12 d-block">
                                      {con.description}
                                    </small>
                                  )}
                                </td>
                                <td className="text-center">{con.quantity}</td>
                                <td className="text-end text-muted ct_fs_13">
                                  {formatCurrency(con.original_unit_price)}
                                </td>
                                <td className="text-end">
                                  <input
                                    type="number"
                                    step="any"
                                    min="0"
                                    className="form-control ct_input py-1 px-2 text-end ms-auto"
                                    style={{ maxWidth: '120px' }}
                                    value={con.invoice_unit_price}
                                    onChange={(e) => handleConsumablePriceChange(idx, e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    required
                                  />
                                </td>
                                <td className="text-end ct_fw_700 text-dark">
                                  {formatCurrency(lineTotal)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 5. Other Items Table Card (if any) */}
                {otherItems.length > 0 && (
                  <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                      <h6 className="ct_head_clr ct_fw_700 mb-0 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-boxes-stacked text-success"></i>
                        <span>Other Items ({otherItems.length})</span>
                      </h6>
                      <span className="ct_fw_700 text-dark ct_fs_14">
                        Subtotal: {formatCurrency(otherSubtotal)}
                      </span>
                    </div>

                    <div className="table-responsive ct_custom_table">
                      <table className="table align-middle mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }} className="text-center">#</th>
                            <th>Item Name</th>
                            <th className="text-center" style={{ width: '90px' }}>Quantity</th>
                            <th className="text-end" style={{ width: '130px' }}>Original Price</th>
                            <th className="text-end" style={{ width: '160px' }}>Invoice Unit Price ($)</th>
                            <th className="text-end" style={{ width: '130px' }}>Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {otherItems.map((oth, idx) => {
                            const lineTotal = (Number(oth.quantity) || 1) * (parseFloat(oth.invoice_unit_price) || 0);
                            return (
                              <tr key={`oth-${oth.source_item_id || idx}`}>
                                <td className="text-center">{idx + 1}</td>
                                <td>
                                  <span className="ct_fw_600 text-dark d-block">
                                    {oth.item_name}
                                  </span>
                                </td>
                                <td className="text-center">{oth.quantity}</td>
                                <td className="text-end text-muted ct_fs_13">
                                  {formatCurrency(oth.original_unit_price)}
                                </td>
                                <td className="text-end">
                                  <input
                                    type="number"
                                    step="any"
                                    min="0"
                                    className="form-control ct_input py-1 px-2 text-end ms-auto"
                                    style={{ maxWidth: '120px' }}
                                    value={oth.invoice_unit_price}
                                    onChange={(e) => handleOtherPriceChange(idx, e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    required
                                  />
                                </td>
                                <td className="text-end ct_fw_700 text-dark">
                                  {formatCurrency(lineTotal)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Vehicle Info & Live Invoice Total Card */}
              <div className="col-xl-4 col-lg-5">
                {/* Vehicle & Customer Summary */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <h6 className="ct_head_clr ct_fw_700 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-van-shuttle text-success"></i>
                    <span>Vehicle & Task Overview</span>
                  </h6>

                  <div className="d-flex flex-column gap-2 ct_fs_13">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Task:</span>
                      <span className="ct_fw_600 text-dark">{task.title || 'N/A'}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Type:</span>
                      <span className="ct_fw_600 text-dark">{task.maintenance_type || 'N/A'}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Vehicle:</span>
                      <span className="ct_fw_600 text-dark">
                        {van.van_name || van.name || 'Vehicle'}
                        {van.registration_number ? ` (${van.registration_number})` : ''}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Owner Name:</span>
                      <span className="ct_fw_600 text-dark">
                        {van.owner_name || assignee.name || 'Vehicle Owner'}
                      </span>
                    </div>
                    {(van.owner_email || assignee.email) && (
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Owner Email:</span>
                        <span className="ct_fw_600 text-dark text-truncate" style={{ maxWidth: '180px' }}>
                          {van.owner_email || assignee.email}
                        </span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Status:</span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final Calculation & Action Card */}
                <div
                  className="card border-0 shadow-sm rounded-4 p-4 bg-white position-sticky"
                  style={{
                    top: '90px',
                    zIndex: 10,
                  }}
                >
                  <h6 className="ct_head_clr ct_fw_700 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-file-invoice-dollar text-success"></i>
                    <span>Invoice Summary</span>
                  </h6>

                  <div className="d-flex flex-column gap-2 ct_fs_14">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Services Total ({services.length}):</span>
                      <span className="ct_fw_600 text-dark">{formatCurrency(servicesSubtotal)}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Parts Total ({parts.length}):</span>
                      <span className="ct_fw_600 text-dark">{formatCurrency(partsSubtotal)}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Consumables Total ({consumables.length}):</span>
                      <span className="ct_fw_600 text-dark">{formatCurrency(consumablesSubtotal)}</span>
                    </div>

                    {otherItems.length > 0 && (
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Other Items ({otherItems.length}):</span>
                        <span className="ct_fw_600 text-dark">{formatCurrency(otherSubtotal)}</span>
                      </div>
                    )}

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Cleaning / Service Fee:</span>
                      <span className="ct_fw_600 text-dark">{formatCurrency(cleaningFeeNumber)}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Payment Due Period:</span>
                      <span className="ct_fw_600 text-dark">{dueDays} Days</span>
                    </div>

                    <hr className="my-2" />

                    <div className="d-flex justify-content-between align-items-center py-1">
                      <span className="ct_fs_16 ct_fw_700 text-dark">Grand Total:</span>
                      <span className="ct_fs_22 ct_fw_700 ct_green_text">
                        {formatCurrency(grandInvoiceTotal)}
                      </span>
                    </div>

                    {finalEstimate.total_amount !== undefined && (
                      <small className="text-muted text-end d-block">
                        Original Estimate: {formatCurrency(finalEstimate.total_amount)}
                      </small>
                    )}
                  </div>

                  <div className="mt-4 d-flex flex-column gap-2">
                    <button
                      type="submit"
                      className="ct_green_btn w-100 ct_btn_h_45 d-flex align-items-center justify-content-center gap-2 border-0"
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          <span>Generating Invoice...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane"></i>
                          <span>Generate & Issue Invoice</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`${pageRoutes.maintenance_detail}?id=${taskId}`}
                      className="btn btn-outline-secondary w-100 ct_btn_h_45 d-flex align-items-center justify-content-center"
                    >
                      Cancel & Go Back
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default GenerateInvoice;
