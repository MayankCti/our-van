import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import Header from '../../layout/Header';
import { pageRoutes } from '../../routes/PageRoutes';
import { pipGetProfile } from '../../utils/pip';

const MyProfile = () => {
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state?.authReducer?.user);
  const user = reduxUser || pipGetProfile() || {};

  const displayName = user?.full_name || user?.name || user?.admin_name || 'Super Admin';
  const displayEmail = user?.email || '';
  const profileImage = user?.profile_image || user?.profile_image_url || '/image.png';

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />
        <div className="ct_inner_header_bg mt-4 ct_px_30">
          <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">
            My Profile
          </h4>
          <p className="mb-0 ct_para_clr">
            View your account information
          </p>
        </div>
        <div className="ct_px_30 mt-4 pb-4">
          <section className="ct_profile_card">
            {/* Profile Header */}
            <div className="d-flex align-items-center gap-3 flex-wrap mb-5">
              <div className="ct_profile_img position-relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image.png';
                  }}
                />
              </div>

              <div>
                <h4 className="mb-1 ct_head_clr fs-5 ct_fw_600">{displayName}</h4>
                <p className="mb-0 ct_para_clr">{displayEmail}</p>
              </div>
            </div>

            {/* Details (Read Only) */}
            <div className="row g-4">
              <div className="col-lg-6">
                <label className="form-label ct_label">Full Name</label>
                <input
                  type="text"
                  className="form-control ct_input"
                  readOnly
                  disabled
                  value={displayName}
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label ct_label">Email Address</label>
                <input
                  type="email"
                  className="form-control ct_input"
                  readOnly
                  disabled
                  value={displayEmail}
                />
              </div>

              {/* {user?.designation && (
                <div className="col-lg-6">
                  <label className="form-label ct_label">Designation</label>
                  <input
                    type="text"
                    className="form-control ct_input"
                    readOnly
                    disabled
                    value={user?.designation}
                  />
                </div>
              )}

              {user?.status && (
                <div className="col-lg-6">
                  <label className="form-label ct_label">Status</label>
                  <input
                    type="text"
                    className="form-control ct_input"
                    readOnly
                    disabled
                    value={user?.status}
                  />
                </div>
              )} */}
            </div>

            {/* Action Button */}
            <div className="d-flex justify-content-end gap-3 mt-5 ct_flex_col_575">
              <button
                type="button"
                className="btn ct_green_btn ct_btn_h_45 ct_fw_500 ct_w_100_575 fs-6 border-0"
                onClick={() => navigate(pageRoutes.editProfile)}
              >
                Edit Profile
              </button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default MyProfile;
