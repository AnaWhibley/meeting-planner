import { createSlice } from '@reduxjs/toolkit';
import { requesting } from '../../app/uiStateSlice';

export const slice = createSlice({
    name: 'counter',
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
        },
        incrementByAmount: (state, action) => {
            console.log(action);
            state.value += action.payload;
        },
        incrementByAmount2: (state) => {
            state.value += state.amount;
        },
    },
});

export const { increment, decrement, incrementByAmount, incrementByAmount2, setAmount} = slice.actions;

export const incrementAsync = (amount: number) => (dispatch: any) => {
    dispatch(requesting())
    setTimeout(() => {
        dispatch(incrementByAmount(amount));
    }, 3000);
};

export const selectCount = (state: any) => state.counter.value;
export const selectAmount = (state: any) => state.counter.amount;

export default slice.reducer;