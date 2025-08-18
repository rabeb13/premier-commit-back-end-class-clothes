import { CART_SET, CART_FAIL, CART_LOAD } from "../ActionsType/cart";

const init = { items: [], load: false, error: null };

export default function cartReducer(state = init, { type, payload }) {
  switch (type) {
    case CART_LOAD:
      return { ...state, load: true, error: null };

    case CART_SET:
      // payload = array d’items complets : productId, name, price, image, color, size, quantity
      return { ...state, load: false, items: payload || [] };

    case CART_FAIL:
      return { ...state, load: false, error: payload };

    default:
      return state;
  }
}
