import vanReducer, {
  setVanId,
  setOwnerId,
  setVanStep1Data,
  setVanStep2Data,
  setVanProgressData,
  resetVanState,
} from "../reducers/vanReducer";
import { createVanStep1, createVanStep2, getVanProgress } from "../actions/vanAction";

export {
  createVanStep1,
  createVanStep2,
  getVanProgress,
  setVanId,
  setOwnerId,
  setVanStep1Data,
  setVanStep2Data,
  setVanProgressData,
  resetVanState,
};
export default vanReducer;
