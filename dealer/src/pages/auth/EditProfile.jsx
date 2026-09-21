import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import { pageRoutes } from '../../routes/PageRoutes';
import { authGetProfile, authUpdateProfile } from '../../redux/actions/authAction';
import { pipGetProfile } from '../../utils/pip';
import ErrorMessage from '../../components/form/ErrorMessage';

const editProfileSchema = Yup.object().shape({
  dealer_name: Yup.string().trim().required('Please enter dealer name'),
});

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state?.authReducer?.user);
  const { isLoading } = useSelector((state) => state?.authReducer || {});
  const user = reduxUser || pipGetProfile() || {};

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(authGetProfile());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const initialValues = {
    dealer_name: user?.dealer_name || user?.name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
  };

  const handleUpdateProfile = (values) => {
    const formData = new FormData();
    formData.append('dealer_name', values.dealer_name.trim());

    if (selectedFile) {
      formData.append('profile_image', selectedFile);
    }

    const callback = (response) => {
      if (response?.success) {
        navigate(pageRoutes.myProfile);
      }
    };

    dispatch(
      authUpdateProfile({
        payload: formData,
        callback,
      })
    );
  };

  const profileImageSrc = imagePreview || user?.profile_image || '/image.png';

  return (
    <Layout>
      <SubHeader
        title="Edit Profile"
        subtitle="Update your account information"
      />
      <div className="ct_px_30 mt-4 pb-4">
        <section className="ct_profile_card">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={editProfileSchema}
            onSubmit={handleUpdateProfile}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                {/* Profile Image Section */}
                <div className="d-flex align-items-center gap-3 flex-wrap mb-5">
                  <div className="ct_profile_img position-relative">
                    <img
                      src={profileImageSrc}
                      alt="Profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/image.png';
                      }}
                    />

                    <label className="ct_upload_icon" style={{ cursor: 'pointer' }}>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.7188 1.875H9.99019C9.90234 1.875 9.79331 1.81816 9.70837 1.72852L8.94844 0.529102C8.94243 0.519584 8.93607 0.510302 8.92938 0.501257C8.92268 0.492211 8.91565 0.483427 8.9083 0.474902C8.6458 0.16875 8.29102 0 7.91016 0H5.21484C4.83398 0 4.4792 0.16875 4.2167 0.474902C4.20935 0.483427 4.20232 0.492211 4.19562 0.501257C4.18893 0.510303 4.18257 0.519584 4.17656 0.529102L3.4166 1.73027C3.35156 1.80117 3.26016 1.87675 3.16406 1.87675V1.64238C3.16406 1.51294 3.11829 1.40245 3.02677 1.31093C2.93524 1.2194 2.82475 1.17363 2.69531 1.17363H1.99219C1.86275 1.17363 1.75226 1.2194 1.66073 1.31093C1.56921 1.40245 1.52344 1.51294 1.52344 1.64238V1.87675H1.40625C1.01809 1.87717 0.686779 2.01459 0.41231 2.28907C0.137841 2.56354 0.000403747 2.89485 0 3.283V8.90625C0.000403523 9.29441 0.13784 9.62569 0.412309 9.90019C0.686779 10.1747 1.01809 10.3121 1.40625 10.3125H11.7188C12.1069 10.3121 12.4382 10.1747 12.7127 9.90019C12.9872 9.62569 13.1246 9.2944 13.125 8.90625V3.28125C13.1246 2.89309 12.9872 2.56177 12.7127 2.28731C12.4382 2.01284 12.1069 1.8754 11.7188 1.875ZM6.5625 8.4375C5.78585 8.4375 5.12294 8.16292 4.57376 7.61374C4.02458 7.06456 3.75 6.40165 3.75 5.625C3.75 4.84835 4.02458 4.18544 4.57376 3.63626C5.12294 3.08708 5.78585 2.8125 6.5625 2.8125C7.33915 2.8125 8.00206 3.08708 8.55124 3.63626C9.10042 4.18544 9.375 4.84835 9.375 5.625C9.37411 6.40128 9.09921 7.06388 8.55029 7.6128C8.00138 8.16171 7.33878 8.43661 6.5625 8.4375Z" fill="white" />
                      </svg>
                    </label>
                  </div>

                  <div>
                    <h4 className="mb-1 ct_head_clr fs-5 ct_fw_600">{user?.dealer_name || user?.name || 'Dealer'}</h4>
                    <p className="mb-0 ct_para_clr">{user?.email || ''}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="row g-4">
                  <div className="col-lg-6">
                    <label className="form-label ct_label">Full Name</label>
                    <input
                      type="text"
                      name="dealer_name"
                      id="dealer_name"
                      className="form-control ct_input"
                      placeholder="Enter dealer name"
                      value={values.dealer_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      errors={errors}
                      touched={touched}
                      fieldName="dealer_name"
                    />
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label ct_label">Email Address</label>
                    <input
                      type="email"
                      className="form-control ct_input"
                      disabled
                      value={values.email}
                    />
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label ct_label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control ct_input"
                      disabled
                      value={values.phone_number}
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="d-flex justify-content-end gap-3 mt-5 ct_flex_col_575">
                  <button
                    type="button"
                    className="btn ct_btn_gray ct_btn_h_45 ct_w_100_575"
                    onClick={() => navigate(pageRoutes.myProfile)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn ct_green_btn ct_btn_h_45 ct_fw_500 ct_w_100_575 fs-6 border-0"
                    disabled={isLoading}
                    style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
                  >
                    {isLoading ? (
                      <span className="d-flex align-items-center justify-content-center gap-2">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Saving Changes...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </section>
      </div>
    </Layout>
  );
};

export default EditProfile;
