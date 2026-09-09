import React, { useState } from 'react';
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
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(prev => Math.min(prev + 1, 7));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

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
                        onSelectStep={(stepId) => setStep(stepId)}
                    />

                    {/* Step Components */}
                    {step === 1 && <Step1VehicleInfo onNext={nextStep} />}
                    {step === 2 && <Step2OwnerDetails onPrev={prevStep} onNext={nextStep} />}
                    {step === 3 && <Step3Components onPrev={prevStep} onNext={nextStep} />}
                    {step === 4 && <Step4Warranty onPrev={prevStep} onNext={nextStep} />}
                    {step === 5 && <Step5Documents onPrev={prevStep} onNext={nextStep} />}
                    {step === 6 && <Step6Maintenance onPrev={prevStep} onNext={nextStep} />}
                    {step === 7 && <Step7Review onPrev={prevStep} modalTargetId="#successModal" />}
                </form>
            </div>

            {/* Success Modal */}
            <SuccessModal
                modalId="successModal"
                onAddAnother={() => setStep(1)}
                redirectUrl={pageRoutes.vans}
            />
        </Layout>
    );
};

export default VehicleInformation;