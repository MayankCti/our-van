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
} from "../actions/partAction";

export {
  getParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  clearPartDetails,
  setPartsList,
};

export default partReducer;
