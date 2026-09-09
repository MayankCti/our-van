import React from 'react';
import Layout from '../../layout/Layout';
import { Link } from "react-router-dom";
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';

const Vans = () => {
  return (
    <Layout>
      <SubHeader
        title="Vans"
        subtitle="Manage all customer vans, vehicle information, warranties, and maintenance records."
      >
        <Link to={pageRoutes.vehicle_information} className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575">
          Add New Van
        </Link>
      </SubHeader>
      <div className="ct_px_30 mt-4 pb-4">
        <div class="container-fluid">

          {/* Search  */}
          <div class="mb-4 position-relative">
            <svg class="ct_search_icon" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15L11.25 11.25M0.5 6.75C0.5 3.29822 3.29822 0.5 6.75 0.5C10.2018 0.5 13 3.29822 13 6.75C13 10.2018 10.2018 13 6.75 13C3.29822 13 0.5 10.2018 0.5 6.75Z" stroke="#475569" stroke-linecap="round" stroke-linejoin="round" />
            </svg>


            <input
              type="text"
              class="form-control ct_input ct_input_ps_40 ct_fs_14"
              placeholder="Search by VIN, Registration, Owner or Van Name" />
          </div>

          {/* Table */}
          <div class="table-responsive ct_custom_table">
            <table class="table  align-middle mb-0">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Owner Name</th>
                  <th>Van Name</th>
                  <th>Registration Number</th>
                  <th>Date Purchased</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>1</td>
                  <td>John Smith</td>
                  <td>Jayco Journey</td>
                  <td>NSW 482 XYZ</td>
                  <td>13 Jul 2026</td>
                  <td>
                    <Link to={pageRoutes.van_detail} class="ct_action_link">View Details</Link>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Jaiden Nixon</td>
                  <td>Jayco Journey</td>
                  <td>NSW 482 XYZ</td>
                  <td>13 Jul 2026</td>
                  <td>
                    <Link to={pageRoutes.van_detail} class="ct_action_link">View Details</Link>
                  </td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>John Smith</td>
                  <td>Jayco Journey</td>
                  <td>NSW 482 XYZ</td>
                  <td>13 Jul 2026</td>
                  <td>
                    <Link to={pageRoutes.van_detail} class="ct_action_link">View Details</Link>
                  </td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>Nikolai Schmidt</td>
                  <td>Jayco Journey</td>
                  <td>NSW 482 XYZ</td>
                  <td>13 Jul 2026</td>
                  <td>
                    <Link to={pageRoutes.van_detail} class="ct_action_link">View Details</Link>
                  </td>
                </tr>

                <tr>
                  <td>5</td>
                  <td>John Smith</td>
                  <td>Jayco Journey</td>
                  <td>NSW 482 XYZ</td>
                  <td>13 Jul 2026</td>
                  <td>
                    <Link to={pageRoutes.van_detail} class="ct_action_link">View Details</Link>
                  </td>
                </tr>

              </tbody>

            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Vans;
