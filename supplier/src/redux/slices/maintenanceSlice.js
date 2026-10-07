import maintenanceReducer, {
  clearMaintenanceDetails,
} from "../reducers/maintenanceReducer";
import {
  getSupplierAssignedTasks,
  getSupplierMaintenanceDetail,
  respondToSupplierMaintenanceTask,
  updateSupplierMaintenanceTimer,
  updateSupplierCdsSheet,
  getSupplierPartsList,
  createSupplierPartRequest,
  completeSupplierMaintenanceTask,
} from "../actions/maintenanceAction";

export {
  getSupplierAssignedTasks,
  getSupplierMaintenanceDetail,
  respondToSupplierMaintenanceTask,
  updateSupplierMaintenanceTimer,
  updateSupplierCdsSheet,
  getSupplierPartsList,
  createSupplierPartRequest,
  completeSupplierMaintenanceTask,
  clearMaintenanceDetails,
};

export default maintenanceReducer;
