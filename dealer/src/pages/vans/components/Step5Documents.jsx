import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createVanStep5 } from '../../../redux/slices/vanSlice';

const documentTypes = [
    {
        key: 'service_book',
        label: 'Service Book',
        inputId: 'serviceBookInput',
        errorMessage: 'Please upload Service Book',
    },
    {
        key: 'user_manual',
        label: 'User Manuals',
        inputId: 'userManualInput',
        errorMessage: 'Please upload User Manuals',
    },
    {
        key: 'registration_certificate',
        label: 'Registration Certificate',
        inputId: 'regCertInput',
        errorMessage: 'Please upload Registration Certificate',
    },
    {
        key: 'insurance_certificate',
        label: 'Insurance Certificate',
        inputId: 'insCertInput',
        errorMessage: 'Please upload Insurance Certificate',
    },
    {
        key: 'purchase_invoice',
        label: 'Purchase Invoice',
        inputId: 'invoiceInput',
        errorMessage: 'Please upload Purchase Invoice',
    },
    {
        key: 'compliance_certificate',
        label: 'Compliance Certificates',
        inputId: 'compCertInput',
        errorMessage: 'Please upload Compliance Certificates',
    },
];

const Step5Documents = ({ onPrev, onNext, initialData = {}, vanId }) => {
    const dispatch = useDispatch();
    const { isLoading, vanId: reduxVanId, vanStep5Data } = useSelector((state) => state?.vanReducer || {});
    const activeVanId = vanId || reduxVanId;

    const [files, setFiles] = useState({});
    const [previews, setPreviews] = useState({});
    const [errors, setErrors] = useState({});
    const [draggingKey, setDraggingKey] = useState(null);

    // Initialize existing documents from initialData or redux state
    useEffect(() => {
        const source = initialData && Object.keys(initialData).length > 0 ? initialData : (vanStep5Data || {});
        if (source) {
            const newPreviews = {};
            documentTypes.forEach(({ key }) => {
                const item = source[key];
                if (item) {
                    if (typeof item === 'string') {
                        const fileName = item.split('/').pop() || `${key}.pdf`;
                        const isImg = /\.(png|jpe?g|webp)$/i.test(item);
                        newPreviews[key] = {
                            name: fileName,
                            url: item,
                            isExisting: true,
                            isImage: isImg,
                        };
                    } else if (item instanceof File) {
                        const isImg = item.type.startsWith('image/');
                        newPreviews[key] = {
                            name: item.name,
                            url: URL.createObjectURL(item),
                            isExisting: false,
                            isImage: isImg,
                            size: (item.size / (1024 * 1024)).toFixed(2) + ' MB',
                        };
                    }
                }
            });
            if (Object.keys(newPreviews).length > 0) {
                setPreviews((prev) => ({ ...prev, ...newPreviews }));
            }
        }
    }, [initialData, vanStep5Data]);

    const handleFileUpload = (key, fileList) => {
        if (!fileList || fileList.length === 0) return;
        const file = fileList[0];

        // Clear error for this field
        setErrors((prev) => ({ ...prev, [key]: '' }));

        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.type)) {
            const msg = 'Invalid file type. Please upload a PDF, PNG, JPG, or WEBP file.';
            setErrors((prev) => ({ ...prev, [key]: msg }));
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            const msg = 'File size exceeds 10MB limit.';
            setErrors((prev) => ({ ...prev, [key]: msg }));
            return;
        }

        const isImg = file.type.startsWith('image/');
        const previewUrl = URL.createObjectURL(file);
        const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        setFiles((prev) => ({ ...prev, [key]: file }));
        setPreviews((prev) => ({
            ...prev,
            [key]: {
                name: file.name,
                url: previewUrl,
                isExisting: false,
                isImage: isImg,
                size: formattedSize,
            },
        }));
    };

    const handleRemoveFile = (key) => {
        if (previews[key]?.url && !previews[key]?.isExisting) {
            URL.revokeObjectURL(previews[key].url);
        }
        setFiles((prev) => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
        setPreviews((prev) => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
        const docObj = documentTypes.find((d) => d.key === key);
        setErrors((prev) => ({
            ...prev,
            [key]: docObj?.errorMessage || `Please upload ${docObj?.label || 'document'}`,
        }));
    };

    const handleDragOver = (e, key) => {
        e.preventDefault();
        setDraggingKey(key);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDraggingKey(null);
    };

    const handleDrop = (e, key) => {
        e.preventDefault();
        setDraggingKey(null);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(key, e.dataTransfer.files);
        }
    };

    const handleSubmit = () => {
        if (!activeVanId) {
            toast.error("Van ID is missing. Please complete Step 1 first.");
            return;
        }

        // Validate that ALL fields are required
        const newErrors = {};
        documentTypes.forEach(({ key, label, errorMessage }) => {
            const hasFile = files[key] instanceof File;
            const hasExisting = Boolean(previews[key]?.isExisting || previews[key]?.url || previews[key]?.name);
            if (!hasFile && !hasExisting) {
                newErrors[key] = errorMessage || `Please upload ${label}`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const currentData = { ...initialData };
        documentTypes.forEach(({ key }) => {
            if (files[key]) {
                currentData[key] = files[key];
            } else if (previews[key]) {
                currentData[key] = previews[key].url || previews[key].name;
            }
        });

        // Check if there are any new files to upload
        const newFilesToUpload = Object.entries(files).filter(([_, file]) => file instanceof File);

        if (newFilesToUpload.length > 0) {
            const formData = new FormData();
            newFilesToUpload.forEach(([key, file]) => {
                formData.append(key, file);
            });

            const callback = (response) => {
                if (response?.success || response?.status === true || response?.statusCode === 200 || response?.van_id) {
                    if (typeof onNext === 'function') {
                        onNext(response?.data || response, currentData);
                    }
                }
            };

            dispatch(
                createVanStep5({
                    vanId: activeVanId,
                    payload: formData,
                    callback,
                })
            );
        } else {
            // No new files selected (documents were already saved/uploaded previously)
            // Proceed directly to the next step without making an empty API call
            if (typeof onNext === 'function') {
                onNext(null, currentData);
            }
        }
    };

    const handleBack = () => {
        const currentData = { ...initialData };
        documentTypes.forEach(({ key }) => {
            if (files[key]) {
                currentData[key] = files[key];
            } else if (previews[key]) {
                currentData[key] = previews[key].url || previews[key].name;
            }
        });
        if (typeof onPrev === 'function') {
            onPrev(currentData);
        }
    };

    return (
        <fieldset>
            <div className="ct_profile_card text-start">
                <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                    <h2 className="ct_fs_20 ct_fw_600 mb-0">5. Upload Documents</h2>
                    <div className="step-badge">Step 5 of 7</div>
                </div>

                <div className="row">
                    {documentTypes.map(({ key, label, inputId }) => {
                        const preview = previews[key];
                        const err = errors[key];
                        const isDragging = draggingKey === key;

                        return (
                            <div className="col-lg-4 col-sm-6" key={key}>
                                <div className="form-group mb-4 text-start">
                                    <label className="mb-2 ct_label">
                                        {label} <span className="text-danger">*</span>
                                    </label>
                                    <div
                                        className={`upload-box text-center bg-transparent ${isDragging ? 'border-primary' : err ? 'border-danger' : ''}`}
                                        onDragOver={(e) => handleDragOver(e, key)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, key)}
                                        style={{
                                            borderStyle: isDragging ? 'dashed' : undefined,
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.71061 19.1249C3.29048 18.1743 2.35547 16.5554 2.35547 14.7182C2.35547 11.9584 4.4651 9.69146 7.15965 9.44191C7.71084 6.08909 10.6223 3.53125 14.1312 3.53125C17.64 3.53125 20.5515 6.08909 21.1027 9.44191C23.7972 9.69146 25.9069 11.9584 25.9069 14.7182C25.9069 16.5554 24.9719 18.1743 23.5517 19.1249M18.8414 18.8397L14.1312 14.1294L9.42089 18.8397M14.1312 14.1294V24.7275" stroke="#64748B" strokeWidth="2.35514" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div>
                                            <label htmlFor={inputId} className="text-muted upload-label ct_fs_12 ct_color_grey mt-2" style={{ cursor: 'pointer' }}>
                                                <span className="ct_fw_400">Drag and drop PDF here, or Browse Files</span><br />
                                                <span className="upload_file_btn">Upload File</span>
                                            </label>
                                        </div>
                                        <input
                                            type="file"
                                            id={inputId}
                                            accept="application/pdf, image/png, image/jpeg, image/jpg, image/webp"
                                            hidden
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    handleFileUpload(key, e.target.files);
                                                }
                                                e.target.value = '';
                                            }}
                                        />
                                    </div>

                                    {err && (
                                        <span className="text-danger ct_fs_12 d-block mt-2">
                                            <i className="fa-solid fa-circle-exclamation me-1"></i>
                                            {err}
                                        </span>
                                    )}

                                    {/* Preview / Attached File info */}
                                    {preview && (
                                        <div className="upload-imgs ct_custom_scroll mt-3 d-flex flex-wrap gap-2">
                                            <div className={`img-item position-relative ${!(preview.isImage && preview.url) ? 'doc-item' : ''}`}>
                                                {preview.isImage && preview.url ? (
                                                    <img
                                                        src={preview.url}
                                                        alt={preview.name || label}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (preview.url) window.open(preview.url, '_blank');
                                                        }}
                                                        title="Click to view full image in new tab"
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center p-1"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (preview.url) window.open(preview.url, '_blank');
                                                        }}
                                                        title={preview.name || "Click to view document in new tab"}
                                                    >
                                                        <i className="fa-solid fa-file-pdf text-danger fs-4 mb-1"></i>
                                                        <span className="ct_fs_10 text-truncate w-100 ct_fw_600 text-dark">
                                                            {preview.name ? (preview.name.length > 10 ? preview.name.substring(0, 10) + '...' : preview.name) : 'PDF'}
                                                        </span>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    className="img-remove"
                                                    onClick={() => handleRemoveFile(key)}
                                                    title="Remove file"
                                                >
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                <button
                    type="button"
                    onClick={handleBack}
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
                            <span>Uploading...</span>
                        </>
                    ) : (
                        'Save & Continue'
                    )}
                </button>
            </div>
        </fieldset>
    );
};

export default Step5Documents;
