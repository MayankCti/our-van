import { Link } from 'react-router-dom'
import Layout from '../../layout/Layout'
import { pageRoutes } from '../../routes/PageRoutes'
import Header from '../../layout/Header'

const DealerDetail = () => {

    return (
        <Layout>
            <div class="ct_right_panel">
                <Header />
                <div class="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-start gap-2">
                    <Link to={pageRoutes.owners}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25 30L15 20L25 10" stroke="#1E293B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </Link>
                    <div>
                        <h4 class="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Dealer Details</h4>
                        <p class="mb-0 ct_para_clr">View and manage dealer information, vans, owners, and activities.</p>
                    </div>
                </div>
                <div class="ct_px_30 mt-4 pb-4">
                    <div class="container-fluid">
                        <div class="ct_profile_card mb-4" style={{ paddingBlock: "34px" }}>
                            {/* Top Card */}
                            <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-4">
                                <div class="d-flex align-items-center gap-4 ct_flex_col_575">
                                    <img src="assets/img/abc.jpg"
                                        class="rounded-circle"
                                        width="85"
                                        height="85"
                                        alt="" />
                                    <div>
                                        <h4 class="fs-4 ct_fw_600 ct_head_clr mb-2">
                                            ABC Caravans

                                        </h4>
                                        <p class="ct_para_clr ct_fs_14 mb-1">
                                            <svg width="20" height="20" class="me-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.96484 6.42833L7.78151 10.3067C8.58401 10.8408 8.98484 11.1083 9.41818 11.2125C9.80151 11.3042 10.2007 11.3042 10.5832 11.2125C11.0165 11.1083 11.4173 10.8408 12.2198 10.3067L18.0365 6.42833M5.96484 16.25H14.0365C15.4365 16.25 16.1365 16.25 16.6715 15.9775C17.1416 15.7377 17.5237 15.3553 17.7632 14.885C18.0365 14.35 18.0365 13.65 18.0365 12.25V7.75C18.0365 6.35 18.0365 5.65 17.764 5.115C17.5243 4.64462 17.1419 4.26218 16.6715 4.0225C16.1365 3.75 15.4365 3.75 14.0365 3.75H5.96484C4.56484 3.75 3.86484 3.75 3.32984 4.0225C2.85977 4.26232 2.47764 4.64474 2.23818 5.115C1.96484 5.65 1.96484 6.35 1.96484 7.75V12.25C1.96484 13.65 1.96484 14.35 2.23734 14.885C2.47702 15.3554 2.85946 15.7378 3.32984 15.9775C3.86484 16.25 4.56484 16.25 5.96484 16.25Z" stroke="#475569" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            contact@abccaravans.com


                                        </p>
                                        <p class="ct_para_clr ct_fs_14 mb-0">
                                            <svg width="20" height="20" class="me-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.52146 13.4756C4.7293 11.68 3.35106 9.51448 2.48313 7.13061C2.00563 5.82727 2.44313 4.39561 3.42479 3.41394L4.03229 2.80727C4.19562 2.64362 4.38961 2.51379 4.60317 2.4252C4.81673 2.33661 5.04567 2.29102 5.27688 2.29102C5.50808 2.29102 5.73702 2.33661 5.95058 2.4252C6.16414 2.51379 6.35814 2.64362 6.52146 2.80727L7.94396 4.22977C8.10761 4.3931 8.23745 4.58709 8.32603 4.80065C8.41462 5.01422 8.46022 5.24315 8.46022 5.47436C8.46022 5.70556 8.41462 5.9345 8.32603 6.14806C8.23745 6.36162 8.10761 6.55562 7.94396 6.71894L7.59396 7.06894C7.45386 7.20901 7.34273 7.3753 7.26691 7.55832C7.19109 7.74134 7.15207 7.9375 7.15207 8.13561C7.15207 8.33371 7.19109 8.52988 7.26691 8.7129C7.34273 8.89592 7.45386 9.06221 7.59396 9.20227L10.794 12.4031C10.934 12.5432 11.1003 12.6543 11.2833 12.7302C11.4664 12.806 11.6625 12.845 11.8606 12.845C12.0587 12.845 12.2549 12.806 12.4379 12.7302C12.6209 12.6543 12.7872 12.5432 12.9273 12.4031L13.2781 12.0531C13.4414 11.8895 13.6354 11.7596 13.849 11.671C14.0626 11.5824 14.2915 11.5368 14.5227 11.5368C14.7539 11.5368 14.9829 11.5824 15.1964 11.671C15.41 11.7596 15.604 11.8895 15.7673 12.0531L17.1898 13.4756C17.3534 13.6389 17.4833 13.8329 17.5719 14.0465C17.6605 14.26 17.7061 14.489 17.7061 14.7202C17.7061 14.9514 17.6605 15.1803 17.5719 15.3939C17.4833 15.6075 17.3534 15.8015 17.1898 15.9648L16.5831 16.5714C15.6015 17.5539 14.1698 17.9914 12.8665 17.5139C10.4826 16.646 8.3171 15.2678 6.52146 13.4756Z" stroke="#475569" stroke-width="1.5" stroke-linejoin="round" />
                                            </svg>
                                            +61 1800 555 123


                                        </p>
                                    </div>
                                </div>
                                <button class="ct_custom_badge text-nowrap" data-bs-target="#blockUserModal" data-bs-toggle="modal">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.40261 14.1419C4.59149 13.7917 3.88594 13.3166 3.28594 12.7166C2.68594 12.1166 2.21105 11.411 1.86127 10.5999C1.51149 9.78881 1.33638 8.92214 1.33594 7.99992C1.33549 7.0777 1.51061 6.21103 1.86127 5.39992C2.21194 4.58881 2.68683 3.88325 3.28594 3.28325C3.88505 2.68325 4.59061 2.20836 5.40261 1.85859C6.21461 1.50881 7.08127 1.3337 8.0026 1.33325C8.92394 1.33281 9.7906 1.50792 10.6026 1.85859C11.4146 2.20925 12.1202 2.68414 12.7193 3.28325C13.3184 3.88236 13.7935 4.58792 14.1446 5.39992C14.4957 6.21192 14.6706 7.07859 14.6693 7.99992C14.6679 8.92125 14.4928 9.78792 14.1439 10.5999C13.795 11.4119 13.3202 12.1175 12.7193 12.7166C12.1184 13.3157 11.4128 13.7908 10.6026 14.1419C9.79238 14.493 8.92572 14.6679 8.0026 14.6666C7.07949 14.6653 6.21283 14.4908 5.40261 14.1419ZM8.0026 13.3333C8.6026 13.3333 9.18038 13.2361 9.73594 13.0419C10.2915 12.8477 10.8026 12.567 11.2693 12.1999L3.8026 4.73325C3.43594 5.19992 3.15527 5.71103 2.9606 6.26659C2.76594 6.82214 2.66883 7.39992 2.66927 7.99992C2.66927 9.48881 3.18594 10.7499 4.21927 11.7833C5.2526 12.8166 6.51372 13.3333 8.0026 13.3333ZM12.2026 11.2666C12.5693 10.7999 12.8499 10.2888 13.0446 9.73325C13.2393 9.1777 13.3364 8.59992 13.3359 7.99992C13.3359 6.51103 12.8193 5.24992 11.7859 4.21659C10.7526 3.18325 9.49149 2.66659 8.0026 2.66659C7.4026 2.66659 6.82483 2.7637 6.26927 2.95792C5.71372 3.15214 5.2026 3.43281 4.73594 3.79992L12.2026 11.2666Z" fill="#EF4444" />
                                    </svg>
                                    Block
                                </button>
                            </div>
                        </div>
                        {/* Heading */}
                        <div class="d-flex justify-content-between align-items-end mb-3">
                            <div>
                                <h5 class="ct_fw_600 ct_head_clr mb-1">
                                    Assigned Vans
                                </h5>
                                <p class="ct_para_clr ct_fs_12 mb-0">
                                    View all vans registered under this dealership.
                                </p>
                            </div>
                        </div>
                        {/* Table */}
                        <div class="ct_table_wrapper p-0">
                            <div class="table-responsive">
                                <table class="table ct_custom_table align-middle">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Van Name</th>
                                            <th>Registration Number</th>
                                            <th>Owner Name </th>
                                            <th>Date Registered</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Jayco Journey</td>
                                            <td>NSW 482 XYZ</td>
                                            <td>John Smith</td>
                                            <td>13 Jul 2026</td>
                                            <td>
                                                <Link to={pageRoutes?.van_detail} class="ct_action_link">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Nova Terra</td>
                                            <td>QLD-7621</td>
                                            <td>Emma Wilson</td>
                                            <td>17 Sep 2026</td>
                                            <td>
                                                <Link to={pageRoutes?.van_detail} class="ct_action_link">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Horizon LX</td>
                                            <td>VIC-9834</td>
                                            <td>David Brown</td>
                                            <td>26 Jan 2026</td>
                                            <td>
                                                <Link to={pageRoutes?.van_detail} class="ct_action_link">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>New Age Road Owl</td>
                                            <td>WA-3185</td>
                                            <td>Olivia Taylor</td>
                                            <td>5 Oct 2026</td>
                                            <td>
                                                <Link to={pageRoutes?.van_detail} class="ct_action_link">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>Sunliner Habitat</td>
                                            <td>SA-9042</td>
                                            <td>Michael Wilson</td>
                                            <td>11 Apr 2026</td>
                                            <td>
                                                <Link to={pageRoutes?.van_detail} class="ct_action_link">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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

export default DealerDetail