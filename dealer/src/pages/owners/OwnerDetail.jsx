import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import StatusBadge from '../../components/StatusBadge';
import PaginationDropdown from '../../components/table/PaginationDropdown';
import ReactPagination from '../../components/table/ReactPagination';
import useDebounce from '../../hooks/useDebounce';
import { getOwnerDetails } from '../../redux/slices/vanSlice';

const OwnerDetail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const ownerId = searchParams.get('owner_id') || searchParams.get('id');

  const {
    ownerDetailsData,
    isOwnerDetailsLoading = false,
    ownerDetailsError = null,
  } = useSelector((state) => state.vanReducer || {});

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (ownerId) {
      dispatch(getOwnerDetails({ ownerId }));
    }
  }, [dispatch, ownerId]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, listPerPages]);

  const ownerData = ownerDetailsData?.data || ownerDetailsData || {};
  const owner = ownerData?.owner || {};
  const rawAssignedVans = Array.isArray(ownerData?.assignedVans)
    ? ownerData.assignedVans
    : [];
  const totalAssignedVans =
    ownerData?.totalAssignedVans !== undefined
      ? ownerData.totalAssignedVans
      : rawAssignedVans.length;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString || 'N/A';
    }
  };

  const getProgressNum = (item) => {
    if (item?.progress !== undefined && item?.progress !== null) {
      const val = item.progress;
      const num =
        typeof val === 'number'
          ? val
          : parseFloat(String(val).replace('%', ''));
      return !isNaN(num) ? Math.min(Math.max(Math.round(num), 0), 100) : 0;
    }
    const vd = item?.vanDetails || {};
    if (vd.currentStep && vd.totalSteps) {
      const cur = Number(vd.currentStep);
      const total = Number(vd.totalSteps);
      if (total > 0) {
        return Math.min(Math.max(Math.round((cur / total) * 100), 0), 100);
      }
    }
    const status = String(vd.status || item.status || '').toUpperCase();
    if (status === 'COMPLETED' || status === 'PUBLISHED') return 100;
    return 0;
  };

  // Filter assigned vans based on search term
  const filteredVans = useMemo(() => {
    if (!debouncedSearch.trim()) return rawAssignedVans;
    const q = debouncedSearch.toLowerCase().trim();
    return rawAssignedVans.filter((van) => {
      const vd = van.vanDetails || {};
      const vanName = (vd.vanName || van.vanName || '').toLowerCase();
      const reg = (
        vd.registrationNumber ||
        van.registrationNumber ||
        ''
      ).toLowerCase();
      const vin = (vd.vinNumber || van.vinNumber || '').toLowerCase();
      const make = (vd.make || '').toLowerCase();
      const model = (vd.model || '').toLowerCase();
      const year = String(vd.year || '');
      const status = (vd.status || van.assignmentStatus || '').toLowerCase();

      return (
        vanName.includes(q) ||
        reg.includes(q) ||
        vin.includes(q) ||
        make.includes(q) ||
        model.includes(q) ||
        year.includes(q) ||
        status.includes(q)
      );
    });
  }, [rawAssignedVans, debouncedSearch]);

  // Pagination for assigned vans
  const totalItems = filteredVans.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / listPerPages));
  const displayedVans = useMemo(() => {
    const start = currentPage * listPerPages;
    return filteredVans.slice(start, start + listPerPages);
  }, [filteredVans, currentPage, listPerPages]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <Layout>
      <SubHeader
        title={
          owner?.ownerName
            ? `${owner.ownerName} Details`
            : 'Owner Details'
        }
        subtitle="View complete owner information and their assigned vans."
        backUrl={pageRoutes.owners}
      />

      <div className="ct_px_30 mt-4 pb-4">
        {isOwnerDetailsLoading && !ownerDetailsData ? (
          <div className="ct_profile_card text-center py-5">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Loading owner details...</span>
            </div>
            <p className="text-muted ct_fs_15 mb-0">Loading owner details...</p>
          </div>
        ) : !ownerId ? (
          <div className="ct_profile_card text-center py-5">
            <i className="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">
              No Owner Selected
            </h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              Please select an owner from the owners list to view details.
            </p>
            <div className="d-flex justify-content-center">
              <Link
                to={pageRoutes.owners}
                className="ct_green_btn ct_btn_h_42 text-decoration-none d-inline-flex align-items-center justify-content-center px-4"
              >
                Back to Owners List
              </Link>
            </div>
          </div>
        ) : ownerDetailsError && !ownerDetailsData ? (
          <div className="ct_profile_card text-center py-5">
            <i className="fa-solid fa-circle-xmark text-danger fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">
              Failed to Load Owner Details
            </h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              {typeof ownerDetailsError === 'string'
                ? ownerDetailsError
                : 'An error occurred while fetching details.'}
            </p>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="ct_green_btn ct_btn_h_42 border-0 px-4 d-inline-flex align-items-center justify-content-center"
                onClick={() => dispatch(getOwnerDetails({ ownerId }))}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {/* Owner Information Card */}
            <section className="ct_profile_card">
              <div className="mb-4 pb-2 border-bottom">
                <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">
                  Owner Information
                </h5>
              </div>

              {/* Profile Details */}
              <div className="row align-items-center">
                <div className="col-auto">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-light text-success fw-bold shadow-sm border"
                    style={{
                      width: '64px',
                      height: '64px',
                      fontSize: '22px',
                    }}
                  >
                    <i className="fa-solid fa-user text-success"></i>
                  </div>
                </div>

                <div className="col">
                  <h4 className="ct_head_clr ct_fs_20 ct_fw_600 mb-1">
                    {owner.ownerName || 'N/A'}
                  </h4>
                  <div className="d-flex flex-wrap align-items-center gap-4 text-muted ct_fs_14">
                    <span>
                      <i className="fa-regular fa-envelope me-1 text-success"></i>
                      {owner.email || 'N/A'}
                    </span>
                    <span>
                      <i className="fa-solid fa-phone me-1 text-success"></i>
                      {owner.mobileNumber || 'N/A'}
                    </span>
                    <span>
                      <i className="fa-regular fa-calendar me-1 text-success"></i>
                      Joined: {formatDate(owner.joinedOn)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Assigned Vans Table Section */}
            <section className="ct_profile_card">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom flex-wrap gap-2">
                <div>
                  <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">
                    Assigned Vans
                  </h5>
                  <p className="ct_para_clr ct_fs_13 mb-0">
                    All vehicles registered and assigned to {owner.ownerName || 'this owner'}.
                  </p>
                </div>
                <span className="badge bg-light text-dark border ct_fs_12 px-3 py-2">
                  Total: {totalAssignedVans}
                </span>
              </div>

              {/* Search Bar for Assigned Vans */}
              <div className="mb-4 position-relative">
                <svg
                  className="ct_search_icon"
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 15L11.25 11.25M0.5 6.75C0.5 3.29822 3.29822 0.5 6.75 0.5C10.2018 0.5 13 3.29822 13 6.75C13 10.2018 10.2018 13 6.75 13C3.29822 13 0.5 10.2018 0.5 6.75Z"
                    stroke="#475569"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  type="text"
                  className="form-control ct_input ct_input_ps_40 ct_fs_14"
                  placeholder="Search assigned vans by Name, Registration Number, VIN, Make..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchTerm && (
                  <button
                    type="button"
                    className="btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(0);
                    }}
                    aria-label="Clear search"
                    style={{
                      background: 'none',
                      cursor: 'pointer',
                      zIndex: 5,
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {/* Assigned Vans Table (Matching Vans page table, without Owner Name column) */}
              <div className="table-responsive ct_custom_table">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Van Name</th>
                      <th>Registration Number</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedVans.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-5 text-muted ct_fs_14"
                        >
                          {searchTerm
                            ? 'No assigned vans match your search.'
                            : 'No assigned vans found for this owner.'}
                        </td>
                      </tr>
                    ) : (
                      displayedVans.map((van, index) => {
                        const vd = van.vanDetails || {};
                        const vanId = van.vanId || vd.vanId || vd.id || van.id;
                        const progressNum = getProgressNum(van);

                        return (
                          <tr key={van.assignmentId || vanId || index}>
                            <td>{currentPage * listPerPages + index + 1}</td>
                            <td className="ct_fw_600">
                              {vd.vanName || van.vanName || 'N/A'}
                            </td>
                            <td>
                              {vd.registrationNumber ||
                                van.registrationNumber ||
                                'N/A'}
                            </td>
                            <td>
                              <div
                                className="d-flex align-items-center gap-2"
                                style={{ minWidth: '110px', maxWidth: '150px' }}
                              >
                                <div
                                  className="progress flex-grow-1"
                                  style={{
                                    height: '6px',
                                    backgroundColor: '#E2E8F0',
                                    borderRadius: '10px',
                                  }}
                                >
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${progressNum}%`,
                                      backgroundColor:
                                        progressNum >= 100
                                          ? '#05c46b'
                                          : '#3D8B37',
                                      borderRadius: '10px',
                                    }}
                                    aria-valuenow={progressNum}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                                <span className="ct_fs_12 ct_fw_600 text-nowrap">
                                  {progressNum}%
                                </span>
                              </div>
                            </td>
                            <td>
                              <StatusBadge
                                status={
                                  vd.status ||
                                  van.assignmentStatus ||
                                  van.status
                                }
                              />
                            </td>
                            <td>
                              {formatDate(
                                van.assignedAt ||
                                  vd.purchaseDate ||
                                  van.createdAt
                              )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <Link
                                  to={`${pageRoutes.van_detail}?van_id=${vanId}`}
                                  className="ct_action_icon_btn ct_view_btn"
                                  title="View Details"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </Link>
                                {progressNum < 100 && (
                                  <Link
                                    to={`${pageRoutes.vehicle_information}?van_id=${vanId}`}
                                    className="ct_action_icon_btn ct_edit_btn"
                                    title="Edit Van"
                                  >
                                    <i className="fa-regular fa-pen-to-square"></i>
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Assigned Vans */}
              {filteredVans.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                  <div>
                    <PaginationDropdown
                      listPerPages={listPerPages}
                      options={[5, 10, 25, 50]}
                      onChange={(val) => {
                        setListPerPages(val);
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                  <div>
                    <ReactPagination
                      pageCount={totalPages}
                      onPageChange={handlePageClick}
                      currentPage={currentPage}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OwnerDetail;
