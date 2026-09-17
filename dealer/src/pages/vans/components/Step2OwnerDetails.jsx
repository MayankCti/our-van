import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import { step2OwnerDetailsSchema } from '../../../utils/Schema';
import ErrorMessage from '../../../components/form/ErrorMessage';
import { createVanStep2 } from '../../../redux/slices/vanSlice';

const Step2OwnerDetails = ({ onPrev, onNext, initialData = {}, vanId, ownerId, isStep2Completed = false }) => {
    const dispatch = useDispatch();
    const { isLoading, vanId: reduxVanId, ownerId: reduxOwnerId, vanStep2Data } = useSelector((state) => state?.vanReducer || {});
    const activeVanId = vanId || reduxVanId;
    const activeOwnerId = ownerId || reduxOwnerId || initialData?.owner_id || vanStep2Data?.owner_id;

    const initialValues = useMemo(() => ({
        owner_name:
            initialData?.owner_name ||
            initialData?.full_name ||
            vanStep2Data?.owner_name ||
            vanStep2Data?.full_name ||
            '',
        email: initialData?.email || vanStep2Data?.email || '',
        phone_number:
            initialData?.phone_number ||
            initialData?.mobile_number ||
            vanStep2Data?.phone_number ||
            vanStep2Data?.mobile_number ||
            '',
    }), [
        initialData?.owner_name,
        initialData?.full_name,
        initialData?.email,
        initialData?.phone_number,
        initialData?.mobile_number,
        vanStep2Data?.owner_name,
        vanStep2Data?.full_name,
        vanStep2Data?.email,
        vanStep2Data?.phone_number,
    ]);

    const handleSubmitForm = (values) => {
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
            if (response?.success || response?.status === true || response?.statusCode === 200 || response?.van_id || response?.owner_id) {
                if (typeof onNext === 'function') {
                    onNext(response?.data || response, values);
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

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={step2OwnerDetailsSchema}
            onSubmit={handleSubmitForm}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
            }) => (
                <fieldset>
                    <div className="ct_profile_card">
                        <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                            <h2 className="ct_fs_20 ct_fw_600 mb-0">2. Owner Details</h2>
                            <div className="step-badge">Step 2 of 7</div>
                        </div>

                        <div className="row">
                            {/* Full Name / Owner Name */}
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
                                        placeholder="Jessica William / Yash Patel"
                                        value={values.owner_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage errors={errors} touched={touched} fieldName="owner_name" />
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
                                        placeholder="jessicawilliam029@gmail.com"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={isStep2Completed}
                                        style={isStep2Completed ? { cursor: 'not-allowed', backgroundColor: '#e2e8f0', opacity: 0.85 } : undefined}
                                    />
                                    <ErrorMessage errors={errors} touched={touched} fieldName="email" />
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
                                        placeholder="e.g. +919999999999"
                                        value={values.phone_number}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={isStep2Completed}
                                        style={isStep2Completed ? { cursor: 'not-allowed', backgroundColor: '#e2e8f0', opacity: 0.85 } : undefined}
                                    />
                                    <ErrorMessage errors={errors} touched={touched} fieldName="phone_number" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                        <button
                            type="button"
                            onClick={() => onPrev && onPrev(values)}
                            disabled={isLoading}
                            className="previous action-button-previous ct_w_100_575 border-0"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
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
            )}
        </Formik>
    );
};

export default Step2OwnerDetails;
