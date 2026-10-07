import partReducer, {
  clearPartDetails,
  setPartsList,
} from "../reducers/partReducer";
import {
  getParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  getDealerPartRequests,
  completeDealerPartRequest,
} from "../actions/partAction";

export {
  getParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  getDealerPartRequests,
  completeDealerPartRequest,
  clearPartDetails,
  setPartsList,
};

export default partReducer;

