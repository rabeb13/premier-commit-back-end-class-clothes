import axios from "axios";
import {
  FAIL_PRODUCT,
  GET_PRODUCT,
  LOAD_PRODUCT,
  SUCC_PRODUCT,
} from "../ActionsType/product";

axios.defaults.baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:5901";

// Helper pour auth
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
});

// ✅ GET all products
export const getProducts = () => async (dispatch) => {
  dispatch({ type: LOAD_PRODUCT });
  try {
    const { data } = await axios.get("/api/products");
    dispatch({ type: SUCC_PRODUCT, payload: { listProducts: data } });
  } catch (error) {
    dispatch({
      type: FAIL_PRODUCT,
      payload: error?.response?.data?.msg || error.message,
    });
  }
};

// ✅ ADD product (admin only)
export const addProduct = (newProduct) => async (dispatch) => {
  try {
    await axios.post("/api/products", newProduct, authHeader());
    dispatch(getProducts());
  } catch (error) {
    dispatch({
      type: FAIL_PRODUCT,
      payload: error?.response?.data?.msg || error.message,
    });
  }
};

// ✅ DELETE product (admin only)
export const deleteProduct = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/products/${id}`, authHeader());
    dispatch(getProducts());
  } catch (error) {
    dispatch({
      type: FAIL_PRODUCT,
      payload: error?.response?.data?.msg || error.message,
    });
  }
};

// ✅ EDIT product (admin only)
export const editProduct = (id, newProduct) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/products/${id}`, newProduct, authHeader());
    dispatch(getProducts());
    return res; // <-- important pour pouvoir utiliser .then() dans le component
  } catch (error) {
    dispatch({
      type: FAIL_PRODUCT,
      payload: error?.response?.data?.msg || error.message,
    });
    throw error; // <-- si tu veux gérer erreur avec .catch()
  }
};

// ✅ GET one product
export const getOneProduct = (id) => async (dispatch) => {
  dispatch({ type: LOAD_PRODUCT });
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({ type: GET_PRODUCT, payload: { productToGet: data } });
  } catch (error) {
    dispatch({
      type: FAIL_PRODUCT,
      payload: error?.response?.data?.msg || error.message,
    });
  }
};
