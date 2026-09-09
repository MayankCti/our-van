import React from 'react';

const Step5Documents = ({ onPrev, onNext }) => {
    return (
        <fieldset>
            <div className="ct_profile_card text-start">
                <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                    <h2 className="ct_fs_20 ct_fw_600 mb-0">5. Upload Documents</h2>
                    <div className="step-badge">Step 5 of 7</div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Service Book</label>
                            <div className="upload-box text-center bg-transparent">
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.71061 19.1249C3.29048 18.1743 2.35547 16.5554 2.35547 14.7182C2.35547 11.9584 4.4651 9.69146 7.15965 9.44191C7.71084 6.08909 10.6223 3.53125 14.1312 3.53125C17.64 3.53125 20.5515 6.08909 21.1027 9.44191C23.7972 9.69146 25.9069 11.9584 25.9069 14.7182C25.9069 16.5554 24.9719 18.1743 23.5517 19.1249M18.8414 18.8397L14.1312 14.1294L9.42089 18.8397M14.1312 14.1294V24.7275" stroke="#64748B" strokeWidth="2.35514" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                    <label htmlFor="serviceBookInput" className="text-muted upload-label ct_fs_12 ct_color_grey mt-2">
                                        <span className="ct_fw_400">Drag and drop PDF here, or Browse Files</span><br />
                                        <span className="upload_file_btn">Upload File</span>
                                    </label>
                                </div>
                                <input type="file" id="serviceBookInput" accept="image/png, image/jpeg, video/mp4" hidden />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">User Manuals</label>
                            <div className="upload-box text-center bg-transparent">
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.71061 19.1249C3.29048 18.1743 2.35547 16.5554 2.35547 14.7182C2.35547 11.9584 4.4651 9.69146 7.15965 9.44191C7.71084 6.08909 10.6223 3.53125 14.1312 3.53125C17.64 3.53125 20.5515 6.08909 21.1027 9.44191C23.7972 9.69146 25.9069 11.9584 25.9069 14.7182C25.9069 16.5554 24.9719 18.1743 23.5517 19.1249M18.8414 18.8397L14.1312 14.1294L9.42089 18.8397M14.1312 14.1294V24.7275" stroke="#64748B" strokeWidth="2.35514" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                    <label htmlFor="userManualInput" className="text-muted upload-label ct_fs_12 ct_color_grey mt-2">
                                        <span className="ct_fw_400">Drag and drop PDF here, or Browse Files</span><br />
                                        <span className="upload_file_btn">Upload File</span>
                                    </label>
                                </div>
                                <input type="file" id="userManualInput" accept="image/png, image/jpeg, video/mp4" hidden />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Registration Certificate</label>
                            <div className="upload-box text-center bg-transparent">
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.71061 19.1249C3.29048 18.1743 2.35547 16.5554 2.35547 14.7182C2.35547 11.9584 4.4651 9.69146 7.15965 9.44191C7.71084 6.08909 10.6223 3.53125 14.1312 3.53125C17.64 3.53125 20.5515 6.08909 21.1027 9.44191C23.7972 9.69146 25.9069 11.9584 25.9069 14.7182C25.9069 16.5554 24.9719 18.1743 23.5517 19.1249M18.8414 18.8397L14.1312 14.1294L9.42089 18.8397M14.1312 14.1294V24.7275" stroke="#64748B" strokeWidth="2.35514" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                    <label htmlFor="regCertInput" className="text-muted upload-label ct_fs_12 ct_color_grey mt-2">
                                        <span className="ct_fw_400">Drag and drop PDF here, or Browse Files</span><br />
                                        <span className="upload_file_btn">Upload File</span>
                                    </label>
                                </div>
                                <input type="file" id="regCertInput" accept="image/png, image/jpeg, video/mp4" hidden />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Insurance Certificate</label>
                            <div className="upload-box text-center bg-transparent">
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.71061 19.1249C3.29048 18.1743 2.35547 16.5554 2.35547 14.7182C2.35547 11.9584 4.4651 9.69146 7.15965 9.44191C7.71084 6.08909 10.6223 3.53125 14.1312 3.53125C17.64 3.53125 20.5515 6.08909 21.1027 9.44191C23.7972 9.69146 25.9069 11.9584 25.9069 14.7182C25.9069 16.5554 24.9719 18.1743 23.5517 19.1249M18.8414 18.8397L14.1312 14.1294L9.42089 18.8397M14.1312 14.1294V24.7275" stroke="#64748B" strokeWidth="2.35514" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                    <label htmlFor="insCertInput" className="text-muted upload-label ct_fs_12 ct_color_grey mt-2">
                                        <span className="ct_fw_400">Drag and drop PDF here, or Browse Files</span><br />
                                        <span className="upload_file_btn">Upload File</span>
                                    </label>
                                </div>
                                <input type="file" id="insCertInput" accept="image/png, image/jpeg, video/mp4" hidden />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Purchase Invoice</label>
                            <div className="upload-box text-center bg-transparent">
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.71061 19.1249C3.29048 18.1743 2.35547 16.5554 2.35547 14.7182C2.35547 11.9584 4.4651 9.69146 7.15965 9.44191C7.71084 6.08909 10.6223 3.53125 14.1312 3.53125C17.64 3.53125 20.5515 6.08909 21.1027 9.44191C23.7972 9.69146 25.9069 11.9584 25.9069 14.7182C25.9069 16.5554 24.9719 18.1743 23.5517 19.1249M18.8414 18.8397L14.1312 14.1294L9.42089 18.8397M14.1312 14.1294V24.7275" stroke="#64748B" strokeWidth="2.35514" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                    <label htmlFor="invoiceInput" className="text-muted upload-label ct_fs_12 ct_color_grey mt-2">
                                        <span className="ct_fw_400">Drag and drop PDF here, or Browse Files</span><br />
                                        <span className="upload_file_btn">Upload File</span>
                                    </label>
                                </div>
                                <input type="file" id="invoiceInput" accept="image/png, image/jpeg, video/mp4" hidden />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-sm-6">
                        <div className="form-group mb-4 text-start">
                            <label className="mb-2 ct_label">Compliance Certificates</label>
                            <div className="upload-box text-center bg-transparent">
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.71061 19.1249C3.29048 18.1743 2.35547 16.5554 2.35547 14.7182C2.35547 11.9584 4.4651 9.69146 7.15965 9.44191C7.71084 6.08909 10.6223 3.53125 14.1312 3.53125C17.64 3.53125 20.5515 6.08909 21.1027 9.44191C23.7972 9.69146 25.9069 11.9584 25.9069 14.7182C25.9069 16.5554 24.9719 18.1743 23.5517 19.1249M18.8414 18.8397L14.1312 14.1294L9.42089 18.8397M14.1312 14.1294V24.7275" stroke="#64748B" strokeWidth="2.35514" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                    <label htmlFor="compCertInput" className="text-muted upload-label ct_fs_12 ct_color_grey mt-2">
                                        <span className="ct_fw_400">Drag and drop PDF here, or Browse Files</span><br />
                                        <span className="upload_file_btn">Upload File</span>
                                    </label>
                                </div>
                                <input type="file" id="compCertInput" accept="image/png, image/jpeg, video/mp4" hidden />
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

export default Step5Documents;
