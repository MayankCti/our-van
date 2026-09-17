import React from 'react';

/**
 * Reusable StatusBadge component
 * Supports COMPLETED, DRAFT, and fallback statuses
 */
const StatusBadge = ({ status, className = '', style = {} }) => {
  if (!status) {
    return (
      <span
        className={`badge bg-secondary-subtle text-secondary ct_fs_12 px-2 py-1 ${className}`}
        style={{
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.3px',
          borderRadius: '6px',
          padding: '4px 8px',
          ...style,
        }}
      >
        N/A
      </span>
    );
  }

  const s = String(status).toUpperCase();
  let badgeClass = 'bg-secondary-subtle text-secondary';

  if (s === 'COMPLETED') {
    badgeClass = 'bg-success-subtle text-success border border-success-subtle';
  } else if (s === 'DRAFT') {
    badgeClass = 'bg-warning-subtle text-warning border border-warning-subtle';
  }

  return (
    <span
      className={`badge ${badgeClass} ${className}`}
      style={{
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.3px',
        borderRadius: '6px',
        padding: '4px 8px',
        ...style,
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
