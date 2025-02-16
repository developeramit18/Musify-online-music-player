import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    songs: [],
    currentIndex: 0, 
};

const userSlice = createSlice({
    name: 'song',
    initialState,
    reducers: {
        addSongs: (state, action) => {
            state.songs = Array.isArray(action.payload[0]) ? action.payload[0] : action.payload;
            state.currentIndex = 0;
        },
        setCurrentIndex: (state, action) => {
            state.currentIndex = action.payload;
        },
    },
});

export const { addSongs, setCurrentIndex } = userSlice.actions;
export default userSlice.reducer;
