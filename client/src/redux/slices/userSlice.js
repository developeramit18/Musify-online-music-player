import { createSlice } from "@reduxjs/toolkit";
import { getStorageItem, setStorageItem } from "../../utility/utility";


const initialState = {
  user: getStorageItem("user") || null,
  loading: false,
  error: null,
  isLoggedIn: !!getStorageItem("user"),
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      setStorageItem("user", action.payload);
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.isLoggedIn = true;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.error = action.payload;
    },
    logout: (state) => {
      setStorageItem("user", null);
      state.error = null;
      state.user = null;
      state.isLoggedIn = false;
    }
  }
})

export const { signInStart, signInSuccess, signInFailure,signUpStart, signUpSuccess, signUpFailure, logout } = userSlice.actions;
export default userSlice.reducer;