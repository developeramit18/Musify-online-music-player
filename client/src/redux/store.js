import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import songReducer from './slices/songSlice';


  export const store = configureStore({
    reducer: {
      user: userReducer,
      songs: songReducer
    },
  });
