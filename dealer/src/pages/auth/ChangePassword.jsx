import React from 'react';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';

const ChangePassword = () => {
  return (
    <Layout>
      <SubHeader
        title="Change Password"
        subtitle="Update your account password to keep your account secure"
      />
      <div className="ct_px_30 mt-4 pb-4">
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
  </Layout>
  );
};

export default ChangePassword;
