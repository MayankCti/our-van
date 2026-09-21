import technicianReducer, {
  clearTechnicianDetails,
  setTechniciansList,
} from "../reducers/technicianReducer";
import {
  getTechniciansByDealer,
  getTechnicianById,
  toggleBlockTechnician,
  deleteTechnician,
} from "../actions/technicianAction";

export {
  getTechniciansByDealer,
  getTechnicianById,
  toggleBlockTechnician,
  deleteTechnician,
  clearTechnicianDetails,
  setTechniciansList,
};

export default technicianReducer;
