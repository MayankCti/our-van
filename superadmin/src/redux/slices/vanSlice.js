import vanReducer, {
  setVansList,
  setVanDetails,
  resetVanDetails,
  resetVanState,
} from "../reducers/vanReducer";
import { getVansList, getVanDetails } from "../actions/vanAction";

export {
  getVansList,
  getVanDetails,
  setVansList,
  setVanDetails,
  resetVanDetails,
  resetVanState,
};
export default vanReducer;
