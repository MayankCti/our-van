import vanReducer, {
  setVanId,
  setOwnerId,
  setVanStep1Data,
  setVanStep2Data,
  setVanStep3Data,
  setVanStep4Data,
  setVanProgressData,
  resetVanState,
} from "../reducers/vanReducer";
import {
  createVanStep1,
  createVanStep2,
  createVanStep3,
  createVanStep4,
  getVanProgress,
  getVansList,
  getDealerOwnersList,
  getDealerDashboard,
  getComponentsList,
} from "../actions/vanAction";

export {
  createVanStep1,
  createVanStep2,
  createVanStep3,
  createVanStep4,
  getVanProgress,
  getVansList,
  getDealerOwnersList,
  getDealerDashboard,
  getComponentsList,
  setVanId,
  setOwnerId,
  setVanStep1Data,
  setVanStep2Data,
  setVanStep3Data,
  setVanStep4Data,
  setVanProgressData,
  resetVanState,
};
export default vanReducer;

