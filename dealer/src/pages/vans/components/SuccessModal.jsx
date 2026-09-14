import React from 'react';
import { useNavigate } from 'react-router-dom';
import { pageRoutes } from '../../../routes/PageRoutes';

const SuccessModal = ({ modalId = "successModal", onAddAnother, redirectUrl = pageRoutes.vans }) => {
    const navigate = useNavigate();

    const cleanupModalDOM = () => {
        const modalEl = document.getElementById(modalId);
        if (modalEl && window.bootstrap?.Modal) {
            const instance = window.bootstrap.Modal.getInstance(modalEl);
            if (instance) {
                instance.hide();
            }
        }
        document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
    };

    const handleGoToVans = () => {
        cleanupModalDOM();
        navigate(redirectUrl);
    };

    const handleAddAnother = () => {
        cleanupModalDOM();
        if (typeof onAddAnother === 'function') {
            onAddAnother();
        }
    };

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4">
                    <div className="modal-body text-center p-5">
                        <div className="mb-4">
                            <div
                                className="mx-auto d-flex align-items-center justify-content-center"
                                style={{ width: "72px", height: "72px", background: "#EAF8EC", borderRadius: "50%" }}
                            >
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.48 26.28L28.17 13.59L25.65 11.07L15.48 21.24L10.35 16.11L7.83 18.63L15.48 26.28ZM18 36C15.51 36 13.17 35.5275 10.98 34.5825C8.79 33.6375 6.885 32.355 5.265 30.735C3.645 29.115 2.3625 27.21 1.4175 25.02C0.4725 22.83 0 20.49 0 18C0 15.51 0.4725 13.17 1.4175 10.98C2.3625 8.79 3.645 6.885 5.265 5.265C6.885 3.645 8.79 2.3625 10.98 1.4175C13.17 0.4725 15.51 0 18 0C20.49 0 22.83 0.4725 25.02 1.4175C27.21 2.3625 29.115 3.645 30.735 5.265C32.355 6.885 33.6375 8.79 34.5825 10.98C35.5275 13.17 36 15.51 36 18C36 20.49 35.5275 22.83 34.5825 25.02C33.6375 27.21 32.355 29.115 30.735 30.735C29.115 32.355 27.21 33.6375 25.02 34.5825C22.83 35.5275 20.49 36 18 36Z" fill="#3D8B37" />
                                </svg>
                            </div>
                        </div>

                        <h3 className="ct_fs_20 ct_head_clr ct_fw_600 mx-auto text-center" style={{ maxWidth: "240px" }}>
                            Van Profile Created Successfully
                        </h3>

                        <p className="ct_para_clr mb-4 mx-auto text-center" style={{ maxWidth: "350px" }}>
                            The customer's digital van profile has been created. The owner has been assigned and an invitation email has been sent.
                        </p>

                        <div className="d-flex flex-column gap-3">
                            <button
                                type="button"
                                onClick={handleGoToVans}
                                className="action-button w-100 text-center text-decoration-none border-0"
                            >
                                Go to My Vans
                            </button>
                            <button
                                type="button"
                                onClick={handleAddAnother}
                                className="previous action-button-previous w-100 border-0"
                            >
                                Add Another Van
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
