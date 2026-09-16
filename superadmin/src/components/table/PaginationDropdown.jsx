import React from "react";
import "./index.css";

const PaginationDropdown = ({
  onChange,
  listPerPages = 10,
  options = [5, 10, 25, 50, 100],
}) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <span className="ct_fs_13 ct_para_clr text-nowrap">Show:</span>
      <select
        className="ct_pagination_select_21"
        value={listPerPages}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PaginationDropdown;
