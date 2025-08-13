import axios from "axios";
import {
  FAIL_PRODUCT,
  GET_PRODUCT,
  LOAD_PRODUCT,
  SUCC_PRODUCT,
} from "../ActionsType/product";

axios.defaults.baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:5901";

const authHeader = () => ({
  headers: { authorization: localStorage.getItem("token") || "" },
});

// GET all products
export const getProducts = () => async (dispatch) => {
  dispatch({ type: LOAD_PRODUCT });
  try {
    const { data } = await axios.get("/api/products");

dispatch({ type: "SUCC_PRODUCT", payload: { listProducts: data } });

    // si le backend renvoie juste un tableau: dispatch({ type: SUCC_PRODUCT, payload: { listProducts: data } });
  } catch (error) {
    dispatch({ type: FAIL_PRODUCT, payload: error?.response?.data || error.message });
  }
};

// ADD product
export const addProduct = (newProduct) => async (dispatch) => {
  try {
    await axios.post("/api/product/addproduct", newProduct, authHeader());
    dispatch(getProducts());
  } catch (error) {
    dispatch({ type: FAIL_PRODUCT, payload: error?.response?.data || error.message });
  }
};

// DELETE product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/product/${id}`, authHeader());
    dispatch(getProducts());
  } catch (error) {
    dispatch({ type: FAIL_PRODUCT, payload: error?.response?.data || error.message });
  }
};

// EDIT product
export const editProduct = (id, newProduct) => async (dispatch) => {
  try {
    await axios.put(`/api/product/${id}`, newProduct, authHeader());
    dispatch(getProducts());
  } catch (error) {
    dispatch({ type: FAIL_PRODUCT, payload: error?.response?.data || error.message });
  }
};

// GET one product
export const getOneProduct = (id) => async (dispatch) => {
  dispatch({ type: LOAD_PRODUCT });
  try {
    const { data } = await axios.get(`/api/product/${id}`);
    // si le backend renvoie un objet produit simple, enveloppe-le pour respecter ton reducer:
    dispatch({ type: GET_PRODUCT, payload: { productToGet: data } });
  } catch (error) {
    dispatch({ type: FAIL_PRODUCT, payload: error?.response?.data || error.message });
  }
};
