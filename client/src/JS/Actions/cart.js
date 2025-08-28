import axios from "axios";
import { CART_SET, CART_FAIL, CART_LOAD, CLEAR_CART } from "../ActionsType/cart";

axios.defaults.baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:5901";

// ---------- Helpers ----------
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

// Panier invité (localStorage)
const GKEY = "guestCart";
const getGuestCart = () => {
  try { return JSON.parse(localStorage.getItem(GKEY) || "[]"); }
  catch { return []; }
};
const setGuestCart = (items) => localStorage.setItem(GKEY, JSON.stringify(items));
const clearGuestCart = () => localStorage.removeItem(GKEY);

// normalisation commune (serveur ou invité)
const normalizeItems = (data) => {
  const items = data?.items || data || [];
  return items.map((i) => ({
    ...i,
    image: i.image || i.productId?.images?.[0] || "",
    name: i.name || i.productId?.name || "Produit",
    price: i.price || i.productId?.price || 0,
  }));
};

// Clé unique pour un item invité (sert d'_id local)
const guestKey = ({ productId, color, size }) => `${productId}__${color || "x"}__${size || "x"}`;

// ---------- Actions ----------

// Récupérer le panier
export const fetchCart = () => async (dispatch) => {
  const token = getToken();
  dispatch({ type: CART_LOAD });
  try {
    if (!token) {
      // invité → lire localStorage
      const items = normalizeItems(getGuestCart());
      return dispatch({ type: CART_SET, payload: items });
    }
    // connecté → API
    const { data } = await axios.get("/api/cart", authHeader());
    dispatch({ type: CART_SET, payload: normalizeItems(data) });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};

// Ajouter au panier (gère invité OU connecté)
export const addToCart =
  ({ productId, color, size, quantity, image, name, price }) =>
  async (dispatch) => {
    const token = getToken();
    dispatch({ type: CART_LOAD });
    try {
      if (!token) {
        // invité → merge dans localStorage
        let items = getGuestCart();
        const key = guestKey({ productId, color, size });
        const idx = items.findIndex((it) => it._id === key);
        if (idx >= 0) {
          items[idx].quantity = Number(items[idx].quantity || 0) + Number(quantity || 1);
        } else {
          items.push({
            _id: key, // ⚡ identifiant local
            productId, color, size,
            quantity: Number(quantity || 1),
            image, name, price,
          });
        }
        setGuestCart(items);
        return dispatch({ type: CART_SET, payload: normalizeItems(items) });
      }

      // connecté → API
      const { data } = await axios.post(
        "/api/cart/add",
        { productId, color, size, quantity, image, name, price },
        authHeader()
      );
      dispatch({ type: CART_SET, payload: normalizeItems(data) });
    } catch (error) {
      dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
    }
  };

// Mettre à jour quantité (gère invité OU connecté)
export const updateCartQty = (itemId, quantity) => async (dispatch) => {
  const token = getToken();
  dispatch({ type: CART_LOAD });
  try {
    if (!token) {
      // invité
      let items = getGuestCart();
      const idx = items.findIndex((it) => it._id === itemId);
      if (idx >= 0) {
        items[idx].quantity = Math.max(1, Number(quantity) || 1);
        setGuestCart(items);
      }
      return dispatch({ type: CART_SET, payload: normalizeItems(items) });
    }

    // connecté
    const { data } = await axios.patch(`/api/cart/update/${itemId}`, { quantity }, authHeader());
    dispatch({ type: CART_SET, payload: normalizeItems(data) });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};

// Supprimer un article (gère invité OU connecté)
export const removeCartItem = (itemId) => async (dispatch) => {
  const token = getToken();
  dispatch({ type: CART_LOAD });
  try {
    if (!token) {
      // invité
      const items = getGuestCart().filter((it) => it._id !== itemId);
      setGuestCart(items);
      return dispatch({ type: CART_SET, payload: normalizeItems(items) });
    }

    // connecté
    const { data } = await axios.delete(`/api/cart/remove/${itemId}`, authHeader());
    dispatch({ type: CART_SET, payload: normalizeItems(data) });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};

// Vider le panier (après commande ou logout)
export const clearCart = () => async (dispatch) => {
  const token = getToken();
  dispatch({ type: CART_LOAD });
  try {
    if (!token) {
      clearGuestCart();
      dispatch({ type: CART_SET, payload: [] });
      return dispatch({ type: CLEAR_CART });
    }
    await axios.delete("/api/cart/clear", authHeader());
    dispatch({ type: CART_SET, payload: [] });
    dispatch({ type: CLEAR_CART });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error?.response?.data || error.message });
  }
};

// 🔁 Fusionner le panier invité vers le panier serveur (à appeler juste après login/register)
export const mergeGuestCart = () => async (dispatch) => {
  const token = getToken();
  if (!token) return; // rien à faire si pas connecté
  const guest = getGuestCart();
  if (!guest.length) return;

  try {
    // On envoie chaque item invité vers /cart/add
    await Promise.all(
      guest.map((it) =>
        axios.post(
          "/api/cart/add",
          {
            productId: it.productId,
            color: it.color,
            size: it.size,
            quantity: it.quantity,
            image: it.image,
            name: it.name,
            price: it.price,
          },
          authHeader()
        )
      )
    );
    clearGuestCart();
    // récupérer le panier serveur final
    const { data } = await axios.get("/api/cart", authHeader());
    dispatch({ type: CART_SET, payload: normalizeItems(data) });
  } catch (error) {
    // on continue quand même, mais on log l’erreur
    console.error("mergeGuestCart error:", error?.response?.data || error.message);
  }
};
