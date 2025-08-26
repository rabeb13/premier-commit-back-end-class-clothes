import axios from "axios";
import { CART_SET, CART_FAIL, CART_LOAD, CLEAR_CART } from "../ActionsType/cart";

axios.defaults.baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:5901";

// ⚡ Helper pour injecter le token JWT
const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Normaliser le panier (toujours retourner un tableau d’items propres)
const normalizeItems = (data) => {
  const items = data?.items || data || [];
  return items.map((i) => ({
    ...i,
    image: i.image || i.productId?.images?.[0] || "",
    name: i.name || i.productId?.name || "Produit",
    price: i.price || i.productId?.price || 0,
  }));
};

// Récupérer le panier
export const fetchCart = () => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.get("/api/cart", authHeader());
    dispatch({ type: CART_SET, payload: normalizeItems(data) });
  } catch (error) {
    dispatch({
      type: CART_FAIL,
      payload: error?.response?.data || error.message,
    });
  }
};

// Ajouter au panier
export const addToCart =
  ({ productId, color, size, quantity, image, name, price }) =>
  async (dispatch) => {
    dispatch({ type: CART_LOAD });
    try {
      const { data } = await axios.post(
        "/api/cart/add",
        { productId, color, size, quantity, image, name, price },
        authHeader()
      );
      dispatch({ type: CART_SET, payload: normalizeItems(data) });
    } catch (error) {
      dispatch({
        type: CART_FAIL,
        payload: error?.response?.data || error.message,
      });
    }
  };

// Mettre à jour quantité
export const updateCartQty = (itemId, quantity) => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.patch(
      `/api/cart/update/${itemId}`,
      { quantity },
      authHeader()
    );
    dispatch({ type: CART_SET, payload: normalizeItems(data) });
  } catch (error) {
    dispatch({
      type: CART_FAIL,
      payload: error?.response?.data || error.message,
    });
  }
};

// Supprimer un article
export const removeCartItem = (itemId) => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    const { data } = await axios.delete(
      `/api/cart/remove/${itemId}`,
      authHeader()
    );
    dispatch({ type: CART_SET, payload: normalizeItems(data) });
  } catch (error) {
    dispatch({
      type: CART_FAIL,
      payload: error?.response?.data || error.message,
    });
  }
};

// Vider le panier (après commande ou logout)
export const clearCart = () => async (dispatch) => {
  dispatch({ type: CART_LOAD });
  try {
    await axios.delete("/api/cart/clear", authHeader());
    dispatch({ type: CART_SET, payload: [] });
    dispatch({ type: CLEAR_CART });
  } catch (error) {
    dispatch({
      type: CART_FAIL,
      payload: error?.response?.data || error.message,
    });
  }
};
