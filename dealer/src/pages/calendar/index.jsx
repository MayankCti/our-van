import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../layout/Layout';
import SubHeader from '../../components/SubHeader';
import { pageRoutes } from '../../routes/PageRoutes';
import { getDealerCalendar } from '../../redux/slices/maintenanceSlice';

const CalendarPage = () => {
  const dispatch = useDispatch();

  const {
    calendarData,
    isCalendarLoading = false,
    calendarError = null,
  } = useSelector((state) => state.maintenanceReducer || {});

  // Date state: month (1-12), year (e.g. 2026)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 1)); // Oct 2026 initial default
  // View mode: 'month', 'week', 'day', 'agenda'
  const [viewMode, setViewMode] = useState('month');
  // Toggle: 'van' (View by Van) vs 'technician' (View by Technician)
  const [viewBy, setViewBy] = useState('van');
  // Selected entity filter: 'all' or specific entity ID / registration
  const [selectedEntityId, setSelectedEntityId] = useState('all');

  // Modal / Selected Task details
  const [selectedTask, setSelectedTask] = useState(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12

  // Fetch Calendar Data whenever month/year changes
  useEffect(() => {
    dispatch(
      getDealerCalendar({
        month: currentMonth,
        year: currentYear,
      })
    );
  }, [dispatch, currentMonth, currentYear]);

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'day') {
        d.setDate(d.getDate() - 1);
      } else if (viewMode === 'week') {
        d.setDate(d.getDate() - 7);
      } else {
        d.setMonth(d.getMonth() - 1);
      }
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'day') {
        d.setDate(d.getDate() + 1);
      } else if (viewMode === 'week') {
        d.setDate(d.getDate() + 7);
      } else {
        d.setMonth(d.getMonth() + 1);
      }
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 9));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const headerTitle = useMemo(() => {
    if (viewMode === 'day') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    }
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [currentDate, viewMode]);

  // Extract date_wise_data or calendar_days from API response
  const rawDateWise = calendarData?.date_wise_data || {};
  const allTasks = Array.isArray(calendarData?.tasks) ? calendarData.tasks : [];
  const allTechs = Array.isArray(calendarData?.all_assigned_technicians)
    ? calendarData.all_assigned_technicians
    : [];

  // Extract distinct list of Vans from tasks
  const vanList = useMemo(() => {
    const map = new Map();
    allTasks.forEach((t) => {
      const reg = t.registration_number || t.van?.registration_number || `Van #${t.van_id || t.id}`;
      const name = t.van_name || t.van?.van_name || t.van?.name || reg;
      const vId = t.van_id || t.van?.id || reg;
      if (!map.has(reg)) {
        map.set(reg, {
          id: vId,
          registration: reg,
          name: name,
          tasksCount: 0,
        });
      }
      map.get(reg).tasksCount += 1;
    });
    return Array.from(map.values());
  }, [allTasks]);

  // Extract distinct list of Technicians from API
  const technicianList = useMemo(() => {
    const list = [...allTechs];
    allTasks.forEach((t) => {
      if (t.assignee_type === 'technician' && t.assignee_id) {
        const exists = list.some((item) => item.id === t.assignee_id);
        if (!exists && t.assignee) {
          list.push({
            id: t.assignee.id,
            name: t.assignee.name || t.assigned_to_name,
            total_tasks: 1,
            job_role: t.assignee.job_role,
          });
        }
      }
    });
    return list;
  }, [allTechs, allTasks]);

  // Reset selected entity filter when switching View By tab
  useEffect(() => {
    setSelectedEntityId('all');
  }, [viewBy]);

  // Helper to check if task matches selected entity
  const taskMatchesEntity = (task) => {
    if (selectedEntityId === 'all') return true;
    if (viewBy === 'van') {
      const reg = task.registration_number || task.van?.registration_number;
      const vId = String(task.van_id || task.van?.id);
      return reg === selectedEntityId || vId === String(selectedEntityId);
    }
    if (viewBy === 'technician') {
      const techId = task.assignee_id || task.assignee?.id;
      return String(techId) === String(selectedEntityId);
    }
    return true;
  };

  // Generate 35-42 days grid for current month
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayIndex = firstDayOfMonth.getDay(); // 0 = Sun
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Prev month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const pDay = prevMonthLastDay - i;
      const pMonth = month === 0 ? 12 : month;
      const pYear = month === 0 ? year - 1 : year;
      const dateStr = `${pYear}-${String(pMonth).padStart(2, '0')}-${String(pDay).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: pDay,
        isCurrentMonth: false,
        tasks: [],
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayData = rawDateWise[dateStr];
      const rawTasks = dayData?.tasks || [];
      const filteredTasks = rawTasks.filter(taskMatchesEntity);

      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        tasks: filteredTasks,
        totalTasks: dayData?.total_tasks || 0,
      });
    }

    // Next month padding days to complete 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
      const nMonth = month + 2 > 12 ? 1 : month + 2;
      const nYear = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${nYear}-${String(nMonth).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: j,
        isCurrentMonth: false,
        tasks: [],
      });
    }

    return days;
  }, [currentDate, rawDateWise, selectedEntityId, viewBy]);

  // Week view: 7 days of the current week (Sun-Sat)
  const weekDays = useMemo(() => {
    const d = new Date(currentDate);
    const dayOfWeek = d.getDay(); // 0 = Sun
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const cur = new Date(startOfWeek);
      cur.setDate(startOfWeek.getDate() + i);
      const y = cur.getFullYear();
      const m = cur.getMonth() + 1;
      const dateNum = cur.getDate();
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
      const dayData = rawDateWise[dateStr];
      const rawTasks = dayData?.tasks || [];
      const filteredTasks = rawTasks.filter(taskMatchesEntity);

      days.push({
        dateStr,
        dayNum: dateNum,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        isCurrentMonth: cur.getMonth() === currentDate.getMonth(),
        isToday:
          cur.getDate() === currentDate.getDate() &&
          cur.getMonth() === currentDate.getMonth() &&
          cur.getFullYear() === currentDate.getFullYear(),
        tasks: filteredTasks,
      });
    }
    return days;
  }, [currentDate, rawDateWise, selectedEntityId, viewBy]);

  // Day view schedule
  const daySchedule = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth() + 1;
    const dateNum = currentDate.getDate();
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
    const dayInfo = rawDateWise[dateStr];
    const rawTasks = dayInfo?.tasks || [];
    const filteredTasks = rawTasks.filter(taskMatchesEntity);
    return {
      dateStr,
      dayNum: dateNum,
      tasks: filteredTasks,
    };
  }, [currentDate, rawDateWise, selectedEntityId, viewBy]);

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return '#3D8B37'; // Brand Green
      case 'in_progress':
      case 'in progress':
        return '#2563EB'; // Blue
      case 'pending':
        return '#F59E0B'; // Amber
      case 'overdue':
        return '#DC2626'; // Red
      case 'invoiced':
        return '#7C3AED'; // Purple
      case 'rejected':
      case 'cancelled':
        return '#EF4444'; // Red
      default:
        return '#3D8B37';
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === '') return '$0.00';
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Layout>
      <SubHeader
        title="Calendar"
        subtitle="Manage and view maintenance schedules by Van and Technician."
        backUrl={pageRoutes.maintenance}
      />

      <div className="ct_px_30 mt-4 pb-4">
        {/* Main 2-Column Layout: Left (List + Toggle) & Right (Calendar Controls + Matrix) */}
        <div className="row g-4">
          {/* LEFT PANEL: View by Toggle + Entity List (All Vans / All Technicians) */}
          <div
            className="col-12 col-lg-auto flex-lg-grow-0"
            style={{ width: '340px', maxWidth: '100%' }}
          >
            <div
              className="bg-white p-3 rounded-4 border shadow-sm d-flex flex-column h-100"
              style={{
                borderRadius: '20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0px 0px 21px 0px #E5E7EB70',
                overflow: 'hidden',
              }}
            >
              {/* Toggle Buttons: View by Van vs View by Technician */}
              <div
                className="p-1 mb-3 rounded-3 d-flex gap-1 border"
                style={{ backgroundColor: '#F8FAFC' }}
              >
                <button
                  type="button"
                  className="btn flex-fill py-2 px-1 ct_fs_12 ct_fw_600 border-0 text-nowrap d-flex align-items-center justify-content-center"
                  style={{
                    borderRadius: '6px',
                    backgroundColor: viewBy === 'van' ? '#3D8B37' : 'transparent',
                    color: viewBy === 'van' ? '#FFFFFF' : '#475569',
                    boxShadow: viewBy === 'van' ? '0 2px 6px rgba(61,139,55,0.25)' : 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setViewBy('van')}
                >
                  <i className="fa-solid fa-van-shuttle me-1"></i> View by Van
                </button>

                <button
                  type="button"
                  className="btn flex-fill py-2 px-1 ct_fs_12 ct_fw_600 border-0 text-nowrap d-flex align-items-center justify-content-center"
                  style={{
                    borderRadius: '6px',
                    backgroundColor: viewBy === 'technician' ? '#3D8B37' : 'transparent',
                    color: viewBy === 'technician' ? '#FFFFFF' : '#475569',
                    boxShadow: viewBy === 'technician' ? '0 2px 6px rgba(61,139,55,0.25)' : 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setViewBy('technician')}
                >
                  <i className="fa-solid fa-user-gear me-1"></i> View by Technician
                </button>
              </div>

              {/* Header Title with Reset button */}
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <h5 className="ct_fs_16 ct_fw_700 ct_head_clr mb-0 text-nowrap">
                  {viewBy === 'van' ? 'All Vans' : 'All Technicians'}
                </h5>
                <button
                  type="button"
                  className="btn btn-link text-decoration-none ct_fs_12 ct_fw_600 p-0 text-nowrap"
                  style={{ color: '#3D8B37' }}
                  onClick={() => setSelectedEntityId('all')}
                >
                  Show All
                </button>
              </div>

              {/* Scrollable Entity List */}
              <div className="flex-grow-1 overflow-auto pe-1" style={{ maxHeight: '580px' }}>
                {/* Show All Tasks Option */}
                <div
                  className="p-2 px-3 rounded-3 mb-2 d-flex align-items-center justify-content-between ct_fs_13 cursor-pointer"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedEntityId === 'all' ? '#F5FCF5' : '#FAFAFA',
                    border: selectedEntityId === 'all' ? '1px solid #3D8B37' : '1px solid #E5E7EB',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setSelectedEntityId('all')}
                >
                  <div
                    className="d-flex align-items-center gap-2 overflow-hidden me-2"
                    style={{ minWidth: 0 }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#3D8B37',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="ct_fw_600 ct_head_clr text-nowrap flex-shrink-0"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Show All Tasks
                    </span>
                  </div>
                  {selectedEntityId === 'all' ? (
                    <span
                      className="ct_fs_11 px-2 py-0.5 rounded-2 ct_fw_600 flex-shrink-0"
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Viewing
                    </span>
                  ) : (
                    <span
                      className="ct_fs_12 ct_fw_600 text-muted flex-shrink-0"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      View
                    </span>
                  )}
                </div>

                {/* Entity Items */}
                {viewBy === 'van' ? (
                  vanList.length === 0 ? (
                    <p className="text-muted ct_fs_13 text-center py-4">No vans found</p>
                  ) : (
                    vanList.map((van) => {
                      const isSelected = selectedEntityId === van.registration;
                      return (
                        <div
                          key={van.registration}
                          className="p-2 px-3 rounded-3 mb-2 d-flex align-items-center justify-content-between ct_fs_13"
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#F5FCF5' : '#FAFAFA',
                            border: isSelected ? '1px solid #3D8B37' : '1px solid #E5E7EB',
                            boxShadow: isSelected ? '0 2px 8px rgba(61,139,55,0.12)' : 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() => setSelectedEntityId(van.registration)}
                        >
                          <div
                            className="d-flex align-items-center gap-2 overflow-hidden text-truncate me-2"
                            style={{ minWidth: 0 }}
                          >
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: isSelected ? '#3D8B37' : '#94A3B8',
                                flexShrink: 0,
                              }}
                            />
                            <div className="text-truncate" style={{ minWidth: 0 }}>
                              <span
                                className="d-block ct_fw_600 text-truncate ct_head_clr"
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                {van.registration}
                              </span>
                              <small
                                className="text-muted ct_fs_11 text-truncate d-block"
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                {van.name}
                              </small>
                            </div>
                          </div>

                          {isSelected ? (
                            <span
                              className="ct_fs_11 px-2 py-0.5 rounded-2 ct_fw_600 flex-shrink-0 ms-2"
                              style={{
                                backgroundColor: '#DCFCE7',
                                color: '#166534',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Viewing
                            </span>
                          ) : (
                            <span
                              className="ct_fs_12 ct_fw_600 text-muted flex-shrink-0 ms-2"
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              View
                            </span>
                          )}
                        </div>
                      );
                    })
                  )
                ) : technicianList.length === 0 ? (
                  <p className="text-muted ct_fs_13 text-center py-4">No technicians found</p>
                ) : (
                  technicianList.map((tech) => {
                    const isSelected = String(selectedEntityId) === String(tech.id);
                    return (
                      <div
                        key={tech.id}
                        className="p-2 px-3 rounded-3 mb-2 d-flex align-items-center justify-content-between ct_fs_13"
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#F5FCF5' : '#FAFAFA',
                          border: isSelected ? '1px solid #3D8B37' : '1px solid #E5E7EB',
                          boxShadow: isSelected ? '0 2px 8px rgba(61,139,55,0.12)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => setSelectedEntityId(String(tech.id))}
                      >
                        <div
                          className="d-flex align-items-center gap-2 overflow-hidden text-truncate me-2"
                          style={{ minWidth: 0 }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: isSelected ? '#3D8B37' : '#94A3B8',
                              flexShrink: 0,
                            }}
                          />
                          <div className="text-truncate" style={{ minWidth: 0 }}>
                            <span
                              className="d-block ct_fw_600 text-truncate ct_head_clr"
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              {tech.name || tech.full_name}
                            </span>
                            <small
                              className="text-muted ct_fs_11 text-truncate d-block"
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              {tech.job_role || 'Technician'}
                            </small>
                          </div>
                        </div>

                        {isSelected ? (
                          <span
                            className="ct_fs_11 px-2 py-0.5 rounded-2 ct_fw_600 flex-shrink-0 ms-2"
                            style={{
                              backgroundColor: '#DCFCE7',
                              color: '#166534',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Viewing
                          </span>
                        ) : (
                          <span
                            className="ct_fs_12 ct_fw_600 text-muted flex-shrink-0 ms-2"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            View
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Calendar Controls + Calendar Matrix */}
          <div className="col-12 col-lg flex-lg-grow-1" style={{ minWidth: 0 }}>
            <div
              className="bg-white rounded-4 border shadow-sm p-3 overflow-hidden"
              style={{
                borderRadius: '20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0px 0px 21px 0px #E5E7EB70',
              }}
            >
              {/* Calendar Controls Bar */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom">
                {/* Navigation: Today, Back, Next & Current Month Header */}
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm px-3 py-2 ct_fs_13 ct_fw_600"
                      onClick={handleToday}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm px-3 py-2 ct_fs_13"
                      onClick={handlePrev}
                      title="Previous Month"
                    >
                      <i className="fa-solid fa-chevron-left me-1"></i> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm px-3 py-2 ct_fs_13"
                      onClick={handleNext}
                      title="Next Month"
                    >
                      Next <i className="fa-solid fa-chevron-right ms-1"></i>
                    </button>
                  </div>

                  <h5 className="ct_fs_18 ct_fw_700 ct_head_clr mb-0 ms-2">
                    {headerTitle}
                  </h5>
                </div>

                {/* View Mode Tabs: Month, Week, Day, Agenda */}
                <div className="btn-group" role="group" aria-label="Calendar view modes">
                  {['month', 'week', 'day', 'agenda'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className="btn btn-sm ct_fs_13 ct_fw_600 text-capitalize px-3 py-2"
                      style={{
                        backgroundColor: viewMode === mode ? '#3D8B37' : '#FFFFFF',
                        borderColor: viewMode === mode ? '#3D8B37' : '#E5E7EB',
                        color: viewMode === mode ? '#FFFFFF' : '#64748B',
                        transition: 'all 0.15s ease',
                      }}
                      onClick={() => setViewMode(mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              {isCalendarLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success mb-2" role="status"></div>
                  <p className="text-muted ct_fs_14 mb-0">Loading calendar schedules...</p>
                </div>
              ) : calendarError ? (
                <div className="text-center py-5 text-danger">
                  <i className="fa-solid fa-circle-exclamation fs-3 mb-2"></i>
                  <p className="ct_fs_14">{calendarError}</p>
                </div>
              ) : viewMode === 'agenda' ? (
                /* Agenda View */
                <div className="p-2">
                  <div className="table-responsive ct_custom_table">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Task Title</th>
                          <th>Van</th>
                          <th>Assigned To</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTasks.filter(taskMatchesEntity).length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                              No tasks scheduled for this period.
                            </td>
                          </tr>
                        ) : (
                          allTasks.filter(taskMatchesEntity).map((task) => (
                            <tr key={task.id || task.maintenance_id}>
                              <td>{task.schedule_date}</td>
                              <td className="ct_fw_600">{task.title}</td>
                              <td>{task.van_name || task.registration_number}</td>
                              <td>{task.assigned_to_name || 'N/A'}</td>
                              <td>
                                <span
                                  className="badge px-2 py-1 text-capitalize"
                                  style={{
                                    backgroundColor: `${getStatusColor(task.status)}15`,
                                    color: getStatusColor(task.status),
                                    border: `1px solid ${getStatusColor(task.status)}40`,
                                  }}
                                >
                                  {task.status}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`${pageRoutes.maintenance_detail}?id=${task.id || task.maintenance_id}`}
                                  className="ct_action_icon_btn ct_view_btn"
                                  title="View Details"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : viewMode === 'day' ? (
                /* Day View */
                <div className="p-2">
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                    <h6 className="ct_fs_16 ct_fw_700 ct_head_clr mb-0">
                      Schedule for {headerTitle}
                    </h6>
                    <span
                      className="badge px-3 py-1 ct_fs_12"
                      style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                    >
                      {daySchedule.tasks.length} {daySchedule.tasks.length === 1 ? 'Task' : 'Tasks'}
                    </span>
                  </div>

                  {daySchedule.tasks.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fa-regular fa-calendar-xmark fs-2 text-muted mb-2"></i>
                      <p className="text-muted ct_fs_14 mb-0">No maintenance tasks scheduled for this day.</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {daySchedule.tasks.map((task) => (
                        <div
                          key={task.id || task.maintenance_id}
                          className="p-3 rounded-3 border d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm bg-light"
                          style={{ borderLeft: `4px solid ${getStatusColor(task.status)}` }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="px-3 py-2 rounded-3 text-center bg-white border"
                              style={{ minWidth: '90px' }}
                            >
                              <span className="d-block ct_fs_11 ct_fw_700 text-muted">Scheduled</span>
                              <span className="ct_fs_13 ct_fw_600 ct_head_clr">
                                {task.schedule_time || '10:00 AM'}
                              </span>
                            </div>
                            <div>
                              <h6 className="ct_fs_15 ct_fw_700 ct_head_clr mb-1">{task.title}</h6>
                              <div className="d-flex flex-wrap gap-3 ct_fs_12 text-muted">
                                <span>
                                  <i className="fa-solid fa-van-shuttle me-1 text-success"></i>
                                  {task.van_name || task.registration_number}
                                </span>
                                <span>
                                  <i className="fa-solid fa-user me-1 text-primary"></i>
                                  {task.assigned_to_name || 'Technician'}
                                </span>
                                {task.job_location && (
                                  <span>
                                    <i className="fa-solid fa-location-dot me-1 text-danger"></i>
                                    {task.job_location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="badge px-3 py-2 text-capitalize ct_fs_12 ct_fw_600"
                              style={{
                                backgroundColor: `${getStatusColor(task.status)}15`,
                                color: getStatusColor(task.status),
                                border: `1px solid ${getStatusColor(task.status)}40`,
                              }}
                            >
                              {task.status}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success px-3 ct_fs_12 ct_fw_600"
                              onClick={() => setSelectedTask(task)}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : viewMode === 'week' ? (
                /* Week View */
                <div className="table-responsive">
                  <table
                    className="table table-bordered mb-0"
                    style={{ tableLayout: 'fixed', minWidth: '700px' }}
                  >
                    <thead>
                      <tr className="text-center" style={{ backgroundColor: '#F8FAFC' }}>
                        {weekDays.map((w) => (
                          <th
                            key={w.dateStr}
                            className="py-2 ct_fs_13 ct_fw_700"
                            style={{
                              width: '14.28%',
                              backgroundColor: w.isToday ? '#F0FDF4' : '#F8FAFC',
                              color: w.isToday ? '#166534' : '#475569',
                            }}
                          >
                            <div>{w.dayName}</div>
                            <div className="ct_fs_15 ct_fw_800">{w.dayNum}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {weekDays.map((w) => (
                          <td
                            key={w.dateStr}
                            className="p-2 align-top position-relative"
                            style={{
                              minHeight: '260px',
                              height: '280px',
                              backgroundColor: w.isToday ? '#FCFDFB' : '#FFFFFF',
                            }}
                          >
                            <div
                              className="d-flex flex-column gap-2 overflow-auto"
                              style={{ maxHeight: '260px' }}
                            >
                              {w.tasks.length === 0 ? (
                                <span className="text-muted ct_fs_11 fst-italic text-center d-block py-3">
                                  No tasks
                                </span>
                              ) : (
                                w.tasks.map((task) => (
                                  <div
                                    key={task.id || task.maintenance_id}
                                    className="p-2 rounded text-truncate ct_fs_11 ct_fw_600 shadow-sm cursor-pointer"
                                    style={{
                                      backgroundColor: '#20639B',
                                      color: '#FFFFFF',
                                      cursor: 'pointer',
                                      borderRadius: '6px',
                                    }}
                                    onClick={() => setSelectedTask(task)}
                                    title={`${task.title} - ${task.van_name || task.registration_number}`}
                                  >
                                    <div className="text-truncate">{task.title}</div>
                                    <small className="opacity-75 d-block text-truncate">
                                      {task.schedule_time || '10:00 AM'}
                                    </small>
                                  </div>
                                ))
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Month View Matrix */
                <div className="table-responsive">
                  <table
                    className="table table-bordered mb-0"
                    style={{
                      tableLayout: 'fixed',
                      borderColor: '#E5E7EB',
                      minWidth: '700px',
                    }}
                  >
                    <thead>
                      <tr className="text-center" style={{ backgroundColor: '#F8FAFC' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                          <th
                            key={d}
                            className="py-2 ct_fs_14 ct_fw_700 text-muted"
                            style={{ width: '14.28%' }}
                          >
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: Math.ceil(calendarGrid.length / 7) }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          {calendarGrid.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell, colIndex) => {
                            const maxVisible = 2;
                            const visibleTasks = cell.tasks ? cell.tasks.slice(0, maxVisible) : [];
                            const remainingCount =
                              cell.tasks && cell.tasks.length > maxVisible
                                ? cell.tasks.length - maxVisible
                                : 0;

                            return (
                              <td
                                key={colIndex}
                                className="p-1 position-relative align-top"
                                style={{
                                  height: '110px',
                                  backgroundColor: !cell.isCurrentMonth
                                    ? '#F8FAFC'
                                    : '#FFFFFF',
                                  transition: 'background 0.2s',
                                }}
                              >
                                {/* Date Number */}
                                <div className="d-flex justify-content-end mb-1 px-1">
                                  <span
                                    className={`ct_fs_12 ct_fw_600 ${
                                      cell.isCurrentMonth ? 'text-dark' : 'text-muted opacity-50'
                                    }`}
                                  >
                                    {String(cell.dayNum).padStart(2, '0')}
                                  </span>
                                </div>

                                {/* Task Pills inside Cell */}
                                <div className="d-flex flex-column gap-1 overflow-hidden">
                                  {visibleTasks.map((task) => (
                                    <div
                                      key={task.id || task.maintenance_id}
                                      className="text-white px-2 py-1 rounded text-truncate ct_fs_11 ct_fw_600 shadow-sm"
                                      style={{
                                        backgroundColor: '#20639B',
                                        cursor: 'pointer',
                                        lineHeight: 1.2,
                                        borderRadius: '4px',
                                      }}
                                      onClick={() => setSelectedTask(task)}
                                      title={`${task.title} (${task.status}) - ${task.van_name || task.registration_number}`}
                                    >
                                      {task.title}
                                    </div>
                                  ))}

                                  {/* +more indicator */}
                                  {remainingCount > 0 && (
                                    <div
                                      className="ct_fs_11 ct_fw_700 px-1 mt-1 cursor-pointer"
                                      style={{ color: '#0284C7', cursor: 'pointer' }}
                                      onClick={() => setSelectedTask(cell.tasks[0])}
                                    >
                                      +{remainingCount} more
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '520px', width: '92%', margin: '1.75rem auto' }}
          >
            <div className="modal-content ct_modal shadow border-0">
              <div className="modal-header border-bottom pb-3 pt-3 px-4 d-flex align-items-center justify-content-between">
                <h5 className="modal-title ct_fs_18 ct_fw_700 ct_head_clr mb-0">
                  Maintenance Task Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setSelectedTask(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <span
                    className="badge px-3 py-1 text-capitalize ct_fs_12 ct_fw_600"
                    style={{
                      backgroundColor: `${getStatusColor(selectedTask.status)}15`,
                      color: getStatusColor(selectedTask.status),
                      border: `1px solid ${getStatusColor(selectedTask.status)}40`,
                    }}
                  >
                    {selectedTask.status || 'Pending'}
                  </span>
                  <span className="text-muted ct_fs_13">
                    <i className="fa-regular fa-clock me-1"></i>
                    {selectedTask.schedule_date} {selectedTask.schedule_time || ''}
                  </span>
                </div>

                <h4 className="ct_fs_18 ct_fw_700 ct_head_clr mb-2">
                  {selectedTask.title}
                </h4>
                <p className="text-muted ct_fs_13 mb-3">
                  {selectedTask.description || 'No description provided.'}
                </p>

                <div className="bg-light p-3 rounded-3 mb-3 ct_fs_13 border">
                  <div className="row g-3">
                    <div className="col-sm-6 col-12">
                      <span className="text-muted d-block ct_fs_12">Van:</span>
                      <strong className="ct_head_clr">
                        {selectedTask.van_name || selectedTask.van?.van_name || 'N/A'}
                      </strong>
                    </div>
                    <div className="col-sm-6 col-12">
                      <span className="text-muted d-block ct_fs_12">Registration:</span>
                      <strong className="ct_head_clr">
                        {selectedTask.registration_number || selectedTask.van?.registration_number || 'N/A'}
                      </strong>
                    </div>
                    <div className="col-sm-6 col-12">
                      <span className="text-muted d-block ct_fs_12">Assigned To:</span>
                      <strong className="ct_head_clr">
                        {selectedTask.assigned_to_name || selectedTask.assignee?.name || 'Unassigned'}
                      </strong>
                    </div>
                    <div className="col-sm-6 col-12">
                      <span className="text-muted d-block ct_fs_12">Total Cost:</span>
                      <strong className="text-success ct_fw_700">
                        {formatCurrency(selectedTask.total_amount)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-sm-row flex-column-reverse gap-2 justify-content-end mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn ct_btn_gray px-4 py-2 ct_btn_h_45 ct_fs_14 ct_fw_600 d-flex align-items-center justify-content-center"
                    style={{ minWidth: '110px' }}
                    onClick={() => setSelectedTask(null)}
                  >
                    Close
                  </button>
                  <Link
                    to={`${pageRoutes.maintenance_detail}?id=${selectedTask.id || selectedTask.maintenance_id}`}
                    className="ct_green_btn px-4 py-2 ct_btn_h_45 ct_fs_14 ct_fw_600 text-decoration-none d-flex align-items-center justify-content-center gap-2"
                    style={{ minWidth: '170px' }}
                  >
                    <span>View Full Details</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CalendarPage;
