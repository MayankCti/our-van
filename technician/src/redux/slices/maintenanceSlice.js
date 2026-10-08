import maintenanceReducer, {
  clearMaintenanceDetails,
  resetMaintenanceState,
} from "../reducers/maintenanceReducer";
import {
  getTechnicianAssignedTasks,
  getTechnicianMaintenanceDetail,
  updateTechnicianMaintenanceTimer,
  updateTechnicianCdsSheet,
  getTechnicianPartsList,
  createTechnicianPartRequest,
  completeTechnicianMaintenanceTask,
} from "../actions/maintenanceAction";

export {
  getTechnicianAssignedTasks,
  getTechnicianMaintenanceDetail,
  updateTechnicianMaintenanceTimer,
  updateTechnicianCdsSheet,
  getTechnicianPartsList,
  createTechnicianPartRequest,
  completeTechnicianMaintenanceTask,
  clearMaintenanceDetails,
  resetMaintenanceState,
};

export default maintenanceReducer;
