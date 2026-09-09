import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';

const Dashboard = () => {
  return (
    <Layout>
      <SubHeader
        title="Dashboard"
        subtitle="Manage your vans, customers, and ownership profiles from one place."
      />
      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">
          <div className="row">
            {/* Card 1 */}
            <div className="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="assets/img/dash_icon_1.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>74</h3>
                  <p>Total Vans</p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="assets/img/dash_icon_2.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>74</h3>
                  <p>Total Owners</p>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="assets/img/dash_icon_3.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>8</h3>
                  <p>Warranty Alerts</p>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="col-xl-3 col-lg-6 mb-4 mb-xl-0 col-md-6 col-sm-6">
              <div className="ct_dash_card">
                <div className="ct_icon_box">
                  <img src="assets/img/dash_icon_4.png" alt="" />
                </div>
                <div className="ct_card_content">
                  <h3>14</h3>
                  <p>Upcoming Services</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ct_table_wrapper mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="ct_section_title mb-0">Recent Vans</h5>
              <Link to={pageRoutes.vans} className="ct_view_all">View All</Link>
            </div>
            <div className="table-responsive ct_custom_table">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Owner Name</th>
                    <th>Van Name</th>
                    <th>Registration Number</th>
                    <th>Date Purchased</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>John Smith</td>
                    <td>Jayco Journey</td>
                    <td>NSW 482 XYZ</td>
                    <td>13 Jul 2026</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jaiden Nixon</td>
                    <td>Jayco Journey</td>
                    <td>NSW 482 XYZ</td>
                    <td>13 Jul 2026</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>John Smith</td>
                    <td>Jayco Journey</td>
                    <td>NSW 482 XYZ</td>
                    <td>13 Jul 2026</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Nikolai Schmidt</td>
                    <td>Jayco Journey</td>
                    <td>NSW 482 XYZ</td>
                    <td>13 Jul 2026</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>John Smith</td>
                    <td>Jayco Journey</td>
                    <td>NSW 482 XYZ</td>
                    <td>13 Jul 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;
