import { Link } from 'react-router-dom'
import Layout from '../../layout/Layout'
import { pageRoutes } from '../../routes/PageRoutes'
import Header from '../../layout/Header'

const ServiceProviderDetail = () => {

    return (
        <Layout>
            <div class="ct_right_panel">
                <Header />
                <div class="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-start gap-2">
                    <a href="service-providers.html">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25 30L15 20L25 10" stroke="#1E293B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                    <div>
                        <h4 class="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Service Provider Details</h4>
                        <p class="mb-0 ct_para_clr">View service provider information and offered services.</p>
                    </div>
                </div>
                <div class="ct_px_30 mt-4 pb-4">
                    <section class="ct_service_details py-4">
                        <div class="ct_service_banner position-relative">
                            {/* Banner Image */}
                            <img src="assets/img/service_banner_img.jpg" class="w-100 ct_banner_img" alt="" />
                            {/* Floating Card */}
                            <div class="ct_service_profile">
                                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                    <div class="d-flex align-items-center gap-4 flex-wrap">
                                        <div class="ct_service_logo">
                                            <img src="assets/img/car_logo.png" alt="" />
                                        </div>
                                        <div>
                                            <h2 class="ct_head_clr mb-1">
                                                VanCare Service Centre
                                            </h2>
                                            <div class="d-flex align-items-center gap-2 flex-wrap">
                                                <span class="ct_para_clr">
                                                    Caravan Repair Centre
                                                </span>
                                                <span>•</span>
                                                <span class="text-warning">
                                                    ★
                                                </span>
                                                <span class="ct_head_clr">
                                                    4.9 (248)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="ct_custom_badge">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.3987 14.1419C4.58759 13.7917 3.88203 13.3166 3.28203 12.7166C2.68203 12.1166 2.20714 11.411 1.85737 10.5999C1.50759 9.78881 1.33248 8.92214 1.33203 7.99992C1.33159 7.0777 1.5067 6.21103 1.85737 5.39992C2.20803 4.58881 2.68292 3.88325 3.28203 3.28325C3.88114 2.68325 4.5867 2.20836 5.3987 1.85859C6.2107 1.50881 7.07736 1.3337 7.9987 1.33325C8.92003 1.33281 9.7867 1.50792 10.5987 1.85859C11.4107 2.20925 12.1163 2.68414 12.7154 3.28325C13.3145 3.88236 13.7896 4.58792 14.1407 5.39992C14.4918 6.21192 14.6667 7.07859 14.6654 7.99992C14.664 8.92125 14.4889 9.78792 14.14 10.5999C13.7911 11.4119 13.3163 12.1175 12.7154 12.7166C12.1145 13.3157 11.4089 13.7908 10.5987 14.1419C9.78848 14.493 8.92181 14.6679 7.9987 14.6666C7.07559 14.6653 6.20892 14.4908 5.3987 14.1419ZM7.9987 13.3333C8.5987 13.3333 9.17648 13.2361 9.73203 13.0419C10.2876 12.8477 10.7987 12.567 11.2654 12.1999L3.7987 4.73325C3.43203 5.19992 3.15137 5.71103 2.9567 6.26659C2.76203 6.82214 2.66492 7.39992 2.66537 7.99992C2.66537 9.48881 3.18203 10.7499 4.21537 11.7833C5.2487 12.8166 6.50981 13.3333 7.9987 13.3333ZM12.1987 11.2666C12.5654 10.7999 12.846 10.2888 13.0407 9.73325C13.2354 9.1777 13.3325 8.59992 13.332 7.99992C13.332 6.51103 12.8154 5.24992 11.782 4.21659C10.7487 3.18325 9.48759 2.66659 7.9987 2.66659C7.3987 2.66659 6.82092 2.7637 6.26537 2.95792C5.70981 3.15214 5.1987 3.43281 4.73203 3.79992L12.1987 11.2666Z" fill="#EF4444" />
                                        </svg>
                                        Block
                                    </button>
                                </div>
                                <hr />
                                {/* Contact Row */}
                                <div class="d-flex align-items-center gap-4 flex-wrap">
                                    <div>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="ct_icon_circle">
                                                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z" fill="#3D8B37" />
                                                </svg>
                                            </div>
                                            <span class="ct_para_clr">
                                                123 Workshop Rd, Melbourne VIC 3000
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="ct_icon_circle">
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16.95 18C14.8667 18 12.8083 17.5458 10.775 16.6375C8.74167 15.7292 6.89167 14.4417 5.225 12.775C3.55833 11.1083 2.27083 9.25833 1.3625 7.225C0.454167 5.19167 0 3.13333 0 1.05C0 0.75 0.1 0.5 0.3 0.3C0.5 0.1 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0791667 5.725 0.2375C5.90833 0.395833 6.01667 0.583333 6.05 0.8L6.7 4.3C6.73333 4.56667 6.725 4.79167 6.675 4.975C6.625 5.15833 6.53333 5.31667 6.4 5.45L3.975 7.9C4.30833 8.51667 4.70417 9.1125 5.1625 9.6875C5.62083 10.2625 6.125 10.8167 6.675 11.35C7.19167 11.8667 7.73333 12.3458 8.3 12.7875C8.86667 13.2292 9.46667 13.6333 10.1 14L12.45 11.65C12.6 11.5 12.7958 11.3875 13.0375 11.3125C13.2792 11.2375 13.5167 11.2167 13.75 11.25L17.2 11.95C17.4333 12.0167 17.625 12.1375 17.775 12.3125C17.925 12.4875 18 12.6833 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18ZM3.025 6L4.675 4.35L4.25 2H2.025C2.10833 2.68333 2.225 3.35833 2.375 4.025C2.525 4.69167 2.74167 5.35 3.025 6ZM11.975 14.95C12.625 15.2333 13.2875 15.4583 13.9625 15.625C14.6375 15.7917 15.3167 15.9 16 15.95V13.75L13.65 13.275L11.975 14.95Z" fill="#3D8B37" />
                                                </svg>
                                            </div>
                                            <span class="ct_para_clr">
                                                +61 3 9876 5432
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="ct_icon_circle">
                                                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V4V14V4Z" fill="#3D8B37" />
                                                </svg>
                                            </div>
                                            <span class="ct_para_clr">
                                                contact@vancare.com.au
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="ct_icon_circle">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.0125 20C8.6375 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3625 0 9.9875C0 8.6125 0.2625 7.32083 0.7875 6.1125C1.3125 4.90417 2.02917 3.84583 2.9375 2.9375C3.84583 2.02917 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.6375 0 10.0125 0C11.3875 0 12.6792 0.2625 13.8875 0.7875C15.0958 1.3125 16.1542 2.02917 17.0625 2.9375C17.9708 3.84583 18.6875 4.90417 19.2125 6.1125C19.7375 7.32083 20 8.6125 20 9.9875C20 11.3625 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.9708 16.1542 17.0625 17.0625C16.1542 17.9708 15.0958 18.6875 13.8875 19.2125C12.6792 19.7375 11.3875 20 10.0125 20ZM10 17.95C10.4333 17.35 10.8083 16.725 11.125 16.075C11.4417 15.425 11.7 14.7333 11.9 14H8.1C8.3 14.7333 8.55833 15.425 8.875 16.075C9.19167 16.725 9.56667 17.35 10 17.95ZM7.4 17.55C7.1 17 6.8375 16.4292 6.6125 15.8375C6.3875 15.2458 6.2 14.6333 6.05 14H3.1C3.58333 14.8333 4.1875 15.5583 4.9125 16.175C5.6375 16.7917 6.46667 17.25 7.4 17.55ZM12.6 17.55C13.5333 17.25 14.3625 16.7917 15.0875 16.175C15.8125 15.5583 16.4167 14.8333 16.9 14H13.95C13.8 14.6333 13.6125 15.2458 13.3875 15.8375C13.1625 16.4292 12.9 17 12.6 17.55ZM2.25 12H5.65C5.6 11.6667 5.5625 11.3375 5.5375 11.0125C5.5125 10.6875 5.5 10.35 5.5 10C5.5 9.65 5.5125 9.3125 5.5375 8.9875C5.5625 8.6625 5.6 8.33333 5.65 8H2.25C2.16667 8.33333 2.10417 8.6625 2.0625 8.9875C2.02083 9.3125 2 9.65 2 10C2 10.35 2.02083 10.6875 2.0625 11.0125C2.10417 11.3375 2.16667 11.6667 2.25 12ZM7.65 12H12.35C12.4 11.6667 12.4375 11.3375 12.4625 11.0125C12.4875 10.6875 12.5 10.35 12.5 10C12.5 9.65 12.4875 9.3125 12.4625 8.9875C12.4375 8.6625 12.4 8.33333 12.35 8H7.65C7.6 8.33333 7.5625 8.6625 7.5375 8.9875C7.5125 9.3125 7.5 9.65 7.5 10C7.5 10.35 7.5125 10.6875 7.5375 11.0125C7.5625 11.3375 7.6 11.6667 7.65 12ZM14.35 12H17.75C17.8333 11.6667 17.8958 11.3375 17.9375 11.0125C17.9792 10.6875 18 10.35 18 10C18 9.65 17.9792 9.3125 17.9375 8.9875C17.8958 8.6625 17.8333 8.33333 17.75 8H14.35C14.4 8.33333 14.4375 8.6625 14.4625 8.9875C14.4875 9.3125 14.5 9.65 14.5 10C14.5 10.35 14.4875 10.6875 14.4625 11.0125C14.4375 11.3375 14.4 11.6667 14.35 12ZM13.95 6H16.9C16.4167 5.16667 15.8125 4.44167 15.0875 3.825C14.3625 3.20833 13.5333 2.75 12.6 2.45C12.9 3 13.1625 3.57083 13.3875 4.1625C13.6125 4.75417 13.8 5.36667 13.95 6ZM8.1 6H11.9C11.7 5.26667 11.4417 4.575 11.125 3.925C10.8083 3.275 10.4333 2.65 10 2.05C9.56667 2.65 9.19167 3.275 8.875 3.925C8.55833 4.575 8.3 5.26667 8.1 6ZM3.1 6H6.05C6.2 5.36667 6.3875 4.75417 6.6125 4.1625C6.8375 3.57083 7.1 3 7.4 2.45C6.46667 2.75 5.6375 3.20833 4.9125 3.825C4.1875 4.44167 3.58333 5.16667 3.1 6Z" fill="#3D8B37" />
                                                </svg>
                                            </div>
                                            <span class="ct_para_clr">
                                                vancare.com.au
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="row">
                        {/* About Card */}
                        <div class="col-xxl-8 col-xl-7 mb-4 mb-xl-0">
                            <div class="ct_info_card">
                                <h4 class="fs-5 ct_fw_600">
                                    <svg class="me-2" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 1.75C5.66753 1.75 1.75 5.66748 1.75 10.5C1.75 15.3324 5.66753 19.25 10.5 19.25C15.3325 19.25 19.25 15.3325 19.25 10.5C19.25 5.66748 15.3325 1.75 10.5 1.75ZM10.5 17.5C6.64021 17.5 3.50001 14.3598 3.50001 10.5C3.50001 6.64017 6.64017 3.50001 10.5 3.50001C14.3598 3.50001 17.5 6.64017 17.5 10.5C17.5 14.3598 14.3598 17.5 10.5 17.5ZM11.5957 7C11.5957 7.63443 11.1338 8.09376 10.5089 8.09376C9.85875 8.09376 9.40815 7.63439 9.40815 6.98786C9.40815 6.36647 9.87093 5.90628 10.5089 5.90628C11.1338 5.90628 11.5957 6.36647 11.5957 7ZM9.62693 9.625H11.3769V14.875H9.62693V9.625Z" fill="#3D8B37" />
                                    </svg>
                                    About
                                </h4>
                                <p class="ct_para_clr mt-3 mb-0">
                                    VanCare Service Centre is an authorised service partner specialising in caravan maintenance, repairs and warranty servicing. Our experienced team ensures your caravan is road-ready and adventure-ready.
                                </p>
                                <h4 class="fs-5 ct_fw_600 mt-5">
                                    <svg class="me-2" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.1875 4.375L3.5 5.6875L6.125 3.0625" stroke="#3D8B37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M2.1875 10.5L3.5 11.8125L6.125 9.1875" stroke="#3D8B37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M2.1875 16.625L3.5 17.9375L6.125 15.3125" stroke="#3D8B37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.1875 10.5H18.8125" stroke="#3D8B37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.1875 16.625H18.8125" stroke="#3D8B37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.1875 4.375H18.8125" stroke="#3D8B37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Our Services
                                </h4>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <ul class="ct_service_list">
                                            <li>Pre-Owned Certification Process</li>
                                            <li>Climate-Controlled Indoor Showroom</li>
                                            <li>Extended Warranty Options</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <ul class="ct_service_list">
                                            <li>Flexible Leasing Programs</li>
                                            <li>Competitive Trade-In Values</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Business Hours */}
                        <div class="col-xxl-4 col-xl-5 mb-4 mb-xl-0">
                            <div class="ct_info_card">
                                <h4 class="fs-5 ct_fw_600">
                                    <svg class="me-2" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5 19.6875C5.43375 19.6875 1.3125 15.5662 1.3125 10.5C1.3125 5.43375 5.43375 1.3125 10.5 1.3125C15.5662 1.3125 19.6875 5.43375 19.6875 10.5C19.6875 15.5662 15.5662 19.6875 10.5 19.6875ZM10.5 2.625C6.15562 2.625 2.625 6.15562 2.625 10.5C2.625 14.8444 6.15562 18.375 10.5 18.375C14.8444 18.375 18.375 14.8444 18.375 10.5C18.375 6.15562 14.8444 2.625 10.5 2.625Z" fill="#3D8B37" />
                                        <path d="M13.125 13.7812C13.0069 13.7812 12.8888 13.755 12.7838 13.6894L9.50251 11.7206C9.40577 11.6617 9.32591 11.5788 9.27071 11.4799C9.21552 11.381 9.18685 11.2695 9.18751 11.1562V5.90625C9.18751 5.53875 9.47626 5.25 9.84376 5.25C10.2113 5.25 10.5 5.53875 10.5 5.90625V10.7888L13.4663 12.5606C13.5884 12.6355 13.6829 12.7482 13.7352 12.8816C13.7876 13.015 13.7951 13.1618 13.7565 13.2998C13.7179 13.4378 13.6354 13.5595 13.5214 13.6463C13.4075 13.7332 13.2683 13.7806 13.125 13.7812Z" fill="#3D8B37" />
                                    </svg>
                                    Business Hours
                                </h4>
                                <div class="ct_business_hours mt-4">
                                    <div class="ct_hours_item">
                                        <span class="text-nowrap">Monday</span>
                                        <span>09:00 AM - 08:00 PM</span>
                                    </div>
                                    <div class="ct_hours_item">
                                        <span class="text-nowrap">Tuesday</span>
                                        <span>09:00 AM - 08:00 PM</span>
                                    </div>
                                    <div class="ct_hours_item">
                                        <span class="text-nowrap">Wednesday</span>
                                        <span>09:00 AM - 08:00 PM</span>
                                    </div>
                                    <div class="ct_hours_item">
                                        <span class="text-nowrap">Thursday</span>
                                        <span>09:00 AM - 08:00 PM</span>
                                    </div>
                                    <div class="ct_hours_item">
                                        <span class="text-nowrap">Friday</span>
                                        <span>09:00 AM - 08:00 PM</span>
                                    </div>
                                    <div class="ct_hours_item">
                                        <span class="text-nowrap">Saturday</span>
                                        <span>10:00 AM - 06:00 PM</span>
                                    </div>
                                    <div class="ct_hours_item border-0">
                                        <span class="text-nowrap">Sunday</span>
                                        <span class="ct_closed_badge">
                                            Closed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Block User Modal */}
            <div class="modal fade" id="blockUserModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content ct_modal">

                        <div class="modal-body p-4 position-relative">

                            {/* Close */}
                            <button
                                type="button"
                                class="btn-close ct_delete_close"
                                data-bs-dismiss="modal">
                                <i class="fa-solid fa-xmark"></i>
                            </button>

                            {/* Heading */}
                            <h3 class="ct_head_clr ct_fw_600 mb-3">
                                Block?
                            </h3>

                            {/* Description */}
                            <p class="ct_para_clr ct_fs_18 mb-5">
                                Are you sure you want to block this user?
                            </p>

                            {/* Buttons */}
                            <div class="d-flex gap-3">

                                <button
                                    type="button"
                                    class="btn ct_btn_gray ct_btn_h_50 w-100"
                                    data-bs-dismiss="modal">
                                    No, Cancel
                                </button>

                                <button
                                    type="button"
                                    class="btn ct_green_btn ct_btn_h_50 w-100" data-bs-dismiss="modal">
                                    Yes, Block
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ServiceProviderDetail