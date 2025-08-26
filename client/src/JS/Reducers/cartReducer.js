import { CART_SET, CART_FAIL, CART_LOAD, CLEAR_CART } from "../ActionsType/cart";

const init = { items: [], load: false, error: null };

export default function cartReducer(state = init, { type, payload }) {
  switch (type) {
    case CART_LOAD:
      return { ...state, load: true, error: null };

    case CART_SET:
      return { ...state, load: false, items: payload || [] };

    case CART_FAIL:
      return { ...state, load: false, error: payload };

    case CLEAR_CART:
      localStorage.removeItem("cart");
      return { ...state, items: [] };

    default:
      return state;
  }
}
