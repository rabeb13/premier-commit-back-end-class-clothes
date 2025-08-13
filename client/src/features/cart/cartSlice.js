// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addToCartAPI = createAsyncThunk('cart/addToCartAPI', async (item) => {
  const res = await fetch('http://localhost:5901/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return res.json();
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  extraReducers: (builder) => {
    builder.addCase(addToCartAPI.fulfilled, (state, action) => {
      state.items = action.payload.items;
    });
  }
});

export const selectCartItems = (state) => state.cart.items;
export default cartSlice.reducer;
