import serviceReducer, {
  clearServiceDetails,
  setServicesList,
} from "../reducers/serviceReducer";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../actions/serviceAction";

export {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  clearServiceDetails,
  setServicesList,
};

export default serviceReducer;
