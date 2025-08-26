import {
  LOAD_USER,
  SUCC_USER,
  FAIL_USER,
  CURRENT_USER,
  LOGOUT_USER,
  CLEAR_ERRORS,
  UPDATE_USER,   // manquait ici
} from "../ActionsType/user";

import axios from "axios";

axios.defaults.baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:5901";

// Helper pour ajouter le token
const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// 🔐 REGISTER
export const register = (newUser) => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    const result = await axios.post("/api/user/register", newUser);
    localStorage.setItem("token", result.data.token);
    dispatch({ type: SUCC_USER, payload: result.data }); // { user, token }
  } catch (error) {
    dispatch({
      type: FAIL_USER,
      payload: error.response?.data?.errors || [{ msg: "Register failed" }],
    });
  }
};

// 🔐 LOGIN
export const login = (user) => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    const res = await axios.post("/api/user/login", user);
    localStorage.setItem("token", res.data.token);
    dispatch({ type: SUCC_USER, payload: res.data }); // { user, token }
  } catch (error) {
    dispatch({
      type: FAIL_USER,
      payload: error.response?.data?.errors || [{ msg: "Login failed" }],
    });
  }
};

// 🔍 CURRENT USER
export const current = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  dispatch({ type: LOAD_USER });
  try {
    const res = await axios.get("/api/user/current", authHeader());
    dispatch({ type: CURRENT_USER, payload: res.data }); // ⚡ backend renvoie req.user direct
  } catch (error) {
    dispatch({
      type: FAIL_USER,
      payload: error.response?.data || { msg: "Not authorized" },
    });
  }
};

// 🔄 UPDATE USER PROFILE
export const updateUser = (userData) => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    const res = await axios.put("/api/user/update", userData, authHeader());
    dispatch({ type: UPDATE_USER, payload: res.data.user }); // ⚡ reducer attend user
  } catch (error) {
    dispatch({
      type: FAIL_USER,
      payload: error.response?.data?.errors || [{ msg: "Update failed" }],
    });
  }
};

// 🔓 LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  return { type: LOGOUT_USER };
};

// ❌ CLEAR ERRORS
export const clearErrors = () => {
  return { type: CLEAR_ERRORS };
};
