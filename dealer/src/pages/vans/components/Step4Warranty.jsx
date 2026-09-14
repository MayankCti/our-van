import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import { step4WarrantySchema } from '../../../utils/Schema';
import ErrorMessage from '../../../components/form/ErrorMessage';
import { createVanStep4 } from '../../../redux/slices/vanSlice';

const Step4Warranty = ({ onPrev, onNext, initialData = {}, vanId }) => {
    const dispatch = useDispatch();
    const { isLoading, vanId: reduxVanId, vanStep4Data } = useSelector((state) => state?.vanReducer || {});
    const activeVanId = vanId || reduxVanId;

    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState('');

    const initialValues = useMemo(() => {
        const source = initialData && Object.keys(initialData).length > 0 ? initialData : (vanStep4Data || {});
        return {
            provider: source?.provider || source?.warranty_provider || '',
            coverage_type: source?.coverage_type || 'Mechanical',
            start_date: source?.start_date ? source.start_date.split('T')[0] : '',
            expiry_date: source?.expiry_date ? source.expiry_date.split('T')[0] : '',
            claim_instructions:
                source?.claim_instructions ||
                'Please submit required documents.',
            claim_email: source?.claim_email || '',
            claim_phone: source?.claim_phone || '',
            warranty_document: source?.warranty_document || null,
            doc_preview: source?.doc_preview || null,
            existing_doc_url: source?.warranty_document_url || source?.document_url || null,
            file_name: source?.file_name || (source?.warranty_document?.name || ''),
        };
    }, [initialData, vanStep4Data]);

    const handleFileUpload = (files, setFieldValue) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        setFileError('');

        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.type)) {
            setFileError('Invalid file type. Please upload a PDF, PNG, JPG, or WEBP file.');
            toast.error('Invalid file format. Please upload PDF or image.');
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setFileError('File size exceeds 10MB limit. Please upload a smaller file.');
            toast.error('File size exceeds 10MB limit.');
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setFieldValue('warranty_document', file);
        setFieldValue('file_name', file.name);
        setFieldValue('doc_preview', previewUrl);
    };

    const handleRemoveFile = (setFieldValue, values) => {
        if (values.doc_preview && !values.existing_doc_url) {
            URL.revokeObjectURL(values.doc_preview);
        }
        setFieldValue('warranty_document', null);
        setFieldValue('file_name', '');
        setFieldValue('doc_preview', null);
        setFieldValue('existing_doc_url', null);
        setFileError('');
    };

    const handleSubmitForm = (values) => {
        if (!activeVanId) {
            toast.error('Van ID is missing. Please complete Step 1 first.');
            return;
        }

        const formData = new FormData();
        formData.append('provider', values.provider ? values.provider.trim() : '');
        formData.append('coverage_type', values.coverage_type ? values.coverage_type.trim() : '');
        formData.append('start_date', values.start_date || '');
        formData.append('expiry_date', values.expiry_date || '');
        if (values.claim_instructions) {
            formData.append('claim_instructions', values.claim_instructions.trim());
        }
        formData.append('claim_email', values.claim_email ? values.claim_email.trim() : '');
        formData.append('claim_phone', values.claim_phone ? values.claim_phone.trim() : '');

        if (values.warranty_document instanceof File) {
            formData.append('warranty_document', values.warranty_document);
        }

        const callback = (response) => {
            if (
                response?.success ||
                response?.status === true ||
                response?.statusCode === 200 ||
                response?.data?.warranty ||
                response?.data
            ) {
                if (typeof onNext === 'function') {
                    onNext(response?.data || response, values);
                }
            }
        };

        dispatch(
            createVanStep4({
                vanId: activeVanId,
                payload: formData,
                callback,
            })
        );
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={step4WarrantySchema}
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
                            <h2 className="ct_fs_20 ct_fw_600 mb-0">4. Warranty Details</h2>
                            <div className="step-badge">Step 4 of 7</div>
                        </div>

                        <div className="row">
                            {/* Warranty Provider */}
                            <div className="col-sm-6">
                                <div className="form-group mb-4 text-start">
                                    <label className="mb-2 ct_label" htmlFor="provider">
                                        Warranty Provider <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="provider"
                                        name="provider"
                                        className={`form-control ct_input ${errors.provider && touched.provider ? 'is-invalid border-danger' : ''}`}
                                        placeholder="e.g. Summer Breeze / Bajali Insurance"
                                        value={values.provider}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage errors={errors} touched={touched} fieldName="provider" />
                                </div>
                            </div>

                            {/* Coverage Type */}
                            <div className="col-sm-6">
                                <div className="form-group mb-4 text-start">
                                    <label className="mb-2 ct_label" htmlFor="coverage_type">
                                        Coverage Type <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="coverage_type"
                                        name="coverage_type"
                                        className={`form-control ct_input ct_select_custom ${errors.coverage_type && touched.coverage_type ? 'is-invalid border-danger' : ''}`}
                                        value={values.coverage_type}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <option value="" disabled>Select Coverage Type</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Structural Body">Structural Body</option>
                                        <option value="Full Coverage">Full Coverage</option>
                                        <option value="Comprehensive">Comprehensive</option>
                                        <option value="Electrical & Appliances">Electrical & Appliances</option>
                                    </select>
                                    <ErrorMessage errors={errors} touched={touched} fieldName="coverage_type" />
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="col-sm-6">
                                <div className="form-group mb-4 text-start">
                                    <label className="mb-2 ct_label" htmlFor="start_date">
                                        Start Date <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="start_date"
                                        className={`form-control ct_input ${errors.start_date && touched.start_date ? 'is-invalid border-danger' : ''}`}
                                        value={values.start_date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage errors={errors} touched={touched} fieldName="start_date" />
                                </div>
                            </div>

                            {/* Expiry Date */}
                            <div className="col-sm-6">
                                <div className="form-group mb-4 text-start">
                                    <label className="mb-2 ct_label" htmlFor="expiry_date">
                                        Expiry Date <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="expiry_date"
                                        name="expiry_date"
                                        min={values.start_date || undefined}
                                        className={`form-control ct_input ${errors.expiry_date && touched.expiry_date ? 'is-invalid border-danger' : ''}`}
                                        value={values.expiry_date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage errors={errors} touched={touched} fieldName="expiry_date" />
                                </div>
                            </div>

                            {/* Warranty Documents Upload */}
                            <div className="col-lg-12">
                                <div className="form-group mb-0 text-start">
                                    <label className="mb-2 ct_label">Warranty Documents</label>
                                    <div
                                        className={`upload-box text-center ${isDragging ? 'border-primary' : ''} ${fileError ? 'border-danger' : ''}`}
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
                                                handleFileUpload(e.dataTransfer.files, setFieldValue);
                                            }
                                        }}
                                    >
                                        <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z" fill="#475569" />
                                        </svg>
                                        <div>
                                            <label htmlFor="warrantyDocInput" className="text-muted upload-label ct_fs_16 ct_color_grey mt-2" style={{ cursor: 'pointer' }}>
                                                <span className="ct_fw_400">Drag and drop PDF or image here, or </span>
                                                <span className="ct_fw_700 ct_green_text">Browse Files</span><br />
                                                <span className="ct_fs_12 ct_fw_600">PDF, PNG, JPG, WEBP (Max 10MB)</span>
                                            </label>
                                        </div>
                                        <input
                                            type="file"
                                            id="warrantyDocInput"
                                            accept="application/pdf, image/png, image/jpeg, image/jpg, image/webp"
                                            hidden
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    handleFileUpload(e.target.files, setFieldValue);
                                                }
                                                e.target.value = '';
                                            }}
                                        />
                                    </div>

                                    {fileError && (
                                        <span className="text-danger ct_fs_12 d-block mt-2">
                                            <i className="fa-solid fa-circle-exclamation me-1"></i>
                                            {fileError}
                                        </span>
                                    )}

                                    {/* Attached File Preview */}
                                    {(values.file_name || values.doc_preview || values.existing_doc_url) && (
                                        <div className="upload-imgs ct_custom_scroll mt-3 d-flex flex-wrap gap-2">
                                            {(() => {
                                                const fileUrl = values.doc_preview || values.existing_doc_url;
                                                const isImg = values.warranty_document instanceof File
                                                    ? values.warranty_document.type.startsWith('image/')
                                                    : (values.doc_preview && !values.doc_preview.toLowerCase().endsWith('.pdf')) ||
                                                      (values.existing_doc_url && /\.(png|jpe?g|webp)$/i.test(values.existing_doc_url));

                                                return (
                                                    <div className={`img-item position-relative ${!isImg ? 'doc-item' : ''}`}>
                                                        {isImg && fileUrl ? (
                                                            <img
                                                                src={fileUrl}
                                                                alt={values.file_name || "Warranty document"}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => fileUrl && window.open(fileUrl, '_blank')}
                                                                title="Click to view full image in new tab"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center p-1"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => fileUrl && window.open(fileUrl, '_blank')}
                                                                title={values.file_name || "Click to view document in new tab"}
                                                            >
                                                                <i className="fa-solid fa-file-pdf text-danger fs-4 mb-1"></i>
                                                                <span className="ct_fs_10 text-truncate w-100 ct_fw_600 text-dark">
                                                                    {values.file_name ? (values.file_name.length > 10 ? values.file_name.substring(0, 10) + '...' : values.file_name) : 'PDF'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="img-remove"
                                                            onClick={() => handleRemoveFile(setFieldValue, values)}
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

                        {/* Claim Information Section */}
                        <div className="ct_mt_30">
                            <div className="bage_head mb-4">Claim Information</div>
                        </div>

                        <div className="row">
                            {/* Claim Instructions */}
                            <div className="col-lg-12">
                                <div className="form-group mb-4 text-start">
                                    <label className="mb-2 ct_label" htmlFor="claim_instructions">
                                        Claim Instructions
                                    </label>
                                    <textarea
                                        id="claim_instructions"
                                        name="claim_instructions"
                                        className={`form-control ct_custom_textarea ${errors.claim_instructions && touched.claim_instructions ? 'is-invalid border-danger' : ''}`}
                                        rows="3"
                                        placeholder="Add specific instructions for submitting warranty claims..."
                                        value={values.claim_instructions}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    ></textarea>
                                    <ErrorMessage errors={errors} touched={touched} fieldName="claim_instructions" />
                                </div>
                            </div>

                            {/* Claim Email */}
                            <div className="col-sm-6">
                                <div className="form-group mb-4 text-start">
                                    <label className="mb-2 ct_label" htmlFor="claim_email">
                                        Claim Email <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="claim_email"
                                        name="claim_email"
                                        className={`form-control ct_input ${errors.claim_email && touched.claim_email ? 'is-invalid border-danger' : ''}`}
                                        placeholder="claims@abcinsurance.com"
                                        value={values.claim_email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage errors={errors} touched={touched} fieldName="claim_email" />
                                </div>
                            </div>

                            {/* Claim Phone */}
                            <div className="col-sm-6">
                                <div className="form-group mb-4 text-start">
                                    <label className="mb-2 ct_label" htmlFor="claim_phone">
                                        Claim Phone <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="claim_phone"
                                        name="claim_phone"
                                        className={`form-control ct_input ${errors.claim_phone && touched.claim_phone ? 'is-invalid border-danger' : ''}`}
                                        placeholder="+61 1300 123 456"
                                        value={values.claim_phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage errors={errors} touched={touched} fieldName="claim_phone" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stepper Buttons */}
                    <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                        <button
                            type="button"
                            onClick={() => {
                                if (typeof onPrev === 'function') {
                                    onPrev(values);
                                }
                            }}
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

export default Step4Warranty;
