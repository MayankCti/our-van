import React from 'react';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';

const Owners = () => {
  return (
    <Layout>
      <SubHeader
        title="Owners"
        subtitle="View and manage all van owners assigned to your dealership."
      />
      <div className="ct_px_30 mt-4 pb-4">
        <div className="container-fluid">
          <div className="mb-4 position-relative">
            <svg className="ct_search_icon" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15L11.25 11.25M0.5 6.75C0.5 3.29822 3.29822 0.5 6.75 0.5C10.2018 0.5 13 3.29822 13 6.75C13 10.2018 10.2018 13 6.75 13C3.29822 13 0.5 10.2018 0.5 6.75Z" stroke="#475569" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <input
              type="text"
              className="form-control ct_input ct_input_ps_40 ct_fs_14"
              placeholder="Search by Owner Name, Email, Phone"
            />
          </div>

          <div className="table-responsive ct_custom_table">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Owner Name</th>
                  <th>Email Address</th>
                  <th>Mobile Number</th>
                  <th>Assigned Van</th>
                  <th>Joined On</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Olivia Brown</td>
                  <td>olivia.brown@email.com.au</td>
                  <td>+61 412 345 678</td>
                  <td>New Age Road Owl</td>
                  <td>13 Jul 2026</td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Olivia Brown</td>
                  <td>olivia.brown@email.com.au</td>
                  <td>+61 412 345 678</td>
                  <td>New Age Road Owl</td>
                  <td>13 Jul 2026</td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Olivia Brown</td>
                  <td>olivia.brown@email.com.au</td>
                  <td>+61 412 345 678</td>
                  <td>New Age Road Owl</td>
                  <td>13 Jul 2026</td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>Olivia Brown</td>
                  <td>olivia.brown@email.com.au</td>
                  <td>+61 412 345 678</td>
                  <td>New Age Road Owl</td>
                  <td>13 Jul 2026</td>
                </tr>

                <tr>
                  <td>5</td>
                  <td>Olivia Brown</td>
                  <td>olivia.brown@email.com.au</td>
                  <td>+61 412 345 678</td>
                  <td>New Age Road Owl</td>
                  <td>13 Jul 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Owners;
