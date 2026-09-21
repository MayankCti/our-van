import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { pageRoutes } from '../../../routes/PageRoutes';
import { step1VehicleInfoSchema } from '../../../utils/Schema';
import ErrorMessage from '../../../components/form/ErrorMessage';
import { createVanStep1 } from '../../../redux/slices/vanSlice';

const Step1VehicleInfo = ({ onNext, initialData = {}, vanId }) => {
    const dispatch = useDispatch();
    const { isLoading, vanStep1Data, vanProgressData, vanId: reduxVanId } = useSelector((state) => state?.vanReducer || {});

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [deleteImageIds, setDeleteImageIds] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const mergedData = { ...vanProgressData?.data, ...vanProgressData, ...vanStep1Data?.data, ...vanStep1Data, ...initialData };
    const activeVanId = vanId || reduxVanId || initialData?.van_id || mergedData?.van_id;

    // Resolve existing images from all possible sources (initialData, vanProgressData, vanStep1Data)
    const existingImages = useMemo(() => {
        const pData = vanProgressData?.data || vanProgressData;
        const sData = vanStep1Data?.data || vanStep1Data;
        const iData = initialData?.data || initialData;

        const candidates = [
            iData?.vehicle_images,
            iData?.images,
            iData?.vehicle_details?.vehicle_images,
            iData?.vehicle_details?.images,
            pData?.vehicle_images,
            pData?.images,
            pData?.vehicle_details?.vehicle_images,
            pData?.vehicle_details?.images,
            sData?.vehicle_images,
            sData?.images,
            sData?.vehicle_details?.vehicle_images,
            sData?.vehicle_details?.images,
        ];

        for (const c of candidates) {
            if (Array.isArray(c) && c.length > 0) {
                return c;
            }
        }
        return [];
    }, [initialData, vanProgressData, vanStep1Data]);

    // Load and sync existing vehicle images into photoPreviews
    React.useEffect(() => {
        if (existingImages && Array.isArray(existingImages) && existingImages.length > 0) {
            const mappedPreviews = existingImages
                .filter((img) => {
                    const imgId = typeof img === 'object' && img ? img.id : null;
                    return !imgId || !deleteImageIds.includes(imgId);
                })
                .map((img, idx) => {
                    if (typeof img === 'string') {
                        return {
                            id: `existing_${idx}`,
                            url: img,
                            name: `Vehicle image ${idx + 1}`,
                            isExisting: true,
                        };
                    }
                    return {
                        id: img?.id || `existing_${idx}`,
                        url: img?.image_url || img?.url || img?.file_url || img?.file || '',
                        name: img?.file_name || img?.name || `Vehicle image ${img?.id || idx + 1}`,
                        isExisting: true,
                    };
                })
                .filter((p) => Boolean(p.url));

            if (mappedPreviews.length > 0) {
                setPhotoPreviews((prev) => {
                    const newlySelected = prev.filter((p) => !p.isExisting);
                    const newlySelectedUrls = new Set(newlySelected.map((p) => p.url));
                    const serverPreviews = mappedPreviews.filter((p) => !newlySelectedUrls.has(p.url));
                    return [...serverPreviews, ...newlySelected];
                });
            }
        }
    }, [existingImages, deleteImageIds]);

    // Stable initial values mapped from API response, progress data, and props
    const initialValues = useMemo(() => {
        const vd = vanProgressData?.vehicle_details || vanProgressData?.data?.vehicle_details || {};
        const pvd = vanProgressData?.van || vanProgressData?.data?.van || {};
        const svd = vanStep1Data?.vehicle_details || vanStep1Data?.data?.vehicle_details || {};
        const hasExistingImages = existingImages && Array.isArray(existingImages) && existingImages.length > 0;
        return {
            van_id: activeVanId || '',
            van_name: initialData?.van_name || vanStep1Data?.van_name || vd?.van_name || pvd?.van_name || svd?.van_name || '',
            vin: initialData?.vin || initialData?.vin_number || vanStep1Data?.vin || vanStep1Data?.vin_number || vd?.vin_number || vd?.vin || pvd?.vin_number || pvd?.vin || svd?.vin_number || svd?.vin || '',
            make: initialData?.make || vanStep1Data?.make || vd?.make || pvd?.make || svd?.make || '',
            model: initialData?.model || vanStep1Data?.model || vd?.model || pvd?.model || svd?.model || '',
            manufacture_year: initialData?.manufacture_year || initialData?.year || vanStep1Data?.manufacture_year || vanStep1Data?.year || vd?.year || vd?.manufacture_year || pvd?.year || pvd?.manufacture_year || svd?.year || svd?.manufacture_year || '',
            registration_number: initialData?.registration_number || vanStep1Data?.registration_number || vd?.registration_number || pvd?.registration_number || svd?.registration_number || '',
            engine: initialData?.engine || initialData?.engine_details || vanStep1Data?.engine || vanStep1Data?.engine_details || vd?.engine_details || vd?.engine || pvd?.engine_details || pvd?.engine || svd?.engine_details || svd?.engine || '',
            chassis_number: initialData?.chassis_number || vanStep1Data?.chassis_number || vd?.chassis_number || pvd?.chassis_number || svd?.chassis_number || '',
            color: initialData?.color || initialData?.vehicle_colour || vanStep1Data?.color || vanStep1Data?.vehicle_colour || vd?.vehicle_colour || vd?.color || pvd?.vehicle_colour || pvd?.color || svd?.vehicle_colour || svd?.color || '',
            vehicle_photos: hasExistingImages ? ['existing_photo'] : [],
        };
    }, [
        activeVanId,
        initialData,
        vanStep1Data,
        vanProgressData,
        existingImages,
    ]);

    const handleFiles = (files, setFieldValue, setFieldTouched, setFieldError) => {
        const fileList = Array.from(files);
        if (fileList.length === 0) return;

        const updatedFiles = [...selectedFiles, ...fileList];
        setSelectedFiles(updatedFiles);

        const newPreviews = fileList.map((file) => ({
            id: null,
            file: file,
            name: file.name,
            url: URL.createObjectURL(file),
            isExisting: false,
        }));
        const updatedPreviews = [...photoPreviews, ...newPreviews];
        setPhotoPreviews(updatedPreviews);

        const photoValue = updatedPreviews.length > 0
            ? (updatedFiles.length > 0 ? updatedFiles : ['existing_photo'])
            : [];

        if (typeof setFieldValue === 'function') {
            setFieldValue('vehicle_photos', photoValue, false);
        }
        if (typeof setFieldError === 'function') {
            setFieldError('vehicle_photos', undefined);
        }
        if (typeof setFieldTouched === 'function') {
            setFieldTouched('vehicle_photos', false, false);
        }
    };

    const handleRemovePhoto = (index, setFieldValue, setFieldTouched, setFieldError) => {
        const itemToRemove = photoPreviews[index];
        if (!itemToRemove) return;

        // If removing an existing image from server, track its ID in deleteImageIds
        if (itemToRemove.isExisting && itemToRemove.id) {
            setDeleteImageIds((prev) => {
                if (!prev.includes(itemToRemove.id)) {
                    return [...prev, itemToRemove.id];
                }
                return prev;
            });
        }

        let updatedSelectedFiles = selectedFiles;
        if (itemToRemove.file) {
            updatedSelectedFiles = selectedFiles.filter((f) => f !== itemToRemove.file);
            setSelectedFiles(updatedSelectedFiles);
        }

        if (itemToRemove.url && !itemToRemove.isExisting) {
            URL.revokeObjectURL(itemToRemove.url);
        }

        const updatedPreviews = photoPreviews.filter((_, i) => i !== index);
        setPhotoPreviews(updatedPreviews);

        const photoValue = updatedPreviews.length > 0
            ? (updatedSelectedFiles.length > 0 ? updatedSelectedFiles : ['existing_photo'])
            : [];

        if (typeof setFieldValue === 'function') {
            setFieldValue('vehicle_photos', photoValue, false);
        }

        if (photoValue.length === 0) {
            if (typeof setFieldTouched === 'function') {
                setFieldTouched('vehicle_photos', true, true);
            }
        } else {
            if (typeof setFieldError === 'function') {
                setFieldError('vehicle_photos', undefined);
            }
            if (typeof setFieldTouched === 'function') {
                setFieldTouched('vehicle_photos', false, false);
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleSubmitForm = (values) => {
        const formData = new FormData();
        if (activeVanId) {
            formData.append('van_id', activeVanId);
        }
        formData.append('van_name', values.van_name.trim());
        formData.append('vin', values.vin.trim());
        formData.append('make', values.make.trim());
        formData.append('model', values.model.trim());
        formData.append('manufacture_year', values.manufacture_year.toString().trim());
        formData.append('registration_number', values.registration_number.trim());
        formData.append('engine', values.engine.trim());
        formData.append('chassis_number', values.chassis_number.trim());
        formData.append('color', values.color.trim());

        // Append delete_image_ids if any server images were removed
        if (deleteImageIds.length > 0) {
            formData.append('delete_image_ids', JSON.stringify(deleteImageIds));
        }

        if (selectedFiles.length > 0) {
            selectedFiles.forEach((file) => {
                formData.append('vehicle_photos', file);
            });
        }

        const callback = (response) => {
            if (response?.success || response?.status === true || response?.statusCode === 200 || response?.van_id) {
                if (typeof onNext === 'function') {
                    onNext(response?.data || response, values);
                }
            }
        };

        dispatch(
            createVanStep1({
                payload: formData,
                callback,
            })
        );
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={step1VehicleInfoSchema}
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
                setFieldTouched,
                setFieldError,
            }) => {
                const handleDrop = (e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFiles(e.dataTransfer.files, setFieldValue, setFieldTouched, setFieldError);
                    }
                };

                const handleFileInputChange = (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        handleFiles(e.target.files, setFieldValue, setFieldTouched, setFieldError);
                    }
                    e.target.value = '';
                };

                return (
                    <fieldset>
                        <div className="ct_profile_card">
                            <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                                <h2 className="ct_fs_20 ct_fw_600 mb-0">1. Vehicle Information</h2>
                                <div className="step-badge">Step 1 of 7</div>
                            </div>

                            <div className="row">
                                {/* Van Name */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="van_name">
                                            Van Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="van_name"
                                            id="van_name"
                                            className="form-control ct_input"
                                            placeholder="e.g. Summer Breeze"
                                            value={values.van_name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="van_name" />
                                    </div>
                                </div>

                                {/* VIN Number */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="vin">
                                            VIN Number <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="vin"
                                            id="vin"
                                            className="form-control ct_input"
                                            placeholder="17-digit Identifier"
                                            value={values.vin}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="vin" />
                                    </div>
                                </div>

                                {/* Make */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="make">
                                            Make <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="make"
                                            id="make"
                                            className="form-control ct_input"
                                            placeholder="e.g. Maruti suzuki / Jayco"
                                            value={values.make}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="make" />
                                    </div>
                                </div>

                                {/* Model */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="model">
                                            Model <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="model"
                                            id="model"
                                            className="form-control ct_input"
                                            placeholder="e.g. Swift Dezire / Journey"
                                            value={values.model}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="model" />
                                    </div>
                                </div>

                                {/* Year */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="manufacture_year">
                                            Year <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="manufacture_year"
                                            id="manufacture_year"
                                            className="form-control ct_input"
                                            placeholder="2024"
                                            value={values.manufacture_year}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="manufacture_year" />
                                    </div>
                                </div>

                                {/* Registration Number */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="registration_number">
                                            Registration Number <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="registration_number"
                                            id="registration_number"
                                            className="form-control ct_input"
                                            placeholder="e.g. MP09MH7711"
                                            value={values.registration_number}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="registration_number" />
                                    </div>
                                </div>

                                {/* Engine Details */}
                                <div className="col-lg-12">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="engine">
                                            Engine Details <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            name="engine"
                                            id="engine"
                                            className="form-control ct_custom_textarea"
                                            rows="3"
                                            placeholder="e.g. 5.8L Petrol / 3.0L V6 Turbo Diesel, 140kW"
                                            value={values.engine}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        ></textarea>
                                        <ErrorMessage errors={errors} touched={touched} fieldName="engine" />
                                    </div>
                                </div>

                                {/* Chassis Number */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="chassis_number">
                                            Chassis Number <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="chassis_number"
                                            id="chassis_number"
                                            className="form-control ct_input"
                                            placeholder="Enter Chassis #"
                                            value={values.chassis_number}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="chassis_number" />
                                    </div>
                                </div>

                                {/* Vehicle Colour */}
                                <div className="col-sm-6">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label" htmlFor="color">
                                            Vehicle Colour <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="color"
                                            id="color"
                                            className="form-control ct_input"
                                            placeholder="e.g. Semi Black / Polar White"
                                            value={values.color}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage errors={errors} touched={touched} fieldName="color" />
                                    </div>
                                </div>

                                {/* Vehicle Photos */}
                                <div className="col-lg-12">
                                    <div className="form-group mb-4 text-start">
                                        <label className="mb-2 ct_label">
                                            Vehicle Photos <span className="text-danger">*</span>
                                        </label>
                                        <div
                                            className={`upload-box text-center ${isDragging ? 'border-primary' : ''}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            style={{ borderStyle: isDragging ? 'dashed' : undefined }}
                                        >
                                            <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z" fill="#475569" />
                                            </svg>
                                            <div>
                                                <label htmlFor="vehiclePhotosInput" className="text-muted upload-label ct_fs_16 ct_color_grey mt-2" style={{ cursor: 'pointer' }}>
                                                    <span className="ct_fw_700 ct_green_text">Click to upload</span> <span className="ct_fw_400">or drag and drop</span><br />
                                                    <span className="ct_fs_12 ct_fw_600"> PNG, JPG, or WEBP</span>
                                                </label>
                                            </div>
                                            <input
                                                type="file"
                                                id="vehiclePhotosInput"
                                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                                multiple
                                                hidden
                                                onChange={handleFileInputChange}
                                            />
                                        </div>
                                        <div className="mt-1">
                                            <ErrorMessage errors={errors} touched={touched} fieldName="vehicle_photos" />
                                        </div>

                                        {/* Preview uploaded photos */}
                                        {photoPreviews.length > 0 && (
                                            <div className="upload-imgs ct_custom_scroll mt-3 d-flex flex-wrap gap-2">
                                                {photoPreviews.map((preview, index) => (
                                                    <div className="img-item position-relative" key={index}>
                                                        <img
                                                            src={preview.url}
                                                            alt={preview.name || `Vehicle preview ${index + 1}`}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => {
                                                                if (preview.url) window.open(preview.url, '_blank');
                                                            }}
                                                            title="Click to view full image in new tab"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="img-remove"
                                                            onClick={() => handleRemovePhoto(index, setFieldValue, setFieldTouched, setFieldError)}
                                                            title="Remove photo"
                                                        >
                                                            <i className="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                            <Link to={pageRoutes.vans} className="action-button-previous ct_w_100_575 text-center text-decoration-none">
                                Cancel
                            </Link>
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
                );
            }}
        </Formik>
    );
};

export default Step1VehicleInfo;
