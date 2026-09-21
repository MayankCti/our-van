import supplierReducer, {
  clearSupplierDetails,
  setSuppliersList,
} from "../reducers/supplierReducer";
import {
  getSuppliersByDealer,
  getSupplierById,
  toggleBlockSupplier,
  deleteSupplier,
} from "../actions/supplierAction";

export {
  getSuppliersByDealer,
  getSupplierById,
  toggleBlockSupplier,
  deleteSupplier,
  clearSupplierDetails,
  setSuppliersList,
};

export default supplierReducer;
