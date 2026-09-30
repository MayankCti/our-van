import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import ErrorMessage from '../../components/form/ErrorMessage';
import { pageRoutes } from '../../routes/PageRoutes';
import { createMaintenanceSchema } from '../../utils/Schema';
import { createMaintenance } from '../../redux/slices/maintenanceSlice';
import { getVansList, getVanDetails } from '../../redux/slices/vanSlice';
import { getSuppliersByDealer } from '../../redux/slices/supplierSlice';
import { getTechniciansByDealer } from '../../redux/slices/technicianSlice';
import { getServices } from '../../redux/slices/serviceSlice';

const CreateMaintenance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isActionLoading = false } = useSelector(
    (state) => state.maintenanceReducer || {}
  );
  const {
    vansList = [],
    vanDetailsData = null,
    isVanDetailsLoading = false,
  } = useSelector((state) => state.vanReducer || {});
  const { suppliersList = [] } = useSelector((state) => state.supplierReducer || {});
  const { techniciansList = [] } = useSelector((state) => state.technicianReducer || {});
  const { servicesList = [] } = useSelector((state) => state.serviceReducer || {});

  // Selected catalog service / custom service state
  const [selectedCatalogServiceId, setSelectedCatalogServiceId] = useState('');
  const [customServiceName, setCustomServiceName] = useState('');
  const [customServiceCost, setCustomServiceCost] = useState('');

  // Fetch initial reference lists on page load
  useEffect(() => {
    dispatch(getVansList({}));
    dispatch(getSuppliersByDealer({}));
    dispatch(getTechniciansByDealer({}));
    dispatch(getServices({}));
  }, [dispatch]);

  // Filter completed/active vans for the dropdown
  const completedVans = useMemo(() => {
    if (!Array.isArray(vansList)) return [];
    return vansList.filter((van) => {
      const status = String(van.status || '').toUpperCase();
      const progress = Number(van.progress);
      return status === 'COMPLETED' || progress === 100 || status === '1' || status === 'ACTIVE';
    });
  }, [vansList]);

  // Filter active suppliers
  const activeSuppliers = useMemo(() => {
    if (!Array.isArray(suppliersList)) return [];
    return suppliersList.filter((supplier) => {
      const status = Number(supplier.status);
      const isBlock = Number(supplier.is_block);
      return status === 1 || (supplier.status === undefined && isBlock === 0);
    });
  }, [suppliersList]);

  // Filter active technicians
  const activeTechnicians = useMemo(() => {
    if (!Array.isArray(techniciansList)) return [];
    return techniciansList.filter((tech) => {
      const status = Number(tech.status);
      const isBlock = Number(tech.is_block);
      return status === 1 || (tech.status === undefined && isBlock === 0);
    });
  }, [techniciansList]);

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

  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === '') return '$0.00';
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const initialFormValues = {
    van_id: '',
    title: '',
    maintenance_type: 'Repair & Service',
    priority: 'high',
    description: '',
    job_location: '',
    schedule_date: getTodayDateString(),
    schedule_time: getDefaultTimeString(),
    assignee_type: 'supplier',
    assignee_id: '',
    services: [],
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
            resetForm();
            navigate(pageRoutes.maintenance);
          }
        },
      })
    );
  };

  return (
    <Layout>
      <SubHeader
        title="Create Maintenance Task"
        subtitle="Fill in task details, assign technician or supplier, and add required services."
        backUrl={pageRoutes.maintenance}
      />

      <div className="ct_px_30 mt-4 pb-5">
        <div className="container-fluid">
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
              const availableAssignees =
                values.assignee_type === 'supplier'
                  ? activeSuppliers
                  : activeTechnicians;

              const liveTotalCost = values.services.reduce(
                (sum, s) => sum + (Number(s.cost) || 0),
                0
              );

              // Selected van from completedVans
              const selectedVanFromList = completedVans.find(
                (v) => String(v.vanId || v.id || v.van_id) === String(values.van_id)
              );

              // Extract detailed info from vanDetailsData
              const rawDetails = vanDetailsData?.data || vanDetailsData || {};
              const vd = rawDetails?.van || rawDetails?.vehicle_details || rawDetails?.vehicle || rawDetails || {};
              const deepVan = (rawDetails?.van || rawDetails?.vehicle_details || rawDetails?.vehicle) ? vd : rawDetails;
              const deepOwner = rawDetails?.owner || rawDetails?.owner_details || deepVan?.owner || vd?.owner || null;

              const isDetailsForSelectedVan =
                String(deepVan?.van_id || deepVan?.id || deepVan?.vanId || rawDetails?.van_id || rawDetails?.id) === String(values.van_id);

              // 1. Van Name
              const vanName =
                (isDetailsForSelectedVan && (deepVan?.van_name || deepVan?.vanName)) ||
                selectedVanFromList?.vanName ||
                selectedVanFromList?.van_name ||
                (selectedVanFromList?.make
                  ? `${selectedVanFromList.make} ${selectedVanFromList.model || ''}`.trim()
                  : values.van_id ? `Van #${values.van_id}` : 'N/A');

              // 2. VIN Number
              const vinNumber =
                (isDetailsForSelectedVan && (deepVan?.vin || deepVan?.vin_number || deepVan?.vinNumber || vd?.vin || vd?.vin_number)) ||
                selectedVanFromList?.vinNumber ||
                selectedVanFromList?.vin_number ||
                selectedVanFromList?.vin ||
                'N/A';

              // 3. Registration Number
              const registrationNumber =
                (isDetailsForSelectedVan && (deepVan?.registration_number || deepVan?.registrationNumber || vd?.registration_number || vd?.registrationNumber)) ||
                selectedVanFromList?.registrationNumber ||
                selectedVanFromList?.registration_number ||
                'N/A';

              // 4. Van Model (cleanly formatted without repetition)
              const makeStr = (isDetailsForSelectedVan && deepVan?.make) || selectedVanFromList?.make || '';
              const modelStr = (isDetailsForSelectedVan && deepVan?.model) || selectedVanFromList?.model || '';
              let vanModel = 'N/A';
              if (makeStr && modelStr) {
                if (makeStr.toLowerCase() === modelStr.toLowerCase()) {
                  vanModel = modelStr;
                } else if (modelStr.toLowerCase().startsWith(makeStr.toLowerCase())) {
                  vanModel = modelStr;
                } else {
                  vanModel = `${makeStr} ${modelStr}`;
                }
              } else if (modelStr) {
                vanModel = modelStr;
              } else if (makeStr) {
                vanModel = makeStr;
              }

              // 5. Van Owner Name
              const ownerName =
                (isDetailsForSelectedVan && (deepOwner?.full_name || deepOwner?.owner_name || deepOwner?.name || deepOwner?.ownerName)) ||
                selectedVanFromList?.ownerName ||
                selectedVanFromList?.owner_name ||
                selectedVanFromList?.owner?.full_name ||
                selectedVanFromList?.owner?.name ||
                vd?.ownerName ||
                vd?.owner_name ||
                'N/A';

              // 6. Owner Email
              const ownerEmail =
                (isDetailsForSelectedVan && (deepOwner?.email || deepOwner?.owner_email || deepOwner?.ownerEmail || deepOwner?.email_address)) ||
                selectedVanFromList?.ownerEmail ||
                selectedVanFromList?.owner_email ||
                selectedVanFromList?.owner?.email ||
                selectedVanFromList?.email ||
                vd?.ownerEmail ||
                vd?.owner_email ||
                vd?.email ||
                rawDetails?.owner_email ||
                rawDetails?.email ||
                'N/A';

              const handleVanChange = (e) => {
                const newVanId = e.target.value;
                handleChange(e);
                if (newVanId) {
                  dispatch(getVanDetails({ vanId: newVanId }));
                }
              };

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
                <Form noValidate>
                  <div className="row g-4">
                    {/* SECTION 1: Vehicle & Basic Details */}
                    <div className="col-12">
                      <section className="ct_profile_card p-4 rounded-4 bg-white border">
                        <div className="mb-4 pb-2 border-bottom">
                          <h5 className="ct_green_text ct_fs_18 ct_fw_700 mb-1">
                            1. Vehicle & Basic Details
                          </h5>
                          <p className="text-muted ct_fs_13 mb-0">
                            Select the vehicle and fill in required maintenance task details.
                          </p>
                        </div>

                        <div className="row g-3">
                          {/* Van Selection */}
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
                                onChange={handleVanChange}
                                onBlur={handleBlur}
                              >
                                <option value="">-- Select Van --</option>
                                {completedVans.map((van) => {
                                  const vanId = van.vanId || van.id || van.van_id;
                                  const vName =
                                    van.vanName ||
                                    van.van_name ||
                                    (van.make ? `${van.make} ${van.model || ''}` : `Van #${vanId}`);
                                  const regNo =
                                    van.registrationNumber || van.registration_number;
                                  return (
                                    <option key={vanId} value={vanId}>
                                      {vName} {regNo ? `(${regNo})` : ''}
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

                          {/* CLEAN & SIMPLE SELECTED VAN DETAILS */}
                          {values.van_id && (
                            <div className="col-12 my-2">
                              <div className="p-3 bg-light rounded-3 border">
                                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                                  <h6 className="ct_fs_14 ct_fw_700 ct_head_clr mb-0">
                                    Selected Van Details
                                  </h6>
                                  {isVanDetailsLoading && (
                                    <span className="text-muted ct_fs_12">Loading details...</span>
                                  )}
                                </div>

                                <div className="row g-3">
                                  {/* Van Name and VIN Number */}
                                  <div className="col-lg-4 col-md-6">
                                    <span className="ct_fs_12 text-muted text-uppercase d-block mb-1">
                                      Van Name & VIN Number
                                    </span>
                                    <div className="ct_fs_14 ct_fw_600 ct_head_clr">
                                      {vanName}
                                    </div>
                                    {vinNumber && vinNumber !== 'N/A' && (
                                      <div className="ct_fs_12 text-muted mt-1">
                                        VIN: <span className="text-dark ct_fw_500">{vinNumber}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Registration Number */}
                                  <div className="col-lg-4 col-md-6">
                                    <span className="ct_fs_12 text-muted text-uppercase d-block mb-1">
                                      Registration Number
                                    </span>
                                    <div className="ct_fs_14 ct_fw_600 ct_head_clr">
                                      {registrationNumber}
                                    </div>
                                  </div>

                                  {/* Van Model */}
                                  <div className="col-lg-4 col-md-6">
                                    <span className="ct_fs_12 text-muted text-uppercase d-block mb-1">
                                      Van Model
                                    </span>
                                    <div className="ct_fs_14 ct_fw_600 ct_head_clr">
                                      {vanModel}
                                    </div>
                                  </div>

                                  {/* Van Owner Name */}
                                  <div className="col-lg-4 col-md-6">
                                    <span className="ct_fs_12 text-muted text-uppercase d-block mb-1">
                                      Van Owner Name
                                    </span>
                                    <div className="ct_fs_14 ct_fw_600 ct_head_clr">
                                      {ownerName}
                                    </div>
                                  </div>

                                  {/* Owner Email */}
                                  <div className="col-lg-4 col-md-6">
                                    <span className="ct_fs_12 text-muted text-uppercase d-block mb-1">
                                      Owner Email
                                    </span>
                                    <div className="ct_fs_14 ct_fw_600 ct_head_clr text-break">
                                      {ownerEmail}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

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

                          {/* Priority */}
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
                                rows="3"
                                className="form-control ct_input"
                                placeholder="Provide brief instructions or symptoms (e.g. Brake pedal feels soft, vibration when braking)..."
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></textarea>
                              <ErrorMessage errors={errors} touched={touched} fieldName="description" />
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* SECTION 2: Schedule & Assignment */}
                    <div className="col-12">
                      <section className="ct_profile_card p-4 rounded-4 bg-white border">
                        <div className="mb-4 pb-2 border-bottom">
                          <h5 className="ct_green_text ct_fs_18 ct_fw_700 mb-1">
                            2. Schedule & Assignment
                          </h5>
                          <p className="text-muted ct_fs_13 mb-0">
                            Choose schedule date/time and assign task to supplier or technician.
                          </p>
                        </div>

                        <div className="row g-3">
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
                              <div className="d-flex gap-4 mt-2">
                                <div className="form-check d-flex align-items-center gap-2">
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
                                  <label className="form-check-label ct_fs_14 ct_fw_600" htmlFor="assignee_supplier">
                                    Supplier
                                  </label>
                                </div>
                                <div className="form-check d-flex align-items-center gap-2">
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
                                  <label className="form-check-label ct_fs_14 ct_fw_600" htmlFor="assignee_technician">
                                    Technician
                                  </label>
                                </div>
                              </div>
                              <ErrorMessage errors={errors} touched={touched} fieldName="assignee_type" />
                            </div>
                          </div>

                          {/* Assignee ID */}
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
                        </div>
                      </section>
                    </div>

                    {/* SECTION 3: Services & Quotation */}
                    <div className="col-12">
                      <section className="ct_profile_card p-4 rounded-4 bg-white border">
                        <div className="mb-4 pb-2 border-bottom">
                          <h5 className="ct_green_text ct_fs_18 ct_fw_700 mb-1">
                            3. Services & Quotation
                          </h5>
                          <p className="text-muted ct_fs_13 mb-0">
                            Add standard or custom services with estimated costs.
                          </p>
                        </div>

                        <div className="row g-3">
                          {/* Predefined Services Card */}
                          <div className="col-lg-6 col-12">
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
                                  className="ct_green_btn px-4 ct_btn_h_45 ct_w_100_575 text-nowrap d-flex align-items-center justify-content-center"
                                  style={{ height: '45px', borderRadius: '10px' }}
                                  onClick={handleAddCatalogService}
                                  disabled={!selectedCatalogServiceId}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Custom Service Card */}
                          <div className="col-lg-6 col-12">
                            <div className="p-3 bg-light rounded-3 text-start border h-100 d-flex flex-column justify-content-between">
                              <label className="ct_fs_13 ct_fw_600 mb-2 text-dark">
                                Add Custom Service
                              </label>
                              <div className="d-flex align-items-center gap-2 ct_flex_col_575">
                                <input
                                  type="text"
                                  className="form-control ct_input ct_fs_13 flex-grow-1"
                                  style={{ height: '45px' }}
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
                                  className="ct_green_btn ct_w_100_575 px-4 ct_btn_h_45 text-nowrap d-flex align-items-center justify-content-center"
                                  style={{ height: '45px', borderRadius: '10px', flexShrink: 0 }}
                                  onClick={handleAddCustomService}
                                  disabled={!customServiceName.trim() || !customServiceCost}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Added Services Table */}
                          <div className="col-12 mt-3">
                            <FieldArray name="services">
                              {({ remove }) => (
                                <div>
                                  {values.services.length === 0 ? (
                                    <div className="p-4 text-center border rounded-3 bg-light text-muted ct_fs_14">
                                      No services added yet. Please select from the predefined catalog or add a custom service above.
                                    </div>
                                  ) : (
                                    <div className="table-responsive border rounded-3 ct_custom_table">
                                      <table className="table mb-0 ct_fs_14 align-middle">
                                        <thead>
                                          <tr>
                                            <th style={{ width: '60px' }}>#</th>
                                            <th>Service Name</th>
                                            <th style={{ width: '130px' }}>Type</th>
                                            <th style={{ width: '160px' }} className="text-end">Cost ($)</th>
                                            <th style={{ width: '80px' }} className="text-center">Action</th>
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
                                                    style={{ maxWidth: '120px' }}
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
                                                  <span className="ct_fw_700 text-dark">
                                                    {formatCurrency(srv.cost)}
                                                  </span>
                                                )}
                                              </td>
                                              <td className="text-center">
                                                <button
                                                  type="button"
                                                  className="btn btn-sm text-danger p-1 border-0 bg-transparent"
                                                  onClick={() => remove(idx)}
                                                  title="Remove Service"
                                                >
                                                  <i className="fa-regular fa-trash-can fs-6"></i>
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                        <tfoot>
                                          <tr className="bg-light">
                                            <td colSpan="3" className="text-end ct_fw_700 ct_fs_15">
                                              Total Estimated Amount:
                                            </td>
                                            <td colSpan="2" className="ct_fw_700 text-success ct_fs_16 text-end pe-4">
                                              {formatCurrency(liveTotalCost)}
                                            </td>
                                          </tr>
                                        </tfoot>
                                      </table>
                                    </div>
                                  )}
                                  {errors.services && typeof errors.services === 'string' && (
                                    <div className="text-danger ct_fs_12 mt-2 text-start">
                                      {errors.services}
                                    </div>
                                  )}
                                </div>
                              )}
                            </FieldArray>
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-12 mt-2">
                      <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap">
                        <Link
                          to={pageRoutes.maintenance}
                          className="btn ct_btn_gray px-4 py-2 ct_btn_h_45 d-flex align-items-center justify-content-center text-decoration-none"
                          style={{ minWidth: '130px' }}
                        >
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          className="ct_green_btn px-4 py-2 ct_btn_h_45 d-flex align-items-center justify-content-center gap-2"
                          disabled={isSubmitting || isActionLoading || values.services.length === 0}
                          style={{ minWidth: '220px' }}
                        >
                          {isSubmitting || isActionLoading ? (
                            <>
                              <div
                                className="spinner-border spinner-border-sm text-white"
                                role="status"
                              ></div>
                              <span>Creating Task...</span>
                            </>
                          ) : (
                            <span>Create Maintenance Task</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default CreateMaintenance;
