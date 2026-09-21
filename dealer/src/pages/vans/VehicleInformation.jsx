import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import StepProgressBar from './components/StepProgressBar';
import Step1VehicleInfo from './components/Step1VehicleInfo';
import Step2OwnerDetails from './components/Step2OwnerDetails';
import Step3Components from './components/Step3Components';
import Step4Warranty from './components/Step4Warranty';
import Step5Documents from './components/Step5Documents';
import Step6Maintenance from './components/Step6Maintenance';
import Step7Review from './components/Step7Review';
import SuccessModal from './components/SuccessModal';
import { pipClearVanDraft } from '../../utils/pip';
import { getVanProgress, resetVanState } from '../../redux/slices/vanSlice';

const steps = [
    { id: 1, name: "Vehicle Information" },
    { id: 2, name: "Owner Details" },
    { id: 3, name: "Components" },
    { id: 4, name: "Warranty" },
    { id: 5, name: "Documents" },
    { id: 6, name: "Maintenance" },
    { id: 7, name: "Review & Create" }
];

const VehicleInformation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryVanId = searchParams.get('van_id') || searchParams.get('id');

    const { vanProgressData, vanId: reduxVanId } = useSelector((state) => state.vanReducer || {});

    const [step, setStep] = useState(1);
    const [maxStep, setMaxStep] = useState(1);
    const [vanId, setVanId] = useState(queryVanId || null);
    const [ownerId, setOwnerId] = useState(null);
    const [step1Data, setStep1Data] = useState({});
    const [step2Data, setStep2Data] = useState({});
    const [step3Data, setStep3Data] = useState({});
    const [step4Data, setStep4Data] = useState({});
    const [step5Data, setStep5Data] = useState({});
    const [step6Data, setStep6Data] = useState({});

    // Reset when entering "Add New Van" mode (no queryVanId), or fetch progress when queryVanId exists (Edit mode)
    useEffect(() => {
        if (!queryVanId) {
            pipClearVanDraft();
            dispatch(resetVanState());
            setStep(1);
            setMaxStep(1);
            setVanId(null);
            setOwnerId(null);
            setStep1Data({});
            setStep2Data({});
            setStep3Data({});
            setStep4Data({});
            setStep5Data({});
            setStep6Data({});
        } else {
            setVanId(queryVanId);
            dispatch(
                getVanProgress({
                    vanId: queryVanId,
                    callback: (response) => {
                        const data = response?.data || response;
                        if (data && (data?.van_id || data?.vehicle_details || data?.current_step)) {
                            const vd = data?.vehicle_details;
                            const owner = data?.owner;
                            const images = data?.vehicle_images;
                            const comps = data?.components || data?.van_components;
                            const warranty = data?.warranty || data?.warranty_details || data?.van_warranty;

                            if (data?.van_id) {
                                setVanId(data.van_id);
                            }

                            if (vd) {
                                setStep1Data({
                                    van_id: data?.van_id || vd?.van_id,
                                    van_name: vd?.van_name || '',
                                    vin: vd?.vin_number || vd?.vin || '',
                                    make: vd?.make || '',
                                    model: vd?.model || '',
                                    manufacture_year: vd?.year || vd?.manufacture_year || '',
                                    registration_number: vd?.registration_number || '',
                                    engine: vd?.engine_details || vd?.engine || '',
                                    chassis_number: vd?.chassis_number || '',
                                    color: vd?.vehicle_colour || vd?.color || '',
                                    vehicle_images: images || [],
                                });
                            }

                            if (owner) {
                                const oId = owner?.id || vd?.owner_id;
                                setOwnerId(oId);
                                setStep2Data({
                                    owner_id: oId,
                                    owner_name: owner?.full_name || '',
                                    email: owner?.email || '',
                                    phone_number: owner?.mobile_number || '',
                                });
                            }

                            if (comps && Array.isArray(comps) && comps.length > 0) {
                                setStep3Data(comps);
                            }

                            if (warranty) {
                                setStep4Data({
                                    provider: warranty?.provider || warranty?.warranty_provider || '',
                                    coverage_type: warranty?.coverage_type || 'Mechanical',
                                    start_date: warranty?.start_date || '',
                                    expiry_date: warranty?.expiry_date || '',
                                    claim_instructions: warranty?.claim_instructions || '',
                                    claim_email: warranty?.claim_email || '',
                                    claim_phone: warranty?.claim_phone || '',
                                    warranty_document_url: warranty?.warranty_document || warranty?.document_url || null,
                                    file_name: warranty?.file_name || '',
                                });
                            }

                            const docs = data?.documents || data?.van_documents || data?.vehicle_documents || data?.step_5;
                            if (docs) {
                                if (Array.isArray(docs)) {
                                    const docMap = {};
                                    docs.forEach((doc) => {
                                        const type = doc.document_type?.toLowerCase();
                                        if (type && doc.file_url) {
                                            docMap[type] = doc.file_url;
                                        }
                                    });
                                    setStep5Data({
                                        service_book: docMap.service_book || null,
                                        user_manual: docMap.user_manual || null,
                                        registration_certificate: docMap.registration_certificate || null,
                                        insurance_certificate: docMap.insurance_certificate || null,
                                        purchase_invoice: docMap.purchase_invoice || null,
                                        compliance_certificate: docMap.compliance_certificate || null,
                                    });
                                } else {
                                    setStep5Data({
                                        service_book: docs?.service_book || docs?.service_book_url || null,
                                        user_manual: docs?.user_manual || docs?.user_manual_url || null,
                                        registration_certificate: docs?.registration_certificate || docs?.registration_certificate_url || null,
                                        insurance_certificate: docs?.insurance_certificate || docs?.insurance_certificate_url || null,
                                        purchase_invoice: docs?.purchase_invoice || docs?.purchase_invoice_url || null,
                                        compliance_certificate: docs?.compliance_certificate || docs?.compliance_certificate_url || null,
                                    });
                                }
                            }

                            const maintenance = data?.maintenance || data?.van_maintenance || data?.step_6 || data?.maintenance_setup;
                            if (maintenance) {
                                setStep6Data({
                                    first_service_date: maintenance?.first_service_date ? maintenance.first_service_date.split('T')[0] : '',
                                    assigned_service_centre: maintenance?.assigned_service_centre || '',
                                    notes: maintenance?.notes || '',
                                    reminder_before_days: maintenance?.reminder_before_days ?? 7,
                                    notify_push: maintenance?.notify_push ?? 1,
                                    notify_email: maintenance?.notify_email ?? 1,
                                });
                            }

                            // Set step to API's current_step if returned
                            const targetStep = Number(data?.current_step || data?.currentStep || data?.step);
                            if (targetStep && !isNaN(targetStep) && targetStep >= 1 && targetStep <= 7) {
                                setStep(targetStep);
                                setMaxStep((prev) => Math.max(prev, targetStep));
                            }
                        }
                    },
                })
            );
        }
    }, [dispatch, queryVanId]);

    // Sync state whenever vanProgressData updates in Redux (e.g. after step submissions or progress fetches)
    useEffect(() => {
        if (vanProgressData) {
            const data = vanProgressData?.data || vanProgressData;
            const vd = data?.vehicle_details || data?.van;
            const owner = data?.owner;
            const images = data?.vehicle_images || data?.images || vd?.vehicle_images || vd?.images;
            const comps = data?.components || data?.van_components;
            const warranty = data?.warranty || data?.warranty_details || data?.van_warranty;

            if (data?.van_id) {
                setVanId((prev) => prev || data.van_id);
            }

            if (vd || (images && images.length > 0)) {
                setStep1Data((prev) => ({
                    ...prev,
                    van_id: data?.van_id || vd?.van_id || prev?.van_id,
                    van_name: vd?.van_name || prev?.van_name || '',
                    vin: vd?.vin_number || vd?.vin || prev?.vin || '',
                    make: vd?.make || prev?.make || '',
                    model: vd?.model || prev?.model || '',
                    manufacture_year: vd?.year || vd?.manufacture_year || prev?.manufacture_year || '',
                    registration_number: vd?.registration_number || prev?.registration_number || '',
                    engine: vd?.engine_details || vd?.engine || prev?.engine || '',
                    chassis_number: vd?.chassis_number || prev?.chassis_number || '',
                    color: vd?.vehicle_colour || vd?.color || prev?.color || '',
                    vehicle_images: (images && images.length > 0) ? images : (prev?.vehicle_images || []),
                }));
            }

            if (owner) {
                const oId = owner?.id || vd?.owner_id;
                if (oId) setOwnerId((prev) => prev || oId);
                setStep2Data((prev) => ({
                    ...prev,
                    owner_id: oId || prev?.owner_id,
                    owner_name: owner?.full_name || prev?.owner_name || '',
                    email: owner?.email || prev?.email || '',
                    phone_number: owner?.mobile_number || prev?.phone_number || '',
                }));
            }

            if (comps && Array.isArray(comps) && comps.length > 0) {
                setStep3Data(comps);
            }

            if (warranty) {
                setStep4Data((prev) => ({
                    ...prev,
                    provider: warranty?.provider || warranty?.warranty_provider || prev?.provider || '',
                    coverage_type: warranty?.coverage_type || prev?.coverage_type || 'Mechanical',
                    start_date: warranty?.start_date || prev?.start_date || '',
                    expiry_date: warranty?.expiry_date || prev?.expiry_date || '',
                    claim_instructions: warranty?.claim_instructions || prev?.claim_instructions || '',
                    claim_email: warranty?.claim_email || prev?.claim_email || '',
                    claim_phone: warranty?.claim_phone || prev?.claim_phone || '',
                    warranty_document_url: warranty?.warranty_document || warranty?.document_url || prev?.warranty_document_url || null,
                    file_name: warranty?.file_name || prev?.file_name || '',
                }));
            }
        }
    }, [vanProgressData]);

    const nextStep = () => {
        setStep((prev) => {
            const next = Math.min(prev + 1, 7);
            setMaxStep((m) => Math.max(m, next));
            return next;
        });
    };
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleStep1Success = (createdData, formValues) => {
        const id = createdData?.van_id || createdData?.id || createdData?.van?.id || createdData?.data?.van_id || createdData?.data?.id;
        if (id) {
            setVanId(id);
            dispatch(getVanProgress({ vanId: id }));
        }
        setStep1Data((prev) => ({ ...prev, ...formValues, ...createdData, van_id: id || prev?.van_id }));
        nextStep();
    };

    const handleStep2Prev = (formValues) => {
        if (formValues) {
            setStep2Data((prev) => ({ ...prev, ...formValues }));
        }
        const targetVanId = vanId || reduxVanId;
        if (targetVanId) {
            dispatch(getVanProgress({ vanId: targetVanId }));
        }
        prevStep();
    };

    const handleStep2Success = (createdData, formValues) => {
        const oId = createdData?.owner_id || createdData?.data?.owner_id;
        if (oId) {
            setOwnerId(oId);
        }
        setStep2Data((prev) => ({ ...prev, ...formValues, ...createdData, owner_id: oId || prev?.owner_id }));
        nextStep();
    };

    const handleStep3Prev = (data) => {
        if (data) {
            setStep3Data(data);
        }
        if (vanId) {
            dispatch(getVanProgress({ vanId }));
        }
        prevStep();
    };

    const handleStep3Success = (response, data) => {
        if (data) {
            setStep3Data(data);
        }
        if (vanId) {
            dispatch(getVanProgress({ vanId }));
        }
        nextStep();
    };

    const handleStep4Prev = (data) => {
        if (data) {
            setStep4Data((prev) => ({ ...prev, ...data }));
        }
        if (vanId) {
            dispatch(getVanProgress({ vanId }));
        }
        prevStep();
    };

    const handleStep4Success = (response, data) => {
        if (data) {
            setStep4Data((prev) => ({ ...prev, ...data }));
        }
        if (vanId) {
            dispatch(getVanProgress({ vanId }));
        }
        nextStep();
    };

    const handleStep5Prev = (data) => {
        if (data) {
            setStep5Data((prev) => ({ ...prev, ...data }));
        }
        if (vanId) {
            dispatch(getVanProgress({ vanId }));
        }
        prevStep();
    };

    const handleStep5Success = (response, data) => {
        if (data) {
            setStep5Data((prev) => ({ ...prev, ...data }));
        }
        if (vanId) {
            dispatch(getVanProgress({ vanId }));
        }
        nextStep();
    };

    const handleStep6Prev = (data) => {
        if (data) {
            setStep6Data((prev) => ({ ...prev, ...data }));
        }
        if (vanId) {
            dispatch(getVanProgress({ vanId }));
        }
        prevStep();
    };

    const handleStep6Success = (response, data) => {
        if (data) {
            setStep6Data((prev) => ({ ...prev, ...data }));
        }
        if (vanId) {
            dispatch(getVanProgress({ vanId }));
        }
        nextStep();
    };

    const handleReset = () => {
        pipClearVanDraft();
        dispatch(resetVanState());
        setStep(1);
        setMaxStep(1);
        setVanId(null);
        setOwnerId(null);
        setStep1Data({});
        setStep2Data({});
        setStep3Data({});
        setStep4Data({});
        setStep5Data({});
        setStep6Data({});
        navigate(pageRoutes.vehicle_information, { replace: true });
    };

    const isEditMode = Boolean(queryVanId);

    return (
        <Layout>
            <SubHeader
                title={isEditMode ? "Edit Vehicle Information" : "Add New Van"}
                subtitle={
                    isEditMode
                        ? "Update vehicle details, owner information, warranty, documents, and maintenance records."
                        : "Create a digital ownership profile for a new customer."
                }
                backUrl={pageRoutes.vans}
            />
            <div className="ct_px_30 mt-4 pb-4">
                <form id="msform" onSubmit={(e) => e.preventDefault()}>
                    {/* Stepper Progress Bar */}
                    <StepProgressBar
                        steps={steps}
                        currentStep={step}
                    />

                    {/* Step Components */}
                    {step === 1 && (
                        <Step1VehicleInfo
                            onNext={handleStep1Success}
                            initialData={step1Data}
                            vanId={vanId}
                        />
                    )}
                    {step === 2 && (
                        <Step2OwnerDetails
                            onPrev={handleStep2Prev}
                            onNext={handleStep2Success}
                            initialData={step2Data}
                            vanId={vanId}
                            ownerId={ownerId}
                            isStep2Completed={maxStep > 2}
                        />
                    )}
                    {step === 3 && (
                        <Step3Components
                            onPrev={handleStep3Prev}
                            onNext={handleStep3Success}
                            initialData={step3Data}
                            vanId={vanId}
                        />
                    )}
                    {step === 4 && (
                        <Step4Warranty
                            onPrev={handleStep4Prev}
                            onNext={handleStep4Success}
                            initialData={step4Data}
                            vanId={vanId}
                        />
                    )}
                    {step === 5 && (
                        <Step5Documents
                            onPrev={handleStep5Prev}
                            onNext={handleStep5Success}
                            initialData={step5Data}
                            vanId={vanId}
                        />
                    )}
                    {step === 6 && (
                        <Step6Maintenance
                            onPrev={handleStep6Prev}
                            onNext={handleStep6Success}
                            initialData={step6Data}
                            vanId={vanId}
                        />
                    )}
                    {step === 7 && (
                        <Step7Review
                            onPrev={prevStep}
                            vanId={vanId}
                            onComplete={handleReset}
                            modalTargetId="#successModal"
                        />
                    )}
                </form>
            </div>

            {/* Success Modal */}
            <SuccessModal
                modalId="successModal"
                onAddAnother={handleReset}
                redirectUrl={pageRoutes.vans}
            />
        </Layout>
    );
};

export default VehicleInformation;