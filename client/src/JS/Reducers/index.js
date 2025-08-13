import { combineReducers } from "redux";
import userReducer from "./user";
import productReducer from "./productReducer"; // Ton reducer produit
import cartReducer from "./cartReducer";       // Ton reducer panier

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer, // gère listProducts, load, error, productToGet
  cart: cartReducer,       // gère items, load, error
});

export default rootReducer;
