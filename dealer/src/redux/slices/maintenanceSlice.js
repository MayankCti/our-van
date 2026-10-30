import maintenanceReducer, {
  clearMaintenanceDetails,
  clearInvoiceDetails,
  clearCalendarData,
  setMaintenanceList,
} from "../reducers/maintenanceReducer";
import {
  getMaintenanceList,
  getMaintenanceById,
  createMaintenance,
  reassignMaintenanceTask,
  generateMaintenanceInvoice,
  getMaintenanceInvoice,
  getDealerCalendar,
} from "../actions/maintenanceAction";

export {
  getMaintenanceList,
  getMaintenanceById,
  createMaintenance,
  reassignMaintenanceTask,
  generateMaintenanceInvoice,
  getMaintenanceInvoice,
  getDealerCalendar,
  clearMaintenanceDetails,
  clearInvoiceDetails,
  clearCalendarData,
  setMaintenanceList,
};

export default maintenanceReducer;
