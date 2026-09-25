import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import { step6MaintenanceSchema } from '../../../utils/Schema';
import ErrorMessage from '../../../components/form/ErrorMessage';
import { createVanStep6 } from '../../../redux/slices/vanSlice';

const Step6Maintenance = ({ onPrev, onNext, initialData = {}, vanId }) => {
    const dispatch = useDispatch();
    const { isLoading, vanId: reduxVanId, vanStep6Data } = useSelector((state) => state?.vanReducer || {});
    const activeVanId = vanId || reduxVanId;

    const initialValues = useMemo(() => {
        const source = initialData && Object.keys(initialData).length > 0 ? initialData : (vanStep6Data || {});
        return {
            first_service_date: source?.first_service_date ? source.first_service_date.split('T')[0] : '',
            assigned_service_centre: source?.assigned_service_centre || '',
            notes: source?.notes || '',
            reminder_before_days: Number(source?.reminder_before_days) || 7,
            notify_push: source?.notify_push !== undefined ? Boolean(Number(source.notify_push)) : true,
            notify_email: source?.notify_email !== undefined ? Boolean(Number(source.notify_email)) : true,
        };
    }, [initialData, vanStep6Data]);

    const handleSubmitForm = (values) => {
        if (!activeVanId) {
            toast.error("Van ID is missing. Please complete Step 1 first.");
            return;
        }

        const payload = {
            first_service_date: values.first_service_date,
            assigned_service_centre: values.assigned_service_centre ? values.assigned_service_centre.trim() : '',
            notes: values.notes ? values.notes.trim() : '',
            reminder_before_days: Number(values.reminder_before_days) || 7,
            notify_push: values.notify_push ? 1 : 0,
            notify_email: values.notify_email ? 1 : 0,
        };

        const callback = (response) => {
            if (response?.success || response?.status === true || response?.statusCode === 200 || response?.van_id) {
                if (typeof onNext === 'function') {
                    onNext(response?.data || response, payload);
                }
            }
        };

        dispatch(
            createVanStep6({
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
            validationSchema={step6MaintenanceSchema}
            onSubmit={handleSubmitForm}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
            }) => (
                <fieldset>
                    <div className="ct_profile_card text-start">
                        <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                            <h2 className="ct_fs_20 ct_fw_600 mb-0">6. Maintenance Setup</h2>
                            <div className="step-badge">Step 6 of 7</div>
                        </div>

                        <div>
                            <div className="mb-4">
                                <div className="bage_head">Initial Service Schedule</div>
                            </div>

                            <div className="row">
                                {/* First Service Date */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="first_service_date">
                                            First Service Date <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="first_service_date"
                                            name="first_service_date"
                                            className="form-control ct_input"
                                            value={values.first_service_date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="first_service_date" />
                                    </div>
                                </div>

                                {/* Assigned Service Centre */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="assigned_service_centre">
                                            Assigned Service Centre <span className="ct_para_clr">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="assigned_service_centre"
                                            name="assigned_service_centre"
                                            className="form-control ct_input"
                                            placeholder="e.g. Jaguar Motors Service Centre"
                                            value={values.assigned_service_centre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="assigned_service_centre" />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="col-lg-12">
                                    <div className="form-group text-start mb-4">
                                        <label className="mb-2 ct_label" htmlFor="notes">
                                            Notes <span className="ct_para_clr">(Optional)</span>
                                        </label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            className="form-control ct_custom_textarea"
                                            rows="3"
                                            placeholder="Add specific instructions or maintenance notes..."
                                            value={values.notes}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        ></textarea>
                                        <ErrorMessage errors={errors} touched={touched} fieldName="notes" />
                                    </div>
                                </div>
                            </div>

                            <div className="ct_mt_30 mb-4">
                                <div className="bage_head">Maintenance Reminders</div>
                            </div>
                            <div className="row">
                                {/* Reminder Before Days */}
                                <div className="col-lg-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="reminder_before_days">
                                            Reminder Before <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            id="reminder_before_days"
                                            name="reminder_before_days"
                                            className="form-control ct_input ct_custom_select"
                                            value={values.reminder_before_days}
                                            onChange={(e) => setFieldValue('reminder_before_days', Number(e.target.value))}
                                            onBlur={handleBlur}
                                        >
                                            <option value={7}>7 Days</option>
                                            <option value={15}>15 Days</option>
                                            <option value={25}>25 Days</option>
                                            <option value={30}>30 Days</option>
                                        </select>
                                        <ErrorMessage errors={errors} touched={touched} fieldName="reminder_before_days" />
                                    </div>
                                </div>

                                {/* Notification Methods */}
                                <div className="col-lg-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label">Notification Method</label>
                                        <div className="d-flex gap-4 flex-wrap pt-2">
                                            <div className="form-check ct_custom_check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="pushNotifCheck"
                                                    name="notify_push"
                                                    checked={Boolean(values.notify_push)}
                                                    onChange={(e) => setFieldValue('notify_push', e.target.checked)}
                                                />
                                                <label className="form-check-label ct_fw_500" htmlFor="pushNotifCheck" style={{ cursor: 'pointer' }}>
                                                    Push Notification
                                                </label>
                                            </div>
                                            <div className="form-check ct_custom_check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="emailNotifCheck"
                                                    name="notify_email"
                                                    checked={Boolean(values.notify_email)}
                                                    onChange={(e) => setFieldValue('notify_email', e.target.checked)}
                                                />
                                                <label className="form-check-label ct_fw_500" htmlFor="emailNotifCheck" style={{ cursor: 'pointer' }}>
                                                    Email Notification
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                        <button
                            type="button"
                            onClick={() => onPrev(values)}
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

export default Step6Maintenance;
