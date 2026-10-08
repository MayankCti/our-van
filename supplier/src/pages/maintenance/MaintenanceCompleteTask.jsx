import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import { pageRoutes } from '../../routes/PageRoutes';
import {
  getSupplierMaintenanceDetail,
  completeSupplierMaintenanceTask,
} from '../../redux/slices/maintenanceSlice';

const MaintenanceCompleteTask = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const taskId = searchParams.get('id') || searchParams.get('maintenance_id');

  const {
    taskDetails,
    isDetailsLoading = false,
    detailsError = null,
  } = useSelector((state) => state.maintenanceReducer || {});

  const task = taskDetails?.data || taskDetails || {};

  // Form states
  const [taskInfo, setTaskInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [futureWatchList, setFutureWatchList] = useState('');
  const [recommendedDueDate, setRecommendedDueDate] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper date formatter (DD-MM-YYYY)
  const formatToDisplayDate = (d) => {
    if (!d) return '';
    try {
      const dateObj = new Date(d);
      if (isNaN(dateObj.getTime())) return d;
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return d;
    }
  };

  // Convert YYYY-MM-DD input value to DD-MM-YYYY if needed for API
  const formatDueDateForApi = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        // YYYY-MM-DD -> DD-MM-YYYY
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return dateStr;
  };

  // Get today's date in YYYY-MM-DD local time (disable past dates, allow today onwards)
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch Task Details on Mount
  useEffect(() => {
    if (taskId) {
      dispatch(getSupplierMaintenanceDetail({ id: taskId }));
    }
  }, [dispatch, taskId]);

  // Image Upload Handlers
  const handleFiles = (incomingFiles) => {
    const fileList = Array.from(incomingFiles);
    if (fileList.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    const validFiles = [];
    const validPreviews = [];

    const availableSlots = 5 - selectedImages.length;
    if (availableSlots <= 0) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const filesToProcess = fileList.slice(0, availableSlots);
    if (fileList.length > availableSlots) {
      toast.error(`Only ${availableSlots} more image(s) can be added (Max: 5)`);
    }

    filesToProcess.forEach((file) => {
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        toast.error(`"${file.name}" is not an allowed image format (JPG, PNG, GIF)`);
        return;
      }
      if (file.size > maxFileSize) {
        toast.error(`"${file.name}" exceeds maximum allowed file size of 10MB`);
        return;
      }

      validFiles.push(file);
      validPreviews.push({
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        url: URL.createObjectURL(file),
      });
    });

    if (validFiles.length > 0) {
      setSelectedImages((prev) => [...prev, ...validFiles]);
      setImagePreviews((prev) => [...prev, ...validPreviews]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      return updated;
    });
  };

  // Submit Handler (POST multipart/form-data to /api/supplier/maintenance/:id/complete-task)
  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!taskInfo.trim()) {
      toast.error('Please enter the Task Info');
      return;
    }
    if (!notes.trim()) {
      toast.error('Please enter the Notes');
      return;
    }
    if (!futureWatchList.trim()) {
      toast.error('Please enter the Future Watch List');
      return;
    }
    if (!recommendedDueDate.trim()) {
      toast.error('Recommended Due Date is required');
      return;
    }
    if (recommendedDueDate.trim() < getMinDate()) {
      toast.error('Recommended Due Date cannot be a past date');
      return;
    }
    if (selectedImages.length === 0) {
      toast.error('Please upload at least one image before completing the task');
      return;
    }

    const formData = new FormData();
    formData.append('task_info', taskInfo.trim());
    formData.append('notes', notes.trim());
    formData.append('future_watch_list', futureWatchList.trim());
    formData.append('recommended_due_date', formatDueDateForApi(recommendedDueDate.trim()));

    selectedImages.forEach((img) => {
      formData.append('images', img);
    });

    setIsSubmitting(true);
    dispatch(
      completeSupplierMaintenanceTask({
        id: taskId,
        data: formData,
        callback: (res) => {
          setIsSubmitting(false);
          if (res?.success || res?.status || res?.statusCode === 200 || res?.statusCode === 201) {
            navigate(pageRoutes.maintenance);
          }
        },
      })
    ).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <Layout>
      <SubHeader
        title="Maintenance Task"
        subtitle="Submit final task completion details, notes, future recommendations, and photos."
        backUrl={pageRoutes.maintenance}
        showBack={true}
        className="ct_flex_col_767"
      />

      <div className="ct_px_30 mt-4 pb-5">
        {isDetailsLoading && !task?.id && !task?.maintenance_id ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="spinner-border text-success mb-3 mx-auto" role="status"></div>
            <p className="text-muted ct_fs_15 mb-0">Loading maintenance details...</p>
          </div>
        ) : !taskId || (!task?.maintenance_id && !task?.id && !isDetailsLoading) ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex justify-content-center mb-3">
              <i className="fa-solid fa-triangle-exclamation text-warning fs-1"></i>
            </div>
            <h5 className="ct_head_clr ct_fs_18 ct_fw_600">Task Not Found</h5>
            <p className="ct_para_clr ct_fs_14 mb-4">
              {detailsError || 'The requested maintenance task could not be found.'}
            </p>
            <div className="d-flex justify-content-center">
              <Link to={pageRoutes.maintenance} className="ct_green_btn px-4 py-2">
                Back to Maintenance List
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
              {/* Top Reference Card */}
              <div
                className="p-4 rounded-4 mb-4 border"
                style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
              >
                <div className="row g-3">
                  <div className="col-md-6 col-sm-6">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      Start Date :
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {formatToDisplayDate(task.schedule_date || task.created_at) || 'N/A'}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      End Date :
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {formatToDisplayDate(task.due_date || task.schedule_date || task.created_at) || 'N/A'}
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    <div className="text-muted ct_fs_12 ct_fw_600 text-uppercase mb-1">
                      Task Description:
                    </div>
                    <div className="ct_head_clr ct_fs_15 ct_fw_600">
                      {task.title || task.description || 'Maintenance Task'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input Fields Grid */}
              <div className="row g-4 mb-4">
                {/* Task Info */}
                <div className="col-md-6">
                  <label className="ct_fs_14 ct_fw_600 mb-2 ct_head_clr">
                    Task Info <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter task completion summary (e.g. AC service and gas refill complete.)"
                    value={taskInfo}
                    onChange={(e) => setTaskInfo(e.target.value)}
                    style={{ borderRadius: '8px', height: '44px', fontSize: '14px' }}
                    required
                  />
                </div>

                {/* Notes */}
                <div className="col-md-6">
                  <label className="ct_fs_14 ct_fw_600 mb-2 ct_head_clr">
                    Notes <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter observation notes (e.g. Vent temperature verified at 4°C.)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ borderRadius: '8px', height: '44px', fontSize: '14px' }}
                    required
                  />
                </div>

                {/* Future Watch List */}
                <div className="col-md-6">
                  <label className="ct_fs_14 ct_fw_600 mb-2 ct_head_clr">
                    Future Watch List <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter future maintenance recommendations (e.g. Compressor belt inspection in 6 months.)"
                    value={futureWatchList}
                    onChange={(e) => setFutureWatchList(e.target.value)}
                    style={{ borderRadius: '8px', height: '44px', fontSize: '14px' }}
                    required
                  />
                </div>

                {/* Recommended Due Date */}
                <div className="col-md-6">
                  <label className="ct_fs_14 ct_fw_600 mb-2 ct_head_clr">
                    Recommended Due date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={recommendedDueDate}
                    min={getMinDate()}
                    onChange={(e) => setRecommendedDueDate(e.target.value)}
                    style={{ borderRadius: '8px', height: '44px', fontSize: '14px' }}
                    required
                  />
                </div>

                {/* Image Upload Dropzone */}
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="ct_fs_14 ct_fw_600 ct_head_clr mb-0">
                      Image Upload <span className="text-danger">*</span>
                    </label>
                    <span className="text-muted ct_fs_13">
                      ({selectedImages.length}/5 images selected)
                    </span>
                  </div>

                  {/* Dropzone Box */}
                  <div
                    className={`border rounded-4 p-4 text-center ${
                      isDragging ? 'bg-light border-primary' : 'bg-white'
                    }`}
                    style={{
                      borderStyle: 'dashed',
                      borderColor: isDragging ? '#3B82F6' : '#94A3B8',
                      cursor: selectedImages.length >= 5 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (selectedImages.length < 5 && fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center flex-column py-2">
                      <div className="mb-2">
                        <svg
                          width="36"
                          height="28"
                          viewBox="0 0 33 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z"
                            fill="#0D6EFD"
                          />
                        </svg>
                      </div>

                      <div className="ct_fs_15 ct_head_clr mb-1">
                        <span className="text-primary fw-semibold">Upload</span> and drag images
                      </div>
                      <div className="text-muted ct_fs_12 text-uppercase">JPG, PNG, GIF</div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                      multiple
                      hidden
                      onChange={handleFileInputChange}
                      disabled={selectedImages.length >= 5}
                    />
                  </div>

                  <div className="text-muted ct_fs_12 mt-2">Max upload file 10 MB (Max 5 images)</div>

                  {/* Thumbnail Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="upload-imgs ct_custom_scroll d-flex flex-wrap gap-2 mt-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="img-item position-relative">
                          <img
                            src={preview.url}
                            alt={preview.name}
                            style={{ cursor: 'pointer' }}
                            onClick={() => preview.url && window.open(preview.url, '_blank')}
                            title="Click to view full image in new tab"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="img-remove"
                            title="Remove image"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="d-flex align-items-center justify-content-end gap-3 pt-3 border-top flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate(pageRoutes.maintenance)}
                  className="btn btn-outline-secondary px-4 py-2 fw-semibold"
                  style={{ borderRadius: '8px' }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-dark px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                  style={{
                    borderRadius: '8px',
                    backgroundColor: '#0F172A',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Save Completed Task</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default MaintenanceCompleteTask;
