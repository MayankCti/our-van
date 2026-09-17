import dealerReducer, {
  setDealersList,
  setDealerDetails,
  resetDealerDetails,
  resetDealerState,
} from "../reducers/dealerReducer";
import {
  getDealersList,
  getDealerDetails,
  toggleBlockDealer,
  createDealer,
} from "../actions/dealerAction";

export {
  getDealersList,
  setDealersList,
  getDealerDetails,
  setDealerDetails,
  resetDealerDetails,
  resetDealerState,
  toggleBlockDealer,
  createDealer,
};
export default dealerReducer;


