import {
  LOAD_USER,
  SUCC_USER,
  FAIL_USER,
  CURRENT_USER,
  LOGOUT_USER,
  CLEAR_ERRORS,
} from '../ActionsType/user';

import axios from 'axios';

// 🔐 REGISTER
export const register = (newUser) => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    const result = await axios.post('/api/user/register', newUser);
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
    const res = await axios.post('/api/user/login', user);
    localStorage.setItem('token', res.data.token);

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
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await axios.get('/api/user/current', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: CURRENT_USER, payload: res.data.user });
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response.data });
  }
};


// 🔄 UPDATE USER PROFILE
export const updateUser = (userData) => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.put('/api/user/update', userData, config);
    dispatch({ type: SUCC_USER, payload: res.data }); // payload = { msg, user }
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
