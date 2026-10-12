import technicianReducer, {
  setTechniciansList,
  setTechnicianDetails,
  resetTechnicianDetails,
  resetTechnicianState,
} from "../reducers/technicianReducer";
import {
  getTechniciansList,
  getTechnicianDetails,
} from "../actions/technicianAction";

export {
  getTechniciansList,
  setTechniciansList,
  getTechnicianDetails,
  setTechnicianDetails,
  resetTechnicianDetails,
  resetTechnicianState,
};
export default technicianReducer;
