import React from 'react';

const Step6Maintenance = ({ onPrev, onNext }) => {
    return (
        <fieldset>
            <div className="ct_profile_card text-start">
                <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                    <h2 className="ct_fs_20 ct_fw_600 mb-0">6. Maintenance Setup</h2>
                    <div className="step-badge">Step 6 of 7</div>
                </div>

                <div>
                    <div className="mb-4">
                        <div className="bage_head">Initial Service Schedule</div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">First Service Date</label>
                                <input type="date" className="form-control ct_input" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">Assigned Service Centre <span className="ct_para_clr">(Optional)</span></label>
                                <input type="text" className="form-control ct_input" placeholder="e.g Energy saver" />
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="form-group text-start">
                                <label className="mb-2 ct_label">Notes <span className="ct_para_clr">(Optional)</span></label>
                                <textarea className="form-control ct_custom_textarea" rows="3" defaultValue="Add specific instructions"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="ct_mt_30 mb-4">
                        <div className="bage_head">Maintenance Reminders</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">Reminder Before</label>
                                <select className="form-control ct_input ct_custom_select" defaultValue="15 Days">
                                    <option value="15 Days">15 Days</option>
                                    <option value="25 Days">25 Days</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">Notification Method</label>
                                <div className="d-flex gap-2 flex-wrap">
                                    <div className="form-check ct_custom_check">
                                        <input className="form-check-input" type="checkbox" id="pushNotifCheck" defaultChecked />
                                        <label className="form-check-label ct_fw_500" htmlFor="pushNotifCheck">
                                            Push Notification
                                        </label>
                                    </div>
                                    <div className="form-check ct_custom_check">
                                        <input className="form-check-input" type="checkbox" id="emailNotifCheck" defaultChecked />
                                        <label className="form-check-label ct_fw_500" htmlFor="emailNotifCheck">
                                            Email Notification
                                        </label>
                                    </div>
                                </div>
                            </div>
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

export default Step6Maintenance;
