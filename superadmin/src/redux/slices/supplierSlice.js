import supplierReducer, {
  setSuppliersList,
  setSupplierDetails,
  resetSupplierDetails,
  resetSupplierState,
} from "../reducers/supplierReducer";
import {
  getSuppliersList,
  getSupplierDetails,
} from "../actions/supplierAction";

export {
  getSuppliersList,
  setSuppliersList,
  getSupplierDetails,
  setSupplierDetails,
  resetSupplierDetails,
  resetSupplierState,
};
export default supplierReducer;
