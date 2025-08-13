import {
  LOAD_PRODUCT,
  SUCC_PRODUCT,
  FAIL_PRODUCT,
  GET_PRODUCT,
} from "../ActionsType/product";

const initState = {
  listProducts: [],
  error: null,
  load: false,
  productToGet: {},
};

const productReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case LOAD_PRODUCT:
      return { ...state, load: true, error: null };

    case SUCC_PRODUCT:
      // si ton backend renvoie un tableau brut, remplace par: payload
      return { ...state, load: false, listProducts: payload.listProducts };

    case FAIL_PRODUCT:
      return { ...state, load: false, error: payload };

    case GET_PRODUCT:
      return { ...state, load: false, productToGet: payload.productToGet };

    default:
      return state;
  }
};

export default productReducer;
