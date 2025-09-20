// src/JS/Services/api.js
const API_URL = process.env.REACT_APP_API_URL;

// ----------------- USERS -----------------
export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/user`);
  return await res.json();
};

// ----------------- AUTH -----------------
export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return await res.json();
};

// ----------------- PRODUCTS -----------------
export const fetchProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  return await res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  return await res.json();
};

// ----------------- CART -----------------
export const fetchCart = async () => {
  const res = await fetch(`${API_URL}/cart`);
  return await res.json();
};

// ----------------- ORDERS -----------------
export const fetchOrders = async () => {
  const res = await fetch(`${API_URL}/orders`);
  return await res.json();
};

export const fetchOrderById = async (id) => {
  const res = await fetch(`${API_URL}/orders/${id}`);
  return await res.json();
};

// ----------------- UPLOAD IMAGE -----------------
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};
