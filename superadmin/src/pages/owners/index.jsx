import { Link } from "react-router-dom"
import Layout from "../../layout/Layout"
import { pageRoutes } from "../../routes/PageRoutes"
import Header from "../../layout/Header"

const Owners = () => {
   return (

      <Layout>
         <div class="ct_right_panel">
            <Header />
            <div class="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
               <div>
                  <h4 class="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Owners</h4>
                  <p class="mb-0 ct_para_clr">Manage all registered van owners across the platform.</p>
               </div>
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
                        placeholder="Search by owner name, email..." />
                  </div>
                  {/* Table */}
                  <div class="table-responsive ct_custom_table">
                     <table class="table ct_custom_table align-middle mb-0">
                        <thead>
                           <tr>
                              <th>#</th>
                              <th>Owner Name</th>
                              <th>Email</th>
                              <th>Assigned Van</th>
                              <th>Dealer</th>
                              <th>Date Registered</th>
                              <th>Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td>1</td>
                              <td>John Smith</td>
                              <td>john.smith@email.com</td>
                              <td>Jayco Journey</td>
                              <td>ABC Caravans</td>
                              <td>13 Jul 2026</td>
                              <td>
                                 <Link to={pageRoutes?.owner_detail} class="ct_action_link">
                                    View Details
                                 </Link>
                              </td>
                           </tr>
                           <tr>
                              <td>2</td>
                              <td>Emma Wilson</td>
                              <td>emma.w@email.com</td>
                              <td>Nova Terra</td>
                              <td>Horizon Vans</td>
                              <td>17 Sep 2026</td>
                              <td>
                                 <Link to={pageRoutes?.owner_detail} class="ct_action_link">
                                    View Details
                                 </Link>
                              </td>
                           </tr>
                           <tr>
                              <td>3</td>
                              <td>David Brown</td>
                              <td>david.b@email.com</td>
                              <td>Horizon LX</td>
                              <td>VanLife</td>
                              <td>26 Jan 2026</td>
                              <td>
                                 <Link to={pageRoutes?.owner_detail} class="ct_action_link">
                                    View Details
                                 </Link>
                              </td>
                           </tr>
                           <tr>
                              <td>4</td>
                              <td>Olivia Taylor</td>
                              <td>olivia.t@email.com</td>
                              <td>New Age Road Owl</td>
                              <td>Freedom Campers</td>
                              <td>5 Oct 2026</td>
                              <td>
                                 <Link to={pageRoutes?.owner_detail} class="ct_action_link">
                                    View Details
                                 </Link>
                              </td>
                           </tr>
                           <tr>
                              <td>5</td>
                              <td>Michael Wilson</td>
                              <td>michael.w@email.com</td>
                              <td>Sunliner Habitat</td>
                              <td>Sydney Caravans</td>
                              <td>11 Apr 2026</td>
                              <td>
                                 <Link to={pageRoutes?.owner_detail} class="ct_action_link">
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
      </Layout>
   )
}

export default Owners