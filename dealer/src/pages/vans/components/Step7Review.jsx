import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getVanReview, publishVan } from '../../../redux/slices/vanSlice';
import { pipClearVanDraft } from '../../../utils/pip';

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-AU', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

const formatDocType = (docType) => {
    if (!docType) return 'Document';
    return docType
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const Step7Review = ({ onPrev, vanId, modalTargetId = "#successModal", onComplete }) => {
    const dispatch = useDispatch();
    const {
        vanId: reduxVanId,
        vanReviewData,
        isReviewLoading = false,
        isPublishing = false,
    } = useSelector((state) => state?.vanReducer || {});

    const activeVanId = vanId || reduxVanId;

    useEffect(() => {
        if (activeVanId) {
            dispatch(getVanReview({ vanId: activeVanId }));
        }
    }, [dispatch, activeVanId]);

    const reviewData = vanReviewData || {};
    const van = reviewData?.van || {};
    const images = Array.isArray(reviewData?.images) ? reviewData.images : [];
    const owner = reviewData?.owner || {};
    const components = Array.isArray(reviewData?.components) ? reviewData.components : [];
    const warranty = reviewData?.warranty || {};
    const documents = Array.isArray(reviewData?.documents) ? reviewData.documents : [];
    const maintenance = reviewData?.maintenance || {};

    const mainImageUrl = images.length > 0 && images[0]?.image_url ? images[0].image_url : null;

    const handleCreateProfile = () => {
        if (!activeVanId) {
            toast.error('Van ID not found. Please complete the previous steps.');
            return;
        }

        dispatch(
            publishVan({
                vanId: activeVanId,
                callback: (response) => {
                    if (response?.success || response?.status === true || response?.statusCode === 200) {
                        pipClearVanDraft();
                        const targetId = modalTargetId.replace('#', '');
                        const modalEl = document.getElementById(targetId);
                        if (modalEl && window.bootstrap?.Modal) {
                            const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
                            modalInstance.show();
                        } else {
                            document.getElementById('hiddenSuccessModalTrigger')?.click();
                        }
                    }
                },
            })
        );
    };

    return (
        <fieldset>
            <div className="ct_profile_card text-start">
                <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                    <h2 className="ct_fs_20 ct_fw_600 mb-0">7. Review & Create</h2>
                    <div className="step-badge">Step 7 of 7</div>
                </div>

                {isReviewLoading && !vanReviewData ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading review details...</span>
                        </div>
                        <p className="text-muted ct_fs_14 mt-3">Loading van review details...</p>
                    </div>
                ) : (
                    <>
                        {/* 1. Vehicle Information Section */}
                        <section className="ct_profile_card">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="ct_van_det_icon_box">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.25 3.75L7.84625 6.1625C7.89653 6.36586 8.01346 6.54652 8.1784 6.67566C8.34333 6.8048 8.54677 6.87498 8.75625 6.875H12.25" stroke="#3D8B37" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 3.75H7.91812C8.88625 3.75 9.37 3.75 9.78062 3.96625C10.1906 4.1825 10.4644 4.58187 11.0119 5.38C11.395 5.94 11.7981 6.34625 12.3644 6.70812C12.9344 7.07187 13.2056 7.25 13.3556 7.53563C13.5 7.80875 13.5 8.1325 13.5 8.78062C13.5 9.635 13.5 10.0619 13.2419 10.3331L13.2081 10.3669C12.9375 10.625 12.51 10.625 11.6562 10.625M2.875 10.625C2.675 10.625 2.49062 10.625 2.39375 10.6044C2.29625 10.5831 2.205 10.5419 2.02187 10.46L1 10C1 8.00375 1.29937 6.85125 1.69125 5.90625C1.9475 5.28625 2.07625 4.97625 2.0225 4.7C1.97062 4.425 1.3125 3.75 1.3125 3.75M5.375 10.625H9.125" stroke="#3D8B37" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10.375 11.875C11.0654 11.875 11.625 11.3154 11.625 10.625C11.625 9.93464 11.0654 9.375 10.375 9.375C9.68464 9.375 9.125 9.93464 9.125 10.625C9.125 11.3154 9.68464 11.875 10.375 11.875Z" stroke="#3D8B37" strokeWidth="0.7" />
                                        <path d="M4.125 11.875C4.81536 11.875 5.375 11.3154 5.375 10.625C5.375 9.93464 4.81536 9.375 4.125 9.375C3.43464 9.375 2.875 9.93464 2.875 10.625C2.875 11.3154 3.43464 11.875 4.125 11.875Z" stroke="#3D8B37" strokeWidth="0.7" />
                                    </svg>
                                </div>
                                <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">Vehicle Information</h5>
                            </div>

                            <div className="row">
                                <div className="col-xl-2 col-md-3 mb-3">
                                    {mainImageUrl ? (
                                        <img
                                            src={mainImageUrl}
                                            className="img-fluid ct_vehicle_img rounded-3"
                                            alt={van?.van_name || 'Vehicle'}
                                            style={{ cursor: 'pointer', objectFit: 'cover', width: '100%', height: '140px' }}
                                            onClick={() => window.open(mainImageUrl, '_blank')}
                                            title="Click to view full image in new tab"
                                        />
                                    ) : (
                                        <div
                                            className="bg-light rounded-3 d-flex flex-column align-items-center justify-content-center text-muted border"
                                            style={{ height: '140px' }}
                                        >
                                            <i className="fa-solid fa-van-shuttle fs-2 mb-1"></i>
                                            <span className="ct_fs_12">No Photo</span>
                                        </div>
                                    )}
                                </div>

                                <div className="col-xl-10 col-md-9">
                                    <div className="row gy-3">
                                        <div className="col-lg-3 col-sm-6">
                                            <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">Van Name</h5>
                                            <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{van?.van_name || 'N/A'}</h6>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">Make</h5>
                                            <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{van?.make || 'N/A'}</h6>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">Model</h5>
                                            <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{van?.model || 'N/A'}</h6>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">VIN</h5>
                                            <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{van?.vin || 'N/A'}</h6>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">Registration</h5>
                                            <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{van?.registration_number || 'N/A'}</h6>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">Engine</h5>
                                            <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{van?.engine || 'N/A'}</h6>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">Year</h5>
                                            <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{van?.manufacture_year || 'N/A'}</h6>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">Chassis Number</h5>
                                            <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{van?.chassis_number || 'N/A'}</h6>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">Colour</h5>
                                            <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{van?.color || 'N/A'}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Photos List */}
                            {images.length > 1 && (
                                <div className="mt-4 pt-3 border-top">
                                    <h6 className="ct_fs_13 ct_fw_600 ct_para_clr mb-2">ALL VEHICLE PHOTOS ({images.length})</h6>
                                    <div className="upload-imgs ct_custom_scroll d-flex flex-wrap gap-2">
                                        {images.map((img, idx) => (
                                            <div className="img-item position-relative" key={img.id || idx}>
                                                <img
                                                    src={img.image_url}
                                                    alt={`Van Photo ${idx + 1}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => window.open(img.image_url, '_blank')}
                                                    title="Click to view full image in new tab"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* 2. Owner Details Section */}
                        <section className="ct_profile_card ct_mt_30">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="ct_van_det_icon_box">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.375 6.875C8.68464 6.875 8.125 6.31536 8.125 5.625C8.125 4.93464 8.68464 4.375 9.375 4.375C10.0654 4.375 10.625 4.93464 10.625 5.625C10.625 6.31536 10.0654 6.875 9.375 6.875Z" stroke="#3D8B37" strokeWidth="0.7" />
                                        <path d="M6.875 9.375C6.875 10.0656 6.875 10.625 9.375 10.625C11.875 10.625 11.875 10.0656 11.875 9.375C11.875 8.68437 10.7563 8.125 9.375 8.125C7.99375 8.125 6.875 8.68437 6.875 9.375Z" stroke="#3D8B37" strokeWidth="0.7" />
                                        <path d="M1.25 7.5C1.25 9.85687 1.25 11.0356 1.9825 11.7675C2.715 12.4994 3.89312 12.5 6.25 12.5H8.75C11.1069 12.5 12.2856 12.5 13.0175 11.7675C13.7494 11.035 13.75 9.85687 13.75 7.5C13.75 5.14313 13.75 3.96437 13.0175 3.2325C12.285 2.50062 11.1069 2.5 8.75 2.5H6.25C3.89312 2.5 2.71437 2.5 1.9825 3.2325C1.68875 3.52625 1.51312 3.89125 1.4075 4.375M3.125 7.5H5.625M3.125 5.625H6.25M3.125 9.375H5" stroke="#3D8B37" strokeWidth="0.7" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h5 className="ct_green_text ct_fw_600 ct_fs_16 mb-0">Owner Details</h5>
                            </div>

                            <div className="row gy-3">
                                <div className="col-md-4 col-sm-6">
                                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">Full Name</h6>
                                    <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">{owner?.full_name || 'N/A'}</h5>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">Email Address</h6>
                                    <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">{owner?.email || 'N/A'}</h5>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">Phone Number</h6>
                                    <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">
                                        {owner?.mobile_number
                                            ? `${owner?.mobile_country_code || ''} ${owner.mobile_number}`
                                            : 'N/A'}
                                    </h5>
                                </div>
                            </div>
                        </section>

                        {/* 3. Installed Components Section */}
                        <section className="ct_profile_card ct_mt_30">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="ct_van_det_icon_box">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.36364 15V12.1364C0.965909 12 0.639205 11.7585 0.383523 11.4119C0.127841 11.0653 0 10.6705 0 10.2273V3.40909H1.36364V0.681818C1.36364 0.488636 1.42898 0.326705 1.55966 0.196023C1.69034 0.0653409 1.85227 0 2.04545 0C2.23864 0 2.40057 0.0653409 2.53125 0.196023C2.66193 0.326705 2.72727 0.488636 2.72727 0.681818V3.40909H4.09091V10.2273C4.09091 10.6705 3.96307 11.0653 3.70739 11.4119C3.4517 11.7585 3.125 12 2.72727 12.1364V15H1.36364ZM6.81818 15V12.1364C6.42045 12 6.09375 11.7585 5.83807 11.4119C5.58239 11.0653 5.45455 10.6705 5.45455 10.2273V3.40909H6.81818V0.681818C6.81818 0.488636 6.88352 0.326705 7.0142 0.196023C7.14489 0.0653409 7.30682 0 7.5 0C7.69318 0 7.85511 0.0653409 7.9858 0.196023C8.11648 0.326705 8.18182 0.488636 8.18182 0.681818V3.40909H9.54545V10.2273C9.54545 10.6705 9.41761 11.0653 9.16193 11.4119C8.90625 11.7585 8.57955 12 8.18182 12.1364V15H6.81818ZM12.2727 15V12.1364C11.875 12 11.5483 11.7585 11.2926 11.4119C11.0369 11.0653 10.9091 10.6705 10.9091 10.2273V3.40909H12.2727V0.681818C12.2727 0.488636 12.3381 0.326705 12.4688 0.196023C12.5994 0.0653409 12.7614 0 12.9545 0C13.1477 0 13.3097 0.0653409 13.4403 0.196023C13.571 0.326705 13.6364 0.488636 13.6364 0.681818V3.40909H15V10.2273C15 10.6705 14.8722 11.0653 14.6165 11.4119C14.3608 11.7585 14.0341 12 13.6364 12.1364V15H12.2727ZM1.36364 4.77273V7.5H2.72727V4.77273H1.36364ZM6.81818 4.77273V7.5H8.18182V4.77273H6.81818ZM12.2727 4.77273V7.5H13.6364V4.77273H12.2727ZM2.04545 10.9091C2.23864 10.9091 2.40057 10.8438 2.53125 10.7131C2.66193 10.5824 2.72727 10.4205 2.72727 10.2273V8.86364H1.36364V10.2273C1.36364 10.4205 1.42898 10.5824 1.55966 10.7131C1.69034 10.8438 1.85227 10.9091 2.04545 10.9091ZM7.5 10.9091C7.69318 10.9091 7.85511 10.8438 7.9858 10.7131C8.11648 10.5824 8.18182 10.4205 8.18182 10.2273V8.86364H6.81818V10.2273C6.81818 10.4205 6.88352 10.5824 7.0142 10.7131C7.14489 10.8438 7.30682 10.9091 7.5 10.9091ZM12.9545 10.9091C13.1477 10.9091 13.3097 10.8438 13.4403 10.7131C13.571 10.5824 13.6364 10.4205 13.6364 10.2273V8.86364H12.2727V10.2273C12.2727 10.4205 12.3381 10.5824 12.4688 10.7131C12.5994 10.8438 12.7614 10.9091 12.9545 10.9091Z" fill="#3D8B37" />
                                    </svg>
                                </div>
                                <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">Installed Components ({components.length})</h5>
                            </div>

                            {components.length === 0 ? (
                                <p className="text-muted mb-0 ct_fs_14">No components installed.</p>
                            ) : (
                                <div className="row g-3">
                                    {components.map((comp, idx) => {
                                        const compFile = (comp.files && comp.files.length > 0) ? comp.files[0] : null;
                                        const fileUrl = compFile?.file_url;
                                        const isImg = fileUrl && (/\.(png|jpe?g|webp)$/i.test(fileUrl) || (compFile?.mime_type && compFile.mime_type.startsWith('image/')));

                                        return (
                                            <div className="col-lg-6" key={comp.id || idx}>
                                                <div className="p-3 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between">
                                                    <div>
                                                        <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                                                            <div className="ct_fs_16 ct_fw_600 ct_head_clr">
                                                                {comp.component_name || comp.component_type_name}
                                                            </div>
                                                            <span className="badge bg-success-subtle text-success px-2 py-1 rounded-pill ct_fs_12 ct_fw_500">
                                                                {comp.warranty_period_months ? `${comp.warranty_period_months} Mo. Warranty` : 'Active'}
                                                            </span>
                                                        </div>
                                                        <div className="row g-2 ct_fs_13 ct_para_clr mb-2">
                                                            <div className="col-sm-6">
                                                                <span className="ct_fw_600">Manufacturer: </span>
                                                                <span className="text-dark">{comp.manufacturer || 'N/A'}</span>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <span className="ct_fw_600">Installed: </span>
                                                                <span className="text-dark">{formatDate(comp.installation_date)}</span>
                                                            </div>
                                                            {comp.replacement_schedule && (
                                                                <div className="col-sm-12">
                                                                    <span className="ct_fw_600">Replacement Schedule: </span>
                                                                    <span className="text-dark">{formatDate(comp.replacement_schedule)}</span>
                                                                </div>
                                                            )}
                                                            {comp.maintenance_notes && (
                                                                <div className="col-sm-12">
                                                                    <span className="ct_fw_600">Notes: </span>
                                                                    <span className="text-dark">{comp.maintenance_notes}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {fileUrl && (
                                                        <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center gap-2">
                                                                {isImg ? (
                                                                    <img
                                                                        src={fileUrl}
                                                                        alt="comp file"
                                                                        style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                                                                        onClick={() => window.open(fileUrl, '_blank')}
                                                                        title="Click to view file"
                                                                    />
                                                                ) : (
                                                                    <i className="fa-solid fa-file-pdf text-danger fs-4"></i>
                                                                )}
                                                                <span className="ct_fs_12 text-truncate" style={{ maxWidth: '180px' }}>
                                                                    {compFile?.file_name || 'Component File'}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-success border-0 ct_fs_12"
                                                                onClick={() => window.open(fileUrl, '_blank')}
                                                            >
                                                                View File <i className="fa-solid fa-arrow-up-right-from-square ms-1"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* 4. Warranty Details Section */}
                        <section className="ct_profile_card ct_mt_30">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="ct_van_det_icon_box">
                                    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.64687 10.1625L10.2375 5.925L9.07969 4.85625L5.64687 8.025L3.94062 6.45L2.78281 7.51875L5.64687 10.1625ZM6.5 15C4.61771 14.5625 3.0638 13.5656 1.83828 12.0094C0.61276 10.4531 0 8.725 0 6.825V2.25L6.5 0L13 2.25V6.825C13 8.725 12.3872 10.4531 11.1617 12.0094C9.9362 13.5656 8.38229 14.5625 6.5 15ZM6.5 13.425C7.90833 13.0125 9.07292 12.1875 9.99375 10.95C10.9146 9.7125 11.375 8.3375 11.375 6.825V3.28125L6.5 1.59375L1.625 3.28125V6.825C1.625 8.3375 2.08542 9.7125 3.00625 10.95C3.92708 12.1875 5.09167 13.0125 6.5 13.425Z" fill="#3D8B37" />
                                    </svg>
                                </div>
                                <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">Warranty Details</h5>
                            </div>

                            <div className="row align-items-start gy-3">
                                <div className="col-xl-9">
                                    <div className="row gy-3">
                                        <div className="col-md-3 col-sm-6">
                                            <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">Provider</h6>
                                            <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">{warranty?.provider || 'N/A'}</h5>
                                        </div>
                                        <div className="col-md-3 col-sm-6">
                                            <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">Coverage Type</h6>
                                            <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">{warranty?.coverage_type || 'N/A'}</h5>
                                        </div>
                                        <div className="col-md-3 col-sm-6">
                                            <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">Start Date</h6>
                                            <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">{formatDate(warranty?.start_date)}</h5>
                                        </div>
                                        <div className="col-md-3 col-sm-6">
                                            <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr text-uppercase">Expiry Date</h6>
                                            <h5 className="ct_fs_16 ct_fw_500 mb-0 ct_head_clr">{formatDate(warranty?.expiry_date)}</h5>
                                        </div>
                                    </div>

                                    <h6 className="ct_green_text ct_fs_15 ct_fw_600 mt-4 mb-3">Claim Information</h6>
                                    <div className="row gy-3">
                                        <div className="col-sm-6">
                                            <div className="ct_claim_info_box">
                                                <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">CLAIM EMAIL</h6>
                                                <h5 className="ct_fs_15 ct_fw_600 mb-0 ct_head_clr">{warranty?.claim_email || 'N/A'}</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="ct_claim_info_box">
                                                <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">CLAIM PHONE</h6>
                                                <h5 className="ct_fs_15 ct_fw_600 mb-0 ct_head_clr">{warranty?.claim_phone || 'N/A'}</h5>
                                            </div>
                                        </div>
                                    </div>

                                    {warranty?.claim_instructions && (
                                        <div className="mt-3">
                                            <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">Claim Instructions</h6>
                                            <p className="ct_fs_14 ct_head_clr mb-0">{warranty.claim_instructions}</p>
                                        </div>
                                    )}
                                </div>

                                {warranty?.document_url && (
                                    <div className="col-xl-3">
                                        <div
                                            className="ct_doc_custom_box cursor-pointer"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => window.open(warranty.document_url, '_blank')}
                                            title="Click to view warranty document"
                                        >
                                            <svg className="me-2" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.4375 11.918C14.4375 11.7356 14.3651 11.5608 14.2361 11.4318C14.1072 11.3029 13.9323 11.2305 13.75 11.2305H8.25C8.06766 11.2305 7.8928 11.3029 7.76386 11.4318C7.63493 11.5608 7.5625 11.7356 7.5625 11.918C7.5625 12.1003 7.63493 12.2752 7.76386 12.4041C7.8928 12.533 8.06766 12.6055 8.25 12.6055H13.75C13.9323 12.6055 14.1072 12.533 14.2361 12.4041C14.3651 12.2752 14.4375 12.1003 14.4375 11.918ZM14.4375 15.5846C14.4375 15.4023 14.3651 15.2274 14.2361 15.0985C14.1072 14.9696 13.9323 14.8971 13.75 14.8971H8.25C8.06766 14.8971 7.8928 14.9696 7.76386 15.0985C7.63493 15.2274 7.5625 15.4023 7.5625 15.5846C7.5625 15.767 7.63493 15.9418 7.76386 16.0708C7.8928 16.1997 8.06766 16.2721 8.25 16.2721H13.75C13.9323 16.2721 14.1072 16.1997 14.2361 16.0708C14.3651 15.9418 14.4375 15.767 14.4375 15.5846Z" fill="#2563EB" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M6.41634 2.0625C5.74777 2.0625 5.10659 2.32809 4.63384 2.80084C4.16109 3.27358 3.89551 3.91477 3.89551 4.58333V17.4167C3.89551 18.0852 4.16109 18.7264 4.63384 19.1992C5.10659 19.6719 5.74777 19.9375 6.41634 19.9375H15.583C16.2516 19.9375 16.8928 19.6719 17.3655 19.1992C17.8383 18.7264 18.1038 18.0852 18.1038 17.4167V7.304C18.1038 6.95475 17.9902 6.61558 17.7793 6.33692L15.0312 2.69958C14.8816 2.50169 14.6883 2.34117 14.4662 2.23062C14.2442 2.12008 13.9995 2.06253 13.7515 2.0625H6.41634ZM5.27051 4.58333C5.27051 3.95083 5.78384 3.4375 6.41634 3.4375H13.0622V7.46808C13.0622 7.84758 13.3702 8.15558 13.7497 8.15558H16.7288V17.4167C16.7288 18.0492 16.2155 18.5625 15.583 18.5625H6.41634C5.78384 18.5625 5.27051 18.0492 5.27051 17.4167V4.58333Z" fill="#2563EB" />
                                            </svg>
                                            <span>Warranty Document <i className="fa-solid fa-arrow-up-right-from-square ms-1 ct_fs_11"></i></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 5. Uploaded Documents Section */}
                        <section className="ct_profile_card ct_mt_30">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="ct_van_det_icon_box">
                                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.39535 11C1.01163 11 0.68314 10.8654 0.409884 10.5961C0.136628 10.3268 0 10.0031 0 9.625V1.375C0 0.996875 0.136628 0.673177 0.409884 0.403906C0.68314 0.134635 1.01163 0 1.39535 0H5.5814L6.97674 1.375H12.5581C12.9419 1.375 13.2703 1.50964 13.5436 1.77891C13.8169 2.04818 13.9535 2.37188 13.9535 2.75H6.40116L5.00581 1.375H1.39535V9.625L3.06977 4.125H15L13.2035 10.0203C13.1105 10.3182 12.939 10.556 12.689 10.7336C12.439 10.9112 12.1628 11 11.8605 11H1.39535ZM2.86047 9.625H11.8605L13.1163 5.5H4.11628L2.86047 9.625Z" fill="#3D8B37" />
                                    </svg>
                                </div>
                                <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">Documents ({documents.length})</h5>
                            </div>

                            {documents.length === 0 ? (
                                <p className="text-muted mb-0 ct_fs_14">No documents uploaded.</p>
                            ) : (
                                <div className="d-flex gap-3 flex-wrap">
                                    {documents.map((doc, idx) => (
                                        <div
                                            key={doc.id || idx}
                                            className="ct_doc_custom_box d-flex align-items-center justify-content-between p-2 px-3 border rounded-3 bg-white"
                                            style={{ cursor: 'pointer', minWidth: '220px' }}
                                            onClick={() => doc.file_url && window.open(doc.file_url, '_blank')}
                                            title={`Click to view ${doc.file_name || formatDocType(doc.document_type)}`}
                                        >
                                            <div className="d-flex align-items-center gap-2 text-truncate">
                                                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M14.4375 11.918C14.4375 11.7356 14.3651 11.5608 14.2361 11.4318C14.1072 11.3029 13.9323 11.2305 13.75 11.2305H8.25C8.06766 11.2305 7.8928 11.3029 7.76386 11.4318C7.63493 11.5608 7.5625 11.7356 7.5625 11.918C7.5625 12.1003 7.63493 12.2752 7.76386 12.4041C7.8928 12.533 8.06766 12.6055 8.25 12.6055H13.75C13.9323 12.6055 14.1072 12.533 14.2361 12.4041C14.3651 12.2752 14.4375 12.1003 14.4375 11.918ZM14.4375 15.5846C14.4375 15.4023 14.3651 15.2274 14.2361 15.0985C14.1072 14.9696 13.9323 14.8971 13.75 14.8971H8.25C8.06766 14.8971 7.8928 14.9696 7.76386 15.0985C7.63493 15.2274 7.5625 15.4023 7.5625 15.5846C7.5625 15.767 7.63493 15.9418 7.76386 16.0708C7.8928 16.1997 8.06766 16.2721 8.25 16.2721H13.75C13.9323 16.2721 14.1072 16.1997 14.2361 16.0708C14.3651 15.9418 14.4375 15.767 14.4375 15.5846Z" fill="#2563EB" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.41634 2.0625C5.74777 2.0625 5.10659 2.32809 4.63384 2.80084C4.16109 3.27358 3.89551 3.91477 3.89551 4.58333V17.4167C3.89551 18.0852 4.16109 18.7264 4.63384 19.1992C5.10659 19.6719 5.74777 19.9375 6.41634 19.9375H15.583C16.2516 19.9375 16.8928 19.6719 17.3655 19.1992C17.8383 18.7264 18.1038 18.0852 18.1038 17.4167V7.304C18.1038 6.95475 17.9902 6.61558 17.7793 6.33692L15.0312 2.69958C14.8816 2.50169 14.6883 2.34117 14.4662 2.23062C14.2442 2.12008 13.9995 2.06253 13.7515 2.0625H6.41634ZM5.27051 4.58333C5.27051 3.95083 5.78384 3.4375 6.41634 3.4375H13.0622V7.46808C13.0622 7.84758 13.3702 8.15558 13.7497 8.15558H16.7288V17.4167C16.7288 18.0492 16.2155 18.5625 15.583 18.5625H6.41634C5.78384 18.5625 5.27051 18.0492 5.27051 17.4167V4.58333Z" fill="#2563EB" />
                                                </svg>
                                                <div className="text-truncate">
                                                    <div className="ct_fs_13 ct_fw_600 text-dark text-truncate">
                                                        {formatDocType(doc.document_type)}
                                                    </div>
                                                    <div className="ct_fs_11 text-muted text-truncate">
                                                        {doc.file_name}
                                                    </div>
                                                </div>
                                            </div>
                                            <i className="fa-solid fa-arrow-up-right-from-square text-muted ms-2 ct_fs_11"></i>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* 6. Maintenance Setup Section */}
                        <section className="ct_profile_card ct_mt_30">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="ct_van_det_icon_box">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.125 11.175L11.175 10.125C11.25 10.05 11.2875 9.9625 11.2875 9.8625C11.2875 9.7625 11.25 9.675 11.175 9.6L8.625 7.03125C8.675 6.89375 8.7125 6.75625 8.7375 6.61875C8.7625 6.48125 8.775 6.325 8.775 6.15C8.775 5.4375 8.52188 4.82812 8.01562 4.32187C7.50938 3.81562 6.9 3.5625 6.1875 3.5625C5.975 3.5625 5.7625 3.59063 5.55 3.64688C5.3375 3.70313 5.13125 3.78125 4.93125 3.88125L6.69375 5.64375L5.64375 6.69375L3.88125 4.93125C3.78125 5.13125 3.70313 5.3375 3.64688 5.55C3.59063 5.7625 3.5625 5.975 3.5625 6.1875C3.5625 6.9 3.81562 7.50938 4.32187 8.01562C4.82812 8.52188 5.4375 8.775 6.15 8.775C6.3125 8.775 6.46562 8.7625 6.60938 8.7375C6.75313 8.7125 6.89375 8.675 7.03125 8.625L9.6 11.175C9.675 11.25 9.7625 11.2875 9.8625 11.2875C9.9625 11.2875 10.05 11.25 10.125 11.175ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4813 2.19375 12.8063C1.51875 12.1313 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1313 1.51875 12.8063 2.19375C13.4813 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4813 12.1313 12.8063 12.8063C12.1313 13.4813 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15ZM7.5 13.5C9.175 13.5 10.5938 12.9187 11.7563 11.7563C12.9187 10.5938 13.5 9.175 13.5 7.5C13.5 5.825 12.9187 4.40625 11.7563 3.24375C10.5938 2.08125 9.175 1.5 7.5 1.5C5.825 1.5 4.40625 2.08125 3.24375 3.24375C2.08125 4.40625 1.5 5.825 1.5 7.5C1.5 9.175 2.08125 10.5938 3.24375 11.7563C4.40625 12.9187 5.825 13.5 7.5 13.5Z" fill="#3D8B37" />
                                    </svg>
                                </div>
                                <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">Maintenance Setup</h5>
                            </div>

                            <div className="row gy-3">
                                <div className="col-xl-3 col-sm-6">
                                    <div className="ct_claim_info_box">
                                        <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">FIRST SERVICE DATE</h6>
                                        <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">{formatDate(maintenance?.first_service_date)}</h5>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6">
                                    <div className="ct_claim_info_box">
                                        <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">SERVICE CENTRE</h6>
                                        <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">{maintenance?.assigned_service_centre || 'N/A'}</h5>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6">
                                    <div className="ct_claim_info_box">
                                        <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">REMINDER SCHEDULE</h6>
                                        <h5 className="ct_fs_16 ct_fw_600 mb-0 ct_head_clr">
                                            {maintenance?.reminder_before_days !== undefined
                                                ? `${maintenance.reminder_before_days} Days Before`
                                                : 'N/A'}
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6">
                                    <div className="ct_claim_info_box">
                                        <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">NOTIFICATIONS</h6>
                                        <h5 className="ct_fs_14 ct_fw_600 mb-0 ct_head_clr">
                                            Push: <span className={maintenance?.notify_push ? 'text-success' : 'text-danger'}>{maintenance?.notify_push ? 'Yes' : 'No'}</span>
                                            {' | '}
                                            Email: <span className={maintenance?.notify_email ? 'text-success' : 'text-danger'}>{maintenance?.notify_email ? 'Yes' : 'No'}</span>
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            {maintenance?.notes && (
                                <div className="mt-4">
                                    <h6 className="mb-1 ct_fs_12 ct_fw_600 ct_para_clr">Internal Notes</h6>
                                    <h5 className="ct_fs_15 ct_fw_400 mb-0 ct_head_clr">{maintenance.notes}</h5>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>

            <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={isPublishing}
                    className="previous action-button-previous ct_w_100_575 border-0"
                >
                    Back
                </button>
                <button
                    type="button"
                    id="createVanProfile"
                    onClick={handleCreateProfile}
                    disabled={isPublishing || isReviewLoading}
                    className="action-button ct_w_100_575 border-0 d-flex align-items-center justify-content-center gap-2"
                    style={{ cursor: isPublishing ? 'not-allowed' : 'pointer', opacity: isPublishing ? 0.7 : 1 }}
                >
                    {isPublishing ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Publishing...</span>
                        </>
                    ) : (
                        'Create Van Profile'
                    )}
                </button>
                <button
                    id="hiddenSuccessModalTrigger"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target={modalTargetId}
                    style={{ display: 'none' }}
                ></button>
            </div>
        </fieldset>
    );
};

export default Step7Review;
