import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'calendar',
    initialState: {
        value: 0,
        amount: 0,
    },
    reducers: {
        increment: state => {
            state.value += 1;
        },
        decrement: state => {
            state.value -= 1;
        },
        setAmount: (state, action) => {
            state.amount = action.payload;
        }
    },
});

export const { increment, decrement, setAmount} = slice.actions;

export default slice.reducer;