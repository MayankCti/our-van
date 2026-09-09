import React from 'react';

const Step3Components = ({ onPrev, onNext }) => {
    return (
        <fieldset>
            <div className="ct_profile_card text-start">
                <div className="d-flex justify-content-between gap-2 align-items-center ct_mb_30 ct_flex_col_575">
                    <h2 className="ct_fs_20 ct_fw_600 mb-0">3. Van Components</h2>
                    <div className="step-badge">Step 3 of 7</div>
                </div>

                <div>
                    <div className="row">
                        <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
                            <input type="checkbox" id="battery" className="van-checkbox" defaultChecked />
                            <label htmlFor="battery" className="van-component-box">
                                <div>
                                    <svg width="20" height="30" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.25 30V25.5H10.5L15.75 18V22.5H19.5L14.25 30ZM1.5 30C1.075 30 0.71875 29.8563 0.43125 29.5688C0.14375 29.2812 0 28.925 0 28.5V4.5C0 4.075 0.14375 3.71875 0.43125 3.43125C0.71875 3.14375 1.075 3 1.5 3H4.5V0H10.5V3H13.5C13.925 3 14.2812 3.14375 14.5688 3.43125C14.8563 3.71875 15 4.075 15 4.5V15C14.475 15 13.9625 15.0438 13.4625 15.1313C12.9625 15.2188 12.475 15.35 12 15.525V6H3V27H6.525C6.725 27.575 6.96875 28.1125 7.25625 28.6125C7.54375 29.1125 7.8875 29.575 8.2875 30H1.5Z" />
                                    </svg>
                                </div>
                                <h5>Battery</h5>
                            </label>
                        </div>

                        <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
                            <input type="checkbox" id="solar" className="van-checkbox" />
                            <label htmlFor="solar" className="van-component-box">
                                <div>
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 30L3 15H27L30 30H0ZM1.5 3V0H6V3H1.5ZM3.675 27H13.5V24H4.275L3.675 27ZM6.1875 10.9875L4.05 8.8875L7.2375 5.7L9.375 7.8L6.1875 10.9875ZM4.875 21H13.5V18H5.475L4.875 21ZM15 7.5C12.925 7.5 11.1562 6.76875 9.69375 5.30625C8.23125 3.84375 7.5 2.075 7.5 0H10.5C10.5 1.25 10.9375 2.3125 11.8125 3.1875C12.6875 4.0625 13.75 4.5 15 4.5C16.25 4.5 17.3125 4.0625 18.1875 3.1875C19.0625 2.3125 19.5 1.25 19.5 0H22.5C22.5 2.075 21.7687 3.84375 20.3062 5.30625C18.8438 6.76875 17.075 7.5 15 7.5ZM13.5 13.5V9H16.5V13.5H13.5ZM16.5 27H26.325L25.725 24H16.5V27ZM16.5 21H25.125L24.525 18H16.5V21ZM23.8125 10.9875L20.6625 7.8L22.7625 5.7L25.95 8.85L23.8125 10.9875ZM24 3V0H28.5V3H24Z" fill="#475569" />
                                    </svg>
                                </div>
                                <h5>Solar Panels</h5>
                            </label>
                        </div>

                        <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
                            <input type="checkbox" id="fridge" className="van-checkbox" />
                            <label htmlFor="fridge" className="van-component-box">
                                <div>
                                    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9V4.5H9V9H6ZM6 22.5V15H9V22.5H6ZM3 30C2.175 30 1.46875 29.7062 0.88125 29.1187C0.29375 28.5312 0 27.825 0 27V3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0H21C21.825 0 22.5312 0.29375 23.1187 0.88125C23.7062 1.46875 24 2.175 24 3V27C24 27.825 23.7062 28.5312 23.1187 29.1187C22.5312 29.7062 21.825 30 21 30H3ZM3 27H21V13.5H3V27ZM3 10.5H21V3H3V10.5Z" fill="#475569" />
                                    </svg>
                                </div>
                                <h5>Fridge</h5>
                            </label>
                        </div>

                        <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
                            <input type="checkbox" id="waterpump" className="van-checkbox" defaultChecked />
                            <label htmlFor="waterpump" className="van-component-box">
                                <div>
                                    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.4125 25.5C12.7125 25.475 12.9688 25.3562 13.1812 25.1437C13.3937 24.9312 13.5 24.675 13.5 24.375C13.5 24.025 13.3875 23.7437 13.1625 23.5312C12.9375 23.3188 12.65 23.225 12.3 23.25C11.275 23.325 10.1875 23.0438 9.0375 22.4062C7.8875 21.7687 7.1625 20.6125 6.8625 18.9375C6.8125 18.6625 6.68125 18.4375 6.46875 18.2625C6.25625 18.0875 6.0125 18 5.7375 18C5.3875 18 5.1 18.1312 4.875 18.3937C4.65 18.6562 4.575 18.9625 4.65 19.3125C5.075 21.5875 6.075 23.2125 7.65 24.1875C9.225 25.1625 10.8125 25.6 12.4125 25.5ZM12 30C8.575 30 5.71875 28.825 3.43125 26.475C1.14375 24.125 0 21.2 0 17.7C0 15.2 0.99375 12.4812 2.98125 9.54375C4.96875 6.60625 7.975 3.425 12 0C16.025 3.425 19.0312 6.60625 21.0187 9.54375C23.0062 12.4812 24 15.2 24 17.7C24 21.2 22.8563 24.125 20.5688 26.475C18.2812 28.825 15.425 30 12 30ZM12 27C14.6 27 16.75 26.1188 18.45 24.3563C20.15 22.5938 21 20.375 21 17.7C21 15.875 20.2438 13.8125 18.7313 11.5125C17.2188 9.2125 14.975 6.7 12 3.975C9.025 6.7 6.78125 9.2125 5.26875 11.5125C3.75625 13.8125 3 15.875 3 17.7C3 20.375 3.85 22.5938 5.55 24.3563C7.25 26.1188 9.4 27 12 27Z" fill="#475569" />
                                    </svg>
                                </div>
                                <h5>Water Pump</h5>
                            </label>
                        </div>

                        <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
                            <input type="checkbox" id="airconditioner" className="van-checkbox" />
                            <label htmlFor="airconditioner" className="van-component-box">
                                <div>
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.5 30V23.775L8.625 28.575L6.525 26.475L13.5 19.5V16.5H10.5L3.525 23.475L1.425 21.375L6.225 16.5H0V13.5H6.225L1.425 8.625L3.525 6.525L10.5 13.5H13.5V10.5L6.525 3.525L8.625 1.425L13.5 6.225V0H16.5V6.225L21.375 1.425L23.475 3.525L16.5 10.5V13.5H19.5L26.475 6.525L28.575 8.625L23.775 13.5H30V16.5H23.775L28.575 21.375L26.475 23.475L19.5 16.5H16.5V19.5L23.475 26.475L21.375 28.575L16.5 23.775V30H13.5Z" fill="#475569" />
                                    </svg>
                                </div>
                                <h5>Air Conditioner</h5>
                            </label>
                        </div>

                        <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
                            <input type="checkbox" id="gassystem" className="van-checkbox" defaultChecked />
                            <label htmlFor="gassystem" className="van-component-box">
                                <div>
                                    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 30C4.35 30 2.9375 29.4125 1.7625 28.2375C0.5875 27.0625 0 25.65 0 24V12C0 10.575 0.425 9.3375 1.275 8.2875C2.125 7.2375 3.2 6.5375 4.5 6.1875V3C4.5 2.175 4.79375 1.46875 5.38125 0.88125C5.96875 0.29375 6.675 0 7.5 0H16.5C17.325 0 18.0312 0.29375 18.6187 0.88125C19.2062 1.46875 19.5 2.175 19.5 3V6.1875C20.8 6.5375 21.875 7.2375 22.725 8.2875C23.575 9.3375 24 10.575 24 12V24C24 25.65 23.4125 27.0625 22.2375 28.2375C21.0625 29.4125 19.65 30 18 30H6ZM3 16.5H21V12C21 11.175 20.7062 10.4688 20.1187 9.88125C19.5312 9.29375 18.825 9 18 9H6C5.175 9 4.46875 9.29375 3.88125 9.88125C3.29375 10.4688 3 11.175 3 12V16.5ZM6 27H18C18.825 27 19.5312 26.7062 20.1187 26.1187C20.7062 25.5312 21 24.825 21 24V19.5H3V24C3 24.825 3.29375 25.5312 3.88125 26.1187C4.46875 26.7062 5.175 27 6 27ZM13.5 6H16.5V3H7.5V6H10.5C10.5 5.575 10.6437 5.21875 10.9312 4.93125C11.2188 4.64375 11.575 4.5 12 4.5C12.425 4.5 12.7812 4.64375 13.0688 4.93125C13.3563 5.21875 13.5 5.575 13.5 6Z" fill="#475569" />
                                    </svg>
                                </div>
                                <h5>Gas System</h5>
                            </label>
                        </div>

                        <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
                            <input type="checkbox" id="brakes" className="van-checkbox" />
                            <label htmlFor="brakes" className="van-component-box">
                                <div>
                                    <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.375 29.85C19.775 29.6 18.4062 28.9 17.2687 27.75C16.1312 26.6 15.4375 25.225 15.1875 23.625H17.4C17.625 24.625 18.0938 25.4813 18.8062 26.1938C19.5187 26.9062 20.375 27.375 21.375 27.6V29.85ZM23.625 29.8875V27.6C24.825 27.325 25.8125 26.725 26.5875 25.8C27.3625 24.875 27.75 23.775 27.75 22.5C27.75 21.225 27.3625 20.125 26.5875 19.2C25.8125 18.275 24.825 17.675 23.625 17.4V15.1125C25.425 15.3875 26.9375 16.2188 28.1625 17.6063C29.3875 18.9938 30 20.625 30 22.5C30 24.375 29.3875 26.0062 28.1625 27.3937C26.9375 28.7812 25.425 29.6125 23.625 29.8875ZM15.1875 21.375C15.4375 19.775 16.1312 18.4 17.2687 17.25C18.4062 16.1 19.775 15.4 21.375 15.15V17.4C20.375 17.625 19.5187 18.0938 18.8062 18.8062C18.0938 19.5187 17.625 20.375 17.4 21.375H15.1875ZM21 25.5V19.5L25.65 22.5L21 25.5ZM10.95 30L10.35 25.2C10.025 25.075 9.71875 24.925 9.43125 24.75C9.14375 24.575 8.8625 24.3875 8.5875 24.1875L4.125 26.0625L0 18.9375L3.8625 16.0125C3.8375 15.8375 3.825 15.6688 3.825 15.5063C3.825 15.3438 3.825 15.175 3.825 15C3.825 14.825 3.825 14.6562 3.825 14.4937C3.825 14.3312 3.8375 14.1625 3.8625 13.9875L0 11.0625L4.125 3.9375L8.5875 5.8125C8.8625 5.6125 9.15 5.425 9.45 5.25C9.75 5.075 10.05 4.925 10.35 4.8L10.95 0H19.2L19.8 4.8C20.125 4.925 20.4312 5.075 20.7188 5.25C21.0063 5.425 21.2875 5.6125 21.5625 5.8125L26.025 3.9375L30.15 11.0625L27.375 13.1625C26.825 12.8875 26.2625 12.6562 25.6875 12.4688C25.1125 12.2812 24.5 12.15 23.85 12.075L26.2125 10.275L24.75 7.725L21.0375 9.3C20.4875 8.725 19.8813 8.24375 19.2188 7.85625C18.5562 7.46875 17.8375 7.175 17.0625 6.975L16.575 3H13.6125L13.0875 6.975C12.3125 7.175 11.5938 7.46875 10.9312 7.85625C10.2687 8.24375 9.6625 8.7125 9.1125 9.2625L5.4 7.725L3.9375 10.275L7.1625 12.675C7.0375 13.05 6.95 13.425 6.9 13.8C6.85 14.175 6.825 14.575 6.825 15C6.825 15.4 6.85 15.7875 6.9 16.1625C6.95 16.5375 7.0375 16.9125 7.1625 17.2875L3.9375 19.725L5.4 22.275L9.1125 20.7C9.5375 21.125 9.99375 21.5063 10.4812 21.8438C10.9688 22.1812 11.5 22.4625 12.075 22.6875C12.1 24.1125 12.3938 25.45 12.9563 26.7C13.5188 27.95 14.275 29.05 15.225 30H10.95ZM12.4875 19.5375C12.6375 19.0375 12.8188 18.5562 13.0312 18.0938C13.2437 17.6313 13.4875 17.1875 13.7625 16.7625C13.4875 16.5625 13.275 16.3062 13.125 15.9937C12.975 15.6812 12.9 15.35 12.9 15C12.9 14.375 13.1187 13.8438 13.5562 13.4062C13.9937 12.9688 14.525 12.75 15.15 12.75C15.5 12.75 15.8375 12.8312 16.1625 12.9937C16.4875 13.1562 16.75 13.375 16.95 13.65C17.375 13.375 17.8125 13.1312 18.2625 12.9187C18.7125 12.7063 19.1875 12.533 19.6875 12.4125C19.2375 11.6125 18.6125 10.9688 17.8125 10.4812C17.0125 9.99375 16.125 9.75 15.15 9.75C13.675 9.75 12.4312 10.2625 11.4187 11.2875C10.4062 12.3125 9.9 13.55 9.9 15C9.9 15.95 10.1313 16.8312 10.5938 17.6437C11.0562 18.4562 11.6875 19.0875 12.4875 19.5375Z" fill="#475569" />
                                    </svg>
                                </div>
                                <h5>Brakes</h5>
                            </label>
                        </div>

                        <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
                            <input type="checkbox" id="suspension" className="van-checkbox" />
                            <label htmlFor="suspension" className="van-component-box">
                                <div>
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24.6 27.0375L16.3875 18.825L19.5375 15.675L27.75 23.8875L24.6 27.0375ZM3.9 27.0375L0.75 23.8875L11.1 13.5375L8.55 10.9875L7.5 12.0375L5.5875 10.125V13.2L4.5375 14.25L0 9.7125L1.05 8.6625H4.125L2.25 6.7875L7.575 1.4625C8.075 0.9625 8.6125 0.6 9.1875 0.375C9.7625 0.15 10.35 0.0375 10.95 0.0375C11.55 0.0375 12.1375 0.15 12.7125 0.375C13.2875 0.6 13.825 0.9625 14.325 1.4625L10.875 4.9125L12.75 6.7875L11.7 7.8375L14.25 10.3875L17.625 7.0125C17.525 6.7375 17.4438 6.45 17.3813 6.15C17.3188 5.85 17.2875 5.55 17.2875 5.25C17.2875 3.775 17.7937 2.53125 18.8062 1.51875C19.8188 0.50625 21.0625 0 22.5375 0C22.9125 0 23.2688 0.0375 23.6063 0.1125C23.9438 0.1875 24.2875 0.3 24.6375 0.45L20.925 4.1625L23.625 6.8625L27.3375 3.15C27.5125 3.5 27.6313 3.84375 27.6938 4.18125C27.7563 4.51875 27.7875 4.875 27.7875 5.25C27.7875 6.725 27.2812 7.96875 26.2687 8.98125C25.2562 9.99375 24.0125 10.5 22.5375 10.5C22.2375 10.5 21.9375 10.475 21.6375 10.425C21.3375 10.375 21.05 10.2875 20.775 10.1625L3.9 27.0375Z" fill="#475569" />
                                    </svg>
                                </div>
                                <h5>Suspension</h5>
                            </label>
                        </div>
                    </div>

                    <div className="ct_fs_16 ct_fw_500 ct_green_text mt-5" style={{ cursor: "pointer" }}>
                        <i className="fa-solid fa-plus me-2"></i> Add Custom component
                    </div>

                    <div className="ct_mt_30 ct_mb_30">
                        <div className="dropdown ct_w_100_575">
                            <button
                                className="btn filter-dropdown dropdown-toggle ct_w_100_575"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Battery Details
                                <svg className="ms-2" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.34 7L10.67 14.67L3 7" stroke="#3D8B37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#!">Water Pump Details</a></li>
                                <li><a className="dropdown-item" href="#!">Gas System Details</a></li>
                                <li><a className="dropdown-item" href="#!">Battery Details</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">Manufacturer</label>
                                <input type="text" className="form-control ct_input" placeholder="e.g. Energy Drive" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">Installation Date</label>
                                <input type="date" className="form-control ct_input" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">Warranty Period</label>
                                <select className="form-control ct_input ct_select_custom" defaultValue="1 Year">
                                    <option>1 Year</option>
                                    <option>2 Year</option>
                                    <option>3 Year</option>
                                    <option>4 Year</option>
                                    <option>5 Year</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">Replacement Schedule</label>
                                <input type="date" className="form-control ct_input" />
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">Maintenance Notes</label>
                                <textarea className="form-control ct_custom_textarea" rows="3" defaultValue="Add specific care instructions"></textarea>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="form-group mb-4 text-start">
                                <label className="mb-2 ct_label">User Manual Upload</label>
                                <div className="upload-box text-center">
                                    <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z" fill="#475569" />
                                    </svg>
                                    <div>
                                        <label htmlFor="compManualInput" className="text-muted upload-label ct_fs_16 ct_color_grey mt-2">
                                            <span className="ct_fw_400">Drag and drop PDF here, or </span>
                                            <span className="ct_fw_700 ct_green_text">Browse Files</span><br />
                                            <span className="ct_fs_12 ct_fw_600">Maximum file size: 10MB</span>
                                        </label>
                                    </div>
                                    <input type="file" id="compManualInput" accept="image/png, image/jpeg, video/mp4" hidden />
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

export default Step3Components;
