import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import { authGetProfile } from '../../redux/actions/authAction';
import { pipGetProfile } from '../../utils/pip';

const Dashboard = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state?.authReducer?.user);
  const user = reduxUser || pipGetProfile() || {};

  useEffect(() => {
    dispatch(authGetProfile());
  }, [dispatch]);

  const displayName = user?.full_name || 'Supplier';
  const companyName = user?.company_name || 'Supplier Business';
  const city = user?.city || 'N/A';
  const serviceRegion = user?.service_region || 'N/A';
  const abn = user?.abn || 'N/A';
  const servicesOffered = user?.services_offered || 'N/A';

  return (
    <Layout>
      <SubHeader
        title="Supplier Dashboard"
        subtitle="Welcome to your supplier management portal."
      />
      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">
          {/* Stat Cards */}
          <div className="row">
            {/* Card 1 - Parts Supplied */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_1.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>0</h3>
                  <p>Parts Listed</p>
                </div>
              </div>
            </div>

            {/* Card 2 - Active Orders */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_2.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>0</h3>
                  <p>Active Orders</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Pending Deliveries */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_3.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>0</h3>
                  <p>Pending Deliveries</p>
                </div>
              </div>
            </div>

            {/* Card 4 - Completed Orders */}
            <div className="col-xl-3 col-lg-6 mb-4 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="/assets/img/dash_icon_4.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>0</h3>
                  <p>Completed Orders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Supplier Information */}
          <div className="row mt-2">
            <div className="col-12">
              <div className="ct_profile_card p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="mb-0 ct_head_clr fs-5 ct_fw_600">Supplier & Business Overview</h5>
                  <Link to={pageRoutes.editProfile} className="ct_green_text fw-semibold small">
                    <i className="fa-solid fa-pen-to-square me-1"></i> Edit Info
                  </Link>
                </div>
                <div className="row g-4">
                  <div className="col-md-3 col-sm-6">
                    <label className="ct_para_clr fs-6 mb-1 d-block">Company Name</label>
                    <span className="ct_fw_600 ct_head_clr">{companyName}</span>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <label className="ct_para_clr fs-6 mb-1 d-block">Contact Person</label>
                    <span className="ct_fw_600 ct_head_clr">{displayName}</span>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <label className="ct_para_clr fs-6 mb-1 d-block">ABN / Business ID</label>
                    <span className="ct_fw_600 ct_head_clr">{abn}</span>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <label className="ct_para_clr fs-6 mb-1 d-block">City / Region</label>
                    <span className="ct_fw_600 ct_head_clr">{city} {serviceRegion !== 'N/A' ? `(${serviceRegion})` : ''}</span>
                  </div>
                  <div className="col-12">
                    <label className="ct_para_clr fs-6 mb-1 d-block">Services / Parts Offered</label>
                    <span className="ct_fw_600 ct_head_clr">{servicesOffered}</span>
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
