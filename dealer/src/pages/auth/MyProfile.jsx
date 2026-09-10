import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import { pageRoutes } from '../../routes/PageRoutes';
import { authGetProfile } from '../../redux/actions/authAction';
import { pipGetProfile } from '../../utils/pip';

const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state?.authReducer?.user);
  const user = reduxUser || pipGetProfile() || {};

  useEffect(() => {
    dispatch(authGetProfile());
  }, [dispatch]);

  const displayName = user?.dealer_name || user?.name || 'Dealer';
  const displayEmail = user?.email || '';
  const displayPhone = user?.phone_number || '';
  const profileImage = user?.profile_image || 'image.png';

  return (
    <Layout>
      <SubHeader
        title="My Profile"
        subtitle="View your account information"
      />
      <div className="ct_px_30 mt-4 pb-4">
        <section className="ct_profile_card">
          {/* Profile Header */}
          <div className="d-flex align-items-center gap-3 flex-wrap mb-5">
            <div className="ct_profile_img position-relative">
              <img src={profileImage} alt="Profile" />
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

            {displayPhone && (
              <div className="col-lg-6">
                <label className="form-label ct_label">Phone Number</label>
                <input
                  type="text"
                  className="form-control ct_input"
                  readOnly
                  disabled
                  value={displayPhone}
                />
              </div>
            )}
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
    </Layout>
  );
};

export default MyProfile;
