import Layout from "../../layout/Layout"
import Header from "../../layout/Header"

const ChangePassword = () => {
   return (

      <Layout>
         <div class="ct_right_panel">
            <Header />
            <div class="ct_inner_header_bg mt-4 ct_px_30">
               <h4 class="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Change Password

               </h4>
               <p class="mb-0 ct_para_clr">Update your account password to keep your account secure



               </p>
            </div>
            <div class="ct_px_30 mt-4 pb-4">
               <section class="ct_profile_card">
                  <form>
                     {/* Current Password */}
                     <div class="mb-4">
                        <label class="form-label ct_label">Current Password</label>
                        <div class="position-relative">
                           <input type="password" class="form-control ct_input ct_input_pe_40" value="********" />
                           <span class="ct_show_eye">
                              <i class="fa-regular fa-eye-slash"></i>
                           </span>
                        </div>
                     </div>
                     {/* New Password */}
                     <div class="mb-4">
                        <label class="form-label ct_label">New Password</label>
                        <div class="position-relative">
                           <input type="password" class="form-control ct_input ct_input_pe_40" value="********" />
                           <span class="ct_show_eye">
                              <i class="fa-regular fa-eye-slash"></i>
                           </span>
                        </div>
                     </div>
                     {/* Confirm Password */}
                     <div class="mb-5">
                        <label class="form-label ct_label">Confirm Password</label>
                        <div class="position-relative">
                           <input type="password" class="form-control ct_input ct_input_pe_40" value="********" />
                           <span class="ct_show_eye">
                              <i class="fa-regular fa-eye-slash"></i>
                           </span>
                        </div>
                     </div>
                     {/* Buttons */}
                     <div class="d-flex justify-content-end gap-3 ct_flex_col_575">
                        <button type="button" class="btn ct_btn_gray ct_btn_h_45 ct_w_100_575">
                           Cancel
                        </button>
                        <button type="submit" class="btn ct_green_btn ct_btn_h_45 ct_fw_500 fs_6 ct_w_100_575">
                           Save Changes
                        </button>
                     </div>
                  </form>
               </section>
            </div>
         </div>
      </Layout>
   )
}

export default ChangePassword