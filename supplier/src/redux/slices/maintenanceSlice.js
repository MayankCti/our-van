import maintenanceReducer, {
  clearMaintenanceDetails,
} from "../reducers/maintenanceReducer";
import {
  getSupplierAssignedTasks,
  getSupplierMaintenanceDetail,
  respondToSupplierMaintenanceTask,
} from "../actions/maintenanceAction";

export {
  getSupplierAssignedTasks,
  getSupplierMaintenanceDetail,
  respondToSupplierMaintenanceTask,
  clearMaintenanceDetails,
};

export default maintenanceReducer;
