import maintenanceReducer, {
  clearMaintenanceDetails,
  resetMaintenanceState,
} from "../reducers/maintenanceReducer";
import {
  getTechnicianAssignedTasks,
  getTechnicianMaintenanceDetail,
} from "../actions/maintenanceAction";

export {
  getTechnicianAssignedTasks,
  getTechnicianMaintenanceDetail,
  clearMaintenanceDetails,
  resetMaintenanceState,
};

export default maintenanceReducer;
