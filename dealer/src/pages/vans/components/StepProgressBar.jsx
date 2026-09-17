import React from 'react';

const StepProgressBar = ({ steps, currentStep, maxStep, onSelectStep }) => {
    const highestStep = maxStep || currentStep;

    return (
        <ul className="ct_stepper" id="ct_form_progressbar">
            {steps.map((s) => {
                const isPastStep = s.id < highestStep;
                const isActive = s.id === currentStep;
                const isClickable = s.id <= highestStep;

                const liClass = isActive ? 'active' : isPastStep ? 'completed' : '';
                const circleClass = isActive
                    ? 'ct_step_circle active'
                    : isPastStep
                    ? 'ct_step_circle completed'
                    : 'ct_step_circle';

                return (
                    <li
                        key={s.id}
                        className={liClass}
                        onClick={() => {
                            // Allow clicking any step up to the highest reached step
                            if (onSelectStep && isClickable) {
                                onSelectStep(s.id);
                            }
                        }}
                        style={{ cursor: isClickable ? 'pointer' : 'default' }}
                    >
                        <span className={circleClass}>
                            {isPastStep && !isActive ? <i className="fa-solid fa-check"></i> : s.id}
                        </span>
                        <div>
                            <span className="label">{s.name}</span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default StepProgressBar;
