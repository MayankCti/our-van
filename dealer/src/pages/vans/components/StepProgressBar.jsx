import React from 'react';

const StepProgressBar = ({ steps, currentStep, onSelectStep }) => {
    return (
        <ul className="ct_stepper" id="ct_form_progressbar">
            {steps.map((s) => (
                <li
                    key={s.id}
                    className={currentStep >= s.id ? "active" : ""}
                    onClick={() => onSelectStep && onSelectStep(s.id)}
                    style={{ cursor: "pointer" }}
                >
                    <span className={`ct_step_circle ${currentStep >= s.id ? "active" : ""}`}>
                        {s.id}
                    </span>
                    <div>
                        <span className="label">{s.name}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default StepProgressBar;
