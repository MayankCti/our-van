import componentReducer, {
  setComponentsList,
  resetComponentState,
} from "../reducers/componentReducer";
import {
  getComponentsList,
  createComponent,
  editComponent,
  deleteComponent,
} from "../actions/componentAction";

export {
  getComponentsList,
  createComponent,
  editComponent,
  deleteComponent,
  setComponentsList,
  resetComponentState,
};
export default componentReducer;
