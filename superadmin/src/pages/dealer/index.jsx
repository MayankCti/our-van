import Header from "../../layout/Header"
import Layout from "../../layout/Layout"

const Dealer = () => {
  return (

    <Layout>
      <div class="ct_right_panel">
        <Header />
        <div class="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
          <div>
            <h4 class="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Dealers</h4>
            <p class="mb-0 ct_para_clr">Manage all registered dealers across the platform.</p>
          </div>
          <a class="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575" data-bs-target="#addDealerModal" data-bs-toggle="modal">Add Dealer</a>
        </div>
        <div class="ct_px_30 mt-4 pb-4">
          <div class="container-fluid">

            {/* Search */}
            <div class="mb-4 position-relative">
              <svg class="ct_search_icon" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 15L11.25 11.25M0.5 6.75C0.5 3.29822 3.29822 0.5 6.75 0.5C10.2018 0.5 13 3.29822 13 6.75C13 10.2018 10.2018 13 6.75 13C3.29822 13 0.5 10.2018 0.5 6.75Z" stroke="#475569" stroke-linecap="round" stroke-linejoin="round" />
              </svg>


              <input
                type="text"
                class="form-control ct_input ct_input_ps_40 ct_fs_14"
                placeholder="Search by dealer name, email, or location..." />
            </div>

            {/* Table */}
            <div class="table-responsive ct_custom_table">
              <table class="table  align-middle mb-0">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Dealer</th>
                    <th>Email</th>
                    <th>Owners</th>
                    <th>Date Registered</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>1</td>
                    <td>ABC Caravans</td>
                    <td>john.smith@email.com</td>
                    <td>145</td>
                    <td>13 Jul 2026</td>
                    <td>
                      <a href="dealer-details.html" class="ct_action_link">View Details</a>
                    </td>
                  </tr>

                  <tr>
                    <td>2</td>
                    <td>ABC Caravans</td>
                    <td>john.smith@email.com</td>
                    <td>145</td>
                    <td>13 Jul 2026</td>
                    <td>
                      <a href="dealer-details.html" class="ct_action_link">View Details</a>
                    </td>
                  </tr>

                  <tr>
                    <td>3</td>
                    <td>ABC Caravans</td>
                    <td>john.smith@email.com</td>
                    <td>145</td>
                    <td>13 Jul 2026</td>
                    <td>
                      <a href="dealer-details.html" class="ct_action_link">View Details</a>
                    </td>
                  </tr>

                  <tr>
                    <td>4</td>
                    <td>ABC Caravans</td>
                    <td>john.smith@email.com</td>
                    <td>145</td>
                    <td>13 Jul 2026</td>
                    <td>
                      <a href="dealer-details.html" class="ct_action_link">View Details</a>
                    </td>
                  </tr>

                  <tr>
                    <td>5</td>
                    <td>ABC Caravans</td>
                    <td>john.smith@email.com</td>
                    <td>145</td>
                    <td>13 Jul 2026</td>
                    <td>
                      <a href="dealer-details.html" class="ct_action_link">View Details</a>
                    </td>
                  </tr>

                </tbody>

              </table>
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
    </Layout>
  )
}

export default Dealer