import React from 'react';

const Step2OwnerDetails = ({ onPrev, onNext }) => {
    return (
        <fieldset>
            <div className="ct_profile_card">
                <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                    <h2 className="ct_fs_20 ct_fw_600 mb-0">2. Owner Details</h2>
                    <div className="step-badge">Step 2 of 7</div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Full Name</label>
                            <input type="text" className="form-control ct_input" placeholder="Jessica William" />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Email Address</label>
                            <input type="email" className="form-control ct_input" placeholder="jessicawilliam029@gmail.com" />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Mobile Number</label>
                            <input type="number" className="form-control ct_input" placeholder="XXXX-XXX-XXX" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                <button type="button" onClick={onPrev} className="previous action-button-previous ct_w_100_575 border-0">
                    Back
                </button>
                <button type="button" onClick={onNext} className="ct_form_next action-button ct_w_100_575 border-0">
                    Save & Continue
                </button>
            </div>
        </fieldset>
    );
};

export default Step2OwnerDetails;
