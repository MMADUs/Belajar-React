import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null
}

export const registerSlice = createSlice ({
    name: 'register',
    initialState,
    reducers: {
        saveRegister: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { saveRegister} = registerSlice.actions
export default registerSlice.reducer