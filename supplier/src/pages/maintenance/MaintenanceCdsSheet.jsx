import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import SignaturePad from '../../components/SignaturePad';
import {
  getSupplierMaintenanceDetail,
  updateSupplierMaintenanceTimer,
  updateSupplierCdsSheet,
  getSupplierPartsList,
  createSupplierPartRequest,
} from '../../redux/slices/maintenanceSlice';
import { pageRoutes } from '../../routes/PageRoutes';

const MaintenanceCdsSheet = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const taskId = searchParams.get('id') || searchParams.get('maintenance_id');

  const {
    taskDetails,
    isDetailsLoading = false,
    detailsError = null,
    partsCatalog = [],
    isPartsLoading = false,
  } = useSelector((state) => state.maintenanceReducer || {});

  const task = taskDetails?.data || taskDetails || {};
  const van = task.van || task.van_details || {};
  const dealer = task.dealer || task.dealer_details || {};
  const partRequests = Array.isArray(task.part_requests)
    ? task.part_requests
    : Array.isArray(taskDetails?.part_requests)
    ? taskDetails.part_requests
    : Array.isArray(taskDetails?.data?.part_requests)
    ? taskDetails.data.part_requests
    : [];

  // Local Form States - all blank by default as requested
  const [workCarriedOut, setWorkCarriedOut] = useState('');
  const [workToBeCarriedOut, setWorkToBeCarriedOut] = useState('');
  const [signature, setSignature] = useState('');

  // Parts state
  const [isManualPart, setIsManualPart] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [selectedPartName, setSelectedPartName] = useState('');
  const [manualPartName, setManualPartName] = useState('');
  const [partQuantity, setPartQuantity] = useState('');
  const [partUnitCost, setPartUnitCost] = useState('');
  const [partsList, setPartsList] = useState([]);
  const [editingPartIndex, setEditingPartIndex] = useState(null);

  // Consumables state
  const [consumableName, setConsumableName] = useState('');
  const [consumableDesc, setConsumableDesc] = useState('');
  const [consumablePrice, setConsumablePrice] = useState('');
  const [consumableQty, setConsumableQty] = useState('');
  const [consumablesList, setConsumablesList] = useState([]);

  // Extra Parts Modal state
  const [showExtraPartModal, setShowExtraPartModal] = useState(false);
  const [extraPartName, setExtraPartName] = useState('');
  const [extraPartQty, setExtraPartQty] = useState('');
  const [isRequestingPart, setIsRequestingPart] = useState(false);

  // Loading states
  const [isTimerLoading, setIsTimerLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper date formatter (DD-MM-YYYY)
  const formatToDisplayDate = (d) => {
    if (!d) return '';
    try {
      const dateObj = new Date(d);
      if (isNaN(dateObj.getTime())) return d;
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return d;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return dateString;
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch {
      return dateString || '';
    }
  };

  // Fetch Task Details & Parts Catalog on Mount
  useEffect(() => {
    if (taskId) {
      dispatch(getSupplierMaintenanceDetail({ id: taskId }));
    }
    dispatch(getSupplierPartsList());
  }, [dispatch, taskId]);

  // Server-provided timer status
  const serverTimerStatus =
    task?.timer?.timer_status ||
    task?.timer?.status ||
    task?.timer_status ||
    taskDetails?.timer?.timer_status ||
    taskDetails?.timer_status ||
    '';

  const [localTimerStatus, setLocalTimerStatus] = useState('');

  // Synchronize local timer status when task data arrives
  useEffect(() => {
    if (serverTimerStatus) {
      setLocalTimerStatus(String(serverTimerStatus).toLowerCase().trim());
    }
  }, [serverTimerStatus]);

  const effectiveTimerStatus = (
    localTimerStatus ||
    String(serverTimerStatus || 'pending')
  ).toLowerCase().trim();

  // Timer Action (START, PAUSE, RESUME)
  const handleTimerAction = async (type) => {
    if (!taskId || isTimerLoading) return;
    setIsTimerLoading(true);

    // Optimistically update status
    if (type === 'START' || type === 'RESUME') {
      setLocalTimerStatus('started');
    } else if (type === 'PAUSE') {
      setLocalTimerStatus('paused');
    }

    try {
      const res = await dispatch(
        updateSupplierMaintenanceTimer({
          maintenance_id: taskId,
          type,
        })
      ).unwrap();

      const newStatus =
        res?.data?.timer?.timer_status ||
        res?.data?.timer_status ||
        res?.timer?.timer_status ||
        (type === 'START' || type === 'RESUME' ? 'started' : type === 'PAUSE' ? 'paused' : '');

      if (newStatus) {
        setLocalTimerStatus(String(newStatus).toLowerCase().trim());
      }

      // Single refresh from server
      await dispatch(getSupplierMaintenanceDetail({ id: taskId })).unwrap();
    } catch (err) {
      console.error('Timer action failed:', err);
      dispatch(getSupplierMaintenanceDetail({ id: taskId }));
    } finally {
      setIsTimerLoading(false);
    }
  };

  // Get unit cost of a part (checking unit_cost, service_cost, or partsCatalog)
  const getPartUnitCost = (part) => {
    if (!part) return 0;
    if (part.unit_cost !== undefined && part.unit_cost !== null && part.unit_cost !== '') {
      return Number(part.unit_cost) || 0;
    }
    if (part.service_cost !== undefined && part.service_cost !== null && part.service_cost !== '') {
      return Number(part.service_cost) || 0;
    }
    if (part.part_id) {
      const catalogItem = partsCatalog.find((p) => String(p.id) === String(part.part_id));
      if (catalogItem) {
        const raw =
          catalogItem.service_cost ??
          catalogItem.original_cost ??
          catalogItem.cost ??
          catalogItem.price ??
          0;
        return Number(raw) || 0;
      }
    }
    return 0;
  };

  // Get total cost of a part
  const getPartTotalCost = (part) => {
    if (!part) return 0;
    if (part.total_cost !== undefined && part.total_cost !== null && part.total_cost !== '') {
      return Number(part.total_cost) || 0;
    }
    const unit = getPartUnitCost(part);
    const qty = Number(part.quantity) || 1;
    return unit * qty;
  };

  // Total costs across parts, consumables and grand total
  const totalPartsCost = partsList.reduce((sum, p) => sum + getPartTotalCost(p), 0);
  const totalConsumablesCost = consumablesList.reduce(
    (sum, c) =>
      sum + (Number(c.total_price) || (Number(c.unit_price) || 0) * (Number(c.quantity) || 1)),
    0
  );
  const grandTotalCost = totalPartsCost + totalConsumablesCost;

  // Currently selected catalog part object and stock
  const selectedCatalogPartObj = selectedPartId
    ? partsCatalog.find((p) => String(p.id) === String(selectedPartId))
    : null;
  const selectedCatalogPartStock =
    selectedCatalogPartObj?.stock_quantity !== undefined &&
    selectedCatalogPartObj?.stock_quantity !== null
      ? Number(selectedCatalogPartObj.stock_quantity)
      : undefined;

  // Handle Part Selection from Dropdown
  const handlePartSelectChange = (e) => {
    const partId = e.target.value;
    setSelectedPartId(partId);
    if (!partId) {
      setSelectedPartName('');
      return;
    }
    const found = partsCatalog.find((p) => String(p.id) === String(partId));
    if (found) {
      setSelectedPartName(found.part_name || '');
    }
  };

  // Add or Update Part Handler with Duplicate Validation
  const handleAddPart = (e) => {
    e?.preventDefault();

    if (isManualPart) {
      const trimmedName = manualPartName.trim();
      if (!trimmedName) {
        toast.error('Please enter the manual part name');
        return;
      }

      // Check Duplicate
      const isDuplicate = partsList.some((p, idx) => {
        if (editingPartIndex !== null && idx === editingPartIndex) return false;
        return (p.part_name || '').toLowerCase().trim() === trimmedName.toLowerCase();
      });

      if (isDuplicate) {
        toast.error(`"${trimmedName}" is already added. You can edit its quantity in the list.`);
        return;
      }

      const qty = Number(partQuantity) || 1;
      if (qty < 1) {
        toast.error('Part quantity must be at least 1');
        return;
      }
      const unitCost = Number(partUnitCost);
      if (isNaN(unitCost) || unitCost < 0) {
        toast.error('Please enter a valid unit cost');
        return;
      }

      const totalCost = Number(qty * unitCost);

      const newPart = {
        part_id: null,
        part_name: trimmedName,
        quantity: qty,
        unit_cost: unitCost,
        service_cost: unitCost,
        total_cost: totalCost,
      };

      if (editingPartIndex !== null) {
        setPartsList((prev) =>
          prev.map((item, idx) => (idx === editingPartIndex ? newPart : item))
        );
        setEditingPartIndex(null);
        toast.success('Manual part updated successfully');
      } else {
        setPartsList((prev) => [...prev, newPart]);
        toast.success('Manual part added to list');
      }

      setManualPartName('');
      setPartUnitCost('');
      setPartQuantity('');
    } else {
      if (!selectedPartId) {
        toast.error('Please select a part from the dropdown');
        return;
      }

      // Check Duplicate
      const isDuplicate = partsList.some((p, idx) => {
        if (editingPartIndex !== null && idx === editingPartIndex) return false;
        return p.part_id === Number(selectedPartId);
      });

      if (isDuplicate) {
        toast.error(`This catalog part is already added. You can edit its quantity in the list.`);
        return;
      }

      const qty = Number(partQuantity) || 1;
      if (qty < 1) {
        toast.error('Part quantity must be at least 1');
        return;
      }

      const selectedCatalogPart = partsCatalog.find((p) => String(p.id) === String(selectedPartId));
      if (!selectedCatalogPart) {
        toast.error('Selected part not found in catalog');
        return;
      }

      const availableStock =
        selectedCatalogPart.stock_quantity !== undefined && selectedCatalogPart.stock_quantity !== null
          ? Number(selectedCatalogPart.stock_quantity)
          : undefined;

      if (availableStock !== undefined) {
        if (availableStock <= 0) {
          toast.error(`"${selectedCatalogPart.part_name || 'This part'}" is out of stock (0 available)`);
          return;
        }
        if (qty > availableStock) {
          toast.error(`Quantity cannot exceed available stock (${availableStock} available)`);
          return;
        }
      }

      const rawCost =
        selectedCatalogPart?.service_cost ??
        selectedCatalogPart?.original_cost ??
        selectedCatalogPart?.cost ??
        selectedCatalogPart?.price ??
        0;
      const unitCost = Number(rawCost) || 0;
      const totalCost = Number(qty * unitCost);

      const newPart = {
        part_id: Number(selectedPartId),
        part_name: selectedPartName.trim() || selectedCatalogPart?.part_name || '',
        quantity: qty,
        unit_cost: unitCost,
        service_cost: unitCost,
        total_cost: totalCost,
      };

      if (editingPartIndex !== null) {
        setPartsList((prev) =>
          prev.map((item, idx) => (idx === editingPartIndex ? newPart : item))
        );
        setEditingPartIndex(null);
        toast.success('Part updated successfully');
      } else {
        setPartsList((prev) => [...prev, newPart]);
        toast.success('Part added to list');
      }

      setSelectedPartId('');
      setSelectedPartName('');
      setPartQuantity('');
    }
  };

  // Edit Part Handler
  const handleEditPart = (indexToEdit) => {
    const part = partsList[indexToEdit];
    if (!part) return;

    setEditingPartIndex(indexToEdit);

    if (part.part_id) {
      setIsManualPart(false);
      setSelectedPartId(String(part.part_id));
      setSelectedPartName(part.part_name || '');
      setPartQuantity(part.quantity || 1);
      setManualPartName('');
      setPartUnitCost('');
    } else {
      setIsManualPart(true);
      setManualPartName(part.part_name || '');
      setPartQuantity(part.quantity || 1);
      setPartUnitCost(
        part.unit_cost !== undefined && part.unit_cost !== null ? String(part.unit_cost) : ''
      );
      setSelectedPartId('');
      setSelectedPartName('');
    }
  };

  // Cancel Editing Part
  const handleCancelEditPart = () => {
    setEditingPartIndex(null);
    setSelectedPartId('');
    setSelectedPartName('');
    setManualPartName('');
    setPartQuantity('');
    setPartUnitCost('');
  };

  const handleRemovePart = (indexToRemove) => {
    if (editingPartIndex === indexToRemove) {
      handleCancelEditPart();
    }
    setPartsList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Add Consumable Handler with Validation
  const handleAddConsumable = (e) => {
    e?.preventDefault();
    if (!consumableName.trim()) {
      toast.error('Please enter consumable name / description');
      return;
    }
    const qty = Number(consumableQty) || 1;
    if (qty < 1) {
      toast.error('Consumable quantity must be at least 1');
      return;
    }

    const unitPrice = Number(consumablePrice) || 0;
    if (unitPrice < 0) {
      toast.error('Price per unit cannot be negative');
      return;
    }

    const totalPrice = Number(qty * unitPrice);

    const newConsumable = {
      consumable_name: consumableName.trim(),
      description: consumableDesc.trim() || consumableName.trim(),
      quantity: qty,
      unit_price: unitPrice,
      total_price: totalPrice,
    };

    setConsumablesList((prev) => [...prev, newConsumable]);
    setConsumableName('');
    setConsumableDesc('');
    setConsumablePrice('');
    setConsumableQty('');
    toast.success('Consumable added to list');
  };

  const handleRemoveConsumable = (indexToRemove) => {
    setConsumablesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Request Extra Part Handler with API Call & Validation
  const handleRequestExtraPart = (e) => {
    e?.preventDefault();

    if (!extraPartName.trim()) {
      toast.error('Please enter the part name to request');
      return;
    }

    const qty = Number(extraPartQty) || 1;
    if (qty < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    if (!taskId) {
      toast.error('Maintenance task ID not found');
      return;
    }

    setIsRequestingPart(true);
    dispatch(
      createSupplierPartRequest({
        maintenance_id: taskId,
        part_name: extraPartName.trim(),
        quantity: qty,
        callback: (res) => {
          setIsRequestingPart(false);
          if (res?.success || res?.status || res?.statusCode === 200 || res?.statusCode === 201) {
            setShowExtraPartModal(false);
            setExtraPartName('');
            setExtraPartQty('');
            // Refetch task details
            dispatch(getSupplierMaintenanceDetail({ id: taskId }));
          }
        },
      })
    ).finally(() => {
      setIsRequestingPart(false);
    });
  };

  // Submit CDS Job Sheet
  const handleSubmitCdsSheet = (e) => {
    e?.preventDefault();

    if (!workCarriedOut.trim()) {
      toast.error('Please fill in the "Work Carried Out" field');
      return;
    }
    if (!workToBeCarriedOut.trim()) {
      toast.error('Work To Be Carried Out is required');
      return;
    }
    if (!signature) {
      toast.error('Please provide a CDS digital signature before submitting');
      return;
    }

    const payload = {
      work_carried_out: workCarriedOut.trim(),
      work_to_be_carried_out: workToBeCarriedOut.trim(),
      cds_signature: signature,
      parts_used: partsList.map((p) => {
        const unit = getPartUnitCost(p);
        const total = getPartTotalCost(p);
        if (p.part_id) {
          return {
            part_id: Number(p.part_id),
            part_name: p.part_name || undefined,
            quantity: Number(p.quantity) || 1,
            unit_cost: unit,
            service_cost: unit,
            total_cost: total,
          };
        }
        return {
          part_id: null,
          part_name: p.part_name || undefined,
          quantity: Number(p.quantity) || 1,
          unit_cost: unit,
          service_cost: unit,
          total_cost: total,
        };
      }),
      consumables: consumablesList.map((c) => ({
        consumable_name: c.consumable_name,
        description: c.description || c.consumable_name,
        quantity: Number(c.quantity) || 1,
        unit_price: Number(c.unit_price) || 0,
        total_price: Number(c.total_price) || 0,
      })),
    };

    setIsSubmitting(true);
    dispatch(
      updateSupplierCdsSheet({
        id: taskId,
        data: payload,
        callback: (res) => {
          setIsSubmitting(false);
          if (res?.success || res?.status || res?.statusCode === 200) {
            navigate(`${pageRoutes.maintenance_detail}?id=${taskId}`);
          }
        },
      })
    ).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <Layout>
      <SubHeader
        title="CDS - Job / Services Sheet"
        subtitle="Fill out and submit the complete job sheet, used parts, consumables, and customer digital signature."
        backUrl={`${pageRoutes.maintenance_detail}?id=${taskId}`}
        showBack={true}
        className="ct_flex_col_767"
      />

      <div className="ct_px_30 mt-4 pb-5">
        {isDetailsLoading && !task?.id && !task?.maintenance_id ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="spinner-border text-success mb-3 mx-auto" role="status"></div>
            <p className="text-muted ct_fs_15 mb-0">Loading maintenance details...</p>
          </div>
        ) : !taskId || (!task?.maintenance_id && !task?.id && !isDetailsLoading) ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex justify-content-center mb-3">
              <i className="fa-solid fa-triangle-exclamation text-warning fs-1"></i>
            </div>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Task Not Found</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              {detailsError || 'The requested maintenance task could not be found.'}
            </p>
            <div className="d-flex justify-content-center">
              <Link to={pageRoutes.maintenance} className="ct_green_btn px-4 py-2">
                Back to Maintenance List
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitCdsSheet}>
            {/* Main Form Container Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
              {/* Top Task & Van Reference Information Grid */}
              <div
                className="p-4 rounded-4 mb-4 border"
                style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
              >
                <div className="row g-3">
                  <div className="col-md-4 col-sm-6">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      Van Name
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {van.van_name || van.model || 'N/A'}
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      Date
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {formatToDisplayDate(task.schedule_date || task.created_at) || 'N/A'}
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      Person Attending
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {task.assignee?.name || task.assignee?.full_name || 'N/A'}
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      Mobile
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {van.owner_phone || dealer.phone || 'N/A'}
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      Job No.
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {task.maintenance_id || task.id || 'N/A'}
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      Customer Name
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {van.owner_name || dealer.name || 'N/A'}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      Maintenance Item Description
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {task.title || task.description || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Work Carried Out + Job Timer Control */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                  <label className="ct_head_clr ct_fs_15 ct_fw_600 mb-0">
                    Work Carried Out <span className="text-danger">*</span>
                  </label>

                  {/* Timer Button */}
                  <div>
                    {isTimerLoading ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary px-3 py-1"
                        disabled
                        style={{ borderRadius: '8px' }}
                      >
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Updating...
                      </button>
                    ) : ['started', 'start', 'in_progress', 'inprogress', 'running', 'active'].includes(effectiveTimerStatus) ? (
                      <button
                        type="button"
                        onClick={() => handleTimerAction('PAUSE')}
                        className="btn btn-sm btn-warning text-dark fw-semibold px-3 py-1 shadow-sm d-inline-flex align-items-center gap-1"
                        style={{ borderRadius: '8px' }}
                        title="Pause Job Timer"
                      >
                        <i className="fa-solid fa-pause"></i>
                        <span>Pause Job</span>
                      </button>
                    ) : ['paused', 'pause', 'hold'].includes(effectiveTimerStatus) ? (
                      <button
                        type="button"
                        onClick={() => handleTimerAction('RESUME')}
                        className="btn btn-sm btn-primary fw-semibold px-3 py-1 shadow-sm d-inline-flex align-items-center gap-1"
                        style={{ borderRadius: '8px' }}
                        title="Resume Job Timer"
                      >
                        <i className="fa-solid fa-play"></i>
                        <span>Resume Job</span>
                      </button>
                    ) : ['completed', 'complete', 'finished', 'done'].includes(effectiveTimerStatus) ? (
                      <span
                        className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2"
                        style={{ borderRadius: '8px', fontSize: '13px' }}
                      >
                        <i className="fa-solid fa-check me-1"></i> Job Completed
                      </span>
                    ) : (
                      /* Default: Pending / Not started */
                      <button
                        type="button"
                        onClick={() => handleTimerAction('START')}
                        className="btn btn-sm btn-success fw-semibold px-3 py-1 shadow-sm d-inline-flex align-items-center gap-1"
                        style={{ borderRadius: '8px' }}
                        title="Start Job Timer"
                      >
                        <i className="fa-solid fa-play"></i>
                        <span>Start Job</span>
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Enter detailed description of the work carried out..."
                  value={workCarriedOut}
                  onChange={(e) => setWorkCarriedOut(e.target.value)}
                  style={{
                    borderRadius: '10px',
                    borderColor: '#CBD5E1',
                    fontSize: '14px',
                  }}
                  required
                />
              </div>

              {/* 2. Parts Section */}
              <div className="mb-4 pt-3 border-top">
                {/* Manual Part Switch + Extra Parts Button */}
                <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="enterPartManuallySwitch"
                      checked={isManualPart}
                      onChange={(e) => {
                        setIsManualPart(e.target.checked);
                        setSelectedPartId('');
                        setSelectedPartName('');
                        setManualPartName('');
                        setPartUnitCost('');
                        setPartQuantity('');
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <label
                      className="form-check-label ct_fs_14 ct_fw_600 ms-2"
                      htmlFor="enterPartManuallySwitch"
                      style={{ cursor: 'pointer' }}
                    >
                      Enter part manually
                    </label>
                  </div>

                  {/* Request for Extra Parts Button */}
                  <button
                    type="button"
                    onClick={() => setShowExtraPartModal(true)}
                    className="btn btn-outline-secondary btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', fontSize: '13px' }}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    <span>Request for Extra Parts</span>
                  </button>
                </div>

                {/* Parts Inputs Row */}
                <div className="row g-3 align-items-end mb-3">
                  {isManualPart ? (
                    <>
                      <div className="col-12 col-md-4">
                        <label className="ct_fs_13 ct_fw_600 mb-1 text-muted">Part Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter part name (e.g. Manual Gasket Seal)"
                          value={manualPartName}
                          onChange={(e) => setManualPartName(e.target.value)}
                          style={{ borderRadius: '8px', height: '42px', fontSize: '14px' }}
                        />
                      </div>

                      <div className="col-6 col-md-2">
                        <label className="ct_fs_13 ct_fw_600 mb-1 text-muted">Quantity *</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="1"
                          className="form-control"
                          value={partQuantity}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) => setPartQuantity(e.target.value)}
                          style={{ borderRadius: '8px', height: '42px', fontSize: '14px' }}
                        />
                      </div>

                      <div className="col-6 col-md-2">
                        <label className="ct_fs_13 ct_fw_600 mb-1 text-muted">Unit Cost ($) *</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="form-control"
                          value={partUnitCost}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) => setPartUnitCost(e.target.value)}
                          style={{ borderRadius: '8px', height: '42px', fontSize: '14px' }}
                        />
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddPart}
                            className="btn btn-dark flex-grow-1 text-nowrap fw-semibold d-flex align-items-center justify-content-center gap-1"
                            style={{
                              borderRadius: '8px',
                              height: '42px',
                              backgroundColor: '#0F172A',
                              fontSize: '14px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {editingPartIndex !== null ? (
                              <>
                                <i className="fa-solid fa-check"></i>
                                <span>Update Part</span>
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-plus"></i>
                                <span>Add Part</span>
                              </>
                            )}
                          </button>
                          {editingPartIndex !== null && (
                            <button
                              type="button"
                              onClick={handleCancelEditPart}
                              className="btn btn-outline-secondary px-3 text-nowrap fw-semibold"
                              style={{
                                borderRadius: '8px',
                                height: '42px',
                                fontSize: '13px',
                                whiteSpace: 'nowrap',
                              }}
                              title="Cancel editing"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-12 col-md-5">
                        <label className="ct_fs_13 ct_fw_600 mb-1 text-muted">
                          Select Part *
                        </label>
                        <select
                          className="form-select"
                          value={selectedPartId}
                          onChange={handlePartSelectChange}
                          style={{ borderRadius: '8px', height: '42px', fontSize: '14px' }}
                          disabled={isPartsLoading}
                        >
                          <option value="">
                            {isPartsLoading
                              ? 'Loading parts catalog...'
                              : 'Select Part from Catalog...'}
                          </option>
                          {partsCatalog
                            .filter((p) => {
                              // Remove already added parts from dropdown list unless currently editing
                              const isAlreadyInList = partsList.some(
                                (item, idx) =>
                                  (editingPartIndex === null || idx !== editingPartIndex) &&
                                  Number(item.part_id) === Number(p.id)
                              );
                              return !isAlreadyInList;
                            })
                            .map((p) => {
                              const rawCost =
                                p.service_cost ?? p.original_cost ?? p.cost ?? p.price;
                              const costText =
                                rawCost !== undefined &&
                                rawCost !== null &&
                                rawCost !== ''
                                  ? ` — $${Number(rawCost).toFixed(2)}`
                                  : '';
                              const pStock =
                                p.stock_quantity !== undefined &&
                                p.stock_quantity !== null
                                  ? Number(p.stock_quantity)
                                  : null;
                              const isOutOfStock = pStock !== null && pStock <= 0;
                              return (
                                <option key={p.id} value={p.id} disabled={isOutOfStock}>
                                  {p.part_name} {p.manufacturer ? `(${p.manufacturer})` : ''}
                                  {costText}
                                  {pStock !== null
                                    ? isOutOfStock
                                      ? ' [Out of Stock]'
                                      : ` [Stock: ${pStock}]`
                                    : ''}
                                </option>
                              );
                            })}
                        </select>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <label className="ct_fs_13 ct_fw_600 text-muted mb-0">Quantity *</label>
                          {selectedCatalogPartStock !== undefined && (
                            <span
                              className={`ct_fs_12 ct_fw_600 ${
                                selectedCatalogPartStock <= 0 ? 'text-danger' : 'text-success'
                              }`}
                            >
                              Stock: {selectedCatalogPartStock}
                            </span>
                          )}
                        </div>
                        <input
                          type="number"
                          min="1"
                          max={
                            selectedCatalogPartStock !== undefined && selectedCatalogPartStock > 0
                              ? selectedCatalogPartStock
                              : undefined
                          }
                          placeholder="1"
                          className="form-control"
                          value={partQuantity}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) => setPartQuantity(e.target.value)}
                          style={{ borderRadius: '8px', height: '42px', fontSize: '14px' }}
                        />
                      </div>

                      <div className="col-6 col-md-4">
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddPart}
                            className="btn btn-dark flex-grow-1 text-nowrap fw-semibold d-flex align-items-center justify-content-center gap-1"
                            style={{
                              borderRadius: '8px',
                              height: '42px',
                              backgroundColor: '#0F172A',
                              fontSize: '14px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {editingPartIndex !== null ? (
                              <>
                                <i className="fa-solid fa-check"></i>
                                <span>Update Part</span>
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-plus"></i>
                                <span>Add Part</span>
                              </>
                            )}
                          </button>
                          {editingPartIndex !== null && (
                            <button
                              type="button"
                              onClick={handleCancelEditPart}
                              className="btn btn-outline-secondary px-3 text-nowrap fw-semibold"
                              style={{
                                borderRadius: '8px',
                                height: '42px',
                                fontSize: '13px',
                                whiteSpace: 'nowrap',
                              }}
                              title="Cancel editing"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Parts Table */}
                {partsList.length > 0 && (
                  <div className="table-responsive mb-3 border rounded-3">
                    <table className="table table-hover align-middle mb-0 ct_fs_14">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Part Name</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Unit Cost</th>
                          <th>Total Cost</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partsList.map((part, idx) => {
                          const unit = getPartUnitCost(part);
                          const total = getPartTotalCost(part);
                          return (
                            <tr
                              key={idx}
                              style={{
                                backgroundColor: editingPartIndex === idx ? '#F1F5F9' : undefined,
                              }}
                            >
                              <td>{idx + 1}</td>
                              <td className="ct_fw_600">
                                {part.part_name || `Part #${part.part_id || idx + 1}`}
                              </td>
                              <td>
                                {part.part_id ? (
                                  <span
                                    className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1"
                                    style={{ fontSize: '12px', fontWeight: '500' }}
                                  >
                                    <i className="fa-solid fa-boxes-stacked me-1"></i> Catalog
                                  </span>
                                ) : (
                                  <span
                                    className="badge bg-warning-subtle text-dark border border-warning-subtle px-2 py-1"
                                    style={{ fontSize: '12px', fontWeight: '500' }}
                                  >
                                    <i className="fa-solid fa-pen-ruler me-1"></i> Manual
                                  </span>
                                )}
                              </td>
                              <td>{part.quantity || 1}</td>
                              <td>${unit.toFixed(2)}</td>
                              <td className="ct_fw_600 text-dark">${total.toFixed(2)}</td>
                              <td className="text-end">
                                <div className="d-inline-flex align-items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleEditPart(idx)}
                                    className="btn btn-sm btn-outline-primary p-1 px-2 border-0"
                                    title="Edit part"
                                  >
                                    <i className="fa-regular fa-pen-to-square"></i>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePart(idx)}
                                    className="btn btn-sm btn-outline-danger p-1 px-2 border-0"
                                    title="Remove part"
                                  >
                                    <i className="fa-regular fa-trash-can"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Requested Extra Parts Table */}
                {partRequests.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="ct_head_clr ct_fs_15 ct_fw_600 mb-0">
                          <i className="fa-solid fa-cart-flatbed text-primary me-2"></i>
                          Requested Extra Parts
                        </h6>
                        <span className="badge rounded-pill bg-secondary-subtle text-secondary px-2">
                          {partRequests.length}
                        </span>
                      </div>
                      <span className="text-muted ct_fs_12">
                        Status of additional part requests submitted to Dealer
                      </span>
                    </div>

                    <div className="table-responsive border rounded-3">
                      <table className="table table-hover align-middle mb-0 ct_fs_14">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Part Name / Description</th>
                            <th>Requested Qty</th>
                            <th>Requested Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partRequests.map((req, idx) => {
                            const isApproved =
                              Number(req.status) === 1 ||
                              String(req.status).toLowerCase() === 'approved' ||
                              String(req.status).toLowerCase() === 'added';
                            const isRejected =
                              Number(req.status) === 2 ||
                              String(req.status).toLowerCase() === 'rejected';

                            return (
                              <tr key={req.id || idx}>
                                <td>{idx + 1}</td>
                                <td className="ct_fw_600">{req.part_name || 'N/A'}</td>
                                <td>{req.requested_quantity || req.quantity || 1}</td>
                                <td>
                                  {formatDateTime(req.created_at) ||
                                    formatToDisplayDate(req.created_at) ||
                                    'N/A'}
                                </td>
                                <td>
                                  {isApproved ? (
                                    <span
                                      className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 d-inline-flex align-items-center gap-1"
                                      style={{ fontSize: '12px', fontWeight: '500' }}
                                    >
                                      <i className="fa-solid fa-circle-check"></i>
                                      <span>Part Added</span>
                                    </span>
                                  ) : isRejected ? (
                                    <span
                                      className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 d-inline-flex align-items-center gap-1"
                                      style={{ fontSize: '12px', fontWeight: '500' }}
                                    >
                                      <i className="fa-solid fa-circle-xmark"></i>
                                      <span>Rejected</span>
                                    </span>
                                  ) : (
                                    <span
                                      className="badge bg-warning-subtle text-dark border border-warning-subtle px-2 py-1 d-inline-flex align-items-center gap-1"
                                      style={{ fontSize: '12px', fontWeight: '500' }}
                                    >
                                      <i className="fa-solid fa-clock text-warning"></i>
                                      <span>Requested</span>
                                    </span>
                                  )}
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

              {/* 3. Consumables Section */}
              <div className="mb-4 pt-3 border-top">
                <h5 className="ct_head_clr ct_fs_16 ct_fw_600 mb-3">Consumables</h5>

                {/* Consumable Input Row */}
                <div className="row g-3 align-items-end mb-3">
                  <div className="col-12 col-md-5">
                    <label className="ct_fs_13 ct_fw_600 mb-1 text-muted">
                      Consumable Name / Description *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. R134a Refrigerant 1kg"
                      value={consumableName}
                      onChange={(e) => setConsumableName(e.target.value)}
                      style={{ borderRadius: '8px', height: '42px', fontSize: '14px' }}
                    />
                  </div>

                  <div className="col-6 col-md-2">
                    <label className="ct_fs_13 ct_fw_600 mb-1 text-muted">Price per unit ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="form-control"
                      value={consumablePrice}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e) => setConsumablePrice(e.target.value)}
                      style={{ borderRadius: '8px', height: '42px', fontSize: '14px' }}
                    />
                  </div>

                  <div className="col-6 col-md-2">
                    <label className="ct_fs_13 ct_fw_600 mb-1 text-muted">Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      className="form-control"
                      value={consumableQty}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e) => setConsumableQty(e.target.value)}
                      style={{ borderRadius: '8px', height: '42px', fontSize: '14px' }}
                    />
                  </div>

                  <div className="col-12 col-md-3">
                    <button
                      type="button"
                      onClick={handleAddConsumable}
                      className="btn btn-dark w-100 fw-semibold text-nowrap d-flex align-items-center justify-content-center gap-1"
                      style={{
                        borderRadius: '8px',
                        height: '42px',
                        backgroundColor: '#0F172A',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Add Consumable</span>
                    </button>
                  </div>
                </div>

                {/* Consumables Table */}
                <div className="table-responsive border rounded-3 mb-3">
                  <table className="table table-hover align-middle mb-0 ct_fs_14">
                    <thead className="table-light">
                      <tr>
                        <th>Consumable Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumablesList.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-4 ct_fs_13">
                            No consumables added
                          </td>
                        </tr>
                      ) : (
                        consumablesList.map((item, idx) => (
                          <tr key={idx}>
                            <td className="ct_fw_600">{item.consumable_name}</td>
                            <td>{item.quantity || 1}</td>
                            <td>
                              {item.unit_price !== undefined && item.unit_price !== null && item.unit_price !== ''
                                ? `$${Number(item.unit_price).toFixed(2)}`
                                : '$0.00'}
                            </td>
                            <td className="ct_fw_600">
                              {item.total_price !== undefined && item.total_price !== null && item.total_price !== ''
                                ? `$${Number(item.total_price).toFixed(2)}`
                                : '$0.00'}
                            </td>
                            <td className="text-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveConsumable(idx)}
                                className="btn btn-sm btn-outline-danger p-1 px-2 border-0"
                                title="Remove consumable"
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Bottom Form Fields */}
              <div className="mb-4 pt-3 border-top">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="ct_fs_13 ct_fw_600 mb-1 ct_head_clr">
                      Work To Be Carried Out <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={workToBeCarriedOut}
                      onChange={(e) => setWorkToBeCarriedOut(e.target.value)}
                      placeholder="Maintenance Title / Work description"
                      style={{ borderRadius: '8px', fontSize: '14px' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 5. CDS Signature Pad */}
              <div className="mb-4 pt-3 border-top">
                <label className="ct_head_clr ct_fs_15 ct_fw_600 mb-2">
                  CDS Signature <span className="text-danger">*</span>
                </label>
                <SignaturePad value={signature} onChange={setSignature} />
              </div>

              {/* 6. Form Footer Actions */}
              <div className="d-flex align-items-center justify-content-end gap-3 pt-3 border-top flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate(`${pageRoutes.maintenance_detail}?id=${taskId}`)}
                  className="btn btn-outline-secondary px-4 py-2 fw-semibold"
                  style={{ borderRadius: '8px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-dark px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                  style={{
                    borderRadius: '8px',
                    backgroundColor: '#0F172A',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i>
                      <span>Update CDS Job sheet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Request for Extra Parts Modal */}
      {showExtraPartModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title ct_head_clr ct_fw_600">Request Extra Parts</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    if (!isRequestingPart) {
                      setShowExtraPartModal(false);
                    }
                  }}
                  disabled={isRequestingPart}
                ></button>
              </div>
              <form onSubmit={handleRequestExtraPart}>
                <div className="modal-body py-3">
                  <p className="text-muted ct_fs_13 mb-3">
                    Submit an official request to the dealer for additional replacement parts or tools.
                  </p>

                  <div className="mb-3">
                    <label className="ct_fs_13 ct_fw_600 mb-1">
                      Part Name / Description <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Breakshoe, High Pressure AC Hose"
                      value={extraPartName}
                      onChange={(e) => setExtraPartName(e.target.value)}
                      required
                      disabled={isRequestingPart}
                      style={{ borderRadius: '8px', height: '40px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="ct_fs_13 ct_fw_600 mb-1">
                      Quantity <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      className="form-control"
                      value={extraPartQty}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e) => setExtraPartQty(e.target.value)}
                      required
                      disabled={isRequestingPart}
                      style={{ borderRadius: '8px', height: '40px' }}
                    />
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm px-3"
                    onClick={() => setShowExtraPartModal(false)}
                    disabled={isRequestingPart}
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success btn-sm px-4 fw-semibold d-inline-flex align-items-center gap-1"
                    disabled={isRequestingPart}
                    style={{ borderRadius: '8px' }}
                  >
                    {isRequestingPart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i>
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MaintenanceCdsSheet;
