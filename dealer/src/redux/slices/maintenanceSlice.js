import maintenanceReducer, {
  clearMaintenanceDetails,
  clearInvoiceDetails,
  setMaintenanceList,
} from "../reducers/maintenanceReducer";
import {
  getMaintenanceList,
  getMaintenanceById,
  createMaintenance,
  reassignMaintenanceTask,
  generateMaintenanceInvoice,
  getMaintenanceInvoice,
} from "../actions/maintenanceAction";

export {
  getMaintenanceList,
  getMaintenanceById,
  createMaintenance,
  reassignMaintenanceTask,
  generateMaintenanceInvoice,
  getMaintenanceInvoice,
  clearMaintenanceDetails,
  clearInvoiceDetails,
  setMaintenanceList,
};

export default maintenanceReducer;
