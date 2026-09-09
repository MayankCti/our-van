import Header from "../../layout/Header"
import Layout from "../../layout/Layout"

const Dashboard = () => {
  return (

    <Layout>
      <div class="ct_right_panel">
        <Header />
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

    </Layout>
  )
}

export default Dashboard