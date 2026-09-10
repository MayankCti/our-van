import React from 'react';

const StepProgressBar = ({ steps, currentStep, onSelectStep }) => {
    return (
        <ul className="ct_stepper" id="ct_form_progressbar">
            {steps.map((s) => {
                const isCompleted = s.id < currentStep;
                const isActive = s.id === currentStep;

                const liClass = isCompleted ? 'completed' : isActive ? 'active' : '';
                const circleClass = isCompleted
                    ? 'ct_step_circle completed'
                    : isActive
                    ? 'ct_step_circle active'
                    : 'ct_step_circle';

                return (
                    <li
                        key={s.id}
                        className={liClass}
                        onClick={() => {
                            // Allow clicking back to completed steps or current step
                            if (onSelectStep && (isCompleted || isActive)) {
                                onSelectStep(s.id);
                            }
                        }}
                        style={{ cursor: isCompleted || isActive ? 'pointer' : 'default' }}
                    >
                        <span className={circleClass}>
                            {isCompleted ? <i className="fa-solid fa-check"></i> : s.id}
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
