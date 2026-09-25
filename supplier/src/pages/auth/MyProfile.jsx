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

  const displayName = user?.full_name || 'N/A';
  const companyName = user?.company_name || 'N/A';
  const displayEmail = user?.email || 'N/A';
  const displayPhone = user?.phone_number || 'N/A';
  const city = user?.city || 'N/A';
  const abn = user?.abn || 'N/A';
  const accountingSoftware = user?.accounting_software_used || 'N/A';
  const serviceRegion = user?.service_region || 'N/A';
  const servicesOffered = user?.services_offered || 'N/A';
  const companyDescription = user?.company_description || 'N/A';
  const aboutUs = user?.about_us || 'N/A';

  const profileImage = user?.profile_image_url || user?.profile_image || '/image.png';
  const companyLogo = user?.company_logo;
  const tradeLicense = user?.trade_license;

  return (
    <Layout>
      <SubHeader
        title="My Profile"
        subtitle="View and manage your supplier account and company information"
      />
      <div className="ct_px_30 mt-4 pb-4">
        <section className="ct_profile_card mb-4">
          {/* Profile Header */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div className="d-flex align-items-center gap-3">
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
                <p className="mb-1 text-primary fw-medium">{companyName}</p>
                <p className="mb-0 ct_para_clr">{displayEmail}</p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className={`badge ${user?.status === 1 || user?.status === '1' || user?.status === true ? 'bg-success' : 'bg-warning'} px-3 py-2 fs-6 rounded-pill`}>
                {user?.status === 1 || user?.status === '1' || user?.status === true ? 'Active Supplier' : 'Pending'}
              </span>
              <button
                type="button"
                className="btn ct_green_btn ct_btn_h_45 ct_fw_500 px-4 fs-6 border-0"
                onClick={() => navigate(pageRoutes.editProfile)}
              >
                <i className="fa-solid fa-pen-to-square me-2"></i>
                Edit Profile
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* Basic & Contact Information */}
          <h5 className="ct_head_clr ct_fw_600 mb-3 fs-6">
            <i className="fa-regular fa-user me-2 text-primary"></i>
            Personal & Contact Information
          </h5>
          <div className="row g-4 mb-4">
            <div className="col-lg-4 col-md-6">
              <label className="form-label ct_label">Full Name</label>
              <input
                type="text"
                className="form-control ct_input"
                readOnly
                disabled
                value={displayName}
              />
            </div>

            <div className="col-lg-4 col-md-6">
              <label className="form-label ct_label">Email Address</label>
              <input
                type="email"
                className="form-control ct_input"
                readOnly
                disabled
                value={displayEmail}
              />
            </div>

            <div className="col-lg-4 col-md-6">
              <label className="form-label ct_label">Phone Number</label>
              <input
                type="text"
                className="form-control ct_input"
                readOnly
                disabled
                value={displayPhone}
              />
            </div>

            <div className="col-lg-4 col-md-6">
              <label className="form-label ct_label">City</label>
              <input
                type="text"
                className="form-control ct_input"
                readOnly
                disabled
                value={city}
              />
            </div>

            <div className="col-lg-4 col-md-6">
              <label className="form-label ct_label">Service Region</label>
              <input
                type="text"
                className="form-control ct_input"
                readOnly
                disabled
                value={serviceRegion}
              />
            </div>
          </div>

          <hr className="my-4" />

          {/* Company Details */}
          <h5 className="ct_head_clr ct_fw_600 mb-3 fs-6">
            <i className="fa-solid fa-building me-2 text-primary"></i>
            Company & Business Details
          </h5>
          <div className="row g-4 mb-4">
            <div className="col-lg-4 col-md-6">
              <label className="form-label ct_label">Company Name</label>
              <input
                type="text"
                className="form-control ct_input"
                readOnly
                disabled
                value={companyName}
              />
            </div>

            <div className="col-lg-4 col-md-6">
              <label className="form-label ct_label">ABN / Business Number</label>
              <input
                type="text"
                className="form-control ct_input"
                readOnly
                disabled
                value={abn}
              />
            </div>

            <div className="col-lg-4 col-md-6">
              <label className="form-label ct_label">Accounting Software</label>
              <input
                type="text"
                className="form-control ct_input"
                readOnly
                disabled
                value={accountingSoftware}
              />
            </div>

            <div className="col-lg-12">
              <label className="form-label ct_label">Services Offered</label>
              <input
                type="text"
                className="form-control ct_input"
                readOnly
                disabled
                value={servicesOffered}
              />
            </div>

            <div className="col-lg-12">
              <label className="form-label ct_label">Company Description</label>
              <textarea
                className="form-control ct_input"
                rows="3"
                readOnly
                disabled
                value={companyDescription}
              />
            </div>

            <div className="col-lg-12">
              <label className="form-label ct_label">About Us</label>
              <textarea
                className="form-control ct_input"
                rows="3"
                readOnly
                disabled
                value={aboutUs}
              />
            </div>
          </div>

          <hr className="my-4" />

          {/* Documents & Media */}
          <h5 className="ct_head_clr ct_fw_600 mb-3 fs-6">
            <i className="fa-solid fa-file-contract me-2 text-primary"></i>
            Documents & Media
          </h5>
          <div className="row g-4">
            {/* Company Logo */}
            <div className="col-lg-6">
              <label className="form-label ct_label">Company Logo</label>
              <div className="p-3 border rounded bg-light d-flex align-items-center gap-3">
                {companyLogo ? (
                  <>
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                      className="border rounded p-1 bg-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/image.png';
                      }}
                    />
                    <div>
                      <h6 className="mb-1 text-truncate" style={{ maxWidth: '250px' }}>Company Logo</h6>
                      <a href={companyLogo} target="_blank" rel="noreferrer" className="ct_green_text small fw-semibold">
                        <i className="fa-solid fa-arrow-up-right-from-square me-1"></i> View Full Image
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-muted mb-0 small">No company logo uploaded</p>
                )}
              </div>
            </div>

            {/* Trade License */}
            <div className="col-lg-6">
              <label className="form-label ct_label">Trade License</label>
              <div className="p-3 border rounded bg-light d-flex align-items-center gap-3">
                {tradeLicense ? (
                  <>
                    <div
                      className="d-flex align-items-center justify-content-center bg-white border rounded"
                      style={{ width: '60px', height: '60px' }}
                    >
                      <i className="fa-solid fa-file-lines text-primary fs-3"></i>
                    </div>
                    <div>
                      <h6 className="mb-1 text-truncate" style={{ maxWidth: '250px' }}>Trade License Document</h6>
                      <a href={tradeLicense} target="_blank" rel="noreferrer" className="ct_green_text small fw-semibold">
                        <i className="fa-solid fa-arrow-up-right-from-square me-1"></i> View Document
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-muted mb-0 small">No trade license uploaded</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MyProfile;
