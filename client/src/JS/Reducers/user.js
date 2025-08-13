import {
  LOAD_USER,
  SUCC_USER,
  FAIL_USER,
  CURRENT_USER,
  LOGOUT_USER,
  CLEAR_ERRORS,
  UPDATE_USER,      // ajoute ce type
} from '../ActionsType/user';

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuth: false,
  errors: [],
  load: false,
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {

    case LOAD_USER:
      return { ...state, load: true };

    case SUCC_USER:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        load: false,
        isAuth: true,
        user: payload.user,
        errors: [],
        token: payload.token,
      };

    case CURRENT_USER:
      return { ...state, user: payload, isAuth: true, load: false };

    case UPDATE_USER:   // nouvelle action pour update profil
      return {
        ...state,
        user: payload,
      };

    case FAIL_USER:
      return { ...state, errors: payload, load: false };

    case LOGOUT_USER:
      localStorage.removeItem("token");
      return { ...state, user: null, isAuth: false, token: null };

    case CLEAR_ERRORS:
      return { ...state, errors: [] };

    default:
      return state;
  }
};

export default userReducer;
