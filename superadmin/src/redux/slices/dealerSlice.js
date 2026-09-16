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
} from "../actions/dealerAction";

export {
  getDealersList,
  setDealersList,
  getDealerDetails,
  setDealerDetails,
  resetDealerDetails,
  resetDealerState,
  toggleBlockDealer,
};
export default dealerReducer;


