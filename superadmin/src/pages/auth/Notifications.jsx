import Layout from "../../layout/Layout"
import Header from "../../layout/Header"

const Notifications = () => {
   return (

      <Layout>
         <div class="ct_right_panel">
            <Header />
            <div class="ct_inner_header_bg mt-4 ct_px_30">
               <h4 class="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Notification</h4>
               <p class="mb-0 ct_para_clr">Stay updated with your latest dealership activities.</p>
            </div>
            <div class="ct_px_30 mt-4 pb-4">
               <div class="ct_profile_card">
                  <div class="d-sm-flex justify-content-between gap-3 notification-cont-wrapper">
                     <div>
                        <h4 class="ct_fs_18 ct_fw_600 mb-1">New User Registered</h4>
                        <p class=" mb-0 ct_para_clr">
                           A new business owner has signed up on the platform.
                        </p>
                     </div>
                     <div>
                        <p class="fst-italic text-nowrap mb-0 ct_para_clr mt-sm-0 mt-3">2 min ago</p>
                     </div>
                  </div>
                  <div class="d-sm-flex justify-content-between gap-3 notification-cont-wrapper">
                     <div>
                        <h4 class="ct_fs_18 ct_fw_600 mb-1">New User Registered</h4>
                        <p class=" mb-0 ct_para_clr">
                           A new business owner has signed up on the platform.
                        </p>
                     </div>
                     <div>
                        <p class="fst-italic text-nowrap mb-0 ct_para_clr mt-sm-0 mt-3">2 min ago</p>
                     </div>
                  </div>
                  <div class="d-sm-flex justify-content-between gap-3 notification-cont-wrapper">
                     <div>
                        <h4 class="ct_fs_18 ct_fw_600 mb-1">New User Registered</h4>
                        <p class=" mb-0 ct_para_clr">
                           A new business owner has signed up on the platform.
                        </p>
                     </div>
                     <div>
                        <p class="fst-italic text-nowrap mb-0 ct_para_clr mt-sm-0 mt-3">2 min ago</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Layout>
   )
}

export default Notifications