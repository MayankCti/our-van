import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/Layout";
import Header from "../../layout/Header";
import { pageRoutes } from "../../routes/PageRoutes";
import PaginationDropdown from "../../components/table/PaginationDropdown";
import Pagination from "../../components/table/Pagination";
import useDebounce from "../../hooks/useDebounce";
import { getVansList } from "../../redux/slices/vanSlice";

const Vans = () => {
   const dispatch = useDispatch();

   const {
      vansList = [],
      vansMeta = {},
      isVansLoading = false,
   } = useSelector((state) => state.vanReducer || {});

   const [searchTerm, setSearchTerm] = useState("");
   const debouncedSearch = useDebounce(searchTerm, 400);

   const [listPerPages, setListPerPages] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);

   // Reset to first page when debounced search term changes
   useEffect(() => {
      setCurrentPage(1);
   }, [debouncedSearch]);

   // Fetch vans list when page, limit, or debounced search changes
   useEffect(() => {
      dispatch(
         getVansList({
            page: currentPage,
            limit: listPerPages,
            search: debouncedSearch,
         })
      );
   }, [dispatch, currentPage, listPerPages, debouncedSearch]);

   const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
         const date = new Date(dateString);
         if (isNaN(date.getTime())) return dateString;
         return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
         });
      } catch {
         return dateString || "N/A";
      }
   };

   const totalPages =
      vansMeta?.totalPages ||
      Math.ceil((vansMeta?.totalItems || 0) / listPerPages) ||
      1;

   const totalItems = vansMeta?.totalItems ?? vansList.length;
   const startItem = totalItems === 0 ? 0 : (currentPage - 1) * listPerPages + 1;
   const endItem = Math.min(currentPage * listPerPages, totalItems);

   return (
      <Layout>
         <div className="ct_right_panel">
            <Header />
            <div className="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
               <div>
                  <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">Vans</h4>
                  <p className="mb-0 ct_para_clr">
                     Manage all customer vans, vehicle information, warranties, and maintenance records.
                  </p>
               </div>
            </div>

            <div className="ct_px_30 mt-4 pb-4">
               <div className="container-fluid">
                  {/* Search */}
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
                        placeholder="Search by VIN, Registration, Owner or Van Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />

                     {searchTerm && (
                        <button
                           type="button"
                           className="btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                           onClick={() => {
                              setSearchTerm("");
                              setCurrentPage(1);
                           }}
                           aria-label="Clear search"
                           style={{ background: "none", cursor: "pointer", zIndex: 5 }}
                        >
                           <i className="fa-solid fa-xmark"></i>
                        </button>
                     )}
                  </div>

                  {/* Table */}
                  <div className="table-responsive ct_custom_table">
                     <table className="table align-middle mb-0">
                        <thead>
                           <tr>
                              <th>#</th>
                              <th>Van Name</th>
                              <th>VIN</th>
                              <th>Registration Number</th>
                              <th>Dealer</th>
                              <th>Owner Name</th>
                              <th>Date Registered</th>
                              <th>Action</th>
                           </tr>
                        </thead>

                        <tbody>
                           {isVansLoading ? (
                              <tr>
                                 <td colSpan="8" className="text-center py-5">
                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                       <div
                                          className="spinner-border spinner-border-sm text-success"
                                          role="status"
                                       ></div>
                                       <span className="text-muted ct_fs_14">Loading vans...</span>
                                    </div>
                                 </td>
                              </tr>
                           ) : vansList?.length === 0 ? (
                              <tr>
                                 <td colSpan="8" className="text-center py-5 text-muted ct_fs_14">
                                    No vans found.
                                 </td>
                              </tr>
                           ) : (
                              vansList.map((van, index) => {
                                 const vanId = van.vanId || van.id || van.van_id;
                                 const serialNumber = (currentPage - 1) * listPerPages + index + 1;
                                 const vanName = van.vanName || "N/A";
                                 const vin = van.VIN_Number || "-";
                                 const registrationNumber = van.registrationNumber || "-";
                                 const dealerName = van.dealerName || "-";
                                 const ownerName = van.ownerName || "-";
                                 const dateRegistered = formatDate(
                                    van.dateRegistered || van.date_registered || van.createdAt
                                 );

                                 return (
                                    <tr key={vanId || index}>
                                       <td>{serialNumber}</td>
                                       <td className="ct_fw_600">{vanName}</td>
                                       <td>{vin}</td>
                                       <td>{registrationNumber}</td>
                                       <td>{dealerName}</td>
                                       <td>{ownerName}</td>
                                       <td>{dateRegistered}</td>
                                       <td>
                                          <Link
                                             to={`${pageRoutes.van_detail}?id=${vanId}`}
                                             className="ct_action_link"
                                          >
                                             View Details
                                          </Link>
                                       </td>
                                    </tr>
                                 );
                              })
                           )}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination footer */}
                  {!isVansLoading && vansList?.length > 0 && (
                     <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-4">
                        <div className="d-flex align-items-center gap-3">
                           <PaginationDropdown
                              listPerPages={listPerPages}
                              onChange={(num) => {
                                 setListPerPages(num);
                                 setCurrentPage(1);
                              }}
                           />
                           <span className="ct_fs_13 ct_para_clr">
                              Showing {startItem} to {endItem} of {totalItems} vans
                           </span>
                        </div>

                        <Pagination
                           totalPages={totalPages}
                           currentPage={currentPage}
                           onPageChange={(page) => setCurrentPage(page)}
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default Vans;