import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

export const cartSlice = createSlice ({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const isItemExist = state.value.find(item => item._id === action.payload._id);

            if (isItemExist) {
                isItemExist.quantity++;
            } else {
                state.value.push({ ...action.payload, quantity: 1 })
                console.log('new item added')
            }

            console.log('added to cart', action.payload)
        },

        removeFromCart: (state, action) => {
            const existingItem = state.value.find(item => item._id === action.payload._id);

            if (existingItem) {
                // If the item exists in the cart
                if (existingItem.quantity > 1) {
                    // Decrease the quantity by 1
                    existingItem.quantity--;
                } else {
                    // If the quantity is 1, remove the item from the cart
                    state.value = state.value.filter(item => item._id !== action.payload._id);
                }
            }

            console.log('removed from cart', action.payload);
        },

        deleteFromCart: (state, action) => {
            const filterCart = state.value.filter(
                (item) => item._id !== action.payload._id
            );
            state.value = filterCart;
        },

        resetCart: (state) => {
            state.value = [];
        }
    }
})

export const { addToCart, removeFromCart, deleteFromCart, resetCart} = cartSlice.actions
export default cartSlice.reducer