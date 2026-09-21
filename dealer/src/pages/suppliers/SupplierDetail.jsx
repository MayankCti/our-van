import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import { pageRoutes } from '../../routes/PageRoutes';
import SubHeader from '../../components/SubHeader';
import {
  getSupplierById,
  toggleBlockSupplier,
} from '../../redux/slices/supplierSlice';

const SupplierDetail = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get('id') || searchParams.get('supplier_id');

  const {
    supplierDetails,
    isDetailsLoading = false,
    detailsError = null,
    isActionLoading = false,
  } = useSelector((state) => state.supplierReducer || {});

  useEffect(() => {
    if (supplierId) {
      dispatch(getSupplierById({ id: supplierId }));
    }
  }, [dispatch, supplierId]);

  const supplier = supplierDetails?.data || supplierDetails || {};

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

  const isSupplierActive = () => {
    if (supplier.is_block !== undefined && supplier.is_block !== null) {
      return supplier.is_block === 0;
    }
    return supplier.status === 1;
  };

  const handleToggleStatus = () => {
    if (!supplierId) return;
    dispatch(toggleBlockSupplier({ id: supplierId }));
  };

  const active = isSupplierActive();
  const supplierLogo =
    supplier.company_logo || supplier.profile_image || '/image.png';
  const displayName =
    supplier.company_name || supplier.full_name || 'Supplier Details';

  const getTradeLicenseUrl = (license) => {
    if (!license) return '#';
    if (
      license.startsWith('http://') ||
      license.startsWith('https://') ||
      license.startsWith('blob:') ||
      license.startsWith('data:')
    ) {
      return license;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const rootUrl = baseUrl.replace(/\/api\/?$/, '');
    return `${rootUrl}/${license.replace(/^\//, '')}`;
  };

  return (
    <Layout>
      <SubHeader
        title="Supplier Details"
        subtitle="View complete information and status of the supplier."
        backUrl={pageRoutes.suppliers}
      >
        {supplier?.id && (
          <div className="d-flex align-items-center gap-3">
            <span
              className={`badge ${
                active
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
              className={`btn btn-sm ${
                active ? 'btn-outline-danger' : 'btn-outline-success'
              } ct_fw_600 px-3 py-1`}
              onClick={handleToggleStatus}
              disabled={isActionLoading}
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              {isActionLoading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : active ? (
                'Block Supplier'
              ) : (
                'Unblock Supplier'
              )}
            </button>
          </div>
        )}
      </SubHeader>

      <div className="ct_px_30 mt-4 pb-4">
        {isDetailsLoading && !supplierDetails ? (
          <div className="ct_profile_card text-center py-5">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Loading supplier details...</span>
            </div>
            <p className="text-muted ct_fs_15 mb-0">Loading supplier details...</p>
          </div>
        ) : !supplierId ? (
          <div className="ct_profile_card text-center py-5">
            <i className="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">No Supplier Selected</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              Please select a supplier from the suppliers list to view details.
            </p>
            <div className="d-flex justify-content-center">
              <Link
                to={pageRoutes.suppliers}
                className="ct_green_btn ct_btn_h_42 text-decoration-none d-inline-flex align-items-center justify-content-center px-4"
              >
                Back to Suppliers List
              </Link>
            </div>
          </div>
        ) : detailsError && !supplierDetails ? (
          <div className="ct_profile_card text-center py-5">
            <i className="fa-solid fa-circle-xmark text-danger fs-1 mb-3"></i>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Failed to Load Supplier Details</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              {typeof detailsError === 'string' ? detailsError : 'An error occurred while fetching details.'}
            </p>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="ct_green_btn ct_btn_h_42 border-0 px-4 d-inline-flex align-items-center justify-content-center"
                onClick={() => dispatch(getSupplierById({ id: supplierId }))}
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
                <i className="fa-solid fa-truck-field text-success"></i>
              </div>
              <h5 className="ct_green_text ct_fs_16 ct_fw_600 mb-0">Supplier Information</h5>
            </div>

            {/* Profile Banner */}
            <div className="row align-items-center mb-4 pb-4 border-bottom">
              <div className="col-auto">
                <img
                  src={supplierLogo}
                  alt={displayName || 'Profile'}
                  className="rounded-circle object-fit-cover shadow-sm border"
                  style={{
                    width: '84px',
                    height: '84px',
                    cursor: (supplier.company_logo || supplier.profile_image) ? 'pointer' : 'default',
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image.png';
                  }}
                  onClick={() => {
                    const imgUrl = supplier.company_logo || supplier.profile_image;
                    if (imgUrl) window.open(imgUrl, '_blank');
                  }}
                  title={
                    (supplier.company_logo || supplier.profile_image)
                      ? 'Click to view image in full size'
                      : 'Supplier Logo'
                  }
                />
              </div>

              <div className="col">
                <h4 className="ct_head_clr ct_fs_20 ct_fw_600 mb-1">
                  {supplier.company_name || supplier.full_name || 'N/A'}
                </h4>
                <div className="d-flex flex-wrap align-items-center gap-3 text-muted ct_fs_13">
                  <span>
                    <i className="fa-regular fa-envelope me-1 text-success"></i>
                    {supplier.email || 'N/A'}
                  </span>
                  <span>
                    <i className="fa-solid fa-phone me-1 text-success"></i>
                    {supplier.phone_number
                      ? `${supplier.country_code ? supplier.country_code + ' ' : ''}${supplier.phone_number}`
                      : 'N/A'}
                  </span>
                  {supplier.city && (
                    <span>
                      <i className="fa-solid fa-location-dot me-1 text-success"></i>
                      {supplier.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Comprehensive Detail Fields Grid */}
            <div className="row gy-4">
              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Company Name
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {supplier.company_name || 'N/A'}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Contact Person
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {supplier.full_name || 'N/A'}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Email Address
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500 text-break">
                  {supplier.email || 'N/A'}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Mobile Number
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {supplier.phone_number
                    ? `${supplier.country_code || ''} ${supplier.phone_number}`
                    : 'N/A'}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  City
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {supplier.city || 'N/A'}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  ABN
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {supplier.abn || 'N/A'}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Trade License
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {supplier.trade_license ? (
                    <a
                      href={getTradeLicenseUrl(supplier.trade_license)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center gap-1 text-success text-decoration-underline"
                      title="Click to open Trade License in new window"
                    >
                      <span>View Trade License</span>
                      <i className="fa-solid fa-arrow-up-right-from-square ct_fs_11"></i>
                    </a>
                  ) : (
                    'N/A'
                  )}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Accounting Software
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {supplier.accounting_software_used || 'N/A'}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Service Region
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {supplier.service_region || 'N/A'}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Services Offered
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {supplier.services_offered || 'N/A'}
                </h6>
              </div>

              <div className="col-lg-3 col-sm-6">
                <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                  Joined Date
                </h5>
                <h6 className="mb-0 ct_head_clr ct_fs_15 ct_fw_500">
                  {formatDate(supplier.created_at)}
                </h6>
              </div>

              {supplier.about_us && (
                <div className="col-12">
                  <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                    About Us
                  </h5>
                  <p className="mb-0 ct_head_clr ct_fs_14 ct_fw_400">
                    {supplier.about_us}
                  </p>
                </div>
              )}

              {supplier.company_description && (
                <div className="col-12">
                  <h5 className="ct_fs_12 ct_fw_600 ct_para_clr mb-1 text-uppercase">
                    Company Description
                  </h5>
                  <p className="mb-0 ct_head_clr ct_fs_14 ct_fw_400">
                    {supplier.company_description}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default SupplierDetail;
