import React from 'react';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';

const Notifications = () => {
  return (
    <Layout>
      <SubHeader
        title="Notification"
        subtitle="Stay updated with your latest dealership activities."
      />
      <div className="ct_px_30 mt-4 pb-4">


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
  </Layout>
  );
};

export default Notifications;
