import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import { pipGetProfile } from '../../utils/pip';

const Dashboard = () => {
  const reduxUser = useSelector((state) => state?.authReducer?.user);
  const user = reduxUser || pipGetProfile() || {};

  const displayName = user?.full_name || user?.name || 'Technician';
  const displayEmail = user?.email || '';
  const displayPhone = user?.phone_number || '';
  const displayRole = user?.job_role || 'Certified Technician';
  const profileImage = user?.profile_image_url || user?.profile_image || '/image.png';

  return (
    <Layout>
      <SubHeader
        title="Dashboard"
        subtitle="Welcome to your technician management portal."
      />
      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">
          {/* Welcome Banner Card */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="ct_profile_card p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="ct_profile_img">
                    <img
                      src={profileImage}
                      alt="Profile"
                      onError={(e) => { e.target.src = '/image.png'; }}
                    />
                  </div>
                  <div>
                    <h3 className="mb-1 ct_head_clr fs-4 ct_fw_600">
                      Welcome, {displayName}!
                    </h3>
                    <p className="mb-0 ct_para_clr">{displayRole} &bull; {displayEmail}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Link
                    to={pageRoutes.myProfile}
                    className="btn ct_green_btn ct_btn_h_42 px-4 fs-6"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="row">
            {/* Card 1 - Total Assigned */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_1.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>0</h3>
                  <p>Assigned Vans</p>
                </div>
              </div>
            </div>

            {/* Card 2 - Active Services */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_2.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>0</h3>
                  <p>Active Services</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Pending Inspections */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_3.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>0</h3>
                  <p>Pending Inspections</p>
                </div>
              </div>
            </div>

            {/* Card 4 - Completed Tasks */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_4.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>0</h3>
                  <p>Completed Tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Account Information */}
          <div className="row mt-2">
            <div className="col-12">
              <div className="ct_profile_card p-4">
                <h5 className="mb-4 ct_head_clr fs-5 ct_fw_600">Quick Profile Details</h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="ct_para_clr fs-6 mb-1 d-block">Full Name</label>
                    <span className="ct_fw_600 ct_head_clr">{displayName}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="ct_para_clr fs-6 mb-1 d-block">Email Address</label>
                    <span className="ct_fw_600 ct_head_clr">{displayEmail || 'N/A'}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="ct_para_clr fs-6 mb-1 d-block">Phone Number</label>
                    <span className="ct_fw_600 ct_head_clr">{displayPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
