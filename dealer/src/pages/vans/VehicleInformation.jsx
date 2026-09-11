import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { pipGetVanDraft, pipSaveVanDraft, pipClearVanDraft } from '../../utils/pip';
import { getVanProgress } from '../../redux/slices/vanSlice';

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
    const [searchParams] = useSearchParams();
    const queryVanId = searchParams.get('van_id') || searchParams.get('id');

    const savedDraft = pipGetVanDraft() || {};

    const [step, setStep] = useState(savedDraft?.step || 1);
    const [vanId, setVanId] = useState(queryVanId || savedDraft?.vanId || null);
    const [ownerId, setOwnerId] = useState(savedDraft?.ownerId || null);
    const [step1Data, setStep1Data] = useState(savedDraft?.step1Data || {});
    const [step2Data, setStep2Data] = useState(savedDraft?.step2Data || {});
    const [step3Data, setStep3Data] = useState(savedDraft?.step3Data || {});
    const [step4Data, setStep4Data] = useState(savedDraft?.step4Data || {});

    // Fetch progress if vanId exists (either from URL query or session draft)
    useEffect(() => {
        const targetId = queryVanId || vanId;
        if (targetId) {
            dispatch(
                getVanProgress({
                    vanId: targetId,
                    callback: (response) => {
                        const data = response?.data || response;
                        if (data && (data?.van_id || data?.vehicle_details)) {
                            const vd = data?.vehicle_details;
                            const owner = data?.owner;
                            const images = data?.vehicle_images;
                            const comps = data?.components || data?.van_components;
                            const warranty = data?.warranty || data?.warranty_details || data?.van_warranty;

                            if (data?.van_id) {
                                setVanId(data.van_id);
                            }

                            if (vd) {
                                setStep1Data((prev) => ({
                                    ...prev,
                                    van_id: data?.van_id || vd?.van_id,
                                    van_name: vd?.van_name || prev.van_name || '',
                                    vin: vd?.vin_number || vd?.vin || prev.vin || '',
                                    make: vd?.make || prev.make || '',
                                    model: vd?.model || prev.model || '',
                                    manufacture_year: vd?.year || vd?.manufacture_year || prev.manufacture_year || '',
                                    registration_number: vd?.registration_number || prev.registration_number || '',
                                    engine: vd?.engine_details || vd?.engine || prev.engine || '',
                                    chassis_number: vd?.chassis_number || prev.chassis_number || '',
                                    color: vd?.vehicle_colour || vd?.color || prev.color || '',
                                    vehicle_images: images || prev.vehicle_images || [],
                                }));
                            }

                            if (owner) {
                                const oId = owner?.id || vd?.owner_id;
                                setOwnerId(oId);
                                setStep2Data((prev) => ({
                                    ...prev,
                                    owner_id: oId,
                                    owner_name: owner?.full_name || prev.owner_name || '',
                                    email: owner?.email || prev.email || '',
                                    phone_number: owner?.mobile_number || prev.phone_number || '',
                                }));
                            }

                            if (comps && Array.isArray(comps) && comps.length > 0) {
                                setStep3Data(comps);
                            }

                            if (warranty) {
                                setStep4Data((prev) => ({
                                    ...prev,
                                    provider: warranty?.provider || warranty?.warranty_provider || prev.provider || '',
                                    coverage_type: warranty?.coverage_type || prev.coverage_type || 'Mechanical',
                                    start_date: warranty?.start_date || prev.start_date || '',
                                    expiry_date: warranty?.expiry_date || prev.expiry_date || '',
                                    claim_instructions: warranty?.claim_instructions || prev.claim_instructions || '',
                                    claim_email: warranty?.claim_email || prev.claim_email || '',
                                    claim_phone: warranty?.claim_phone || prev.claim_phone || '',
                                    warranty_document_url: warranty?.warranty_document || warranty?.document_url || prev.warranty_document_url || null,
                                    file_name: warranty?.file_name || prev.file_name || '',
                                }));
                            }

                            // If this was opened fresh with a query param and no draft step, set step to API's current_step
                            if (!savedDraft?.step && data?.current_step) {
                                setStep(data.current_step);
                            }
                        }
                    },
                })
            );
        }
    }, [dispatch, queryVanId, vanId]);

    // Persist draft on every step and data change so page refresh maintains form state
    useEffect(() => {
        pipSaveVanDraft({
            step,
            vanId,
            ownerId,
            step1Data,
            step2Data,
            step3Data,
            step4Data,
        });
    }, [step, vanId, ownerId, step1Data, step2Data, step3Data, step4Data]);

    const nextStep = () => setStep(prev => Math.min(prev + 1, 7));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

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
        if (vanId) {
            dispatch(getVanProgress({ vanId }));
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

    const handleStepSelect = (stepId) => {
        setStep(stepId);
    };

    const handleReset = () => {
        pipClearVanDraft();
        setStep(1);
        setVanId(null);
        setOwnerId(null);
        setStep1Data({});
        setStep2Data({});
        setStep3Data({});
        setStep4Data({});
    };

    return (
        <Layout>
            <SubHeader
                title="Add New Van"
                subtitle="Create a digital ownership profile for a new customer."
                backUrl={pageRoutes.vans}
            />
            <div className="ct_px_30 mt-4 pb-4">
                <form id="msform" onSubmit={(e) => e.preventDefault()}>
                    {/* Stepper Progress Bar */}
                    <StepProgressBar
                        steps={steps}
                        currentStep={step}
                        onSelectStep={handleStepSelect}
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
                    {step === 5 && <Step5Documents onPrev={prevStep} onNext={nextStep} />}
                    {step === 6 && <Step6Maintenance onPrev={prevStep} onNext={nextStep} />}
                    {step === 7 && <Step7Review onPrev={prevStep} modalTargetId="#successModal" />}
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