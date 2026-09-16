import ownerReducer, {
  setOwnersList,
  setOwnerDetails,
  resetOwnerDetails,
  resetOwnerState,
} from "../reducers/ownerReducer";
import {
  getOwnersList,
  getOwnerDetails,
  toggleBlockOwner,
} from "../actions/ownerAction";

export {
  getOwnersList,
  setOwnersList,
  getOwnerDetails,
  setOwnerDetails,
  resetOwnerDetails,
  resetOwnerState,
  toggleBlockOwner,
};
export default ownerReducer;


