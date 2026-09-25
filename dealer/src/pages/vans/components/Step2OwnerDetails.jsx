import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import { step2OwnerDetailsSchema } from '../../../utils/Schema';
import ErrorMessage from '../../../components/form/ErrorMessage';
import { createVanStep2, getDealerOwnersList } from '../../../redux/slices/vanSlice';
import useDebounce from '../../../hooks/useDebounce';

const Step2OwnerDetails = ({ onPrev, onNext, initialData = {}, vanId, ownerId, isStep2Completed = false }) => {
    const dispatch = useDispatch();
    const {
        isLoading,
        vanId: reduxVanId,
        ownerId: reduxOwnerId,
        vanStep2Data,
        existingOwnersList = [],
        ownersList = [],
        isExistingOwnersLoading = false,
        isOwnersLoading = false,
    } = useSelector((state) => state?.vanReducer || {});

    const ownersData = existingOwnersList.length > 0 ? existingOwnersList : ownersList;
    const isOwnersFetching = isExistingOwnersLoading || isOwnersLoading;

    const activeVanId = vanId || reduxVanId;
    const activeOwnerId = ownerId || reduxOwnerId || initialData?.owner_id || vanStep2Data?.owner_id;

    // Decide initial mode based on whether mode is 'new' or activeOwnerId exists
    const [ownerMode, setOwnerMode] = useState(() => {
        if (initialData?.mode === 'new') return 'new';
        if (initialData?.mode === 'existing') return 'existing';
        if (activeOwnerId) return 'existing';
        if (initialData?.owner_name && !activeOwnerId) return 'new';
        return 'existing';
    });

    // Selected owner ID for existing mode
    const [selectedOwnerId, setSelectedOwnerId] = useState(() => {
        if (initialData?.mode === 'new') return '';
        return activeOwnerId ? String(activeOwnerId) : '';
    });

    // Stored new owner values (so typed values are preserved if user toggles between modes)
    const [newOwnerValues, setNewOwnerValues] = useState(() => {
        if (initialData?.mode === 'new' || (!activeOwnerId && initialData?.owner_name)) {
            return {
                owner_name: initialData?.owner_name || '',
                email: initialData?.email || '',
                phone_number: initialData?.phone_number || initialData?.mobile_number || '',
            };
        }
        return {
            owner_name: '',
            email: '',
            phone_number: '',
        };
    });

    // Check if a new owner was already submitted/registered previously in this workflow
    const isNewOwnerAlreadySaved = Boolean(
        isStep2Completed &&
        (initialData?.mode === 'new' || (!initialData?.mode && initialData?.owner_id && (initialData?.owner_name || vanStep2Data?.owner_name)))
    );

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 350);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch owners list
    useEffect(() => {
        dispatch(
            getDealerOwnersList({
                page: 1,
                limit: 100,
                search: debouncedSearch,
            })
        );
    }, [dispatch, debouncedSearch]);

    // Find currently selected owner object from ownersData
    const selectedOwner = useMemo(() => {
        if (!selectedOwnerId) return null;
        return ownersData.find((o) => String(o.ownerId || o.id) === String(selectedOwnerId)) || null;
    }, [selectedOwnerId, ownersData]);

    // Initial Formik values
    const initialValues = useMemo(() => {
        if (ownerMode === 'existing') {
            return {
                owner_name:
                    selectedOwner?.ownerName ||
                    selectedOwner?.full_name ||
                    selectedOwner?.name ||
                    (activeOwnerId ? (initialData?.owner_name || vanStep2Data?.owner_name || '') : ''),
                email:
                    selectedOwner?.email ||
                    (activeOwnerId ? (initialData?.email || vanStep2Data?.email || '') : ''),
                phone_number:
                    selectedOwner?.phone ||
                    selectedOwner?.mobileNumber ||
                    selectedOwner?.phone_number ||
                    (activeOwnerId ? (initialData?.phone_number || initialData?.mobile_number || vanStep2Data?.phone_number || '') : ''),
            };
        }
        return {
            owner_name: newOwnerValues.owner_name || '',
            email: newOwnerValues.email || '',
            phone_number: newOwnerValues.phone_number || '',
        };
    }, [ownerMode, selectedOwner, activeOwnerId, initialData, vanStep2Data, newOwnerValues]);

    // Filtered owners list for the dropdown
    const filteredOwners = useMemo(() => {
        if (!searchTerm) return ownersData;
        const term = searchTerm.toLowerCase();
        return ownersData.filter((owner) => {
            const name = (owner.ownerName || owner.full_name || owner.name || '').toLowerCase();
            const email = (owner.email || '').toLowerCase();
            const phone = (owner.phone || owner.mobileNumber || owner.phone_number || '').toLowerCase();
            return name.includes(term) || email.includes(term) || phone.includes(term);
        });
    }, [ownersData, searchTerm]);

    // Handle submit for Existing Owner
    const handleSaveExistingOwner = () => {
        if (!activeVanId) {
            toast.error("Van ID is missing. Please complete Step 1 first.");
            return;
        }

        if (!selectedOwnerId) {
            toast.error("Please select an existing owner from the dropdown.");
            return;
        }

        const payload = {
            owner_id: String(selectedOwnerId),
        };

        const callback = (response) => {
            if (
                response?.success ||
                response?.status === true ||
                response?.statusCode === 200 ||
                response?.van_id ||
                response?.owner_id
            ) {
                if (typeof onNext === 'function') {
                    onNext(response?.data || response, {
                        owner_id: String(selectedOwnerId),
                        owner_name: selectedOwner?.ownerName || selectedOwner?.full_name || selectedOwner?.name || '',
                        email: selectedOwner?.email || '',
                        phone_number: selectedOwner?.phone || selectedOwner?.mobileNumber || selectedOwner?.phone_number || '',
                        mode: 'existing',
                    });
                }
            }
        };

        dispatch(
            createVanStep2({
                vanId: activeVanId,
                payload,
                callback,
            })
        );
    };

    // Handle submit for New Owner
    const handleSaveNewOwner = (values) => {
        if (!activeVanId) {
            toast.error("Van ID is missing. Please complete Step 1 first.");
            return;
        }

        const payload = {
            owner_name: values.owner_name.trim(),
            email: values.email.trim(),
            phone_number: values.phone_number.trim(),
        };

        const callback = (response) => {
            if (
                response?.success ||
                response?.status === true ||
                response?.statusCode === 200 ||
                response?.van_id ||
                response?.owner_id
            ) {
                if (typeof onNext === 'function') {
                    onNext(response?.data || response, {
                        ...values,
                        owner_id: response?.owner_id || response?.data?.owner_id || initialData?.owner_id || null,
                        mode: 'new',
                    });
                }
            }
        };

        dispatch(
            createVanStep2({
                vanId: activeVanId,
                payload,
                callback,
            })
        );
    };

    const handleBackClick = (currentValues) => {
        if (typeof onPrev === 'function') {
            if (ownerMode === 'existing' && selectedOwnerId) {
                onPrev({
                    owner_id: String(selectedOwnerId),
                    owner_name: selectedOwner?.ownerName || selectedOwner?.full_name || '',
                    email: selectedOwner?.email || '',
                    phone_number: selectedOwner?.phone || selectedOwner?.mobileNumber || '',
                    mode: 'existing',
                });
            } else {
                onPrev({
                    ...(currentValues || newOwnerValues),
                    owner_id: initialData?.owner_id || activeOwnerId || null,
                    mode: 'new',
                });
            }
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={step2OwnerDetailsSchema}
            onSubmit={handleSaveNewOwner}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                setValues,
            }) => {
                const handleOwnerSelect = (owner) => {
                    const id = String(owner.ownerId || owner.id);
                    setSelectedOwnerId(id);
                    setFieldValue('owner_name', owner.ownerName || owner.full_name || owner.name || '');
                    setFieldValue('email', owner.email || '');
                    setFieldValue('phone_number', owner.phone || owner.mobileNumber || owner.phone_number || '');
                    setDropdownOpen(false);
                    setSearchTerm('');
                };

                const handleClearSelectedOwner = (e) => {
                    e.stopPropagation();
                    setSelectedOwnerId('');
                    setFieldValue('owner_name', '');
                    setFieldValue('email', '');
                    setFieldValue('phone_number', '');
                };

                const handleModeChange = (mode) => {
                    if (mode === ownerMode) return;

                    // If switching away from 'new', preserve typed values
                    if (ownerMode === 'new') {
                        setNewOwnerValues({
                            owner_name: values.owner_name || '',
                            email: values.email || '',
                            phone_number: values.phone_number || '',
                        });
                    }

                    setOwnerMode(mode);
                    setDropdownOpen(false);

                    if (mode === 'new') {
                        // Switch to 'new' mode: populate with clean newOwnerValues (or empty)
                        setValues({
                            owner_name: newOwnerValues.owner_name || '',
                            email: newOwnerValues.email || '',
                            phone_number: newOwnerValues.phone_number || '',
                        });
                    } else if (mode === 'existing') {
                        // Switch to 'existing' mode: populate with selectedOwner details if chosen, else empty
                        if (selectedOwner) {
                            setValues({
                                owner_name: selectedOwner.ownerName || selectedOwner.full_name || selectedOwner.name || '',
                                email: selectedOwner.email || '',
                                phone_number: selectedOwner.phone || selectedOwner.mobileNumber || selectedOwner.phone_number || '',
                            });
                        } else {
                            setValues({
                                owner_name: '',
                                email: '',
                                phone_number: '',
                            });
                        }
                    }
                };

                // Check if email and phone should be disabled:
                // 1. In existing mode: readOnly (selected from dropdown)
                // 2. In new mode: disabled only if this new owner was already submitted & registered
                const isEmailDisabled = ownerMode === 'existing' || (ownerMode === 'new' && isNewOwnerAlreadySaved);
                const isPhoneDisabled = ownerMode === 'existing' || (ownerMode === 'new' && isNewOwnerAlreadySaved);

                return (
                    <fieldset>
                        <div className="ct_profile_card">
                            {/* Header */}
                            <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                                <h2 className="ct_fs_20 ct_fw_600 mb-0">2. Owner Details</h2>
                                <div className="step-badge">Step 2 of 7</div>
                            </div>

                            {/* Clean Radio Toggle (Existing vs New Owner) */}
                            <div className="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom flex-wrap">
                                <div
                                    className="form-check d-flex align-items-center gap-2 mb-0"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleModeChange('existing')}
                                >
                                    <input
                                        className="form-check-input mt-0"
                                        type="radio"
                                        name="owner_selection_type"
                                        id="radioExistingOwner"
                                        checked={ownerMode === 'existing'}
                                        onChange={() => handleModeChange('existing')}
                                        style={{ cursor: 'pointer', accentColor: '#3D8B37', width: '18px', height: '18px' }}
                                    />
                                    <label
                                        className="form-check-label ct_fs_15 ct_fw_600 mb-0"
                                        htmlFor="radioExistingOwner"
                                        style={{ cursor: 'pointer', color: ownerMode === 'existing' ? '#3D8B37' : '#475569' }}
                                    >
                                        Existing Owner
                                    </label>
                                </div>

                                <div
                                    className="form-check d-flex align-items-center gap-2 mb-0"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleModeChange('new')}
                                >
                                    <input
                                        className="form-check-input mt-0"
                                        type="radio"
                                        name="owner_selection_type"
                                        id="radioNewOwner"
                                        checked={ownerMode === 'new'}
                                        onChange={() => handleModeChange('new')}
                                        style={{ cursor: 'pointer', accentColor: '#3D8B37', width: '18px', height: '18px' }}
                                    />
                                    <label
                                        className="form-check-label ct_fs_15 ct_fw_600 mb-0"
                                        htmlFor="radioNewOwner"
                                        style={{ cursor: 'pointer', color: ownerMode === 'new' ? '#3D8B37' : '#475569' }}
                                    >
                                        New Owner
                                    </label>
                                </div>
                            </div>

                            {/* MODE 1: EXISTING OWNER - SEARCHABLE DROPDOWN */}
                            {ownerMode === 'existing' && (
                                <div className="row mb-4">
                                    <div className="col-lg-12">
                                        <div className="form-group text-start position-relative" ref={dropdownRef}>
                                            <label className="mb-2 ct_label">
                                                Select Owner <span className="text-danger">*</span>
                                            </label>

                                            {/* Select Box Trigger */}
                                            <div
                                                className="form-control ct_input d-flex align-items-center justify-content-between"
                                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: '#fff',
                                                    borderColor: dropdownOpen ? '#3D8B37' : undefined,
                                                }}
                                            >
                                                <div className="d-flex align-items-center gap-2 flex-grow-1 text-truncate">
                                                    {selectedOwner ? (
                                                        <span className="ct_fw_500 text-dark">
                                                            {selectedOwner.ownerName || selectedOwner.full_name || selectedOwner.name}{' '}
                                                            <span className="text-muted ct_fs_13">
                                                                ({selectedOwner.email || selectedOwner.phone || 'Owner'})
                                                            </span>
                                                        </span>
                                                    ) : selectedOwnerId ? (
                                                        <span className="ct_fw_500 text-dark">
                                                            {values.owner_name || 'Owner'}{' '}
                                                            {values.email ? <span className="text-muted ct_fs_13">({values.email})</span> : null}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted ct_fs_14">
                                                            -- Search & Select Existing Owner --
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    {(selectedOwner || selectedOwnerId) && (
                                                        <button
                                                            type="button"
                                                            className="btn p-0 border-0 text-muted"
                                                            onClick={handleClearSelectedOwner}
                                                            title="Clear selection"
                                                            style={{ background: 'none' }}
                                                        >
                                                            <i className="fa-solid fa-xmark"></i>
                                                        </button>
                                                    )}
                                                    <i
                                                        className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'} text-muted ct_fs_12`}
                                                    ></i>
                                                </div>
                                            </div>

                                            {/* Dropdown Menu */}
                                            {dropdownOpen && (
                                                <div
                                                    className="position-absolute w-100 bg-white rounded-3 border shadow-sm mt-1"
                                                    style={{
                                                        zIndex: 1050,
                                                        maxHeight: '280px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {/* Search Input Inside Dropdown */}
                                                    <div className="p-2 border-bottom bg-light">
                                                        <div className="position-relative">
                                                            <input
                                                                type="text"
                                                                className="form-control ct_input ct_fs_13 ps-4 py-1"
                                                                placeholder="Search by name, email, or phone..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                autoFocus
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <i
                                                                className="fa-solid fa-magnifying-glass position-absolute text-muted ct_fs_12"
                                                                style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                                                            ></i>
                                                        </div>
                                                    </div>

                                                    {/* Options List */}
                                                    <div className="overflow-auto flex-grow-1" style={{ maxHeight: '200px' }}>
                                                        {isOwnersFetching ? (
                                                            <div className="text-center py-3 text-muted ct_fs_13">
                                                                <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                                                                Loading owners...
                                                            </div>
                                                        ) : filteredOwners.length === 0 ? (
                                                            <div className="text-center py-3 text-muted ct_fs_13">
                                                                No owners found.
                                                            </div>
                                                        ) : (
                                                            filteredOwners.map((owner) => {
                                                                const oId = String(owner.ownerId || owner.id);
                                                                const isSelected = selectedOwnerId === oId;
                                                                const oName = owner.ownerName || owner.full_name || owner.name || 'N/A';
                                                                const oEmail = owner.email || 'N/A';
                                                                const oPhone = owner.phone || owner.mobileNumber || owner.phone_number || '';

                                                                return (
                                                                    <div
                                                                        key={oId}
                                                                        className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center"
                                                                        onClick={() => handleOwnerSelect(owner)}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            backgroundColor: isSelected ? '#F0FDF4' : 'transparent',
                                                                            transition: 'background-color 0.15s',
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                                                        }}
                                                                    >
                                                                        <div>
                                                                            <div className="ct_fs_14 ct_fw_600 text-dark">{oName}</div>
                                                                            <div className="ct_fs_12 text-muted">
                                                                                {oEmail} {oPhone ? `• ${oPhone}` : ''}
                                                                            </div>
                                                                        </div>
                                                                        {isSelected && (
                                                                            <i className="fa-solid fa-check text-success ct_fs_14"></i>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* OWNER DETAILS INPUT FIELDS */}
                            <div className="row">
                                {/* Full Name */}
                                <div className="col-lg-12">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="owner_name">
                                            Full Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="owner_name"
                                            id="owner_name"
                                            className="form-control ct_input"
                                            placeholder={ownerMode === 'existing' ? 'Owner Name' : 'e.g. Jessica William / Yash Patel'}
                                            value={values.owner_name}
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (ownerMode === 'new') {
                                                    setNewOwnerValues((prev) => ({ ...prev, owner_name: e.target.value }));
                                                }
                                            }}
                                            onBlur={handleBlur}
                                            readOnly={ownerMode === 'existing'}
                                            style={
                                                ownerMode === 'existing'
                                                    ? { backgroundColor: '#f8fafc', cursor: 'default', color: '#334155' }
                                                    : { backgroundColor: '#ffffff', cursor: 'text', color: '#0f172a' }
                                            }
                                        />
                                        {ownerMode === 'new' && (
                                            <ErrorMessage errors={errors} touched={touched} fieldName="owner_name" />
                                        )}
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="email">
                                            Email Address <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="form-control ct_input"
                                            placeholder={ownerMode === 'existing' ? 'Email Address' : 'e.g. jessicawilliam029@gmail.com'}
                                            value={values.email}
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (ownerMode === 'new') {
                                                    setNewOwnerValues((prev) => ({ ...prev, email: e.target.value }));
                                                }
                                            }}
                                            onBlur={handleBlur}
                                            readOnly={isEmailDisabled}
                                            disabled={isEmailDisabled}
                                            style={
                                                isEmailDisabled
                                                    ? { backgroundColor: '#e2e8f0', cursor: 'not-allowed', opacity: 0.85, color: '#475569' }
                                                    : { backgroundColor: '#ffffff', cursor: 'text', color: '#0f172a' }
                                            }
                                        />
                                        {ownerMode === 'new' && !isEmailDisabled && (
                                            <ErrorMessage errors={errors} touched={touched} fieldName="email" />
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Number */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="phone_number">
                                            Mobile Number <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            id="phone_number"
                                            className="form-control ct_input"
                                            placeholder={ownerMode === 'existing' ? 'Mobile Number' : 'e.g. +91 9999999999'}
                                            value={values.phone_number}
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (ownerMode === 'new') {
                                                    setNewOwnerValues((prev) => ({ ...prev, phone_number: e.target.value }));
                                                }
                                            }}
                                            onBlur={handleBlur}
                                            readOnly={isPhoneDisabled}
                                            disabled={isPhoneDisabled}
                                            style={
                                                isPhoneDisabled
                                                    ? { backgroundColor: '#e2e8f0', cursor: 'not-allowed', opacity: 0.85, color: '#475569' }
                                                    : { backgroundColor: '#ffffff', cursor: 'text', color: '#0f172a' }
                                            }
                                        />
                                        {ownerMode === 'new' && !isPhoneDisabled && (
                                            <ErrorMessage errors={errors} touched={touched} fieldName="phone_number" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                            <button
                                type="button"
                                onClick={() => handleBackClick(values)}
                                disabled={isLoading}
                                className="previous action-button-previous ct_w_100_575 border-0"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (ownerMode === 'existing') {
                                        handleSaveExistingOwner();
                                    } else {
                                        handleSubmit();
                                    }
                                }}
                                disabled={isLoading}
                                className="ct_form_next action-button ct_w_100_575 border-0 d-flex align-items-center justify-content-center gap-2"
                                style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
                            >
                                {isLoading ? (
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
            }}
        </Formik>
    );
};

export default Step2OwnerDetails;
