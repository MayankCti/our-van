import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import {
  getTechnicianById,
  toggleBlockTechnician,
} from '../../redux/slices/technicianSlice';

const TechnicianDetail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const techId = searchParams.get('id') || searchParams.get('tech_id');

  const {
    technicianDetails,
    isDetailsLoading = false,
    detailsError = null,
    isActionLoading = false,
  } = useSelector((state) => state.technicianReducer || {});

  useEffect(() => {
    if (techId) {
      dispatch(getTechnicianById({ id: techId }));
    }
  }, [dispatch, techId]);

  const tech = technicianDetails?.data || technicianDetails || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString || 'N/A';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'T';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isTechnicianActive = () => {
    if (tech.is_block !== undefined && tech.is_block !== null) {
      return tech.is_block === 0;
    }
    return tech.status === 1;
  };

  const handleToggleStatus = () => {
    if (!techId) return;
    dispatch(toggleBlockTechnician({ id: techId }));
  };

  const active = isTechnicianActive();

  return (
    <Layout>
      <SubHeader
        title={tech?.full_name ? `${tech.full_name} Details` : 'Technician Details'}
        subtitle="View complete information and status of the technician."
        backUrl={pageRoutes.technicians}
      >
        {tech?.id && (
          <div className="d-flex align-items-center gap-3">
            <span
              className={`badge ${active
                ? 'bg-success-subtle text-success border border-success-subtle'
                : 'bg-danger-subtle text-danger border border-danger-subtle'
                }`}
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: '20px',
              }}
            >
              {active ? 'Active' : 'Blocked'}
            </span>

            <button
              type="button"
              className={`btn btn-sm ${active ? 'btn-outline-danger' : 'btn-outline-success'
                } ct_fw_600 px-3 py-1`}
              onClick={handleToggleStatus}
              disabled={isActionLoading}
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              {isActionLoading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : active ? (
                'Block Technician'
              ) : (
                'Unblock Technician'
              )}
            </button>
          </div>
        )}
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-4">
        {isDetailsLoading && !technicianDetails ? (
          <div className="ct_profile_card text-center py-5">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Loading technician details...</span>
            </div>
            <p className="text-muted ct_fs_15 mb-0">Loading technician details...</p>
          </div>
        ) : !techId ? (
          <div className="ct_profile_card text-center py-5">
            <i className="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">No Technician Selected</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              Please select a technician from the technicians list to view details.
            </p>
            <div className="d-flex justify-content-center">
              <Link
                to={pageRoutes.technicians}
                className="ct_green_btn ct_btn_h_42 text-decoration-none d-inline-flex align-items-center justify-content-center px-4"
              >
                Back to Technicians List
              </Link>
            </div>
          </div>
        ) : detailsError && !technicianDetails ? (
          <div className="ct_profile_card text-center py-5">
            <i className="fa-solid fa-circle-xmark text-danger fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Failed to Load Technician Details</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              {typeof detailsError === 'string' ? detailsError : 'An error occurred while fetching details.'}
            </p>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="ct_green_btn ct_btn_h_42 border-0 px-4 d-inline-flex align-items-center justify-content-center"
                onClick={() => dispatch(getTechnicianById({ id: techId }))}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <section className="ct_profile_card">
            {/* Header / Basic Information */}
            <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
              <div className="ct_van_det_icon_box">
                <i className="fa-solid fa-user-gear text-success"></i>
              </div>
              <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">Technician Information</h5>
            </div>

            {/* Profile Banner */}
            <div className="row align-items-center mb-4 pb-4 border-bottom">
              <div className="col-auto">
                <img
                  src={tech.profile_image || "/image.png"}
                  alt={tech.full_name || "Profile"}
                  className="rounded-circle object-fit-cover shadow-sm border"
                  style={{
                    width: '84px',
                    height: '84px',
                    cursor: tech.profile_image ? 'pointer' : 'default',
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image.png';
                  }}
                  onClick={() => tech.profile_image && window.open(tech.profile_image, '_blank')}
                  title={tech.profile_image ? "Click to view image in full size" : "Technician Profile"}
                />
              </div>

              <div className="col">
                <h4 className="ct_head_clr ct_fs_20 ct_fw_600 mb-1">
                  {tech.full_name || 'N/A'}
                </h4>
                <div className="d-flex flex-wrap align-items-center gap-3 text-muted ct_fs_13">
                  <span>
                    <i className="fa-regular fa-envelope me-1 text-success"></i>
                    {tech.email || 'N/A'}
                  </span>
                  <span>
                    <i className="fa-solid fa-phone me-1 text-success"></i>
                    {tech.phone_number
                      ? `${tech.country_code ? tech.country_code + ' ' : ''}${tech.phone_number}`
                      : 'N/A'}
                  </span>

                </div>
              </div>
            </div>

            {/* Comprehensive Detail Fields Grid */}
            <div className="row gy-4">


              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Full Name
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{tech.full_name || 'N/A'}</h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Email Address
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500 text-break">{tech.email || 'N/A'}</h6>
              </div>



              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Phone Number
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">{tech.country_code || ''}{tech.phone_number || 'N/A'}</h6>
              </div>





              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Joined Date
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {formatDate(tech.created_at)}
                </h6>
              </div>


            </div>


          </section>
        )}
      </div>
    </Layout>
  );
};

export default TechnicianDetail;
