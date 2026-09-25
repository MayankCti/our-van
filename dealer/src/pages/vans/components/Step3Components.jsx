import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getComponentsList, createVanStep3 } from '../../../redux/slices/vanSlice';

// Component validation helper using Yup schema
const validateComponent = (item) => {
    const errors = {};
    if (!item.manufacturer || !item.manufacturer.trim()) {
        errors.manufacturer = "Please enter manufacturer name";
    } else if (item.manufacturer.trim().length < 2) {
        errors.manufacturer = "Manufacturer name must be at least 2 characters";
    } else if (item.manufacturer.trim().length > 100) {
        errors.manufacturer = "Manufacturer name cannot exceed 100 characters";
    }

    if (!item.installation_date) {
        errors.installation_date = "Please select installation date";
    } else {
        const instDate = new Date(item.installation_date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (instDate > today) {
            errors.installation_date = "Installation date cannot be in the future";
        }
    }

    if (!item.warranty_period_months || Number(item.warranty_period_months) <= 0) {
        errors.warranty_period_months = "Please select warranty period";
    }

    if (item.replacement_schedule) {
        const repDate = new Date(item.replacement_schedule);
        if (item.installation_date) {
            const instDate = new Date(item.installation_date);
            if (repDate < instDate) {
                errors.replacement_schedule = "Replacement schedule date must be after installation date";
            }
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (repDate < today) {
                errors.replacement_schedule = "Replacement schedule date cannot be in the past";
            }
        }
    }

    if (item.maintenance_notes && item.maintenance_notes.length > 500) {
        errors.maintenance_notes = "Maintenance notes cannot exceed 500 characters";
    }

    // At least one photo / document is required for each component
    if (!item.file && !item.existing_file_url) {
        errors.file = "Please upload component image or manual";
    }

    return errors;
};


const Step3Components = ({ onPrev, onNext, initialData, vanId }) => {
    const dispatch = useDispatch();

    const {
        componentsList = [],
        isComponentsLoading = false,
        isLoading: isSubmitting = false,
        vanId: reduxVanId,
    } = useSelector((state) => state?.vanReducer || {});

    const activeVanId = vanId || reduxVanId;

    // State for selected components dictionary { [temp_id]: componentObject }
    const [selectedComponents, setSelectedComponents] = useState({});
    const [customComponents, setCustomComponents] = useState([]);
    const [activeComponentId, setActiveComponentId] = useState(null);

    // Validation and Error states
    const [componentErrors, setComponentErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [selectionError, setSelectionError] = useState('');
    const [customNameError, setCustomNameError] = useState('');
    const [fileError, setFileError] = useState('');

    // Custom Component Input State
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [customNameInput, setCustomNameInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // Fetch master components list on mount
    useEffect(() => {
        dispatch(getComponentsList());
    }, [dispatch]);

    // Populate from initialData or saved progress
    useEffect(() => {
        if (initialData) {
            let initialArr = [];
            if (Array.isArray(initialData)) {
                initialArr = initialData;
            } else if (typeof initialData === 'object' && Object.keys(initialData).length > 0) {
                initialArr = Object.values(initialData);
            }

            if (initialArr.length > 0) {
                const restoredMap = {};
                const restoredCustoms = [];

                initialArr.forEach((item, idx) => {
                    const compTypeId = item.component_type_id !== undefined && item.component_type_id !== null
                        ? item.component_type_id
                        : (!item.is_custom ? item.id : null);
                    const tempId = item.temp_id || (item.is_custom ? `custom_${idx + 1}` : `component_${compTypeId}`);

                    // Extract file information from backend progress response (item.files array) or direct properties
                    const firstFile = (item.files && Array.isArray(item.files) && item.files.length > 0) ? item.files[0] : null;
                    const existingFileUrl = item.existing_file_url || item.file_url || item.image_url || firstFile?.file_url || null;
                    const existingFileName = item.file_name || firstFile?.file_name || (item.file ? item.file.name : '') || (existingFileUrl ? existingFileUrl.split('/').pop() : '');
                    const isImg = existingFileUrl ? /\.(png|jpe?g|webp)$/i.test(existingFileUrl) || (firstFile?.mime_type && firstFile.mime_type.startsWith('image/')) : false;

                    restoredMap[tempId] = {
                        temp_id: tempId,
                        component_type_id: item.is_custom ? null : compTypeId,
                        component_name: item.component_name || item.component_type_name || item.name || '',
                        is_custom: Boolean(item.is_custom),
                        icon_key: item.icon_key || '',
                        manufacturer: item.manufacturer || '',
                        installation_date: item.installation_date ? item.installation_date.split('T')[0] : '',
                        warranty_period_months: item.warranty_period_months || 12,
                        replacement_schedule: item.replacement_schedule ? item.replacement_schedule.split('T')[0] : '',
                        maintenance_notes: item.maintenance_notes || '',
                        file: item.file || null,
                        file_name: existingFileName,
                        file_preview: item.file_preview || (isImg ? existingFileUrl : null),
                        existing_file_url: existingFileUrl,
                    };

                    if (item.is_custom) {
                        restoredCustoms.push({
                            temp_id: tempId,
                            id: null,
                            name: item.component_name || item.component_type_name || item.name || `Custom ${idx + 1}`,
                            slug: 'custom',
                            icon_key: 'custom',
                            is_custom: true,
                        });
                    }
                });

                setSelectedComponents(restoredMap);
                if (restoredCustoms.length > 0) {
                    setCustomComponents(restoredCustoms);
                }
                const firstKey = Object.keys(restoredMap)[0];
                if (firstKey) {
                    setActiveComponentId(firstKey);
                }
            }
        }
    }, [initialData]);

    // Handle Master Component Checkbox Toggle
    const handleToggleMasterComponent = (comp) => {
        const tempId = `component_${comp.id}`;
        setSelectionError('');

        setSelectedComponents((prev) => {
            const next = { ...prev };
            if (next[tempId]) {
                delete next[tempId];
                // Remove errors & touched for this component
                setComponentErrors((errs) => {
                    const newErrs = { ...errs };
                    delete newErrs[tempId];
                    return newErrs;
                });
                setTouchedFields((touched) => {
                    const newTouched = { ...touched };
                    delete newTouched[tempId];
                    return newTouched;
                });

                if (activeComponentId === tempId) {
                    const remainingKeys = Object.keys(next);
                    setActiveComponentId(remainingKeys.length > 0 ? remainingKeys[0] : null);
                }
            } else {
                next[tempId] = {
                    temp_id: tempId,
                    component_type_id: comp.id,
                    component_name: comp.name,
                    is_custom: false,
                    icon_key: comp.icon_key || comp.slug || '',
                    manufacturer: '',
                    installation_date: '',
                    warranty_period_months: 12,
                    replacement_schedule: '',
                    maintenance_notes: '',
                    file: null,
                    file_name: '',
                    file_preview: null,
                    existing_file_url: null,
                };
                if (!activeComponentId) {
                    setActiveComponentId(tempId);
                }
            }
            return next;
        });
    };

    // Handle Adding a Custom Component
    const handleAddCustomComponent = () => {
        const trimmed = customNameInput.trim();
        if (!trimmed) {
            setCustomNameError("Please enter custom component name");
            return;
        }

        if (trimmed.length > 50) {
            setCustomNameError("Component name cannot exceed 50 characters");
            return;
        }

        // Check for duplicates
        const existsMaster = componentsList.some((c) => c.name?.toLowerCase() === trimmed.toLowerCase());
        const existsCustom = customComponents.some((c) => c.name?.toLowerCase() === trimmed.toLowerCase());
        if (existsMaster || existsCustom) {
            setCustomNameError("A component with this name already exists");
            return;
        }

        setCustomNameError('');
        setSelectionError('');
        const tempId = `custom_${Date.now()}`;
        const newCustom = {
            temp_id: tempId,
            id: null,
            name: trimmed,
            slug: 'custom',
            icon_key: 'custom',
            is_custom: true,
        };

        setCustomComponents((prev) => [...prev, newCustom]);
        setSelectedComponents((prev) => ({
            ...prev,
            [tempId]: {
                temp_id: tempId,
                component_type_id: null,
                component_name: trimmed,
                is_custom: true,
                icon_key: 'custom',
                manufacturer: '',
                installation_date: '',
                warranty_period_months: 12,
                replacement_schedule: '',
                maintenance_notes: '',
                file: null,
                file_name: '',
                file_preview: null,
                existing_file_url: null,
            },
        }));

        setActiveComponentId(tempId);
        setCustomNameInput('');
        setIsAddingCustom(false);
    };

    // Handle Removing a Custom Component entirely
    const handleRemoveCustomComponent = (tempId) => {
        setCustomComponents((prev) => prev.filter((c) => c.temp_id !== tempId));
        setSelectedComponents((prev) => {
            const next = { ...prev };
            delete next[tempId];
            if (activeComponentId === tempId) {
                const remainingKeys = Object.keys(next);
                setActiveComponentId(remainingKeys.length > 0 ? remainingKeys[0] : null);
            }
            return next;
        });
        setComponentErrors((errs) => {
            const newErrs = { ...errs };
            delete newErrs[tempId];
            return newErrs;
        });
        setTouchedFields((touched) => {
            const newTouched = { ...touched };
            delete newTouched[tempId];
            return newTouched;
        });
    };

    // Handle Active Component Field Changes
    const handleFieldChange = (field, value) => {
        if (!activeComponentId) return;

        setSelectedComponents((prev) => {
            const current = prev[activeComponentId];
            if (!current) return prev;
            const updated = {
                ...current,
                [field]: value,
            };

            // Re-validate this component to clear/update error for this field
            const errs = validateComponent(updated);
            setComponentErrors((prevErrs) => ({
                ...prevErrs,
                [activeComponentId]: errs,
            }));

            return {
                ...prev,
                [activeComponentId]: updated,
            };
        });
    };

    // Handle Field Blur (mark as touched)
    const handleFieldBlur = (field) => {
        if (!activeComponentId) return;
        setTouchedFields((prev) => ({
            ...prev,
            [activeComponentId]: {
                ...(prev[activeComponentId] || {}),
                [field]: true,
            },
        }));

        const current = selectedComponents[activeComponentId];
        if (current) {
            const errs = validateComponent(current);
            setComponentErrors((prevErrs) => ({
                ...prevErrs,
                [activeComponentId]: errs,
            }));
        }
    };

    // File Upload Handler for Active Component
    const handleFileUpload = (files) => {
        if (!activeComponentId || !files || files.length === 0) return;
        const file = files[0];
        setFileError('');

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setFileError("Invalid file type. Please upload a PNG, JPG, WEBP, or PDF file.");
            toast.error("Invalid file format");
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setFileError("File size exceeds 10MB limit. Please upload a smaller file.");
            toast.error("File size exceeds 10MB");
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setSelectedComponents((prev) => {
            const current = prev[activeComponentId];
            if (!current) return prev;
            const updated = {
                ...current,
                file: file,
                file_name: file.name,
                file_preview: previewUrl,
            };

            // Re-validate to clear file error immediately
            const errs = validateComponent(updated);
            setComponentErrors((prevErrs) => ({
                ...prevErrs,
                [activeComponentId]: errs,
            }));

            return {
                ...prev,
                [activeComponentId]: updated,
            };
        });

        setTouchedFields((prev) => ({
            ...prev,
            [activeComponentId]: {
                ...(prev[activeComponentId] || {}),
                file: true,
            },
        }));
    };

    const handleRemoveFile = () => {
        if (!activeComponentId) return;
        setFileError('');
        setSelectedComponents((prev) => {
            const current = prev[activeComponentId];
            if (!current) return prev;
            if (current.file_preview && !current.existing_file_url) {
                URL.revokeObjectURL(current.file_preview);
            }
            const updated = {
                ...current,
                file: null,
                file_name: '',
                file_preview: null,
                existing_file_url: null,
            };

            // Re-validate to show file required error
            const errs = validateComponent(updated);
            setComponentErrors((prevErrs) => ({
                ...prevErrs,
                [activeComponentId]: errs,
            }));

            return {
                ...prev,
                [activeComponentId]: updated,
            };
        });

        setTouchedFields((prev) => ({
            ...prev,
            [activeComponentId]: {
                ...(prev[activeComponentId] || {}),
                file: true,
            },
        }));
    };

    const selectedKeys = Object.keys(selectedComponents);
    const selectedList = Object.values(selectedComponents);
    const activeComponent = activeComponentId ? selectedComponents[activeComponentId] : null;
    const activeErrors = (activeComponentId && componentErrors[activeComponentId]) || {};
    const activeTouched = (activeComponentId && touchedFields[activeComponentId]) || {};

    // Validate all selected components
    const validateAll = () => {
        let hasError = false;
        const newErrors = {};
        const allTouched = {};
        let firstInvalidId = null;

        selectedList.forEach((item) => {
            const errs = validateComponent(item);
            newErrors[item.temp_id] = errs;
            allTouched[item.temp_id] = {
                manufacturer: true,
                installation_date: true,
                warranty_period_months: true,
                replacement_schedule: true,
                maintenance_notes: true,
                file: true,
            };

            if (Object.keys(errs).length > 0) {
                hasError = true;
                if (!firstInvalidId) {
                    firstInvalidId = item.temp_id;
                }
            }
        });

        setComponentErrors(newErrors);
        setTouchedFields(allTouched);

        return { isValid: !hasError, firstInvalidId, errors: newErrors };
    };

    // Handle Step 3 Submission
    const handleSubmit = () => {
        if (selectedList.length === 0) {
            setSelectionError("Please select at least one component to proceed.");
            toast.error("Please select at least one component");
            return;
        }

        if (!activeVanId) {
            toast.error("Van ID not found. Please complete Step 1 first.");
            return;
        }

        // Validate all components
        const { isValid, firstInvalidId } = validateAll();
        if (!isValid) {
            if (firstInvalidId && firstInvalidId !== activeComponentId) {
                setActiveComponentId(firstInvalidId);
                const invalidName = selectedComponents[firstInvalidId]?.component_name || "Component";
                toast.error(`Please complete the required details for "${invalidName}"`);
            } else {
                toast.error("Please fill in all required fields marked with *");
            }
            return;
        }

        // Build Payload according to API specs
        const componentsPayload = selectedList.map((item) => ({
            temp_id: item.temp_id,
            component_type_id: item.is_custom ? null : item.component_type_id,
            ...(item.is_custom ? { component_name: item.component_name } : {}),
            is_custom: Boolean(item.is_custom),
            manufacturer: item.manufacturer ? item.manufacturer.trim() : "",
            installation_date: item.installation_date || "",
            warranty_period_months: item.warranty_period_months ? Number(item.warranty_period_months) : 12,
            replacement_schedule: item.replacement_schedule || "",
            maintenance_notes: item.maintenance_notes ? item.maintenance_notes.trim() : "",
        }));

        const fileMeta = [];
        const filesToAppend = [];

        selectedList.forEach((item) => {
            if (item.file) {
                fileMeta.push({
                    temp_id: item.temp_id,
                    file_type: "COMPONENT_IMAGE",
                });
                filesToAppend.push(item.file);
            }
        });

        const formData = new FormData();
        formData.append('components', JSON.stringify(componentsPayload));

        if (fileMeta.length > 0) {
            formData.append('file_meta', JSON.stringify(fileMeta));
            filesToAppend.forEach((file) => {
                formData.append('files', file);
            });
        }

        const callback = (response) => {
            if (response?.success || response?.status === true || response?.statusCode === 200) {
                if (typeof onNext === 'function') {
                    onNext(response?.data || response, selectedComponents);
                }
            }
        };

        dispatch(
            createVanStep3({
                vanId: activeVanId,
                payload: formData,
                callback,
            })
        );
    };

    return (
        <fieldset>
            <div className="ct_profile_card text-start">
                <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                    <h2 className="ct_fs_20 ct_fw_600 mb-0">3. Van Components</h2>
                    <div className="step-badge">Step 3 of 7</div>
                </div>

                {/* Master Component Checkboxes */}
                <div>
                    {isComponentsLoading && componentsList.length === 0 ? (
                        <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                            <span className="text-muted ct_fs_14">Loading available components...</span>
                        </div>
                    ) : (
                        <div className="row">
                            {componentsList.map((comp) => {
                                const tempId = `component_${comp.id}`;
                                const isChecked = Boolean(selectedComponents[tempId]);
                                const hasErr = Boolean(componentErrors[tempId] && Object.keys(componentErrors[tempId]).length > 0);

                                return (
                                    <div className="col-xl-3 col-md-4 col-sm-6 mb-3 position-relative" key={comp.id}>
                                        <input
                                            type="checkbox"
                                            id={`comp_chk_${comp.id}`}
                                            className="van-checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggleMasterComponent(comp)}
                                        />
                                        <label
                                            htmlFor={`comp_chk_${comp.id}`}
                                            className={`van-component-box ${isChecked && hasErr ? 'border-danger' : ''}`}
                                        >
                                            <h5>{comp.name}</h5>
                                            {isChecked && (
                                                <div className="position-absolute top-0  m-2" style={{ right: "20px" }}>
                                                    {hasErr ? (
                                                        <span className="badge rounded-pill d-flex align-items-center justify-content-center bg-danger" title="Incomplete details" style={{ fontSize: '10px', width: "20px", height: "20px" }}>
                                                            !
                                                        </span>
                                                    ) : (
                                                        <span className="badge rounded-pill d-flex align-items-center justify-content-center bg-success" title="Configured" style={{ fontSize: '10px', width: "20px", height: "20px" }}>
                                                            <i className="fa-solid fa-check"></i>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                );
                            })}

                            {/* Custom Components List */}
                            {customComponents.map((custom) => {
                                const isChecked = Boolean(selectedComponents[custom.temp_id]);
                                const hasErr = Boolean(componentErrors[custom.temp_id] && Object.keys(componentErrors[custom.temp_id]).length > 0);

                                return (
                                    <div className="col-xl-3 col-md-4 col-sm-6 mb-3 position-relative" key={custom.temp_id}>
                                        <input
                                            type="checkbox"
                                            id={`comp_chk_${custom.temp_id}`}
                                            className="van-checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                                if (isChecked) {
                                                    setSelectedComponents((prev) => {
                                                        const next = { ...prev };
                                                        delete next[custom.temp_id];
                                                        if (activeComponentId === custom.temp_id) {
                                                            const remaining = Object.keys(next);
                                                            setActiveComponentId(remaining.length > 0 ? remaining[0] : null);
                                                        }
                                                        return next;
                                                    });
                                                } else {
                                                    setSelectionError('');
                                                    setSelectedComponents((prev) => ({
                                                        ...prev,
                                                        [custom.temp_id]: {
                                                            temp_id: custom.temp_id,
                                                            component_type_id: null,
                                                            component_name: custom.name,
                                                            is_custom: true,
                                                            icon_key: 'custom',
                                                            manufacturer: '',
                                                            installation_date: '',
                                                            warranty_period_months: 12,
                                                            replacement_schedule: '',
                                                            maintenance_notes: '',
                                                            file: null,
                                                            file_name: '',
                                                            file_preview: null,
                                                            existing_file_url: null,
                                                        },
                                                    }));
                                                    if (!activeComponentId) {
                                                        setActiveComponentId(custom.temp_id);
                                                    }
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={`comp_chk_${custom.temp_id}`}
                                            className={`van-component-box ${isChecked && hasErr ? 'border-danger' : ''}`}
                                        >
                                            <h5>{custom.name}</h5>
                                            {isChecked && (
                                                <div className="position-absolute top-0 start-0 m-2">
                                                    {hasErr ? (
                                                        <span className="badge rounded-pill bg-danger" title="Incomplete details" style={{ fontSize: '10px' }}>
                                                            !
                                                        </span>
                                                    ) : (
                                                        <span className="badge rounded-pill bg-success" title="Configured" style={{ fontSize: '10px' }}>
                                                            <i className="fa-solid fa-check"></i>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </label>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0  m-2 rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: '22px', height: '22px', right: "20px", padding: 0, zIndex: 10 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveCustomComponent(custom.temp_id);
                                            }}
                                            title="Remove custom component"
                                        >
                                            <i className="fa-solid fa-xmark" style={{ fontSize: '11px' }}></i>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Selection Error Message */}
                    {selectionError && (
                        <div className="alert alert-danger py-2 px-3 mt-2 d-flex align-items-center gap-2 ct_fs_14" style={{ borderRadius: '8px' }}>
                            <i className="fa-solid fa-circle-exclamation text-danger"></i>
                            <span>{selectionError}</span>
                        </div>
                    )}

                    {/* Add Custom Component Section */}
                    {isAddingCustom ? (
                        <div className="card p-3 mt-3 border-success" style={{ borderRadius: '12px' }}>
                            <label className="ct_label mb-2">Custom Component Name <span className="text-danger">*</span></label>
                            <div className="">
                                <input
                                    type="text"
                                    className="form-control ct_input"
                                    placeholder="e.g. Custom Solar Controller"
                                    value={customNameInput}
                                    onChange={(e) => {
                                        setCustomNameInput(e.target.value);
                                        if (customNameError) setCustomNameError('');
                                    }}
                                    autoFocus
                                />
                                <div className='d-flex align-items-center ct_flex_col_575 gap-3 mt-3 justify-content-end'>
                                    <button
                                        type="button"
                                        className="ct_green_btn ct_btn_h_45 ct_w_100_575"
                                        onClick={handleAddCustomComponent}
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className=" btn ct_btn_gray ct_btn_h_45 ct_w_100_575"
                                        onClick={() => {
                                            setIsAddingCustom(false);
                                            setCustomNameInput('');
                                            setCustomNameError('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            {customNameError && (
                                <span className="text-danger ct_fs_12 d-block mt-2">
                                    {customNameError}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div
                            className="ct_fs_16 ct_fw_500 ct_green_text mt-3 d-inline-block"
                            style={{ cursor: "pointer" }}
                            onClick={() => setIsAddingCustom(true)}
                        >
                            <i className="fa-solid fa-plus me-2"></i> Add Custom component
                        </div>
                    )}

                    {/* Component Details Form Section */}
                    {selectedKeys.length > 0 ? (
                        <>
                            {/* Component Selector Dropdown */}
                            <div className="ct_mt_30 ct_mb_30 d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div className="dropdown ct_w_100_575">
                                    <button
                                        className="btn filter-dropdown dropdown-toggle ct_w_100_575 d-flex align-items-center justify-content-between"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <div className="d-flex align-items-center gap-2">
                                            {activeComponentId && componentErrors[activeComponentId] && Object.keys(componentErrors[activeComponentId]).length > 0 ? (
                                                <span className="badge bg-danger rounded-pill px-3 py-2" style={{ fontSize: '10px' }}>Incomplete</span>
                                            ) : (
                                                <span className="badge bg-success rounded-pill px-3 py-2" style={{ fontSize: '10px' }}>Configured</span>
                                            )}
                                            <span>{activeComponent?.component_name || "Select Component"} Details</span>
                                        </div>
                                        <svg className="ms-2" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.34 7L10.67 14.67L3 7" stroke="#3D8B37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <ul className="dropdown-menu w-100 p-0">
                                        {selectedList.map((item) => {
                                            const itemErrs = componentErrors[item.temp_id] || {};
                                            const hasErrs = Object.keys(itemErrs).length > 0;

                                            return (
                                                <li key={item.temp_id}>
                                                    <button
                                                        type="button"
                                                        className={`dropdown-item d-flex align-items-center justify-content-between ${item.temp_id === activeComponentId ? 'active' : ''}`}
                                                        onClick={() => setActiveComponentId(item.temp_id)}
                                                    >
                                                        <span>{item.component_name} Details</span>
                                                        {hasErrs ? (
                                                            <span className="badge bg-danger rounded-pill" style={{ fontSize: '9px' }}>!</span>
                                                        ) : (
                                                            <i className="fa-solid fa-check text-success" style={{ fontSize: '11px' }}></i>
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <span className="text-muted ct_fs_14">
                                    Configuring: <strong className="text-dark">{activeComponent?.component_name}</strong> ({selectedKeys.indexOf(activeComponentId) + 1} of {selectedKeys.length} selected)
                                </span>
                            </div>

                            {activeComponent && (
                                <div className="row">
                                    {/* Manufacturer */}
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">
                                                Manufacturer <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control ct_input"
                                                placeholder="e.g. Dometic / Energy Drive"
                                                value={activeComponent.manufacturer || ''}
                                                onChange={(e) => handleFieldChange('manufacturer', e.target.value)}
                                                onBlur={() => handleFieldBlur('manufacturer')}
                                            />
                                            {activeErrors?.manufacturer && activeTouched?.manufacturer && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.manufacturer}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Installation Date */}
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">
                                                Installation Date <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control ct_input"
                                                value={activeComponent.installation_date || ''}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => handleFieldChange('installation_date', e.target.value)}
                                                onBlur={() => handleFieldBlur('installation_date')}
                                            />
                                            {activeErrors?.installation_date && activeTouched?.installation_date && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.installation_date}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Warranty Period */}
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">
                                                Warranty Period <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className="form-control ct_input ct_select_custom"
                                                value={activeComponent.warranty_period_months || 12}
                                                onChange={(e) => handleFieldChange('warranty_period_months', Number(e.target.value))}
                                                onBlur={() => handleFieldBlur('warranty_period_months')}
                                            >
                                                <option value={6}>6 Months</option>
                                                <option value={12}>1 Year (12 Months)</option>
                                                <option value={24}>2 Years (24 Months)</option>
                                                <option value={36}>3 Years (36 Months)</option>
                                                <option value={48}>4 Years (48 Months)</option>
                                                <option value={60}>5 Years (60 Months)</option>
                                            </select>
                                            {activeErrors?.warranty_period_months && activeTouched?.warranty_period_months && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.warranty_period_months}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Replacement Schedule */}
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">Replacement Schedule</label>
                                            <input
                                                type="date"
                                                className="form-control ct_input"
                                                value={activeComponent.replacement_schedule || ''}
                                                min={activeComponent.installation_date || new Date().toISOString().split('T')[0]}
                                                onChange={(e) => handleFieldChange('replacement_schedule', e.target.value)}
                                                onBlur={() => handleFieldBlur('replacement_schedule')}
                                            />
                                            {activeErrors?.replacement_schedule && activeTouched?.replacement_schedule && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.replacement_schedule}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Maintenance Notes */}
                                    <div className="col-lg-12">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">Maintenance Notes</label>
                                            <textarea
                                                className="form-control ct_custom_textarea"
                                                rows="3"
                                                placeholder="Add specific care instructions or notes..."
                                                value={activeComponent.maintenance_notes || ''}
                                                onChange={(e) => handleFieldChange('maintenance_notes', e.target.value)}
                                                onBlur={() => handleFieldBlur('maintenance_notes')}
                                            ></textarea>
                                            {activeErrors?.maintenance_notes && activeTouched?.maintenance_notes && (
                                                <span className="text-danger ct_fs_12 d-block mt-1">
                                                    {activeErrors.maintenance_notes}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Manual / Image Upload */}
                                    <div className="col-lg-12">
                                        <div className="form-group mb-4 text-start">
                                            <label className="mb-2 ct_label">
                                                Component Image / Manual Upload <span className="text-danger">*</span>
                                            </label>
                                            <div
                                                className={`upload-box text-center ${isDragging ? 'border-primary' : ''}`}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(true);
                                                }}
                                                onDragLeave={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                        handleFileUpload(e.dataTransfer.files);
                                                    }
                                                }}
                                            >
                                                <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z" fill="#475569" />
                                                </svg>
                                                <div>
                                                    <label htmlFor="compManualInput" className="text-muted upload-label ct_fs_16 ct_color_grey mt-2" style={{ cursor: 'pointer' }}>
                                                        <span className="ct_fw_400">Drag and drop file here, or </span>
                                                        <span className="ct_fw_700 ct_green_text">Browse Files</span><br />
                                                        <span className="ct_fs_12 ct_fw_600">PNG, JPG, WEBP, or PDF (Max 10MB)</span>
                                                    </label>
                                                </div>
                                                <input
                                                    type="file"
                                                    id="compManualInput"
                                                    accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
                                                    hidden
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files.length > 0) {
                                                            handleFileUpload(e.target.files);
                                                        }
                                                        e.target.value = '';
                                                    }}
                                                />
                                            </div>

                                            {/* File Error Messages */}
                                            {fileError && (
                                                <span className="text-danger ct_fs_12 d-block mt-2">
                                                    {fileError}
                                                </span>
                                            )}
                                            {activeErrors?.file && activeTouched?.file && !activeComponent.file && !activeComponent.existing_file_url && (
                                                <span className="text-danger ct_fs_12 d-block mt-2">
                                                    {activeErrors.file}
                                                </span>
                                            )}

                                            {/* File Attachment / Preview */}
                                            {(activeComponent.file_name || activeComponent.file_preview || activeComponent.existing_file_url) && (
                                                <div className="upload-imgs ct_custom_scroll mt-3 d-flex flex-wrap gap-2">
                                                    {(() => {
                                                        const fileUrl = activeComponent.file_preview || activeComponent.existing_file_url;
                                                        const isImg = activeComponent.file
                                                            ? activeComponent.file.type.startsWith('image/')
                                                            : (activeComponent.file_preview && !activeComponent.file_preview.toLowerCase().endsWith('.pdf')) ||
                                                            (activeComponent.existing_file_url && /\.(png|jpe?g|webp)$/i.test(activeComponent.existing_file_url));

                                                        return (
                                                            <div className={`img-item position-relative ${!isImg ? 'doc-item' : ''}`}>
                                                                {isImg && fileUrl ? (
                                                                    <img
                                                                        src={fileUrl}
                                                                        alt={activeComponent.file_name || "Component file"}
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => fileUrl && window.open(fileUrl, '_blank')}
                                                                        title="Click to view full image in new tab"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center p-1"
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => fileUrl && window.open(fileUrl, '_blank')}
                                                                        title={activeComponent.file_name || "Click to view document in new tab"}
                                                                    >
                                                                        <i className="fa-solid fa-file-pdf text-danger fs-4 mb-1"></i>
                                                                        <span className="ct_fs_10 text-truncate w-100 ct_fw_600 text-dark">
                                                                            {activeComponent.file_name ? (activeComponent.file_name.length > 10 ? activeComponent.file_name.substring(0, 10) + '...' : activeComponent.file_name) : 'PDF'}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    className="img-remove"
                                                                    onClick={handleRemoveFile}
                                                                    title="Remove file"
                                                                >
                                                                    <i className="fa-solid fa-xmark"></i>
                                                                </button>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4 bg-light rounded mt-4 border border-dashed">
                            <p className="mb-0 text-muted ct_fs_14">
                                <i className="fa-solid fa-circle-info me-2 text-success"></i>
                                Please select at least one component from above to configure its details.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stepper Buttons */}
            <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                <button
                    type="button"
                    onClick={() => {
                        if (typeof onPrev === 'function') {
                            onPrev(selectedComponents);
                        }
                    }}
                    className="previous action-button-previous ct_w_100_575 border-0"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedList.length === 0}
                    className="ct_form_next action-button ct_w_100_575 border-0 d-flex align-items-center justify-content-center gap-2"
                    style={{ cursor: isSubmitting || selectedList.length === 0 ? 'not-allowed' : 'pointer', opacity: isSubmitting || selectedList.length === 0 ? 0.7 : 1 }}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Saving...</span>
                        </>
                    ) : (
                        'Save & Continue'
                    )}
                </button>
            </div>
        </fieldset>
    );
};

export default Step3Components;
