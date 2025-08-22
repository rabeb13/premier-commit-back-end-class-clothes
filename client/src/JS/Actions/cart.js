import axios from "axios";
import { CART_SET, CART_FAIL, CART_LOAD, CLEAR_CART } from "../ActionsType/cart";

axios.defaults.baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:5901";

// Récupérer le panier
export const fetchCart = () => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.get("/api/cart");
    const items = (data.items || []).map(i => ({
      ...i,
      image: i.image || i.productId?.images?.[0]?.url || ""
    }));
    dispatch({ type: CART_SET, payload: items });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};

// Ajouter au panier
export const addToCart = ({ productId, color, size, quantity, image, name, price }) => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.post("/api/cart/add", { productId, color, size, quantity, image, name, price });
    const items = (data.items || []).map(i => ({
      ...i,
      image: i.image || i.productId?.images?.[0]?.url || ""
    }));
    dispatch({ type: CART_SET, payload: items });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};

// Mettre à jour quantité
export const updateCartQty = (itemId, quantity) => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.patch(`/api/cart/update/${itemId}`, { quantity });
    const items = (data.items || []).map(i => ({
      ...i,
      image: i.image || i.productId?.images?.[0]?.url || ""
    }));
    dispatch({ type: CART_SET, payload: items });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};

// Supprimer un article
export const removeCartItem = (itemId) => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.delete(`/api/cart/remove/${itemId}`);
    const items = (data.items || []).map(i => ({
      ...i,
      image: i.image || i.productId?.images?.[0]?.url || ""
    }));
    dispatch({ type: CART_SET, payload: items });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};

// Vider le panier
export const clearCart = () => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    await axios.delete("/api/cart/clear"); // À créer côté backend
    dispatch({ type: CART_SET, payload: [] });
    dispatch({ type: CLEAR_CART }); // si tu veux déclencher un type spécifique
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};
