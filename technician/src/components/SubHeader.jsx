import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SubHeader = ({
  title,
  subtitle,
  backUrl,
  onBack,
  children,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (!backUrl) {
      navigate(-1);
    }
  };

  return (
    <div className={`ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575 ${className}`}>
      <div className="d-flex align-items-center justify-content-start gap-2">
        {backUrl ? (
          <Link to={backUrl} className="d-inline-flex align-items-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 30L15 20L25 10" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ) : onBack ? (
          <button
            type="button"
            onClick={handleBack}
            className="btn p-0 border-0 bg-transparent d-inline-flex align-items-center"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 30L15 20L25 10" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}

        <div>
          {title && <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">{title}</h4>}
          {subtitle && <p className="mb-0 ct_para_clr">{subtitle}</p>}
        </div>
      </div>

      {children && <div>{children}</div>}
    </div>
  );
};

export default SubHeader;
