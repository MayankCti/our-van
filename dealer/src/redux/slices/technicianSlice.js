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
} from "../actions/technicianAction";

export {
  getTechniciansByDealer,
  getTechnicianById,
  toggleBlockTechnician,
  createTechnician,
  deleteTechnician,
  clearTechnicianDetails,
  setTechniciansList,
};

export default technicianReducer;

