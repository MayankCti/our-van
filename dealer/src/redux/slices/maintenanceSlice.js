import maintenanceReducer, {
  clearMaintenanceDetails,
  setMaintenanceList,
} from "../reducers/maintenanceReducer";
import {
  getMaintenanceList,
  getMaintenanceById,
  createMaintenance,
} from "../actions/maintenanceAction";

export {
  getMaintenanceList,
  getMaintenanceById,
  createMaintenance,
  clearMaintenanceDetails,
  setMaintenanceList,
};

export default maintenanceReducer;
