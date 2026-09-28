import supplierReducer, {
  clearSupplierDetails,
  setSuppliersList,
} from "../reducers/supplierReducer";
import {
  getSuppliersByDealer,
  getSupplierById,
  toggleBlockSupplier,
  createSupplier,
  deleteSupplier,
} from "../actions/supplierAction";

export {
  getSuppliersByDealer,
  getSupplierById,
  toggleBlockSupplier,
  createSupplier,
  deleteSupplier,
  clearSupplierDetails,
  setSuppliersList,
};

export default supplierReducer;

