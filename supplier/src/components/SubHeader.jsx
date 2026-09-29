import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SubHeader = ({
  title,
  subtitle,
  backUrl,
  onBack,
  showBack,
  children,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  const responsiveColClass = className.includes('ct_flex_col_')
    ? ''
    : 'ct_flex_col_575';

  return (
    <div
      className={`ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ${responsiveColClass} ${className}`.trim()}
    >
      <div className="d-flex align-items-center justify-content-start gap-2">
        {backUrl ? (
          <Link to={backUrl} className="d-inline-flex align-items-center text-dark text-decoration-none">
            <i className="fa-solid fa-chevron-left"></i>
          </Link>
        ) : (onBack || showBack) ? (
          <button
            type="button"
            onClick={handleBack}
            className="btn p-0 border-0 bg-transparent d-inline-flex align-items-center text-dark"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        ) : null}

        <div>
          {title && <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">{title}</h4>}
          {subtitle && <p className="mb-0 ct_para_clr">{subtitle}</p>}
        </div>
      </div>

      {children && <div className="ct_w_100_575">{children}</div>}
    </div>
  );
};

export default SubHeader;
