import technicianReducer, {
  clearTechnicianDetails,
  setTechniciansList,
} from "../reducers/technicianReducer";
import {
  getTechniciansByDealer,
  getTechnicianById,
  toggleBlockTechnician,
  createTechnician,
  deleteTechnician,
  getTechnicianJobRoles,
} from "../actions/technicianAction";

export {
  getTechniciansByDealer,
  getTechnicianById,
  toggleBlockTechnician,
  createTechnician,
  deleteTechnician,
  getTechnicianJobRoles,
  clearTechnicianDetails,
  setTechniciansList,
};

export default technicianReducer;

