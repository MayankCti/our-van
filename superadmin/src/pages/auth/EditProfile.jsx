import Layout from "../../layout/Layout"
import Header from "../../layout/Header"

const EditProfile = () => {
   return (

      <Layout>
         <div class="ct_right_panel">
            <Header />
            <div class="ct_inner_header_bg mt-4 ct_px_30">
               <h4 class="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Edit Profile
               </h4>
               <p class="mb-0 ct_para_clr">Update your account information

               </p>
            </div>
            <div class="ct_px_30 mt-4 pb-4">
               <section class="ct_profile_card">
                  {/* Profile */}
                  <div class="d-flex align-items-center gap-3 flex-wrap mb-5">
                     <div class="ct_profile_img position-relative">
                        <img src="assets/img/profile_img.png" alt="" />
                        <label class="ct_upload_icon">
                           <input type="file" hidden />
                           <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.7188 1.875H9.99019C9.90234 1.875 9.79331 1.81816 9.70837 1.72852L8.94844 0.529102C8.94243 0.519584 8.93607 0.510302 8.92938 0.501257C8.92268 0.492211 8.91565 0.483427 8.9083 0.474902C8.6458 0.16875 8.29102 0 7.91016 0H5.21484C4.83398 0 4.4792 0.16875 4.2167 0.474902C4.20935 0.483427 4.20232 0.492211 4.19562 0.501257C4.18893 0.510303 4.18257 0.519584 4.17656 0.529102L3.4166 1.73027C3.35156 1.80117 3.26016 1.87675 3.16406 1.87675V1.64238C3.16406 1.51294 3.11829 1.40245 3.02677 1.31093C2.93524 1.2194 2.82475 1.17363 2.69531 1.17363H1.99219C1.86275 1.17363 1.75226 1.2194 1.66073 1.31093C1.56921 1.40245 1.52344 1.51294 1.52344 1.64238V1.87675H1.40625C1.01809 1.87717 0.686779 2.01459 0.41231 2.28907C0.137841 2.56354 0.000403747 2.89485 0 3.283V8.90625C0.000403523 9.29441 0.13784 9.62569 0.412309 9.90019C0.686779 10.1747 1.01809 10.3121 1.40625 10.3125H11.7188C12.1069 10.3121 12.4382 10.1747 12.7127 9.90019C12.9872 9.62569 13.1246 9.2944 13.125 8.90625V3.28125C13.1246 2.89309 12.9872 2.56177 12.7127 2.28731C12.4382 2.01284 12.1069 1.8754 11.7188 1.875ZM6.5625 8.4375C5.78585 8.4375 5.12294 8.16292 4.57376 7.61374C4.02458 7.06456 3.75 6.40165 3.75 5.625C3.75 4.84835 4.02458 4.18544 4.57376 3.63626C5.12294 3.08708 5.78585 2.8125 6.5625 2.8125C7.33915 2.8125 8.00206 3.08708 8.55124 3.63626C9.10042 4.18544 9.375 4.84835 9.375 5.625C9.37411 6.40128 9.09921 7.06388 8.55029 7.6128C8.00138 8.16171 7.33878 8.43661 6.5625 8.4375Z" fill="white" />
                           </svg>
                        </label>
                     </div>
                     <div>
                        <h4 class="mb-1 ct_head_clr fs-5 ct_fw_600">James Wilson</h4>
                        <p class="mb-0 ct_para_clr">jameswilson@email.com</p>
                     </div>
                  </div>
                  {/* Form */}
                  <div class="row g-4">
                     <div class="col-lg-6">
                        <label class="form-label ct_label">Full Name</label>
                        <input type="text" class="form-control ct_input" value="James Wilson" />
                     </div>
                     <div class="col-lg-6">
                        <label class="form-label ct_label">Email Address</label>
                        <input type="email" class="form-control ct_input" disabled value="jameswilson@email.com" />
                     </div>
                  </div>
                  {/* Buttons */}
                  <div class="d-flex justify-content-end gap-3 mt-5 ct_flex_col_575">
                     <button class="btn ct_btn_gray ct_btn_h_45 ct_w_100_575">
                        Cancel
                     </button>
                     <button class="btn ct_green_btn ct_btn_h_45 ct_fw_500 ct_w_100_575 fs-6">
                        Save Changes
                     </button>
                  </div>
               </section>
            </div>
         </div>
      </Layout>
   )
}

export default EditProfile