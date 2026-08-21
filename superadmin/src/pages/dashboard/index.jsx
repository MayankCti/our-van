import Layout from "../../layout/Layout"

const Dashboard = () => {
  return (

    <Layout>
      <div class="ct_right_panel">
        <header>
          <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-bars me-3 ct_fs_18 ct_menu_bar"></i>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="ct_border_right_1">
              <a href="notification.html" class="ct_notification_icon">
                <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 4.12501C16.5 5.89417 15.0608 7.33334 13.2917 7.33334C11.5225 7.33334 10.0833 5.89417 10.0833 4.12501C10.0833 2.35584 11.5225 0.916672 13.2917 0.916672C15.0608 0.916672 16.5 2.35584 16.5 4.12501ZM14.6667 8.97417C14.2083 9.09334 13.75 9.16667 13.2917 9.16667C11.9553 9.16425 10.6743 8.6323 9.72935 7.68733C8.78438 6.74236 8.25242 5.46139 8.25 4.12501C8.25 2.77751 8.78167 1.55834 9.625 0.650838C9.45865 0.446917 9.24889 0.282678 9.01102 0.170087C8.77316 0.0574962 8.51317 -0.000609129 8.25 4.81496e-06C7.24167 4.81496e-06 6.41667 0.825005 6.41667 1.83334V2.09917C3.69417 2.90584 1.83333 5.40834 1.83333 8.25001V13.75L0 15.5833V16.5H16.5V15.5833L14.6667 13.75V8.97417ZM8.25 19.25C9.2675 19.25 10.0833 18.4342 10.0833 17.4167H6.41667C6.41667 17.9029 6.60982 18.3692 6.95364 18.713C7.29745 19.0569 7.76377 19.25 8.25 19.25Z" fill="#475569" />
                </svg>
              </a>
            </div>
            <div class="ct_right_dropdown dropdown">
              <button id="dropdownMenuButton" data-bs-toggle="dropdown"
                aria-expanded="false">
                <div class="d-flex align-items-center gap-2">
                  <img src="assets/img/profile_img.png" alt="" class="ct_img_25" />
                  <div class="text-start">
                    {/* <p class="mb-0 ct_fw_500">Alice Johnson</p> */}
                    <small class="ct_text_939393">James Wilson</small>
                  </div>
                </div>
                <i class="fa-solid fa-angle-down ms-auto"></i>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <div class="ct_profile_dtl">
                    <h6>James Wilson</h6>
                    <p class="mb-0">jameswilson@email.com</p>
                  </div>
                </li>
                <li>
                  <a class="dropdown-item" href="edit-profile.html">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5601 11.87C9.81838 11.87 9.09336 11.6501 8.47667 11.238C7.85999 10.826 7.37934 10.2403 7.09551 9.55506C6.81168 8.86984 6.73742 8.11584 6.88211 7.38841C7.02681 6.66098 7.38396 5.99279 7.90841 5.46835C8.43286 4.9439 9.10104 4.58675 9.82847 4.44205C10.5559 4.29736 11.3099 4.37162 11.9951 4.65545C12.6803 4.93928 13.266 5.41992 13.6781 6.03661C14.0901 6.65329 14.3101 7.37832 14.3101 8.12C14.3074 9.11375 13.9115 10.066 13.2088 10.7687C12.5061 11.4714 11.5538 11.8674 10.5601 11.87ZM10.5601 5.87C10.1151 5.87 9.68004 6.00196 9.31003 6.24919C8.94002 6.49642 8.65163 6.84783 8.48133 7.25896C8.31103 7.67009 8.26648 8.12249 8.35329 8.55895C8.44011 8.99541 8.6544 9.39632 8.96907 9.71099C9.28374 10.0257 9.68465 10.2399 10.1211 10.3268C10.5576 10.4136 11.01 10.369 11.4211 10.1987C11.8322 10.0284 12.1836 9.74004 12.4309 9.37003C12.6781 9.00002 12.8101 8.565 12.8101 8.12C12.8101 7.52326 12.573 6.95096 12.151 6.52901C11.7291 6.10705 11.1568 5.87 10.5601 5.87ZM3.56006 18.87C3.36115 18.87 3.17038 18.791 3.02973 18.6503C2.88908 18.5097 2.81006 18.3189 2.81006 18.12C2.81006 13.37 8.24006 13.37 10.5601 13.37C11.2801 13.37 11.9201 13.37 12.5001 13.44C12.6973 13.4553 12.8806 13.548 13.0098 13.6979C13.1391 13.8477 13.2038 14.0426 13.1901 14.24C13.1722 14.4381 13.0774 14.6214 12.926 14.7504C12.7745 14.8794 12.5785 14.9439 12.3801 14.93C11.8401 14.93 11.2401 14.87 10.5601 14.87C5.38006 14.87 4.31006 16.17 4.31006 18.12C4.3114 18.2189 4.29292 18.317 4.25571 18.4086C4.21849 18.5002 4.1633 18.5834 4.09339 18.6533C4.02347 18.7232 3.94026 18.7784 3.84866 18.8156C3.75705 18.8529 3.65892 18.8713 3.56006 18.87ZM12.6701 19.63C12.4712 19.6298 12.2806 19.5507 12.1401 19.41C12.0611 19.3347 12.0003 19.2425 11.9621 19.1403C11.924 19.0381 11.9096 18.9286 11.9201 18.82L12.0801 16.9C12.0924 16.7235 12.1668 16.557 12.2901 16.43L17.8101 10.91C18.1909 10.5572 18.6909 10.3612 19.2101 10.3612C19.7292 10.3612 20.2292 10.5572 20.6101 10.91C20.7978 11.0992 20.9459 11.3241 21.0455 11.5714C21.1451 11.8187 21.1942 12.0834 21.1901 12.35C21.194 12.5957 21.1491 12.8398 21.0582 13.068C20.9672 13.2963 20.8319 13.5043 20.6601 13.68L15.1401 19.2C15.0176 19.3255 14.8546 19.4035 14.6801 19.42L12.7401 19.6L12.6701 19.63ZM13.5501 17.29L13.4901 18.05L14.2701 17.98L19.6001 12.65C19.6621 12.5741 19.6942 12.478 19.6901 12.38C19.6888 12.2409 19.6394 12.1066 19.5501 12C19.4518 11.9269 19.3325 11.8875 19.2101 11.8875C19.0876 11.8875 18.9684 11.9269 18.8701 12L13.5501 17.29Z" fill="#475569" />
                    </svg>
                    Edit Profile
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="change-password.html">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.7499 10C12.7499 9.80109 12.6709 9.61032 12.5303 9.46967C12.3896 9.32902 12.1988 9.25 11.9999 9.25C11.801 9.25 11.6103 9.32902 11.4696 9.46967C11.3289 9.61032 11.2499 9.80109 11.2499 10V10.701L10.6429 10.351C10.4713 10.2596 10.2709 10.2384 10.084 10.2919C9.89712 10.3454 9.73828 10.4694 9.64102 10.6378C9.54375 10.8061 9.51565 11.0056 9.56265 11.1943C9.60964 11.3829 9.72806 11.546 9.89293 11.649L10.4999 11.999L9.89293 12.35C9.72054 12.4495 9.59472 12.6133 9.54314 12.8055C9.49157 12.9978 9.51847 13.2026 9.61793 13.375C9.71738 13.5474 9.88125 13.6732 10.0735 13.7248C10.2657 13.7764 10.4705 13.7495 10.6429 13.65L11.2499 13.299V14C11.2499 14.1989 11.3289 14.3897 11.4696 14.5303C11.6103 14.671 11.801 14.75 11.9999 14.75C12.1988 14.75 12.3896 14.671 12.5303 14.5303C12.6709 14.3897 12.7499 14.1989 12.7499 14V13.3L13.3569 13.65C13.5293 13.7495 13.7342 13.7764 13.9264 13.7248C14.1186 13.6732 14.2825 13.5474 14.3819 13.375C14.4814 13.2026 14.5083 12.9978 14.4567 12.8055C14.4051 12.6133 14.2793 12.4495 14.1069 12.35L13.4999 12L14.1069 11.65C14.2793 11.5505 14.4051 11.3867 14.4567 11.1945C14.5083 11.0022 14.4814 10.7974 14.3819 10.625C14.2825 10.4526 14.1186 10.3268 13.9264 10.2752C13.7342 10.2236 13.5293 10.2505 13.3569 10.35L12.7499 10.7V10ZM6.73293 9.25C6.93184 9.25 7.12261 9.32902 7.26326 9.46967C7.40391 9.61032 7.48293 9.80109 7.48293 10V10.7L8.08893 10.35C8.26132 10.2505 8.46616 10.2236 8.65838 10.2752C8.85061 10.3268 9.01447 10.4526 9.11393 10.625C9.21339 10.7974 9.24029 11.0022 9.18871 11.1945C9.13714 11.3867 9.01132 11.5505 8.83893 11.65L8.23193 12L8.83893 12.35C8.92429 12.3992 8.99911 12.4648 9.05913 12.543C9.11914 12.6211 9.16318 12.7104 9.18871 12.8055C9.21425 12.9007 9.22079 13 9.20796 13.0977C9.19512 13.1954 9.16317 13.2896 9.11393 13.375C9.06468 13.4604 8.99911 13.5352 8.92094 13.5952C8.84278 13.6552 8.75356 13.6992 8.65838 13.7248C8.5632 13.7503 8.46392 13.7569 8.36622 13.744C8.26851 13.7312 8.17429 13.6992 8.08893 13.65L7.48293 13.3V14C7.48293 14.1989 7.40391 14.3897 7.26326 14.5303C7.12261 14.671 6.93184 14.75 6.73293 14.75C6.53402 14.75 6.34325 14.671 6.2026 14.5303C6.06195 14.3897 5.98293 14.1989 5.98293 14V13.299L5.37493 13.649C5.20333 13.7404 5.00294 13.7616 4.81603 13.7081C4.62912 13.6546 4.47029 13.5306 4.37302 13.3622C4.27575 13.1939 4.24765 12.9944 4.29465 12.8057C4.34164 12.6171 4.46006 12.454 4.62493 12.351L5.23193 12L4.62493 11.65C4.53957 11.6008 4.46475 11.5352 4.40473 11.457C4.34471 11.3789 4.30068 11.2896 4.27514 11.1945C4.24961 11.0993 4.24307 11 4.2559 10.9023C4.26873 10.8046 4.30068 10.7104 4.34993 10.625C4.39917 10.5396 4.46475 10.4648 4.54291 10.4048C4.62108 10.3448 4.71029 10.3008 4.80547 10.2752C4.90065 10.2497 4.99993 10.2431 5.09764 10.256C5.19535 10.2688 5.28957 10.3008 5.37493 10.35L5.98293 10.701V10C5.98293 9.80109 6.06195 9.61032 6.2026 9.46967C6.34325 9.32902 6.53402 9.25 6.73293 9.25ZM18.0179 10C18.0179 9.80109 17.9389 9.61032 17.7983 9.46967C17.6576 9.32902 17.4668 9.25 17.2679 9.25C17.069 9.25 16.8783 9.32902 16.7376 9.46967C16.5969 9.61032 16.5179 9.80109 16.5179 10V10.701L15.9109 10.351C15.7393 10.2596 15.5389 10.2384 15.352 10.2919C15.1651 10.3454 15.0063 10.4694 14.909 10.6378C14.8118 10.8061 14.7837 11.0056 14.8306 11.1943C14.8776 11.3829 14.9961 11.546 15.1609 11.649L15.7679 11.999L15.1599 12.35C14.9875 12.4495 14.8617 12.6133 14.8101 12.8055C14.7586 12.9978 14.7855 13.2026 14.8849 13.375C14.9844 13.5474 15.1482 13.6732 15.3405 13.7248C15.5327 13.7764 15.7375 13.7495 15.9099 13.65L16.5179 13.299V14C16.5179 14.1989 16.5969 14.3897 16.7376 14.5303C16.8783 14.671 17.069 14.75 17.2679 14.75C17.4668 14.75 17.6576 14.671 17.7983 14.5303C17.9389 14.3897 18.0179 14.1989 18.0179 14V13.3L18.6249 13.65C18.7973 13.7495 19.0022 13.7764 19.1944 13.7248C19.3866 13.6732 19.5505 13.5474 19.6499 13.375C19.7494 13.2026 19.7763 12.9978 19.7247 12.8055C19.6731 12.6133 19.5473 12.4495 19.3749 12.35L18.7679 12L19.3749 11.65C19.5473 11.5505 19.6731 11.3867 19.7247 11.1945C19.7763 11.0022 19.7494 10.7974 19.6499 10.625C19.5505 10.4526 19.3866 10.3268 19.1944 10.2752C19.0022 10.2236 18.7973 10.2505 18.6249 10.35L18.0179 10.7V10Z" fill="#475569" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.944 3.25C8.106 3.25 6.65 3.25 5.511 3.403C4.339 3.561 3.39 3.893 2.641 4.641C1.893 5.39 1.561 6.339 1.403 7.511C1.25 8.651 1.25 10.106 1.25 11.944V12.056C1.25 13.894 1.25 15.35 1.403 16.489C1.561 17.661 1.893 18.61 2.641 19.359C3.39 20.107 4.339 20.439 5.511 20.597C6.651 20.75 8.106 20.75 9.944 20.75H14.056C15.894 20.75 17.35 20.75 18.489 20.597C19.661 20.439 20.61 20.107 21.359 19.359C22.107 18.61 22.439 17.661 22.597 16.489C22.75 15.349 22.75 13.894 22.75 12.056V11.944C22.75 10.106 22.75 8.65 22.597 7.511C22.439 6.339 22.107 5.39 21.359 4.641C20.61 3.893 19.661 3.561 18.489 3.403C17.349 3.25 15.894 3.25 14.056 3.25H9.944ZM3.702 5.702C4.125 5.279 4.705 5.025 5.711 4.89C6.739 4.752 8.093 4.75 10 4.75H14C15.907 4.75 17.262 4.752 18.29 4.89C19.295 5.025 19.875 5.279 20.298 5.702C20.721 6.125 20.975 6.705 21.11 7.711C21.248 8.739 21.25 10.093 21.25 12C21.25 13.907 21.248 15.262 21.11 16.29C20.975 17.295 20.721 17.875 20.298 18.298C19.875 18.721 19.295 18.975 18.289 19.11C17.262 19.248 15.907 19.25 14 19.25H10C8.093 19.25 6.739 19.248 5.71 19.11C4.705 18.975 4.125 18.721 3.702 18.298C3.279 17.875 3.025 17.295 2.89 16.289C2.752 15.261 2.75 13.907 2.75 12C2.75 10.093 2.752 8.739 2.89 7.71C3.025 6.705 3.279 6.125 3.702 5.702Z" fill="#475569" />
                    </svg>
                    Change Password
                  </a>
                </li>
                <li>
                  <a class="dropdown-item ct_red_text " href="javascript:void(0)" data-bs-toggle="modal"
                    data-bs-target="#ct_logout_modal_post">
                    <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.8999 6.61496C9.1607 3.46496 10.717 2.17871 14.1242 2.17871H14.2336C17.994 2.17871 19.4999 3.74496 19.4999 7.65621V13.3612C19.4999 17.2725 17.994 18.8387 14.2336 18.8387H14.1242C10.7423 18.8387 9.18593 17.57 8.90832 14.4725" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M14.9999 10.5H3.61987" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M5.85024 7.5686L2.50024 10.4999L5.85024 13.4311" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <div class="ct_inner_header_bg mt-4 ct_px_30">
          <h4 class="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Dashboard</h4>
          <p class="mb-0 ct_para_clr">Manage your vans, customers, and ownership profiles from one place.</p>
        </div>
        <div class="ct_px_30 mt-4 pb-4">
          <div class="row">
            {/* Card 1 */}
            <div class="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div class="ct_dash_card">
                <div class="ct_icon_box">
                  <img src="assets/img/dash_icon_1.png" alt="" />
                </div>
                <div class="ct_card_content">
                  <h3>74</h3>
                  <p>Total Vans</p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div class="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div class="ct_dash_card">
                <div class="ct_icon_box">
                  <img src="assets/img/dash_icon_2.png" alt="" />
                </div>
                <div class="ct_card_content">
                  <h3>74</h3>
                  <p>Total Owners</p>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div class="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div class="ct_dash_card">
                <div class="ct_icon_box">
                  <img src="assets/img/dash_icon_3.png" alt="" />
                </div>
                <div class="ct_card_content">
                  <h3>8</h3>
                  <p>Total Dealers</p>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div class="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div class="ct_dash_card">
                <div class="ct_icon_box">
                  <img src="assets/img/dash_icon_4.png" alt="" />
                </div>
                <div class="ct_card_content">
                  <h3>14</h3>
                  <p>Upcoming Services</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row  mt-4">
            <div class="col-xl-8 mb-4 mb-xl-0">
              <div class="ct_table_wrapper">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="ct_section_title mb-0">Recent Registrations</h5>
                </div>
                <div class="table-responsive ct_custom_table">
                  <table class="table  align-middle mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Owner Name</th>
                        <th>Van Name</th>
                        <th>Registration Number</th>
                        <th>Dealer</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>John Smith</td>
                        <td>Jayco Journey</td>
                        <td>NSW 482 XYZ</td>
                        <td>ABC Caravans</td>
                        <td>13 Jul 2026</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Jaiden Nixon</td>
                        <td>Jayco Journey</td>
                        <td>NSW 482 XYZ</td>
                        <td>ABC Caravans</td>
                        <td>13 Jul 2026</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>John Smith</td>
                        <td>Jayco Journey</td>
                        <td>NSW 482 XYZ</td>
                        <td>ABC Caravans</td>
                        <td>13 Jul 2026</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Nikolai Schmidt</td>
                        <td>Jayco Journey</td>
                        <td>NSW 482 XYZ</td>
                        <td>ABC Caravans</td>
                        <td>13 Jul 2026</td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>John Smith</td>
                        <td>Jayco Journey</td>
                        <td>NSW 482 XYZ</td>
                        <td>ABC Caravans</td>
                        <td>13 Jul 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-xl-4 mb-4 mb-xl-0">
              <h5 class="ct_section_title mb-3">Quick Actions</h5>
              <div class="menu-card d-flex align-items-center" data-bs-toggle="modal"
                data-bs-target="#addDealerModal">
                <div class="icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_271_683)">
                      <path d="M14.5 10.5L9.934 12L9 11.066L13.132 7.5H15L18 9L20.5 9.5V16L18.5 16.5H13.874" stroke="#3D8B37" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.5 15L6.097 15.5L10.049 19.451L11.758 19.157L12.052 17.448L13.761 17.153L14.056 15.444L15.764 15.15L16.059 13.441L13.46 10.842M11.514 8.896L9.618 7L6 8.5L3.5 9M3.5 7.5H0.5V16.5H3.5V7.5ZM23.5 8.5H20.5V17.5H23.5V8.5Z" stroke="#3D8B37" stroke-miterlimit="10" stroke-linejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_271_683">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h5>Add Dealer</h5>
                  <p>Create a new dealer</p>
                </div>
                <div class="arrow">
                  <i class="fa-solid fa-angle-right"></i>
                </div>
              </div>
              {/* Card */}
              <div class="menu-card d-flex align-items-center" data-bs-toggle="modal"
                data-bs-target="#addServiceProviderModal">
                <div class="icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_271_688)">
                      <path d="M12.2344 8.32031L2.21484 18.3516C1.98828 18.5781 1.8125 18.8398 1.6875 19.1367C1.5625 19.4336 1.5 19.7461 1.5 20.0742C1.5 20.4023 1.5625 20.7148 1.6875 21.0117C1.8125 21.3086 1.98828 21.5664 2.21484 21.7852C2.44141 22.0039 2.69922 22.1758 2.98828 22.3008C3.27734 22.4258 3.58984 22.4922 3.92578 22.5C4.24609 22.5 4.55469 22.4375 4.85156 22.3125C5.14844 22.1875 5.41406 22.0117 5.64844 21.7852L12 15.4453V17.5664L6.71484 22.8516C6.33984 23.2266 5.91406 23.5117 5.4375 23.707C4.96094 23.9023 4.45703 24 3.92578 24C3.38672 24 2.88281 23.8984 2.41406 23.6953C1.94531 23.4922 1.52734 23.207 1.16016 22.8398C0.792969 22.4727 0.511719 22.0586 0.316406 21.5977C0.121094 21.1367 0.015625 20.6289 0 20.0742C0 19.5352 0.0976563 19.0312 0.292969 18.5625C0.488281 18.0938 0.773438 17.668 1.14844 17.2852L10.5938 7.83984C10.5625 7.66016 10.5391 7.48047 10.5234 7.30078C10.5078 7.12109 10.5 6.9375 10.5 6.75C10.5 6.13281 10.5781 5.53906 10.7344 4.96875C10.8906 4.39844 11.1172 3.85938 11.4141 3.35156C11.7109 2.84375 12.0664 2.38672 12.4805 1.98047C12.8945 1.57422 13.3516 1.22266 13.8516 0.925781C14.3516 0.628906 14.8867 0.402344 15.457 0.246094C16.0273 0.0898438 16.625 0.0078125 17.25 0C17.6719 0 18.0586 0.03125 18.4102 0.09375C18.7617 0.15625 19.1055 0.25 19.4414 0.375C19.7773 0.5 20.1016 0.648438 20.4141 0.820312C20.7266 0.992188 21.0625 1.17969 21.4219 1.38281L16.8047 6L18 7.19531L22.6172 2.57812C22.8047 2.90625 22.9805 3.23438 23.1445 3.5625C23.3086 3.89062 23.457 4.23047 23.5898 4.58203C23.7227 4.93359 23.8281 5.28516 23.9062 5.63672C23.9844 5.98828 24.0234 6.36328 24.0234 6.76172C24.0234 7.27734 23.9609 7.78906 23.8359 8.29688C23.7109 8.80469 23.5273 9.28906 23.2852 9.75C23.043 10.2109 22.7617 10.6445 22.4414 11.0508C22.1211 11.457 21.75 11.8164 21.3281 12.1289C20.9688 11.9883 20.6016 11.8789 20.2266 11.8008C19.8516 11.7227 19.4688 11.6758 19.0781 11.6602C19.5859 11.4727 20.0508 11.2148 20.4727 10.8867C20.8945 10.5586 21.2539 10.1836 21.5508 9.76172C21.8477 9.33984 22.082 8.875 22.2539 8.36719C22.4258 7.85938 22.5078 7.33203 22.5 6.78516C22.5 6.19922 22.4062 5.63672 22.2188 5.09766L18 9.30469L14.6953 6L18.9023 1.78125C18.3711 1.59375 17.8203 1.5 17.25 1.5C16.5234 1.5 15.8438 1.63672 15.2109 1.91016C14.5781 2.18359 14.0234 2.55859 13.5469 3.03516C13.0703 3.51172 12.6953 4.06641 12.4219 4.69922C12.1484 5.33203 12.0078 6.01562 12 6.75C12 7.01562 12.0234 7.27734 12.0703 7.53516C12.1172 7.79297 12.1719 8.05469 12.2344 8.32031ZM18.75 13.5C19.4766 13.5 20.1562 13.6367 20.7891 13.9102C21.4219 14.1836 21.9805 14.5586 22.4648 15.0352C22.9492 15.5117 23.3242 16.0664 23.5898 16.6992C23.8555 17.332 23.9922 18.0156 24 18.75C24 19.4766 23.8633 20.1562 23.5898 20.7891C23.3164 21.4219 22.9414 21.9805 22.4648 22.4648C21.9883 22.9492 21.4336 23.3242 20.8008 23.5898C20.168 23.8555 19.4844 23.9922 18.75 24C18.0234 24 17.3438 23.8633 16.7109 23.5898C16.0781 23.3164 15.5195 22.9414 15.0352 22.4648C14.5508 21.9883 14.1758 21.4336 13.9102 20.8008C13.6445 20.168 13.5078 19.4844 13.5 18.75C13.5 18.0234 13.6367 17.3438 13.9102 16.7109C14.1836 16.0781 14.5586 15.5195 15.0352 15.0352C15.5117 14.5508 16.0664 14.1758 16.6992 13.9102C17.332 13.6445 18.0156 13.5078 18.75 13.5ZM15 18.75C15 19.2656 15.0977 19.75 15.293 20.2031C15.4883 20.6562 15.7539 21.0547 16.0898 21.3984C16.4258 21.7422 16.8242 22.0117 17.2852 22.207C17.7461 22.4023 18.2344 22.5 18.75 22.5C19.1172 22.5 19.4766 22.4492 19.8281 22.3477C20.1797 22.2461 20.5078 22.0898 20.8125 21.8789L15.6211 16.6875C15.418 16.9922 15.2656 17.3203 15.1641 17.6719C15.0625 18.0234 15.0078 18.3828 15 18.75ZM21.8789 20.8125C22.082 20.5078 22.2344 20.1797 22.3359 19.8281C22.4375 19.4766 22.4922 19.1172 22.5 18.75C22.5 18.2344 22.4023 17.75 22.207 17.2969C22.0117 16.8438 21.7422 16.4492 21.3984 16.1133C21.0547 15.7773 20.6562 15.5078 20.2031 15.3047C19.75 15.1016 19.2656 15 18.75 15C18.3828 15 18.0234 15.0508 17.6719 15.1523C17.3203 15.2539 16.9922 15.4102 16.6875 15.6211L21.8789 20.8125Z" fill="#3D8B37" />
                    </g>
                    <defs>
                      <clipPath id="clip0_271_688">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h5>Add Service Provider</h5>
                  <p>Onboard a new service provider</p>
                </div>
                <div class="arrow">
                  <i class="fa-solid fa-angle-right"></i>
                </div>
              </div>
              {/* Card */}
              <div class="menu-card d-flex align-items-center" data-bs-toggle="modal"
                data-bs-target="#addWarrantyProviderModal">
                <div class="icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 12.4425L8.5575 10.5L7.5 11.5575L10.5 14.5575L16.5 8.5575L15.4425 7.5L10.5 12.4425Z" fill="#3D8B37" />
                    <path d="M12 22.5L7.36801 20.0303C6.0474 19.3279 4.94303 18.2791 4.17348 16.9964C3.40393 15.7138 2.99825 14.2458 3.00001 12.75V3C3.00001 2.60218 3.15804 2.22064 3.43935 1.93934C3.72065 1.65804 4.10218 1.5 4.50001 1.5H19.5C19.8978 1.5 20.2794 1.65804 20.5607 1.93934C20.842 2.22064 21 2.60218 21 3V12.75C21.0018 14.2458 20.5961 15.7138 19.8265 16.9964C19.057 18.2791 17.9526 19.3279 16.632 20.0303L12 22.5ZM4.50001 3V12.75C4.49917 13.9738 4.83141 15.1747 5.46111 16.224C6.09082 17.2733 6.99423 18.1315 8.07451 18.7065L12 20.7997L15.9255 18.7073C17.0059 18.1322 17.9094 17.2739 18.5391 16.2244C19.1688 15.175 19.501 13.9739 19.5 12.75V3H4.50001Z" fill="#3D8B37" />
                  </svg>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h5>Add Warranty Provider</h5>
                  <p>Register a new provider.</p>
                </div>
                <div class="arrow">
                  <i class="fa-solid fa-angle-right"></i>
                </div>
              </div>
              {/* Card */}
              <div class="menu-card d-flex align-items-center" data-bs-toggle="modal"
                data-bs-target="#addComponentModal">
                <div class="icon-box">
                  <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.72113 17.5H14.3365C14.4006 17.5 14.4535 17.4775 14.4952 17.4327C14.5368 17.3878 14.5577 17.3333 14.5577 17.2692V12.8615L15.4807 12.4654C15.7859 12.3513 16.032 12.1551 16.2192 11.8769C16.4064 11.5987 16.5 11.2775 16.5 10.9134C16.5 10.5532 16.4064 10.233 16.2192 9.95283C16.032 9.6727 15.7859 9.47238 15.4807 9.35186L14.5577 8.97111V4.55766C14.5577 4.48714 14.5368 4.43105 14.4952 4.38938C14.4535 4.34771 14.4006 4.32687 14.3365 4.32687H9.87305L9.69037 3.04998C9.62754 2.61921 9.441 2.25318 9.13074 1.95189C8.82049 1.65061 8.45317 1.49996 8.02881 1.49996C7.59419 1.49996 7.22175 1.65061 6.91149 1.95189C6.60124 2.25318 6.4147 2.61921 6.35187 3.04998L6.16919 4.32687H1.71152C1.65382 4.32687 1.60414 4.34771 1.56247 4.38938C1.5208 4.43105 1.49996 4.48714 1.49996 4.55766V6.84229C2.36278 7.12818 3.06406 7.64516 3.6038 8.39324C4.14355 9.14131 4.41342 9.98137 4.41342 10.9134C4.41342 11.8685 4.14515 12.7201 3.60861 13.4682C3.07207 14.2163 2.36919 14.7269 1.49996 14.9999V17.2692C1.49996 17.3333 1.5208 17.3878 1.56247 17.4327C1.60414 17.4775 1.65703 17.5 1.72113 17.5ZM1.72113 18.9999C1.23781 18.9999 0.830119 18.8323 0.498071 18.497C0.166024 18.1618 0 17.7525 0 17.2692V13.7673C0.8 13.7416 1.48558 13.4618 2.05673 12.9278C2.62788 12.3939 2.91346 11.7224 2.91346 10.9134C2.91346 10.1532 2.62628 9.5022 2.05192 8.96053C1.47756 8.41886 0.793589 8.11533 0 8.04994V4.55766C0 4.07818 0.166985 3.66985 0.500955 3.33267C0.834925 2.9955 1.23845 2.82691 1.71152 2.82691H4.86729C4.97755 2.0282 5.32883 1.35737 5.92113 0.81442C6.51344 0.271473 7.216 0 8.02881 0C8.83137 0 9.5288 0.271473 10.1211 0.81442C10.7134 1.35737 11.0698 2.0282 11.1903 2.82691H14.3365C14.8096 2.82691 15.2147 2.9955 15.5519 3.33267C15.889 3.66985 16.0576 4.07818 16.0576 4.55766V7.97497C16.6384 8.21087 17.1073 8.59612 17.4644 9.13073C17.8214 9.66534 17.9999 10.2596 17.9999 10.9134C17.9999 11.5647 17.8214 12.156 17.4644 12.6874C17.1073 13.2189 16.6384 13.607 16.0576 13.8519V17.2692C16.0576 17.7525 15.889 18.1618 15.5519 18.497C15.2147 18.8323 14.8096 18.9999 14.3365 18.9999H1.72113Z" fill="#3D8B37" />
                  </svg>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h5>Component Library</h5>
                  <p>Manage component templates.</p>
                </div>
                <div class="arrow">
                  <i class="fa-solid fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* add Dealer modal S */}
      <div class="modal fade" id="addDealerModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" style={{ maxWidth: "690px" }}>
          <div class="modal-content ct_modal">
            <div class="modal-header border-0 pb-0">
              <div>
                <h5 class="ct_fs_20 ct_fw_600 ct_head_clr mb-1">
                  Add Dealer
                </h5>
                <p class="ct_fs_14 ct_para_clr mb-0">
                  Register a new dealer to the platform.
                </p>
              </div>
              <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body pt-4">
              <div class="mb-3">
                <label class="ct_label">
                  Dealer Name
                </label>
                <input
                  type="text"
                  class="form-control ct_input"
                  placeholder="Enter dealer name" />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="ct_label">
                    Email
                  </label>
                  <input
                    type="email"
                    class="form-control ct_input"
                    placeholder="Enter email" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="ct_label">
                    Phone No.
                  </label>
                  <input
                    type="text"
                    class="form-control ct_input"
                    placeholder="Enter phone no." />
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 pt-4 ct_flex_col_575">
              <button
                class="btn ct_btn_gray ct_btn_h_50 ct_w_100_575"
                data-bs-dismiss="modal">
                Cancel
              </button>
              <button class="btn ct_green_btn ct_btn_h_50 ct_w_100_575" data-bs-dismiss="modal">
                Add Dealer
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* add Dealer modal E */}
      {/* Add Service Provider modal S */}
      <div class="modal fade" id="addServiceProviderModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" style={{ maxWidth: "690px" }}>
          <div class="modal-content ct_modal">
            <div class="modal-header border-0 pb-0">
              <div>
                <h5 class="ct_fs_20 ct_fw_600 ct_head_clr mb-1">
                  Add Service Provider
                </h5>
                <p class="ct_fs_14 ct_para_clr mb-0">
                  Register a new service provider on the platform.
                </p>
              </div>
              <button type="button"
                class="btn-close shadow-none"
                data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body pt-4">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="ct_label">
                    Service Provider Name
                  </label>
                  <input
                    type="text"
                    class="form-control ct_input"
                    placeholder="Enter service provider name" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="ct_label">
                    Category
                  </label>
                  <select class="form-select ct_input">
                    <option selected disabled>Select</option>
                    <option>Insurance</option>
                    <option>Warranty</option>
                    <option>Repair</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="ct_label">
                    Email
                  </label>
                  <input
                    type="email"
                    class="form-control ct_input"
                    placeholder="Enter email" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="ct_label">
                    Phone No.
                  </label>
                  <input
                    type="text"
                    class="form-control ct_input"
                    placeholder="Enter phone no." />
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 pt-4 ct_flex_col_575">
              <button
                type="button"
                class="btn ct_btn_gray ct_btn_h_50 ct_w_100_575"
                data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button" data-bs-dismiss="modal"
                class="btn ct_green_btn ct_btn_h_50 ct_w_100_575">
                Add Service Provider
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add Service Provider modal E */}
      {/* Add Warranty Provider Modal S */}
      <div class="modal fade" id="addWarrantyProviderModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" style={{ maxWidth: "690px" }}>
          <div class="modal-content ct_modal">
            <div class="modal-header border-0 pb-0">
              <div>
                <h5 class="ct_fs_20 ct_fw_600 ct_head_clr mb-1">
                  Add Warranty Provider
                </h5>
                <p class="ct_fs_14 ct_para_clr mb-0">
                  Register a new warranty provider on the platform.
                </p>
              </div>
              <button type="button"
                class="btn-close shadow-none"
                data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body pt-4">
              <div class="mb-3">
                <label class="ct_label">
                  Warranty Provider Name
                </label>
                <input
                  type="text"
                  class="form-control ct_input"
                  placeholder="Enter warranty provider name" />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="ct_label">
                    Email
                  </label>
                  <input
                    type="email"
                    class="form-control ct_input"
                    placeholder="Enter email" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="ct_label">
                    Phone No.
                  </label>
                  <input
                    type="text"
                    class="form-control ct_input"
                    placeholder="Enter phone no." />
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 pt-4 ct_flex_col_575">
              <button
                type="button"
                class="btn ct_btn_gray ct_btn_h_50 ct_w_100_575"
                data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button" data-bs-dismiss="modal"
                class="btn ct_green_btn ct_btn_h_50 ct_w_100_575">
                Add Warranty Provider
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add Warranty Provider Modal E */}
      {/* Add Component Modal S */}
      <div class="modal fade" id="addComponentModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" style={{ maxWidth: "590px" }}>
          <div class="modal-content ct_modal">
            {/* Header */}
            <div class="modal-header border-0 pb-0">
              <div>
                <h5 class="ct_fs_20 ct_fw_600 ct_head_clr mb-1">
                  Add Component
                </h5>
                <p class="ct_fs_14 ct_para_clr mb-0">
                  Add a new standard component to the library.
                </p>
              </div>
              <button type="button"
                class="btn-close shadow-none"
                data-bs-dismiss="modal"></button>
            </div>
            {/* Body */}
            <div class="modal-body pt-4">
              <div class="mb-3">
                <label class="ct_label">
                  Component Name
                </label>
                <input
                  type="text"
                  class="form-control ct_input"
                  placeholder="Enter component name" />
              </div>
            </div>
            {/* Footer */}
            <div class="modal-footer border-0 pt-3 ct_flex_col_575">
              <button
                type="button"
                class="btn ct_btn_gray ct_btn_h_50 ct_w_100_575"
                data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button" data-bs-dismiss="modal"
                class="btn ct_green_btn ct_btn_h_50 ct_w_100_575">
                Add Component
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add Component Modal E */}
      {/*Log out Modal */}
      <div class="modal fade" id="ct_logout_modal_post" tabindex="-1" aria-labelledby="ct_delete_postLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 ct_border_radius_20">
            <div class="modal-header pb-0 border-0">
              <button type="button" class="btn-close ct_close" data-bs-dismiss="modal" aria-label="Close"><i
                class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body" style={{paddingInline: "40px"}}>
              <div class="ct_delete_post_modal">
                <figure>
                  <figcaption class="mt-0 ">
                    <h4 class="ct_fs_28 ct_fw_500 mb-2">You are about to LogOut</h4>
                    <p class="mb-0 ct_fs_18 ct_fw_400 ct_para_clr mb-1">Are you sure you want to logout ?
                    </p>
                  </figcaption>
                </figure>
                <div class="d-flex justify-content-center border-0 gap-3 ct_modal_footer ct_flex_col_575 mb-5 mt-4">
                  <button type="button" class="action-button-previous w-100 text-center"
                    data-bs-dismiss="modal">No, This was a Mistake</button>
                  <a href="login.html"
                    class="ct_form_next action-button w-100 text-center">Yes, Log Me Out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard