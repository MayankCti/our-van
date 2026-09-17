import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import Layout from "../../layout/Layout";
import Header from "../../layout/Header";
import PaginationDropdown from "../../components/table/PaginationDropdown";
import Pagination from "../../components/table/Pagination";
import useDebounce from "../../hooks/useDebounce";
import {
  getComponentsList,
  createComponent,
  editComponent,
  deleteComponent,
} from "../../redux/slices/componentSlice";
import { componentSchema } from "../../utils/Schema";

const ComponentsLibrary = () => {
  const dispatch = useDispatch();
  const addModalCloseRef = useRef(null);
  const editModalCloseRef = useRef(null);
  const deleteModalCloseRef = useRef(null);

  const [selectedComponent, setSelectedComponent] = useState(null);
  const [editName, setEditName] = useState("");

  const {
    componentsList = [],
    componentsMeta = {},
    isComponentsLoading = false,
    isCreateComponentLoading = false,
    isEditComponentLoading = false,
    isDeleteComponentLoading = false,
  } = useSelector((state) => state.componentReducer || {});

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [listPerPages, setListPerPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when debounced search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch components list when page, limit, or debounced search changes
  useEffect(() => {
    dispatch(
      getComponentsList({
        page: currentPage,
        limit: listPerPages,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, listPerPages, debouncedSearch]);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: componentSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(
        createComponent({
          payload: {
            name: values.name.trim(),
          },
          callback: (res) => {
            if (res?.success || res?.status || res?.statusCode === 200 || res?.statusCode === 201) {
              addModalCloseRef.current?.click();
              resetForm();
              dispatch(
                getComponentsList({
                  page: currentPage,
                  limit: listPerPages,
                  search: debouncedSearch,
                })
              );
            }
          },
        })
      );
    },
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName.trim() || !selectedComponent?.id) return;
    dispatch(
      editComponent({
        payload: {
          id: selectedComponent.id,
          name: editName.trim(),
        },
        callback: (res) => {
          if (res?.success || res?.status || res?.statusCode === 200) {
            editModalCloseRef.current?.click();
            setSelectedComponent(null);
            setEditName("");
            dispatch(
              getComponentsList({
                page: currentPage,
                limit: listPerPages,
                search: debouncedSearch,
              })
            );
          }
        },
      })
    );
  };

  const handleDeleteSubmit = () => {
    if (!selectedComponent?.id) return;
    dispatch(
      deleteComponent({
        id: selectedComponent.id,
        payload: {
          name: selectedComponent.name,
        },
        callback: (res) => {
          if (res?.success || res?.status || res?.statusCode === 200) {
            deleteModalCloseRef.current?.click();
            setSelectedComponent(null);
            dispatch(
              getComponentsList({
                page: currentPage,
                limit: listPerPages,
                search: debouncedSearch,
              })
            );
          }
        },
      })
    );
  };

  const totalPages =
    componentsMeta?.totalPages ||
    Math.ceil((componentsMeta?.totalItems || 0) / listPerPages) ||
    1;

  const totalItems = componentsMeta?.totalItems ?? componentsList.length;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * listPerPages + 1;
  const endItem = Math.min(currentPage * listPerPages, totalItems);

  return (
    <Layout>
      <div className="ct_right_panel">
        <Header />
        <div className="ct_inner_header_bg mt-4 ct_px_30 d-flex align-items-center justify-content-between gap-3 ct_flex_col_575">
          <div>
            <h4 className="fs-4 ct_head_clr ct_fw_600 mb-0 ct_black_text">
              Components Library
            </h4>
            <p className="mb-0 ct_para_clr">
              Manage all standard vehicle components across the platform.
            </p>
          </div>
          <a
            className="ct_green_btn ct_btn_h_42 fs-6 ct_w_100_575 text-decoration-none d-inline-flex align-items-center justify-content-center"
            data-bs-target="#addComponentModal"
            data-bs-toggle="modal"
            style={{ cursor: "pointer" }}
          >
            Add Component
          </a>
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
                placeholder="Search by component name..."
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
                    <th style={{ width: "80px" }}>#</th>
                    <th>Component Name</th>
                    <th style={{ width: "130px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isComponentsLoading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-5">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div
                            className="spinner-border spinner-border-sm text-success"
                            role="status"
                          ></div>
                          <span className="text-muted ct_fs_14">
                            Loading components...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : componentsList?.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted ct_fs_14">
                        No components found.
                      </td>
                    </tr>
                  ) : (
                    componentsList.map((component, index) => {
                      const componentId = component.id || component.component_id || index;
                      const serialNumber =
                        (currentPage - 1) * listPerPages + index + 1;
                      const name = component.name || "N/A";

                      return (
                        <tr key={componentId}>
                          <td>{serialNumber}</td>
                          <td className="ct_fw_600 ct_black_text">{name}</td>
                          <td className="text-center">
                            <div className="d-flex align-items-center justify-content-center gap-3">
                              {/* Edit Button */}
                              <button
                                type="button"
                                className="ct_action_icon_btn ct_edit_btn border-0"
                                title="Edit Component"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_component_modal"
                                onClick={() => {
                                  setSelectedComponent(component);
                                  setEditName(component.name || "");
                                }}
                              >
                                <i className="fa-regular fa-pen-to-square"></i>
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                className="ct_action_icon_btn ct_delete_btn border-0"
                                title="Delete Component"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteComponentModal"
                                onClick={() => setSelectedComponent(component)}
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {!isComponentsLoading && componentsList?.length > 0 && (
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
                    Showing {startItem} to {endItem} of {totalItems} components
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

      {/* Add Component Modal */}
      <div
        className="modal fade"
        id="addComponentModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "590px" }}
        >
          <div className="modal-content ct_modal">
            {/* Header */}
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="ct_fs_20 ct_fw_600 ct_head_clr mb-1">
                  Add Component
                </h5>
                <p className="ct_fs_14 ct_para_clr mb-0">
                  Add a new standard component to the library.
                </p>
              </div>
              <button
                type="button"
                ref={addModalCloseRef}
                className="btn-close shadow-none"
                data-bs-dismiss="modal"
                onClick={() => formik.resetForm()}
              ></button>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit}>
              <div className="modal-body pt-4">
                <div className="mb-3">
                  <label className="ct_label">
                    Component Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ct_input ${
                      formik.touched.name && formik.errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Enter component name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-danger ct_fs_13 mt-1">
                      {formik.errors.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-0 pt-3 ct_flex_col_575">
                <button
                  type="button"
                  className="btn ct_btn_gray ct_btn_h_50 ct_w_100_575"
                  data-bs-dismiss="modal"
                  disabled={isCreateComponentLoading}
                  onClick={() => formik.resetForm()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn ct_green_btn ct_btn_h_50 ct_w_100_575"
                  disabled={isCreateComponentLoading}
                >
                  {isCreateComponentLoading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div
                        className="spinner-border spinner-border-sm text-white"
                        role="status"
                      ></div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    "Add Component"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Component Modal */}
      <div
        className="modal fade"
        id="edit_component_modal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "590px" }}
        >
          <div className="modal-content ct_modal">
            {/* Header */}
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="ct_fs_20 ct_fw_600 ct_head_clr mb-1">
                  Edit Component
                </h5>
                <p className="ct_fs_14 ct_para_clr mb-0">
                  Update the component name in the library.
                </p>
              </div>
              <button
                type="button"
                ref={editModalCloseRef}
                className="btn-close shadow-none"
                data-bs-dismiss="modal"
                onClick={() => {
                  setSelectedComponent(null);
                  setEditName("");
                }}
              ></button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body pt-4">
                <div className="mb-3">
                  <label className="ct_label">
                    Component Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control ct_input"
                    placeholder="Enter component name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-0 pt-3 ct_flex_col_575">
                <button
                  type="button"
                  className="btn ct_btn_gray ct_btn_h_50 ct_w_100_575"
                  data-bs-dismiss="modal"
                  disabled={isEditComponentLoading}
                  onClick={() => {
                    setSelectedComponent(null);
                    setEditName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn ct_green_btn ct_btn_h_50 ct_w_100_575"
                  disabled={isEditComponentLoading || !editName.trim()}
                >
                  {isEditComponentLoading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div
                        className="spinner-border spinner-border-sm text-white"
                        role="status"
                      ></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Component Modal */}
      <div
        className="modal fade"
        id="deleteComponentModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content ct_modal">
            <div className="modal-body p-4 position-relative">
              {/* Close Button */}
              <button
                type="button"
                ref={deleteModalCloseRef}
                className="btn-close ct_delete_close"
                data-bs-dismiss="modal"
                onClick={() => setSelectedComponent(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              {/* Title */}
              <h3 className="ct_head_clr ct_fw_600 mb-2">Delete Component?</h3>
              <p className="ct_para_clr ct_fs_18 mb-5">
                Are you sure you want to delete{" "}
                <span className="ct_fw_600 ct_black_text">
                  "{selectedComponent?.name || "this component"}"
                </span>
                ?<br />
                This action cannot be undone.
              </p>
              {/* Buttons */}
              <div className="d-flex gap-3">
                <button
                  type="button"
                  className="btn ct_btn_gray ct_btn_h_50 w-100"
                  data-bs-dismiss="modal"
                  disabled={isDeleteComponentLoading}
                  onClick={() => setSelectedComponent(null)}
                >
                  No, Cancel
                </button>
                <button
                  type="button"
                  className="btn ct_green_btn ct_btn_h_50 w-100"
                  onClick={handleDeleteSubmit}
                  disabled={isDeleteComponentLoading}
                >
                  {isDeleteComponentLoading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div
                        className="spinner-border spinner-border-sm text-white"
                        role="status"
                      ></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComponentsLibrary;