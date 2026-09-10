import { Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Header from "../../layout/Header";
import Layout from "../../layout/Layout";
import Eye from "../../components/form/Eye";
import { changePasswordSchema } from "../../utils/Schema";
import ErrorMessage from "../../components/form/ErrorMessage";
import { authChangePassword } from "../../redux/actions/authAction";

const ChangePassword = () => {
   const dispatch = useDispatch();
   const { isLoading } = useSelector((state) => state?.authReducer || {});

   const [isEyeCurrent, setIsEyeCurrent] = useState(false);
   const [isEyeNew, setIsEyeNew] = useState(false);
   const [isEyeConfirm, setIsEyeConfirm] = useState(false);

   const initialValues = {
      current_password: '',
      new_password: '',
      confirm_password: '',
   };

   const handleChangePassword = (values, { resetForm }) => {
      const callback = (response) => {
         if (response?.success) {
            resetForm();
         }
      };

      dispatch(
         authChangePassword({
            payload: {
               oldPassword: values.current_password,
               newPassword: values.new_password,
            },
            callback,
         })
      );
   };

   return (
      <Layout>
         <div className="ct_right_panel">
            <Header />
            <div className="ct_inner_header_bg mt-4 ct_px_30">
               <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">
                  Change Password
               </h4>
               <p className="mb-0 ct_para_clr">
                  Update your account password to keep your account secure
               </p>
            </div>
            <div className="ct_px_30 mt-4 pb-4">
               <section className="ct_profile_card">
                  <Formik
                     initialValues={initialValues}
                     validationSchema={changePasswordSchema}
                     onSubmit={handleChangePassword}
                  >
                     {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        resetForm,
                     }) => (
                        <form onSubmit={handleSubmit}>
                           {/* Current Password */}
                           <div className="mb-4">
                              <label className="form-label ct_label">Current Password</label>
                              <div className="position-relative">
                                 <input
                                    type={isEyeCurrent ? 'text' : 'password'}
                                    name="current_password"
                                    id="current_password"
                                    className="form-control ct_input ct_input_pe_40"
                                    placeholder="Enter current password"
                                    value={values.current_password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                 />
                                 <Eye isEye={isEyeCurrent} onClick={setIsEyeCurrent} />
                              </div>
                              <ErrorMessage
                                 errors={errors}
                                 touched={touched}
                                 fieldName="current_password"
                              />
                           </div>

                           {/* New Password */}
                           <div className="mb-4">
                              <label className="form-label ct_label">New Password</label>
                              <div className="position-relative">
                                 <input
                                    type={isEyeNew ? 'text' : 'password'}
                                    name="new_password"
                                    id="new_password"
                                    className="form-control ct_input ct_input_pe_40"
                                    placeholder="Enter new password"
                                    value={values.new_password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                 />
                                 <Eye isEye={isEyeNew} onClick={setIsEyeNew} />
                              </div>
                              <ErrorMessage
                                 errors={errors}
                                 touched={touched}
                                 fieldName="new_password"
                              />
                           </div>

                           {/* Confirm Password */}
                           <div className="mb-5">
                              <label className="form-label ct_label">Confirm Password</label>
                              <div className="position-relative">
                                 <input
                                    type={isEyeConfirm ? 'text' : 'password'}
                                    name="confirm_password"
                                    id="confirm_password"
                                    className="form-control ct_input ct_input_pe_40"
                                    placeholder="Confirm new password"
                                    value={values.confirm_password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                 />
                                 <Eye isEye={isEyeConfirm} onClick={setIsEyeConfirm} />
                              </div>
                              <ErrorMessage
                                 errors={errors}
                                 touched={touched}
                                 fieldName="confirm_password"
                              />
                           </div>

                           {/* Buttons */}
                           <div className="d-flex justify-content-end gap-3 ct_flex_col_575">
                              <button
                                 type="button"
                                 className="btn ct_btn_gray ct_btn_h_45 ct_w_100_575"
                                 onClick={() => resetForm()}
                                 disabled={isLoading}
                              >
                                 Cancel
                              </button>
                              <button
                                 type="submit"
                                 className="btn ct_green_btn ct_btn_h_45 ct_fw_500 fs_6 ct_w_100_575 border-0"
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
         </div>
      </Layout>
   );
};

export default ChangePassword;