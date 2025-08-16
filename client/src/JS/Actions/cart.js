import axios from "axios";
import { CART_SET, CART_FAIL, CART_LOAD } from "../ActionsType/cart";

axios.defaults.baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:5901";

export const fetchCart = () => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.get("/api/cart");
    dispatch({ type: CART_SET, payload: data.items || [] });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};


export const addToCart = ({ productId, color, size, quantity }) => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.post("/api/cart/add", {
       productId, 
       color, 
       size, 
       quantity });
    // data.items doit contenir la liste complète du panier
    dispatch({ type: CART_SET, payload: data.items || [] });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};


export const updateCartQty = (itemId, quantity) => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.patch(`/api/cart/update/${itemId}`, { quantity });
    dispatch({ type: CART_SET, payload: data.items || [] });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};

export const removeCartItem = (itemId) => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.delete(`/api/cart/remove/${itemId}`);
    dispatch({ type: CART_SET, payload: data.items || [] });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};
