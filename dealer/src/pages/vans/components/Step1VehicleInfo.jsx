import React from 'react';
import { Link } from 'react-router-dom';
import { pageRoutes } from '../../../routes/PageRoutes';

const Step1VehicleInfo = ({ onNext }) => {
    return (
        <fieldset>
            <div className="ct_profile_card">
                <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                    <h2 className="ct_fs_20 ct_fw_600 mb-0">1. Vehicle Information</h2>
                    <div className="step-badge">Step 1 of 7</div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Van Name</label>
                            <input type="text" className="form-control ct_input" placeholder="e.g. Summer Breeze" />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">VIN Number</label>
                            <input type="number" className="form-control ct_input" placeholder="17-digit Identifier" />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Make</label>
                            <select className="form-control ct_input ct_select_custom" defaultValue="">
                                <option value="" disabled>Select</option>
                                <option value="jayco">Jayco</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Model</label>
                            <select className="form-control ct_input ct_select_custom" defaultValue="">
                                <option value="" disabled>Select</option>
                                <option value="journey">Journey</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Year</label>
                            <input type="number" className="form-control ct_input" placeholder="2024" />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Registration Number</label>
                            <input type="text" className="form-control ct_input" placeholder="123-ABC" />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Engine Details</label>
                            <textarea className="form-control ct_custom_textarea" rows="3" defaultValue="e.g. 3.0L V6 Turbo Diesel, 140kW"></textarea>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Chassis Number</label>
                            <input type="text" className="form-control ct_input" placeholder="Enter Chassis #" />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Vehicle Colour</label>
                            <input type="text" className="form-control ct_input" placeholder="e.g. Polar White" />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Vehicle Photos</label>
                            <div className="upload-box text-center">
                                <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z" fill="#475569" />
                                </svg>
                                <div>
                                    <label htmlFor="fileInput" className="text-muted upload-label ct_fs_16 ct_color_grey mt-2">
                                        <span className="ct_fw_700 ct_green_text">Click to upload</span> <span className="ct_fw_400">or drag and drop</span><br />
                                        <span className="ct_fs_12 ct_fw_600"> PNG, JPG, or PDF (max. 10MB per file)</span>
                                    </label>
                                </div>
                                <input type="file" id="fileInput" accept="image/png, image/jpeg, video/mp4" hidden />
                            </div>
                            <div className="upload-imgs ct_custom_scroll">
                                <div className="img-item">
                                    <img src="assets/img/vehicle_mini_1.jpg" alt="" />
                                    <button type="button" className="img-remove">
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end ct_mt_56 gap-4 ct_flex_col_575">
                <Link to={pageRoutes.vans} className="action-button-previous ct_w_100_575 text-center text-decoration-none">
                    Cancel
                </Link>
                <button type="button" onClick={onNext} className="ct_form_next action-button ct_w_100_575 border-0">
                    Save & Continue
                </button>
            </div>
        </fieldset>
    );
};

export default Step1VehicleInfo;
