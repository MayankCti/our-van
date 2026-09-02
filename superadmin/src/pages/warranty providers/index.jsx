import { Link } from "react-router-dom"
import Layout from "../../layout/Layout"
import { pageRoutes } from "../../routes/PageRoutes"
import Header from "../../layout/Header"

const WarrantyProviders = () => {
   return (

      <Layout>
         <div class="ct_right_panel">
            <Header />
            <div class="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
               <div>
                  <h4 class="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Warranty Providers</h4>
                  <p class="mb-0 ct_para_clr">Manage all registered warranty providers across the platform. </p>
               </div>
               <a class="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575" data-bs-target="#addWarrantyProviderModal" data-bs-toggle="modal">Add Warranty Provider</a>
            </div>
            <div class="ct_px_30 mt-4 pb-4">
               <div class="container-fluid">
                  {/* Search */}
                  <div class="ct_search_filter my-4 ct_flex_col_767">
                     <div class="ct_flex_1 position-relative ct_w_100_767">
                        <i class="bi bi-search ct_search_icon"></i>
                        <input
                           type="text"
                           class="form-control ct_input ct_input_ps_40"
                           placeholder="Search by provider name, email..." />
                     </div>
                     <div class="ct_filter_box position-relative ct_w_100_767">
                        <svg class="ct_search_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M4.5 7H19.5M7 12H17M10 17H14" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <select class="form-control form-select ct_input ct_input_ps_40 ct_input_pe_40">
                           <option selected>Category</option>
                           <option>Mechanics</option>
                           <option>Repair Centre</option>
                           <option>Electrical</option>
                           <option>Gas Inspection</option>
                        </select>
                     </div>
                  </div>
                  {/* Table */}
                  <div class="table-responsive ct_custom_table">
                     <table class="table  align-middle mb-0">
                        <thead>
                           <tr>
                              <th>#</th>
                              <th>Warranty Provider</th>
                              <th>Phone No.</th>
                              <th>Email</th>
                              <th>Date Registered</th>
                              <th>Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td>1</td>
                              <td>SafeGuard Warranty</td>
                              <td>+61 412 345 678</td>
                              <td>support@safeguard.com</td>
                              <td>13 Jul 2026</td>
                              <td>
                                 <Link to={pageRoutes.warranty_provider_detail} class="ct_action_link">
                                    View Details
                                 </Link>
                              </td>
                           </tr>
                           <tr>
                              <td>2</td>
                              <td>AutoSecure</td>
                              <td>+61 423 567 891</td>
                              <td>contact@autosecure.com</td>
                              <td>17 Sep 2026</td>
                              <td>
                                 <Link to={pageRoutes.warranty_provider_detail} class="ct_action_link">
                                    View Details
                                 </Link>
                              </td>
                           </tr>
                           <tr>
                              <td>3</td>
                              <td>Premium Cover</td>
                              <td>+61 434 678 912</td>
                              <td>info@premiumcover.com</td>
                              <td>26 Jan 2026</td>
                              <td>
                                 <Link to={pageRoutes.warranty_provider_detail} class="ct_action_link">
                                    View Details
                                 </Link>
                              </td>
                           </tr>
                           <tr>
                              <td>4</td>
                              <td>Allianz Warranty</td>
                              <td>+61 445 789 123</td>
                              <td>support@allianz.com</td>
                              <td>5 Oct 2026</td>
                              <td>
                                 <Link to={pageRoutes.warranty_provider_detail} class="ct_action_link">
                                    View Details
                                 </Link>
                              </td>
                           </tr>
                           <tr>
                              <td>5</td>
                              <td>VanProtect</td>
                              <td>+61 456 891 234</td>
                              <td>hello@vanprotect.com</td>
                              <td>11 Apr 2026</td>
                              <td>
                                 <Link to={pageRoutes.warranty_provider_detail} class="ct_action_link">
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
                        type="button"
                        class="btn ct_green_btn ct_btn_h_50 ct_w_100_575" data-bs-dismiss="modal">
                        Add Warranty Provider
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </Layout>
   )
}

export default WarrantyProviders